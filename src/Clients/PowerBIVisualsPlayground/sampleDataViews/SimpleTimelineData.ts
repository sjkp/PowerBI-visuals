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
                ['02.01.14'],
                ['03.01.14'],
                ['04.01.14'],
                ['05.01.14'],
                ['06.01.14'],
                ['07.01.14'],
                ['08.01.14'],
                ['09.01.14'],
                ['10.01.14'],
                ['11.01.14'],
                ['12.01.14'],
                ['13.01.14'],
                ['14.01.14'],
                ['15.01.14'],
                ['16.01.14'],
                ['17.01.14'],
                ['18.01.14'],
                ['19.01.14'],
                ['20.01.14'],
                ['21.01.14'],
                ['22.01.14'],
                ['23.01.14'],
                ['24.01.14'],
                ['25.01.14'],
                ['26.01.14'],
                ['27.01.14'],
                ['28.01.14'],
                ['29.01.14'],
                ['30.01.14'],
                ['31.01.14'],
                ['01.02.14'],
                ['02.02.14'],
                ['03.02.14'],
                ['04.02.14'],
                ['05.02.14'],
                ['06.02.14'],
                ['07.02.14'],
                ['08.02.14'],
                ['09.02.14'],
                ['10.02.14'],
                ['11.02.14'],
                ['12.02.14'],
                ['13.02.14'],
                ['14.02.14'],
                ['15.02.14'],
                ['16.02.14'],
                ['17.02.14'],
                ['18.02.14'],
                ['19.02.14'],
                ['20.02.14'],
                ['21.02.14'],
                ['22.02.14'],
                ['23.02.14'],
                ['24.02.14'],
                ['25.02.14'],
                ['26.02.14'],
                ['27.02.14'],
                ['28.02.14'],
                ['01.03.14'],
                ['02.03.14'],
                ['03.03.14'],
                ['04.03.14'],
                ['05.03.14'],
                ['06.03.14'],
                ['07.03.14'],
                ['08.03.14'],
                ['09.03.14'],
                ['10.03.14'],
                ['11.03.14'],
                ['12.03.14'],
                ['13.03.14'],
                ['14.03.14'],
                ['15.03.14'],
                ['16.03.14'],
                ['17.03.14'],
                ['18.03.14'],
                ['19.03.14'],
                ['20.03.14'],
                ['21.03.14'],
                ['22.03.14'],
                ['23.03.14'],
                ['24.03.14'],
                ['25.03.14'],
                ['26.03.14'],
                ['27.03.14'],
                ['28.03.14'],
                ['29.03.14'],
                ['30.03.14'],
            ];
            var categoryValues = rows.map(function(value) {
                var arr = value[0].split('.');
                return (new Date(Number(arr[2]), Number(arr[1]), Number(arr[0])));
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