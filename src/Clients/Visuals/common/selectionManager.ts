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

module powerbi.visuals.utility {
    export interface SelectionManagerOptions{
        hostServices: IVisualHostServices;
    };

    export class SelectionManager {
        private selectedIds: SelectionId[];
        private hostServices: IVisualHostServices;

        private dataPointObjectName = 'dataPoint';

        public constructor(options: SelectionManagerOptions) {
            this.hostServices = options.hostServices;
            this.selectedIds = [];
        }

        public select(selectionId: SelectionId, multiSelect: boolean = false): JQueryDeferred<SelectionId[]> {
            let deferred: JQueryDeferred<data.Selector[]> = $.Deferred();

            if (this.hostServices.shouldRetainSelection()) {
                this.sendSelectionToHost([selectionId]);
            }
            else {
                this.selectInternal(selectionId, multiSelect);
                this.sendSelectionToHost(this.selectedIds);
            }

            deferred.resolve(this.selectedIds);
            return deferred;
        }

        public showContextMenu(selectionId: SelectionId, position?: Point): JQueryDeferred<{}> {
            let deferred: JQueryDeferred<{}> = $.Deferred();

            position = position || InteractivityUtils.getPositionOfLastInputEvent();
            this.sendContextMenuToHost(selectionId, position);

            deferred.resolve();
            return deferred;
        }

        public hasSelection(): boolean {
            return this.selectedIds.length > 0;
        }

        public clear(): JQueryDeferred<{}> {
            let deferred = $.Deferred();
            this.selectedIds = [];
            this.sendSelectionToHost([]);
            deferred.resolve();
            return deferred;
        }

        public getSelectionIds(): SelectionId[] {
            return this.selectedIds;
        }

        private sendSelectionToHost(ids: SelectionId[]) {
            let dataPointObjectName = this.dataPointObjectName;
            let selectArgs: SelectEventArgs = {
                visualObjects: _.chain(ids)
                    .filter((value: ISelectionId) => (<visuals.SelectionId>value).hasIdentity())
                    .map((value: ISelectionId) => {
                        return { objectName: dataPointObjectName, selectorsByColumn: (<visuals.SelectionId>value).getSelectorsByColumn() };
                    })
                    .value(),
                selectors: undefined,
            };
            let shouldInsertSelectors = false;
            if (!_.isEmpty(ids)) {
                shouldInsertSelectors = (<visuals.SelectionId>ids[0]).getSelector() && !(<visuals.SelectionId>ids[0]).getSelectorsByColumn();
            }
            if (shouldInsertSelectors) {
                selectArgs.selectors = _.chain((<visuals.SelectionId[]>ids))
                    .filter((value: visuals.SelectionId) => value.hasIdentity())
                    .map((value: visuals.SelectionId) => value.getSelector())
                    .value();
            }

            this.hostServices.onSelect(selectArgs);
        }

        private sendContextMenuToHost(selectionId: SelectionId, position: IPoint): void {
            let selectors = this.getSelectorsByColumn([selectionId]);
            if (_.isEmpty(selectors))
                return;

            let args: ContextMenuArgs = {
                data: selectors,
                position: position
            };

            this.hostServices.onContextMenu(args);
        }

        private getSelectorsByColumn(selectionIds: SelectionId[]): SelectorsByColumn[] {
            return _(selectionIds)
                .filter(value => value.hasIdentity)
                .map(value => value.getSelectorsByColumn())
                .compact()
                .value();
        }

        private selectInternal(selectionId: SelectionId, multiSelect: boolean) {
            if (SelectionManager.containsSelection(this.selectedIds, selectionId)) {
                this.selectedIds = multiSelect
                    ? this.selectedIds.filter(d => !data.Selector.equals(d, selectionId))
                    : this.selectedIds.length > 1
                        ? [selectionId] : [];
            } else {
                if (multiSelect)
                    this.selectedIds.push(selectionId);
                else
                    this.selectedIds = [selectionId];
            }
        }

        public static containsSelection(list: SelectionId[], id: SelectionId) {
            return list.some(d => data.Selector.equals(d.getSelector(), id.getSelector()));
        }
    }
} 