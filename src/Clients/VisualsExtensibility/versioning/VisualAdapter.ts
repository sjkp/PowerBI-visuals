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

module powerbi.extensibility {
    import ITelemetryService = visuals.telemetry.ITelemetryService;

    // TODO: refactor this into a service
    export let visualApiVersions: VisualVersion[] = [];

    export function createVisualAdapter(visualPlugin: IVisualPlugin, telemetryService?: powerbi.ITelemetryService | ITelemetryService): powerbi.IVisual {     
        let visualAdapter: VisualAdapter = new VisualAdapter(visualPlugin, <ITelemetryService> telemetryService);

        return new VisualSafeExecutionWrapper(
            visualAdapter, 
            visualPlugin,
            <ITelemetryService> telemetryService,
            visualAdapter.isPluginInError);
    }

    export class VisualAdapter implements powerbi.IVisual, WrappedVisual {
        private visual: powerbi.IVisual | powerbi.extensibility.IVisual;
        private apiVersionIndex: number;
        private plugin: powerbi.IVisualPlugin;
        private telemetryService: ITelemetryService;
        private legacy: boolean;
        public isPluginInError: boolean = false;

        constructor(visualPlugin: IVisualPlugin, telemetryService?: ITelemetryService) {
            this.telemetryService = telemetryService;
            this.plugin = visualPlugin;

            let version = visualPlugin.apiVersion;
            let versionIndex = this.getVersionIndex(version);

            if (!version) {
                this.legacy = true;
            }
            else if (versionIndex > -1) {
                this.apiVersionIndex = versionIndex;
                this.legacy = false;
            }
            else {
                debug.assertFail("The API version '" + version + "' is invalid.");
                this.isPluginInError = true;
            }
        }

        public init(options: powerbi.VisualInitOptions) {
            debug.assertValue(options.element, "options.element");
            debug.assertValue(options.host, "options.host");

            options.element.empty();

            if (this.legacy) {
                this.visual = this.plugin.create();
                this.visualLegacy.init(options);
            }
            else {
                let host = visualApiVersions[this.apiVersionIndex].hostAdapter(options.host);
                this.visual = this.plugin.create({
                    element: options.element.get(0),
                    host: host
                });
                this.overloadMethods();
            }
        }

        public update(options: powerbi.VisualUpdateOptions): void {
            if ((options.type & VisualUpdateType.Resize) === VisualUpdateType.Resize && this.visualHasMethod('onResizing')) {
                //a couple custom visuals depend on both onResizing and Update being called
                //TODO: remove this once enough custom visuals are ported to new api
                if (this.plugin.custom && this.visualHasMethod('update')) {
                    this.visualLegacy.update(options);
                }
                this.onResizing(options.viewport, options.resizeMode);
            } else if (this.visualHasMethod('update')) {
                this.visualLegacy.update(options);
            } else {
                if (!options.type || options.type & VisualUpdateType.Data) {
                    this.onDataChanged(<VisualDataChangedOptions>_.pick(options, ['dataViews', 'operationKind']));
                }
                if (options.type & VisualUpdateType.ViewMode) {
                    this.onViewModeChanged(options.viewMode);
                }
            }
        }

        public destroy(): void {
            if (this.visualHasMethod('destroy')) {
                this.visualLegacy.destroy();
            }
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            if (!this.visualHasMethod('enumerateObjectInstances')) {
                return;
            }
            return this.visualLegacy.enumerateObjectInstances(options);
        }

        public enumerateObjectRepetition(): VisualObjectRepetition[] {
            if (!this.visualHasMethod('enumerateObjectRepetition')) {
                return;
            }
            return this.visualLegacy.enumerateObjectRepetition();
        }

        public onResizing(finalViewport: IViewport, resizeMode: ResizeMode): void {
            if (this.visualHasMethod('onResizing')) {
                this.visualLegacy.onResizing(finalViewport, resizeMode);
            }
        }

        public onDataChanged(options: VisualDataChangedOptions): void {
            if (this.visualHasMethod('onDataChanged')) {
                this.visualLegacy.onDataChanged(options);
            }
        }

        public onViewModeChanged(viewMode: ViewMode): void {
            if (this.visualHasMethod('onViewModeChanged')) {
                this.visualLegacy.onViewModeChanged(viewMode);
            }
        }

        public onClearSelection(): void {
            if (this.visualHasMethod('onClearSelection')) {
                this.visualLegacy.onClearSelection();
            }
        }

        public canResizeTo(viewport: IViewport): boolean {
            if (this.visualHasMethod('canResizeTo')) {
                return this.visualLegacy.canResizeTo(viewport);
            }
        }

        public unwrap(): powerbi.IVisual {
            return <powerbi.IVisual>this.visual;
        }

        private get visualNew(): powerbi.extensibility.IVisual {
            if (this.legacy) return;
            return <powerbi.extensibility.IVisual>this.visual;
        }

        private get visualLegacy(): powerbi.IVisual {
            if (!this.legacy) return;
            return <powerbi.IVisual>this.visual;
        }

        private visualHasMethod(methodName: string): boolean {
            let visual = this.legacy ? this.visualLegacy : this.visualNew;
            return visual && _.isFunction(visual[methodName]);
        }

        private getVersionIndex(version: string): number {
            if (version) {
                let versionCount = extensibility.visualApiVersions.length;
                for (let i = 0; i < versionCount; i++) {
                    if (extensibility.visualApiVersions[i].version === version) {
                        return i;
                    }
                }
            }
            return -1;
        }

        private overloadMethods(): void {
            let overloads = this.getCompiledOverloads();
            for (let key in overloads) {
                this[key] = overloads[key];
            }
        }

        private getCompiledOverloads(): VisualVersionOverloads {
            let overloads: VisualVersionOverloads = {};
            let versionIndex = this.apiVersionIndex;
            let visualNew = this.visualNew;
            for (let i = 0; i <= versionIndex; i++) {
                let overloadFactory = extensibility.visualApiVersions[i].overloads;
                if (_.isFunction(overloadFactory)) {
                    _.assign(overloads, overloadFactory(visualNew));
                }
            }
            return overloads;
        }
    }
}