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

module powerbitests.mocks {

    export class MockVisualLegacy implements powerbi.IVisual {
        constructor() { }
        public init(options: powerbi.VisualInitOptions): void { }
        public update(options: powerbi.VisualUpdateOptions): void { }
        public destroy(): void { }
        public onViewModeChanged(viewMode: powerbi.ViewMode): void { }
        public onClearSelection(): void { }
        public canResizeTo(viewport: powerbi.IViewport): boolean { return true; }
        public enumerateObjectInstances(options: powerbi.EnumerateVisualObjectInstancesOptions): powerbi.VisualObjectInstanceEnumeration { return; }
        public enumerateObjectRepetition(): powerbi.VisualObjectRepetition[] { return; }
    }

    export class MockVisualPlugin implements powerbi.IVisualPlugin {
        constructor() { }
        public name: string = "MockVisualPlugin";
        public create(): powerbi.IVisual { return; }
    }    

    export class MockVisualDeprecated implements powerbi.IVisual {
        constructor() { }
        public init(options: powerbi.VisualInitOptions): void { }
        public onDataChanged(options: powerbi.VisualDataChangedOptions) { }
        public onResizing(finalViewport: powerbi.IViewport): void { }
        public onViewModeChanged(viewMode: powerbi.ViewMode): void { }
    }

    export class MockVisualV100 {
        constructor() { }
        public update(options: powerbi.VisualUpdateOptions): void { }
        public destroy(): void { }
        public enumerateObjectInstances(options: powerbi.EnumerateVisualObjectInstancesOptions): powerbi.VisualObjectInstanceEnumeration { return; }
    }

    export class MockVisualV999 {
        constructor() { }
        public draw(options: powerbi.VisualUpdateOptions): void { }
        public remove(): void { }
        public enumerateObjectInstances(options: powerbi.EnumerateVisualObjectInstancesOptions): powerbi.VisualObjectInstanceEnumeration { return; }
    }

    export var MockVisualVersions: powerbi.extensibility.VisualVersion[] = [
        {
            version: '1.0.0',
            overloads: (visual: any) => {
                return {
                    update: (options: powerbi.VisualUpdateOptions) => {
                        visual.update();
                    },
                    destroy: () => {
                        if (visual.destroy) {
                            visual.destroy();
                        }
                    },
                    enumerateObjectInstances: (options: powerbi.EnumerateVisualObjectInstancesOptions) => {
                        if (visual.enumerateObjectInstances) {
                            return visual.enumerateObjectInstances(options);
                        }
                    }
                };
            },
            hostAdapter: (host: powerbi.IVisualHostServices) => {
                return {
                    canSelect: host.canSelect
                };
            }
        },
        {
            version: '999.1.0',
            overloads: (visual: any) => {
                return {
                    update: (options: powerbi.VisualUpdateOptions) => visual.draw(options),
                    destroy: () => visual.remove()
                };
            },
            hostAdapter: (host: powerbi.IVisualHostServices) => {
                return {
                    newCanSelect: host.canSelect
                };
            }
        },
        {
            version: '999.2.0',
            hostAdapter: (host: powerbi.IVisualHostServices) => {
                return {
                    canSelect: host.canSelect,
                    other: function() { return "other"; }
                };
            }
        }
    ];
}