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
    import QueryProjectionCollection = powerbi.data.QueryProjectionCollection;
    import QueryProjectionsByRole = powerbi.data.QueryProjectionsByRole;

    describe('QueryProjectionCollectionTests', () => {
        it('replaceQueryRef - empty QueryProjection', () => {
            // arrange...
            let queryProjection = new QueryProjectionCollection([]);

            // act...
            queryProjection.replaceQueryRef('Sum(Order Details.UnitPrice)', 'Sum(Order Details.UnitPrice)1');

            // assert...
            // expecting no-op
            expect(queryProjection.all()).toEqual([]);
        });

        it('replaceQueryRef - non-empty QueryProjection, 0 matching item', () => {
            // arrange...
            let queryProjection = new QueryProjectionCollection(
                [{ queryRef: 'Sum(Order Details.Quantity)' }],
                []
            );

            // act...
            queryProjection.replaceQueryRef('Sum(Order Details.UnitPrice)', 'Sum(Order Details.UnitPrice)1');

            // assert...
            // expecting no-op
            expect(queryProjection.all()).toEqual([
                { queryRef: 'Sum(Order Details.Quantity)' },
            ]);
        });

        it('replaceQueryRef - non-empty QueryProjection, 1 matching item', () => {
            // arrange...
            let queryProjection = new QueryProjectionCollection(
                [
                    { queryRef: 'Sum(Order Details.Quantity)' },
                    { queryRef: 'Sum(Order Details.UnitPrice)', format: '\\$#,0.###############;(\\$#,0.###############);\\$#,0.###############' },
                ],
                []
            );

            // act...
            queryProjection.replaceQueryRef('Sum(Order Details.UnitPrice)', 'Sum(Order Details.UnitPrice)1');

            // assert...
            // expecting replacement
            expect(queryProjection.all()).toEqual([
                { queryRef: 'Sum(Order Details.Quantity)' },
                { queryRef: 'Sum(Order Details.UnitPrice)1', format: '\\$#,0.###############;(\\$#,0.###############);\\$#,0.###############' },
            ]);
        });

        it('replaceQueryRef - non-empty QueryProjection, 2 matching items', () => {
            // arrange...
            let queryProjection = new QueryProjectionCollection([
                { queryRef: 'Sum(Order Details.Quantity)' },
                { queryRef: 'Sum(Order Details.UnitPrice)', format: '\\$#,0.###############;(\\$#,0.###############);\\$#,0.###############' },
                { queryRef: 'Sum(Order Details.UnitPrice)', format: '\\$#,0.###############;(\\$#,0.###############);\\$#,0.###############' },
            ]);

            // act...
            queryProjection.replaceQueryRef('Sum(Order Details.UnitPrice)', 'Sum(Order Details.UnitPrice)1');

            // assert...
            // expecting replacements
            expect(queryProjection.all()).toEqual([
                { queryRef: 'Sum(Order Details.Quantity)' },
                { queryRef: 'Sum(Order Details.UnitPrice)1', format: '\\$#,0.###############;(\\$#,0.###############);\\$#,0.###############' },
                { queryRef: 'Sum(Order Details.UnitPrice)1', format: '\\$#,0.###############;(\\$#,0.###############);\\$#,0.###############' },
            ]);
        });

        it('clone - no property left behind', () => {
            // arrange...
            let createInput: () => QueryProjectionCollection = () => {
                return new QueryProjectionCollection(
                    [
                        { queryRef: 'Order.ShipCountry' },
                        { queryRef: 'Order.ShipRegion' },
                        { queryRef: 'Order.ShipCity' },
                    ],
                    [
                        'Order.ShipCountry',
                    ],
                    true
                );
            };
            let originalInput = createInput();

            // act...
            let clone = originalInput.clone();

            // assert...
            expect(originalInput).toEqual(createInput(), 'The originalInput should not get modified as a result of invoking clone().');
            expect(clone).toEqual(createInput(), 'The clone should have all the properties in the originalInput.');
        });

        it('clone - modifying items array', () => {
            // arrange...
            let createInput: () => QueryProjectionCollection = () => {
                return new QueryProjectionCollection([
                    { queryRef: 'Sum(Order Details.Quantity)' },
                    { queryRef: 'Sum(Order Details.UnitPrice)', format: '\\$#,0.###############;(\\$#,0.###############);\\$#,0.###############' },
                ]);
            };
            let originalInput = createInput();

            // act...
            let clone = originalInput.clone();
            clone.all().push({ queryRef: 'Sum(Order Details.Discount)' });

            // assert...
            expect(clone.all().length).toBe(3, 'Making sure that the array in the clone got modified.');
            expect(originalInput).toEqual(createInput(), 'The originalInput should not get modified as a result of modifying the clone.');
        });

        it('clone - modifying items array elements', () => {
            // arrange...
            let createInput: () => QueryProjectionCollection = () => {
                return new QueryProjectionCollection([
                    { queryRef: 'Sum(Order Details.Quantity)' },
                    { queryRef: 'Sum(Order Details.UnitPrice)', format: '\\$#,0.###############;(\\$#,0.###############);\\$#,0.###############' },
                ]);
            };
            let originalInput = createInput();

            // act...
            let clone = originalInput.clone();
            clone.all()[0].queryRef = 'Sum(Order Details.Discount)'; // modifies the property of an element in the array, to verify the deepness of clone()

            // assert...
            expect(clone.all()[0]).toEqual({ queryRef: 'Sum(Order Details.Discount)' }, 'Making sure that the array element in the clone got modified.');
            expect(originalInput).toEqual(createInput(), 'The originalInput should not get modified as a result of modifying the clone.');
        });

        it('clone - modifying items array elements via replaceQueryRef()', () => {
            // arrange...
            let createInput: () => QueryProjectionCollection = () => {
                return new QueryProjectionCollection([
                    { queryRef: 'Sum(Order Details.Quantity)' },
                    { queryRef: 'Sum(Order Details.UnitPrice)', format: '\\$#,0.###############;(\\$#,0.###############);\\$#,0.###############' },
                ]);
            };
            let originalInput = createInput();

            // act...
            let clone = originalInput.clone();
            clone.replaceQueryRef('Sum(Order Details.UnitPrice)', 'Sum(Order Details.Discount)');

            // assert...
            expect(clone.all()[1].queryRef).toEqual('Sum(Order Details.Discount)', 'Making sure that the array element in the clone got modified.');
            expect(originalInput).toEqual(createInput(), 'The originalInput should not get modified as a result of modifying the clone.');
        });

        it('clone - modifying _activeProjectionRefs array', () => {
            // arrange...
            let createInput: () => QueryProjectionCollection = () => {
                return new QueryProjectionCollection(
                    [
                        { queryRef: 'Order.ShipCountry' },
                        { queryRef: 'Order.ShipRegion' },
                        { queryRef: 'Order.ShipCity' },
                    ],
                    [
                        'Order.ShipCountry',
                    ]
                );
            };
            let originalInput = createInput();

            // act...
            let clone = originalInput.clone();
            clone.addActiveQueryReference('Order.ShipRegion');

            // assert...
            expect(clone.activeProjectionRefs).toEqual(['Order.ShipCountry', 'Order.ShipRegion'], 'Making sure that the array element in the clone got modified.');
            expect(originalInput).toEqual(createInput(), 'The originalInput should not get modified as a result of modifying the clone.');
        });

        it('clone - modifying _showAll value', () => {
            // arrange...
            let createInput: () => QueryProjectionCollection = () => {
                return new QueryProjectionCollection(
                    [
                        { queryRef: 'Order.ShipCountry' },
                        { queryRef: 'Order.ShipRegion' },
                        { queryRef: 'Order.ShipCity' },
                    ],
                    [
                        'Order.ShipCountry',
                    ],
                    true
                );
            };
            let originalInput = createInput();

            // act...
            let clone = originalInput.clone();
            clone.showAll = false;

            // assert...
            expect(clone.showAll).toEqual(false, 'Making sure that the property in the clone got modified.');
            expect(originalInput).toEqual(createInput(), 'The originalInput should not get modified as a result of modifying the clone.');
        });
    });

    describe('QueryProjectionsByRoleTests', () => {
        it('clone  - no property left behind', () => {
            // arrange...
            let createInput: () => QueryProjectionsByRole = () => {
                return {
                    'Category': new QueryProjectionCollection(
                        [
                            { queryRef: 'Order.ShipCountry' },
                            { queryRef: 'Order.ShipRegion' },
                            { queryRef: 'Order.ShipCity' },
                        ],
                        [
                            'Order.ShipCountry',
                        ]
                    ),
                    'Y': new QueryProjectionCollection(
                        [
                            { queryRef: 'Sum(Order Details.UnitPrice)', format: '\\$#,0.###############;(\\$#,0.###############);\\$#,0.###############' },
                        ]
                    ),
                };
            };
            let originalInput = createInput();

            // act...
            let clone = QueryProjectionsByRole.clone(originalInput);

            // assert...
            expect(originalInput).toEqual(createInput(), 'The originalInput should not get modified as a result of invoking clone().');
            expect(clone).toEqual(createInput(), 'The clone should have all the properties in the originalInput.');
        });

        // Note: the validation on QueryProjectionsByRole.clone() is pretty basic because most of the logic is tested in 'QueryProjectionCollectionTests'
        it('clone  - modifying properties for a role', () => {
            // arrange...
            let createInput: () => QueryProjectionsByRole = () => {
                return {
                    'Category': new QueryProjectionCollection(
                        [
                            { queryRef: 'Order.ShipCountry' },
                            { queryRef: 'Order.ShipRegion' },
                            { queryRef: 'Order.ShipCity' },
                        ],
                        [
                            'Order.ShipCountry',
                        ]
                    ),
                    'Y': new QueryProjectionCollection(
                        [
                            { queryRef: 'Sum(Order Details.UnitPrice)', format: '\\$#,0.###############;(\\$#,0.###############);\\$#,0.###############' },
                        ]
                    ),
                };
            };
            let originalInput = createInput();

            // act...
            let clone = QueryProjectionsByRole.clone(originalInput);
            clone['Y'].replaceQueryRef('Sum(Order Details.UnitPrice)', 'Sum(Order Details.Discount)');

            // assert...
            expect(clone['Y'].all()[0].queryRef).toEqual('Sum(Order Details.Discount)', 'Making sure that the property in the clone got modified.');
            expect(originalInput).toEqual(createInput(), 'The originalInput should not get modified as a result of modifying the clone.');
        });
    });
}