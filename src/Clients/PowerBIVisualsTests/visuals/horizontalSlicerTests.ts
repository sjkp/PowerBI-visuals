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
    }

    powerbitests.mocks.setLocale();

    describe("Horizontal Slicer DOM tests", () => {
        let visual: powerbi.IVisual;
        let element: JQuery;
        let hostServices = slicerHelper.createHostServices();
        let viewport = {
            height: 200,
            width: 300
        };
        let originalRequestAnimationFrameCallback: (callback: Function) => number;
        let slicerText: JQuery;
        let dataView: powerbi.DataView = slicerHelper.buildDefaultDataView();
        dataView.metadata.objects = slicerHelper.buildDefaultDataViewObjects(SlicerOrientation.Horizontal);
        let interactiveDataViewOptions: powerbi.VisualDataChangedOptions = {
            dataViews: [dataView]
        };

        beforeEach(() => {
            element = powerbitests.helpers.testDom("200", "600");

            let slicerRenderOptions: slicerHelper.RenderSlicerOptions = {
                visualType: slicerHelper.SlicerVisual,
                hostServices: hostServices,
                dataView: dataView,
                dataViewObjects: dataView.metadata.objects,
                orientation: SlicerOrientation.Horizontal,
            };

            visual = slicerHelper.initSlicer(element, slicerRenderOptions);

            originalRequestAnimationFrameCallback = window.requestAnimationFrame;
            window.requestAnimationFrame = (callback: () => void) => {
                callback();
                return 0;
            };
            jasmine.clock().install();

            helpers.fireOnDataChanged(visual, interactiveDataViewOptions);
        });

        afterEach(function () {
            window.requestAnimationFrame = originalRequestAnimationFrameCallback;
            jasmine.clock().uninstall();
        });

        xit("DOM validation", () => {
            spyOn(powerbi.visuals.valueFormatter, "format").and.callThrough();

            helpers.fireOnDataChanged(visual, interactiveDataViewOptions);

            expect($(".horizontalSlicerContainer")).toBeInDOM();
            expect($(".horizontalSlicerContainer .headerText")).toBeInDOM();
            expect($(".horizontalSlicerContainer .slicerHeader .clear")).toBeInDOM();
            expect($(".horizontalSlicerContainer .slicerBody")).toBeInDOM();
            expect($(".horizontalSlicerContainer .slicerBody .navigationArrow.left.show")).not.toBeInDOM();
            expect($(".horizontalSlicerContainer .slicerBody .navigationArrow.right.show")).not.toBeInDOM();
            expect($(".horizontalSlicerContainer .slicerBody .slicerItemsContainer .slicerText")).toBeInDOM();
            slicerText = getSlicerTextContainer();
            expect(slicerText.length).toBe(6);
            expect(slicerText.first().text()).toBe(slicerHelper.SelectAllTextKey);
            expect(slicerText.last().text()).toBe("Banana");

            expect(powerbi.visuals.valueFormatter.format).toHaveBeenCalledWith("Apple", undefined);
            expect(powerbi.visuals.valueFormatter.format).toHaveBeenCalledWith("Orange", undefined);
            expect(powerbi.visuals.valueFormatter.format).toHaveBeenCalledWith("Kiwi", undefined);
            expect(powerbi.visuals.valueFormatter.format).toHaveBeenCalledWith("Grapes", undefined);
            expect(powerbi.visuals.valueFormatter.format).toHaveBeenCalledWith("Banana", undefined);

            visual.onResizing(viewport);

            expect($(".horizontalSlicerContainer")).toBeInDOM();
            expect($(".horizontalSlicerContainer .headerText")).toBeInDOM();
            expect($(".horizontalSlicerContainer .slicerHeader .clear")).toBeInDOM();
            expect($(".horizontalSlicerContainer .slicerBody")).toBeInDOM();
            expect($(".horizontalSlicerContainer .slicerBody .navigationArrow.left.show")).not.toBeInDOM();
            expect($(".horizontalSlicerContainer .slicerBody .navigationArrow.right.show")).toBeInDOM();
            expect($(".horizontalSlicerContainer .slicerBody .slicerItemsContainer .slicerText")).toBeInDOM();
            slicerText = getSlicerTextContainer();
            expect(slicerText.length).toBe(4);
            expect(slicerText.first().text()).toBe(WrappedSelectAllTextKey); // This will be wrapped into two columns
            expect(slicerText.last().text()).toBe("Kiwi");
        });

        it("Text wraps into multiple columns when there is no enough space", () => {
            helpers.fireOnDataChanged(visual, interactiveDataViewOptions);

            expect($(".horizontalSlicerContainer .slicerBody .slicerItemsContainer .slicerText")).toBeInDOM();
            slicerText = getSlicerTextContainer();
            expect(slicerText.length).toBe(6);
            expect(slicerText.first().children().length).toBe(1);

            let viewport2 = {
                height: 200,
                width: 200
            };
            visual.onResizing(viewport2);

            slicerText = getSlicerTextContainer();
            expect(slicerText.length).toBe(3);
            expect(slicerText.first().children().length).toBe(2);
            expect(slicerText.first().children().first().text()).toBe("Select");
            expect(slicerText.first().children().last().text()).toBe("All");
        });

        xit("Validate scroll behavior", () => {
            visual.onResizing(viewport);
            slicerText = getSlicerTextContainer();
            expect($(".horizontalSlicerContainer .slicerBody .navigationArrow.left.show")).not.toBeInDOM();
            expect($(".horizontalSlicerContainer .slicerBody .navigationArrow.right.show")).toBeInDOM();
            expect(slicerText.length).toBe(4);
            expect(slicerText.last().text()).toBe("Kiwi");

            // Right Navigation
            navigate(NavigationDirection.Right);
            slicerText = getSlicerTextContainer();
            expect($(".horizontalSlicerContainer .slicerBody .navigationArrow.left.show")).toBeInDOM();
            expect($(".horizontalSlicerContainer .slicerBody .navigationArrow.right.show")).not.toBeInDOM();
            expect(slicerText.length).toBe(4);
            expect(slicerText.first().text()).toBe("Orange");
            expect(slicerText.last().text()).toBe("Banana");

            // Left Navigation
            navigate(NavigationDirection.Left);
            slicerText = getSlicerTextContainer();
            expect($(".horizontalSlicerContainer .slicerBody .navigationArrow.left.show")).not.toBeInDOM();
            expect($(".horizontalSlicerContainer .slicerBody .navigationArrow.right.show")).toBeInDOM();
            expect(slicerText.length).toBe(4);
            expect(slicerText.first().text()).toBe(WrappedSelectAllTextKey);
            expect(slicerText.last().text()).toBe("Kiwi");
        });

        xit("Validate scroll behavior with mouseWheel", () => {
            visual.onResizing(viewport);
            slicerText = getSlicerTextContainer();
            expect($(".horizontalSlicerContainer .slicerBody .navigationArrow.left.show")).not.toBeInDOM();
            expect($(".horizontalSlicerContainer .slicerBody .navigationArrow.right.show")).toBeInDOM();
            expect(slicerText.length).toBe(4);
            expect(slicerText.last().text()).toBe("Kiwi");

            let slicerBody = $(".slicerBody").get(0);

            // Right Navigation
            slicerBody.dispatchEvent(helpers.createMouseWheelEvent("mousewheel", -100));
            slicerText = getSlicerTextContainer();
            expect($(".horizontalSlicerContainer .slicerBody .navigationArrow.left.show")).toBeInDOM();
            expect($(".horizontalSlicerContainer .slicerBody .navigationArrow.right.show")).not.toBeInDOM();
            expect(slicerText.length).toBe(4);
            expect(slicerText.first().text()).toBe("Orange");
            expect(slicerText.last().text()).toBe("Banana");

            // Left Navigation
            slicerBody.dispatchEvent(helpers.createMouseWheelEvent("mousewheel", 100));
            slicerText = getSlicerTextContainer();
            expect($(".horizontalSlicerContainer .slicerBody .navigationArrow.left.show")).not.toBeInDOM();
            expect($(".horizontalSlicerContainer .slicerBody .navigationArrow.right.show")).toBeInDOM();
            expect(slicerText.length).toBe(4);
            expect(slicerText.first().text()).toBe(WrappedSelectAllTextKey);
            expect(slicerText.last().text()).toBe("Kiwi");
        });

        it("Validate scroll behavior with 1 visible item", () => {
            // smaller dataset          
            let dataview2 = slicerHelper.buildSequenceDataView(0, 3);
            dataview2.metadata.objects = slicerHelper.buildDefaultDataViewObjects(SlicerOrientation.Horizontal);

            helpers.fireOnDataChanged(visual, { dataViews: [dataview2] });

            let viewport = {
                height: 200,
                width: 80
            };
            visual.onResizing(viewport);
            slicerText = getSlicerTextContainer();
            expect(slicerText.length).toBe(1);
            slicerHelper.validateSlicerItem(WrappedSelectAllTextKey, 0);

            // Right Navigation
            navigate(NavigationDirection.Right);
            slicerText = getSlicerTextContainer();
            slicerHelper.validateSlicerItem("fruit0");

            // Right Navigation
            navigate(NavigationDirection.Right);
            slicerHelper.validateSlicerItem("fruit1");

            // Right Navigation
            navigate(NavigationDirection.Right);
            slicerHelper.validateSlicerItem("fruit2");

            // Left Navigation
            navigate(NavigationDirection.Left);
            slicerHelper.validateSlicerItem("fruit1");

            // Left Navigation
            navigate(NavigationDirection.Left);
            slicerHelper.validateSlicerItem("fruit0");
            
            // Left Navigation
            navigate(NavigationDirection.Left);
            slicerHelper.validateSlicerItem(WrappedSelectAllTextKey, 0);
        });

    });

    function getSlicerTextContainer(): JQuery {
        return $(".slicerText");
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
        (<any>navigationButton.first()).d3Click(0, 0);
    }
}