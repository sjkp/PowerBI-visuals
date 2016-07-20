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

module powerbi.visuals {
    
    export interface MinervaVisualFeatureSwitches {
        /**
         * This feature switch enables the data-dot & column combo charts.
         */
        dataDotChartEnabled?: boolean;

        /**
         * Visual should prefer to request a higher volume of data.
         */
        preferHigherDataVolume?: boolean;

        sandboxVisualsEnabled?: boolean;

        /**
        * R visual is enabled for consumption.
        * When turned on, R script will be executed against local R (for PBID) or AML (for PBI.com).
        * When turned off, R script will not be executed and the visual is treated as a static image visual.
        */
        scriptVisualEnabled?: boolean;

        /**
        * R visual is enabled for authoring.
        * When turned on, R visual will appear in the visual gallery.
        */
        scriptVisualAuthoringEnabled?: boolean;

        isLabelInteractivityEnabled?: boolean;

        sunburstVisualEnabled?: boolean;

        filledMapDataLabelsEnabled?: boolean;

        /**
         * Enables button to center map to the current location
         */
        mapCurrentLocationEnabled?: boolean;
        
        tooltipBucketEnabled?: boolean;

        /**
         * Advanced logic for line chart labels
         */
        advancedLineLabelsEnabled?: boolean;
    }
    
    function createPlugin(
        visualPlugins: jsCommon.IStringDictionary<IVisualPlugin>,
        base: IVisualPlugin,
        create: IVisualFactoryMethod,
        modifyPluginFn?: (plugin: IVisualPlugin) => void): void {

        let visualPlugin = Prototype.inherit(base);
        visualPlugin.create = create;
        if (modifyPluginFn) {
            modifyPluginFn(visualPlugin);
        }
        visualPlugins[base.name] = visualPlugin;
    }
    
    function createMinervaPlugins(plugins: jsCommon.IStringDictionary<IVisualPlugin>, featureSwitches?: MinervaVisualFeatureSwitches) {
        let scriptVisualEnabled: boolean = featureSwitches ? featureSwitches.scriptVisualEnabled : false;
        let scriptVisualAuthoringEnabled: boolean = featureSwitches ? featureSwitches.scriptVisualAuthoringEnabled : false;
        let isLabelInteractivityEnabled: boolean = featureSwitches ? featureSwitches.isLabelInteractivityEnabled : false;
        let fillMapDataLabelsEnabled: boolean = featureSwitches ? featureSwitches.filledMapDataLabelsEnabled : false;
        let advancedLineLabelsEnabled: boolean = featureSwitches ? featureSwitches.advancedLineLabelsEnabled : false;

        // Bar Chart
        createPlugin(plugins, powerbi.visuals.plugins.barChart, () => new CartesianChart({
            chartType: CartesianChartType.StackedBar,
            isScrollable: true, animator: new WebColumnChartAnimator(),
            tooltipsEnabled: true,
            behavior: new CartesianChartBehavior([new ColumnChartWebBehavior()]),
            isLabelInteractivityEnabled: isLabelInteractivityEnabled,
        }));
        // Card
        createPlugin(plugins, powerbi.visuals.plugins.card, () => new Card({
            isScrollable: true,
            animator: new BaseAnimator(),
        }));
        // Clustered Bar Chart
        createPlugin(plugins, powerbi.visuals.plugins.clusteredBarChart, () => new CartesianChart({
            chartType: CartesianChartType.ClusteredBar,
            isScrollable: true,
            tooltipsEnabled: true,
            animator: new WebColumnChartAnimator(),
            behavior: new CartesianChartBehavior([new ColumnChartWebBehavior()]),
            isLabelInteractivityEnabled: isLabelInteractivityEnabled,
        }));
        // Clustered Column Chart
        createPlugin(plugins, powerbi.visuals.plugins.clusteredColumnChart, () => new CartesianChart({
            chartType: CartesianChartType.ClusteredColumn,
            isScrollable: true,
            tooltipsEnabled: true,
            animator: new WebColumnChartAnimator(),
            behavior: new CartesianChartBehavior([new ColumnChartWebBehavior()]),
            isLabelInteractivityEnabled: isLabelInteractivityEnabled,
        }));
        // Column Chart
        createPlugin(plugins, powerbi.visuals.plugins.columnChart, () => new CartesianChart({
            chartType: CartesianChartType.StackedColumn,
            isScrollable: true,
            tooltipsEnabled: true,
            animator: new WebColumnChartAnimator(),
            behavior: new CartesianChartBehavior([new ColumnChartWebBehavior()]),
            isLabelInteractivityEnabled: isLabelInteractivityEnabled,
        }));
        // Data Dot Clustered Combo Chart
        createPlugin(plugins, powerbi.visuals.plugins.dataDotClusteredColumnComboChart, () => new CartesianChart({
            chartType: CartesianChartType.DataDotClusteredColumnCombo,
            isScrollable: true,
            tooltipsEnabled: true,
            animator: new WebColumnChartAnimator(),
            behavior: new CartesianChartBehavior([new ColumnChartWebBehavior(), new DataDotChartWebBehavior()]),
            isLabelInteractivityEnabled: isLabelInteractivityEnabled,
        }));
        // Data Dot Stacked Combo Chart
        createPlugin(plugins, powerbi.visuals.plugins.dataDotStackedColumnComboChart, () => new CartesianChart({
            chartType: CartesianChartType.DataDotStackedColumnCombo,
            isScrollable: true,
            tooltipsEnabled: true,
            animator: new WebColumnChartAnimator(),
            behavior: new CartesianChartBehavior([new ColumnChartWebBehavior(), new DataDotChartWebBehavior()]),
            isLabelInteractivityEnabled: isLabelInteractivityEnabled,
        }));
        // Donut Chart
        createPlugin(plugins, powerbi.visuals.plugins.donutChart, () => new DonutChart({
            animator: new WebDonutChartAnimator(),
            isScrollable: true,
            tooltipsEnabled: true,
            behavior: new DonutChartWebBehavior(),
        }));
        // Funnel Chart
        createPlugin(plugins, powerbi.visuals.plugins.funnel, () => new FunnelChart({
            animator: new WebFunnelAnimator(),
            behavior: new FunnelWebBehavior(),
            tooltipsEnabled: true,
        }));
        // Gauge
        createPlugin(plugins, powerbi.visuals.plugins.gauge, () => new Gauge({
            animator: new BaseAnimator(),
            tooltipsEnabled: true,
        }));
        // Hundred Percent Stacked Bar Chart
        createPlugin(plugins, powerbi.visuals.plugins.hundredPercentStackedBarChart, () => new CartesianChart({
            chartType: CartesianChartType.HundredPercentStackedBar,
            isScrollable: true,
            tooltipsEnabled: true,
            animator: new WebColumnChartAnimator(),
            behavior: new CartesianChartBehavior([new ColumnChartWebBehavior()]),
            isLabelInteractivityEnabled: isLabelInteractivityEnabled,
        }));
        // Hundred Percent Stacked Column Chart
        createPlugin(plugins, powerbi.visuals.plugins.hundredPercentStackedColumnChart, () => new CartesianChart({
            chartType: CartesianChartType.HundredPercentStackedColumn,
            isScrollable: true,
            tooltipsEnabled: true,
            animator: new WebColumnChartAnimator(),
            behavior: new CartesianChartBehavior([new ColumnChartWebBehavior()]),
            isLabelInteractivityEnabled: isLabelInteractivityEnabled,
        }));
        // Line Chart
        createPlugin(plugins, powerbi.visuals.plugins.lineChart, () => new CartesianChart({
            chartType: CartesianChartType.Line,
            isScrollable: true,
            tooltipsEnabled: true,
            animator: new BaseAnimator(),
            behavior: new CartesianChartBehavior([new LineChartWebBehavior()]),
            isLabelInteractivityEnabled: isLabelInteractivityEnabled,
            advancedLineLabelsEnabled: advancedLineLabelsEnabled,
        }));
        // Area Chart
        createPlugin(plugins, powerbi.visuals.plugins.areaChart, () => new CartesianChart({
            chartType: CartesianChartType.Area,
            isScrollable: true,
            tooltipsEnabled: true,
            animator: new BaseAnimator(),
            behavior: new CartesianChartBehavior([new LineChartWebBehavior()]),
            isLabelInteractivityEnabled: isLabelInteractivityEnabled,
            advancedLineLabelsEnabled: advancedLineLabelsEnabled,
        }));
        // Stacked Area Chart
        createPlugin(plugins, powerbi.visuals.plugins.stackedAreaChart, () => new CartesianChart({
            chartType: CartesianChartType.StackedArea,
            isScrollable: true,
            tooltipsEnabled: true,
            animator: new BaseAnimator(),
            behavior: new CartesianChartBehavior([new LineChartWebBehavior()]),
        }));
        // Line Clustered Combo Chart
        createPlugin(plugins, powerbi.visuals.plugins.lineClusteredColumnComboChart, () => new CartesianChart({
            chartType: CartesianChartType.LineClusteredColumnCombo,
            isScrollable: true,
            tooltipsEnabled: true,
            animator: new WebColumnChartAnimator(),
            behavior: new CartesianChartBehavior([new ColumnChartWebBehavior(), new LineChartWebBehavior()]),
            isLabelInteractivityEnabled: isLabelInteractivityEnabled,
            advancedLineLabelsEnabled: advancedLineLabelsEnabled,
        }));
        // Line Stacked Combo Chart
        createPlugin(plugins, powerbi.visuals.plugins.lineStackedColumnComboChart, () => new CartesianChart({
            chartType: CartesianChartType.LineStackedColumnCombo,
            isScrollable: true,
            tooltipsEnabled: true,
            animator: new WebColumnChartAnimator(),
            behavior: new CartesianChartBehavior([new ColumnChartWebBehavior(), new LineChartWebBehavior()]),
            isLabelInteractivityEnabled: isLabelInteractivityEnabled,
            advancedLineLabelsEnabled: advancedLineLabelsEnabled,
        }));
        // Pie Chart
        createPlugin(plugins, powerbi.visuals.plugins.pieChart, () => new DonutChart({
            sliceWidthRatio: 0,
            animator: new WebDonutChartAnimator(),
            isScrollable: true,
            tooltipsEnabled: true,
            behavior: new DonutChartWebBehavior(),
        }));
        // Scatter Chart
        createPlugin(plugins, powerbi.visuals.plugins.scatterChart, () => new CartesianChart({
            chartType: CartesianChartType.Scatter,
            isScrollable: true,
            tooltipsEnabled: true,
            animator: new BaseAnimator(),
            behavior: new CartesianChartBehavior([new ScatterChartWebBehavior()]),
            isLabelInteractivityEnabled: isLabelInteractivityEnabled,
        }));
        // Treemap
        createPlugin(plugins, powerbi.visuals.plugins.treemap, () => new Treemap({
            animator: new WebTreemapAnimator,
            isScrollable: true,
            behavior: new TreemapWebBehavior(),
            tooltipsEnabled: true,
        }));
        // Waterfall Chart
        createPlugin(plugins, powerbi.visuals.plugins.waterfallChart, () => new CartesianChart({
            chartType: CartesianChartType.Waterfall,
            isScrollable: true,
            tooltipsEnabled: true,
            behavior: new CartesianChartBehavior([new WaterfallChartWebBehavior()]),
            isLabelInteractivityEnabled: isLabelInteractivityEnabled,
        }));
        // Map
        createPlugin(plugins, powerbi.visuals.plugins.map, () => new Map({
            behavior: new MapBehavior(),
            tooltipsEnabled: true,
            isLegendScrollable: true,
        }));
        // Filled Map
        createPlugin(plugins, powerbi.visuals.plugins.filledMap, () => new Map({
            filledMap: true,
            behavior: new MapBehavior,
            tooltipsEnabled: true,
            filledMapDataLabelsEnabled: fillMapDataLabelsEnabled,
            isLegendScrollable: true,
        }));
        // Slicer
        createPlugin(plugins, powerbi.visuals.plugins.slicer, () => new Slicer({
            behavior: new SlicerWebBehavior(),
        }));
        // Matrix
        createPlugin(plugins, powerbi.visuals.plugins.matrix, () => new Matrix());
        // Table
        createPlugin(plugins, powerbi.visuals.plugins.table, () => new Table());

        if (scriptVisualEnabled && scriptVisualAuthoringEnabled) {
            // R visual
            createPlugin(
                plugins,
                powerbi.visuals.plugins.scriptVisual,
                () => new ScriptVisual({ canRefresh: true }));
        }
    }

    export interface SmallViewPortProperties {
        cartesianSmallViewPortProperties: CartesianSmallViewPortProperties;
        gaugeSmallViewPortProperties: GaugeSmallViewPortProperties;
        funnelSmallViewPortProperties: FunnelSmallViewPortProperties;
        DonutSmallViewPortProperties: DonutSmallViewPortProperties;
    }

    export class MobileVisualPluginService {
        private featureSwitches: MinervaVisualFeatureSwitches;
        private visualPlugins: jsCommon.IStringDictionary<IVisualPlugin>;
        private smallViewPortProperties;
        public static MinHeightLegendVisible = 125;
        public static MinHeightAxesVisible = 125;
        public static MinHeightGaugeSideNumbersVisible = 80;
        public static GaugeMarginsOnSmallViewPort = 10;
        public static MinHeightFunnelCategoryLabelsVisible = 80;
        public static MaxHeightToScaleDonutLegend = 300;

        public constructor(smallViewPortProperties?: SmallViewPortProperties, featureSwitches?: MinervaVisualFeatureSwitches) {
            this.featureSwitches = featureSwitches;
            this.smallViewPortProperties = smallViewPortProperties || {
                CartesianSmallViewPortProperties: {
                    hideAxesOnSmallViewPort: true,
                    hideLegendOnSmallViewPort: true,
                    MinHeightLegendVisible: MobileVisualPluginService.MinHeightLegendVisible,
                    MinHeightAxesVisible: MobileVisualPluginService.MinHeightAxesVisible,
                },
                GaugeSmallViewPortProperties: {
                    hideGaugeSideNumbersOnSmallViewPort: true,
                    smallGaugeMarginsOnSmallViewPort: true,
                    MinHeightGaugeSideNumbersVisible: MobileVisualPluginService.MinHeightGaugeSideNumbersVisible,
                    GaugeMarginsOnSmallViewPort: MobileVisualPluginService.GaugeMarginsOnSmallViewPort,
                },
                FunnelSmallViewPortProperties: {
                    hideFunnelCategoryLabelsOnSmallViewPort: true,
                    minHeightFunnelCategoryLabelsVisible: MobileVisualPluginService.MinHeightFunnelCategoryLabelsVisible,
                },
                DonutSmallViewPortProperties: {
                    maxHeightToScaleDonutLegend: MobileVisualPluginService.MaxHeightToScaleDonutLegend,
                },
            };

            // Disable tooltips for mobile
            TooltipManager.ShowTooltips = false;

            // Don't trim overflow data on mobile
            let trimOrdinalDataOnOverflow = false;

            let mapThrottleInterval: number = this.getMapThrottleInterval();

            this.visualPlugins = {};
            createPlugin(this.visualPlugins, powerbi.visuals.plugins.areaChart,
                () => new CartesianChart({
                    chartType: CartesianChartType.Area,
                    trimOrdinalDataOnOverflow: trimOrdinalDataOnOverflow
                }));
            createPlugin(this.visualPlugins, powerbi.visuals.plugins.barChart,
                () => new CartesianChart({
                    chartType: CartesianChartType.StackedBar,
                    trimOrdinalDataOnOverflow: trimOrdinalDataOnOverflow
                }));
            createPlugin(this.visualPlugins, powerbi.visuals.plugins.clusteredBarChart,
                () => new CartesianChart({
                    chartType: CartesianChartType.ClusteredBar,
                    trimOrdinalDataOnOverflow: trimOrdinalDataOnOverflow
                }));
            createPlugin(this.visualPlugins, powerbi.visuals.plugins.clusteredColumnChart,
                () => new CartesianChart({
                    chartType: CartesianChartType.ClusteredColumn,
                    trimOrdinalDataOnOverflow: trimOrdinalDataOnOverflow
                }));
            createPlugin(this.visualPlugins, powerbi.visuals.plugins.columnChart,
                () => new CartesianChart({
                    chartType: CartesianChartType.StackedColumn,
                    trimOrdinalDataOnOverflow: trimOrdinalDataOnOverflow
                }));
            createPlugin(this.visualPlugins, powerbi.visuals.plugins.comboChart,
                () => new CartesianChart({
                    chartType: CartesianChartType.ComboChart,
                    trimOrdinalDataOnOverflow: trimOrdinalDataOnOverflow
                }));
            createPlugin(this.visualPlugins, powerbi.visuals.plugins.dataDotChart,
                () => new CartesianChart({
                    chartType: CartesianChartType.DataDot,
                    trimOrdinalDataOnOverflow: trimOrdinalDataOnOverflow
                }));
            createPlugin(this.visualPlugins, powerbi.visuals.plugins.dataDotClusteredColumnComboChart,
                () => new CartesianChart({
                    chartType: CartesianChartType.DataDotClusteredColumnCombo,
                    trimOrdinalDataOnOverflow: trimOrdinalDataOnOverflow
                }));
            createPlugin(this.visualPlugins, powerbi.visuals.plugins.dataDotStackedColumnComboChart,
                () => new CartesianChart({
                    chartType: CartesianChartType.DataDotStackedColumnCombo,
                    trimOrdinalDataOnOverflow: trimOrdinalDataOnOverflow
                }));
            createPlugin(this.visualPlugins, powerbi.visuals.plugins.hundredPercentStackedBarChart,
                () => new CartesianChart({
                    chartType: CartesianChartType.HundredPercentStackedBar,
                    trimOrdinalDataOnOverflow: trimOrdinalDataOnOverflow
                }));
            createPlugin(this.visualPlugins, powerbi.visuals.plugins.hundredPercentStackedColumnChart,
                () => new CartesianChart({
                    chartType: CartesianChartType.HundredPercentStackedColumn,
                    trimOrdinalDataOnOverflow: trimOrdinalDataOnOverflow
                }));
            createPlugin(this.visualPlugins, powerbi.visuals.plugins.stackedAreaChart,
                () => new CartesianChart({
                    chartType: CartesianChartType.StackedArea,
                    trimOrdinalDataOnOverflow: trimOrdinalDataOnOverflow
                }));
            createPlugin(this.visualPlugins, powerbi.visuals.plugins.waterfallChart,
                () => new CartesianChart({
                    chartType: CartesianChartType.Waterfall,
                    trimOrdinalDataOnOverflow: trimOrdinalDataOnOverflow
                }));
            createPlugin(this.visualPlugins, powerbi.visuals.plugins.lineChart,
                () => new CartesianChart({
                    chartType: CartesianChartType.Line,
                    cartesianSmallViewPortProperties: this.smallViewPortProperties.CartesianSmallViewPortProperties,
                    trimOrdinalDataOnOverflow: trimOrdinalDataOnOverflow
                }));
            createPlugin(this.visualPlugins, powerbi.visuals.plugins.lineClusteredColumnComboChart,
                () => new CartesianChart({
                    chartType: CartesianChartType.LineClusteredColumnCombo,
                    cartesianSmallViewPortProperties: this.smallViewPortProperties.CartesianSmallViewPortProperties,
                    trimOrdinalDataOnOverflow: trimOrdinalDataOnOverflow
                }));
            createPlugin(this.visualPlugins, powerbi.visuals.plugins.lineStackedColumnComboChart,
                () => new CartesianChart({
                    chartType: CartesianChartType.LineStackedColumnCombo,
                    cartesianSmallViewPortProperties: this.smallViewPortProperties.CartesianSmallViewPortProperties,
                    trimOrdinalDataOnOverflow: trimOrdinalDataOnOverflow
                }));
            createPlugin(this.visualPlugins, powerbi.visuals.plugins.scatterChart,
                () => new CartesianChart({
                    chartType: CartesianChartType.Scatter,
                    cartesianSmallViewPortProperties: this.smallViewPortProperties.CartesianSmallViewPortProperties,
                    behavior: new CartesianChartBehavior([new ScatterChartMobileBehavior()])
                }));
            createPlugin(this.visualPlugins, powerbi.visuals.plugins.gauge,
                () => new Gauge({
                    gaugeSmallViewPortProperties: this.smallViewPortProperties.GaugeSmallViewPortProperties
                }));
            createPlugin(this.visualPlugins, powerbi.visuals.plugins.funnel,
                () => new FunnelChart({
                    animator: null,
                    funnelSmallViewPortProperties: this.smallViewPortProperties.FunnelSmallViewPortProperties
                }));
            createPlugin(this.visualPlugins, powerbi.visuals.plugins.donutChart,
                () => new DonutChart({
                    disableGeometricCulling: true,
                    smallViewPortProperties: this.smallViewPortProperties.DonutSmallViewPortProperties
                }));
            createPlugin(this.visualPlugins, powerbi.visuals.plugins.pieChart,
                () => new DonutChart({
                    sliceWidthRatio: 0,
                    disableGeometricCulling: true,
                    smallViewPortProperties: this.smallViewPortProperties.DonutSmallViewPortProperties
                }));
            createPlugin(this.visualPlugins, powerbi.visuals.plugins.matrix,
                () => new Matrix({
                    isTouchEnabled: true
                }));
            createPlugin(this.visualPlugins, powerbi.visuals.plugins.table,
                () => new Table({
                    isTouchEnabled: true
                }));
            createPlugin(this.visualPlugins, powerbi.visuals.plugins.map,
                () => new Map({
                    viewChangeThrottleInterval: mapThrottleInterval,
                    enableCurrentLocation: featureSwitches ? featureSwitches.mapCurrentLocationEnabled : false
                }));
            createPlugin(this.visualPlugins, powerbi.visuals.plugins.filledMap,
                () => new Map({
                    filledMap: true,
                    viewChangeThrottleInterval: mapThrottleInterval
                }));
        }

        public getPlugin(type: string): IVisualPlugin {
            if (this.visualPlugins[type])
                return this.visualPlugins[type];

            return powerbi.visuals.plugins[type];
        }

        // Windows phone webView chokes when zooming on heavy maps,
        // this is a workaround to allow a relatively smooth pinch to zoom experience.
        private getMapThrottleInterval(): number {
            const windowsPhoneThrottleInterval = 100;
            let userAgentLowerCase = navigator.userAgent.toLowerCase();
            if (userAgentLowerCase.indexOf('windows phone') !== -1) {
                return windowsPhoneThrottleInterval;
            }

            return undefined;
        }

        public getInteractivityOptions(visualType: string): InteractivityOptions {
            let mobileOptions: InteractivityOptions = {
                overflow: this.getMobileOverflowString(visualType),
                isInteractiveLegend: this.isChartSupportInteractivity(visualType),
                selection: true,
            };

            return mobileOptions;
        }

        private getMobileOverflowString(visualType: string): string {
            switch (visualType) {
                case 'multiRowCard':
                    return 'visible';

                default:
                    return 'hidden';
            }
        }

        private isChartSupportInteractivity(visualType: string): boolean {
            switch (visualType) {
                case 'areaChart':
                case 'barChart':
                case 'clusteredBarChart':
                case 'clusteredColumnChart':
                case 'columnChart':
                case 'donutChart':
                case 'hundredPercentStackedBarChart':
                case 'hundredPercentStackedColumnChart':
                case 'lineChart':
                case 'pieChart':
                case 'scatterChart':
                case 'table':
                case 'matrix':
                case 'multiRowCard':
                    return true;

                default:
                    return false;
            }
        }
    }

    export class PlaygroundVisualPluginService {
        private visualPlugins: jsCommon.IStringDictionary<IVisualPlugin>;

        public constructor() {
            this.visualPlugins = <any>powerbi.visuals.plugins;

            createMinervaPlugins(this.visualPlugins, null);
        }

        public getVisuals(): IVisualPlugin[] {
            let registry = this.visualPlugins,
                names: string[] = Object.keys(registry);

            return names.map(name => registry[name]);
        }

        public getPlugin(type: string): IVisualPlugin {
            if (!type) {
                return;
            }

            let plugin: IVisualPlugin = this.visualPlugins[type];
            if (!plugin) {
                return;
            }

            return plugin;
        }

        public capabilities(type: string): VisualCapabilities {
            let plugin = this.getPlugin(type);
            if (plugin) {
                return plugin.capabilities;
            }
        }
    }
}
