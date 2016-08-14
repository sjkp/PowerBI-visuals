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
    import createVisualAdapter = helpers.createVisualAdapter;
    import createInitOptions = helpers.createInitOptions;

    describe('Visual API v1.0.0', () => {
        var apiVersion = "1.0.0";

        it("Should create instance of new visual", () => {
            let adapter = createVisualAdapter(mocks.MockVisualV100, apiVersion);
            adapter.init(createInitOptions());
            expect((<any>adapter).visual instanceof mocks.MockVisualV100).toBe(true);
            expect((<any>adapter).legacy).toBe(false);
        });

        describe('Method overrides', () => {
            var adapter: powerbi.IVisual;

            beforeEach(() => {
                adapter = createVisualAdapter(mocks.MockVisualV100, apiVersion);
                adapter.init(createInitOptions());
            });

            it("Properly overrides the update method", () => {
                let spy = spyOn((<any>adapter).visual, 'update');
                let dataViews = [];
                let viewport = { width: 11, height: 22 };
                adapter.update({
                    viewport: viewport,
                    dataViews: dataViews,
                    type: powerbi.VisualUpdateType.Resize
                });
                expect(spy.calls.count()).toBe(1);
                let callArgs = <any>spy.calls.mostRecent().args[0];

                expect(callArgs.viewport).toBe(viewport);
                expect(callArgs.dataViews).toBe(dataViews);
                expect(callArgs.type).toBe(powerbi.VisualUpdateType.Resize);
            });

            it("update type should default to data if omitted", () => {
                let spy = spyOn((<any>adapter).visual, 'update');
                let dataViews = [];
                let viewport = { width: 11, height: 22 };
                adapter.update({
                    viewport: viewport,
                    dataViews: dataViews
                });
                expect(spy.calls.count()).toBe(1);

                let callArgs = <any>spy.calls.mostRecent().args[0];
                expect(callArgs.type).toBe(powerbi.VisualUpdateType.Data);
            });
            
            it("Translates resizeMode=resizing to correct updateType (Resize)", () => {
                let spy = spyOn((<any>adapter).visual, 'update');
                let dataViews = [];
                let viewport = { width: 11, height: 22 };
                adapter.update({
                    viewport: viewport,
                    dataViews: dataViews,
                    type: powerbi.VisualUpdateType.Resize,
                    resizeMode: powerbi.ResizeMode.Resizing
                });
                expect(spy.calls.count()).toBe(1);
                let callArgs = <any>spy.calls.mostRecent().args[0];

                expect(callArgs.type).toBe(powerbi.VisualUpdateType.Resize);                
            });            

            it("Translates resizeMode=resized to correct updateType (Resize | ResizeEnd)", () => {
                let spy = spyOn((<any>adapter).visual, 'update');
                let dataViews = [];
                let viewport = { width: 11, height: 22 };
                adapter.update({
                    viewport: viewport,
                    dataViews: dataViews,
                    type: powerbi.VisualUpdateType.Resize,
                    resizeMode: powerbi.ResizeMode.Resized
                });
                expect(spy.calls.count()).toBe(1);
                let callArgs = <any>spy.calls.mostRecent().args[0];

                expect(callArgs.type).toBe(powerbi.VisualUpdateType.Resize | powerbi.VisualUpdateType.ResizeEnd);                
            });  

            it("Properly overrides the destroy method", () => {
                let spy = spyOn((<any>adapter).visual, 'destroy');
                adapter.destroy();
                expect(spy.calls.count()).toBe(1);
            });

            it("Properly overrides the enumerateObjectInstances method", () => {
                let testObject = { objectName: "TestObject" };
                let spy = spyOn((<any>adapter).visual, 'enumerateObjectInstances');
                adapter.enumerateObjectInstances(testObject);
                expect(spy.calls.count()).toBe(1);

                let callArgs = <any>spy.calls.mostRecent().args[0];
                expect(callArgs).toBe(testObject);
            });

        });
    });
}