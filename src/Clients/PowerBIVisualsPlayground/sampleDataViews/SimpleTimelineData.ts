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
    import ValueType = powerbi.ValueType;
    import PrimitiveType = powerbi.PrimitiveType;

    export class SimpleTimelineData extends SampleDataViews implements ISampleDataViewsMethods {

        public name: string = "SimpleTimelineData";
        public displayName: string = "Simple Timeline Data";
        public visuals: string[] = ["timeline"];

        public getDataViews(): DataView[] {
            var rows = [
                ['01.01.2014'],
                ['02.01.2014'],
                ['03.01.2014'],
                ['04.01.2014'],
                ['05.01.2014'],
                ['06.01.2014'],
                ['07.01.2014'],
                ['08.01.2014'],
                ['09.01.2014'],
                ['10.01.2014'],
                ['11.01.2014'],
                ['12.01.2014'],
                ['13.01.2014'],
                ['14.01.2014'],
                ['15.01.2014'],
                ['16.01.2014'],
                ['17.01.2014'],
                ['18.01.2014'],
                ['19.01.2014'],
                ['20.01.2014'],
                ['21.01.2014'],
                ['22.01.2014'],
                ['23.01.2014'],
                ['24.01.2014'],
                ['25.01.2014'],
                ['26.01.2014'],
                ['27.01.2014'],
                ['28.01.2014'],
                ['29.01.2014'],
                ['30.01.2014'],
                ['31.01.2014'],
                ['01.02.2014'],
                ['02.02.2014'],
                ['03.02.2014'],
                ['04.02.2014'],
                ['05.02.2014'],
                ['06.02.2014'],
                ['07.02.2014'],
                ['08.02.2014'],
                ['09.02.2014'],
                ['10.02.2014'],
                ['11.02.2014'],
                ['12.02.2014'],
                ['13.02.2014'],
                ['14.02.2014'],
                ['15.02.2014'],
                ['16.02.2014'],
                ['17.02.2014'],
                ['18.02.2014'],
                ['19.02.2014'],
                ['20.02.2014'],
                ['21.02.2014'],
                ['22.02.2014'],
                ['23.02.2014'],
                ['24.02.2014'],
                ['25.02.2014'],
                ['26.02.2014'],
                ['27.02.2014'],
                ['28.02.2014'],
                ['01.03.2014'],
                ['02.03.2014'],
                ['03.03.2014'],
                ['04.03.2014'],
                ['05.03.2014'],
                ['06.03.2014'],
                ['07.03.2014'],
                ['08.03.2014'],
                ['09.03.2014'],
                ['10.03.2014'],
                ['11.03.2014'],
                ['12.03.2014'],
                ['13.03.2014'],
                ['14.03.2014'],
                ['15.03.2014'],
                ['16.03.2014'],
                ['17.03.2014'],
                ['18.03.2014'],
                ['19.03.2014'],
                ['20.03.2014'],
                ['21.03.2014'],
                ['22.03.2014'],
                ['23.03.2014'],
                ['24.03.2014'],
                ['25.03.2014'],
                ['26.03.2014'],
                ['27.03.2014'],
                ['28.03.2014'],
                ['29.03.2014'],
                ['30.03.2014'],
                ['30.03.2017']
            ];
            var categoryValues = rows.map(function (value) {
                var arr = value[0].split('.');
                return (new Date(Number(arr[2]), Number(arr[1]) - 1, Number(arr[0]))); // months in JavaScript start with 0
            });
            var dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: 'Team',
                        queryName: 'Team',
                        type: powerbi.ValueType.fromDescriptor({ text: true })
                    },
                    {
                        displayName: 'Volume',
                        isMeasure: true,
                        queryName: 'volume1',
                        type: powerbi.ValueType.fromDescriptor({ numeric: true }),
                    },
                ]
            };
            var seriesIdentityField = powerbi.data.SQExprBuilder.fieldExpr({ column: { schema: 's', entity: 'e', name: 'series' } });
            var dataTypeString = ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text);
            var groupSource1: DataViewMetadataColumn = { displayName: 'group1', type: dataTypeString, index: 0 };

            return [{
                metadata: { columns: [groupSource1] },
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: categoryValues,
                        identityFields: [seriesIdentityField],
                        objects: [
                            {
                                dataPoint: {
                                    fill: {
                                        solid: {
                                            color: 'rgb(165, 172, 175)'
                                        }
                                    }
                                }
                            },
                            {
                                dataPoint: {
                                    fill: {
                                        solid: {
                                            color: 'rgb(175, 30, 44)'
                                        }
                                    }
                                }
                            },
                        ]
                    }],
                },
                table: {
                    columns: [groupSource1],
                    rows: [],
                }
            }];
        }
        public randomize(): void {
        }
    }
}