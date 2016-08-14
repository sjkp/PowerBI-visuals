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

module powerbitests.customVisuals {
    export abstract class VisualBuilderBase<T extends powerbi.IVisual> {
        public element: JQuery;
        public viewport: powerbi.IViewport;
        public host: powerbi.IVisualHostServices;
        public interactivity: powerbi.InteractivityOptions;
        public animation: powerbi.AnimationOptions;

        protected isMinervaVisualPlugin: boolean = false;
        protected visual: T;
        protected style: powerbi.IVisualStyle;

        constructor(
            width: number,
            height: number,
            isMinervaVisualPlugin: boolean = false,
            element: JQuery = powerbitests.helpers.testDom(height.toString(), width.toString())) {

            this.element = element;
            this.host = mocks.createVisualHostServices();
            this.style = powerbi.visuals.visualStyles.create();
            this.isMinervaVisualPlugin = isMinervaVisualPlugin;
            this.viewport = {
                height: height,
                width: width
            };

            this.visual = this.build();
            this.init();
        }

        protected abstract build(): T;

        public init(): void {
            this.visual.init(<powerbi.VisualInitOptions>{
                element: this.element,
                host: this.host,
                style: this.style,
                viewport: this.viewport,
                interactivity: this.interactivity,
                animation: this.animation
            });
        }

        public destroy(): void {
            if (this.visual && this.visual.destroy) {
                this.visual.destroy();
            }
        }

        public update(dataView: powerbi.DataView[] | powerbi.DataView): void {
            this.visual.update(<powerbi.VisualUpdateOptions>{
                dataViews: _.isArray(dataView) ? dataView : [dataView],
                viewport: this.viewport
            });
        }

        public updateRenderTimeout(dataViews: powerbi.DataView[] | powerbi.DataView, fn: Function, timeout?: number): number {
            this.update(dataViews);
            return helpers.renderTimeout(fn, timeout);
        }

        public updateEnumerateObjectInstancesRenderTimeout(
            dataViews: powerbi.DataView[] | powerbi.DataView,
            options: powerbi.EnumerateVisualObjectInstancesOptions,
            fn: (enumeration: powerbi.VisualObjectInstanceEnumeration & powerbi.VisualObjectInstanceEnumerationObject) => void,
            timeout?: number): number {

            this.update(dataViews);
            let enumeration = this.enumerateObjectInstances(options);
            return helpers.renderTimeout(() => fn(<any>enumeration), timeout);
        }

        public updateflushAllD3Transitions(dataViews: powerbi.DataView[] | powerbi.DataView): void {
            this.update(dataViews);
            powerbi.visuals.SVGUtil.flushAllD3Transitions();
        }

        public updateflushAllD3TransitionsRenderTimeout(dataViews: powerbi.DataView[] | powerbi.DataView, fn: Function, timeout?: number): number {
            this.update(dataViews);
            powerbi.visuals.SVGUtil.flushAllD3Transitions();
            return helpers.renderTimeout(fn, timeout);
        }

        public enumerateObjectInstances(options: powerbi.EnumerateVisualObjectInstancesOptions)
            : powerbi.VisualObjectInstance[] | powerbi.VisualObjectInstanceEnumeration {

            debug.assertValue(this.visual.enumerateObjectInstances, "enumerateObjectInstances is not defined");
            return this.visual.enumerateObjectInstances(options);
        }
    }
}