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
    /** Demonstrates how Power BI visual creation could be implemented as jQuery plugin */
    visual(plugin: Object, dataView?: Object): JQuery;
}

enum PlaygroundViewType {
    WebView,
    MobilePortraitView,
    MobileLandscapeView
}

module powerbi.visuals {
  
    import defaultVisualHostServices = powerbi.visuals.defaultVisualHostServices;
    import HostControls = powerbi.visuals.HostControls;
    import IHost = powerbi.visuals.IHost;

    /**
     * Demonstrates Power BI visualization elements and the way to embed them in standalone web page.
     */
    export class Playground {
        private static disabledVisuals: string[] = [
            "basicShape",
            "matrix",
            "playChart",
            "kpi",
            "scriptVisual",
            "slicer",
            "forceGraph",
            "mekkoChart",
            "gantt",
            "sunburstCustom",
            "timeline",
            "owlGauge",
            "debugVisual",
            "lineDotChart",
            "chordChart",
            "pulseChart"
        ];

        private static mobileInteractiveVisuals: string[] = [
            "areaChart",
            "barChart",
            "clusteredBarChart",
            "clusteredColumnChart",
            "columnChart",
            "donutChart",
            "hundredPercentStackedBarChart",
            "hundredPercentStackedColumnChart",
            "lineChart",
            "pieChart",
            "scatterChart",
            "table",
            "matrix",
            "multiRowCard"
        ];

        private static webTileRenderScale: number = 1;
        private static mobileDashboardTileRenderScale: number = 3;
        private static mobileInFocusTileRenderScale: number = 1;

        /** Represents sample data view used by visualization elements. */
        private static webPluginService: PlaygroundVisualPluginService = new PlaygroundVisualPluginService();
        private static mobilePluginService: MobileVisualPluginService = new MobileVisualPluginService();
        private static currentVisualPlugin: IVisualPlugin;
        private static viewType: PlaygroundViewType;

        private static hostControls: HostControls;
        private static hosts: IHost[];

        // The playground tabs/views
        private static webViewTab: JQuery;
        private static mobileViewTab: JQuery;

        // The visual containers which will hold the visual divs
        private static webContainer: JQuery;
        private static mobilePortraitDashboardContainer: JQuery;
        private static mobilePortraitInFocusContainer: JQuery;
        private static mobileLandscapeDashboardContainer: JQuery;
        private static mobileLandscapeInFocusContainer: JQuery;

        // Containers of the visuals containers - used to hide or show containers when switching between web and mobile tabs
        private static webContainers: JQuery;
        private static mobilePortraitContainers: JQuery;
        private static mobileLandscapeContainers: JQuery;

        // Controls
        private static visualsSelectElement: JQuery;
        private static mobileOrientationOptionsElement: JQuery;
        private static mobileOrientationPortraitRadioButton: JQuery;
        private static mobileOrientationLandscapeRadioButton: JQuery;
        private static optionsCapabilitiesElement: JQuery;
        private static interactionsEnabledCheckbox: JQuery;

        private static visualStyle: IVisualStyle = {
            titleText: {
                color: { value: 'rgba(51,51,51,1)' }
            },
            subTitleText: {
                color: { value: 'rgba(145,145,145,1)' }
            },
            colorPalette: {
                dataColors: new powerbi.visuals.DataColorPalette(),
            },
            labelText: {
                color: {
                    value: 'rgba(51,51,51,1)',
                },
                fontSize: '11px'
            },
            isHighContrast: false,
        };

        /** Performs sample app initialization.*/
        public static initialize(): void {
            this.webViewTab = $('#webViewTab');
            this.mobileViewTab = $('#mobileViewTab');
            this.visualsSelectElement = $('#visualTypes');
            this.mobileOrientationOptionsElement = $('#orientation');
            this.mobileOrientationPortraitRadioButton = this.mobileOrientationOptionsElement.find("input[value='portrait']");
            this.mobileOrientationLandscapeRadioButton = this.mobileOrientationOptionsElement.find("input[value='landscape']");
            this.optionsCapabilitiesElement = $('#capabilities');
            this.interactionsEnabledCheckbox = $("input[name='is_interactions']");

            this.webContainer = $('#webContainer');
            this.mobilePortraitDashboardContainer = $('#mobilePortraitDashboardContainer');
            this.mobilePortraitInFocusContainer = $('#mobilePortraitInFocusContainer');
            this.mobileLandscapeDashboardContainer = $('#mobileLandscapeDashboardContainer');
            this.mobileLandscapeInFocusContainer = $('#mobileLandscapeInFocusContainer');

            this.webContainers = this.webContainer.parent();
            this.mobilePortraitContainers = $('.mobile-portrait-image-container');
            this.mobileLandscapeContainers = $('.mobile-landscape-image-container');

            this.initializeView(PlaygroundViewType.WebView);

            this.populateVisualTypeSelect();
            powerbi.visuals.DefaultVisualHostServices.initialize();

            // Wrapper function to simplify visualization element creation when using jQuery
            $.fn.visual = function (host: IHost, plugin: IVisualPlugin, dataView?: DataView[]) {
                // Step 1: Create new DOM element to represent Power BI visual
                let element = $('<div/>');
                element.addClass('visual');
                element['visible'] = () => { return true; };
                this.append(element);

                // Step 2: Instantiate Power BI visual
                host.visual = powerbi.extensibility.createVisualAdapter(plugin);
                return this;
            };

            this.webViewTab.click(() => { this.updateView(PlaygroundViewType.WebView); });
            this.mobileViewTab.click(() => { this.updateView(PlaygroundViewType.MobilePortraitView); });
            this.mobileOrientationPortraitRadioButton.click(() => { this.updateView(PlaygroundViewType.MobilePortraitView); });
            this.mobileOrientationLandscapeRadioButton.click(() => { this.updateView(PlaygroundViewType.MobileLandscapeView); });

            this.interactionsEnabledCheckbox.on('change', () => this.updateVisuals);

            this.hostControls = new HostControls($('#controls'), Playground.updateVisual);
            this.hostControls.setHosts(this.hosts);

            let visualByDefault = jsCommon.Utility.getURLParamValue('visual');
            if (visualByDefault) {
                this.onVisualTypeSelection(visualByDefault.toString());
            } else {
                this.onVisualTypeSelection(this.visualsSelectElement.val());
            }
        }

        private static initVisual(host: IHost) {
            host.visual.init({
                element: this.getVisualElementInContainer(host.container),
                host: defaultVisualHostServices,
                style: this.visualStyle,
                viewport: host.renderingViewport,
                interactivity: {
                    isInteractiveLegend: this.shouldCreateInteractiveVisual(host),
                    selection: this.isInteractiveMode()
                }
            });
        }

        private static shouldCreateInteractiveVisual(host: IHost): boolean {
            return host.interactive &&
                this.isMobileView(this.viewType) &&
                this.mobileInteractiveVisuals.some((visualName: string) => visualName === this.currentVisualPlugin.name);
        }

        private static populateVisualTypeSelect(): void {
            this.visualsSelectElement.empty();

            let visuals = this.getPluginService().getVisuals();
            visuals.sort(function (a, b) {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });

            visuals.forEach((visual: IVisualPlugin) => {
                if (!Playground.disabledVisuals.some((visualName: string) => visualName === visual.name)) {
                    this.visualsSelectElement.append('<option value="' + visual.name + '">' + visual.name + '</option>');
                }
            });

            this.visualsSelectElement.change(() => this.onVisualTypeSelection(this.visualsSelectElement.val()));
        }

        private static onVisualTypeSelection(pluginName: string): void {
            if (pluginName.length === 0) {
                return;
            }

            this.hostControls.onPluginChange(pluginName);
            this.createVisualPlugin(pluginName);
            // this.hostControls.update();
        }

        private static createVisualPlugin(pluginName: string): void {
            this.currentVisualPlugin = this.getPluginService().getPlugin(pluginName);

            for (let host of this.hosts) {
                host.container.children().not(".ui-resizable-handle").remove();
                if (!this.currentVisualPlugin) {
                    host.container.append('<div class="wrongVisualWarning">Wrong visual name <span>\'' + pluginName + '\'</span> in parameters</div>');
                    return;
                }
                host.container.visual(host, this.currentVisualPlugin);
            }

            this.updateVisuals();
        }

        private static getPluginService(): any {
            return this.isMobileView(this.viewType) ? this.mobilePluginService : this.webPluginService;
        }

        private static updateVisuals(): void {
            for (let host of this.hosts) {
                this.updateVisual(host);
            }
        }

        private static updateVisual(host: IHost): void {
            // Reset the scaled container to its original size from the previous rendering and then multiply it by the scale
            let containerOriginalSize = Playground.hostControls.getContainerSize(host);
            host.container.removeAttr('style');
            host.container.attr('style', 'width: ' + containerOriginalSize.width * host.renderingScale + 'px; height: ' + containerOriginalSize.height * host.renderingScale + 'px;');

            let visualElement = Playground.getVisualElementInContainer(host.container);
            visualElement.empty();

            Playground.initVisual(host);
            Playground.hostControls.updateHost(host);

            // Scale the visual back down to fit its container
            let scale = 1 / host.renderingScale;
            visualElement.attr('style', 'transform: scale(' + scale + '); transform-origin: top left;');
        }

        private static isMobileView(viewType: PlaygroundViewType): boolean {
            return viewType === PlaygroundViewType.MobilePortraitView || viewType === PlaygroundViewType.MobileLandscapeView;
        }

        private static initializeView(viewType: PlaygroundViewType): void {
            if (this.viewType !== viewType) {
                
                // Add or remove all mobile specific options
                if (this.isMobileView(viewType)) {
                    this.mobileOrientationOptionsElement.show();
                    this.optionsCapabilitiesElement.hide();
                }
                else {
                    this.mobileOrientationOptionsElement.hide();
                    this.optionsCapabilitiesElement.show();
                }

                this.clearAllVisuals();
                this.hideAllContainers();
                this.unhighlightTabs();
                
                // Update the visual's containers
                switch (viewType) {
                    case PlaygroundViewType.WebView:
                        this.highlightTab(this.webViewTab);
                        this.webContainers.show();
                        this.hosts = [
                            {
                                name: this.webContainer[0].id,
                                container: this.webContainer,
                                resizable: true,
                                interactive: false,
                                renderingScale: this.webTileRenderScale
                            }
                        ];
                        break;
                    case PlaygroundViewType.MobilePortraitView:
                        this.highlightTab(this.mobileViewTab);
                        this.mobilePortraitContainers.show();
                        this.hosts = [
                            {
                                name: this.mobilePortraitDashboardContainer[0].id,
                                container: this.mobilePortraitDashboardContainer,
                                resizable: false,
                                interactive: false,
                                renderingScale: this.mobileDashboardTileRenderScale
                            },
                            {
                                name: this.mobilePortraitInFocusContainer[0].id,
                                container: this.mobilePortraitInFocusContainer,
                                resizable: false,
                                interactive: true,
                                renderingScale: this.mobileInFocusTileRenderScale
                            }
                        ];
                        break;
                    case PlaygroundViewType.MobileLandscapeView:
                        this.highlightTab(this.mobileViewTab);
                        this.mobileLandscapeContainers.show();
                        this.hosts = [
                            {
                                name: this.mobileLandscapeDashboardContainer[0].id,
                                container: this.mobileLandscapeDashboardContainer,
                                resizable: false,
                                interactive: false,
                                renderingScale: this.mobileDashboardTileRenderScale
                            },
                            {
                                name: this.mobileLandscapeInFocusContainer[0].id,
                                container: this.mobileLandscapeInFocusContainer,
                                resizable: false,
                                interactive: true,
                                renderingScale: this.mobileInFocusTileRenderScale
                            }
                        ];
                        break;
                    default:
                        break;
                }

                if (this.isMobileView(viewType) && !this.isMobileView(this.viewType)) {
                    // Moved to mobile view from web
                    this.resetOrientationRadioButtons();
                }

                this.viewType = viewType;
            }
        }

        private static updateView(viewType: PlaygroundViewType): void {
            if (this.viewType !== viewType) {
                this.initializeView(viewType);

                this.hostControls.setHosts(this.hosts);

                // The plugin name did not change but since we might have changed between web and mobile views we need the updated plugin itself,
                // based on the matching plugin service.
                this.createVisualPlugin(this.currentVisualPlugin.name);
            }
        }

        private static getVisualElementInContainer(container: JQuery): JQuery {
            return container.children('.visual').first();
        }

        private static unhighlightTabs(): void {
            this.webViewTab.find('div').first().removeClass('selected-nav-tab');
            this.mobileViewTab.find('div').first().removeClass('selected-nav-tab');
        }

        private static highlightTab(tabElement: JQuery): void {
            tabElement.find('div').first().addClass('selected-nav-tab');
        }

        private static resetOrientationRadioButtons(): void {
            $('input[name=orientation][value=portrait]').prop('checked', true);
            $('input[name=orientation][value=landscape]').prop('checked', false);
        }

        private static hideAllContainers(): void {
            this.webContainers.hide();
            this.mobilePortraitContainers.hide();
            this.mobileLandscapeContainers.hide();
        }

        private static clearAllVisuals(): void {
            if (this.hosts) {
                for (let host of this.hosts) {
                    this.getVisualElementInContainer(host.container).empty();
                }
            }
        }

        private static isInteractiveMode(): boolean {
            return this.interactionsEnabledCheckbox.is(':checked');
        }
    }
}