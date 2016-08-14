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
    import IDataViewCategoricalReader = powerbi.data.IDataViewCategoricalReader;
    import ValueType = powerbi.ValueType;
    import PrimitiveType = powerbi.PrimitiveType;
    import DataViewTransform = powerbi.data.DataViewTransform;
    let createIDataViewCategoricalReader = powerbi.data.createIDataViewCategoricalReader;

    describe('DataViewCategoricalReader', () => {
        describe('Various nulls and undefined values', () => {
            let dataViewMetadataTwoColumn: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: "col1",
                        queryName: "col1",
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text),
                        roles: { Category: true },
                    },
                    {
                        displayName: "col2",
                        queryName: "col2",
                        isMeasure: true,
                        type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double),
                        roles: { Y: true },
                    }
                ],
            };
            let categoryColumnRef = powerbi.data.SQExprBuilder.fieldDef({ schema: "s", entity: "e", column: "col1" });

            it('Null', () => {
                let spy = spyOn(debug, 'assertValue');
                let reader = createIDataViewCategoricalReader(null);
                executeAllMethods(reader);
                expect(spy.calls.count()).toBe(1);
            });

            it('No categorical', () => {
                let reader = createIDataViewCategoricalReader({
                    metadata: dataViewMetadataTwoColumn,
                    categorical: undefined,
                });
                executeAllMethods(reader);
            });

            it('No metadata', () => {
                let reader = createIDataViewCategoricalReader({
                    metadata: undefined,
                    categorical: {
                        categories: [],
                        values: undefined
                    }
                });
                executeAllMethods(reader);
            });

            it('No categorical.values', () => {
                let reader = createIDataViewCategoricalReader({
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ["abc", "def"],
                            identity: [mocks.dataViewScopeIdentity("abc"), mocks.dataViewScopeIdentity("def")],
                            identityFields: [categoryColumnRef]
                        }],
                        values: undefined
                    }
                });
                executeAllMethods(reader);
            });

            it('Empty categorical.values', () => {
                let reader = createIDataViewCategoricalReader({
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ["abc", "def"],
                            identity: [mocks.dataViewScopeIdentity("abc"), mocks.dataViewScopeIdentity("def")],
                            identityFields: [categoryColumnRef]
                        }],
                        values: DataViewTransform.createValueColumns([])
                    }
                });
                executeAllMethods(reader);
            });

            it('No categories', () => {
                let reader = createIDataViewCategoricalReader({
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: undefined,
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataTwoColumn.columns[1],
                                min: 123,
                                max: 123,
                                subtotal: 123,
                                values: [123]
                            }
                        ])
                    }
                });
                executeAllMethods(reader);
            });

            it('No values', () => {
                let reader = createIDataViewCategoricalReader({
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ["abc", "def"],
                            identity: [mocks.dataViewScopeIdentity("abc"), mocks.dataViewScopeIdentity("def")],
                            identityFields: [categoryColumnRef]
                        }],
                        values: DataViewTransform.createValueColumns([])
                    }
                });
                executeAllMethods(reader);
            });

            it('No values.values', () => {
                let reader = createIDataViewCategoricalReader({
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: ["abc", "def"],
                            identity: [mocks.dataViewScopeIdentity("abc"), mocks.dataViewScopeIdentity("def")],
                            identityFields: [categoryColumnRef]
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataTwoColumn.columns[1],
                                values: []
                            }
                        ])
                    }
                });
                executeAllMethods(reader);
            });

            it('No categories.values', () => {
                let reader = createIDataViewCategoricalReader({
                    metadata: dataViewMetadataTwoColumn,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataTwoColumn.columns[0],
                            values: [],
                            identityFields: [categoryColumnRef],
                        }],
                        values: DataViewTransform.createValueColumns([
                            {
                                source: dataViewMetadataTwoColumn.columns[1],
                                values: []
                            }
                        ])
                    }
                });
                executeAllMethods(reader);
            });
        });
    });

    /**
     * Executes all functions on the DataViewCategoricalReader with minimal
     * data to ensure the reader doesn't throw exceptions with its DataView.
     *
     * The constructor is implicitly tested when you create the DataView; all
     * other methods are called here.
     */
    function executeAllMethods(reader: IDataViewCategoricalReader): void {
        // Category methods
        reader.hasCategories();
        reader.getCategoryCount();
        reader.getCategoryValues("");
        reader.getCategoryValue("", 0);
        reader.getCategoryColumn("");
        reader.getCategoryMetadataColumn("");
        reader.getCategoryColumnIdentityFields("");
        reader.getCategoryDisplayName("");
        reader.hasCompositeCategories();
        reader.hasCategoryWithRole("");
        reader.getCategoryObjects("", 0);
        
        // Value/measure methods
        reader.hasValues("");
        reader.hasHighlights("");
        reader.getValue("", 0);
        reader.getAllValuesForRole("", 0);
        reader.getFirstNonNullValueForCategory("", 0);
        reader.getMeasureQueryName("");
        reader.getValueColumn("");
        reader.getValueMetadataColumn("");
        reader.getAllValueMetadataColumnsForRole("", 0);
        reader.getValueDisplayName("");
        
        // Series methods
        reader.hasDynamicSeries();
        reader.getSeriesCount("");
        reader.getSeriesObjects(0);
        reader.getSeriesValueColumns();
        reader.getSeriesValueColumnGroup(0);
        reader.getSeriesMetadataColumn();
        reader.getSeriesColumnIdentityFields();
        reader.getSeriesName(0);
        reader.getSeriesDisplayName();
    }
}
