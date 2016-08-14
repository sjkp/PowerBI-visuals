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
    import SlicerOrientation = powerbi.visuals.slicerOrientation.Orientation;
    import SQExpr = powerbi.data.SQExpr;
    import ValueType = powerbi.ValueType;
    import SemanticFilter = powerbi.data.SemanticFilter;

    export const SelectAllTextKey = 'Select All';
    export const SlicerVisual = 'slicer';
    export const slicerTextClassSelector = ".slicerText";
    export const slicerCountTextClassSelector = ".slicerCountText";
    export const slicerTitleHeaderClassSelector = ".titleHeader";
    const SelectedClass = 'selected';

    export const longSlicerItems = ["First Slicer Long Name for testing",
        "Second Slicer Long Name for testing",
        "Third Slicer Long Name for testing"];

    export interface RenderSlicerOptions {
        visualType: string;
        hostServices: powerbi.IVisualHostServices;
        dataView?: powerbi.DataView;
        dataViewObjects?: powerbi.DataViewObjects;
        viewport?: powerbi.IViewport;
        orientation?: SlicerOrientation;
    };

    /** Renders the slicer based on the options passed in. */
    export function initSlicer(element: JQuery, options: RenderSlicerOptions, field: SQExpr): powerbi.IVisual {
        let viewport = options.viewport ? options.viewport : { height: element.height(), width: element.width() };
        let dataView = options.dataView ? options.dataView : buildDefaultDataView(field);
        let visual = new powerbi.visuals.Slicer({
            behavior: new powerbi.visuals.SlicerWebBehavior()
        });

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
        hostServices.onSelecting = <any>((args: powerbi.SelectingEventArgs) => {
            args.action = powerbi.VisualInteractivityAction.Selection;
        });
        hostServices.analyzeFilter = (options: powerbi.FilterAnalyzerOptions) => {
            return new mocks.FilterAnalyzerMock(<SemanticFilter>options.filter, <SQExpr[]>options.fieldSQExprs);
        };
        hostServices.setIdentityDisplayNames = (displayNamesIdentityPairs: powerbi.DisplayNameIdentityPair[]) => _.noop;
        hostServices.getIdentityDisplayNames = (identities: powerbi.DataViewScopeIdentity[]) => {
            let displayNamesIdentityPairs: powerbi.DisplayNameIdentityPair[];

            displayNamesIdentityPairs = _.map(identities, (identity) => {
                let label = powerbi.data.SQExprConverter.getFirstComparandValue(identity);
                return {
                    displayName: label,
                    identity: identity
                };
            });
            return displayNamesIdentityPairs;
        };

        return hostServices;
    }

    export function buildDefaultDataView(field: SQExpr): powerbi.DataView {
        let dataViewMetadata: powerbi.DataViewMetadata = buildDefaultDataViewMetadata();
        let dataViewCategorical: powerbi.DataViewCategorical = buildDefaultDataViewCategorical(field);
        let dataView: powerbi.DataView = {
            metadata: dataViewMetadata,
            categorical: dataViewCategorical
        };

        return dataView;
    }

    export function buildDataViewWithSelfFilter(orientation: SlicerOrientation, field: SQExpr): powerbi.DataView {
        let dataViewMetadata: powerbi.DataViewMetadata = buildDefaultDataViewMetadata(field);
        let dataViewCategorical: powerbi.DataViewCategorical = buildDefaultDataViewCategorical(field);
        let dataView: powerbi.DataView = {
            metadata: dataViewMetadata,
            categorical: dataViewCategorical
        };
        dataView.metadata.objects = buildDefaultDataViewObjects(orientation, true, false, true);
        return dataView;
    }

    export function buildBooleanValuesDataView(field: SQExpr): powerbi.DataView {
        let dataViewMetadata: powerbi.DataViewMetadata = buildBooleanValueDataViewMetadata();
        let dataViewCategorical: powerbi.DataViewCategorical = buildBooleanValuesDataViewCategorical(field);
        let dataView: powerbi.DataView = {
            metadata: dataViewMetadata,
            categorical: dataViewCategorical
        };

        return dataView;
    }

    export function buildImageDataView(field: SQExpr): powerbi.DataView {
        let dataViewMetadata: powerbi.DataViewMetadata = buildImageDataViewMetadata();
        let dataViewCategorical: powerbi.DataViewCategorical = buildImageDataViewCategorical(field);
        let dataView: powerbi.DataView = {
            metadata: dataViewMetadata,
            categorical: dataViewCategorical
        };

        return dataView;
    }

    export function buildEmptyDataView(): powerbi.DataView {
        let dataViewMetadata: powerbi.DataViewMetadata = buildDefaultDataViewMetadata();
        let dataViewCategorical: powerbi.DataViewCategorical = buildEmptyDataViewCategorical();
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
    export function buildSequenceDataView(field: SQExpr, start: number, count: number, catValuePrefix: string = "fruit"): powerbi.DataView {
        let dataViewMetadata: powerbi.DataViewMetadata = buildDefaultDataViewMetadata();
        let dataViewCategorical: powerbi.DataViewCategorical = buildSequenceDataViewCategorical(field, start, count, dataViewMetadata, catValuePrefix);
        let dataView: powerbi.DataView = {
            metadata: dataViewMetadata,
            categorical: dataViewCategorical
        };

        return dataView;
    }

    export function buildDefaultDataViewObjects(orientation?: SlicerOrientation, selectAllCheckboxEnabled: boolean = true, singleSelect: boolean = false, selfFilterEnabled: boolean = false): powerbi.DataViewObjects {
        return {
            general: {
                orientation: orientation ? orientation : SlicerOrientation.Vertical,
                selfFilterEnabled: selfFilterEnabled,
            },
            selection: {
                selectAllCheckboxEnabled: selectAllCheckboxEnabled,
                singleSelect: singleSelect,
            }
        };
    }

    export function buildDefaultDataViewMetadata(field?: SQExpr): powerbi.DataViewMetadata {
        let result: powerbi.DataViewMetadata = {
            columns: [
                { displayName: "Fruit", roles: { "Values": true }, queryName: 'queryName', type: ValueType.fromDescriptor({ text: true }) }]
        };
        if (field)
            result.columns[0].expr = field;
        return result;
    }

    export function buildBooleanValueDataViewMetadata(): powerbi.DataViewMetadata {
        return {
            columns: [
                { displayName: "Fruit", roles: { "Values": true }, type: ValueType.fromDescriptor({ bool: true }) }]
        };
    }

    export function buildDataViewMetadataWithLongName(): powerbi.DataViewMetadata {
        return {
            columns: [
                { displayName: "This is a long slicer header for testing", roles: { "Values": true }, type: ValueType.fromDescriptor({ text: true }) }]
        };
    }

    export function buildDefaultDataViewCategorical(field: SQExpr, containsUndefinedValue?: boolean): powerbi.DataViewCategorical {
        let dataViewMetadata = buildDefaultDataViewMetadata();
        let identities = [mocks.dataViewScopeIdentityWithEquality(field, "Apple"),
            mocks.dataViewScopeIdentityWithEquality(field, "Orange"),
            mocks.dataViewScopeIdentityWithEquality(field, "Kiwi"),
            mocks.dataViewScopeIdentityWithEquality(field, "Grapes"),
            mocks.dataViewScopeIdentityWithEquality(field, "Banana")];

        let values = ["Apple", "Orange", "Kiwi", "Grapes", "Banana"];
        let countValues: number[] = [undefined, 3, 4, 5, 6, ];

        if (containsUndefinedValue === true) {
            identities.push(mocks.dataViewScopeIdentityWithEquality(field, 'undefinedValue'));
            values.push(undefined);
            countValues.push(1);
        }        

        let category: powerbi.DataViewCategoryColumn = {
            source: dataViewMetadata.columns[0],
            values: values,
            identity: identities,
            identityFields: [field]
        };

        let dataViewCategorical = {
            categories: [category],
            values: powerbi.data.DataViewTransform.createValueColumns([{
                source: dataViewMetadata.columns[0],
                values: countValues,
            }])
        };

        return dataViewCategorical;
    }

    export function buildBooleanValuesDataViewCategorical(field: SQExpr): powerbi.DataViewCategorical {
        let dataViewMetadata = buildDefaultDataViewMetadata();
        let category: powerbi.DataViewCategoryColumn = {
            source: dataViewMetadata.columns[0],
            values: [true, false, false],
            identity: [mocks.dataViewScopeIdentityWithEquality(field, true),
                mocks.dataViewScopeIdentityWithEquality(field, false),
                mocks.dataViewScopeIdentityWithEquality(field, false)],
            identityFields: [field]
        };

        let dataViewCategorical = {
            categories: [category],
            values: powerbi.data.DataViewTransform.createValueColumns([{
                source: dataViewMetadata.columns[0],
                values: [
                    undefined,
                    3,
                    4,
                ]
            }])
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

    export function buildImageDataViewCategorical(field: SQExpr): powerbi.DataViewCategorical {
        let dataViewMetadata = buildDefaultDataViewMetadata();
        let category: powerbi.DataViewCategoryColumn = {
            source: dataViewMetadata.columns[0],
            values: [],
            identity: [],
            identityFields: [field]
        };
        let dataViewCategorical = {
            categories: [category]
        };
        for (let count = 1; count < 6; count++) {
            let imageUrl: string = "http://dummyimage.com/600x400/000/fff&text=" + count + '.png';
            category.values.push(imageUrl);
            let scopeId = mocks.dataViewScopeIdentityWithEquality(field, imageUrl);
            category.identity.push(scopeId);
        }

        return dataViewCategorical;
    }

    export function buildEmptyDataViewCategorical(): powerbi.DataViewCategorical {
        let dataViewMetadata = buildDefaultDataViewMetadata();
        let dataViewCategorical = {
            categories: [{
                source: dataViewMetadata.columns[0],
                values: [],
                identity: [],
            }]
        };

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
    export function buildSequenceDataViewCategorical(field: SQExpr, start: number, count: number, dataViewMetadata: powerbi.DataViewMetadata, catValuePrefix: string = "fruit"): powerbi.DataViewCategorical {
        let cats: string[] = [];
        let vals: number[] = [];
        let scopeIds: powerbi.DataViewScopeIdentity[] = [];
        for (let i = start; i < start + count; i++) {
            let value = catValuePrefix + " " + i;
            cats.push(value);
            scopeIds.push(mocks.dataViewScopeIdentityWithEquality(field, value));
            vals.push(Math.random());
        }

        let dataViewCategorical = {
            categories: [{
                source: dataViewMetadata.columns[0],
                values: cats,
                identity: scopeIds,
                identityFields: [field],
            }]
        };

        return dataViewCategorical;
    }

    export function validateSlicerItem(expectedValue: string, index: number = 0): void {
        let slicerText = $(".slicerText");
        expect(slicerText.eq(index).text()).toBe(expectedValue);
    }

    export function validateSelectionState(orientation: SlicerOrientation, expectedSelected: number[], builder: TestBuilder): void {
        let actualSelected: number[] = [];
        let containerToBeValidated = getContainerToBeValidated(orientation, builder);
        containerToBeValidated.each((index: number, element: HTMLInputElement) => {
            if (element.classList.contains(SelectedClass))
                actualSelected.push(index);
        });

        expect(actualSelected).toEqual(expectedSelected);

        if (isVerticalOrientation(orientation))
            validateCheckedState(expectedSelected, builder.slicerCheckboxInput);
    }

    export function isVerticalOrientation(orientation: SlicerOrientation): boolean {
        return orientation === SlicerOrientation.Vertical;
    }

    function getContainerToBeValidated(orientation: SlicerOrientation, builder: TestBuilder): JQuery {
        let containerToBeValidated: JQuery;
        if (isVerticalOrientation(orientation)) {
            containerToBeValidated = builder.slicerCheckbox;
        }
        else {
            containerToBeValidated = builder.slicerText;
        }
        return containerToBeValidated;
    }

    function validateCheckedState(expectedChecked: number[], slicerCheckboxInput: JQuery): void {
        let actualChecked: number[] = [];

        slicerCheckboxInput.each((index: number, element: HTMLInputElement) => {
            if (element.checked)
                actualChecked.push(index);
        });

        expect(actualChecked).toEqual(expectedChecked);
    }

    export class TestBuilder {
        public visual: powerbi.IVisual;
        public hostServices: powerbi.IVisualHostServices;
        public field = powerbi.data.SQExprBuilder.fieldDef({
            schema: 's',
            entity: "Entity2",
            column: "PropertyName"
        });
        public dataViewMetadata: powerbi.DataViewMetadata = buildDefaultDataViewMetadata();
        public dataViewCategorical: powerbi.DataViewCategorical = buildDefaultDataViewCategorical(this.field);
        public dataView: powerbi.DataView = buildDefaultDataView(this.field);
        public interactiveDataViewOptions: powerbi.VisualDataChangedOptions = {
            dataViews: [this.dataView]
        };
        public interactiveImageDataViewOptions: powerbi.VisualDataChangedOptions = {
            dataViews: [buildImageDataView(this.field)]
        };
        
        public slicerText: JQuery;
        public slicerCheckbox: JQuery;
        public slicerCheckboxInput: JQuery;
        private originalRequestAnimationFrameCallback: (callback: Function) => number;

        constructor(orientation: SlicerOrientation, height: number = 200, width: number = 300) {
            let element = helpers.testDom(height.toString(), width.toString());
            this.hostServices = createHostServices();
            let dataView = this.dataView;
            dataView.metadata.objects = buildDefaultDataViewObjects(orientation);

            let slicerRenderOptions: RenderSlicerOptions = {
                visualType: SlicerVisual,
                hostServices: this.hostServices,
                dataView: dataView,
                dataViewObjects: dataView.metadata.objects,
                orientation: orientation,
            };

            this.visual = initSlicer(element, slicerRenderOptions, this.field);

            this.originalRequestAnimationFrameCallback = window.requestAnimationFrame;
            window.requestAnimationFrame = (callback: () => void) => {
                callback();
                return 0;
            };

            jasmine.clock().install();

            helpers.fireOnDataChanged(this.visual, this.interactiveDataViewOptions);
            this.initializeHelperElements();

            spyOn(this.hostServices, "onSelect").and.callThrough();
        }

        public destroy(): void {
            window.requestAnimationFrame = this.originalRequestAnimationFrameCallback;
            jasmine.clock().uninstall();
        }

        public initializeHelperElements(): void {
            this.slicerText = $(".slicerText");
            this.slicerCheckbox = $(".slicerCheckbox");
            this.slicerCheckboxInput = $(".slicerCheckbox").find("input");
        }
    }
}
