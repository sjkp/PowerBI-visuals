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
    import ScriptVisual = powerbi.visuals.ScriptVisual;
    import scriptVisualCapabilities = powerbi.visuals.scriptVisualCapabilities;

    module ScriptVisualHelpers {
        export function buildUpdateOptions(viewport: powerbi.IViewport, objects: powerbi.DataViewObjects, imageData?: string): powerbi.VisualUpdateOptions {
            let options: powerbi.VisualUpdateOptions = <powerbi.VisualUpdateOptions>{
                viewport: viewport,
                dataViews: [{
                    metadata: {
                        columns: [],
                        objects: objects,
                    }
                }],
            };

            if (imageData) {
                options.dataViews[0].scriptResult = {
                    imageBase64: imageData
                };
            }

            return options;
        };

        export function buildInitOptions(element: JQuery, viewport: powerbi.IViewport, hostServices: powerbi.IVisualHostServices) {            
            let options = {
                element: $(element[0]),
                host: hostServices,
                style: powerbi.visuals.visualStyles.create(),
                viewport: viewport,
                animation: {
                    transitionImmediate: true
                },
            };

            return options;
        }
    }

    describe("scriptVisual Tests", () => {

        it('registered capabilities', () => {
            let pluginCapabilities = powerbi.visuals.plugins.scriptVisual.capabilities;
            expect(pluginCapabilities.toString()).toBe(scriptVisualCapabilities.toString());
        });

        it("Capabilities dataViewMappings should include the script result definition", () => {
            expect(scriptVisualCapabilities.dataViewMappings).toBeDefined();
            expect(scriptVisualCapabilities.dataViewMappings.length).toBe(1);
            expect(scriptVisualCapabilities.dataViewMappings[0].scriptResult).toBeDefined();
            expect(scriptVisualCapabilities.dataViewMappings[0].scriptResult.dataInput).toBeDefined();
            expect(scriptVisualCapabilities.dataViewMappings[0].scriptResult.dataInput.table).toBeDefined();
            expect(scriptVisualCapabilities.dataViewMappings[0].scriptResult.script).toBeDefined();
            expect(scriptVisualCapabilities.dataViewMappings[0].scriptResult.script.source).toBeDefined();
            expect(scriptVisualCapabilities.dataViewMappings[0].scriptResult.script.provider).toBeDefined();
        });

        it("Capabilities should include dataRoles", () => {
            expect(scriptVisualCapabilities.dataRoles).toBeDefined();
            expect(scriptVisualCapabilities.dataRoles.length).toBe(1);
            expect(scriptVisualCapabilities.dataRoles[0].name).toBe('Values');
        });

        it('registered capabilities: objects', () => {
            expect(powerbi.visuals.plugins.scriptVisual.capabilities.objects).toBeDefined();
        });

        describe('rendering', () => {
            let element: JQuery;
            let viewport: powerbi.IViewport;
            let scriptVisual: ScriptVisual;

            beforeEach(() => {
                element = powerbitests.helpers.testDom('200', '300');
                viewport = {
                    height: element.height(),
                    width: element.width() 
                };
                let hostServices = mocks.createVisualHostServices();
                let initOptions = ScriptVisualHelpers.buildInitOptions(element, viewport, hostServices);
                scriptVisual = new ScriptVisual({ canRefresh: true });
                scriptVisual.init(initOptions);
            });

            it('no visual configuration', () => {
                expect(element.children().length).toBe(0);
            });

            it('empty div with no saved image', () => {
                let visualUpdateOptions = ScriptVisualHelpers.buildUpdateOptions(viewport, {});
                scriptVisual.update(visualUpdateOptions);

                //Verifying the DOM
                let imageElement = element.find('.autoScaleImage');
                expect(imageElement.attr('src')).toBeUndefined();
            });

            it('visual shows the image from the dataView result', () => {
                let visualUpdateOptions = ScriptVisualHelpers.buildUpdateOptions(viewport, {}, 'iVBORw0KGgoAAAANSUhEUgAAA3gAAAIQ');
                scriptVisual.update(visualUpdateOptions);

                //Verifying the DOM
                let imageDiv = element.find('.autoScaleImageContainer');
                let imageElement = element.find('.autoScaleImage');
                let imageUrl = imageElement.attr('src');
                let isUrlEqual = (imageUrl === 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3gAAAIQ') || (imageUrl === '"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3gAAAIQ"');
                expect(isUrlEqual).toBeTruthy();
                expect(imageDiv.css('height')).toBe(viewport.height + 'px');
                expect(imageDiv.css('width')).toBe(viewport.width + 'px');
            });

            it('visual with static image shows a warning', () => {
                let warningSpy = jasmine.createSpy('setWarnings');
                let hostServices = mocks.createVisualHostServices();
                hostServices.setWarnings = warningSpy;

                scriptVisual = new ScriptVisual({ canRefresh: false });
                let visualInitOptions = ScriptVisualHelpers.buildInitOptions(element, viewport, hostServices);
                scriptVisual.init(visualInitOptions);

                let visualUpdateOptions = ScriptVisualHelpers.buildUpdateOptions(viewport, {}, 'iVBORw0KGgoAAAANSUhEUgAAA3gAAAIQ');
                scriptVisual.update(visualUpdateOptions);

                expect(warningSpy).toHaveBeenCalled();
                expect(warningSpy.calls.count()).toBe(1);
                expect(warningSpy.calls.argsFor(0)[0][0].code).toBe('ScriptVisualNotRefreshed');
            });

            it('non-static visual should not show a warning', () => {
                let warningSpy = jasmine.createSpy('setWarnings');
                let hostServices = mocks.createVisualHostServices();
                hostServices.setWarnings = warningSpy;

                scriptVisual = new ScriptVisual({ canRefresh: true });
                let visualInitOptions = ScriptVisualHelpers.buildInitOptions(element, viewport, hostServices);
                scriptVisual.init(visualInitOptions);

                let visualUpdateOptions = ScriptVisualHelpers.buildUpdateOptions(viewport, {}, 'iVBORw0KGgoAAAANSUhEUgAAA3gAAAIQ');
                scriptVisual.update(visualUpdateOptions);

                expect(warningSpy).not.toHaveBeenCalled();
            });
        });
    });
}
