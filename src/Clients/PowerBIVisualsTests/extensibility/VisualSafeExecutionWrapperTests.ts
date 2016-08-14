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
    import ITelemetryService = powerbi.visuals.telemetry.ITelemetryService;

    describe('VisualSafeExecutionWrapper', () => {

        let visual: powerbi.IVisual,
            visualPlugin: powerbi.IVisualPlugin,
            wrapper: powerbi.IVisual,
            telemetryService: ITelemetryService;

        let visualMethods = ['init', 'update', 'destroy', 'onViewModeChanged', 'onClearSelection', 'canResizeTo', 'enumerateObjectInstances', 'enumerateObjectRepetition'];

        beforeEach(() => {
            visual = new mocks.MockVisualLegacy();
            visualPlugin = new mocks.MockVisualPlugin();  
            telemetryService = mocks.createMockTelemetryService();
            wrapper = new powerbi.extensibility.VisualSafeExecutionWrapper(visual, visualPlugin, telemetryService, true);
        });

        it("Should create instance of visual", () => {
            expect((<any>wrapper).wrappedVisual instanceof mocks.MockVisualLegacy).toBe(true);
            expect((<any>wrapper).wrappedVisual).toBe(visual);
        });

        visualMethods.forEach((name) => {
            it("Should relay " + name + " method", () => {
                let spy = spyOn((<any>wrapper).wrappedVisual, name);
                wrapper[name]();
                expect(spy.calls.count()).toBe(1);
            });
        });

        visualMethods.forEach((name) => {
            it("Should catch error for " + name + " method and log telemetry", () => {
                spyOn((<any>wrapper).wrappedVisual, name).and.throwError("Fake error");
                let logEventSpy = spyOn(telemetryService, 'logEvent');
                wrapper[name]();
                expect(logEventSpy.calls.count()).toBe(1);                
            });
        });
    });
}
