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

module powerbitests.slicerHelper {
    import ValueType = powerbi.ValueType;
    import SlicerOrientation = powerbi.visuals.slicerOrientation.Orientation;

    export const SelectAllTextKey = 'Select All';
    export const SlicerVisual = 'slicer';

    export interface RenderSlicerOptions {
        visualType: string;
        hostServices: powerbi.IVisualHostServices;
        dataView?: powerbi.DataView;
        dataViewObjects?: powerbi.DataViewObjects;
        viewport?: powerbi.IViewport;
        orientation?: SlicerOrientation;
    };
    
    /** Renders the slicer based on the options passed in. */
    export function initSlicer(element: JQuery, options: RenderSlicerOptions): powerbi.IVisual {
        let viewport = options.viewport ? options.viewport : { height: element.height(), width: element.width() };
        let dataView = options.dataView ? options.dataView : buildDefaultDataView();
        let visual = powerbi.visuals.visualPluginFactory.createMinerva({}).getPlugin(SlicerVisual).create();

        visual.init({
            element: element,
            host: options.hostServices,
            style: powerbi.visuals.visualStyles.create(),
            viewport: viewport,
            interactivity: { selection: true }
        });

        dataView.metadata.objects = options.dataViewObjects ? options.dataViewObjects : buildDefaultDataViewObjects(options.orientation);
        return visual;
    }

    export function createHostServices(): powerbi.IVisualHostServices {
        let hostServices = new powerbi.visuals.DefaultVisualHostServices();
        hostServices.canSelect = () => true;

        return hostServices;
    }

    export function buildDefaultDataView(): powerbi.DataView {
        let dataViewMetadata: powerbi.DataViewMetadata = buildDefaultDataViewMetadata();
        let dataViewCategorical: powerbi.DataViewCategorical = buildDefaultDataViewCategorical();
        let dataView: powerbi.DataView = {
            metadata: dataViewMetadata,
            categorical: dataViewCategorical
        };

        return dataView;
    }

    export function buildImageDataView(): powerbi.DataView {
        let dataViewMetadata: powerbi.DataViewMetadata = buildImageDataViewMetadata();
        let dataViewCategorical: powerbi.DataViewCategorical = buildImageDataViewCategorical();
        let dataView: powerbi.DataView = {
            metadata: dataViewMetadata,
            categorical: dataViewCategorical
        };

        return dataView;
    }

    /**
     * Builds a DataView containing only Categorical with 2 Columns: Fruit (Category) ['<catValuePrefix> <start>', .., '<catValuePrefix> <start + count - 1>'] and Price (Measure) [<rand>, .., <rand>].
     * @param {number} start The start.
     * @param {number} count Number of rows to create.
     * @param {string = "fruit"} catValuePrefix The prefix for all generated catValuePrefix
     * @returns DataView
     */
    export function buildSequenceDataView(start: number, count: number, catValuePrefix: string = "fruit"): powerbi.DataView {
        let dataViewMetadata: powerbi.DataViewMetadata = buildDefaultDataViewMetadata();
        let dataViewCategorical: powerbi.DataViewCategorical = buildSequenceDataViewCategorical(start, count, dataViewMetadata, catValuePrefix);
        let dataView: powerbi.DataView = {
            metadata: dataViewMetadata,
            categorical: dataViewCategorical
        };

        return dataView;
    }

    export function buildDefaultDataViewObjects(orientation?: SlicerOrientation, selectAllCheckboxEnabled: boolean = true, singleSelect: boolean = false): powerbi.DataViewObjects {
        return {
            general: {
                orientation: orientation ? orientation : SlicerOrientation.Vertical,
            },
            selection: {
                selectAllCheckboxEnabled: selectAllCheckboxEnabled,
                singleSelect: singleSelect,
            }
        };
    }

    export function buildDefaultDataViewMetadata(): powerbi.DataViewMetadata {
        return {
            columns: [
                { displayName: "Fruit", roles: { "Values" : true }, type: ValueType.fromDescriptor({ text: true }) }]
        };
    }

    export function buildDefaultDataViewCategorical(): powerbi.DataViewCategorical {
        let dataViewMetadata = buildDefaultDataViewMetadata();
        let dataViewCategorical = {
            categories: [{
                source: dataViewMetadata.columns[0],
                values: ["Apple", "Orange", "Kiwi", "Grapes", "Banana"],
                identity: [
                    mocks.dataViewScopeIdentity("Apple"),
                    mocks.dataViewScopeIdentity("Orange"),
                    mocks.dataViewScopeIdentity("Kiwi"),
                    mocks.dataViewScopeIdentity("Grapes"),
                    mocks.dataViewScopeIdentity("Banana")
                ],
            }]
        };

        return dataViewCategorical;
    }

    export function buildImageDataViewMetadata(): powerbi.DataViewMetadata {
        return {
            columns: [
                {
                    displayName: "DummyImages",
                    roles: { "Values": true },
                    type: ValueType.fromDescriptor({
                        misc: { imageUrl: true },
                        extendedType: powerbi.ExtendedType.ImageUrl,
                    })
                }]
        };
    }

    export function buildImageDataViewCategorical(): powerbi.DataViewCategorical {
        let dataViewMetadata = buildDefaultDataViewMetadata();
        let dataViewCategorical = {
            categories: [{
                source: dataViewMetadata.columns[0],
                values: [],
                identity: [],
            }]
        };
        let category = dataViewCategorical.categories[0];
        for (let count = 1; count < 6; count++) {
            let imageUrl = "http://dummyimage.com/600x400/000/fff&text=" + count;
            category.values.push(imageUrl);
            category.identity.push(mocks.dataViewScopeIdentity(imageUrl));
        }

        return dataViewCategorical;
    }

    /**
     * Builds a large Categorical Data View with 2 Columns: Fruit (Category) ['<catValuePrefix> <start>', .., '<catValuePrefix> <start + count - 1>'] and Price (Measure) [<Rand>, .., <Rand>]
     * @param {number} start Starting inclusive Index for Category Values
     * @param {number} count Number of Category Values
     * @param {powerbi.DataViewMetadata} dataViewMetadata Metadata associated with the DataView
     * @param {string = "fruit"} catValuePrefix The prefix for all generated catValuePrefix
     * @returns Categorical DataView
     */
    export function buildSequenceDataViewCategorical(start: number, count: number, dataViewMetadata: powerbi.DataViewMetadata, catValuePrefix: string = "fruit"): powerbi.DataViewCategorical {
        let cats: string[] = [];
        let vals: number[] = [];
        let scopeIds: powerbi.DataViewScopeIdentity[] = [];
        for (let i = start; i < start + count; i++) {
            let value = catValuePrefix + " " + i;
            cats.push(value);
            scopeIds.push(mocks.dataViewScopeIdentity(value));
            vals.push(Math.random());
        }

        let dataViewCategorical = {
            categories: [{
                source: dataViewMetadata.columns[0],
                values: cats,
                identity: scopeIds,
            }]
        };

        return dataViewCategorical;
    }

    export function validateSlicerItem(expectedValue: string, index: number = 0): void {
        let slicerText = $(".slicerText");
        expect(slicerText.eq(index).text()).toBe(expectedValue);
    }
}