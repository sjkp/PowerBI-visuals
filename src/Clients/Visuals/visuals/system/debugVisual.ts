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

module powerbi.visuals.system {

    interface VisualErrorMessageOptions {
        message: string;
        moreMessage: string;
        moreLinkHref: string;
        moreLinkText: string;
        type: string;
    }

    export class DebugVisual implements IVisual {
        public static defaultCapabilities: VisualCapabilities = {
            dataRoles: [
                {
                    displayName: 'Values',
                    name: 'Values',
                    kind: VisualDataRoleKind.Measure
                },
            ],
            dataViewMappings: [
                {
                    table: {
                        rows: {
                            for: { in: 'Values' }
                        }
                    },
                }
            ],
        };
        public static capabilities: VisualCapabilities = DebugVisual.defaultCapabilities;

        private static autoReloadPollTime = 300;
        private static errorMessageTemplate = `
            <div class="errorContainer">
                <div class="errorMessage">
                    <div ng-switch="$ctrl.errorInfo.overlayType">
                        <div class="glyphicon pbi-glyph-<%= type %> glyph-med"></div>
                    </div>
                    <div>
                        <div class="errorSpan"><%= message %></div>
                        <span class="errorSeeMore"><%= moreMessage %></span>
                        <a class="errorSeeMore" href="<%= moreLinkHref %>" target="_blank"><%= moreLinkText %></a>
                    </div>
                </div>
            </div>
        `;

        private adapter: IVisual;
        private container: JQuery;
        private visualContainer: JQuery;
        private optionsForVisual: VisualInitOptions;
        private host: IVisualHostServices;
        private autoRefreshBtn: JQuery;
        private refreshBtn: JQuery;
        private dataBtn: JQuery;
        private lastUpdateOptions: VisualUpdateOptions;
        private lastUpdateStatus: string;
        private visualGuid: string;
        private autoReloadInterval: number;
        private statusLoading: boolean;
        private dataViewShowing: boolean;

        private reloadAdapter(auto: boolean = false): void {
            if (this.dataViewShowing) {
                if (auto) {
                    return;
                }
                this.toggleDataview(false);
            }

            let developerMode = localStorageService.getData('DEVELOPER_MODE_ENABLED');
            if (!developerMode) {
                this.toggleAutoReload(false);
                let errorMessage = this.buildErrorMessage({
                    message: this.host.getLocalizedString('DebugVisual_Enabled_Error_Message'),
                    moreMessage: this.host.getLocalizedString('DebugVisual_Enabled_Error_Learn_More'),
                    moreLinkHref: "https://aka.ms/powerbideveloperenablederror",
                    moreLinkText: this.host.getLocalizedString('DebugVisual_Enabled_Error_Learn_More_Link'),
                    type: 'blockedsite'
                });
                this.container.html(errorMessage);
                this.setCapabilities();
                return;
            }

            let baseUrl = localStorageService.getData('DEVELOPMENT_SERVER_URL') || 'https://localhost:8080/assets/';

            if (this.statusLoading) {
                return;
            }
            this.statusLoading = true;
            $.get(baseUrl + 'status').done((status) => {
                if (!status) {
                    return;
                }

                if (auto && this.lastUpdateStatus === status) {
                    return;
                }
                this.lastUpdateStatus = status;

                if (status === 'error') {
                    let errorMessage = this.buildErrorMessage({
                        message: this.host.getLocalizedString('DebugVisual_Compile_Error_Message'),
                        moreMessage: this.host.getLocalizedString('DebugVisual_Compile_Error_Learn_More'),
                        moreLinkHref: "https://aka.ms/powerbideveloperpbivizcompileerror",
                        moreLinkText: this.host.getLocalizedString('DebugVisual_Compile_Error_Learn_More_Link'),
                        type: 'repair'
                    });
                    this.container.html(errorMessage);
                    this.setCapabilities();
                    return;
                }

                $.getJSON(baseUrl + 'pbiviz.json').done((pbivizJson) => {
                    debug.assertValue(pbivizJson.capabilities, "DebugVisual - pbiviz capabilities missing");
                    debug.assertValue(pbivizJson.visual && pbivizJson.visual.guid, "DebugVisual - pbiviz visual guid missing");
                    if (!pbivizJson.capabilities || !pbivizJson.visual || !pbivizJson.visual.guid) {
                        return;
                    }

                    //update guid if needed
                    if (this.visualGuid !== pbivizJson.visual.guid) {
                        this.visualGuid = pbivizJson.visual.guid;
                    }

                    //loaded separately for sourcemap support
                    $.getScript(baseUrl + 'visual.js').done(() => {
                        debug.assertValue(plugins[this.visualGuid], "DebugVisual - Plugin not found");
                        if (!plugins[this.visualGuid]) {
                            return;
                        }
                        //attach json capabilities to plugin
                        plugins[this.visualGuid].capabilities = pbivizJson.capabilities;
                        //translate plugin
                        powerbi.extensibility.translateVisualPlugin(plugins[this.visualGuid]);
                        //loaded separately for sourcemap support
                        $.get(baseUrl + 'visual.css').done((data) => {
                            $('#css-DEBUG').remove();
                            $("<style/>", {
                                id: 'css-DEBUG',
                                html: data,
                            }).appendTo($('head'));

                            this.loadVisual(this.visualGuid);

                            //override debugVisual capabilities with user's
                            this.setCapabilities(plugins[this.visualGuid].capabilities);
                        });
                    });
                });
            }).fail(() => {
                this.toggleAutoReload(false);
                let errorMessage = this.buildErrorMessage({
                    message: this.host.getLocalizedString('DebugVisual_Server_Error_Message'),
                    moreMessage: this.host.getLocalizedString('DebugVisual_Server_Error_Learn_More'),
                    moreLinkHref: "https://aka.ms/powerbideveloperpbivizservererror",
                    moreLinkText: this.host.getLocalizedString('DebugVisual_Server_Error_Learn_More_Link'),
                    type: 'error'
                });
                this.container.html(errorMessage);
                this.setCapabilities();
            }).always(() => {
                this.statusLoading = false;
            });
        }

        private loadVisual(guid: string) {
            this.visualContainer.attr('class', 'visual-' + guid);
            this.visualContainer.empty();
            this.container.empty().append(this.visualContainer);
            let adapter = this.adapter = extensibility.createVisualAdapter(plugins[guid]);
            if (adapter.init) {
                adapter.init(this.optionsForVisual);
            }
            if (adapter.update && this.lastUpdateOptions) {
                let lastUpdateOptions = Prototype.inherit(this.lastUpdateOptions);
                lastUpdateOptions.type = VisualUpdateType.All;
                adapter.update(lastUpdateOptions);
            }
        }

        /**
         * Toggles auto reload
         * if value is set it sets it to true = on / false = off 
         */
        private toggleAutoReload(value?: boolean): void {
            if (this.autoReloadInterval && value !== true) {
                this.autoRefreshBtn.addClass('pbi-glyph-play');
                this.autoRefreshBtn.removeClass('pbi-glyph-stop');
                this.refreshBtn.show();
                clearInterval(this.autoReloadInterval);
                this.autoReloadInterval = undefined;
            } else if (!this.autoReloadInterval && value !== false) {
                this.autoRefreshBtn.removeClass('pbi-glyph-play');
                this.autoRefreshBtn.addClass('pbi-glyph-stop');
                this.refreshBtn.hide();
                this.autoReloadInterval = setInterval(() => this.reloadAdapter(true), DebugVisual.autoReloadPollTime);
            }
        }

        /**
         * Toggles dataViewer
         * if value is set it sets it to true = on / false = off
         */
        private toggleDataview(value?: boolean): void {
            if (this.dataViewShowing && value !== true) {
                this.dataViewShowing = false;
                this.dataBtn.toggleClass('active', false);
                this.reloadAdapter();
            } else if (!this.dataViewShowing && value !== false) {
                this.dataViewShowing = true;
                this.dataBtn.toggleClass('active', true);
                this.loadVisual('dataViewer');
            }
        }

        private createRefreshBtn(): JQuery {
            let label = this.host.getLocalizedString('DebugVisual_Reload_Visual_Button_Title');
            let refreshBtn = this.refreshBtn = $(`<i title="${label}" class="controlBtn glyphicon pbi-glyph-refresh"></i>`);
            refreshBtn.on('click', () => this.reloadAdapter());
            return refreshBtn;
        }

        private createAutoRefreshBtn(): JQuery {
            let label = this.host.getLocalizedString('DebugVisual_Toggle_Auto_Reload_Button_Title');
            let autoRefreshBtn = this.autoRefreshBtn = $(`<i title="${label}" class="controlBtn glyphicon pbi-glyph-play"></i>`);
            autoRefreshBtn.on('click', () => this.toggleAutoReload());
            return autoRefreshBtn;
        }

        private createDataBtn(): JQuery {
            let label = this.host.getLocalizedString('DebugVisual_Show_Dataview_Button_Title');
            let dataBtn = this.dataBtn = $(`<i title="${label}" class="controlBtn glyphicon pbi-glyph-seedata"></i>`);
            dataBtn.on('click', () => this.toggleDataview());
            return dataBtn;
        }

        private createHelpBtn(): JQuery {
            let label = this.host.getLocalizedString('DebugVisual_Help_Button_Title');
            let helpBtn = $(`<a href="https://aka.ms/powerbideveloperhelp" target="_blank"><i title="${label}" class="controlBtn glyphicon pbi-glyph-question"></i></a>`);
            return helpBtn;
        }

        private createSmilyBtn(): JQuery {
            let label = this.host.getLocalizedString('DebugVisual_Feedback_Button_Title');
            let smilyBtn = $(`<a href="https://aka.ms/powerbideveloperfeedback" target="_blank"><i title="${label}" class="controlBtn glyphicon pbi-glyph-smiley"></i></a>`);
            return smilyBtn;
        }

        private buildControls(): JQuery {
            let controlsContainer = $('<div class="debugVisual-controlsContainer"></div>');
            controlsContainer
                .append(
                this.createRefreshBtn(),
                this.createAutoRefreshBtn(),
                this.createDataBtn(),
                this.createHelpBtn(),
                this.createSmilyBtn());

            return controlsContainer;
        }

        private buildErrorMessage(options: VisualErrorMessageOptions): string {
            return _.template(DebugVisual.errorMessageTemplate)(options);
        }

        private setCapabilities(capabilities: VisualCapabilities = DebugVisual.defaultCapabilities): void {
            if (_.isEqual(capabilities, plugins.debugVisual.capabilities)) return;
            plugins.debugVisual.capabilities = capabilities;
            this.host.visualCapabilitiesChanged();
        }

        public init(options: VisualInitOptions): void {
            this.host = options.host;
            let container = this.container = $('<div class="debugVisualContainer"></div>');
            let visualContainer = this.visualContainer = $('<div class="visual"></div>');
            this.dataViewShowing = false;
            container.append(visualContainer);
            options.element.append(container);

            let optionsForVisual = this.optionsForVisual = Prototype.inherit(options);
            optionsForVisual.element = visualContainer;

            this.host.setToolbar(this.buildControls());
            this.reloadAdapter();
        }

        public update(options: VisualUpdateOptions): void {
            let visualOptions = this.lastUpdateOptions = Prototype.inherit(options);
            let height = options.viewport.height;
            let width = options.viewport.width;
            this.visualContainer
                .height(height)
                .width(width);
            if (this.adapter && this.adapter.update) {
                this.adapter.update(visualOptions);
            }
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
            if (this.adapter && this.adapter.enumerateObjectInstances) {
                return <VisualObjectInstance[]>this.adapter.enumerateObjectInstances(options);
            }
            return [];
        }

        public destroy(): void {
            if (this.adapter && this.adapter.destroy) {
                this.adapter.destroy();
            };
            this.toggleAutoReload(false);
            this.container = null;
            this.visualContainer = null;
            this.host.setToolbar(null);
        }
    }
}