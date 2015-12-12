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

module powerbi.visuals.sampleDataViews {
    import DataView = powerbi.DataView;
    import DataViewMetadata = powerbi.DataViewMetadata;
    import ValueType = powerbi.ValueType;
    import DataViewTransform = powerbi.data.DataViewTransform;

    export class SimpleDotPlotData
        extends SampleDataViews
        implements ISampleDataViewsMethods {

        public name: string = "SimpleDotPlotData";
        public displayName: string = "Simple DotPlot Data";

        public visuals: string[] = ["dotPlot"];

        private categoryValues = ['Betty', 'Mey', 'Nancy', 'Anna', 'Ben', 'David', 'Tim'];

        private sampleValues  = [4, 4, 2, 3, 5, 2, 2];

        private sampleValueMin = 0;
        private sampleValueMax = 10;

        public getDataViews(): DataView[] {

            let fieldExpr = powerbi.data.SQExprBuilder.fieldExpr({ column: { schema: 's', entity: "table1", name: "names" } });

            let categoryIdentities = this.categoryValues.map(function(value) {
                let expr = powerbi.data.SQExprBuilder.equal(fieldExpr, powerbi.data.SQExprBuilder.text(value));
                return powerbi.data.createDataViewScopeIdentity(expr);
            });

            let dataViewMetadata: DataViewMetadata = {
                    columns: [{
                        displayName: 'Name',
                        queryName: 'Name',
                        type: ValueType.fromDescriptor({
                            text: true
                        }),
                        roles: {
                            Category: true
                        }
                    },
                    {
                        displayName: 'Count',
                        queryName: 'Count',
                        type: powerbi.ValueType.fromDescriptor({ integer: true }),
                        roles: {
                            Series: true
                        }
                    }]
                },
                columns = [
                {
                    source: dataViewMetadata.columns[1],
                    values: this.sampleValues
                }
                ],
                dataValues: DataViewValueColumns = DataViewTransform.createValueColumns(columns);

            return [{
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: this.categoryValues,
                        identity: categoryIdentities
                    }],
                    values: dataValues
                }
            }];
        }

        public randomize(): void {
            this.sampleValues = this.sampleValues.map((item) => {
                return this.getRandomValue(this.sampleValueMin, this.sampleValueMax);
            });
        }
    }
}
