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
    import SlicerOrientation = powerbi.visuals.slicerOrientation.Orientation;

    const WrappedSelectAllTextKey = "SelectAll";
    const enum NavigationDirection {
        Left,
        Right
    };

    let dataViewMetadataWithLongName = slicerHelper.buildDataViewMetadataWithLongName();

    powerbitests.mocks.setLocale();

    describe("Horizontal Slicer DOM tests", () => {
        let visual: powerbi.IVisual;
        let element: JQuery;
        let hostServices = slicerHelper.createHostServices();
        let viewport = {
            height: 200,
            width: 300
        };
        let slicerText: JQuery;
        let field = powerbi.data.SQExprBuilder.fieldDef({
            schema: 's',
            entity: "Entity2",
            column: "PropertyName"
        });
        let dataView: powerbi.DataView = slicerHelper.buildDefaultDataView(field);
        dataView.metadata.objects = slicerHelper.buildDefaultDataViewObjects(SlicerOrientation.Horizontal);
        let interactiveDataViewOptions: powerbi.VisualDataChangedOptions = {
            dataViews: [dataView]
        };

        beforeEach(() => {
            jasmine.clock().install();

            element = powerbitests.helpers.testDom("200", "600");

            let slicerRenderOptions: slicerHelper.RenderSlicerOptions = {
                visualType: slicerHelper.SlicerVisual,
                hostServices: hostServices,
                dataView: dataView,
                dataViewObjects: dataView.metadata.objects,
                orientation: SlicerOrientation.Horizontal,
            };

            visual = slicerHelper.initSlicer(element, slicerRenderOptions, field);
        });

        afterEach(function () {
            jasmine.clock().uninstall();
        });

        it("DOM validation", () => {
            spyOn(powerbi.visuals.valueFormatter, "format").and.callThrough();

            helpers.runWithImmediateAnimationFrames(() => {
                helpers.fireOnDataChanged(visual, interactiveDataViewOptions);

                expect($(".horizontalSlicerContainer")).toBeInDOM();
                expect($(".horizontalSlicerContainer .headerText")).toBeInDOM();
                expect($(".horizontalSlicerContainer .slicerHeader .clear")).toBeInDOM();
                expect($(".horizontalSlicerContainer .slicerBody")).toBeInDOM();
                expect($(".horizontalSlicerContainer.canScrollLeft")).not.toBeInDOM();
                expect($(".horizontalSlicerContainer.canScrollRight")).not.toBeInDOM();
                expect($(".horizontalSlicerContainer .slicerBody .slicerItemsContainer .slicerText")).toBeInDOM();
                slicerText = getSlicerTextContainer();
                expect(slicerText.length).toBe(6);
                expect(slicerText.first().text()).toBe(slicerHelper.SelectAllTextKey);
                expect(slicerText.first().attr('title')).toBe(slicerHelper.SelectAllTextKey);
                expect(slicerText.last().text()).toBe("Banana");
                expect(slicerText.last().attr('title')).toBe("Banana");

                expect(powerbi.visuals.valueFormatter.format).toHaveBeenCalledWith("Apple", undefined);
                expect(powerbi.visuals.valueFormatter.format).toHaveBeenCalledWith("Orange", undefined);
                expect(powerbi.visuals.valueFormatter.format).toHaveBeenCalledWith("Kiwi", undefined);
                expect(powerbi.visuals.valueFormatter.format).toHaveBeenCalledWith("Grapes", undefined);
                expect(powerbi.visuals.valueFormatter.format).toHaveBeenCalledWith("Banana", undefined);

                visual.onResizing(viewport);
                jasmine.clock().tick(0);
                expect($(".horizontalSlicerContainer")).toBeInDOM();
                expect($(".horizontalSlicerContainer .headerText")).toBeInDOM();
                expect($(".horizontalSlicerContainer .slicerHeader .clear")).toBeInDOM();
                expect($(".horizontalSlicerContainer .slicerBody")).toBeInDOM();
                expect($(".horizontalSlicerContainer.canScrollLeft")).not.toBeInDOM();
                expect($(".horizontalSlicerContainer.canScrollRight")).toBeInDOM();
                expect($(".horizontalSlicerContainer .slicerBody .navigationArrow.right").css("visibility")).toBe("visible");
                expect($(".horizontalSlicerContainer .slicerBody .slicerItemsContainer .slicerText")).toBeInDOM();
                slicerText = getSlicerTextContainer();
                expect(slicerText.length).toBe(4);
                expect(slicerText.first().text()).toBe(WrappedSelectAllTextKey); // This will be wrapped into two columns
                expect(slicerText.first().attr('title').trim()).toBe(slicerHelper.SelectAllTextKey);
                expect(slicerText.last().text()).toBe("Kiwi");
                expect(slicerText.last().attr('title')).toBe("Kiwi");
            });
        });

        it("DOM Validation - Tooltip of Long Text", () => {
            let dataView2: powerbi.DataView = {
                metadata: dataViewMetadataWithLongName,
                categorical: {
                    categories: [{
                        source: dataViewMetadataWithLongName.columns[0],
                        values: slicerHelper.longSlicerItems,
                        identity: [
                            mocks.dataViewScopeIdentityWithEquality(field, "First"),
                            mocks.dataViewScopeIdentityWithEquality(field, "Second"),
                            mocks.dataViewScopeIdentityWithEquality(field, "Third")
                        ],
                        identityFields: [field],
                    }]
                }
            };

            helpers.runWithImmediateAnimationFrames(() => {
                helpers.fireOnDataChanged(visual, { dataViews: [dataView2] });
                jasmine.clock().tick(50);

                // TODO: figure out why this is failing!!!
                //Test Slicer header tooltip
                //let header = $(".horizontalSlicerContainer .slicerHeader");
                //expect(header).toBeInDOM();
                //expect(header.first().attr('title')).toBe(dataView2.metadata.columns[0].displayName);

                //Test Slicer Items tooltip
                slicerText = getSlicerTextContainer();
                expect(slicerText.length).toBe(3);
                for (let i = 0; i < dataView2.categorical.categories[0].values.length; i++) {
                    expect(slicerText[i].title).toBe(dataView2.categorical.categories[0].values[i]);
                }
            });
        });

        it("Text wraps into multiple columns when there is no enough space", () => {
            helpers.runWithImmediateAnimationFrames(() => {
                helpers.fireOnDataChanged(visual, interactiveDataViewOptions);
                jasmine.clock().tick(0);
                expect($(".horizontalSlicerContainer .slicerBody .slicerItemsContainer .slicerText")).toBeInDOM();
                slicerText = getSlicerTextContainer();
                expect(slicerText.length).toBe(6);
                expect(slicerText.first().children().length).toBe(1);

                let viewport2 = {
                    height: 200,
                    width: 200
                };
                visual.onResizing(viewport2);
                jasmine.clock().tick(0);
                slicerText = getSlicerTextContainer();
                expect(slicerText.length).toBe(3);
                expect(slicerText.first().children().length).toBe(2);
                expect(slicerText.first().children().first().text()).toBe("Select");
                expect(slicerText.first().children().last().text()).toBe("All");
                expect(slicerText.attr('title')).toBe(slicerHelper.SelectAllTextKey);
            });
        });

        it("Validate scroll behavior", () => {
            helpers.runWithImmediateAnimationFrames(() => {
                helpers.fireOnDataChanged(visual, interactiveDataViewOptions);
                jasmine.clock().tick(0);

                visual.onResizing(viewport);
                jasmine.clock().tick(0);
                slicerText = getSlicerTextContainer();
                expect($(".horizontalSlicerContainer.canScrollLeft")).not.toBeInDOM();
                expect($(".horizontalSlicerContainer.canScrollRight")).toBeInDOM();
                expect(slicerText.length).toBe(4);
                expect(slicerText.last().text()).toBe("Kiwi");

                // Right Navigation
                navigate(NavigationDirection.Right);
                jasmine.clock().tick(0);
                slicerText = getSlicerTextContainer();
                expect($(".horizontalSlicerContainer.canScrollLeft")).toBeInDOM();
                expect($(".horizontalSlicerContainer.canScrollRight")).not.toBeInDOM();
                expect(slicerText.length).toBe(4);
                expect(slicerText.first().text()).toBe("Orange");
                expect(slicerText.last().text()).toBe("Banana");

                // Left Navigation
                navigate(NavigationDirection.Left);
                jasmine.clock().tick(0);
                slicerText = getSlicerTextContainer();
                expect($(".horizontalSlicerContainer.canScrollLeft")).not.toBeInDOM();
                expect($(".horizontalSlicerContainer.canScrollRight")).toBeInDOM();
                expect(slicerText.length).toBe(4);
                expect(slicerText.first().text()).toBe(WrappedSelectAllTextKey);
                expect(slicerText.last().text()).toBe("Kiwi");
            });
        });

        it("Validate scroll behavior with mouseWheel", () => {
            helpers.runWithImmediateAnimationFrames(() => {
                helpers.fireOnDataChanged(visual, interactiveDataViewOptions);
                jasmine.clock().tick(0);

                visual.onResizing(viewport);
                jasmine.clock().tick(0);
                slicerText = getSlicerTextContainer();
                expect($(".horizontalSlicerContainer.canScrollLeft")).not.toBeInDOM();
                expect($(".horizontalSlicerContainer.canScrollRight")).toBeInDOM();
                expect(slicerText.length).toBe(4);
                expect(slicerText.last().text()).toBe("Kiwi");
                expect(slicerText.last().attr('title')).toBe("Kiwi");

                let slicerBody = $(".slicerBody").get(0);

                // Right Navigation
                slicerBody.dispatchEvent(helpers.createMouseWheelEvent("mousewheel", 0, -100, 0));
                jasmine.clock().tick(0);
                slicerText = getSlicerTextContainer();
                expect($(".horizontalSlicerContainer.canScrollLeft")).toBeInDOM();
                expect($(".horizontalSlicerContainer.canScrollRight")).not.toBeInDOM();
                expect(slicerText.length).toBe(4);
                expect(slicerText.first().text()).toBe("Orange");
                expect(slicerText.first().attr('title')).toBe("Orange");
                expect(slicerText.last().text()).toBe("Banana");
                expect(slicerText.last().attr('title')).toBe("Banana");

                // Left Navigation
                slicerBody.dispatchEvent(helpers.createMouseWheelEvent("mousewheel", 0, 100, 0));
                jasmine.clock().tick(0);
                slicerText = getSlicerTextContainer();
                expect($(".horizontalSlicerContainer.canScrollLeft")).not.toBeInDOM();
                expect($(".horizontalSlicerContainer.canScrollRight")).toBeInDOM();
                expect(slicerText.length).toBe(4);
                expect(slicerText.first().text()).toBe(WrappedSelectAllTextKey);
                expect(slicerText.first().attr('title')).toBe(slicerHelper.SelectAllTextKey);
                expect(slicerText.last().text()).toBe("Kiwi");
                expect(slicerText.last().attr('title')).toBe("Kiwi");
            });
        });

        it("Validate scroll behavior with 1 visible item", () => {
            // smaller dataset          
            let dataview2 = slicerHelper.buildSequenceDataView(field, 0, 3);
            dataview2.metadata.objects = slicerHelper.buildDefaultDataViewObjects(SlicerOrientation.Horizontal);

            helpers.runWithImmediateAnimationFrames(() => {
                helpers.fireOnDataChanged(visual, { dataViews: [dataview2] });

                let viewport = {
                    height: 200,
                    width: 80
                };
                visual.onResizing(viewport);
                jasmine.clock().tick(0);
                slicerText = getSlicerTextContainer();
                expect(slicerText.length).toBe(1);
                slicerHelper.validateSlicerItem(WrappedSelectAllTextKey, 0);

                // Right Navigation
                navigate(NavigationDirection.Right);
                jasmine.clock().tick(0);
                slicerText = getSlicerTextContainer();
                slicerHelper.validateSlicerItem("fruit0");

                // Right Navigation
                navigate(NavigationDirection.Right);
                jasmine.clock().tick(0);
                slicerHelper.validateSlicerItem("fruit1");

                // Right Navigation
                navigate(NavigationDirection.Right);
                jasmine.clock().tick(0);
                slicerHelper.validateSlicerItem("fruit2");

                // Left Navigation
                navigate(NavigationDirection.Left);
                jasmine.clock().tick(0);
                slicerHelper.validateSlicerItem("fruit1");

                // Left Navigation
                navigate(NavigationDirection.Left);
                jasmine.clock().tick(0);
                slicerHelper.validateSlicerItem("fruit0");
            
                // Left Navigation
                navigate(NavigationDirection.Left);
                jasmine.clock().tick(0);
                slicerHelper.validateSlicerItem(WrappedSelectAllTextKey, 0);
            });
        });

        it("DOM Validation - SearchHeader visible", () => {
            expect($('.searchHeader').length).toBe(1);
            expect($(".searchHeader").css('display')).toBe('none');
            let dataView: powerbi.DataView = slicerHelper.buildDataViewWithSelfFilter(SlicerOrientation.Vertical, field);
            helpers.fireOnDataChanged(visual, { dataViews: [dataView] });
            expect($('.searchHeader').length).toBe(1);
            expect($(".searchHeader").css('display')).not.toBe('none');

            let searchKey = '  search key ';
            $('.searchInput').val(searchKey);
            helpers.fireOnDataChanged(visual, { dataViews: [dataView] });

            let searchInput = $('.searchInput');
            // Since the data view don't have search key specified, this input value should reflect the search value. 
            // This is for the case when search is turned off when there is a search key. After search is turned on again, we should clear the value.
            expect(searchInput.val()).toBe('');
        });

        it("Search input keyup event", () => {
            let dataView: powerbi.DataView = slicerHelper.buildDataViewWithSelfFilter(SlicerOrientation.Vertical, field);
            helpers.fireOnDataChanged(visual, { dataViews: [dataView] });
            let searchHeader = $('.searchHeader');
            let searchBox = searchHeader.find('input');
            searchBox.d3Click(0, 0);
            let searchSpy = spyOn(powerbi.visuals.SlicerWebBehavior, 'startSearch');

            searchBox.d3KeyEvent('keyup', 'a', 65);
            jasmine.clock().tick(200);
            expect(searchSpy).not.toHaveBeenCalled();
        });

        it("Search input keydown with enter key event", () => {
            let dataView: powerbi.DataView = slicerHelper.buildDataViewWithSelfFilter(SlicerOrientation.Vertical, field);
            helpers.fireOnDataChanged(visual, { dataViews: [dataView] });
            let searchHeader = $('.searchHeader');
            let searchBox = searchHeader.find('input');
            searchBox.d3Click(0, 0);
            let searchSpy = spyOn(powerbi.visuals.SlicerWebBehavior, 'startSearch');
            searchBox.d3KeyEvent('keydown', 'a', 65);
            expect(searchSpy).not.toHaveBeenCalled();
        });

    });

    function getSlicerTextContainer(): JQuery {
        return $(slicerHelper.slicerTextClassSelector);
    }

    function navigate(direction: NavigationDirection): void {
        let navigationButton: JQuery;
        switch (direction) {
            case NavigationDirection.Left:
                navigationButton = $(".navigationArrow.left");
                break;

            case NavigationDirection.Right:
            default:
                navigationButton = $(".navigationArrow.right");
                break;           
        }
        navigationButton.first().d3Click(0, 0);
    }
}
