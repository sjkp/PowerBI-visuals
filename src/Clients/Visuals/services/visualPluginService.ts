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
    export interface IVisualPluginService {
        getPlugin(type: string): IVisualPlugin;
        getVisuals(): IVisualPlugin[];
        capabilities(type: string): VisualCapabilities;
        removeAnyCustomVisuals(): void;
        requireSandbox(plugin: IVisualPlugin): boolean;
        isCustomVisual(visual: string): boolean;
        shouldDisableVisual(type: string, mapDisabled: boolean): boolean;
    }

    export interface MinervaVisualFeatureSwitches {
        heatMap?: boolean;
        
        /**
         * This feature switch enables the data-dot & column combo charts.
         */
        dataDotChartEnabled?: boolean;

        /**
         * Visual should prefer to request a higher volume of data.
         */
        preferHigherDataVolume?: boolean;

        /**
        * Is data label per series enabled for the visual
        */
        seriesLabelFormattingEnabled?: boolean;

        sandboxVisualsEnabled?: boolean;

        /** Pivot operator when categorical mapping wants data reduction across both hierarchies */
        categoricalPivotEnabled?: boolean;

        /**
        * An R visual is available
        */
        scriptVisualEnabled?: boolean;

        isLabelInteractivityEnabled?: boolean;

        stackedAreaEnabled?: boolean;
    }

    export interface SmallViewPortProperties {
        cartesianSmallViewPortProperties: CartesianSmallViewPortProperties;
        gaugeSmallViewPortProperties: GaugeSmallViewPortProperties;
        funnelSmallViewPortProperties: FunnelSmallViewPortProperties;
    }

    export module visualPluginFactory {
        export class VisualPluginService implements IVisualPluginService {
            private _plugins: jsCommon.IStringDictionary<IVisualPlugin>;

            public constructor() {
                this._plugins = <any>powerbi.visuals.plugins;
            }

            /**
             * Gets metadata for all registered.
             */
            public getVisuals(): IVisualPlugin[] {
                let registry = this._plugins,
                    names: string[] = Object.keys(registry);

                return names.map(name => registry[name]);
            }

            public getPlugin(type: string): IVisualPlugin {
                if (!type) {
                    return;
                }

                let plugin: IVisualPlugin = this._plugins[type];
                if (!plugin) {
                    return;
                }

                return plugin;
            }

            public capabilities(type: string): VisualCapabilities {
                let plugin = this.getPlugin(type);
                if (plugin)
                    return plugin.capabilities;
            }

            public requireSandbox(plugin: IVisualPlugin): boolean {
                return plugin && plugin.custom;
            }

            public removeAnyCustomVisuals() {
                let plugins = powerbi.visuals.plugins;
                for (let key in plugins) {
                    let p: IVisualPlugin = plugins[key];
                    if (p.custom) {
                        delete plugins[key];
                    }
                }
            }

            public isCustomVisual(visual: string): boolean {
                if (visual && this._plugins[visual]) {
                    return this._plugins[visual].custom === true;
                }

                return false;
            }

            public shouldDisableVisual(type: string, mapDisabled: boolean): boolean {
                return (type === plugins.map.name || type === plugins.filledMap.name) && mapDisabled;
            }
        }

        export function createPlugin(
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
            let categoricalPivotEnabled: boolean = featureSwitches ? featureSwitches.categoricalPivotEnabled : false;
            let seriesLabelFormattingEnabled: boolean = featureSwitches ? featureSwitches.seriesLabelFormattingEnabled : false;
            let scriptVisualEnabled: boolean = featureSwitches ? featureSwitches.scriptVisualEnabled : false;
            let isLabelInteractivityEnabled: boolean = featureSwitches ? featureSwitches.isLabelInteractivityEnabled : false;

            // Bar Chart
            createPlugin(plugins, powerbi.visuals.plugins.barChart, () => new CartesianChart({
                chartType: CartesianChartType.StackedBar,
                isScrollable: true, animator: new WebColumnChartAnimator(),
                behavior: new CartesianChartBehavior([new ColumnChartWebBehavior()]),
                seriesLabelFormattingEnabled: seriesLabelFormattingEnabled,
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
                animator: new WebColumnChartAnimator(),
                behavior: new CartesianChartBehavior([new ColumnChartWebBehavior()]),
                seriesLabelFormattingEnabled: seriesLabelFormattingEnabled,
                isLabelInteractivityEnabled: isLabelInteractivityEnabled,
            }));
            // Clustered Column Chart
            createPlugin(plugins, powerbi.visuals.plugins.clusteredColumnChart, () => new CartesianChart({
                chartType: CartesianChartType.ClusteredColumn,
                isScrollable: true,
                animator: new WebColumnChartAnimator(),
                behavior: new CartesianChartBehavior([new ColumnChartWebBehavior()]),
                seriesLabelFormattingEnabled: seriesLabelFormattingEnabled,
                isLabelInteractivityEnabled: isLabelInteractivityEnabled,
            }));
            // Column Chart
            createPlugin(plugins, powerbi.visuals.plugins.columnChart, () => new CartesianChart({
                chartType: CartesianChartType.StackedColumn,
                isScrollable: true,
                animator: new WebColumnChartAnimator(),
                behavior: new CartesianChartBehavior([new ColumnChartWebBehavior()]),
                seriesLabelFormattingEnabled: seriesLabelFormattingEnabled,
                isLabelInteractivityEnabled: isLabelInteractivityEnabled,
            }));
            // Data Dot Clustered Combo Chart
            createPlugin(plugins, powerbi.visuals.plugins.dataDotClusteredColumnComboChart, () => new CartesianChart({
                chartType: CartesianChartType.DataDotClusteredColumnCombo,
                isScrollable: true,
                animator: new WebColumnChartAnimator(),
                behavior: new CartesianChartBehavior([new ColumnChartWebBehavior(), new DataDotChartWebBehavior()]),
                isLabelInteractivityEnabled: isLabelInteractivityEnabled,
            }));
            // Data Dot Stacked Combo Chart
            createPlugin(plugins, powerbi.visuals.plugins.dataDotStackedColumnComboChart, () => new CartesianChart({
                chartType: CartesianChartType.DataDotStackedColumnCombo,
                isScrollable: true,
                animator: new WebColumnChartAnimator(),
                behavior: new CartesianChartBehavior([new ColumnChartWebBehavior(), new DataDotChartWebBehavior()]),
                isLabelInteractivityEnabled: isLabelInteractivityEnabled,
            }));
            // Donut Chart
            createPlugin(plugins, powerbi.visuals.plugins.donutChart, () => new DonutChart({
                animator: new WebDonutChartAnimator(),
                isScrollable: true,
                behavior: new DonutChartWebBehavior(),
            }));
            // Funnel Chart
            createPlugin(plugins, powerbi.visuals.plugins.funnel, () => new FunnelChart({
                animator: new WebFunnelAnimator(),
                behavior: new FunnelWebBehavior(),
            }));
            // Gauge
            createPlugin(plugins, powerbi.visuals.plugins.gauge, () => new Gauge({
                animator: new BaseAnimator(),
            }));
            // Hundred Percent Stacked Bar Chart
            createPlugin(plugins, powerbi.visuals.plugins.hundredPercentStackedBarChart, () => new CartesianChart({
                chartType: CartesianChartType.HundredPercentStackedBar,
                isScrollable: true,
                animator: new WebColumnChartAnimator(),
                behavior: new CartesianChartBehavior([new ColumnChartWebBehavior()]),
                seriesLabelFormattingEnabled: seriesLabelFormattingEnabled,
                isLabelInteractivityEnabled: isLabelInteractivityEnabled,
            }));
            // Hundred Percent Stacked Column Chart
            createPlugin(plugins, powerbi.visuals.plugins.hundredPercentStackedColumnChart, () => new CartesianChart({
                chartType: CartesianChartType.HundredPercentStackedColumn,
                isScrollable: true,
                animator: new WebColumnChartAnimator(),
                behavior: new CartesianChartBehavior([new ColumnChartWebBehavior()]),
                seriesLabelFormattingEnabled: seriesLabelFormattingEnabled,
                isLabelInteractivityEnabled: isLabelInteractivityEnabled,
            }));
            // Line Chart
            createPlugin(plugins, powerbi.visuals.plugins.lineChart, () => new CartesianChart({
                chartType: CartesianChartType.Line,
                isScrollable: true,
                animator: new BaseAnimator(),
                behavior: new CartesianChartBehavior([new LineChartWebBehavior()]),
                seriesLabelFormattingEnabled: seriesLabelFormattingEnabled,
                isLabelInteractivityEnabled: isLabelInteractivityEnabled,
            }));
            // Area Chart
            createPlugin(plugins, powerbi.visuals.plugins.areaChart, () => new CartesianChart({
                chartType: CartesianChartType.Area,
                isScrollable: true,
                animator: new BaseAnimator(),
                behavior: new CartesianChartBehavior([new LineChartWebBehavior()]),
                seriesLabelFormattingEnabled: seriesLabelFormattingEnabled,
                isLabelInteractivityEnabled: isLabelInteractivityEnabled,
            }));
            // Stacked Area Chart
            createPlugin(plugins, powerbi.visuals.plugins.stackedAreaChart, () => new CartesianChart({
                chartType: CartesianChartType.StackedArea,
                isScrollable: true,
                animator: new BaseAnimator(),
                behavior: new CartesianChartBehavior([new LineChartWebBehavior()]),
                seriesLabelFormattingEnabled: seriesLabelFormattingEnabled,
            }));
            // Line Clustered Combo Chart
            createPlugin(plugins, powerbi.visuals.plugins.lineClusteredColumnComboChart, () => new CartesianChart({
                chartType: CartesianChartType.LineClusteredColumnCombo,
                isScrollable: true,
                animator: new WebColumnChartAnimator(),
                behavior: new CartesianChartBehavior([new ColumnChartWebBehavior(), new LineChartWebBehavior()]),
                isLabelInteractivityEnabled: isLabelInteractivityEnabled,
            }));
            // Line Stacked Combo Chart
            createPlugin(plugins, powerbi.visuals.plugins.lineStackedColumnComboChart, () => new CartesianChart({
                chartType: CartesianChartType.LineStackedColumnCombo,
                isScrollable: true,
                animator: new WebColumnChartAnimator(),
                behavior: new CartesianChartBehavior([new ColumnChartWebBehavior(), new LineChartWebBehavior()]),
                isLabelInteractivityEnabled: isLabelInteractivityEnabled,
            }));
            // Pie Chart
            createPlugin(plugins, powerbi.visuals.plugins.pieChart, () => new DonutChart({
                sliceWidthRatio: 0,
                animator: new WebDonutChartAnimator(),
                isScrollable: true,
                behavior: new DonutChartWebBehavior(),
            }));
            // Scatter Chart
            createPlugin(plugins, enablePivot(powerbi.visuals.plugins.scatterChart, categoricalPivotEnabled), () => new CartesianChart({
                chartType: CartesianChartType.Scatter,
                isScrollable: true,
                animator: new BaseAnimator(),
                behavior: new CartesianChartBehavior([new ScatterChartWebBehavior()]),
                isLabelInteractivityEnabled: isLabelInteractivityEnabled,
            }));
            // Treemap
            createPlugin(plugins, powerbi.visuals.plugins.treemap, () => new Treemap({
                animator: new WebTreemapAnimator,
                isScrollable: true,
                behavior: new TreemapWebBehavior(),
            }));
            // Waterfall Chart
            createPlugin(plugins, powerbi.visuals.plugins.waterfallChart, () => new CartesianChart({
                chartType: CartesianChartType.Waterfall,
                isScrollable: true,
                behavior: new CartesianChartBehavior([new WaterfallChartWebBehavior()]),
                isLabelInteractivityEnabled: isLabelInteractivityEnabled,
            }));
            // Map
            createPlugin(plugins, powerbi.visuals.plugins.map, () => new Map({
                behavior: new MapBehavior(),
            }));
            // Filled Map
            createPlugin(plugins, powerbi.visuals.plugins.filledMap, () => new Map({
                filledMap: true,
                behavior: new MapBehavior,
            }));
            // Slicer
            createPlugin(plugins, powerbi.visuals.plugins.slicer, () => new Slicer({
                behavior: new SlicerWebBehavior(),
            }));
            // Radar Chart
            createPlugin(plugins, powerbi.visuals.plugins.radarChart, () => new samples.RadarChart({
                animator: new BaseAnimator()
            }));
            // DotPlot
            createPlugin(plugins, powerbi.visuals.plugins.dotPlot, () => new samples.DotPlot({
                animator: new BaseAnimator()
            }));
            // Histogram
            createPlugin(plugins, powerbi.visuals.plugins.histogram, () => new samples.Histogram({
                animator: new BaseAnimator()
            }));
            // Area Range Chart
            createPlugin(plugins, powerbi.visuals.plugins.areaRangeChart, () => new samples.AreaRangeChart({
                animator: new BaseAnimator()
            }));

            if (scriptVisualEnabled) {
            // Radar Chart
                createPlugin(
                    plugins,
                    powerbi.visuals.plugins.scriptVisual,
                    () => new ScriptVisual());
            }
        }

        /** enable cross axis data reduction pivot in categorical mappings */
        function enablePivot(pluginOld: IVisualPlugin, categoricalPivotEnabled?: boolean): IVisualPlugin {
            if (!categoricalPivotEnabled)
                return pluginOld;
            
            let caps: VisualCapabilities = pluginOld.capabilities;
            if (!caps.dataViewMappings)
                return pluginOld;

            let pluginNew: IVisualPlugin = pluginOld;
            for (let i = 0; i < caps.dataViewMappings.length; ++i) {
                let mapping: DataViewCategoricalMapping = caps.dataViewMappings[i].categorical;
                if (!mapping)
                    continue;

                // copy only once
                if (pluginNew === pluginOld) {
                    pluginNew = _.clone(pluginOld); //  shallow
                    pluginNew.capabilities = _.clone(pluginNew.capabilities);

                    caps = pluginNew.capabilities;
                    mapping = caps.dataViewMappings[i].categorical;
                }

                let categories = mapping.categories;
                if (categories && categories.dataReductionAlgorithm)
                    categories.dataReductionAlgorithm = undefined;

                let values = mapping.values;
                if (values) {
                    let group = (<DataViewGroupedRoleMapping>values).group;
                    if (group)
                        group.dataReductionAlgorithm = undefined;
                }

                mapping.dataReductionAlgorithm = {
                    sample: {}
                };
            }

            return pluginNew;
        }

        export class MinervaVisualPluginService extends VisualPluginService {
            private featureSwitches: MinervaVisualFeatureSwitches;
            private visualPlugins: jsCommon.IStringDictionary<IVisualPlugin>;

            public constructor(featureSwitches: MinervaVisualFeatureSwitches) {
                super();

                debug.assertValue(featureSwitches, 'featureSwitches');
                this.featureSwitches = featureSwitches;

                this.visualPlugins = {};

                this.addCustomVisualizations([]);
                
                createMinervaPlugins(this.visualPlugins, this.featureSwitches);
            }

            public getVisuals(): IVisualPlugin[] {
                // Current visual types that supports visual conversion. Please don't change the orders
                // CAUTION: If you are adding new visual types, please check if you need to update the height of
                // the visual convertion pane in visualization pane as well.
                let convertibleVisualTypes = [
                    powerbi.visuals.plugins.barChart,
                    powerbi.visuals.plugins.columnChart,
                    powerbi.visuals.plugins.clusteredBarChart,
                    powerbi.visuals.plugins.clusteredColumnChart,
                    powerbi.visuals.plugins.hundredPercentStackedBarChart,
                    powerbi.visuals.plugins.hundredPercentStackedColumnChart,
                    powerbi.visuals.plugins.lineChart,
                    powerbi.visuals.plugins.areaChart,
                    powerbi.visuals.plugins.lineStackedColumnComboChart,
                    powerbi.visuals.plugins.lineClusteredColumnComboChart,
                    powerbi.visuals.plugins.waterfallChart,
                    powerbi.visuals.plugins.scatterChart,
                    powerbi.visuals.plugins.pieChart,
                    powerbi.visuals.plugins.treemap,
                    powerbi.visuals.plugins.map,
                    powerbi.visuals.plugins.table,
                    powerbi.visuals.plugins.matrix,
                    powerbi.visuals.plugins.filledMap,
                    powerbi.visuals.plugins.funnel,
                    powerbi.visuals.plugins.gauge,
                    powerbi.visuals.plugins.multiRowCard,
                    powerbi.visuals.plugins.card,
                    powerbi.visuals.plugins.slicer,
                    powerbi.visuals.plugins.donutChart,
                ];

                if (this.featureSwitches.scriptVisualEnabled) {
                    convertibleVisualTypes.push(powerbi.visuals.plugins.scriptVisual);
                }

                    // Add any visuals compiled in the developer tools
                    // Additionally add custom visuals.
                for (let p in plugins) {
                    let plugin = plugins[p];
                    if (plugin.custom) {
                        this.pushPluginIntoConveratbleTypes(convertibleVisualTypes, plugin);
                    }
                }

                this.addCustomVisualizations(convertibleVisualTypes);

                if (this.featureSwitches.dataDotChartEnabled) {
                    convertibleVisualTypes.push(powerbi.visuals.plugins.dataDotClusteredColumnComboChart);
                    convertibleVisualTypes.push(powerbi.visuals.plugins.dataDotStackedColumnComboChart);
                }

                if (this.featureSwitches.stackedAreaEnabled) {
                    convertibleVisualTypes.push(powerbi.visuals.plugins.stackedAreaChart);                    
                }                

                return convertibleVisualTypes;
            }

            private pushPluginIntoConveratbleTypes(convertibleVisualTypes: IVisualPlugin[], plugin: IVisualPlugin) {
                if (!convertibleVisualTypes.some(pl => pl.name === plugin.name)) {
                    convertibleVisualTypes.push(plugin);
                }
            }
            
            private addCustomVisualizations(convertibleVisualTypes: IVisualPlugin[]): void {
                // Read new visual from localstorage
                let customVisualizationList = localStorageService.getData('customVisualizations');
                if (customVisualizationList) {
                    let len = customVisualizationList.length;
                    for (let i = 0; i < len; i++) {
                        let pluginName = customVisualizationList[i].pluginName;
                        let plugin = this.getPlugin(pluginName);
                        // If the browser session got restarted or its a new window the plugin wont be available, so we need to add it
                        if (!plugin) {
                            let jsCode = customVisualizationList[i].javaScriptCode;
                            let script = $("<script/>", {
                                html: jsCode + '//# sourceURL=' + pluginName + '.js\n' + '//# sourceMappingURL=' + pluginName + '.js.map'
                            });

                            script.attr('pluginName', pluginName);

                            $('body').append(script);

                            let style = $("<style/>", {
                                html: customVisualizationList[i].cssCode
                            });

                            style.attr('pluginName', pluginName);

                            $('head').append(style);

                            plugin = this.getPlugin(pluginName);
                        }
                        this.pushPluginIntoConveratbleTypes(convertibleVisualTypes, plugin);
                    }
                }
            }

            public getPlugin(type: string): IVisualPlugin {
                if (this.visualPlugins[type])
                    return this.visualPlugins[type];

                return super.getPlugin(type);
            }

            public requireSandbox(plugin: IVisualPlugin): boolean {
                return this.featureSwitches.sandboxVisualsEnabled && (!plugin || (plugin && plugin.custom));
            }
        }

        export class PlaygroundVisualPluginService extends VisualPluginService {
            private visualPlugins: jsCommon.IStringDictionary<IVisualPlugin>;

            public constructor() {
                super();

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

        /**
         * This plug-in service is used when displaying visuals on the dashboard.
         */
        export class DashboardPluginService extends VisualPluginService {
            private featureSwitches: MinervaVisualFeatureSwitches;
            private visualPlugins: jsCommon.IStringDictionary<IVisualPlugin>;

            public constructor(featureSwitches: MinervaVisualFeatureSwitches) {
                super();

                debug.assertValue(featureSwitches, 'featureSwitches');
                this.featureSwitches = featureSwitches;

                this.visualPlugins = {};

                // Although there are no plug-in modifications here, this service allows different parameters such as feature switches to be passed for dashboard visuals.
            }

            public getPlugin(type: string): IVisualPlugin {

                if (this.visualPlugins[type]) {
                    return this.visualPlugins[type];
                }

                return super.getPlugin(type);
            }

            public requireSandbox(plugin: IVisualPlugin): boolean {
                return this.featureSwitches.sandboxVisualsEnabled && (!plugin || (plugin && plugin.custom));
            }
        }

        // This plug-in service is used when displaying visuals for insights.
        export class InsightsPluginService extends VisualPluginService {
            private featureSwitches: MinervaVisualFeatureSwitches;
            private visualPlugins: jsCommon.IStringDictionary<IVisualPlugin>;

            public constructor(featureSwitches: MinervaVisualFeatureSwitches) {
                super();

                debug.assertValue(featureSwitches, 'featureSwitches');
                this.featureSwitches = featureSwitches;

                let seriesLabelFormattingEnabled: boolean = featureSwitches ? featureSwitches.seriesLabelFormattingEnabled : false;
                this.visualPlugins = {};

                // Clustered Bar Chart
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.clusteredBarChart, () => new CartesianChart({
                    chartType: CartesianChartType.ClusteredBar,
                    animator: new WebColumnChartAnimator(),
                    behavior: new CartesianChartBehavior([new ColumnChartWebBehavior()]),
                    seriesLabelFormattingEnabled: seriesLabelFormattingEnabled,
                }));

                // Column Chart
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.columnChart, () => new CartesianChart({
                    chartType: CartesianChartType.StackedColumn,
                    animator: new WebColumnChartAnimator(),
                    behavior: new CartesianChartBehavior([new ColumnChartWebBehavior()]),
                    seriesLabelFormattingEnabled: seriesLabelFormattingEnabled,
                }));

                // Donut Chart
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.donutChart, () => new DonutChart({
                    animator: new WebDonutChartAnimator(),
                    behavior: new DonutChartWebBehavior(),
                }));

                // Hundred Percent Stacked Bar Chart
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.hundredPercentStackedBarChart, () => new CartesianChart({
                    chartType: CartesianChartType.HundredPercentStackedBar,
                    animator: new WebColumnChartAnimator(),
                    behavior: new CartesianChartBehavior([new ColumnChartWebBehavior()]),
                    seriesLabelFormattingEnabled: seriesLabelFormattingEnabled,
                }));

                // Hundred Percent Stacked Column Chart
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.hundredPercentStackedColumnChart, () => new CartesianChart({
                    chartType: CartesianChartType.HundredPercentStackedColumn,
                    animator: new WebColumnChartAnimator(),
                    behavior: new CartesianChartBehavior([new ColumnChartWebBehavior()]),
                    seriesLabelFormattingEnabled: seriesLabelFormattingEnabled,
                }));
                
                // Line Chart
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.lineChart, () => new CartesianChart({
                    chartType: CartesianChartType.Line,
                    animator: new BaseAnimator(),
                    behavior: new CartesianChartBehavior([new LineChartWebBehavior()])
                }));

                // Area Chart
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.areaChart, () => new CartesianChart({
                    chartType: CartesianChartType.Area,
                    animator: new BaseAnimator(),
                    behavior: new CartesianChartBehavior([new LineChartWebBehavior()])
                }));

                // Pie Chart
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.pieChart, () => new DonutChart({
                    sliceWidthRatio: 0,
                    animator: new WebDonutChartAnimator(),
                    behavior: new DonutChartWebBehavior(),
                }));

                // Scatter Chart
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.scatterChart, () => new CartesianChart({
                    chartType: CartesianChartType.Scatter,
                    animator: new BaseAnimator(),
                    behavior: new CartesianChartBehavior([new ScatterChartWebBehavior()]),
                }), undefined);
            }

            public getPlugin(type: string): IVisualPlugin {
                if (this.visualPlugins[type]) {
                    return this.visualPlugins[type];
                }

                return super.getPlugin(type);
            }

            public requireSandbox(plugin: IVisualPlugin): boolean {
                return this.featureSwitches.sandboxVisualsEnabled && (!plugin || (plugin && plugin.custom));
            }
        }

        export class MobileVisualPluginService extends VisualPluginService {
            private visualPlugins: jsCommon.IStringDictionary<IVisualPlugin>;
            private smallViewPortProperties;
            public static MinHeightLegendVisible = 80;
            public static MinHeightAxesVisible = 80;
            public static MinHeightGaugeSideNumbersVisible = 80;
            public static GaugeMarginsOnSmallViewPort = 10;
            public static MinHeightFunnelCategoryLabelsVisible = 80;

            public constructor(smallViewPortProperties?: SmallViewPortProperties) {
                super();

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
                };

                // Disable tooltips for mobile
                TooltipManager.ShowTooltips = false;

                this.visualPlugins = {};
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.lineChart, () => new CartesianChart({ chartType: CartesianChartType.Line, cartesianSmallViewPortProperties: this.smallViewPortProperties.CartesianSmallViewPortProperties }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.lineClusteredColumnComboChart, () => new CartesianChart({ chartType: CartesianChartType.LineClusteredColumnCombo, cartesianSmallViewPortProperties: this.smallViewPortProperties.CartesianSmallViewPortProperties }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.lineStackedColumnComboChart, () => new CartesianChart({ chartType: CartesianChartType.LineStackedColumnCombo, cartesianSmallViewPortProperties: this.smallViewPortProperties.CartesianSmallViewPortProperties }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.scatterChart, () => new CartesianChart({ chartType: CartesianChartType.Scatter, cartesianSmallViewPortProperties: this.smallViewPortProperties.CartesianSmallViewPortProperties, behavior: new CartesianChartBehavior([new ScatterChartMobileBehavior()]) }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.gauge, () => new Gauge({ chartType: Gauge, gaugeSmallViewPortProperties: this.smallViewPortProperties.GaugeSmallViewPortProperties }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.funnel, () => new FunnelChart({ animator: null, funnelSmallViewPortProperties: this.smallViewPortProperties.FunnelSmallViewPortProperties }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.donutChart, () => new DonutChart({ disableGeometricCulling: true }));
                createPlugin(this.visualPlugins, powerbi.visuals.plugins.pieChart, () => new DonutChart({ sliceWidthRatio: 0, disableGeometricCulling: true }));

            }

            public getPlugin(type: string): IVisualPlugin {
                if (this.visualPlugins[type])
                    return this.visualPlugins[type];

                return super.getPlugin(type);
            }
        }

        export function create(): IVisualPluginService {
            return new VisualPluginService();
        }

        export function createMinerva(featureSwitches: MinervaVisualFeatureSwitches): IVisualPluginService {
            return new MinervaVisualPluginService(featureSwitches);
        }

        export function createDashboard(featureSwitches: MinervaVisualFeatureSwitches): IVisualPluginService {
            return new DashboardPluginService(featureSwitches);
        }

        export function createInsights(featureSwitches: MinervaVisualFeatureSwitches): IVisualPluginService {
            return new InsightsPluginService(featureSwitches);
        }

        export function createMobile(smallViewPortProperties?: SmallViewPortProperties): IVisualPluginService {
            return new MobileVisualPluginService(smallViewPortProperties);
        }
    }
}
