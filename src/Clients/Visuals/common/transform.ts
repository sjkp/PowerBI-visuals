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

module powerbi.visuals {
    export interface I2DTransformMatrix {
        m00: number;
        m01: number;
        m02: number;

        m10: number;
        m11: number;
        m12: number;
        // 3rd row not used so we don't declare it
    }

    /** Transformation matrix math wrapper */
    export class Transform {

        // Fields
        private _inverse: Transform;
        public matrix: I2DTransformMatrix;

        // Constructor
        constructor(m?: I2DTransformMatrix) {
            this.matrix = m || {
                m00: 1, m01: 0, m02: 0,
                m10: 0, m11: 1, m12: 0,
            };
        }

        // Methods
        public applyToPoint(point: IPoint): IPoint {
            if (!point) {
                return point;
            }
            let m = this.matrix;
            return {
                x: m.m00 * point.x + m.m01 * point.y + m.m02,
                y: m.m10 * point.x + m.m11 * point.y + m.m12,
            };
        }

        public applyToRect(rect: Rect): IRect {
            if (!rect) {
                return rect;
            }

            let x0 = rect.left;
            let y0 = rect.top;

            let m = this.matrix;
            let isScaled = m.m00 !== 1 || m.m11 !== 1;
            let isRotated = m.m01 !== 0 || m.m10 !== 0;
            if (!isRotated && !isScaled) {
                // Optimize for the translation only case
                return { left: x0 + m.m02, top: y0 + m.m12, width: rect.width, height: rect.height };
            }

            let x1 = rect.left + rect.width;
            let y1 = rect.top + rect.height;

            let minX: number;
            let maxX: number;
            let minY: number;
            let maxY: number;

            if (isRotated) {
                let p0x = m.m00 * x0 + m.m01 * y0 + m.m02;
                let p0y = m.m10 * x0 + m.m11 * y0 + m.m12;
                let p1x = m.m00 * x0 + m.m01 * y1 + m.m02;
                let p1y = m.m10 * x0 + m.m11 * y1 + m.m12;
                let p2x = m.m00 * x1 + m.m01 * y0 + m.m02;
                let p2y = m.m10 * x1 + m.m11 * y0 + m.m12;
                let p3x = m.m00 * x1 + m.m01 * y1 + m.m02;
                let p3y = m.m10 * x1 + m.m11 * y1 + m.m12;
                minX = Math.min(p0x, p1x, p2x, p3x);
                maxX = Math.max(p0x, p1x, p2x, p3x);
                minY = Math.min(p0y, p1y, p2y, p3y);
                maxY = Math.max(p0y, p1y, p2y, p3y);
            } else {
                let p0x = m.m00 * x0 + m.m02;
                let p0y = m.m11 * y0 + m.m12;
                let p3x = m.m00 * x1 + m.m02;
                let p3y = m.m11 * y1 + m.m12;
                minX = Math.min(p0x, p3x);
                maxX = Math.max(p0x, p3x);
                minY = Math.min(p0y, p3y);
                maxY = Math.max(p0y, p3y);
            }

            return { left: minX, top: minY, width: maxX - minX, height: maxY - minY };
        }

        public translate(xOffset: number, yOffset: number): void {
            if (xOffset !== 0 || yOffset !== 0) {
                let m = createTranslateMatrix(xOffset, yOffset);
                this.matrix = multiplyMatrices(this.matrix, m);
                this._inverse = null;
            }
        }

        public scale(xScale: number, yScale: number): void {
            if (xScale !== 1 || yScale !== 1) {
                let m = createScaleMatrix(xScale, yScale);
                this.matrix = multiplyMatrices(this.matrix, m);
                this._inverse = null;
            }
        }

        public rotate(angleInRadians: number): void {
            if (angleInRadians !== 0) {
                let m = createRotationMatrix(angleInRadians);
                this.matrix = multiplyMatrices(this.matrix, m);
                this._inverse = null;
            }
        }

        public add(other: Transform) {
            if (other) {
                this.matrix = multiplyMatrices(this.matrix, other.matrix);
                this._inverse = null;
            }
        }

        public getInverse(): Transform {
            if (!this._inverse) {
                this._inverse = new Transform(createInverseMatrix(this.matrix));
            }
            return this._inverse;
        }
    }

    export function createTranslateMatrix(xOffset: number, yOffset: number): I2DTransformMatrix {
        return {
            m00: 1, m01: 0, m02: xOffset,
            m10: 0, m11: 1, m12: yOffset,
        };
    }

    export function createScaleMatrix(xScale: number, yScale: number): I2DTransformMatrix {
        return {
            m00: xScale, m01: 0, m02: 0,
            m10: 0, m11: yScale, m12: 0
        };
    }

    export function createRotationMatrix(angleInRads: number): I2DTransformMatrix {
        let a = angleInRads;
        let sinA = Math.sin(a);
        let cosA = Math.cos(a);
        return {
            m00: cosA, m01: -sinA, m02: 0,
            m10: sinA, m11: cosA, m12: 0,
        };
    }

    export function createInverseMatrix(m: I2DTransformMatrix): I2DTransformMatrix {
        let determinant = m.m00 * m.m11 - m.m01 * m.m10;
        let invdet = 1 / determinant;
        return {
            m00: m.m11 * invdet,
            m01: - m.m01 * invdet,
            m02: (m.m01 * m.m12 - m.m02 * m.m11) * invdet,

            m10: -m.m10 * invdet,
            m11: m.m00 * invdet,
            m12: - (m.m00 * m.m12 - m.m10 * m.m02) * invdet
        };
    }

    function multiplyMatrices(a: I2DTransformMatrix, b: I2DTransformMatrix): I2DTransformMatrix {
        return {
            m00: a.m00 * b.m00 + a.m01 * b.m10,
            m01: a.m00 * b.m01 + a.m01 * b.m11,
            m02: a.m00 * b.m02 + a.m01 * b.m12 + a.m02,
            m10: a.m10 * b.m00 + a.m11 * b.m10,
            m11: a.m10 * b.m01 + a.m11 * b.m11,
            m12: a.m10 * b.m02 + a.m11 * b.m12 + a.m12,
        };
    }
}