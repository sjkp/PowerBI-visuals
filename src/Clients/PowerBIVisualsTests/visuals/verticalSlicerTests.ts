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

module powerbitests {
    import DataViewTransform = powerbi.data.DataViewTransform;
    import SelectionIdBuilder = powerbi.visuals.SelectionIdBuilder;
    import SlicerOrientation = powerbi.visuals.slicerOrientation.Orientation;

    powerbitests.mocks.setLocale();

    describe("VerticalSlicer", () => {
        let builder: slicerHelper.TestBuilder;
        let longSlicerItems = ["First Slicer Long Name for testing",
            "Second Slicer Long Name for testing",
            "Third Slicer Long Name for testing"];
        let dataViewMetadataWithLongName = slicerHelper.buildDataViewMetadataWithLongName();

        beforeEach(() => {
            builder = new slicerHelper.TestBuilder(SlicerOrientation.Vertical);
        });

        afterEach(() => {
            builder.destroy();
        });

        describe("DOM tests", () => {
            it("DOM Validation - Text Slicer", () => {
                spyOn(powerbi.visuals.valueFormatter, "format").and.callThrough();

                helpers.fireOnDataChanged(builder.visual, builder.interactiveDataViewOptions);
                expect($(".slicerContainer")).toBeInDOM();
                expect($(".slicerContainer .headerText")).toBeInDOM();
                expect($(".slicerContainer .slicerHeader .clear")).toBeInDOM();
                expect($(".slicerContainer .slicerBody")).toBeInDOM();
                expect($(".slicerContainer .slicerBody .row .slicerText")).toBeInDOM();
                expect($(".slicerContainer .slicerBody .row .slicerCountText")).toBeInDOM();
                expect($(slicerHelper.slicerTextClassSelector).length).toBe(6);
                expect($(slicerHelper.slicerTextClassSelector).first().text()).toBe(slicerHelper.SelectAllTextKey);
                expect($(slicerHelper.slicerTextClassSelector).first().attr('title')).toBe(slicerHelper.SelectAllTextKey);
                expect($(slicerHelper.slicerTextClassSelector).last().text()).toBe("Banana");
                expect($(slicerHelper.slicerTextClassSelector).last().attr('title')).toBe("Banana");

                expect($(slicerHelper.slicerCountTextClassSelector).length).toBe(4);
                expect($(slicerHelper.slicerCountTextClassSelector)[0].textContent).toBe('3');
                expect($(slicerHelper.slicerCountTextClassSelector)[1].textContent).toBe('4');
                expect($(slicerHelper.slicerCountTextClassSelector)[2].textContent).toBe('5');
                expect($(slicerHelper.slicerCountTextClassSelector)[3].textContent).toBe('6');

                expect(powerbi.visuals.valueFormatter.format).toHaveBeenCalledWith("Apple", undefined);
                expect(powerbi.visuals.valueFormatter.format).toHaveBeenCalledWith("Orange", undefined);
                expect(powerbi.visuals.valueFormatter.format).toHaveBeenCalledWith("Kiwi", undefined);
                expect(powerbi.visuals.valueFormatter.format).toHaveBeenCalledWith("Grapes", undefined);
                expect(powerbi.visuals.valueFormatter.format).toHaveBeenCalledWith("Banana", undefined);

                // Subsequent update              
                let dataView2: powerbi.DataView = {
                    metadata: builder.dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: builder.dataViewMetadata.columns[0],
                            values: ["Strawberry", "Blueberry", "Blackberry"],
                            identity: [
                                mocks.dataViewScopeIdentityWithEquality(builder.field, "Strawberry"),
                                mocks.dataViewScopeIdentityWithEquality(builder.field, "Blueberry"),
                                mocks.dataViewScopeIdentityWithEquality(builder.field, "Blackberry")
                            ],
                            identityFields: [builder.field],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: builder.dataViewMetadata.columns[1],
                            values: [40, 25, 22]
                        }])
                    }
                };
                dataView2.metadata.objects = slicerHelper.buildDefaultDataViewObjects();

                helpers.fireOnDataChanged(builder.visual, { dataViews: [dataView2] });

                expect($(".slicerContainer")).toBeInDOM();
                expect($(".slicerContainer .headerText")).toBeInDOM();
                expect($(".slicerContainer .slicerHeader .clear")).toBeInDOM();
                expect($(".slicerContainer .slicerBody")).toBeInDOM();
                expect($(".slicerContainer .slicerBody .row .slicerText")).toBeInDOM();

                expect($(slicerHelper.slicerTextClassSelector).length).toBe(4);
                expect($(slicerHelper.slicerTextClassSelector).first().text()).toBe(slicerHelper.SelectAllTextKey);
                expect($(slicerHelper.slicerTextClassSelector).first().attr('title')).toBe(slicerHelper.SelectAllTextKey);
                expect($(slicerHelper.slicerTextClassSelector).last().text()).toBe("Blackberry");
                expect($(slicerHelper.slicerTextClassSelector).last().attr('title')).toBe("Blackberry");
                expect($(slicerHelper.slicerCountTextClassSelector).length).toBe(3);
                expect($(slicerHelper.slicerCountTextClassSelector)[0].textContent).toBe('40');
                expect($(slicerHelper.slicerCountTextClassSelector)[1].textContent).toBe('25');
                expect($(slicerHelper.slicerCountTextClassSelector)[2].textContent).toBe('22');
            });

            it("DOM Validation - Tooltip of Long Text", () => {
                let dataView2: powerbi.DataView = {
                    metadata: dataViewMetadataWithLongName,
                    categorical: {
                        categories: [{
                            source: dataViewMetadataWithLongName.columns[0],
                            values: longSlicerItems,
                            identity: [
                                mocks.dataViewScopeIdentityWithEquality(builder.field, "First"),
                                mocks.dataViewScopeIdentityWithEquality(builder.field, "Second"),
                                mocks.dataViewScopeIdentityWithEquality(builder.field, "Third")
                            ],
                            identityFields: [builder.field],
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: builder.dataViewMetadata.columns[1],
                            values: [40, 25, 22]
                        }])
                    }
                };

                builder.dataViewCategorical = slicerHelper.buildDefaultDataViewCategorical(builder.field);

                helpers.fireOnDataChanged(builder.visual, { dataViews: [dataView2] });

                //Test Slicer header tooltip
                expect($(slicerHelper.slicerTitleHeaderClassSelector)[0].title).toBe(dataView2.metadata.columns[0].displayName);

                //Test Slicer Items tooltip
                for (let i = 0; i < dataView2.categorical.categories[0].values.length; i++) {
                    expect($(slicerHelper.slicerTextClassSelector)[i].title).toBe(dataView2.categorical.categories[0].values[i]);
                    expect($(slicerHelper.slicerCountTextClassSelector)[i].textContent).toBe(dataView2.categorical.values[0].values[i].toString());
                }
            });

            it("DOM Validation - Image Slicer", () => {
                spyOn(powerbi.visuals.valueFormatter, "format").and.callThrough();

                helpers.fireOnDataChanged(builder.visual, builder.interactiveImageDataViewOptions);

                expect($(".slicerContainer")).toBeInDOM();
                expect($(".slicerContainer .headerText")).toBeInDOM();
                expect($(".slicerContainer .slicerHeader .clear")).toBeInDOM();
                expect($(".slicerContainer .slicerBody")).toBeInDOM();
                expect($(".slicerContainer .slicerBody .row img")).toBeInDOM();
                expect($(".slicerContainer .slicerBody .row img").length).toBe(5);
                expect($(".slicerContainer .slicerBody .row img").last().attr('src')).toBe("http://dummyimage.com/600x400/000/fff&text=5.png");
            });

            it("Validate converter", () => {
                let category = builder.dataView.categorical.categories[0];
                let dataPoints: powerbi.visuals.SlicerDataPoint[] = [
                    {
                        value: slicerHelper.SelectAllTextKey,
                        tooltip: slicerHelper.SelectAllTextKey,
                        identity: SelectionIdBuilder.builder().withMeasure(slicerHelper.SelectAllTextKey).createSelectionId(),
                        selected: false,
                        isSelectAllDataPoint: true,
                        count: undefined,
                    },
                    {
                        value: "Apple",
                        tooltip: "Apple",
                        identity: SelectionIdBuilder.builder().withCategory(category, 0).createSelectionId(),
                        selected: false,
                        count: undefined,
                        isImage: false,
                    },
                    {
                        value: "Orange",
                        tooltip: "Orange",
                        identity: SelectionIdBuilder.builder().withCategory(category, 1).createSelectionId(),
                        selected: false,
                        count: 3,
                        isImage: false,
                    },
                    {
                        value: "Kiwi",
                        tooltip: "Kiwi",
                        identity: SelectionIdBuilder.builder().withCategory(category, 2).createSelectionId(),
                        selected: false,
                        count: 4,
                        isImage: false,
                    },
                    {
                        value: "Grapes",
                        tooltip: "Grapes",
                        identity: SelectionIdBuilder.builder().withCategory(category, 3).createSelectionId(),
                        selected: false,
                        count: 5,
                        isImage: false,
                    },
                    {
                        value: "Banana",
                        tooltip: "Banana",
                        identity: SelectionIdBuilder.builder().withCategory(category, 4).createSelectionId(),
                        selected: false,
                        count: 6,
                        isImage: false,
                    }];

                let expectedSlicerData: powerbi.visuals.SlicerData = {
                    categorySourceName: "Fruit",
                    slicerSettings: powerbi.visuals.Slicer.DefaultStyleProperties(),
                    slicerDataPoints: dataPoints,
                    hasSelectionOverride: false,
                    defaultValue: undefined,
                    searchKey: '',
                };
                expectedSlicerData.slicerSettings.selection.selectAllCheckboxEnabled = true;
                expectedSlicerData.slicerSettings.selection.singleSelect = false;
                jasmine.clock().tick(0);
                let slicerData = powerbi.visuals.DataConversion.convert(builder.dataView, slicerHelper.SelectAllTextKey, null, builder.hostServices);
                expect(slicerData.slicerDataPoints.length).toBe(6);
                expect(slicerData).toEqual(expectedSlicerData);
            });
            
            it("Resize", () => {
                let viewport = {
                    height: 200,
                    width: 300
                };
                builder.visual.onResizing(viewport);
                jasmine.clock().tick(0);

                expect($(".slicerContainer .slicerBody").first().css("height")).toBe("181px");
                expect($(".slicerContainer .slicerBody").first().css("width")).toBe("300px");
                expect($(".slicerContainer .slicerHeader").first().css("width")).toBe("292px");
                expect($(".slicerContainer .titleHeader").first().css("width")).toBe("284px");

                // Next Resize
                let viewport2 = {
                    height: 150,
                    width: 150
                };
                builder.visual.onResizing(viewport2);
                jasmine.clock().tick(0);

                expect($(".slicerContainer .slicerBody").first().css("height")).toBe("131px");
                expect($(".slicerContainer .slicerBody").first().css("width")).toBe("150px");
            });

            it("DOM Validation - SearchHeader visible", () => {
                expect($('.searchHeader').length).toBe(1);
                expect($(".searchHeader").css('display')).toBe('none');
                let dataView: powerbi.DataView = slicerHelper.buildDataViewWithSelfFilter(SlicerOrientation.Vertical, builder.field);
                helpers.fireOnDataChanged(builder.visual, { dataViews: [dataView] });
                expect($('.searchHeader').length).toBe(1);
                expect($(".searchHeader").css('display')).not.toBe('none');

                let searchKey = '  search key ';
                $('.searchInput').val(searchKey);
                helpers.fireOnDataChanged(builder.visual, { dataViews: [dataView] });

                let searchInput = $('.searchInput');
                // Since the data view don't have search key specified, this input value should reflect the search value. 
                // This is for the case when search is turned off when there is a search key. After search is turned on again, we should clear the value.
                expect(searchInput.val()).toBe('');
            });

            it("Search input keyup event", () => {
                let dataView: powerbi.DataView = slicerHelper.buildDataViewWithSelfFilter(SlicerOrientation.Vertical, builder.field);
                helpers.fireOnDataChanged(builder.visual, { dataViews: [dataView] });
                let searchHeader = $('.searchHeader');
                let searchBox = searchHeader.find('input');
                searchBox.d3Click(0, 0);
                let searchSpy = spyOn(powerbi.visuals.SlicerWebBehavior, 'startSearch');

                searchBox.d3KeyEvent('keyup', 'a', 65);
                jasmine.clock().tick(200);
                expect(searchSpy).not.toHaveBeenCalled();
                //jasmine.clock().tick(301);
                //expect(searchSpy).toHaveBeenCalled();
            });

            it("Search input keydown with enter key event", () => {
                let dataView: powerbi.DataView = slicerHelper.buildDataViewWithSelfFilter(SlicerOrientation.Vertical, builder.field);
                helpers.fireOnDataChanged(builder.visual, { dataViews: [dataView] });
                let searchHeader = $('.searchHeader');
                let searchBox = searchHeader.find('input');
                searchBox.d3Click(0, 0);
                let searchSpy = spyOn(powerbi.visuals.SlicerWebBehavior, 'startSearch');
                searchBox.d3KeyEvent('keydown', 'a', 65);
                expect(searchSpy).not.toHaveBeenCalled();
            });
        });

        describe("Scroll Bar Resetting", () => {
            let field = powerbi.data.SQExprBuilder.fieldDef({
                schema: 's',
                entity: "Entity2",
                column: "PropertyName"
            });
            let dv1 = slicerHelper.buildSequenceDataView(field, 0, 100); // 0->99
            dv1.metadata.objects = slicerHelper.buildDefaultDataViewObjects(SlicerOrientation.Vertical, false, true);
            let dv2 = slicerHelper.buildSequenceDataView(field,0, 200); // 0->199
            dv2.metadata.objects = slicerHelper.buildDefaultDataViewObjects(SlicerOrientation.Vertical, false, true);
            let dvFiltered = slicerHelper.buildSequenceDataView(field, 50, 2); // 50, 51
            dvFiltered.metadata.objects = slicerHelper.buildDefaultDataViewObjects(SlicerOrientation.Vertical, false, true);

            let dvOptionsCreate: powerbi.VisualDataChangedOptions = {
                dataViews: [dv1],
                operationKind: powerbi.VisualDataChangeOperationKind.Create
            };
            let dvOptionsAppend: powerbi.VisualDataChangedOptions = {
                dataViews: [dv2],
                operationKind: powerbi.VisualDataChangeOperationKind.Append
            };
            let dvOptionsFilter: powerbi.VisualDataChangedOptions = {
                dataViews: [dvFiltered],
                operationKind: powerbi.VisualDataChangeOperationKind.Create
            };

            function loadFirstSegment(): void {
                helpers.fireOnDataChanged(builder.visual, dvOptionsCreate);
            }
            function loadSecondSegment(): void {
                helpers.fireOnDataChanged(builder.visual, dvOptionsAppend);
            }
            function loadFilteredSegment(): void {
                helpers.fireOnDataChanged(builder.visual, dvOptionsFilter);
            }
            function scrollBy(itemCount: number): void {
                // Get 'real' row height. Measure the parent and the child in case the child has a margin that outerHeight ignores when measuring the parent.
                let row = $('.row').eq(0);
                let rowHeight = Math.max(row.outerHeight(true), row.children().first().outerHeight(true));
                // Scrolling
                $(".slicerBody .scrollbar-inner.scroll-content").scrollTop(itemCount * rowHeight);
            }

            xit("Scrolling", (done) => {
                loadFirstSegment();

                expect($(slicerHelper.slicerTextClassSelector).eq(0).text()).toBe(dv1.categorical.categories[0].values[0]); // Fruit 0
                expect($(slicerHelper.slicerTextClassSelector).eq(0).attr('title')).toBe(dv1.categorical.categories[0].values[0]);

                // Scroll by 10 items, assert first rendered element is #10
                scrollBy(10);
                helpers.executeWithDelay(() => {
                    expect($(slicerHelper.slicerTextClassSelector).eq(0).text()).toBe(dv1.categorical.categories[0].values[10]); // Fruit 10
                    expect($(slicerHelper.slicerTextClassSelector).eq(0).attr('title')).toBe(dv1.categorical.categories[0].values[10]);
                    done();
                }, DefaultWaitForRender);
            });

            xit("Selecting an item -> No Scroll Reset", (done) => {
                loadFirstSegment();

                // Scroll by 10 items, assert first rendered element is #10
                scrollBy(10);
                helpers.executeWithDelay(() => {
                    expect($(slicerHelper.slicerTextClassSelector).eq(0).text()).toBe(dv1.categorical.categories[0].values[10]); // Fruit 10
                    expect($(slicerHelper.slicerTextClassSelector).eq(0).attr('title')).toBe(dv1.categorical.categories[0].values[10]);

                    // Select an item -> No Reset
                    $(".slicerText").eq(1).trigger('click');
                    expect($(slicerHelper.slicerTextClassSelector).eq(0).text()).toBe(dv1.categorical.categories[0].values[10]); // Fruit 10
                    expect($(slicerHelper.slicerTextClassSelector).eq(0).attr('title')).toBe(dv1.categorical.categories[0].values[10]); 
                    done();
                }, DefaultWaitForRender);
            });

            xit("Appending -> No Scroll Reset", (done) => {
                loadFirstSegment();

                // Scroll by 10 items, assert first rendered element is #10
                scrollBy(10);
                helpers.executeWithDelay(() => {
                    expect($(slicerHelper.slicerTextClassSelector).eq(0).text()).toBe(dv1.categorical.categories[0].values[10]); // Fruit 10
                    expect($(slicerHelper.slicerTextClassSelector).eq(0).attr('title')).toBe(dv1.categorical.categories[0].values[10]); 

                    // Appending -> No change
                    loadSecondSegment();
                    expect($(slicerHelper.slicerTextClassSelector).eq(0).text()).toBe(dv1.categorical.categories[0].values[10]); // Fruit 10
                    expect($(slicerHelper.slicerTextClassSelector).eq(0).attr('title')).toBe(dv1.categorical.categories[0].values[10]);

                    done();
                }, DefaultWaitForRender);
            });

            xit("Filtering -> Scroll Reset", (done) => {
                loadFirstSegment();

                // Scroll by 10 items, assert first rendered element is #10
                scrollBy(10);
                helpers.executeWithDelay(() => {
                    expect($(slicerHelper.slicerTextClassSelector).eq(0).text()).toBe(dv1.categorical.categories[0].values[10]); // Fruit 10
                    expect($(slicerHelper.slicerTextClassSelector).eq(0).attr('title')).toBe(dv1.categorical.categories[0].values[10]); 

                    // Filtering -> Scroll reset -> First rendered element
                    loadFilteredSegment();
                    expect($(slicerHelper.slicerTextClassSelector).eq(0).text()).toBe(dvFiltered.categorical.categories[0].values[0]); // Fruit 50
                    expect($(slicerHelper.slicerTextClassSelector).eq(0).attr('title')).toBe(dvFiltered.categorical.categories[0].values[0]);
                    // asserting translate position is 0
                    expect($(slicerHelper.slicerTextClassSelector).eq(0).text()).toBe(dvFiltered.categorical.categories[0].values[0]); // Fruit 50
                    expect($(slicerHelper.slicerTextClassSelector).eq(0).attr('title')).toBe(dvFiltered.categorical.categories[0].values[0]);
                    expect($('.visibleGroup').eq(0).css('transform').split(',')[5].split(')')[0].trim()).toBe("0");
                    done();
                }, DefaultWaitForRender);
            });
        });

        describe("Interactivity tests", () => {
            it("slicer item selectby checkbox", () => {
                jasmine.clock().tick(0);
                builder.slicerCheckbox.eq(1).d3Click(0, 0);

                slicerHelper.validateSelectionState(SlicerOrientation.Vertical, [1], builder);

                let selectionId = new powerbi.visuals.SelectionIdBuilder().withCategory(builder.interactiveDataViewOptions.dataViews[0].categorical.categories[0], 0).createSelectionId();
                expect(builder.hostServices.onSelect).toHaveBeenCalledWith({
                    visualObjects:
                    [
                        {
                            objectName: 'dataPoint',
                            selectorsByColumn: selectionId.getSelectorsByColumn(),
                            
                        }
                    ]
                });
            });

            it("Switch slicer orientation", () => {
                // Switch to Horizontal
                builder.dataView.metadata.objects["general"] = { orientation: SlicerOrientation.Horizontal };
                helpers.fireOnDataChanged(builder.visual, { dataViews: [builder.dataView] });

                expect($(".slicerContainer")).not.toBeInDOM();
                expect($(".horizontalSlicerContainer")).toBeInDOM();

                // Switch to Vertical
                builder.dataView.metadata.objects["general"] = { orientation: SlicerOrientation.Vertical };
                helpers.fireOnDataChanged(builder.visual, { dataViews: [builder.dataView] });

                expect($(".slicerContainer")).toBeInDOM();
                expect($(".horizontalSlicerContainer")).not.toBeInDOM();
            });
        });
    });
}
