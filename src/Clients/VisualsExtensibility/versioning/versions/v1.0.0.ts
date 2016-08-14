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

module powerbi.extensibility.v100 {

    export function convertLegacyUpdateType(options: powerbi.VisualUpdateOptions): VisualUpdateType {
        let type = options.type || VisualUpdateType.Data;
        if (type & VisualUpdateType.Resize && options.resizeMode === ResizeMode.Resized) {
            type |= VisualUpdateType.ResizeEnd;
        }
        return type;
    }

    let overloadFactory: VisualVersionOverloadFactory = (visual: IVisual) => {
        return {
            update: (options: powerbi.VisualUpdateOptions) => {
                if (visual.update) {
                    visual.update({
                        viewport: options.viewport,
                        dataViews: options.dataViews,
                        type: convertLegacyUpdateType(options)
                    });
                }
            },
            destroy: () => {
                if (visual.destroy) {
                    visual.destroy();
                }
            },
            enumerateObjectInstances: (options: EnumerateVisualObjectInstancesOptions) => {
                if (visual.enumerateObjectInstances) {
                    return visual.enumerateObjectInstances(options);
                }
            }
        };
    };

    let hostAdapter: VisualHostAdapter = (host: IVisualHostServices): IVisualHost => {
        return {};
    };

    visualApiVersions.push({
        version: '1.0.0',
        overloads: overloadFactory,
        hostAdapter: hostAdapter
    });
}