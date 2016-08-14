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

module powerbitests {
    import data = powerbi.data;
    import DataViewTransform = powerbi.data.DataViewTransform;
    import SQExprBuilder = powerbi.data.SQExprBuilder;

    describe('SlicerConverter', () => {
        let field = SQExprBuilder.fieldDef({
            schema: 's',
            entity: "Entity2",
            column: "PropertyName"
        });

        it("retained values doesn't exist in dataView", () => {
            let hostServices = slicerHelper.createHostServices();
            let interactivityService = powerbi.visuals.createInteractivityService(hostServices);
            let semanticFilter: data.SemanticFilter = data.SemanticFilter.fromSQExpr(
                SQExprBuilder.or(
                    SQExprBuilder.compare(data.QueryComparisonKind.Equal, field, SQExprBuilder.text('retainedValue1')),
                    SQExprBuilder.compare(data.QueryComparisonKind.Equal, field, SQExprBuilder.text('retainedValue2'))));
            let dataView = applyDataTransform(slicerHelper.buildDefaultDataView(field), semanticFilter);
            let slicerData = powerbi.visuals.DataConversion.convert(dataView[0], slicerHelper.SelectAllTextKey, interactivityService, hostServices);
            expect(slicerData.slicerDataPoints.length).toBe(7);
            expect(slicerData.slicerDataPoints[0].tooltip).toBe('Apple');
            expect(slicerData.slicerDataPoints[1].tooltip).toBe('Orange');
            expect(slicerData.slicerDataPoints[2].tooltip).toBe('Kiwi');
            expect(slicerData.slicerDataPoints[3].tooltip).toBe('Grapes');
            expect(slicerData.slicerDataPoints[4].tooltip).toBe('Banana');
            expect(slicerData.slicerDataPoints[5].tooltip).toBe('retainedValue1');
            expect(slicerData.slicerDataPoints[6].tooltip).toBe('retainedValue2');
            expect(slicerData.slicerDataPoints[5].selected).toBe(true);
            expect(slicerData.slicerDataPoints[6].selected).toBe(true);
        });

        it("one retained value exists in dataView, the other does not", () => {
            let hostServices = slicerHelper.createHostServices();
            let interactivityService = powerbi.visuals.createInteractivityService(hostServices);
            let semanticFilter: data.SemanticFilter = data.SemanticFilter.fromSQExpr(
                SQExprBuilder.or(
                    SQExprBuilder.compare(data.QueryComparisonKind.Equal, field, SQExprBuilder.text('Grapes')),
                    SQExprBuilder.compare(data.QueryComparisonKind.Equal, field, SQExprBuilder.text('retainedValue'))));
            let dataView = applyDataTransform(slicerHelper.buildDefaultDataView(field), semanticFilter);
            let spyOnGetLabelForScopeId: jasmine.Spy = spyOn(hostServices, "getIdentityDisplayNames");
            spyOnGetLabelForScopeId.and.callThrough();
            let spyOnSetLabelForScopeId: jasmine.Spy = spyOn(hostServices, "setIdentityDisplayNames");
            spyOnSetLabelForScopeId.and.callThrough();
            let slicerData = powerbi.visuals.DataConversion.convert(dataView[0], slicerHelper.SelectAllTextKey, interactivityService, hostServices);
            expect(slicerData.slicerDataPoints.length).toBe(6);
            expect(slicerData.slicerDataPoints[0].tooltip).toBe('Apple');
            expect(slicerData.slicerDataPoints[1].tooltip).toBe('Orange');
            expect(slicerData.slicerDataPoints[2].tooltip).toBe('Kiwi');
            expect(slicerData.slicerDataPoints[3].tooltip).toBe('Grapes');
            expect(slicerData.slicerDataPoints[4].tooltip).toBe('Banana');
            expect(slicerData.slicerDataPoints[5].tooltip).toBe('retainedValue');
            expect(slicerData.slicerDataPoints[5].selected).toBe(true);
            expect(slicerData.slicerDataPoints[3].selected).toBe(true);
            // Need to call host service to retrive the retainedValue, so the spyOnGetLabelForScopeId call count should be 1.
            expect(spyOnGetLabelForScopeId.calls.count()).toBe(1);
            expect(spyOnSetLabelForScopeId.calls.count()).toBe(1);
        });

        it("is not in filter", () => {
            let hostServices = slicerHelper.createHostServices();
            let interactivityService = powerbi.visuals.createInteractivityService(hostServices);
            let semanticFilter: data.SemanticFilter = data.SemanticFilter.fromSQExpr(
                SQExprBuilder.not(
                    SQExprBuilder.inExpr(
                        [field],
                        [
                            [SQExprBuilder.text('Apple')],
                            [SQExprBuilder.text('Banana')],
                        ])));
            let dataView = applyDataTransform(slicerHelper.buildDefaultDataView(field), semanticFilter);
            let spyOnGetLabelForScopeId = spyOn(hostServices, "getIdentityDisplayNames");
            spyOnGetLabelForScopeId.and.callThrough();
            let spyOnSetLabelForScopeId = spyOn(hostServices, "setIdentityDisplayNames");
            spyOnSetLabelForScopeId.and.callThrough();
            let slicerData = powerbi.visuals.DataConversion.convert(dataView[0], slicerHelper.SelectAllTextKey, interactivityService, hostServices);
            expect(slicerData.slicerDataPoints.length).toBe(5);
            expect(slicerData.slicerDataPoints[0].tooltip).toBe('Apple');
            expect(slicerData.slicerDataPoints[1].tooltip).toBe('Orange');
            expect(slicerData.slicerDataPoints[2].tooltip).toBe('Kiwi');
            expect(slicerData.slicerDataPoints[3].tooltip).toBe('Grapes');
            expect(slicerData.slicerDataPoints[4].tooltip).toBe('Banana');
            expect(slicerData.slicerDataPoints[0].selected).toBe(true);
            expect(slicerData.slicerDataPoints[4].selected).toBe(true);
            // All the selected items can be found in the dataView, so the spyOnGetLabelForScopeId call count should be 0.
            expect(spyOnGetLabelForScopeId.calls.count()).toBe(0);
            expect(spyOnSetLabelForScopeId.calls.count()).toBe(1);
        });

        it("all filter values selected with selectAllCheckbox disabled", () => {
            let hostServices = slicerHelper.createHostServices();
            let interactivityService = powerbi.visuals.createInteractivityService(hostServices);
            allItemsSelectedSlicerTestHelper(interactivityService, hostServices, false, false, false, false);
            expect(interactivityService.isSelectionModeInverted()).toBe(false);
        });
        
        it("NotFilter - all filter values selected with selectAllCheckbox disabled", () => {
            let hostServices = slicerHelper.createHostServices();
            let interactivityService = powerbi.visuals.createInteractivityService(hostServices);
            allItemsSelectedSlicerTestHelper(interactivityService, hostServices, false, false, true, false);
            expect(interactivityService.isSelectionModeInverted()).toBe(true);
        });

        it("SearchEnabled - selfFilterEnabled", () => {
            let hostServices = slicerHelper.createHostServices();
            let interactivityService = powerbi.visuals.createInteractivityService(hostServices);
            allItemsSelectedSlicerTestHelper(interactivityService, hostServices, false, false, false, true);
        });

        it("calling host to get display label", () => {
            let hostServices = slicerHelper.createHostServices();
            let interactivityService = powerbi.visuals.createInteractivityService(hostServices);
            let semanticFilter: data.SemanticFilter = data.SemanticFilter.fromSQExpr(
                SQExprBuilder.or(
                    SQExprBuilder.compare(data.QueryComparisonKind.Equal, field, SQExprBuilder.text('Grapes')),
                    SQExprBuilder.compare(data.QueryComparisonKind.Equal, field, SQExprBuilder.text('retainedValue'))));
            let dataView = applyDataTransform(slicerHelper.buildDefaultDataView(field), semanticFilter);
            let spyOnGetLabelForScopeId = spyOn(hostServices, "getIdentityDisplayNames");
            spyOnGetLabelForScopeId.and.callThrough();
            let spyOnSetLabelForScopeId = spyOn(hostServices, "setIdentityDisplayNames");
            spyOnSetLabelForScopeId.and.callThrough();
            powerbi.visuals.DataConversion.convert(dataView[0], slicerHelper.SelectAllTextKey, interactivityService, hostServices);
            expect(spyOnGetLabelForScopeId.calls.count()).toBe(1);
            expect(spyOnSetLabelForScopeId.calls.count()).toBe(1);
        });

        it("isInvertedSelectionMode persisted for undefined filter", () => {
            let hostServices = slicerHelper.createHostServices();
            let interactivityService = powerbi.visuals.createInteractivityService(hostServices);
            interactivityService.setSelectionModeInverted(true);
            let dataView = applyDataTransform(slicerHelper.buildDefaultDataView(field), undefined);
            powerbi.visuals.DataConversion.convert(dataView[0], slicerHelper.SelectAllTextKey, interactivityService, hostServices);
            expect(interactivityService.isSelectionModeInverted()).toBe(true);
        });

        it("isDefaultValueEnabled updated after convert for defaultFilter", () => {
            let hostServices = slicerHelper.createHostServices();
            let interactivityService = powerbi.visuals.createInteractivityService(hostServices);
            interactivityService.setDefaultValueMode(false);
            let dataView = applyDataTransform(slicerHelper.buildDefaultDataView(field),  powerbi.data.SemanticFilter.getDefaultValueFilter(field));
            spyOn(hostServices, "getIdentityDisplayNames").and.callThrough();
            spyOn(hostServices, "setIdentityDisplayNames").and.callThrough();
            powerbi.visuals.DataConversion.convert(dataView[0], slicerHelper.SelectAllTextKey, interactivityService, hostServices);
            expect(interactivityService.isDefaultValueEnabled()).toBe(true);
        });

        function allItemsSelectedSlicerTestHelper(
            interactivityService: powerbi.visuals.IInteractivityService,
            hostServices: powerbi.IVisualHostServices,
            selectAllEnabled: boolean,
            singleSelectEnabled: boolean,
            isNotFilter: boolean,
            searchEnabled: boolean): void {
            let inExpr = SQExprBuilder.inExpr(
                [field],
                [
                    [SQExprBuilder.text('Apple')],
                    [SQExprBuilder.text('Orange')],
                    [SQExprBuilder.text('Kiwi')],
                    [SQExprBuilder.text('Grapes')],
                    [SQExprBuilder.text('Banana')],
                ]);
            let semanticFilter: data.SemanticFilter = isNotFilter ? data.SemanticFilter.fromSQExpr(SQExprBuilder.not(inExpr)) : data.SemanticFilter.fromSQExpr(inExpr);

            let dataView = applyDataTransform(slicerHelper.buildDefaultDataView(field), semanticFilter);
            dataView[0].metadata.objects["selection"] = { selectAllCheckboxEnabled: selectAllEnabled, singleSelect: singleSelectEnabled };
            let general: any = dataView[0].metadata.objects["general"];
            general.selfFilterEnabled = searchEnabled;
            let slicerData = powerbi.visuals.DataConversion.convert(dataView[0], slicerHelper.SelectAllTextKey, interactivityService, hostServices);

            if (selectAllEnabled) {
                expect(slicerData.slicerDataPoints[0].tooltip).toBe('Select All');
                expect(slicerData.slicerDataPoints[0].isSelectAllDataPoint).toBe(true);
                expect(slicerData.slicerDataPoints[0].selected).toBe(!isNotFilter);
            }

            let index: number = selectAllEnabled ? 0 : -1;
            expect(slicerData.slicerDataPoints[index + 1].tooltip).toBe('Apple');
            expect(slicerData.slicerDataPoints[index + 2].tooltip).toBe('Orange');
            expect(slicerData.slicerDataPoints[index + 3].tooltip).toBe('Kiwi');
            expect(slicerData.slicerDataPoints[index + 4].tooltip).toBe('Grapes');
            expect(slicerData.slicerDataPoints[index + 5].tooltip).toBe('Banana');

            let selected = selectAllEnabled ? false : true;
            expect(slicerData.slicerDataPoints[index + 1].selected).toBe(selected);
            expect(slicerData.slicerDataPoints[index + 2].selected).toBe(selected);
            expect(slicerData.slicerDataPoints[index + 3].selected).toBe(selected);
            expect(slicerData.slicerDataPoints[index + 4].selected).toBe(selected);
            expect(slicerData.slicerDataPoints[index + 5].selected).toBe(selected);

            expect(slicerData.slicerSettings.search.enabled).toBe(searchEnabled);
        }

        it('slicer convert boolean values', () => {
            let hostServices = slicerHelper.createHostServices();
            let interactivityService = powerbi.visuals.createInteractivityService(hostServices);
            let descriptor: powerbi.ValueTypeDescriptor = { bool: true };
            let dataView = applyDataTransform(slicerHelper.buildBooleanValuesDataView(field), undefined, undefined, descriptor);
            let slicerData = powerbi.visuals.DataConversion.convert(dataView[0], slicerHelper.SelectAllTextKey, interactivityService, hostServices);
            expect(slicerData.slicerDataPoints.length).toBe(3);
            expect(slicerData.slicerDataPoints[0].value).toBe('True');
            expect(slicerData.slicerDataPoints[1].value).toBe('False');
            expect(slicerData.slicerDataPoints[2].value).toBe('False');
            expect(slicerData.slicerDataPoints[0].count).toBeUndefined();
            expect(slicerData.slicerDataPoints[1].count).toBe(3);
            expect(slicerData.slicerDataPoints[2].count).toBe(4);
        });

        it('slicer convert dataview contains blank value', () => {
            let dataViewMetadata: powerbi.DataViewMetadata = slicerHelper.buildDefaultDataViewMetadata();
            let dataViewCategoricalWithUndefinedValue: powerbi.DataViewCategorical = slicerHelper.buildDefaultDataViewCategorical(field, true);
            let dataView: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: dataViewCategoricalWithUndefinedValue
            };

            let hostServices = slicerHelper.createHostServices();
            let interactivityService = powerbi.visuals.createInteractivityService(hostServices);
            let descriptor: powerbi.ValueTypeDescriptor = { bool: true };
            let transformedDataViews = applyDataTransform(dataView, undefined, undefined, descriptor);

            let slicerData = powerbi.visuals.DataConversion.convert(transformedDataViews[0], slicerHelper.SelectAllTextKey, interactivityService, hostServices);
            expect(slicerData.slicerDataPoints.length).toBe(6);
            expect(slicerData.slicerDataPoints[5].value).toBe('(Blank)');
            expect(slicerData.slicerDataPoints[5].count).toBe(1);
        });

        it('slicer convert dataview with self filter, selectAll, and multi-select', () => {
            let dataView = slicerHelper.buildDataViewWithSelfFilter(powerbi.visuals.slicerOrientation.Orientation.Vertical, field);
            let selfFilter: data.SemanticFilter = data.SemanticFilter.fromSQExpr(
                SQExprBuilder.contains(field, SQExprBuilder.text('ab')));
            let transformedDataViews = applyDataTransform(dataView, undefined, selfFilter);
            let hostServices = slicerHelper.createHostServices();
            let interactivityService = powerbi.visuals.createInteractivityService(hostServices);
            let slicerData = powerbi.visuals.DataConversion.convert(transformedDataViews[0], slicerHelper.SelectAllTextKey, interactivityService, hostServices);
            expect(slicerData.searchKey).toBe('ab');
            expect(slicerData.slicerDataPoints[0].value).not.toBe(slicerHelper.SelectAllTextKey);
            expect(slicerData.slicerDataPoints[0].value).toBe('Apple');
        });

        it('slicer convert dataview with self filter that is not contains', () => {
            let dataView = slicerHelper.buildDataViewWithSelfFilter(powerbi.visuals.slicerOrientation.Orientation.Vertical, field);
            let selfFilter: data.SemanticFilter = data.SemanticFilter.fromSQExpr(
                SQExprBuilder.compare(powerbi.data.QueryComparisonKind.Equal, field, SQExprBuilder.text('ab')));
            let transformedDataViews = applyDataTransform(dataView, undefined, selfFilter);
            let hostServices = slicerHelper.createHostServices();
            let interactivityService = powerbi.visuals.createInteractivityService(hostServices);
            let slicerData = powerbi.visuals.DataConversion.convert(transformedDataViews[0], slicerHelper.SelectAllTextKey, interactivityService, hostServices);
            expect(slicerData.searchKey).toBeUndefined();
            expect(slicerData.slicerDataPoints[0].value).not.toBe(slicerHelper.SelectAllTextKey);
            expect(slicerData.slicerDataPoints[0].value).toBe('Apple');
        });

        function applyDataTransform(dataView: powerbi.DataView, semanticFilter: data.SemanticFilter, selfFilter?: data.SemanticFilter, descriptor?: powerbi.ValueTypeDescriptor): powerbi.DataView[]{
            if (descriptor == null)
                descriptor = { text: true };

            let transforms: data.DataViewTransformActions = {
                selects: [
                    {
                        type: powerbi.ValueType.fromDescriptor(descriptor),
                        roles: { 'Category': true },
                        queryName: 'queryName',
                    }
                ],
            };

            transforms.objects = {};
            if (semanticFilter != null)
                powerbi.data.DataViewObjectDefinitions.setValue(transforms.objects, powerbi.visuals.slicerProps.filterPropertyIdentifier, null, semanticFilter);

            if (selfFilter)
                powerbi.data.DataViewObjectDefinitions.setValue(transforms.objects, powerbi.visuals.slicerProps.selfFilterPropertyIdentifier, null, selfFilter);

            return DataViewTransform.apply({
                prototype: dataView,
                objectDescriptors: {
                    general: powerbi.visuals.slicerCapabilities.objects.general,
                    selection: powerbi.visuals.slicerCapabilities.objects['selection'],
                },
                transforms: transforms,
                colorAllocatorFactory: powerbi.visuals.createColorAllocatorFactory(),
                dataViewMappings: powerbi.visuals.capabilities.slicer.dataViewMappings,
                dataRoles: [{ name: 'queryName', kind: powerbi.VisualDataRoleKind.Grouping}],
            });
        }
    });
}
