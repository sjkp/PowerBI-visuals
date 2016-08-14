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
    import DataViewTransform = powerbi.data.DataViewTransform;

    export class SimpleDataByCountries 
        extends SampleDataViews
        implements ISampleDataViewsMethods {

        public name: string = "SimpleDataByCountries";
        public displayName: string = "Simple Data By Countries";

        public visuals: string[] = ["sankeyDiagram"];

        private minValue: number = 1;
        private maxValue: number = 120;

        private sampleData: number[] = [
            5, 1, 1, 1, 1, 5, 1, 1, 1,
            5, 1, 1, 1, 1, 5, 2, 1, 1
        ];

        public getDataViews(): DataView[] {
            let dataViewMetadata: DataViewMetadata = {
                columns: [{
                    displayName: "Source",
                    queryName: "Sankey.Source",
                    type: ValueType.fromDescriptor({
                        text: true
                    })
                }, {
                    displayName: "Destination",
                    queryName: "Sankey.Destination",
                    type: ValueType.fromDescriptor({
                        text: true
                    })
                }, {
                    displayName: "Value",
                    queryName: "Sum(Sankey.Value)"
                }]
            };

            return [{
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: [
                            "Brazil", "Brazil", "Brazil", "Brazil", "Canada", "Canada", 
                            "Canada", "Mexico", "Mexico", "Mexico", "Mexico", "USA", 
                            "USA", "USA", "USA", "Portugal", "Portugal", "Portugal"
                        ]
                    }, {
                        source: dataViewMetadata.columns[1],
                        values: [
                            "Portugal", "France", "Spain", "England", "Portugal", "France", 
                            "England", "Portugal", "France", "Spain", "England", "Portugal", 
                            "France", "Spain", "England", "Angola", "Senegal", "Morocco"
                        ]
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[2],
                        values: this.sampleData
                    }])
                }
            }];
        }

        public randomize(): void {
            let length: number = this.sampleData.length;

            this.sampleData = [];

            for (let i: number = 0; i < length; i++) {
                let value: number = this.getRandomValue(this.minValue, this.maxValue);

                this.sampleData.push(Math.round(value));
            }
        }
    }
}