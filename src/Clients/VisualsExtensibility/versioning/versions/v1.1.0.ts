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

module powerbi.extensibility.v110 {

    let overloadFactory: VisualVersionOverloadFactory = (visual: IVisual) => {
        return {
            update: (options: powerbi.VisualUpdateOptions) => {
                if (visual.update) {
                    let updateOptions: VisualUpdateOptions = {
                        viewport: options.viewport,
                        dataViews: options.dataViews,
                        type: v100.convertLegacyUpdateType(options)
                    };

                    let transform: IVisualDataViewTransform = (<IVisualConstructor>(<any>visual.constructor)).__transform__;
                    if (_.isFunction(transform)) {
                        visual.update(updateOptions, transform(updateOptions.dataViews));
                    } else {
                        visual.update(updateOptions);
                    }
                }
            }
        };
    };

    let hostAdapter: VisualHostAdapter = (host: powerbi.IVisualHostServices): IVisualHost => {
        return {
            createSelectionIdBuilder: () => new visuals.SelectionIdBuilder(),
            createSelectionManager: () => new SelectionManager({ hostServices: host }),
            colors: powerbi.visuals.ThemeManager.getDefaultTheme(),
        };
    };

    visualApiVersions.push({
        version: '1.1.0',
        overloads: overloadFactory,
        hostAdapter: hostAdapter
    });
}