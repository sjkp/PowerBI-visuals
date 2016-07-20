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

module powerbi.visuals {
    import ArrayExtensions = jsCommon.ArrayExtensions;
    import SemanticFilter = powerbi.data.SemanticFilter;

    export interface SelectableDataPoint {
        selected: boolean;
        /** Identity for identifying the selectable data point for selection purposes */
        identity: SelectionId;
        /**
         * A specific identity for when data points exist at a finer granularity than
         * selection is performed.  For example, if your data points should select based
         * only on series even if they exist as category/series intersections.
         */
        specificIdentity?: SelectionId;
    }

    /**
     * Factory method to create an IInteractivityService instance.
     */
    export function createInteractivityService(hostServices: IVisualHostServices): IInteractivityService {
        return new InteractivityService(hostServices);
    }

    /**
     * Creates a clear an svg rect to catch clear clicks.
     */
    export function appendClearCatcher(selection: D3.Selection): D3.Selection {
        return selection
            .append("rect")
            .classed("clearCatcher", true)
            .attr({ width: "100%", height: "100%" });
    }

    export function isCategoryColumnSelected(propertyId: DataViewObjectPropertyIdentifier, categories: DataViewCategoricalColumn, idx: number): boolean {
        return categories.objects != null
            && categories.objects[idx]
            && DataViewObjects.getValue<boolean>(categories.objects[idx], propertyId);
    }

    export function dataHasSelection(data: SelectableDataPoint[]): boolean {
        for (let i = 0, ilen = data.length; i < ilen; i++) {
            if (data[i].selected)
                return true;
        }
        return false;
    }

    export interface IInteractiveBehavior {
        bindEvents(behaviorOptions: any, selectionHandler: ISelectionHandler): void;
        renderSelection(hasSelection: boolean): void;
    }

    /**
     * An optional options bag for binding to the interactivityService
     */
    export interface InteractivityServiceOptions {
        isLegend?: boolean;
        isLabels?: boolean;
        overrideSelectionFromData?: boolean;
        hasSelectionOverride?: boolean;
        slicerValueHandler?: SlicerValueHandler;
    }

    /**
     * Responsible for managing interactivity between the hosting visual and its peers
     */
    export interface IInteractivityService {
        /** Binds the visual to the interactivityService */
        bind(dataPoints: SelectableDataPoint[], behavior: IInteractiveBehavior, behaviorOptions: any, iteractivityServiceOptions?: InteractivityServiceOptions);

        /** Clears the selection */
        clearSelection(): void;

        /** Sets the selected state on the given data points. */
        applySelectionStateToData(dataPoints: SelectableDataPoint[]): boolean;

        /** Checks whether there is at least one item selected */
        hasSelection(): boolean;

        /** Checks whether there is at least one item selected within the legend */
        legendHasSelection(): boolean;

        /** Checks whether the selection mode is inverted or normal */
        isSelectionModeInverted(): boolean;

        /** Sets whether the selection mode is inverted or normal */
        setSelectionModeInverted(inverted: boolean): void;

        setDefaultValueMode(useDefaultValue: boolean): void;

        isDefaultValueEnabled(): boolean;
    }

    export interface ISelectionHandler {
        /**
         * Handles a selection event by selecting the given data point.  If the data point's
         * identity is undefined, the selection state is cleared. In this case, if specificIdentity
         * exists, it will still be sent to the host.
         */
        handleSelection(dataPoint: SelectableDataPoint, multiSelect: boolean): void;

        /** Handles a request for a context menu. */
        handleContextMenu(dataPoint: SelectableDataPoint, position: IPoint): void;

        /** Handles a selection clear, clearing all selection state */
        handleClearSelection(): void;

        /** Toggles the selection mode between normal and inverted; returns true if the new mode is inverted */
        toggleSelectionModeInversion(): boolean;

        /** Sends the selection state to the host */
        persistSelectionFilter(filterPropertyIdentifier: DataViewObjectPropertyIdentifier): void;

        /** Sends selfFilter to the host */
        persistSelfFilter(filterPropertyIdentifier: DataViewObjectPropertyIdentifier, selfFilter: SemanticFilter): void;
    }

    export class InteractivityService implements IInteractivityService, ISelectionHandler {
        // References
        private hostService: IVisualHostServices;
        private renderSelectionInVisual = _.noop;
        private renderSelectionInLegend = _.noop;
        private renderSelectionInLabels = _.noop;

        // Selection state
        private selectedIds: SelectionId[] = [];
        private isInvertedSelectionMode: boolean = false;
        private hasSelectionOverride: boolean;
        private behavior: any;

        // TODO: It is very strange to expose a special handler for slicer in the interactivityService.
        // We should consider introduce another interface for visuals to implement their own filtering handlers.
        private slicerValueHandler: SlicerValueHandler;

        // undefined means no default value is set
        // True: apply default value. False: apply AnyValue.
        private useDefaultValue: boolean;

        public selectableDataPoints: SelectableDataPoint[];
        public selectableLegendDataPoints: SelectableDataPoint[];
        public selectableLabelsDataPoints: SelectableDataPoint[];

        private dataPointObjectName = 'dataPoint';

        constructor(hostServices: IVisualHostServices) {
            debug.assertValue(hostServices, 'hostServices');

            this.hostService = hostServices;
        }

        // IInteractivityService Implementation

        /** Binds the vsiual to the interactivityService */
        public bind(dataPoints: SelectableDataPoint[], behavior: IInteractiveBehavior, behaviorOptions: any, options?: InteractivityServiceOptions): void {
            // Bind the data
            if (options && options.overrideSelectionFromData) {
                // Override selection state from data points if needed
                this.takeSelectionStateFromDataPoints(dataPoints);
            }

            if (options){
                if (options.isLegend) {
                    // Bind to legend data instead of normal data if isLegend
                    this.selectableLegendDataPoints = dataPoints;
                    this.renderSelectionInLegend = () => behavior.renderSelection(this.legendHasSelection());
                }
                else if (options.isLabels) {
                    //Bind to label data instead of normal data if isLabels
                    this.selectableLabelsDataPoints = dataPoints;
                    this.renderSelectionInLabels = () => behavior.renderSelection(this.labelsHasSelection());
                }
                else {
                    this.selectableDataPoints = dataPoints;
                    this.renderSelectionInVisual = () => behavior.renderSelection(this.hasSelection());
                }

                if (options.hasSelectionOverride != null)
                    this.hasSelectionOverride = options.hasSelectionOverride;

                if (options.slicerValueHandler)
                    this.slicerValueHandler = options.slicerValueHandler;

            } 
            else {
                this.selectableDataPoints = dataPoints;
                this.renderSelectionInVisual = () => behavior.renderSelection(this.hasSelection());
            }

            // Bind to the behavior
            this.behavior = behavior;
            behavior.bindEvents(behaviorOptions, this);
            // Sync data points with current selection state
            this.syncSelectionState();
        }

        /**
         * Sets the selected state of all selectable data points to false and invokes the behavior's select command.
         */
        public clearSelection(): void {
            // if default value is already applied, don't clear the default selection
            if (this.slicerValueHandler && this.slicerValueHandler.getDefaultValue() && this.useDefaultValue) {
                this.isInvertedSelectionMode = false;
                return;
            }

            this.hasSelectionOverride = undefined;
            ArrayExtensions.clear(this.selectedIds);
            this.isInvertedSelectionMode = false;
            this.applyToAllSelectableDataPoints((dataPoint: SelectableDataPoint) => dataPoint.selected = false);
            this.renderAll();
        }

        public applySelectionStateToData(dataPoints: SelectableDataPoint[]): boolean {
            for (let dataPoint of dataPoints) {
                dataPoint.selected = InteractivityService.checkDatapointAgainstSelectedIds(dataPoint, this.selectedIds);
            }

            return this.hasSelection();
        }

        /**
         * Checks whether there is at least one item selected.
         */
        public hasSelection(): boolean {
            return this.selectedIds.length > 0;
        }

        public legendHasSelection(): boolean {
            return this.selectableLegendDataPoints ? dataHasSelection(this.selectableLegendDataPoints) : false;
        }

        public labelsHasSelection(): boolean {
            return this.selectableLabelsDataPoints ? dataHasSelection(this.selectableLabelsDataPoints) : false;
        }

        public isSelectionModeInverted(): boolean {
            return this.isInvertedSelectionMode;
        }

        public setSelectionModeInverted(inverted: boolean): void {
            this.isInvertedSelectionMode = inverted;
        }

        // ISelectionHandler Implementation

        public handleSelection(dataPoint: SelectableDataPoint, multiSelect: boolean): void {
            // defect 7067397: should not happen so assert but also don't continue as it's
            // causing a lot of error telemetry in desktop.
            debug.assertValue(dataPoint, 'dataPoint');
            if (!dataPoint)
                return;

            let selectingSelectorsByColumn: SelectorsByColumn;
            if (dataPoint.specificIdentity) {
                selectingSelectorsByColumn = dataPoint.specificIdentity.getSelectorsByColumn();
            }
            else if (dataPoint.identity) {
                selectingSelectorsByColumn = dataPoint.identity.getSelectorsByColumn();
            }

            let selectingArgs: SelectingEventArgs = {
                visualObjects: [{
                    objectName: this.dataPointObjectName,
                    selectorsByColumn: selectingSelectorsByColumn,
                }],
            };
            this.hostService.onSelecting(selectingArgs);

            if (selectingArgs.action === VisualInteractivityAction.Selection || selectingArgs.action == null) {
                if (!dataPoint.identity) {
                    this.handleClearSelection();
                }
                else {
            this.useDefaultValue = false;
            this.select(dataPoint, multiSelect);
            this.sendSelectionToHost();
            this.renderAll();
        }
            }
        }

        public handleContextMenu(dataPoint: SelectableDataPoint, point: IPoint): void {
            this.sendContextMenuToHost(dataPoint, point);
        }

        public handleClearSelection(): void {
            this.useDefaultValue = true;
            this.clearSelection();
            this.sendSelectionToHost();
        }

        public toggleSelectionModeInversion(): boolean {
            this.useDefaultValue = false;
            this.isInvertedSelectionMode = !this.isInvertedSelectionMode;
            ArrayExtensions.clear(this.selectedIds);
            this.applyToAllSelectableDataPoints((dataPoint: SelectableDataPoint) => dataPoint.selected = false);
            this.sendSelectionToHost();
            this.isInvertedSelectionMode ? this.syncSelectionStateInverted() : this.syncSelectionState();
            this.renderAll();
            return this.isInvertedSelectionMode;
        }

        public persistSelectionFilter(filterPropertyIdentifier: DataViewObjectPropertyIdentifier): void {
            this.hostService.persistProperties(InteractivityService.createChangeForFilterProperty(filterPropertyIdentifier, this.getFilterFromSelectors()));
        }

        public persistSelfFilter(filterPropertyIdentifier: DataViewObjectPropertyIdentifier, selfFilter: SemanticFilter): void {
            this.hostService.persistProperties(InteractivityService.createChangeForFilterProperty(filterPropertyIdentifier, selfFilter));
        }

        public setDefaultValueMode(useDefaultValue: boolean): void {
            this.useDefaultValue = useDefaultValue;
        }

        public isDefaultValueEnabled(): boolean {
            return this.useDefaultValue;
        }

        // Private utility methods

        private renderAll(): void {
            this.renderSelectionInVisual();
            this.renderSelectionInLegend();
            this.renderSelectionInLabels();
        }

        /** Marks a data point as selected and syncs selection with the host. */
        private select(d: SelectableDataPoint, multiSelect: boolean): void {
            // If we're in inverted mode, use the invertedSelect instead
            if (this.isInvertedSelectionMode) {
                return this.selectInverted(d, multiSelect);
            }

            // For highlight data points we actually want to select the non-highlight data point
            if (d.identity && d.identity.highlight) {
                d = _.find(this.selectableDataPoints, (dp: SelectableDataPoint) => !dp.identity.highlight && d.identity.includes(dp.identity, /* ignoreHighlight */ true));
                debug.assertValue(d, 'Expected to find a non-highlight data point');
            }

            let id = d.identity;

            if (!id)
                return;

            let selected = !d.selected || (!multiSelect && this.selectedIds.length > 1);

            // If we have a multiselect flag, we attempt a multiselect
            if (multiSelect) {
                if (selected) {
                    d.selected = true;
                    this.selectedIds.push(id);
                    if (id.hasIdentity()) {
                        this.removeSelectionIdsWithOnlyMeasures();
                    }
                    else {
                        this.removeSelectionIdsExceptOnlyMeasures();
                    }
                }
                else {
                    d.selected = false;
                    this.removeId(id);
                }
            }
            // We do a single select if we didn't do a multiselect or if we find out that the multiselect is invalid.
            if (!multiSelect || !this.hostService.canSelect(this.createSelectEventArgs(this.selectedIds))) {
                this.clearSelection();
                if (selected) {
                    d.selected = true;
                    this.selectedIds.push(id);
                }
            }

            this.syncSelectionState();
        }

        private selectInverted(d: SelectableDataPoint, multiSelect: boolean): void {
            let wasSelected = d.selected;
            let id = d.identity;
            debug.assert(!!multiSelect, "inverted selections are only supported in multiselect mode");

            // the current datapoint state has to be inverted
            d.selected = !wasSelected;

            if (wasSelected) {
                this.removeId(id);
            }
            else {
                this.selectedIds.push(id);
                if (id.hasIdentity()) {
                    this.removeSelectionIdsWithOnlyMeasures();
                }
                else {
                    this.removeSelectionIdsExceptOnlyMeasures();
                }
            }

            this.syncSelectionStateInverted();
        }

        private removeId(toRemove: SelectionId): void {
            let selectedIds = this.selectedIds;
            for (let i = selectedIds.length - 1; i > -1; i--) {
                let currentId = selectedIds[i];

                if (toRemove.includes(currentId))
                    selectedIds.splice(i, 1);
            }
        }

        private getFilterFromSelectors(): SemanticFilter {
            let selectors: data.Selector[] = [];

            if (this.selectedIds.length > 0) {
                selectors = _.chain(this.selectedIds)
                    .filter((value: SelectionId) => value.hasIdentity())
                    .map((value: SelectionId) => value.getSelector())
                    .value();
            }

            let filter = powerbi.data.Selector.filterFromSelector(selectors, this.isInvertedSelectionMode);
            if (this.slicerValueHandler && this.slicerValueHandler.getDefaultValue()) {
                // we explicitly check for true/false because undefine means no default value
                if (this.useDefaultValue === true)
                    filter = SemanticFilter.getDefaultValueFilter(this.slicerValueHandler.getIdentityFields());
                else if (_.isEmpty(selectors))
                    filter = SemanticFilter.getAnyValueFilter(this.slicerValueHandler.getIdentityFields());
            }

            return filter;
        }

        private static createChangeForFilterProperty(filterPropertyIdentifier: DataViewObjectPropertyIdentifier, filter: SemanticFilter): VisualObjectInstancesToPersist {
            let properties: { [propertyName: string]: DataViewPropertyValue } = {};
            let instance = {
                objectName: filterPropertyIdentifier.objectName,
                selector: undefined,
                properties: properties
            };

            if (filter == null) {
                properties[filterPropertyIdentifier.propertyName] = {};
                return <VisualObjectInstancesToPersist> {
                    remove: [instance]
                };
            }
            else {
                properties[filterPropertyIdentifier.propertyName] = filter;
                return <VisualObjectInstancesToPersist> {
                    merge: [instance]
                };
            }
        }

        private sendContextMenuToHost(dataPoint: SelectableDataPoint, position: IPoint): void {
            let host = this.hostService;
            if (!host.onContextMenu)
                return;

            let selectors = this.getSelectorsByColumn([dataPoint.identity]);
            if (_.isEmpty(selectors))
                return;

            let args: ContextMenuArgs = {
                data: selectors,
                position: position
            };

            host.onContextMenu(args);
        }

        private sendSelectionToHost() {
            let host = this.hostService;
            if (host.onSelect) {
                let selectArgs = this.createSelectEventArgs(this.selectedIds);

                host.onSelect(selectArgs);
            }
        }

        private createSelectEventArgs(selectedIds: SelectionId[]): SelectEventArgs {
            let shouldInsertSelectors = false;
            let dataPointObjectName = this.dataPointObjectName;
            if (!_.isEmpty(selectedIds)) {
                shouldInsertSelectors = selectedIds[0].getSelector() && !selectedIds[0].getSelectorsByColumn();
            }
            let selectedIdsWithIdentities = _.chain(selectedIds)
                .filter((value: SelectionId) => value.hasIdentity());
            let selectEventArgs: SelectEventArgs = {
                visualObjects: selectedIdsWithIdentities
                    .map((value: SelectionId) => { return { objectName: dataPointObjectName, selectorsByColumn: value.getSelectorsByColumn() }; })
                    .value(),
            };
            if (shouldInsertSelectors) {
                selectEventArgs.selectors = selectedIdsWithIdentities
                    .map((value: SelectionId) => value.getSelector())
                    .value();
            }
            return selectEventArgs;
        }

        private getSelectorsByColumn(selectionIds: SelectionId[]): SelectorsByColumn[] {
            return _(selectionIds)
                .filter(value => value.hasIdentity)
                .map(value => value.getSelectorsByColumn())
                .compact()
                .value();
        }

        private takeSelectionStateFromDataPoints(dataPoints: SelectableDataPoint[]): void {
            debug.assertValue(dataPoints, "dataPoints");

            let selectedIds: SelectionId[] = this.selectedIds;

            // Replace the existing selectedIds rather than merging.
            ArrayExtensions.clear(selectedIds);

            for (let dataPoint of dataPoints) {
                if (dataPoint.selected)
                    selectedIds.push(dataPoint.identity);
            }
        }

        /**
         * Syncs the selection state for all data points that have the same category. Returns
         * true if the selection state was out of sync and corrections were made; false if
         * the data is already in sync with the service.
         *
         * If the data is not compatible with the current service's current selection state,
         * the state is cleared and the cleared selection is sent to the host.
         * 
         * Ignores series for now, since we don't support series selection at the moment.
         */
        private syncSelectionState(): void {
            if (this.isInvertedSelectionMode) {
                return this.syncSelectionStateInverted();
            }

            let selectedIds = this.selectedIds;
            let selectableDataPoints = this.selectableDataPoints;
            let selectableLegendDataPoints = this.selectableLegendDataPoints;
            let selectableLabelsDataPoints = this.selectableLabelsDataPoints;
            let foundMatchingId = false; // Checked only against the visual's data points; it's possible to have stuff selected in the visual that's not in the legend, but not vice-verse

            if (!selectableDataPoints && !selectableLegendDataPoints)
                return;

            if (selectableDataPoints) {
                if (InteractivityService.updateSelectableDataPointsBySelectedIds(selectableDataPoints, selectedIds))
                    foundMatchingId = true;
            }

            if (selectableLegendDataPoints) {
                if (InteractivityService.updateSelectableDataPointsBySelectedIds(selectableLegendDataPoints, selectedIds))
                    foundMatchingId = true;
            }

            if (selectableLabelsDataPoints) {
                let labelsDataPoint: SelectableDataPoint;
                for (let i = 0, ilen = selectableLabelsDataPoints.length; i < ilen; i++) {
                    labelsDataPoint = selectableLabelsDataPoints[i];
                    if (selectedIds.some((value: SelectionId) => value.includes(labelsDataPoint.identity)))
                        labelsDataPoint.selected = true;
                    else
                        labelsDataPoint.selected = false;
                }
            }

            if (!foundMatchingId && selectedIds.length > 0) {
                this.clearSelection();
                this.sendSelectionToHost();
            }
        }

        private syncSelectionStateInverted(): void {
            let selectedIds = this.selectedIds;
            let selectableDataPoints = this.selectableDataPoints;
            if (!selectableDataPoints)
                return;

            if (selectedIds.length === 0) {
                for (let dataPoint of selectableDataPoints) {
                    dataPoint.selected = false;
                }
            }
            else {
                for (var dataPoint of selectableDataPoints) {
                    if (selectedIds.some((value: SelectionId) => value.includes(dataPoint.identity)))
                        dataPoint.selected = true;
                    else if (dataPoint.selected)
                        dataPoint.selected = false;
                }
            }
        }

        private applyToAllSelectableDataPoints(action: (selectableDataPoint: SelectableDataPoint) => void) {
            let selectableDataPoints = this.selectableDataPoints;
            let selectableLegendDataPoints = this.selectableLegendDataPoints;
            let selectableLabelsDataPoints = this.selectableLabelsDataPoints;
            if (selectableDataPoints) {
                for (let dataPoint of selectableDataPoints) {
                    action(dataPoint);
                }
            }

            if (selectableLegendDataPoints) {
                for (let dataPoint of selectableLegendDataPoints) {
                    action(dataPoint);
                }
            }

            if (selectableLabelsDataPoints) {
                for (let dataPoint of selectableLabelsDataPoints) {
                    action(dataPoint);
                }
            }
        }

        private static updateSelectableDataPointsBySelectedIds(selectableDataPoints: SelectableDataPoint[], selectedIds: SelectionId[]): boolean {
            let foundMatchingId = false;

            for (let datapoint of selectableDataPoints) {
                datapoint.selected = InteractivityService.checkDatapointAgainstSelectedIds(datapoint, selectedIds);

                if (datapoint.selected)
                    foundMatchingId = true;
            }

            return foundMatchingId;
        }

        private static checkDatapointAgainstSelectedIds(datapoint: SelectableDataPoint, selectedIds: SelectionId[]): boolean {
            return selectedIds.some((value: SelectionId) => value.includes(datapoint.identity));
        }

        private removeSelectionIdsWithOnlyMeasures() {
            this.selectedIds = _.filter(this.selectedIds, (identity) => identity.hasIdentity());
        }

        private removeSelectionIdsExceptOnlyMeasures() {
            this.selectedIds = _.filter(this.selectedIds, (identity) => !identity.hasIdentity());
        }
    };
}