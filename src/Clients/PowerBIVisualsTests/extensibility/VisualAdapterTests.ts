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

    import createVisualAdapter = helpers.createVisualAdapter;
    import createInitOptions = helpers.createInitOptions;

    describe('VisualAdapter', () => {

        let visualApiVersionsBackup = powerbi.extensibility.visualApiVersions;

        beforeAll(() => {
            powerbi.extensibility.visualApiVersions = mocks.MockVisualVersions;
        });

        afterAll(() => {
            powerbi.extensibility.visualApiVersions = visualApiVersionsBackup;
        });

        describe('Deprecated Visual Methods', () => {
            let adapter: powerbi.IVisual & powerbi.extensibility.WrappedVisual;
            let spyData: jasmine.Spy;
            let spyResize: jasmine.Spy;
            let spyViewmode: jasmine.Spy;

            beforeEach(() => {
                adapter = <powerbi.IVisual & powerbi.extensibility.WrappedVisual>createVisualAdapter(mocks.MockVisualDeprecated);
                adapter.init(createInitOptions());
                spyData = spyOn(adapter, 'onDataChanged');
                spyResize = spyOn(adapter, 'onResizing');
                spyViewmode = spyOn(adapter, 'onViewModeChanged');
            });

            it("Data Update should trigger onDataChanged", () => {
                let dataViews: powerbi.DataView[] = [];
                adapter.update({
                    dataViews: dataViews,
                    viewport: { width: 11, height: 22 },
                    type: powerbi.VisualUpdateType.Data,
                    operationKind: powerbi.VisualDataChangeOperationKind.Create
                });
                expect(spyResize.calls.count()).toBe(0);
                expect(spyViewmode.calls.count()).toBe(0);
                expect(spyData.calls.count()).toBe(1);
                expect(adapter.onDataChanged).toHaveBeenCalledWith({
                    dataViews: dataViews,
                    operationKind: powerbi.VisualDataChangeOperationKind.Create
                });

            });

            it("Resize Update should trigger onResizing", () => {
                let viewport: powerbi.IViewport = { width: 11, height: 22 };
                adapter.update({
                    dataViews: [],
                    viewport: viewport,
                    type: powerbi.VisualUpdateType.Resize,
                    resizeMode: powerbi.ResizeMode.Resizing,
                });
                expect(spyViewmode.calls.count()).toBe(0);
                expect(spyData.calls.count()).toBe(0);
                expect(spyResize.calls.count()).toBe(1);
                expect(adapter.onResizing).toHaveBeenCalledWith(viewport, powerbi.ResizeMode.Resizing);
            });

            it("ViewMode Update should trigger onViewModeChanged", () => {
                let viewmode = powerbi.ViewMode.Edit;
                adapter.update({
                    dataViews: [],
                    viewport: { width: 11, height: 22 },
                    type: powerbi.VisualUpdateType.ViewMode,
                    viewMode: viewmode
                });
                expect(spyData.calls.count()).toBe(0);
                expect(spyResize.calls.count()).toBe(0);
                expect(spyViewmode.calls.count()).toBe(1);
                expect(adapter.onViewModeChanged).toHaveBeenCalledWith(viewmode);
            });

            it("Resize Update should trigger onResizing (even if visual has an update method)", () => {
                let visual = adapter.unwrap();
                visual.update = () => { };
                let spyUpdate = spyOn(visual, 'update');
                let viewport: powerbi.IViewport = { width: 11, height: 22 };
                adapter.update({
                    dataViews: [],
                    viewport: viewport,
                    type: powerbi.VisualUpdateType.Resize,
                    resizeMode: powerbi.ResizeMode.Resized,
                });
                expect(spyViewmode.calls.count()).toBe(0);
                expect(spyData.calls.count()).toBe(0);
                expect(spyUpdate.calls.count()).toBe(0);
                expect(spyResize.calls.count()).toBe(1);
                expect(adapter.onResizing).toHaveBeenCalledWith(viewport, powerbi.ResizeMode.Resized);
            });

            it("Resize Update should trigger onResizing AND update for custom visuals", () => {
                let customAdapter = <powerbi.IVisual & powerbi.extensibility.WrappedVisual>createVisualAdapter(mocks.MockVisualDeprecated, undefined, true);
                customAdapter.init(createInitOptions());

                let visual = customAdapter.unwrap();
                visual.update = () => { };
                let spyUpdate = spyOn(visual, 'update');
                let spyResize = spyOn(visual, 'onResizing');
                let viewport: powerbi.IViewport = { width: 11, height: 22 };
                customAdapter.update({
                    dataViews: [],
                    viewport: viewport,
                    type: powerbi.VisualUpdateType.Resize,
                    resizeMode: powerbi.ResizeMode.Resized,
                });
                expect(spyUpdate.calls.count()).toBe(1);
                expect(spyResize.calls.count()).toBe(1);
            });
        });

        describe('Legacy Visual', () => {
            it("Should not create instance of visual until init()", () => {
                let adapter = createVisualAdapter(mocks.MockVisualLegacy);
                expect((<any>adapter).visual).toBeUndefined();
            });

            it("Should create instance of legacy visual", () => {
                let adapter = createVisualAdapter(mocks.MockVisualLegacy);
                adapter.init(createInitOptions());
                expect((<any>adapter).visual instanceof mocks.MockVisualLegacy).toBe(true);
                expect((<any>adapter).legacy).toBe(true);
            });

            it("Should pass through host service unalterted", () => {
                let constructorOptions, initOptions;

                let mockHost = powerbitests.mocks.createVisualHostServices();
                let MockVisual = function (options) { constructorOptions = options; };
                MockVisual.prototype.init = function (options) { initOptions = options; };

                let adapter = createVisualAdapter(MockVisual);
                adapter.init(createInitOptions(mockHost));

                expect(initOptions.host).toBe(mockHost);
            });

            let visualMethods = ['update', 'destroy', 'onViewModeChanged', 'onClearSelection', 'canResizeTo', 'enumerateObjectInstances'];
            for (let name of visualMethods) {
                itShouldMethodRelay(mocks.MockVisualLegacy, undefined, name);
            }
        });

        //maps methods 1:1 (like the real v1.0.0)
        describe('New Visual 1 (mock 1.0.0)', () => {
            it("Should not create instance of visual until init()", () => {
                let adapter = createVisualAdapter(mocks.MockVisualV100, '1.0.0');
                expect((<any>adapter).visual).toBeUndefined();
            });

            it("Should create instance of new visual", () => {
                let adapter = createVisualAdapter(mocks.MockVisualV100, '1.0.0');
                adapter.init(createInitOptions());
                expect((<any>adapter).visual instanceof mocks.MockVisualV100).toBe(true);
                expect((<any>adapter).legacy).toBe(false);
            });

            it("Should pass host service into constructor via adapter mapping", () => {
                let constructorOptions, initOptions;

                let mockHost = powerbitests.mocks.createVisualHostServices();
                let MockVisual = function (options) { constructorOptions = options; };
                MockVisual.prototype.init = function (options) { initOptions = options; };

                let adapter = createVisualAdapter(MockVisual, '1.0.0');
                adapter.init(createInitOptions(mockHost));

                expect(constructorOptions.host).not.toBe(mockHost);
                expect(constructorOptions.host.canSelect).toBe(mockHost.canSelect);
            });

            it("Should pass init options to constructor", () => {
                let constructorOptions, initOptions;

                let mockInitOptions = createInitOptions();
                let MockVisual = function (options) { constructorOptions = options; };
                MockVisual.prototype.init = function (options) { initOptions = options; };

                let adapter = createVisualAdapter(MockVisual, '1.0.0');
                adapter.init(mockInitOptions);

                expect(initOptions).toBeUndefined();
                expect(constructorOptions.element).toBe(mockInitOptions.element.get(0));
            });

            let visualMethods = ['update', 'destroy', 'enumerateObjectInstances'];
            for (let name of visualMethods) {
                itShouldMethodRelay(mocks.MockVisualV100, '1.0.0', name);
            }
        });

        //renames a couple methods and re-routes them
        describe('New Visual 2 (mock 999.1.0)', () => {
            it("Should be able to rename host service properties", () => {
                let constructorOptions, initOptions;

                let mockHost = powerbitests.mocks.createVisualHostServices();
                let MockVisual = function (options) { constructorOptions = options; };
                MockVisual.prototype.init = function (options) { initOptions = options; };

                let adapter = createVisualAdapter(MockVisual, '999.1.0');
                adapter.init(createInitOptions(mockHost));

                expect(constructorOptions.host.canSelect).toBeUndefined();
                expect(constructorOptions.host.newCanSelect).toBe(mockHost.canSelect);
            });

            let visualMethods = { 'update': 'draw', 'destroy': 'remove', 'enumerateObjectInstances': 'enumerateObjectInstances' };
            for (let oldMethod in visualMethods) {
                itShouldMethodRelay(mocks.MockVisualV999, '999.1.0', oldMethod, visualMethods[oldMethod]);
            }
        });

        //doesn't override any methods (should inherit overloads from 1.1.0)
        describe('New Visual 3 (mock 999.2.0)', () => {
            it("Should be able to revert host service properties and add additional properties", () => {
                let constructorOptions, initOptions;

                let mockHost = powerbitests.mocks.createVisualHostServices();
                let MockVisual = function (options) { constructorOptions = options; };
                MockVisual.prototype.init = function (options) { initOptions = options; };

                let adapter = createVisualAdapter(MockVisual, '999.2.0');
                adapter.init(createInitOptions(mockHost));

                expect(constructorOptions.host.newCanSelect).toBeUndefined();
                expect(constructorOptions.host.canSelect).toBe(mockHost.canSelect);
                expect(constructorOptions.host.other()).toBe("other");
            });

            let visualMethods = { 'update': 'draw', 'destroy': 'remove', 'enumerateObjectInstances': 'enumerateObjectInstances' };
            for (let oldMethod in visualMethods) {
                itShouldMethodRelay(mocks.MockVisualV999, '999.2.0', oldMethod, visualMethods[oldMethod]);
            }
        });

        function itShouldMethodRelay(visual: Function, version: string, oldMethod: string, newMethod?: string) {
            if (!newMethod) {
                newMethod = oldMethod;
            }
            it("Should relay " + oldMethod + " method to " + newMethod, () => {
                let adapter = createVisualAdapter(visual, version);
                adapter.init(createInitOptions());
                let spy = spyOn((<any>adapter).visual, newMethod);
                adapter[oldMethod]({});
                expect(spy.calls.count()).toBe(1);
            });
        }
    });
}
