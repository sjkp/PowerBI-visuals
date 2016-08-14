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
    import SelectionId = powerbi.visuals.SelectionId;
    import SelectionIdBuilder = powerbi.extensibility.SelectionIdBuilder;

    describe("SelectionIdBuilder tests", () => {
        let categoryA = mocks.dataViewScopeIdentity("A");
        let categoryQueryName = "categoryA";
        let categoryColumn: powerbi.DataViewCategoryColumn = {
            source: {
                queryName: categoryQueryName,
                displayName: 'testDisplayName'
            },
            identity: [categoryA],
            values: []
        };
        let seriesa = mocks.dataViewScopeIdentity("a");
        let seriesQueryName = "seriesA";

        let seriesColumn: any = {
            source: {
                queryName: seriesQueryName,
                displayName: 'testSeriesDisplayName'
            }
        };

        let valueColumn: any = { identity: seriesa };

        let measure1 = "measure1";

        let idA = SelectionId.createWithId(categoryA);
        let ida = SelectionId.createWithId(seriesa);
        let id1 = SelectionId.createWithMeasure(measure1);
        let idAll = SelectionId.createWithIdsAndMeasure(categoryA, seriesa, measure1);

        it("SelectionIdBuilder -- empty", () => {
            let id = <SelectionId>new SelectionIdBuilder().createSelectionId();
            expect(id.getSelector()).toBeNull();
            expect(id.getSelectorsByColumn()).toEqual({});
            expect(id.getKey()).toEqual('{"selector":null,"highlight":false}');
        });

        it("SelectionIdBuilder -- withCategory", () => {
            let id = <SelectionId>new SelectionIdBuilder()
                .withCategory(categoryColumn, 0)
                .createSelectionId();

            expect(id.getSelector()).toEqual(idA.getSelector());
            expect(id.getSelectorsByColumn()).toEqual({ dataMap: { categoryA: idA.getSelector()['data'][0] } });

        });

        it("SelectionIdBuilder -- withSeries", () => {
            let id = <SelectionId>new SelectionIdBuilder()
                .withSeries(seriesColumn, valueColumn)
                .createSelectionId();

            expect(id.getSelector()).toEqual(ida.getSelector());
            expect(id.getSelectorsByColumn()).toEqual({ dataMap: { seriesA: ida.getSelector()['data'][0] } });
        });

        it("SelectionIdBuilder -- withMeasure", () => {
            let id = <SelectionId>new SelectionIdBuilder()
                .withMeasure(measure1)
                .createSelectionId();

            expect(id.getSelector()).toEqual(id1.getSelector());
            expect(id.getSelectorsByColumn()).toEqual({ metadata: id1.getSelector()['metadata'] });
        });

        it("SelectionIdBuilder -- category, series, and measure", () => {
            let id = <SelectionId>new SelectionIdBuilder()
                .withCategory(categoryColumn, 0)
                .withSeries(seriesColumn, valueColumn)
                .withMeasure(measure1)
                .createSelectionId();
            
            let allSelector = idAll.getSelector();
            expect(id.getSelector()).toEqual(allSelector);
            expect(id.getSelectorsByColumn()).toEqual({
                dataMap: {
                    categoryA: allSelector['data'][0],
                    seriesA: allSelector['data'][1]
                },
                metadata: allSelector['metadata']
            });

        });

    });
}
