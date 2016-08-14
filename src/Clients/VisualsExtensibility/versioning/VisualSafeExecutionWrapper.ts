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
    import VisualException = powerbi.visuals.telemetry.VisualException;

    export class VisualSafeExecutionWrapper implements powerbi.IVisual, WrappedVisual {
        private perfLoadEvent: powerbi.visuals.telemetry.IDeferredTelemetryEvent;
        
        constructor(
            private wrappedVisual: powerbi.IVisual,
            private visualPlugin: IVisualPlugin,
            private telemetryService: ITelemetryService,
            private isPluginInError: boolean,
            private silent?: boolean) 
        {
            if (this.telemetryService) {
                this.perfLoadEvent = this.telemetryService.startEvent(
                    powerbi.visuals.telemetry.VisualApiUsage,
                    visualPlugin.name,                          // name
                    visualPlugin.apiVersion,                    // apiVersion
                    !!visualPlugin.custom,                      // is this a custom visual?
                    undefined,                                  // parentId
                    isPluginInError,                            // isError
                    visuals.telemetry.ErrorSource.User,         // errorSource
                    undefined                                   // errorCode
                 );
            }
        }

        public init(options: VisualInitOptions): void {
            if (this.wrappedVisual.init) {
                this.executeSafely(() => this.wrappedVisual.init(options));
            }
        }

        public destroy(): void {
            if (this.wrappedVisual.destroy) {
                this.executeSafely(() => this.wrappedVisual.destroy());
            }

            // We don't want to .resolve() any perf event here.  Instead, we simply cancel it.
            if (this.perfLoadEvent) {
                this.perfLoadEvent = null;
            }
        }

        public update(options: powerbi.VisualUpdateOptions): void {
            if (this.wrappedVisual.update) {
                this.executeSafely(() => {
                    this.wrappedVisual.update(options);
                    
                    if (this.perfLoadEvent) {
                        this.perfLoadEvent.resolve();
                        this.perfLoadEvent = null;
                    }
                });
            }      
        }

        public onResizing(finalViewport: IViewport, resizeMode: ResizeMode): void {
            if (this.wrappedVisual.onResizing)
                this.executeSafely(() => this.wrappedVisual.onResizing(finalViewport, resizeMode));
        }

        public onDataChanged(options: VisualDataChangedOptions): void {
            if (this.wrappedVisual.onDataChanged)
                this.executeSafely(() => this.wrappedVisual.onDataChanged(options));
        }

        public onViewModeChanged(viewMode: ViewMode): void {
            if (this.wrappedVisual.onViewModeChanged)
                this.executeSafely(() => this.wrappedVisual.onViewModeChanged(viewMode));
        }

        public onClearSelection(): void {
            if (this.wrappedVisual.onClearSelection)
                this.executeSafely(() => this.wrappedVisual.onClearSelection());
        }

        public canResizeTo(viewport: IViewport): boolean {
            if (this.wrappedVisual.canResizeTo)
                return this.executeSafely(() => this.wrappedVisual.canResizeTo(viewport));
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            if (this.wrappedVisual.enumerateObjectInstances)
                return this.executeSafely(() => this.wrappedVisual.enumerateObjectInstances(options));
        }

        public enumerateObjectRepetition(): VisualObjectRepetition[] {
            if (this.wrappedVisual.enumerateObjectRepetition)
                return this.executeSafely(() => this.wrappedVisual.enumerateObjectRepetition());
        }

        public unwrap(): powerbi.IVisual {
            let visual = <powerbi.IVisual & WrappedVisual>this.wrappedVisual;
            return visual.unwrap ? visual.unwrap() : visual;
        }

        public isCustomVisual(): boolean {
            return this.visualPlugin.custom;
        }

        private executeSafely(callback: () => any): any {
            try {
                return callback();
            } catch (exception) {
                if (!this.silent) {
                    console.error("Visual exception", exception.stack || exception);
                }

                if (this.telemetryService) {
                    this.telemetryService.logEvent(
                        VisualException,
                        this.visualPlugin.name,
                        !!this.visualPlugin.custom,
                        this.visualPlugin.apiVersion,
                        exception.fileName,
                        exception.lineNumber,
                        exception.columnNumber,
                        exception.stack,
                        exception.message);
                    
                    if (this.perfLoadEvent) {
                        this.perfLoadEvent.reject();
                        this.perfLoadEvent = null;
                    }
                }
            }
        }
    }
}
