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

/**
 * Change Log Version 1.0.0
 * - Add type to update options (data, resize, viewmode)
 * - Remove deprecated methods (onDataChange, onResizing, onViewModeChange) 
 * - Add hostAdapter for host services versioning
 */

/// <reference path="../../_references.ts"/>

declare module powerbi.extensibility.v100 {
    /**
     * Represents a visualization displayed within an application (PowerBI dashboards, ad-hoc reporting, etc.).
     * This interface does not make assumptions about the underlying JS/HTML constructs the visual uses to render itself.
     */
    export interface IVisual extends extensibility.IVisual {
        /** Notifies the IVisual of an update (data, viewmode, size change). */
        update(options: VisualUpdateOptions): void;

        /** Notifies the visual that it is being destroyed, and to do any cleanup necessary (such as unsubscribing event handlers). */
        destroy?(): void;

        /** Gets the set of objects that the visual is currently displaying. */
        enumerateObjectInstances?(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;
    }

    export interface IVisualHost extends extensibility.IVisualHost { }

    export interface VisualUpdateOptions extends extensibility.VisualUpdateOptions {
        viewport: IViewport;
        dataViews: DataView[];
        type: VisualUpdateType;
        viewMode?: ViewMode;
    }

    export interface VisualConstructorOptions extends extensibility.VisualConstructorOptions {
        element: HTMLElement;
        host: IVisualHost;
    }

}
