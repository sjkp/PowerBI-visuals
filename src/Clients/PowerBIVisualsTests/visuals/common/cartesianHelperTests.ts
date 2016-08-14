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
    import CartesianHelper = powerbi.visuals.CartesianHelper;
    import CartesianData = powerbi.visuals.CartesianData;
    import ValueType = powerbi.ValueType;
    import PrimitiveType = powerbi.PrimitiveType;

    describe("lookupXValue", () => {
        let data: CartesianData;
        let type: ValueType;

        beforeEach(() => {
            data = {
                categories: ['a'],
                series: [{
                    data: [{
                        categoryIndex: 0,
                        categoryValue: undefined,
                        value: 0,
                        seriesIndex: 0,
                    }]
                }],
                categoryMetadata: { displayName: 'col1' },
                hasHighlights: false,
            };
        });

        it('non-null datetime returns instance of Date', () => {
            data.series[0].data[0].categoryValue = 1357027200000;
            type = ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.DateTime);

            let lookupResult = CartesianHelper.lookupXValue(data, 0, type, false /*isScalar*/);
            expect(lookupResult instanceof Date).toBe(true);
            expect(lookupResult.getTime()).toBe(1357027200000);
        });

        it('null datetime returns null', () => {
            data.series[0].data[0].categoryValue = null;
            type = ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.DateTime);

            let lookupResult = CartesianHelper.lookupXValue(data, 0, type, false /*isScalar*/);
            expect(lookupResult).toBe(null);
        });

        describe('scalar axis', () => {
            it('numeric', () => {
                type = ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double);

                let lookupResult = CartesianHelper.lookupXValue(data, 5, type, true /*isScalar*/);
                expect(lookupResult).toBe(5);
            });

            it('datetime', () => {
                type = ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.DateTime);
                let dateMilliseconds = new Date('1/4/1989').getTime();

                let lookupResult = CartesianHelper.lookupXValue(data, dateMilliseconds, type, true /*isScalar*/);
                expect(lookupResult instanceof Date).toBe(true);
                expect(lookupResult.getTime()).toBe(dateMilliseconds);
            });

            it('text', () => {
                type = ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text);

                let lookupResult = CartesianHelper.lookupXValue(data, 0, type, false /*isScalar*/);
                expect(lookupResult).toBe('a');
            });
        });
    });
} 
