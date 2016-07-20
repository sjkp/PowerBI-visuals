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
    import IVisualHostServices = powerbi.IVisualHostServices;

    let mockVisualGuid = 'customDebugViz';
    class MockVisual implements powerbi.IVisual {
        init() { }
        update() { }
    }
    let mockVisualPlugin: powerbi.IVisualPlugin = {
        name: mockVisualGuid,
        capabilities: {},
        create: () => new MockVisual(),
        custom: true
    };

    describe("Debug Visual", () => {

        beforeEach(() => {
            powerbi.localStorageService.setData('DEVELOPMENT_SERVER_URL', 'vrm/');
            powerbi.localStorageService.setData('DEVELOPER_MODE_ENABLED', true);
        });

        const viewport: powerbi.IViewport = {
            height: 500,
            width: 500
        };
        let style = powerbi.visuals.visualStyles.create();

        function buildUpdateOptions(viewport: powerbi.IViewport, object: powerbi.DataView): powerbi.VisualUpdateOptions {
            return {
                viewport: viewport,
                dataViews: [object],
            };
        };

        describe("visual", () => {
            let host: IVisualHostServices;
            let $element: JQuery;
            let initOptions: powerbi.VisualInitOptions;
            let debugVisual: powerbi.visuals.system.DebugVisual;
            let getSpy: jasmine.Spy;
            let getScriptSpy: jasmine.Spy;
            let getJSONSpy: jasmine.Spy;
            let capabilities: powerbi.VisualCapabilities;

            beforeEach(() => {

                host = mocks.createVisualHostServices();
                $element = helpers.testDom("500", "500");

                getSpy = spyOn($, 'get').and.callFake(url => {
                    let d = $.Deferred();
                    if (url.match(/status$/)) {
                        d.resolve(Date.now() + "\n" + mockVisualGuid);
                    } else if (url.match(/visual\.css$/)) {
                        d.resolve('.hello{}');
                    }
                    return d.promise();
                });

                capabilities = { dataRoles: null };

                getJSONSpy = spyOn($, 'getJSON').and.callFake(url => {
                    let d = $.Deferred();
                    d.resolve({
                        visual: {
                            guid: mockVisualGuid
                        },
                        capabilities: capabilities
                    });
                    return d.promise();
                });

                getScriptSpy = spyOn($, 'getScript').and.callFake(url => {
                    let d = $.Deferred();
                    window['powerbi']['visuals']['plugins'][mockVisualGuid] = mockVisualPlugin;
                    d.resolve(null);
                    return d.promise();
                });

                initOptions = {
                    element: $element,
                    host: host,
                    viewport: viewport,
                    style: style
                };

                debugVisual = new powerbi.visuals.system.DebugVisual();
                debugVisual.init(initOptions);
            });

            describe("init", () => {
                it("Should override capabilities with capabilities in pbiviz.json", () => {
                    let plugin = window['powerbi']['visuals']['plugins'][mockVisualGuid];
                    expect(plugin.capabilities).toBe(capabilities);
                });
            });

            describe("update", () => {
                it("update with null dataview should call adaptor's update", () => {
                    let spy = spyOn((<any>debugVisual).adapter, 'update');
                    debugVisual.update(buildUpdateOptions(viewport, null));
                    let elem = $element.find('.debugVisualContainer').find('.visual-' + mockVisualGuid);
                    expect(spy).toHaveBeenCalled();
                    expect(elem.length).toBe(1);
                });
            });

            describe("destroy", () => {
                it("destroy should call adaptor's destroy", () => {
                    let spy = spyOn((<any>debugVisual).adapter, 'destroy');
                    debugVisual.destroy();
                    expect(spy).toHaveBeenCalled();
                });
            });

            describe("refresh", () => {
                it("should reload visual from dev server", () => {
                    let adapterSpy = spyOn(powerbi.extensibility, 'createVisualAdapter').and.callThrough();

                    expect(getJSONSpy.calls.count()).toBe(1);
                    expect(getScriptSpy.calls.count()).toBe(1);
                    expect(getSpy.calls.count()).toBe(2);

                    (<any>debugVisual).reloadAdapter();

                    expect(adapterSpy).toHaveBeenCalled();
                    expect(getJSONSpy.calls.count()).toBe(2);
                    expect(getScriptSpy.calls.count()).toBe(2);
                    expect(getSpy.calls.count()).toBe(4);
                });

                it("should reload host capabilities if they've changed", () => {
                    let hostSpy = spyOn((<any>debugVisual).host, 'visualCapabilitiesChanged').and.callFake(() => { });

                    (<any>debugVisual).reloadAdapter();
                    expect(hostSpy.calls.count()).toBe(0);

                    capabilities = {};

                    (<any>debugVisual).reloadAdapter();
                    expect(hostSpy.calls.count()).toBe(1);

                    (<any>debugVisual).reloadAdapter();
                    expect(hostSpy.calls.count()).toBe(1);
                });

                it("update should be called upon refesh if previously updated", () => {
                    let adapterUpdateSpy = spyOn((<any>debugVisual).adapter, 'update');

                    debugVisual.update(buildUpdateOptions(viewport, { metadata: null }));
                    expect(adapterUpdateSpy).toHaveBeenCalled();

                    //new spy because adapter is re-created on reloadAdapter()
                    let visual = new MockVisual();
                    spyOn(powerbi.extensibility, 'createVisualAdapter').and.returnValue(visual);
                    let adapterUpdateSpy2 = spyOn(visual, 'update');

                    (<any>debugVisual).reloadAdapter();
                    expect(adapterUpdateSpy2).toHaveBeenCalled();
                });

                it("update should include previous update options with type set to all", () => {
                    let data: powerbi.DataView = { metadata: null };
                    debugVisual.update(buildUpdateOptions(viewport, data));

                    //new spy because adapter is re-created on reloadAdapter()
                    let visual = new MockVisual();
                    spyOn(powerbi.extensibility, 'createVisualAdapter').and.returnValue(visual);
                    let adapterUpdateSpy = spyOn(visual, 'update');

                    (<any>debugVisual).reloadAdapter();

                    let updateOptions: powerbi.VisualUpdateOptions = adapterUpdateSpy.calls.mostRecent().args[0];
                    expect(updateOptions.dataViews[0]).toBe(data);
                    expect(updateOptions.viewport).toBe(viewport);
                    expect(updateOptions.type).toBe(powerbi.VisualUpdateType.All);
                });
            });

            describe("auto refresh", () => {
                beforeEach(() => {
                    (<any>powerbi.visuals.system.DebugVisual).autoReloadPollTime = 0;
                });

                it("calling auto reload should set and clear the interval", () => {
                    expect((<any>debugVisual).autoReloadInterval).toBeFalsy();

                    //test for implicit toggling
                    (<any>debugVisual).toggleAutoReload();
                    expect((<any>debugVisual).autoReloadInterval).toBeTruthy();

                    (<any>debugVisual).toggleAutoReload();
                    expect((<any>debugVisual).autoReloadInterval).toBeFalsy();

                    //test for explicitly setting
                    (<any>debugVisual).toggleAutoReload(false);
                    expect((<any>debugVisual).autoReloadInterval).toBeFalsy();

                    (<any>debugVisual).toggleAutoReload(true);
                    expect((<any>debugVisual).autoReloadInterval).toBeTruthy();

                    (<any>debugVisual).toggleAutoReload(true);
                    expect((<any>debugVisual).autoReloadInterval).toBeTruthy();

                    (<any>debugVisual).toggleAutoReload(false);
                    expect((<any>debugVisual).autoReloadInterval).toBeFalsy();
                });

                it("should call refresh on interval", (done) => {
                    let reloadSpy = spyOn((<any>debugVisual), 'reloadAdapter');

                    (<any>debugVisual).toggleAutoReload();
                    expect(reloadSpy).not.toHaveBeenCalled();

                    setTimeout(() => {
                        expect(reloadSpy).toHaveBeenCalled();
                        done();
                    }, (<any>powerbi.visuals.system.DebugVisual).autoReloadPollTime);
                });
            });

            describe("data viewer toggle", () => {

                beforeEach(() => {
                    let mockDataViewPlugin = powerbi.Prototype.inherit(mockVisualPlugin);
                    mockDataViewPlugin.name = 'dataViewer';
                    window['powerbi']['visuals']['plugins']['dataViewer'] = mockDataViewPlugin;
                });

                it("should default to hidden", () => {
                    expect((<any>debugVisual).dataViewShowing).toBe(false);
                });

                it("should toggle dataViewShowing", () => {
                    expect((<any>debugVisual).dataViewShowing).toBe(false);

                    //test for implicit toggling
                    (<any>debugVisual).toggleDataview();
                    expect((<any>debugVisual).dataViewShowing).toBe(true);

                    (<any>debugVisual).toggleDataview();
                    expect((<any>debugVisual).dataViewShowing).toBe(false);

                    //test for explicitly setting
                    (<any>debugVisual).toggleDataview(false);
                    expect((<any>debugVisual).dataViewShowing).toBe(false);

                    (<any>debugVisual).toggleDataview(true);
                    expect((<any>debugVisual).dataViewShowing).toBe(true);

                    (<any>debugVisual).toggleDataview(true);
                    expect((<any>debugVisual).dataViewShowing).toBe(true);

                    (<any>debugVisual).toggleDataview(false);
                    expect((<any>debugVisual).dataViewShowing).toBe(false);
                });

                it("should hide dataview on manual refresh", () => {
                    expect((<any>debugVisual).dataViewShowing).toBe(false);

                    (<any>debugVisual).toggleDataview();
                    expect((<any>debugVisual).dataViewShowing).toBe(true);

                    //auto reload doesn't hide dataview
                    (<any>debugVisual).reloadAdapter(true);
                    expect((<any>debugVisual).dataViewShowing).toBe(true);

                    //manual reload does
                    (<any>debugVisual).reloadAdapter();
                    expect((<any>debugVisual).dataViewShowing).toBe(false);
                });

                it("should load / unload dataViewer visual", () => {
                    let debugElem, dataViewerElem;

                    debugElem = $element.find('.debugVisualContainer').find('.visual-' + mockVisualGuid);
                    dataViewerElem = $element.find('.debugVisualContainer').find('.visual-dataViewer');
                    expect(debugElem.length).toBe(1);
                    expect(dataViewerElem.length).toBe(0);

                    (<any>debugVisual).toggleDataview();

                    debugElem = $element.find('.debugVisualContainer').find('.visual-' + mockVisualGuid);
                    dataViewerElem = $element.find('.debugVisualContainer').find('.visual-dataViewer');
                    expect(debugElem.length).toBe(0);
                    expect(dataViewerElem.length).toBe(1);

                    (<any>debugVisual).toggleDataview();

                    debugElem = $element.find('.debugVisualContainer').find('.visual-' + mockVisualGuid);
                    dataViewerElem = $element.find('.debugVisualContainer').find('.visual-dataViewer');
                    expect(debugElem.length).toBe(1);
                    expect(dataViewerElem.length).toBe(0);
                });

                it("should pass last update options with type set to all", () => {
                    let data: powerbi.DataView = { metadata: null };
                    debugVisual.update(buildUpdateOptions(viewport, data));

                    let visual = new MockVisual();
                    spyOn(powerbi.extensibility, 'createVisualAdapter').and.returnValue(visual);
                    let adapterUpdateSpy = spyOn(visual, 'update');
                    (<any>debugVisual).toggleDataview();

                    let updateOptions: powerbi.VisualUpdateOptions = adapterUpdateSpy.calls.mostRecent().args[0];
                    expect(adapterUpdateSpy).toHaveBeenCalled();
                    expect(updateOptions.dataViews[0]).toBe(data);
                    expect(updateOptions.viewport).toBe(viewport);
                    expect(updateOptions.type).toBe(powerbi.VisualUpdateType.All);
                });
            });
        });

        describe("visual - compile error", () => {
            let $element: JQuery;
            let debugVisual: powerbi.visuals.system.DebugVisual;
            let getSpy: jasmine.Spy;
            let getScriptSpy: jasmine.Spy;
            let getJSONSpy: jasmine.Spy;
            let statusResponder: () => string;
            let hostSpy: jasmine.Spy;

            beforeEach(() => {

                let host = mocks.createVisualHostServices();
                hostSpy = spyOn(host, 'visualCapabilitiesChanged').and.callFake(() => { });
                $element = helpers.testDom("500", "500");
                statusResponder = () => 'error';

                getSpy = spyOn($, 'get').and.callFake(url => {
                    let d = $.Deferred();
                    if (url.match(/status$/)) {
                        d.resolve(statusResponder());
                    } else if (url.match(/visual\.css$/)) {
                        d.resolve('.hello{}');
                    }
                    return d.promise();
                });

                getJSONSpy = spyOn($, 'getJSON').and.callFake(url => {
                    let d = $.Deferred();
                    d.resolve({
                        visual: {
                            guid: mockVisualGuid
                        },
                        capabilities: {}
                    });
                    return d.promise();
                });

                getScriptSpy = spyOn($, 'getScript').and.callFake(url => {
                    let d = $.Deferred();
                    window['powerbi']['visuals']['plugins'][mockVisualGuid] = mockVisualPlugin;
                    d.resolve(null);
                    return d.promise();
                });

                let initOptions = {
                    element: $element,
                    host: host,
                    viewport: viewport,
                    style: style
                };

                debugVisual = new powerbi.visuals.system.DebugVisual();
                powerbi.visuals.plugins.debugVisual.capabilities = { dataRoles: null };
                debugVisual.init(initOptions);
            });

            describe("init", () => {
                it("Should display error message", () => {
                    let elem = $element.find('.debugVisualContainer .errorContainer');
                    expect(elem.length).toBe(1);
                });

                it("Should not attempt to contact server for json or scripts", () => {
                    expect(getScriptSpy).not.toHaveBeenCalled();
                    expect(getJSONSpy).not.toHaveBeenCalled();
                });

                it("Should reset capabilities", () => {
                    expect(hostSpy).toHaveBeenCalled();
                    expect(powerbi.visuals.plugins.debugVisual.capabilities).toEqual(powerbi.visuals.system.DebugVisual.defaultCapabilities);
                });
            });

            describe("auto refresh", () => {
                beforeEach(() => {
                    (<any>powerbi.visuals.system.DebugVisual).autoReloadPollTime = 0;
                });

                it("should keep calling refresh on interval, but not load scripts / json", (done) => {
                    (<any>debugVisual).toggleAutoReload();

                    setTimeout(() => {
                        let elem = $element.find('.debugVisualContainer .errorContainer');
                        expect(elem.length).toBe(1);
                        expect((<any>debugVisual).autoReloadInterval).toBeTruthy();
                        expect(getScriptSpy).not.toHaveBeenCalled();
                        expect(getJSONSpy).not.toHaveBeenCalled();
                        done();
                    }, (<any>powerbi.visuals.system.DebugVisual).autoReloadPollTime);
                });

                it("should clear error and reload scripts / json if error is resolved", (done) => {
                    expect(getScriptSpy).not.toHaveBeenCalled();
                    expect(getJSONSpy).not.toHaveBeenCalled();
                    let elem = $element.find('.debugVisualContainer .errorContainer');
                    expect(elem.length).toBe(1);

                    statusResponder = () => Date.now() + "\n" + mockVisualGuid;
                    (<any>debugVisual).toggleAutoReload();

                    setTimeout(() => {
                        let elem = $element.find('.debugVisualContainer .errorContainer');
                        expect(elem.length).toBe(0);
                        expect(getScriptSpy).toHaveBeenCalled();
                        expect(getJSONSpy).toHaveBeenCalled();
                        done();
                    }, (<any>powerbi.visuals.system.DebugVisual).autoReloadPollTime);
                });

                it("Should only load error message and reset capabilities once", () => {
                    let buildErrorMessage = spyOn(debugVisual, 'buildErrorMessage');

                    expect(hostSpy.calls.count()).toBe(1);

                    (<any>debugVisual).reloadAdapter();
                    expect(hostSpy.calls.count()).toBe(1);
                    expect(buildErrorMessage.calls.count()).toBe(1);

                    (<any>debugVisual).reloadAdapter(true);
                    expect(hostSpy.calls.count()).toBe(1);
                    expect(buildErrorMessage.calls.count()).toBe(1);
                });
            });
        });

        describe("visual - offline", () => {
            let host: IVisualHostServices;
            let $element: JQuery;
            let initOptions: powerbi.VisualInitOptions;
            let debugVisual: powerbi.visuals.system.DebugVisual;
            let getSpy: jasmine.Spy;
            let getJSONSpy: jasmine.Spy;
            let getScriptSpy: jasmine.Spy;
            let hostSpy: jasmine.Spy;

            beforeEach(() => {

                host = mocks.createVisualHostServices();
                hostSpy = spyOn(host, 'visualCapabilitiesChanged').and.callFake(() => { });
                $element = helpers.testDom("500", "500");

                getSpy = spyOn($, 'get').and.callFake(url => {
                    let d = $.Deferred();
                    d.reject();
                    return d.promise();
                });

                getJSONSpy = spyOn($, 'getJSON').and.callFake(url => {
                    let d = $.Deferred();
                    d.reject();
                    return d.promise();
                });

                getScriptSpy = spyOn($, 'getScript').and.callFake(url => {
                    let d = $.Deferred();
                    d.reject();
                    return d.promise();
                });

                initOptions = {
                    element: $element,
                    host: host,
                    viewport: viewport,
                    style: style
                };

                debugVisual = new powerbi.visuals.system.DebugVisual();
                powerbi.visuals.plugins.debugVisual.capabilities = { dataRoles: null };
                debugVisual.init(initOptions);
            });

            describe("init", () => {
                it("Should display error message", () => {
                    let elem = $element.find('.debugVisualContainer .errorContainer');
                    expect(elem.length).toBe(1);
                });
                it("Should reset capabilities", () => {
                    expect(hostSpy).toHaveBeenCalled();
                    expect(powerbi.visuals.plugins.debugVisual.capabilities).toEqual(powerbi.visuals.system.DebugVisual.defaultCapabilities);
                });
            });

            describe("refresh", () => {
                it("Should not try to get script, json, or css if status call fails", () => {
                    expect(getSpy.calls.count()).toBe(1);
                    expect(getJSONSpy).not.toHaveBeenCalled();
                    expect(getScriptSpy).not.toHaveBeenCalled();

                    (<any>debugVisual).reloadAdapter();

                    expect(getSpy.calls.count()).toBe(2);
                    expect(getJSONSpy).not.toHaveBeenCalled();
                    expect(getScriptSpy).not.toHaveBeenCalled();
                });
            });

            describe("auto refresh", () => {
                beforeEach(() => {
                    (<any>powerbi.visuals.system.DebugVisual).autoReloadPollTime = 0;
                });

                it("Should stop automatically on failures", (done) => {
                    (<any>debugVisual).toggleAutoReload();
                    expect((<any>debugVisual).autoReloadInterval).toBeTruthy();

                    setTimeout(() => {
                        expect((<any>debugVisual).autoReloadInterval).toBeFalsy();

                        done();
                    }, (<any>powerbi.visuals.system.DebugVisual).autoReloadPollTime);
                });
            });
        });

        describe("visual - disabled", () => {
            let host: IVisualHostServices;
            let $element: JQuery;
            let initOptions: powerbi.VisualInitOptions;
            let debugVisual: powerbi.visuals.system.DebugVisual;
            let getSpy: jasmine.Spy;
            let hostSpy: jasmine.Spy;

            beforeEach(() => {
                powerbi.localStorageService.setData('DEVELOPER_MODE_ENABLED', undefined);

                host = mocks.createVisualHostServices();
                hostSpy = spyOn(host, 'visualCapabilitiesChanged').and.callFake(() => { });
                $element = helpers.testDom("500", "500");

                getSpy = spyOn($, 'get');

                initOptions = {
                    element: $element,
                    host: host,
                    viewport: viewport,
                    style: style
                };

                debugVisual = new powerbi.visuals.system.DebugVisual();
                powerbi.visuals.plugins.debugVisual.capabilities = { dataRoles: null };
                debugVisual.init(initOptions);
            });

            describe("init", () => {
                it("Should display error message", () => {
                    let elem = $element.find('.debugVisualContainer .errorContainer');
                    expect(elem.length).toBe(1);
                });

                it("Should not attempt to contact server", () => {
                    expect(getSpy).not.toHaveBeenCalled();
                });

                it("Should reset capabilities", () => {
                    expect(hostSpy).toHaveBeenCalled();
                    expect(powerbi.visuals.plugins.debugVisual.capabilities).toEqual(powerbi.visuals.system.DebugVisual.defaultCapabilities);
                });
            });
        });
    });
}