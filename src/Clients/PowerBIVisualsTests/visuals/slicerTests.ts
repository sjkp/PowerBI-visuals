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

// TODO: We should not be validating specific styles (e.g. RGB codes) in unit tests.

/// <reference path="../_references.ts"/>

module powerbitests {
    import data = powerbi.data;
    import DataViewMetadata = powerbi.DataViewMetadata;
    import FilterAnalyzerOptions = powerbi.FilterAnalyzerOptions;
    import SemanticFilter = powerbi.data.SemanticFilter;
    import SlicerOrientation = powerbi.visuals.slicerOrientation.Orientation;
    import VisualDataChangedOptions = powerbi.VisualDataChangedOptions;  
    import visuals = powerbi.visuals;

    powerbitests.mocks.setLocale();

    describe("Slicer", () => {
        it("Slicer_registered_capabilities", () => {
            expect(visuals.plugins.slicer.capabilities).toBe(visuals.slicerCapabilities);
        });

        it("Capabilities should include dataViewMapping", () => {
            expect(visuals.slicerCapabilities.dataViewMappings).toBeDefined();
            expect(visuals.slicerCapabilities.dataViewMappings.length).toBe(1);
        });

        it("Capabilities should have condition", () => {
            expect(visuals.slicerCapabilities.dataViewMappings[0].conditions.length).toBe(1);
            expect(visuals.slicerCapabilities.dataViewMappings[0].conditions[0][powerbi.visuals.slicerCapabilities.dataRoles[0].name].max).toBe(1);
        });

        it("Capabilities should include dataRoles", () => {
            expect(visuals.slicerCapabilities.dataRoles).toBeDefined();
            expect(visuals.slicerCapabilities.dataRoles.length).toBe(1);
        });

        it("Capabilities should suppressDefaultTitle", () => {
            expect(visuals.slicerCapabilities.suppressDefaultTitle).toBe(true);
        });

        it("Filter property should match calculated", () => {
            expect(data.DataViewObjectDescriptors.findFilterOutput(visuals.slicerCapabilities.objects)).toEqual(visuals.slicerProps.filterPropertyIdentifier);
        });

        it("SelfFilter property should match calculated", () => {
            expect(data.DataViewObjectDescriptors.findSelfFilter(visuals.slicerCapabilities.objects)).toEqual(visuals.slicerProps.selfFilterPropertyIdentifier);
        });

        it("SelfFilterEnabled property should match calculated", () => {
            expect(data.DataViewObjectDescriptors.findSelfFilterEnabled(visuals.slicerCapabilities.objects)).toEqual(visuals.slicerProps.general.selfFilterEnabled);
        });

        it("Sort should be default so the sort UI shows", () => {
            expect(visuals.slicerCapabilities.sorting.custom).not.toBeDefined();
            expect(visuals.slicerCapabilities.sorting.default).toBeDefined();
        });

        it('getUpdatedSelfFilter', () => {
            let field = powerbi.data.SQExprBuilder.fieldDef({
                schema: 's',
                entity: "Entity2",
                column: "PropertyName"
            });

            let dataView: powerbi.DataView = slicerHelper.buildDataViewWithSelfFilter(powerbi.visuals.slicerOrientation.Orientation.Vertical, field);
            let updatedFilter = powerbi.visuals.SlicerUtil.getUpdatedSelfFilter('a', dataView.metadata);            
            let condition = <powerbi.data.SQContainsExpr>updatedFilter.conditions()[0];
            expect(condition).toBeDefined();
            let data = <powerbi.data.SQConstantExpr>condition.right;
            expect(data.value).toBe('a');
            
            updatedFilter = powerbi.visuals.SlicerUtil.getUpdatedSelfFilter('abc', dataView.metadata);
            condition = <powerbi.data.SQContainsExpr>updatedFilter.conditions()[0];
            expect(condition).toBeDefined();
            data = <powerbi.data.SQConstantExpr>condition.right;
            expect(data.value).toBe('abc');

            updatedFilter = powerbi.visuals.SlicerUtil.getUpdatedSelfFilter('', dataView.metadata);
            expect(updatedFilter).toBeUndefined();
        });
    });

    describe("CommonSlicer Tests", () => {
        function validateSelection(orientation: SlicerOrientation): void {
            let builder: slicerHelper.TestBuilder;
            beforeEach(() => builder = new slicerHelper.TestBuilder(orientation, 200, 600));

            afterEach(() => builder.destroy());

            let validateSelectionState = (orientation: SlicerOrientation, expectedSelected: number[]) => slicerHelper.validateSelectionState(orientation, expectedSelected, builder);

            it("SelectAll", () => {
                validateSelectionState(orientation, []);

                let selectAllItem: any = getSelectAllItem().eq(0);
                selectAllItem.d3Click(0, 0);

                validateSelectionState(orientation, [0, 1, 2, 3, 4, 5]);

                builder.slicerText.eq(1).d3Click(0, 0);
                validateSelectionState(orientation, [2, 3, 4, 5]);
                let partialSelect = getPartiallySelectedContainer();
                expect(partialSelect.length).toBe(1);
            });

            it("Partial select", () => {
                validateSelectionState(orientation, []);

                let selectAllItem: any = getSelectAllItem().eq(0);
                selectAllItem.d3Click(0, 0);

                validateSelectionState(orientation, [0, 1, 2, 3, 4, 5]);
                let partialSelect = getPartiallySelectedContainer();
                expect(partialSelect.length).toBe(0);

                let slicerText = builder.slicerText;
                slicerText.eq(1).d3Click(0, 0);
                partialSelect = getPartiallySelectedContainer();
                expect(partialSelect.length).toBe(1);
                validateSelectionState(orientation, [2, 3, 4, 5]);

                selectAllItem.d3Click(0, 0);
                validateSelectionState(orientation, []);
                partialSelect = getPartiallySelectedContainer();
                expect(partialSelect.length).toBe(0);

                slicerText.eq(1).d3Click(0, 0);
                partialSelect = getPartiallySelectedContainer();
                expect(partialSelect.length).toBe(1);
                validateSelectionState(orientation, [1]);
            });

            it("Partial selection works even when multi-select is disabled", () => {
                reconfigureSlicer(builder.interactiveDataViewOptions,
                    () => (<any>(builder.dataView.metadata.objects)).selection.singleSelect = true,
                    builder
                    );

                // Check the 'Select All' item
                let selectAllItem: any = getSelectAllItem().eq(0);
                selectAllItem.d3Click(0, 0);
                validateSelectionState(orientation, [0, 1, 2, 3, 4, 5]);

                // Unselect a single checkbox. This should work even though multi-selection is disabled.
                builder.slicerText.eq(1).d3Click(0, 0);
                validateSelectionState(orientation, [2, 3, 4, 5]);
                let partialSelect = getPartiallySelectedContainer();
                expect(partialSelect.length).toBe(1);
            });

            it("Clear", () => {
                let clearBtn = $(".clear");
                let slicerText = builder.slicerText;

                // Slicer click
                slicerText.eq(1).d3Click(0, 0);
                validateSelectionState(orientation, [1]);

                slicerText.eq(2).d3Click(0, 0);
                validateSelectionState(orientation, [1, 2]);

                /* Slicer clear */
                clearBtn.first().d3Click(0, 0);

                validateSelectionState(orientation, []);
                expect(builder.hostServices.onSelect).toHaveBeenCalledWith({ visualObjects: [] });
            });

            it("Slicer item select by text", () => {
                jasmine.clock().tick(0);
                builder.slicerText.eq(1).d3Click(0, 0);
                validateSelectionState(orientation, [1]);

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

            it("Slicer item repeated selection", () => {
                let slicerText = builder.slicerText;
                slicerText.eq(1).d3Click(0, 0);
                validateSelectionState(orientation, [1]);

                slicerText.last().d3Click(0, 0);
                validateSelectionState(orientation, [1, 5]);

                slicerText.last().d3Click(0, 0);
                validateSelectionState(orientation, [1]);
            });

            it("Single-select mode", () => {
                // Switch to single-select
                let dataView = builder.dataView;
                (<any>dataView.metadata.objects).selection.singleSelect = true;
                helpers.fireOnDataChanged(builder.visual, { dataViews: [dataView] });

                builder.initializeHelperElements();

                let slicerText = builder.slicerText;
                slicerText.eq(1).d3Click(0, 0);
                validateSelectionState(orientation, [1]);

                // Select another checkbox. The previously selected one should be cleared.
                slicerText.eq(2).d3Click(0, 0);
                validateSelectionState(orientation, [2]);

                // Select another checkbox using ctrl. The prvious one should not be cleared.
                slicerText.eq(1).d3Click(0, 0, 1);
                validateSelectionState(orientation, [1, 2]);

                // validate the style for select
                expect(getSlicerContainer(orientation).hasClass('isMultiSelectEnabled')).toBe(false);
            });

            it("Multi-select mode", () => {
                let slicerText = builder.slicerText;
                slicerText.eq(1).d3Click(0, 0);
                validateSelectionState(orientation, [1]);

                // Select another item. The previously selected one shouldn't be cleared.
                slicerText.eq(2).d3Click(0, 0);
                validateSelectionState(orientation, [1, 2]);

                // validate the style for multi select
                expect(getSlicerContainer(orientation).hasClass('isMultiSelectEnabled')).toBe(true);
            });

            it('Show the Select All item', () => {
                let dataView = builder.dataView;
                let visual = builder.visual;
                dataView.metadata.objects["selection"] = { selectAllCheckboxEnabled: false };

                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });
                expect(getSelectAllItem().length).toBe(0);

                dataView.metadata.objects["selection"] = { selectAllCheckboxEnabled: true };

                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });
                expect(getSelectAllItem().length).toBe(1);
            });

            it('Hide the Select All item', () => {
                let dataView = builder.dataView;
                let visual = builder.visual;
                dataView.metadata.objects["selection"] = { selectAllCheckboxEnabled: true };

                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });
                expect(getSelectAllItem().length).toBe(1);

                dataView.metadata.objects["selection"] = { selectAllCheckboxEnabled: false };

                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });
                expect(getSelectAllItem().length).toBe(0);
            });

            it('Single select only for non-aggregateable column', () => {
                let dataView = builder.dataView;
                let visual = builder.visual;
                dataView.metadata.objects["selection"] = { selectAllCheckboxEnabled: true };

                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });
                expect(getSelectAllItem().length).toBe(1);

                dataView.metadata.columns[0].discourageAggregationAcrossGroups = true;

                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });
                expect(getSelectAllItem().length).toBe(0);

                builder.initializeHelperElements();

                let slicerText = builder.slicerText;
                slicerText.eq(1).d3Click(0, 0);
                validateSelectionState(orientation, [1]);

                // Select another checkbox. The previously selected one should be cleared.
                slicerText.eq(2).d3Click(0, 0);
                validateSelectionState(orientation, [2]);

                // validate the style for select
                expect(getSlicerContainer(orientation).hasClass('isMultiSelectEnabled')).toBe(false);
            });
        }

        describe("VerticalSlicer selection validation", () => validateSelection(SlicerOrientation.Vertical));
        describe("HorizontalSlicer selection validation", () => validateSelection(SlicerOrientation.Horizontal));

        function validateFormattingPaneProperties(orientation: SlicerOrientation): void {
            let builder: slicerHelper.TestBuilder;
            beforeEach(() => builder = new slicerHelper.TestBuilder(orientation));

            afterEach(() => builder.destroy());

            it('Show hide header test', () => {
                expect($(".titleHeader").css('display')).toBe('block');

                let dataView = builder.dataView;
                dataView.metadata.objects["header"] = { show: false };
                helpers.fireOnDataChanged(builder.visual, { dataViews: [dataView] });

                expect($(".titleHeader").css('display')).toBe('none');
            });

            it('Header outline color test', () => {
                expect($(".titleHeader").css('border-color')).toBe('rgb(128, 128, 128)');
            });

            it('Background and font slicer text test', () => {
                expect($(".slicerText").css('color')).toBe('rgb(102, 102, 102)');

                let dataView = builder.dataView;
                dataView.metadata.objects["items"] = {
                    fontColor: { solid: { color: '#f5f5f5' } },
                    background: { solid: { color: '#f6f6f6' } },
                };
                helpers.fireOnDataChanged(builder.visual, { dataViews: [dataView] });

                expect($(".slicerText").css('color')).toBe('rgb(245, 245, 245)');
                expect($(".slicerText").css('background-color')).toBe('rgb(246, 246, 246)');
            });

            it('Background and font header test', () => {
                expect($(".slicerHeader .headerText").css('color')).toBe('rgb(0, 0, 0)');

                let dataView = builder.dataView;
                dataView.metadata.objects["header"] = {
                    show: true,
                    fontColor: { solid: { color: '#f5f5f5' } },
                    background: { solid: { color: '#f6f6f6' } },
                };
                helpers.fireOnDataChanged(builder.visual, { dataViews: [dataView] });

                expect($(".slicerHeader .headerText").css('color')).toBe('rgb(245, 245, 245)');
                expect($(".slicerHeader .headerText").css('background-color')).toBe('rgb(246, 246, 246)');
            });

            it('Test header border outline', () => {
                expect($(".titleHeader").css('border-width')).toBe('0px 0px 1px');

                let dataView = builder.dataView;
                let visual = builder.visual;

                dataView.metadata.objects = {
                    general: { orientation: orientation },
                    header: { outline: visuals.outline.none }
                };
                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });

                expect($(".titleHeader").css('border-width')).toBe('0px');

                dataView.metadata.objects["header"] = { outline: visuals.outline.topOnly };
                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });

                expect($(".titleHeader").css('border-width')).toBe('1px 0px 0px');

                dataView.metadata.objects["header"] = { outline: visuals.outline.topBottom };
                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });

                expect($(".titleHeader").css('border-width')).toBe('1px 0px');

                dataView.metadata.objects["header"] = { outline: visuals.outline.leftRight };
                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });

                expect($(".titleHeader").css('border-width')).toBe('0px 1px');

                dataView.metadata.objects["header"] = { outline: visuals.outline.frame };
                helpers.fireOnDataChanged(visual, { dataViews: [dataView] });

                expect($(".titleHeader").css('border-width')).toBe('1px');
            });

            it('Row text size', () => {
                let slicerText = builder.slicerText;
                let dataView = builder.dataView;

                let actualFontSize = parseFloat(slicerText.css('font-size'));
                expect(parseAndRoundFontSize(slicerText)).toBe(13);

                dataView.metadata.objects["items"] = { textSize: 14 };
                helpers.fireOnDataChanged(builder.visual, { dataViews: [dataView] });

                slicerText = $(".slicerText");
                actualFontSize = parseFloat(slicerText.css('font-size'));
                expect(parseAndRoundFontSize(slicerText)).toBe(19);
            });

            it('Header text size', () => {
                expect(parseAndRoundFontSize($(".slicerHeader .headerText"))).toBe(13);

                let dataView = builder.dataView;
                dataView.metadata.objects["header"] = {
                    show: true,
                    textSize: 14,
                };
                helpers.fireOnDataChanged(builder.visual, { dataViews: [dataView] });

                expect(parseAndRoundFontSize($(".slicerHeader .headerText"))).toBe(19);
            });
        }

        describe("VerticalSlicer formatting pane properties validation", () => validateFormattingPaneProperties(SlicerOrientation.Vertical));
        describe("HorizontalSlicer formatting pane properties validation", () => validateFormattingPaneProperties(SlicerOrientation.Horizontal));

        function validateLoadMoreData(orientation: SlicerOrientation): void {
            let builder: slicerHelper.TestBuilder;
            beforeEach(() => builder = new slicerHelper.TestBuilder(orientation));

            afterEach(() => builder.destroy());

            it("slicer loadMoreData noSegment", () => {
                let loadMoreSpy = spyOn(builder.hostServices, "loadMoreData");
                loadMoreData(builder);
                expect(loadMoreSpy).not.toHaveBeenCalled();
            });

            it("slicer loadMoreData", () => {
                let metadata: DataViewMetadata = {
                    columns: builder.dataViewMetadata.columns,
                    segment: {},
                };

                let dataView = { metadata: metadata, categorical: builder.dataViewCategorical };
                dataView.metadata.objects = slicerHelper.buildDefaultDataViewObjects(orientation);

                let interactiveDataViewOptions: VisualDataChangedOptions = {
                    dataViews: [dataView]
                };
                helpers.fireOnDataChanged(builder.visual, interactiveDataViewOptions);

                let loadMoreSpy = spyOn(builder.hostServices, "loadMoreData");
                loadMoreData(builder);
                expect(loadMoreSpy).toHaveBeenCalled();
            });

            it("slicer loadMoreData already called", () => {
                let metadata: DataViewMetadata = {
                    columns: builder.dataViewMetadata.columns,
                    segment: {},
                };

                let dataView = { metadata: metadata, categorical: builder.dataViewCategorical };
                dataView.metadata.objects = slicerHelper.buildDefaultDataViewObjects(orientation);

                let interactiveDataViewOptions: VisualDataChangedOptions = {
                    dataViews: [dataView]
                };
                helpers.fireOnDataChanged(builder.visual, interactiveDataViewOptions);

                let loadMoreSpy = spyOn(builder.hostServices, "loadMoreData");
                loadMoreData(builder);
                loadMoreData(builder);
                expect(loadMoreSpy.calls.all().length).toBe(1);
            });
        }

        describe("VerticalSlicer LoadMoreData validation", () => validateLoadMoreData(SlicerOrientation.Vertical));
        describe("HorizontalSlicer LoadMoreData validation", () => validateLoadMoreData(SlicerOrientation.Horizontal));

        function validateNullEmptyData(orientation) {
            let builder: slicerHelper.TestBuilder;
            beforeEach(() => builder = new slicerHelper.TestBuilder(orientation, 200, 600));

            afterEach(() => builder.destroy());

            it("Null dataView test", () => {
                expect($(".slicerText").length).toBe(6);

                helpers.fireOnDataChanged(builder.visual, { dataViews: [] });
                expect($(".slicerText").length).toBe(6);
            });
            
            it("Empty dataView test", () => {
                expect($(".slicerText").length).toBe(6);

                let dataView = slicerHelper.buildEmptyDataView();
                let interactiveDataViewOptions: VisualDataChangedOptions = {
                    dataViews: [dataView]
                };
                helpers.fireOnDataChanged(builder.visual, interactiveDataViewOptions);
                expect($(".slicerText").length).toBe(0);
            });
        }

        describe("VerticalSlicer Null and Empty data validation", () => validateNullEmptyData(SlicerOrientation.Vertical));
        describe("HorizontalSlicer Null and Empty data validation", () => validateNullEmptyData(SlicerOrientation.Horizontal));

        function validateOnClearSelectionWithDefaultValue(orientation: SlicerOrientation): void {
            let builder: slicerHelper.TestBuilder;
            let filterAnalyzed: boolean;
            beforeEach(() => {
                filterAnalyzed = false;
                builder = new slicerHelper.TestBuilder(orientation, 200, 600);
                builder.hostServices.analyzeFilter = (options: FilterAnalyzerOptions) => {
                    filterAnalyzed = true;
                    let defaultValueScopeIdentity = data.createDataViewScopeIdentity(data.SQExprUtils.getDataViewScopeIdentityComparisonExpr([builder.field], [data.SQExprBuilder.text('Banana')]));
                    return new mocks.FilterAnalyzerMock(SemanticFilter.getDefaultValueFilter(builder.field), [builder.field], undefined, [defaultValueScopeIdentity]);
                };
            });

            afterEach(() => builder.destroy());

            it("On Clear should reset the default value", () => {                
                (<visuals.Slicer>builder.visual).onClearSelection();
                expect(filterAnalyzed).toBe(true);
                jasmine.clock().tick(0);
                let selectedContainer = getSelectedContainer();
                expect(selectedContainer.length).toBe(1);

                if (orientation === SlicerOrientation.Vertical) {
                    // For vertical slicer, the element has .selected class is the checkbox.
                    let item = $(selectedContainer).closest('.slicerItemContainer');
                    let slicerText = $(item).find('.slicerText');
                    expect(slicerText.text()).toBe('Banana');
                }
                else
                {
                    expect(selectedContainer.text()).toBe('Banana');
                }
            });
        }

        describe("VerticalSlicer on clear selection", () => validateOnClearSelectionWithDefaultValue(SlicerOrientation.Vertical));
        describe("HorizontalSlicer on clear selection", () => validateOnClearSelectionWithDefaultValue(SlicerOrientation.Horizontal));
    });

    function getSelectAllItem(): JQuery {
        return $('.slicerText:contains("' + slicerHelper.SelectAllTextKey + '")');
    }

    function getSlicerContainer(orientation: SlicerOrientation): JQuery {
        let slicerContainer: JQuery;

        if (slicerHelper.isVerticalOrientation(orientation))
            slicerContainer = $('.slicerContainer');
        else
            slicerContainer = $('.horizontalSlicerContainer');

        return slicerContainer;
    }

    function getPartiallySelectedContainer(): JQuery {
        return $(".partiallySelected");
    }

    function getSelectedContainer(): JQuery {
        return $(".selected");
    }

    function parseAndRoundFontSize(element: JQuery): number {
        let fontSize = parseFloat(element.css('font-size'));
        return Math.round(fontSize);
    }

    function reconfigureSlicer(options: VisualDataChangedOptions, changeConfigCallback: () => void, builder: slicerHelper.TestBuilder): void {
        // Executes a callback that changes the slicer's configuration options,
        // and then sets the necessary test infrastructure back up.
        changeConfigCallback();

        helpers.fireOnDataChanged(builder.visual, options);
        builder.initializeHelperElements();
    }

    function loadMoreData(builder: slicerHelper.TestBuilder): void {
        (<visuals.Slicer>builder.visual).loadMoreData();
    }
}
