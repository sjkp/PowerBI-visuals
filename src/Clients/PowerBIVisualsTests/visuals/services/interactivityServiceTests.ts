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
    import SelectionIdBuilder = powerbi.visuals.SelectionIdBuilder;
    import SQExprBuilder = powerbi.data.SQExprBuilder;
    import MockBehavior = powerbitests.mocks.MockBehavior;

    describe('Interactivity service', () => {
        let host: powerbi.IVisualHostServices;
        let interactivityService: powerbi.visuals.InteractivityService;
        let identities: SelectionId[];
        let selectableDataPoints: SelectableDataPoint[];
        let behavior: MockBehavior;
        let filterPropertyId: powerbi.DataViewObjectPropertyIdentifier;

        beforeEach(() => {
            host = powerbitests.mocks.createVisualHostServices();
            host.canSelect = () => true; // Allows for multiselect behavior by default
            interactivityService = <powerbi.visuals.InteractivityService>powerbi.visuals.createInteractivityService(host);
            identities = [
                SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("0"), mocks.dataViewScopeIdentity("a"), "queryName"),
                SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("0"), mocks.dataViewScopeIdentity("b"), "queryName"),
                SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("1"), mocks.dataViewScopeIdentity("a"), "queryName"),
                SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("1"), mocks.dataViewScopeIdentity("b"), "queryName"),
                SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("2"), mocks.dataViewScopeIdentity("a"), "queryName"),
                SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("2"), mocks.dataViewScopeIdentity("b"), "queryName"),
            ];
            selectableDataPoints = <SelectableDataPoint[]>[
                { selected: false, identity: identities[0] },
                { selected: false, identity: identities[1] },
                { selected: false, identity: identities[2] },
                { selected: false, identity: identities[3] },
                { selected: false, identity: identities[4] },
                { selected: false, identity: identities[5] },
            ];
            filterPropertyId = {
                objectName: 'general',
                propertyName: 'filter',
            };
            behavior = new MockBehavior(selectableDataPoints, filterPropertyId);
        });

        describe('Binding', () => {

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
        });

        describe('Selection', () => {

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

            it('Clear selection should reset isInvertedSelectionMode for defaultValue ', () => {
                let valueHandler = new MockSlicerValueHandler();
                valueHandler.searchKey = '';
                interactivityService.bind(selectableDataPoints, behavior, null, { slicerValueHandler: valueHandler });
                interactivityService.setSelectionModeInverted(true);
                interactivityService.clearSelection();
                expect(interactivityService.isSelectionModeInverted()).toBe(false);
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

            it('Single select null identity does not crash', () => {
                interactivityService.bind(selectableDataPoints, behavior, null);
                behavior.select({
                    identity: new SelectionId(null, false),
                    selected: false,
                });
                expect(behavior.verifyCleared()).toBeTruthy();
            });

            it('Basic multiselect', () => {
                interactivityService.bind(selectableDataPoints, behavior, null);
                behavior.selectIndex(1, true);
                expect(behavior.verifySelectionState([false, true, false, false, false, false, false])).toBeTruthy();
                behavior.selectIndex(2, true);
                expect(behavior.verifySelectionState([false, true, true, false, false, false, false])).toBeTruthy();
                behavior.selectIndex(5, true);
                expect(behavior.verifySelectionState([false, true, true, false, false, true, false])).toBeTruthy();
            });

            it('Multiselect clears', () => {
                interactivityService.bind(selectableDataPoints, behavior, null);
                behavior.selectIndex(1, true);
                expect(behavior.verifySelectionState([false, true, false, false, false, false, false])).toBeTruthy();
                behavior.selectIndex(2, true);
                expect(behavior.verifySelectionState([false, true, true, false, false, false, false])).toBeTruthy();
                behavior.selectIndex(1, true);
                expect(behavior.verifySelectionState([false, false, true, false, false, false, false])).toBeTruthy();
                behavior.selectIndex(5, true);
                expect(behavior.verifySelectionState([false, false, true, false, false, true, false])).toBeTruthy();
                behavior.selectIndex(5, true);
                expect(behavior.verifySelectionState([false, false, true, false, false, false, false])).toBeTruthy();
            });

            it('Single and multiselect', () => {
                interactivityService.bind(selectableDataPoints, behavior, null);
                behavior.selectIndex(1, false);
                expect(behavior.verifySingleSelectedAt(1)).toBeTruthy();
                behavior.selectIndex(2, true);
                expect(behavior.verifySelectionState([false, true, true, false, false, false, false])).toBeTruthy();
                behavior.selectIndex(5, true);
                expect(behavior.verifySelectionState([false, true, true, false, false, true, false])).toBeTruthy();
                behavior.selectIndex(3, false);
                expect(behavior.verifySingleSelectedAt(3)).toBeTruthy();
                behavior.selectIndex(0, true);
                expect(behavior.verifySelectionState([true, false, false, true, false, false, false])).toBeTruthy();
            });

            it('Multiselect treated as single select when host says selection is invalid', () => {
                host.canSelect = () => false;
                interactivityService.bind(selectableDataPoints, behavior, null);
                behavior.selectIndex(1, true);
                expect(behavior.verifySelectionState([false, true, false, false, false, false, false])).toBeTruthy();
                behavior.selectIndex(2, true);
                expect(behavior.verifySelectionState([false, false, true, false, false, false, false])).toBeTruthy();
                behavior.selectIndex(5, true);
                expect(behavior.verifySelectionState([false, false, false, false, false, true, false])).toBeTruthy();
            });

            it('Multiselect cannot mix measure-only with non-measure-only selections', () => {
                let mixedSelectableDataPoints = [
                    { selected: false, identity: SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("0"), mocks.dataViewScopeIdentity("a"), "queryName") },
                    { selected: false, identity: SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("0"), mocks.dataViewScopeIdentity("b"), "queryName") },
                    { selected: false, identity: SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("1"), mocks.dataViewScopeIdentity("a"), "queryName") },
                    { selected: false, identity: SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("1"), mocks.dataViewScopeIdentity("b"), "queryName") },
                    { selected: false, identity: SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("2"), mocks.dataViewScopeIdentity("a"), "queryName") },
                    { selected: false, identity: SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("2"), mocks.dataViewScopeIdentity("b"), "queryName") },
                    { selected: false, identity: SelectionId.createWithMeasure("queryName2") },
                    { selected: false, identity: SelectionId.createWithMeasure("queryName3") },
                ];
                let mixedBehavior = new MockBehavior(mixedSelectableDataPoints, filterPropertyId);
                interactivityService.bind(mixedSelectableDataPoints, mixedBehavior, null);
                mixedBehavior.selectIndex(1, true);
                expect(mixedBehavior.verifySelectionState([false, true, false, false, false, false, false, false])).toBeTruthy();
                mixedBehavior.selectIndex(2, true);
                expect(mixedBehavior.verifySelectionState([false, true, true, false, false, false, false, false])).toBeTruthy();
                mixedBehavior.selectIndex(6, true);
                expect(mixedBehavior.verifySelectionState([false, false, false, false, false, false, true, false])).toBeTruthy();
                mixedBehavior.selectIndex(7, true);
                expect(mixedBehavior.verifySelectionState([false, false, false, false, false, false, true, true])).toBeTruthy();
                mixedBehavior.selectIndex(1, true);
                expect(mixedBehavior.verifySelectionState([false, true, false, false, false, false, false, false])).toBeTruthy();
            });

            it('Null identity', () => {
                let nullIdentity: SelectableDataPoint = {
                    selected: false,
                    identity: null,
                    specificIdentity: SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("0"), mocks.dataViewScopeIdentity("a"), "queryName"),
                };
                interactivityService.handleSelection(nullIdentity, false);
                expect(interactivityService.hasSelection()).toBe(false);
            });

            it('Null specific identity', () => {
                let nullIdentity: SelectableDataPoint = {
                    selected: false,
                    identity: SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("0"), mocks.dataViewScopeIdentity("a"), "queryName"),
                    specificIdentity: null,
                };
                interactivityService.handleSelection(nullIdentity, false);
                expect(interactivityService.hasSelection()).toBe(true);
            });

            it('Null for identity and specific identity', () => {
                let nullIdentity: SelectableDataPoint = {
                    selected: false,
                    identity: null,
                    specificIdentity: null,
                };
                interactivityService.handleSelection(nullIdentity, false);
                expect(interactivityService.hasSelection()).toBe(false);
            });
        });

        describe('Host interaction', () => {

            it('DataPointSelection is sent to host', () => {
                spyOn(host, "onSelecting");
                selectableDataPoints.push({ selected: false, identity: SelectionId.createWithIdAndMeasure(mocks.dataViewScopeIdentity("2"), "queryName"), specificIdentity: SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("2"), mocks.dataViewScopeIdentity("c"), "queryName") });
                interactivityService.bind(selectableDataPoints, behavior, null);
                behavior.selectIndex(6, false);
                expect(host.onSelecting).toHaveBeenCalledWith({ visualObjects: [{ objectName: 'dataPoint', selectorsByColumn: undefined }] });
            });

            it('Selection sent to host', () => {
                spyOn(host, "onSelect");
                let identity = SelectionId.createWithIdAndMeasureAndCategory(mocks.dataViewScopeIdentity("2"), "queryName", "categoryqueryName");
                selectableDataPoints.push({ selected: false, identity: identity, specificIdentity: SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("2"), mocks.dataViewScopeIdentity("c"), "queryName") });
                interactivityService.bind(selectableDataPoints, behavior, null);
                behavior.selectIndex(6, false);
                expect(host.onSelect).toHaveBeenCalledWith({ visualObjects: [{ objectName: 'dataPoint', selectorsByColumn: identity.getSelectorsByColumn() }] });
            });

            it('Selection for old ids sent to host', () => {
                spyOn(host, "onSelect");
                let identity = SelectionId.createWithIdAndMeasure(mocks.dataViewScopeIdentity("2"), "queryName");
                selectableDataPoints.push({ selected: false, identity: identity, specificIdentity: SelectionId.createWithIdsAndMeasure(mocks.dataViewScopeIdentity("2"), mocks.dataViewScopeIdentity("c"), "queryName") });
                interactivityService.bind(selectableDataPoints, behavior, null);
                behavior.selectIndex(6, false);
                expect(host.onSelect).toHaveBeenCalledWith({ visualObjects: [{ objectName: 'dataPoint', selectorsByColumn: undefined }], selectors: [identity.getSelector()] });
            });

            it('ContextMenu request sent to host', () => {
                let categoryA = mocks.dataViewScopeIdentity('A');
                let categoryColumn: powerbi.DataViewCategoryColumn = {
                    source: {
                        queryName: 'categoryA',
                        displayName: 'testDisplayName'
                    },
                    identity: [categoryA],
                    values: []
                };

                let id = SelectionIdBuilder.builder().withCategory(categoryColumn, 0).createSelectionId();
                let dataPoint: SelectableDataPoint = {
                    selected: false,
                    identity: id
                };

                let contextMenuSpy = spyOn(host, "onContextMenu");
                interactivityService.handleContextMenu(dataPoint, { x: 5, y: 15 });

                expect(contextMenuSpy.calls.argsFor(0)[0].data[0]).toEqual({
                    dataMap: {
                        categoryA: id.getSelector().data[0]
                    }
                });
            });

            it('persistSelectionFilter calls persistProperties', () => {
                interactivityService.bind(selectableDataPoints, behavior, null);
                spyOn(host, "persistProperties");
                behavior.bindEvents(null, interactivityService);
                behavior.selectIndexAndPersist(0, false);
                expect(host.persistProperties).toHaveBeenCalled();
            });

            it('persistSelfFilter calls persistProperties', () => {
                let valueHandler = new MockSlicerValueHandler();
                valueHandler.searchKey = 'apple';
                interactivityService.bind(selectableDataPoints, behavior, null, { slicerValueHandler: valueHandler });
                spyOn(host, "persistProperties");
                behavior.bindEvents(null, interactivityService);
                let selfFilterPropertyIdentifier: powerbi.DataViewObjectPropertyIdentifier = {
                    objectName: 'general',
                    propertyName: 'selfFilter',
                };
                interactivityService.persistSelfFilter(selfFilterPropertyIdentifier, valueHandler.getSelfFilter());
                expect(host.persistProperties).toHaveBeenCalledWith({
                    merge: [{
                        objectName: 'general',
                        selector: undefined,
                        properties: {
                            'selfFilter': valueHandler.getSelfFilter(),
                        }
                    }]
                });
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

        describe('Labels', () => {

            it('Basic selection', () => {
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
        });

        describe('Slicer', () => {

            describe('createChangeForFilterProperty', () => {
                beforeEach(() => {
                    interactivityService.bind(selectableDataPoints, behavior, null);
                });

                it('select a single data point', () => {
                    behavior.bindEvents(null, interactivityService);
                    spyOn(host, "persistProperties");
                    behavior.selectIndexAndPersist(0, false);

                    expect(host.persistProperties).toHaveBeenCalledWith({
                        merge: [{
                            objectName: 'general',
                            selector: undefined,
                            properties: {
                                'filter': powerbi.data.Selector.filterFromSelector([selectableDataPoints[0].identity.getSelector()], false),
                            }
                        }]
                    });
                });

                it('no selection should result in empty filter', () => {
                    behavior.bindEvents(null, interactivityService);
                    behavior.selectIndexAndPersist(0, false);

                    // select the same index again to unselect the selected data.
                    spyOn(host, "persistProperties");
                    behavior.selectIndexAndPersist(0, false);
                    expect(host.persistProperties).toHaveBeenCalledWith({
                        remove: [{
                            objectName: 'general',
                            selector: undefined,
                            properties: {
                                'filter': {},
                            }
                        }]
                    });
                });
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

            describe('Selection', () => {

                it('Basic selection', () => {
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
                        visualObjects: [
                            {
                                objectName: 'dataPoint',
                                selectorsByColumn: undefined,
                            },
                            {
                                objectName: 'dataPoint',
                                selectorsByColumn: undefined,
                            }
                        ],
                        selectors: [
                            identities[5].getSelector(),
                            identities[0].getSelector(),
                        ],
                    }]);
                });

                it('Slicer selection with default value', () => {
                    selectableDataPoints[5].selected = true;
                    interactivityService.bind(selectableDataPoints, behavior, null, { slicerValueHandler: new MockSlicerValueHandler() });
                    behavior.bindEvents(null, interactivityService);

                    let spyCalled = false;
                    spyOn(host, "persistProperties").and.callFake((change: powerbi.VisualObjectInstancesToPersist) => {
                        expect(powerbi.data.SemanticFilter.isDefaultFilter(<powerbi.data.SemanticFilter>change.merge[0].properties['filter'])).toBeTruthy();
                        spyCalled = true;
                    });
                    interactivityService.setDefaultValueMode(true);
                    let propertyIdentifier: powerbi.DataViewObjectPropertyIdentifier = {
                        objectName: 'general',
                        propertyName: 'filter'
                    };
                    interactivityService.clearSelection();
                    interactivityService.persistSelectionFilter(propertyIdentifier);
                    expect(spyCalled).toBe(true);
                });

                it('Slicer selection with any value', () => {
                    interactivityService.bind(selectableDataPoints, behavior, null, { slicerValueHandler: new MockSlicerValueHandler() });
                    behavior.bindEvents(null, interactivityService);
                    behavior.selectIndexAndPersist(0, false);

                    let spyCalled = false;
                    spyOn(host, "persistProperties").and.callFake((change: powerbi.VisualObjectInstancesToPersist) => {
                        expect(powerbi.data.SemanticFilter.isAnyFilter(<powerbi.data.SemanticFilter>change.merge[0].properties['filter'])).toBeTruthy();
                        spyCalled = true;
                    });

                    // clear the selected value.
                    behavior.selectIndexAndPersist(0, false);
                    expect(spyCalled).toBe(true);
                });
            });
        });
    });

    function getSelectedIds(interactivityService: powerbi.visuals.IInteractivityService): SelectionId[] {    
        // Accessing a private member.
        return interactivityService['selectedIds'];
    }

    class MockSlicerValueHandler implements powerbi.visuals.SlicerValueHandler {
        private sqExpr = SQExprBuilder.columnRef(SQExprBuilder.entity('s', 'Entity2'), 'Prop2');

        public getIdentityFields(): powerbi.data.SQExpr[]{
            return [this.sqExpr];
        }

        public getDefaultValue(): powerbi.data.SQConstantExpr {
            return SQExprBuilder.integer(2);
        }

        public getUpdatedSelfFilter(searchKey: string): powerbi.data.SemanticFilter {
            return this.getSelfFilter();
        }

        public getSelfFilter(): powerbi.data.SemanticFilter {
            let filterExpr = SQExprBuilder.contains(this.sqExpr, SQExprBuilder.text(this.searchKey));
            return powerbi.data.SemanticFilter.fromSQExpr(filterExpr);
        }

        public searchKey: string;
    }
}
