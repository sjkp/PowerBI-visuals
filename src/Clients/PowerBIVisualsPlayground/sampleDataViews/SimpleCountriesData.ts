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
    export class SimpleCountriesData 
        extends SampleDataViews
        implements ISampleDataViewsMethods {

        private quantityAngles: number = 0;

        public name: string = "SimpleCountriesData";
        public displayName: string = "Simple Countries Data";

        public visuals: string[] = ["wordCloud"];

        public countries: string[] = [
            "Afghanistan",
            "Albania",
            "Algeria",
            "Andorra",
            "Angola",
            "Antigua and Barbuda",
            "Argentina",
            "Armenia",
            "Aruba",
            "Australia",
            "Austria",
            "Azerbaijan",
            "Gabon",
            "Georgia",
            "Germany",
            "Ghana",
            "Greece",
            "Grenada",
            "Guatemala",
            "Guinea",
            "Guinea-Bissau",
            "Guyana",
            "Haiti",
            "Holy See",
            "Honduras",
            "Hong Kong",
            "Hungary",
            "Iceland",
            "India",
            "Indonesia",
            "Iran",
            "Iraq",
            "Ireland",
            "Israel",
            "Italy",
            "Macau",
            "Macedonia",
            "Madagascar",
            "Malawi",
            "Malaysia",
            "Maldives",
            "Mali",
            "Malta",
            "Marshall Islands",
            "Mauritania",
            "Mauritius",
            "Mexico",
            "Micronesia",
            "Moldova",
            "Monaco",
            "Monaco",
            "Monaco",
            "Monaco",
            "Monaco",
            "Monaco",
            "Monaco",
            "Mongolia",
            "Montenegro",
            "Morocco",
            "Mozambique",
            "United Kingdom",
            "United Kingdom",
            "United Kingdom",
            "The USA",,
            "The USA",
            "The USA",
            "The USA",
            "Uganda",
            "Ukraine",
            "United Arab Emirates",
            "Uruguay",
            "Uzbekistan",
            "Romania",
            "Russia",
            "Rwanda",
            "Saint Kitts and Nevis",
            "Saint Lucia",
            "Saint Vincent and the Grenadines",
            "Samoa ",
            "San Marino",
            "Papua New Guinea",
            "Fiji",
            "Finland",
            "France",
            "France"
        ];
    
        private fieldExpr: data.SQExpr = powerbi.data.SQExprBuilder.fieldExpr({
            column: {
                schema: "s",
                entity: "table1",
                name: "country"
            }
        });

        public getDataViews(): DataView[] {
            let categoryIdentities = this.countries.map((item: string) => {
                    let expr: data.SQCompareExpr = powerbi.data.SQExprBuilder.equal(this.fieldExpr, powerbi.data.SQExprBuilder.text(item));

                    return powerbi.data.createDataViewScopeIdentity(expr);
                }),
                dataViewMetadata: powerbi.DataViewMetadata = {
                    columns: [{
                        displayName: "Country",
                        queryName: "Country",
                        type: powerbi.ValueType.fromDescriptor({ text: true }),
                        roles: { "Category": true }
                    }],
                    objects: {
                        rotateText: {
                            show: true,
                            quantityAngles: this.quantityAngles
                        }
                    }
                };

            return [{
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: this.countries,
                        identity: categoryIdentities
                    }],
                },
                table: {
                    columns: [dataViewMetadata.columns[0]],
                    rows: this.countries.map((item: string) => {
                        return [item];
                    })
                }
            }];
        }

        public randomize(): void {
            this.quantityAngles = Math.floor(this.getRandomValue(0, 10));
        }
    }
}