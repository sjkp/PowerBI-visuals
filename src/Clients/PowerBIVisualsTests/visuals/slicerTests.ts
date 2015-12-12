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

// TODO: We should not be validating specific styles (e.g. RGB codes) in unit tests.
// TODO: Refactor tests for greater reuse and less repetition.

module powerbitests {
    import DataViewTransform = powerbi.data.DataViewTransform;
    import SelectionId = powerbi.visuals.SelectionId;
    import Slicer = powerbi.visuals.Slicer;
    import ValueType = powerbi.ValueType;
    import VisualDataChangedOptions = powerbi.VisualDataChangedOptions;
    import SlicerOrientation = powerbi.visuals.slicerOrientation.Orientation;

    const SelectedClass = 'selected';

    powerbitests.mocks.setLocale();

    let visual: powerbi.IVisual;
    let element: JQuery;
    let slicerText: JQuery;
    let slicerCheckbox: JQuery;
    let slicerCheckboxInput: JQuery;
    let hostServices: powerbi.IVisualHostServices;
    let originalRequestAnimationFrameCallback: (callback: Function) => number;

    let dataViewMetadata: powerbi.DataViewMetadata = slicerHelper.buildDefaultDataViewMetadata();
    let dataViewCategorical: powerbi.DataViewCategorical = slicerHelper.buildDefaultDataViewCategorical();
    let dataView: powerbi.DataView = slicerHelper.buildDefaultDataView();
    let interactiveDataViewOptions: powerbi.VisualDataChangedOptions = {
        dataViews: [dataView]
    };

    let interactiveImageDataViewOptions: powerbi.VisualDataChangedOptions = {
        dataViews: [slicerHelper.buildImageDataView()]
    };

    describe("Slicer", () => {
        it("Slicer_registered_capabilities", () => {
            expect(powerbi.visuals.visualPluginFactory.create().getPlugin("slicer").capabilities).toBe(powerbi.visuals.slicerCapabilities);
        });

        it("Capabilities should include dataViewMapping", () => {
            expect(powerbi.visuals.slicerCapabilities.dataViewMappings).toBeDefined();
            expect(powerbi.visuals.slicerCapabilities.dataViewMappings.length).toBe(1);
        });

        it("Capabilities should have condition", () => {
            expect(powerbi.visuals.slicerCapabilities.dataViewMappings[0].conditions.length).toBe(1);
            expect(powerbi.visuals.slicerCapabilities.dataViewMappings[0].conditions[0][powerbi.visuals.slicerCapabilities.dataRoles[0].name].max).toBe(1);
        });

        it("Capabilities should include dataRoles", () => {
            expect(powerbi.visuals.slicerCapabilities.dataRoles).toBeDefined();
            expect(powerbi.visuals.slicerCapabilities.dataRoles.length).toBe(1);
        });

        it("Capabilities should suppressDefaultTitle", () => {
            expect(powerbi.visuals.slicerCapabilities.suppressDefaultTitle).toBe(true);
        });

        it("Filter property should match calculated", () => {
            expect(powerbi.data.DataViewObjectDescriptors.findFilterOutput(powerbi.visuals.slicerCapabilities.objects)).toEqual(powerbi.visuals.slicerProps.filterPropertyIdentifier);
        });

        it("Sort should be default so the sort UI shows", () => {
            expect(powerbi.visuals.slicerCapabilities.sorting.custom).not.toBeDefined();
            expect(powerbi.visuals.slicerCapabilities.sorting.default).toBeDefined();
        });
    });

    describe("VerticalSlicer", () => {
        initializeSlicer(SlicerOrientation.Vertical);

        describe("DOM tests", () => {
            it("DOM Validation - Text Slicer", () => {
                spyOn(powerbi.visuals.valueFormatter, "format").and.callThrough();

                helpers.fireOnDataChanged(visual, interactiveDataViewOptions);

                expect($(".slicerContainer")).toBeInDOM();
                expect($(".slicerContainer .headerText")).toBeInDOM();
                expect($(".slicerContainer .slicerHeader .clear")).toBeInDOM();
                expect($(".slicerContainer .slicerBody")).toBeInDOM();
                expect($(".slicerContainer .slicerBody .row .slicerText")).toBeInDOM();
                expect($(".slicerText").length).toBe(6);
                expect($(".slicerText").first().text()).toBe(slicerHelper.SelectAllTextKey);
                expect($(".slicerText").last().text()).toBe("Banana");

                expect(powerbi.visuals.valueFormatter.format).toHaveBeenCalledWith("Apple", undefined);
                expect(powerbi.visuals.valueFormatter.format).toHaveBeenCalledWith("Orange", undefined);
                expect(powerbi.visuals.valueFormatter.format).toHaveBeenCalledWith("Kiwi", undefined);
                expect(powerbi.visuals.valueFormatter.format).toHaveBeenCalledWith("Grapes", undefined);
                expect(powerbi.visuals.valueFormatter.format).toHaveBeenCalledWith("Banana", undefined);

                // Subsequent update
                let dataView2: powerbi.DataView = {
                    metadata: dataViewMetadata,
                    categorical: {
                        categories: [{
                            source: dataViewMetadata.columns[0],
                            values: ["Strawberry", "Blueberry", "Blackberry"],
                            identity: [
                                mocks.dataViewScopeIdentity("Strawberry"),
                                mocks.dataViewScopeIdentity("Blueberry"),
                                mocks.dataViewScopeIdentity("Blackberry")
                            ]
                        }],
                        values: DataViewTransform.createValueColumns([{
                            source: dataViewMetadata.columns[1],
                            values: [40, 25, 22]
                        }])
                    }
                };
                dataView2.metadata.objects = slicerHelper.buildDefaultDataViewObjects();

                helpers.fireOnDataChanged(visual, { dataViews: [dataView2] });

                expect($(".slicerContainer")).toBeInDOM();
                expect($(".slicerContainer .headerText")).toBeInDOM();
                expect($(".slicerContainer .slicerHeader .clear")).toBeInDOM();
                expect($(".slicerContainer .slicerBody")).toBeInDOM();
                expect($(".slicerContainer .slicerBody .row .slicerText")).toBeInDOM();

                expect($(".slicerText").length).toBe(4);
                expect($(".slicerText").first().text()).toBe(slicerHelper.SelectAllTextKey);
                expect($(".slicerText").last().text()).toBe("Blackberry");
            });

            it("DOM Validation - Image Slicer", () => {
                spyOn(powerbi.visuals.valueFormatter, "format").and.callThrough();

                helpers.fireOnDataChanged(visual, interactiveImageDataViewOptions);

                expect($(".slicerContainer")).toBeInDOM();
                expect($(".slicerContainer .headerText")).toBeInDOM();
                expect($(".slicerContainer .slicerHeader .clear")).toBeInDOM();
                expect($(".slicerContainer .slicerBody")).toBeInDOM();
                expect($(".slicerContainer .slicerBody .row img")).toBeInDOM();
                expect($(".slicerContainer .slicerBody .row img").length).toBe(5);
                expect($(".slicerContainer .slicerBody .row img").last().attr('src')).toBe("http://dummyimage.com/600x400/000/fff&text=5");
            });

            it("Validate converter", () => {
                jasmine.clock().tick(0);
                let slicerData = Slicer.converter(dataView, slicerHelper.SelectAllTextKey, null);
                expect(slicerData.slicerDataPoints.length).toBe(6);
                let dataViewIdentities = dataView.categorical.categories[0].identity;
                let selectionIds = [
                    SelectionId.createWithId(dataViewIdentities[0]),
                    SelectionId.createWithId(dataViewIdentities[1]),
                    SelectionId.createWithId(dataViewIdentities[2]),
                    SelectionId.createWithId(dataViewIdentities[3]),
                    SelectionId.createWithId(dataViewIdentities[4])
                ];
                let dataPoints = [
                    {
                        value: slicerHelper.SelectAllTextKey,
                        tooltip: slicerHelper.SelectAllTextKey,
                        identity: SelectionId.createWithMeasure(slicerHelper.SelectAllTextKey),
                        selected: false,
                        isSelectAllDataPoint: true
                    },
                    {
                        value: "Apple",
                        tooltip: "Apple",
                        identity: selectionIds[0],
                        selected: false
                    },
                    {
                        value: "Orange",
                        tooltip: "Orange",
                        identity: selectionIds[1],
                        selected: false
                    },
                    {
                        value: "Kiwi",
                        tooltip: "Kiwi",
                        identity: selectionIds[2],
                        selected: false
                    },
                    {
                        value: "Grapes",
                        tooltip: "Grapes",
                        identity: selectionIds[3],
                        selected: false
                    },
                    {
                        value: "Banana",
                        tooltip: "Banana",
                        identity: selectionIds[4],
                        selected: false
                    }];

                let expectedSlicerData = {
                    categorySourceName: "Fruit",
                    slicerSettings: powerbi.visuals.Slicer.DefaultStyleProperties(),
                    slicerDataPoints: dataPoints
                };
                expectedSlicerData.slicerSettings.selection.selectAllCheckboxEnabled = true;
                expectedSlicerData.slicerSettings.selection.singleSelect = false;
                expect(slicerData).toEqual(expectedSlicerData);
            });

            it("Null dataView test", () => {
                helpers.fireOnDataChanged(visual, { dataViews: [] });

                expect($(".slicerText").length).toBe(0);
            });

            xit("Resize", () => {
                let viewport = {
                    height: 200,
                    width: 300
                };
                visual.onResizing(viewport);
                jasmine.clock().tick(0);

                expect($(".slicerContainer .slicerBody").first().css("height")).toBe("181px");
                expect($(".slicerContainer .slicerBody").first().css("width")).toBe("300px");
                expect($(".slicerContainer .headerText").first().css("width")).toBe("275px");

                // Next Resize
                let viewport2 = {
                    height: 150,
                    width: 150
                };
                visual.onResizing(viewport2);
                jasmine.clock().tick(0);

                expect($(".slicerContainer .slicerBody").first().css("height")).toBe("131px");
                expect($(".slicerContainer .slicerBody").first().css("width")).toBe("150px");
            });
        });

        describe("Scroll Bar Resetting", () => {
            let dv1 = slicerHelper.buildSequenceDataView(0, 100); // 0->99
            dv1.metadata.objects = slicerHelper.buildDefaultDataViewObjects(SlicerOrientation.Vertical, false, true);
            let dv2 = slicerHelper.buildSequenceDataView(0, 200); // 0->199
            dv2.metadata.objects = slicerHelper.buildDefaultDataViewObjects(SlicerOrientation.Vertical, false, true);
            let dvFiltered = slicerHelper.buildSequenceDataView(50, 2); // 50, 51
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
                helpers.fireOnDataChanged(visual, dvOptionsCreate);
            }
            function loadSecondSegment(): void {
                helpers.fireOnDataChanged(visual, dvOptionsAppend);
            }
            function loadFilteredSegment(): void {
                helpers.fireOnDataChanged(visual, dvOptionsFilter);
            }
            function scrollBy(itemCount: number): void {
                // Get 'real' row height
                let rowHeight = $('.slicerItemContainer').eq(0).outerHeight(true);
                // Scrolling
                $(".slicerBody").scrollTop(itemCount * rowHeight);
            }

            it("Scrolling", (done) => {
                loadFirstSegment();

                expect($(".slicerText").eq(0).text()).toBe(dv1.categorical.categories[0].values[0]); // Fruit 0

                // Scroll by 10 items, assert first rendered element is #10
                scrollBy(10);
                helpers.executeWithDelay(() => {
                    expect($(".slicerText").eq(0).text()).toBe(dv1.categorical.categories[0].values[10]); // Fruit 10
                    done();
                }, DefaultWaitForRender);
            });

            it("Selecting an item -> No Scroll Reset", (done) => {
                loadFirstSegment();

                // Scroll by 10 items, assert first rendered element is #10
                scrollBy(10);
                helpers.executeWithDelay(() => {
                    expect($(".slicerText").eq(0).text()).toBe(dv1.categorical.categories[0].values[10]); // Fruit 10

                    // Select an item -> No Reset
                    $(".slicerText").eq(1).trigger('click');
                    expect($(".slicerText").eq(0).text()).toBe(dv1.categorical.categories[0].values[10]); // Fruit 10
                    done();
                }, DefaultWaitForRender);
            });

            it("Appending -> No Scroll Reset", (done) => {
                loadFirstSegment();

                // Scroll by 10 items, assert first rendered element is #10
                scrollBy(10);
                helpers.executeWithDelay(() => {
                    expect($(".slicerText").eq(0).text()).toBe(dv1.categorical.categories[0].values[10]); // Fruit 10

                    // Appending -> No change
                    loadSecondSegment();
                    expect($(".slicerText").eq(0).text()).toBe(dv1.categorical.categories[0].values[10]); // Fruit 10

                    done();
                }, DefaultWaitForRender);
            });

            it("Filtering -> Scroll Reset", (done) => {
                loadFirstSegment();

                // Scroll by 10 items, assert first rendered element is #10
                scrollBy(10);
                helpers.executeWithDelay(() => {
                    expect($(".slicerText").eq(0).text()).toBe(dv1.categorical.categories[0].values[10]); // Fruit 10

                    // Filtering -> Scroll reset -> First rendered element
                    loadFilteredSegment();
                    expect($(".slicerText").eq(0).text()).toBe(dvFiltered.categorical.categories[0].values[0]); // Fruit 50
                    // asserting translate position is 0
                    expect($(".slicerText").eq(0).text()).toBe(dvFiltered.categorical.categories[0].values[0]); // Fruit 50
                    expect($('.visibleGroup').eq(0).css('transform').split(',')[5].split(')')[0].trim()).toBe("0");
                    done();
                }, DefaultWaitForRender);
            });
        });

        describe("Interactivity tests", () => {
            it("slicer item selectby checkbox", () => {
                jasmine.clock().tick(0);
                (<any>slicerCheckbox.eq(1)).d3Click(0, 0);

                validateSelectionState(SlicerOrientation.Vertical, [1]);
                expect(hostServices.onSelect).toHaveBeenCalledWith({
                    data:
                    [
                        {
                            data: [
                                interactiveDataViewOptions.dataViews[0].categorical.categories[0].identity[0]
                            ]
                        }
                    ]
                });
            });

            it("Default value is selected if there is one", () => {
                let dataViewMetadataWithDefaultValue: powerbi.DataViewMetadata = {
                    columns: [
                        {
                            displayName: "Fruit",
                            roles: {
                                "Value": true,
                            },
                            type: ValueType.fromDescriptor({ text: true }),
                            objects: {
                                general: {
                                    defaultValue: {
                                        value: powerbi.data.SQExprBuilder.text('Orange'),
                                        identityFieldsValues: [powerbi.data.SQExprBuilder.text('Orange')]
                                    }
                                }
                            }
                        },
                        { displayName: "Price", isMeasure: true }, ],
                    objects: {
                        selection: {
                            selectAllCheckboxEnabled: true,
                            singleSelect: false
                        }
                    }
                };
                let fieldExpr = powerbi.data.SQExprBuilder.columnRef(powerbi.data.SQExprBuilder.entity('s', 'Fruit'), 'Fruit');
                let dataViewCategoricalWithDefaultValue = {
                    categories: [{
                        source: dataViewMetadataWithDefaultValue.columns[0],
                        values: ["Apple", "Orange", "Kiwi", "Grapes", "Banana"],
                        identity: [
                            mocks.dataViewScopeIdentityWithEquality(fieldExpr, "Apple"),
                            mocks.dataViewScopeIdentityWithEquality(fieldExpr, "Orange"),
                            mocks.dataViewScopeIdentityWithEquality(fieldExpr, "Kiwi"),
                            mocks.dataViewScopeIdentityWithEquality(fieldExpr, "Grapes"),
                            mocks.dataViewScopeIdentityWithEquality(fieldExpr, "Banana")
                        ],
                        identityFields: [fieldExpr]
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [20, 10, 30, 15, 12]
                    }]),
                };

                let interactiveDataViewOptionWithDefaultValue: powerbi.VisualDataChangedOptions = {
                    dataViews: [{ metadata: dataViewMetadataWithDefaultValue, categorical: dataViewCategoricalWithDefaultValue }],
                    operationKind: powerbi.VisualDataChangeOperationKind.Create
                };
                let filter: powerbi.data.SemanticFilter;
                spyOn(hostServices, "persistProperties").and.callFake((instance: powerbi.VisualObjectInstancesToPersist) => {
                    filter = <powerbi.data.SemanticFilter>instance.merge[0].properties['filter'];
                });

                helpers.fireOnDataChanged(visual, interactiveDataViewOptionWithDefaultValue);

                initializeHelperElements();
                validateSelectionState(SlicerOrientation.Vertical, [2]);
                expect(filter).toBeDefined();
            });

            it("Switch slicer orientation", () => {
                // Switch to Horizontal
                dataView.metadata.objects["general"] = { orientation: SlicerOrientation.Horizontal };
                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });

                expect($(".slicerContainer")).not.toBeInDOM();
                expect($(".horizontalSlicerContainer")).toBeInDOM();

                // Switch to Vertical
                dataView.metadata.objects["general"] = { orientation: SlicerOrientation.Vertical };
                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });

                expect($(".slicerContainer")).toBeInDOM();
                expect($(".horizontalSlicerContainer")).not.toBeInDOM();
            });
        });
    });

    describe("CommonSlicer Tests", () => {
        function validateSelection(orientation: SlicerOrientation): void {
            initializeSlicer(orientation, 200, 600);

            it("SelectAll", () => {
                validateSelectionState(orientation, []);

                let selectAllItem: any = getSelectAllItem().eq(0);
                selectAllItem.d3Click(0, 0);

                validateSelectionState(orientation, [0, 1, 2, 3, 4, 5]);

                (<any>slicerText.eq(1)).d3Click(0, 0);
                validateSelectionState(orientation, [0, 2, 3, 4, 5]);
            });

            it("Partial select", () => {
                validateSelectionState(orientation, []);

                let selectAllItem: any = getSelectAllItem().eq(0);
                selectAllItem.d3Click(0, 0);

                validateSelectionState(orientation, [0, 1, 2, 3, 4, 5]);
                let partialSelect = getPartiallySelectedContainer();
                expect(partialSelect.length).toBe(0);

                (<any>slicerText.eq(1)).d3Click(0, 0);
                partialSelect = getPartiallySelectedContainer();
                expect(partialSelect.length).toBe(1);
                validateSelectionState(orientation, [0, 2, 3, 4, 5]);

                selectAllItem.d3Click(0, 0);
                validateSelectionState(orientation, []);
                partialSelect = getPartiallySelectedContainer();
                expect(partialSelect.length).toBe(0);

                (<any>slicerText.eq(1)).d3Click(0, 0);
                partialSelect = getPartiallySelectedContainer();
                expect(partialSelect.length).toBe(1);
                validateSelectionState(orientation, [1]);
            });

            it("Partial selection works even when multi-select is disabled", () => {
                reconfigureSlicer(interactiveDataViewOptions, () => {
                    (<any>(dataView.metadata.objects)).selection.singleSelect = true;
                });

                // Check the 'Select All' item
                let selectAllItem: any = getSelectAllItem().eq(0);
                selectAllItem.d3Click(0, 0);
                validateSelectionState(orientation, [0, 1, 2, 3, 4, 5]);

                // Unselect a single checkbox. This should work even though multi-selection is disabled.
                (<any>slicerText.eq(1)).d3Click(0, 0);
                validateSelectionState(orientation, [0, 2, 3, 4, 5]);
            });

            it("Clear", () => {
                let clearBtn = $(".clear");

                // Slicer click
                (<any>slicerText.eq(1)).d3Click(0, 0);
                validateSelectionState(orientation, [1]);

                (<any>slicerText.eq(2)).d3Click(0, 0);
                validateSelectionState(orientation, [1, 2]);

                /* Slicer clear */
                (<any>clearBtn.first()).d3Click(0, 0);

                validateSelectionState(orientation, []);
                expect(hostServices.onSelect).toHaveBeenCalledWith({ data: [] });
            });

            it("Slicer item select by text", () => {
                jasmine.clock().tick(0);
                (<any>slicerText.eq(1)).d3Click(0, 0);
                validateSelectionState(orientation, [1]);

                expect(hostServices.onSelect).toHaveBeenCalledWith({
                    data:
                    [
                        {
                            data: [
                                interactiveDataViewOptions.dataViews[0].categorical.categories[0].identity[0]
                            ]
                        }
                    ]
                });
            });

            it("Slicer item repeated selection", () => {
                (<any>slicerText.eq(1)).d3Click(0, 0);
                validateSelectionState(orientation, [1]);

                (<any>slicerText.last()).d3Click(0, 0);
                validateSelectionState(orientation, [1, 5]);

                (<any>slicerText.last()).d3Click(0, 0);
                validateSelectionState(orientation, [1]);
            });

            it("Single-select mode", () => {
                // Switch to single-select
                (<any>dataView.metadata.objects).selection.singleSelect = true;
                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });

                initializeHelperElements();

                (<any>slicerText.eq(1)).d3Click(0, 0);
                validateSelectionState(orientation, [1]);

                // Select another checkbox. The previously selected one should be cleared.
                (<any>slicerText.eq(2)).d3Click(0, 0);
                validateSelectionState(orientation, [2]);

                // validate the style for select
                expect(getSlicerContainer(orientation).hasClass('isMultiSelectEnabled')).toBe(false);
            });

            it("Multi-select mode", () => {
                (<any>slicerText.eq(1)).d3Click(0, 0);
                validateSelectionState(orientation, [1]);

                // Select another item. The previously selected one shouldn't be cleared.
                (<any>slicerText.eq(2)).d3Click(0, 0);
                validateSelectionState(orientation, [1, 2]);

                // validate the style for multi select
                expect(getSlicerContainer(orientation).hasClass('isMultiSelectEnabled')).toBe(true);
            });

            it('Show the Select All item', () => {
                dataView.metadata.objects["selection"] = { selectAllCheckboxEnabled: false };

                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });
                expect(getSelectAllItem().length).toBe(0);

                dataView.metadata.objects["selection"] = { selectAllCheckboxEnabled: true };

                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });
                expect(getSelectAllItem().length).toBe(1);
            });

            it('Hide the Select All item', () => {
                dataView.metadata.objects["selection"] = { selectAllCheckboxEnabled: true };

                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });
                expect(getSelectAllItem().length).toBe(1);

                dataView.metadata.objects["selection"] = { selectAllCheckboxEnabled: false };

                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });
                expect(getSelectAllItem().length).toBe(0);
            });
        }
        describe("VerticalSlicer selection validation", () => validateSelection(SlicerOrientation.Vertical));
        describe("HorizontalSlicer selection validation", () => validateSelection(SlicerOrientation.Horizontal));

        function validateFormattingPaneProperties(orientation: SlicerOrientation): void {
            initializeSlicer(orientation);

            it('Show hide header test', () => {
                expect($(".slicerHeader").css('display')).toBe('block');

                dataView.metadata.objects["header"] = { show: false };
                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });

                expect($(".slicerHeader").css('display')).toBe('none');
            });

            it('Header outline color test', () => {
                expect($(".headerText").css('border-color')).toBe('rgb(128, 128, 128)');
            });

            it('Background and font slicer text test', () => {
                expect($(".slicerText").css('color')).toBe('rgb(102, 102, 102)');

                dataView.metadata.objects["items"] = {
                    fontColor: { solid: { color: '#f5f5f5' } },
                    background: { solid: { color: '#f6f6f6' } },
                };
                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });

                expect($(".slicerText").css('color')).toBe('rgb(245, 245, 245)');
                expect($(".slicerText").css('background-color')).toBe('rgb(246, 246, 246)');
            });

            it('Background and font header test', () => {
                expect($(".slicerHeader .headerText").css('color')).toBe('rgb(0, 0, 0)');

                dataView.metadata.objects["header"] = {
                    show: true,
                    fontColor: { solid: { color: '#f5f5f5' } },
                    background: { solid: { color: '#f6f6f6' } },
                };
                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });

                expect($(".slicerHeader .headerText").css('color')).toBe('rgb(245, 245, 245)');
                expect($(".slicerHeader .headerText").css('background-color')).toBe('rgb(246, 246, 246)');
            });

            it('Test header border outline', () => {
                expect($(".headerText").css('border-width')).toBe('0px 0px 1px');

                dataView.metadata.objects = {
                    general: { orientation: orientation },
                    header: { outline: 'None' }
                };
                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });

                expect($(".headerText").css('border-width')).toBe('0px');

                dataView.metadata.objects["header"] = { outline: 'TopOnly' };
                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });

                expect($(".headerText").css('border-width')).toBe('1px 0px 0px');

                dataView.metadata.objects["header"] = { outline: 'TopBottom' };
                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });

                expect($(".headerText").css('border-width')).toBe('1px 0px');

                dataView.metadata.objects["header"] = { outline: 'LeftRight' };
                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });

                expect($(".headerText").css('border-width')).toBe('0px 1px');

                dataView.metadata.objects["header"] = { outline: 'Frame' };
                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });

                expect($(".headerText").css('border-width')).toBe('1px');
            });

            it('Row text size', () => {
                let actualFontSize = parseFloat(slicerText.css('font-size'));
                expect(parseAndRoundFontSize(slicerText)).toBe(13);

                dataView.metadata.objects["items"] = { textSize: 14 };
                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });

                slicerText = $(".slicerText");
                actualFontSize = parseFloat(slicerText.css('font-size'));
                expect(parseAndRoundFontSize(slicerText)).toBe(19);
            });

            it('Header text size', () => {
                expect(parseAndRoundFontSize($(".slicerHeader .headerText"))).toBe(13);

                dataView.metadata.objects["header"] = {
                    show: true,
                    textSize: 14,
                };
                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });

                expect(parseAndRoundFontSize($(".slicerHeader .headerText"))).toBe(19);
            });
        }
        describe("VerticalSlicer formatting pane properties validation", () => validateFormattingPaneProperties(SlicerOrientation.Vertical));
        describe("HorizontalSlicer formatting pane properties validation", () => validateFormattingPaneProperties(SlicerOrientation.Horizontal));

        function validateLoadMoreData(orientation: SlicerOrientation): void {
            initializeSlicer(orientation);
            it("slicer loadMoreData noSegment", () => {
                let loadMoreSpy = spyOn(hostServices, "loadMoreData");
                loadMoreData(orientation);
                expect(loadMoreSpy).not.toHaveBeenCalled();
            });

            it("slicer loadMoreData", () => {
                let metadata: powerbi.DataViewMetadata = {
                    columns: dataViewMetadata.columns,
                    segment: {},
                };

                let dataView = { metadata: metadata, categorical: dataViewCategorical };
                dataView.metadata.objects = slicerHelper.buildDefaultDataViewObjects(orientation);

                let interactiveDataViewOptions: powerbi.VisualDataChangedOptions = {
                    dataViews: [dataView]
                };
                helpers.fireOnDataChanged(visual, interactiveDataViewOptions);

                let loadMoreSpy = spyOn(hostServices, "loadMoreData");
                loadMoreData(orientation);
                expect(loadMoreSpy).toHaveBeenCalled();
            });

            it("slicer loadMoreData already called", () => {
                let metadata: powerbi.DataViewMetadata = {
                    columns: dataViewMetadata.columns,
                    segment: {},
                };

                let dataView = { metadata: metadata, categorical: dataViewCategorical };
                dataView.metadata.objects = slicerHelper.buildDefaultDataViewObjects(orientation);

                let interactiveDataViewOptions: powerbi.VisualDataChangedOptions = {
                    dataViews: [dataView]
                };
                helpers.fireOnDataChanged(visual, interactiveDataViewOptions);

                let loadMoreSpy = spyOn(hostServices, "loadMoreData");
                let slicerObject = getSlicerLoadMoreDataObject(orientation);
                loadMoreData(orientation, slicerObject);
                loadMoreData(orientation, slicerObject);
                expect(loadMoreSpy.calls.all().length).toBe(1);
            });
        }
        describe("VerticalSlicer LoadMoreData validation", () => validateLoadMoreData(SlicerOrientation.Vertical));
        describe("HorizontalSlicer LoadMoreData validation", () => validateLoadMoreData(SlicerOrientation.Horizontal));

    });

    function initializeSlicer(orientation: SlicerOrientation, height: number = 200, width: number = 300): void {
        beforeEach(() => {
            element = helpers.testDom(height.toString(), width.toString());
            hostServices = slicerHelper.createHostServices();
            dataView.metadata.objects = slicerHelper.buildDefaultDataViewObjects(orientation);

            let slicerRenderOptions: slicerHelper.RenderSlicerOptions = {
                visualType: slicerHelper.SlicerVisual,
                hostServices: hostServices,
                dataView: dataView,
                dataViewObjects: dataView.metadata.objects,
                orientation: orientation,
            };

            visual = slicerHelper.initSlicer(element, slicerRenderOptions);

            originalRequestAnimationFrameCallback = window.requestAnimationFrame;
            window.requestAnimationFrame = (callback: () => void) => {
                callback();
                return 0;
            };

            jasmine.clock().install();

            helpers.fireOnDataChanged(visual, interactiveDataViewOptions);

            initializeHelperElements();

            spyOn(hostServices, "onSelect").and.callThrough();
        });

        afterEach(function () {
            window.requestAnimationFrame = originalRequestAnimationFrameCallback;
            jasmine.clock().uninstall();
        });
    }

    // Returns the "Select All" checkbox
    function getSelectAllItem(): JQuery {
        return $('.slicerText:contains("' + slicerHelper.SelectAllTextKey + '")');
    }

    function getSlicerContainer(orientation: SlicerOrientation): JQuery {
        let slicerContainer: JQuery;

        if (isVerticalOrientation(orientation))
            slicerContainer = $('.slicerContainer');
        else
            slicerContainer = $('.horizontalSlicerContainer');

        return slicerContainer;
    }

    function isVerticalOrientation(orientation: SlicerOrientation): boolean {
        return orientation === SlicerOrientation.Vertical;
    }

    function getPartiallySelectedContainer(): JQuery {
        return $(".partiallySelected");
    }

    function initializeHelperElements(): void {
        slicerText = $(".slicerText");
        slicerCheckbox = $(".slicerCheckbox");
        slicerCheckboxInput = $(".slicerCheckbox").find("input");
    }

    function validateCheckedState(expectedChecked: number[]): void {
        let actualChecked: number[] = [];

        slicerCheckboxInput.each((index: number, element: HTMLInputElement) => {
            if (element.checked)
                actualChecked.push(index);
        });

        expect(actualChecked).toEqual(expectedChecked);
    }

    function parseAndRoundFontSize(element: JQuery): number {
        let fontSize = parseFloat(element.css('font-size'));
        return Math.round(fontSize);
    }

    function reconfigureSlicer(options: VisualDataChangedOptions, changeConfigCallback: () => void): void {
        // Executes a callback that changes the slicer's configuration options,
        // and then sets the necessary test infrastructure back up.
        changeConfigCallback();

        helpers.fireOnDataChanged(visual, options);
        initializeHelperElements();
    }

    function getContainerToBeValidated(orientation: SlicerOrientation): JQuery {
        let containerToBeValidated: JQuery;
        if (isVerticalOrientation(orientation)) {
            containerToBeValidated = slicerCheckbox;
        }
        else {
            containerToBeValidated = slicerText;
        }
        return containerToBeValidated;
    }

    function validateSelectionState(orientation: SlicerOrientation, expectedSelected: number[]): void {
        let actualSelected: number[] = [];
        let containerToBeValidated = getContainerToBeValidated(orientation);
        containerToBeValidated.each((index: number, element: HTMLInputElement) => {
            if (element.classList.contains(SelectedClass))
                actualSelected.push(index);
        });

        expect(actualSelected).toEqual(expectedSelected);

        if (isVerticalOrientation(orientation))
            validateCheckedState(expectedSelected);
    }

    function loadMoreData(orientation: SlicerOrientation, slicerObject?: any): void {
        let object = slicerObject ? slicerObject : getSlicerLoadMoreDataObject(orientation);
        if (isVerticalOrientation(orientation)) {
            object.loadMoreData();
        }
        else {
            object.tryLoadMoreData();
        }
    }

    function getSlicerLoadMoreDataObject(orientation: SlicerOrientation): any {
        let slicerObject: any;
        if (isVerticalOrientation(orientation)) {
            slicerObject = visual["listView"]["options"];
        }
        else {
            slicerObject = visual["slicerVisual"];
        }
        return slicerObject;
    }
}