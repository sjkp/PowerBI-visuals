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

module powerbitests {
    import SelectableDataPoint = powerbi.visuals.SelectableDataPoint;
    import SelectionId = powerbi.visuals.SelectionId;
    import SQExprBuilder = powerbi.data.SQExprBuilder;
    import MockBehavior = powerbitests.mocks.MockBehavior;

    describe('Interactivity service', () => {
        let host: powerbi.IVisualHostServices;
        let interactivityService: powerbi.visuals.InteractivityService;
        let selectableDataPoints: SelectableDataPoint[];
        let behavior: MockBehavior;
        let filterPropertyId: powerbi.DataViewObjectPropertyIdentifier;

        beforeEach(() => {
            host = powerbitests.mocks.createVisualHostServices();
            host.canSelect = () => true; // Allows for multiselect behavior by default
            interactivityService = <powerbi.visuals.InteractivityService>powerbi.visuals.createInteractivityService(host);
            selectableDataPoints = <SelectableDataPoint[]> [
                { selected: false, identity: SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("0"), mocks.dataViewScopeIdentity("a"), "queryName") },
                { selected: false, identity: SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("0"), mocks.dataViewScopeIdentity("b"), "queryName") },
                { selected: false, identity: SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("1"), mocks.dataViewScopeIdentity("a"), "queryName") },
                { selected: false, identity: SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("1"), mocks.dataViewScopeIdentity("b"), "queryName") },
                { selected: false, identity: SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("2"), mocks.dataViewScopeIdentity("a"), "queryName") },
                { selected: false, identity: SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("2"), mocks.dataViewScopeIdentity("b"), "queryName") },
            ];
            filterPropertyId = {
                objectName: 'general',
                propertyName: 'selected'
            };
            behavior = new MockBehavior(selectableDataPoints, filterPropertyId);
        });

        it('Basic binding', () => {
            spyOn(behavior, "bindEvents");
            spyOn(behavior, "renderSelection");
            interactivityService.bind(selectableDataPoints, behavior, null);
            expect(behavior.bindEvents).toHaveBeenCalled();
            expect(behavior.verifyCleared()).toBeTruthy();
            expect(behavior.renderSelection).not.toHaveBeenCalled();
            expect(interactivityService.hasSelection()).toBeFalsy();
        });

        it('Binding passes behaviorOptions', () => {
            spyOn(behavior, "bindEvents");
            let arbitraryBehaviorOptions = {
                some: "random",
                collection: "of",
                random: "stuff",
            };
            interactivityService.bind(selectableDataPoints, behavior, arbitraryBehaviorOptions);
            expect(behavior.bindEvents).toHaveBeenCalledWith(arbitraryBehaviorOptions, interactivityService);
        });

        it('Basic selection', () => {
            spyOn(behavior, "renderSelection");
            interactivityService.bind(selectableDataPoints, behavior, null);
            behavior.selectIndex(0, false);
            expect(behavior.verifySingleSelectedAt(0)).toBeTruthy();
            expect(behavior.renderSelection).toHaveBeenCalledWith(true);
            expect(interactivityService.hasSelection()).toBeTruthy();
        });

        it('Apply selection', () => {
            let newDataPoints = <SelectableDataPoint[]>[
                { selected: false, identity: SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("0"), mocks.dataViewScopeIdentity("a"), "queryName") },
                { selected: false, identity: SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("0"), mocks.dataViewScopeIdentity("b"), "queryName") },
                { selected: false, identity: SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("1"), mocks.dataViewScopeIdentity("a"), "queryName") },
                { selected: false, identity: SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("1"), mocks.dataViewScopeIdentity("b"), "queryName") },
                { selected: false, identity: SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("2"), mocks.dataViewScopeIdentity("a"), "queryName") },
                { selected: false, identity: SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("2"), mocks.dataViewScopeIdentity("b"), "queryName") },
            ];
            spyOn(behavior, "renderSelection");
            interactivityService.bind(selectableDataPoints, behavior, null);
            behavior.selectIndex(0, false);
            expect(behavior.verifySingleSelectedAt(0)).toBeTruthy();
            expect(behavior.renderSelection).toHaveBeenCalledWith(true);
            interactivityService.applySelectionStateToData(newDataPoints);
            expect(newDataPoints[0].selected).toBeTruthy();
            expect(newDataPoints[1].selected).toBeFalsy();
            expect(newDataPoints[2].selected).toBeFalsy();
            expect(newDataPoints[3].selected).toBeFalsy();
            expect(newDataPoints[4].selected).toBeFalsy();
            expect(newDataPoints[5].selected).toBeFalsy();
        });

        it('Clear selection through event', () => {
            spyOn(behavior, "renderSelection");
            interactivityService.bind(selectableDataPoints, behavior, null);
            behavior.selectIndex(0, false);
            behavior.clear();
            expect(behavior.verifyCleared()).toBeTruthy();
            expect(behavior.renderSelection).toHaveBeenCalledWith(false);
            expect(interactivityService.hasSelection()).toBeFalsy();
        });

        it('Clear selection through service', () => {
            spyOn(behavior, "renderSelection");
            interactivityService.bind(selectableDataPoints, behavior, null);
            behavior.selectIndex(0, false);
            interactivityService.clearSelection();
            expect(behavior.verifyCleared()).toBeTruthy();
            expect(behavior.renderSelection).toHaveBeenCalledWith(false);
            expect(interactivityService.hasSelection()).toBeFalsy();
        });

        it('Selection sent to host', () => {
            spyOn(host, "onSelect");
            interactivityService.bind(selectableDataPoints, behavior, null);
            behavior.selectIndex(0, false);
            expect(host.onSelect).toHaveBeenCalledWith({ data: [selectableDataPoints[0].identity.getSelector()] });
        });

        it('persistSelectionFilter calls persistProperties', () => {
            interactivityService.bind(selectableDataPoints, behavior, null);
            spyOn(host, "persistProperties");
            behavior.selectIndexAndPersist(0, false);

            let changes = interactivityService.createChangeForFilterProperty(filterPropertyId);

            interactivityService.persistSelectionFilter(filterPropertyId);

            expect(host.persistProperties).toHaveBeenCalledWith(changes);
        });

        describe('createChangeForFilterProperty', () => {
            beforeEach(() => {
                interactivityService.bind(selectableDataPoints, behavior, null);
            });

            it('select a single data point', () => {
                behavior.selectIndexAndPersist(0, false);
                
                let changes = interactivityService.createChangeForFilterProperty(filterPropertyId);
                
                expect(changes).toEqual({
                    merge: [{
                        objectName: 'general',
                        selector: undefined,
                        properties: {
                            'selected': powerbi.data.Selector.filterFromSelector([selectableDataPoints[0].identity.getSelector()], false),
                        }
                    }]
                });
            });

            it('no selection should result in empty filter', () => {
                let changes = interactivityService.createChangeForFilterProperty(filterPropertyId);

                expect(changes).toEqual({
                    remove: [{
                        objectName: 'general',
                        selector: undefined,
                        properties: {
                            'selected': { },
                        }
                    }]
                });
            });
        });

        it('Multiple single selects', () => {
            interactivityService.bind(selectableDataPoints, behavior, null);
            for (let i = 0, ilen = selectableDataPoints.length; i < ilen; i++) {
                behavior.selectIndex(i, false);
                expect(behavior.verifySingleSelectedAt(i)).toBeTruthy();
            }
        });

        it('Single select clears', () => {
            interactivityService.bind(selectableDataPoints, behavior, null);
            behavior.selectIndex(1, false);
            expect(behavior.verifySingleSelectedAt(1)).toBeTruthy();
            behavior.selectIndex(1, false);
            expect(behavior.verifyCleared()).toBeTruthy();
        });

        it('Basic multiselect', () => {
            interactivityService.bind(selectableDataPoints, behavior, null);
            behavior.selectIndex(1, true);
            expect(behavior.verifySelectionState([false, true, false, false, false, false])).toBeTruthy();
            behavior.selectIndex(2, true);
            expect(behavior.verifySelectionState([false, true, true, false, false, false])).toBeTruthy();
            behavior.selectIndex(5, true);
            expect(behavior.verifySelectionState([false, true, true, false, false, true])).toBeTruthy();
        });

        it('Multiselect clears', () => {
            interactivityService.bind(selectableDataPoints, behavior, null);
            behavior.selectIndex(1, true);
            expect(behavior.verifySelectionState([false, true, false, false, false, false])).toBeTruthy();
            behavior.selectIndex(2, true);
            expect(behavior.verifySelectionState([false, true, true, false, false, false])).toBeTruthy();
            behavior.selectIndex(1, true);
            expect(behavior.verifySelectionState([false, false, true, false, false, false])).toBeTruthy();
            behavior.selectIndex(5, true);
            expect(behavior.verifySelectionState([false, false, true, false, false, true])).toBeTruthy();
            behavior.selectIndex(5, true);
            expect(behavior.verifySelectionState([false, false, true, false, false, false])).toBeTruthy();
        });

        it('Single and multiselect', () => {
            interactivityService.bind(selectableDataPoints, behavior, null);
            behavior.selectIndex(1, false);
            expect(behavior.verifySingleSelectedAt(1)).toBeTruthy();
            behavior.selectIndex(2, true);
            expect(behavior.verifySelectionState([false, true, true, false, false, false])).toBeTruthy();
            behavior.selectIndex(5, true);
            expect(behavior.verifySelectionState([false, true, true, false, false, true])).toBeTruthy();
            behavior.selectIndex(3, false);
            expect(behavior.verifySingleSelectedAt(3)).toBeTruthy();
            behavior.selectIndex(0, true);
            expect(behavior.verifySelectionState([true, false, false, true, false, false])).toBeTruthy();
        });

        it('Multiselect treated as single select when host says selection is invalid', () => {
            host.canSelect = () => false;
            interactivityService.bind(selectableDataPoints, behavior, null);
            behavior.selectIndex(1, true);
            expect(behavior.verifySelectionState([false, true, false, false, false, false])).toBeTruthy();
            behavior.selectIndex(2, true);
            expect(behavior.verifySelectionState([false, false, true, false, false, false])).toBeTruthy();
            behavior.selectIndex(5, true);
            expect(behavior.verifySelectionState([false, false, false, false, false, true])).toBeTruthy();
        });

        describe('overrideSelectionFromData', () => {
            it('with', () => {
                selectableDataPoints[5].selected = true;
                interactivityService.bind(selectableDataPoints, behavior, null, { overrideSelectionFromData: true });

                expect(interactivityService.hasSelection()).toBeTruthy();
            });

            it('without', () => {
                selectableDataPoints[5].selected = true;
                interactivityService.bind(selectableDataPoints, behavior, null);

                expect(interactivityService.hasSelection()).toBeFalsy();
            });
        });

        describe('Legend', () => {
            it('Selection', () => {
                let legendDataPoints = [
                    { selected: false, identity: SelectionId.createWithIdAndMeasure(mocks.dataViewScopeIdentity("a"), "queryName") },
                    { selected: false, identity: SelectionId.createWithIdAndMeasure(mocks.dataViewScopeIdentity("b"), "queryName") },
                ];
                let legendBehavior = new MockBehavior(legendDataPoints, null);
                interactivityService.bind(selectableDataPoints, behavior, null);
                interactivityService.bind(legendDataPoints, legendBehavior, null, { isLegend: true });

                legendBehavior.selectIndex(0);
                expect(legendBehavior.verifySingleSelectedAt(0)).toBeTruthy();
                expect(behavior.verifySelectionState([true, false, true, false, true, false])).toBeTruthy();
                expect(interactivityService.hasSelection()).toBeTruthy();
                expect(interactivityService.legendHasSelection()).toBeTruthy();

                behavior.selectIndex(1);
                expect(behavior.verifySingleSelectedAt(1)).toBeTruthy();
                expect(legendBehavior.verifyCleared()).toBeTruthy();
                expect(interactivityService.hasSelection()).toBeTruthy();
                expect(interactivityService.legendHasSelection()).toBeFalsy();
            });

            it('Datapoint selection syncs legend datapoints', () => {
                // Datapoints
                let selectableDataPoints = [
                    { selected: false, identity: SelectionId.createWithIdAndMeasure(mocks.dataViewScopeIdentity("a"), "queryName") },
                    { selected: false, identity: SelectionId.createWithIdAndMeasure(mocks.dataViewScopeIdentity("b"), "queryName") },
                ];
                behavior = new MockBehavior(selectableDataPoints, filterPropertyId);
                interactivityService.bind(selectableDataPoints, behavior, null);

                // Legend datapoints
                let legendDataPoints = [
                    { selected: false, identity: SelectionId.createWithIdAndMeasure(mocks.dataViewScopeIdentity("a"), "queryName") },
                    { selected: false, identity: SelectionId.createWithIdAndMeasure(mocks.dataViewScopeIdentity("b"), "queryName") },
                ];
                let legendBehavior = new MockBehavior(legendDataPoints, filterPropertyId);
                interactivityService.bind(legendDataPoints, legendBehavior, null, { isLegend: true });

                // Trigger selection on datapoints
                behavior.selectIndex(1);
                expect(behavior.verifySelectionState([false, true])).toBeTruthy();
                expect(legendBehavior.verifySelectionState([false, true])).toBeTruthy();
                expect(interactivityService.hasSelection()).toBeTruthy();
                expect(interactivityService.legendHasSelection()).toBeTruthy();

                // Trigger selection on legend
                legendBehavior.selectIndex(0);
                expect(behavior.verifySelectionState([true, false])).toBeTruthy();
                expect(legendBehavior.verifySelectionState([true, false])).toBeTruthy();
                expect(interactivityService.hasSelection()).toBeTruthy();
                expect(interactivityService.legendHasSelection()).toBeTruthy();

                // Trigger selection on datapoints
                behavior.selectIndex(0);
                expect(behavior.verifySelectionState([false, false])).toBeTruthy();
                expect(legendBehavior.verifySelectionState([false, false])).toBeTruthy();
                expect(interactivityService.hasSelection()).toBeFalsy();
                expect(interactivityService.legendHasSelection()).toBeFalsy();
            });

            it('Invalid selection without selectableDataPoints (only legendDataPoints)', () => {
                let legendDataPoints = [
                    { selected: false, identity: SelectionId.createWithIdAndMeasure(mocks.dataViewScopeIdentity("a"), "queryName") },
                    { selected: false, identity: SelectionId.createWithIdAndMeasure(mocks.dataViewScopeIdentity("b"), "queryName") },
                ];
                let legendBehavior = new MockBehavior(legendDataPoints, null);
                interactivityService.bind(legendDataPoints, legendBehavior, null, { isLegend: true });

                // Select first legend item
                legendBehavior.selectIndex(0);
                expect(legendBehavior.verifySelectionState([true, false])).toBeTruthy();

                // New legend datapoints
                let newLegendDataPoints = [
                    { selected: false, identity: SelectionId.createWithIdAndMeasure(mocks.dataViewScopeIdentity("c"), "queryName") },
                    { selected: false, identity: SelectionId.createWithIdAndMeasure(mocks.dataViewScopeIdentity("d"), "queryName") },
                ];
                legendBehavior = new MockBehavior(newLegendDataPoints, null);
                interactivityService.bind(newLegendDataPoints, legendBehavior, null, { isLegend: true });

                // Select a new legend item
                legendBehavior.selectIndex(0);
                expect(legendBehavior.verifySelectionState([true, false])).toBeTruthy();

                // Attempting to select an invalid legend item should clearSelection
                legendBehavior.select(legendDataPoints[1]);

                expect(legendBehavior.verifySelectionState([false, false])).toBeTruthy();
                expect(interactivityService.hasSelection()).toBeFalsy();
                expect(interactivityService.legendHasSelection()).toBeFalsy();
            });
        });

        it('Label selection', () => {
            let labelsDataPoints = [
                { selected: false, identity: SelectionId.createWithIdAndMeasure(mocks.dataViewScopeIdentity("a"), "queryName") },
                { selected: false, identity: SelectionId.createWithIdAndMeasure(mocks.dataViewScopeIdentity("b"), "queryName") },
            ];
            let labelBehavior = new MockBehavior(labelsDataPoints, null);
            interactivityService.bind(selectableDataPoints, behavior, null);
            interactivityService.bind(labelsDataPoints, labelBehavior, null, { isLabels: true });

            labelBehavior.selectIndex(0);
            labelBehavior.verifySingleSelectedAt(0);
            behavior.verifySelectionState([true, false, true, false, true, false]);
            expect(interactivityService.hasSelection()).toBeTruthy();
            expect(interactivityService.labelsHasSelection()).toBeTruthy();

            behavior.selectIndex(1);
            behavior.verifySingleSelectedAt(1);
            labelBehavior.verifyCleared();
            expect(interactivityService.hasSelection()).toBeTruthy();
            expect(interactivityService.labelsHasSelection()).toBeFalsy();
        });

        it('Slicer selection', () => {
            selectableDataPoints[5].selected = true;
            interactivityService.bind(selectableDataPoints, behavior, null, { overrideSelectionFromData: true });

            // Multiple binds to simulate reloading (should not result in dupes in filter condition).
            selectableDataPoints[5].selected = true;
            interactivityService.bind(selectableDataPoints, behavior, null, { overrideSelectionFromData: true });

            let onSelectSpy = spyOn(host, 'onSelect');

            behavior.selectIndex(0, true);

            expect(behavior.selections()).toEqual([true, false, false, false, false, true]);
            expect(getSelectedIds(interactivityService)).toEqual([
                selectableDataPoints[5].identity,
                selectableDataPoints[0].identity,
            ]);

            expect(host.onSelect).toHaveBeenCalled();
            expect(onSelectSpy.calls.argsFor(0)).toEqual([<powerbi.SelectEventArgs>{
                data: [
                    selectableDataPoints[5].identity.getSelector(),
                    selectableDataPoints[0].identity.getSelector(),
                ]
            }]);
        });

        it('Slicer selection with default value', () => {
            let propertyIdentifier: powerbi.DataViewObjectPropertyIdentifier = {
                objectName: 'general',
                propertyName: 'property'
            };
            selectableDataPoints[5].selected = true;
            interactivityService.bind(selectableDataPoints, behavior, null, { slicerDefaultValueHandler: new MockDefaultValueHandler() });
            interactivityService.setDefaultValueMode(true);
            let result = (<powerbi.visuals.InteractivityService>interactivityService).createChangeForFilterProperty(propertyIdentifier);

            expect(powerbi.data.SemanticFilter.isDefaultFilter(<powerbi.data.SemanticFilter>result.merge[0].properties['property'])).toBeTruthy();
        });

        it('Slicer selection with any value', () => {
            let propertyIdentifier: powerbi.DataViewObjectPropertyIdentifier = {
                objectName: 'general',
                propertyName: 'property'
            };
            interactivityService.bind(selectableDataPoints, behavior, null, { slicerDefaultValueHandler: new MockDefaultValueHandler() });
            interactivityService.setDefaultValueMode(false);
            let result = (<powerbi.visuals.InteractivityService>interactivityService).createChangeForFilterProperty(propertyIdentifier);

            expect(powerbi.data.SemanticFilter.isAnyFilter(<powerbi.data.SemanticFilter>result.merge[0].properties['property'])).toBeTruthy();
        });
    });

    function getSelectedIds(interactivityService: powerbi.visuals.IInteractivityService): SelectionId[] {
        // Accessing a private member.
        return interactivityService['selectedIds'];
    }

    class MockDefaultValueHandler implements powerbi.visuals.SlicerDefaultValueHandler {
        public getIdentityFields(): powerbi.data.SQExpr[]{
            return [SQExprBuilder.columnRef(SQExprBuilder.entity('s', 'Entity2'), 'Prop2')];
        }

        public getDefaultValue(): powerbi.data.SQConstantExpr{
            return SQExprBuilder.integer(2);
        }
    }
}