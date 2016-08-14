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

/// <reference path="./_references.ts"/>

interface JQuery {
    resizable(options: any): JQuery;
}

module powerbi.visuals {

    import SampleData = powerbi.visuals.sampleData.SampleData;

    export interface IHost {
        name: string;
        resizable: boolean;
        interactive: boolean;
        container: JQuery;
        renderingScale: number;
        visual?: IVisual;
        renderingViewport?: IViewport;
    }

    export class HostControls {

        private dataViewsSelect: JQuery;

        /** Represents sample data views used by visualization elements.*/
        private sampleDataViews;
        private animation_duration: number = 250;
        private suppressAnimations: boolean = true;

        private suppressAnimationsElement: JQuery;
        private animationDurationElement: JQuery;

        private hosts: { [name: string]: IHost };

        private minWidth: number = 200;
        private maxWidth: number = 1000;
        private minHeight: number = 100;
        private maxHeight: number = 600;

        // Since there are some unexpected behaviors in interactive visuals when randomizing the data, we use this method to create the visual from scratch instead.
        private resetInteractiveVisual: (IHost) => void;

        constructor(parent: JQuery, resetInteractiveVisualDelegate: (IHost) => void) {
            parent.find('#randomize').on('click', () => this.randomize());

            this.dataViewsSelect = parent.find('#dataViewsSelect').first();

            this.suppressAnimationsElement = parent.find('input[name=suppressAnimations]').first();
            this.suppressAnimationsElement.on('change', () => this.onChangeSuppressAnimations());

            this.animationDurationElement = parent.find('input[name=animation_duration]').first();
            this.animationDurationElement.on('change', () => this.onChangeDuration());

            this.resetInteractiveVisual = resetInteractiveVisualDelegate;
        }

        public setHosts(hosts: IHost[]): void {
            this.hosts = {};

            for (let host of hosts) {
                this.hosts[host.name] = host;

                if (host.resizable) {
                    host.container.resizable({
                        minWidth: this.minWidth,
                        maxWidth: this.maxWidth,
                        minHeight: this.minHeight,
                        maxHeight: this.maxHeight,

                        resize: (event, ui) => this.onResize(ui.element)
                    });
                }

                this.onResize(host.container);
            }
        }

        private onResize(container: JQuery): void {
            let host = this.findHostByContainerElement(container);
            let containerSize = this.getContainerSize(host);
            host.renderingViewport = {
                height: containerSize.height * host.renderingScale - 20,
                width: containerSize.width * host.renderingScale - 20
            };

            if (host.visual) {
                if (host.visual.onResizing) {
                    host.visual.onResizing(host.renderingViewport);
                }

                if (host.visual.update) {
                    host.visual.update({
                        dataViews: this.sampleDataViews.getDataViews(),
                        suppressAnimations: true,
                        viewport: host.renderingViewport
                    });
                }
            }
        }

        public getContainerSize(host: IHost): IViewport {
            return {
                // The containers' parent elements set the size of the container since the container itself is enlarged before scaling the visual
                height: host.container.parent().height(),
                width: host.container.parent().width()
            };
        }

        private randomize(): void {
            this.sampleDataViews.randomize();
            for (let hostName in this.hosts) {
                let host = this.hosts[hostName];
                if (host.interactive) {
                    // Since there are some unexpected behaviors in interactive visuals when randomizing the data, we use this method to create the visual from scratch instead.
                    this.resetInteractiveVisual(host);
                } else {
                    this.updateHost(host);
                }
            }
        }

        private onChangeDuration(): void {
            this.animation_duration = parseInt(this.animationDurationElement.val(), 10);
            this.update();
        }

        private onChangeSuppressAnimations(): void {
            this.suppressAnimations = !this.suppressAnimationsElement.is(':checked');
            this.update();
        }

        public update(): void {
            for (let hostName in this.hosts) {
                this.updateHost(this.hosts[hostName]);
            }
        }

        public updateHost(host: IHost) {
            if (host.visual) {
                if (host.visual.update) {
                    host.visual.update({
                        dataViews: this.sampleDataViews.getDataViews(),
                        suppressAnimations: this.suppressAnimations,
                        viewport: host.renderingViewport
                    });
                }

                if (host.visual.onDataChanged && host.visual.onResizing) {
                    host.visual.onDataChanged({
                        dataViews: this.sampleDataViews.getDataViews(),
                        suppressAnimations: this.suppressAnimations
                    });

                    host.visual.onResizing(host.renderingViewport);
                }
            }
        }

        public onPluginChange(pluginName: string): void {
            this.dataViewsSelect.empty();

            let dataViews = SampleData.getSamplesByPluginName(pluginName);
            let defaultDataView;

            dataViews.forEach((item, i) => {
                let option: JQuery = $('<option>');

                option.val(item.getName());
                option.text(item.getDisplayName());

                if (i === 0) {
                    option.attr('selected', 'selected');
                    defaultDataView = item.getName();
                }
                this.dataViewsSelect.append(option);
            });

            this.dataViewsSelect.change(() => {
                this.onChangeDataViewSelection(this.dataViewsSelect.val());
                this.update();
            });

            if (defaultDataView) {
                this.onChangeDataViewSelection(defaultDataView);
            }
        }

        private onChangeDataViewSelection(sampleName: string): void {
            this.sampleDataViews = SampleData.getDataViewsBySampleName(sampleName);
        }

        private findHostByContainerElement(container: JQuery): IHost {
            for (let hostName in this.hosts) {
                let currentHost = this.hosts[hostName];
                if (currentHost.container[0] === container[0]) {
                    return currentHost;
                }
            }

            return null;
        }
    }
}
