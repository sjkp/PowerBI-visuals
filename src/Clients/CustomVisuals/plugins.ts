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

module powerbi.visuals.plugins {
    export let sunburstCustom: IVisualPlugin = {
        name: 'sunburstCustom',
        watermarkKey: 'defaultWatermark',
        capabilities: samples.Sunburst.capabilities,
        create: () => new samples.Sunburst()
    };

    export let asterPlot: IVisualPlugin = {
        name: 'asterPlot',
        capabilities: samples.AsterPlot.capabilities,
        create: () => new samples.AsterPlot()
    };

    export var tornadoChart: IVisualPlugin = {
        name: "tornadoChart",
        capabilities: samples.TornadoChart.capabilities,
        create: () => new samples.TornadoChart()
    };

    export var sankeyDiagram: IVisualPlugin = {
        name: "sankeyDiagram",
        capabilities: samples.SankeyDiagram.capabilities,
        create: () => new samples.SankeyDiagram()
    };

    export let mekkoChart: IVisualPlugin = {
        name: 'mekkoChart',
        watermarkKey: 'mekko',
        capabilities: samples.MekkoChart.capabilities,
        create: () => new samples.MekkoChart({ chartType: samples.MekkoChartType.HundredPercentStackedColumn }),
        customizeQuery: ColumnChart.customizeQuery,
        getSortableRoles: (visualSortableOptions?: VisualSortableOptions) => ColumnChart.getSortableRoles(visualSortableOptions),
    };
    
    export var bulletChart: IVisualPlugin = {
        name: "bulletChart",
        capabilities: samples.BulletChart.capabilities,
        create: () => new samples.BulletChart()
    };
	
	export var wordCloud: IVisualPlugin = {
        name: "wordCloud",
        capabilities: samples.WordCloud.capabilities,
        create: () => new samples.WordCloud()
    };
	
	export var chicletSlicer: IVisualPlugin = {
        name: 'chicletSlicer',
        capabilities: samples.ChicletSlicer.capabilities,
        create: () => new samples.ChicletSlicer()
    };
	
	export var chordChart: IVisualPlugin = {
        name: "chordChart",
        capabilities: samples.ChordChart.capabilities,
        create: () => new samples.ChordChart()
    };
	
	export var enhancedScatterChart: IVisualPlugin = {
        name: 'enhancedScatterChart',
        capabilities: samples.EnhancedScatterChart.capabilities,
        create: () => new samples.EnhancedScatterChart()
    };
	
	export var radarChart: IVisualPlugin = {
        name: 'radarChart',
        capabilities: samples.RadarChart.capabilities,
        create: () => new samples.RadarChart()
    };
	
	export var dotPlot: IVisualPlugin = {
        name: 'dotPlot',
        capabilities: samples.DotPlot.capabilities,
        create: () => new samples.DotPlot()
    };

    export var histogram: IVisualPlugin = {
        name: "histogram",
        capabilities: samples.Histogram.capabilities,
        create: () => new samples.Histogram()
    };

	export var timeline: IVisualPlugin = {
        name: 'timeline',
        capabilities: samples.Timeline.capabilities,
        create: () => new samples.Timeline()
    };
	
	export var forceGraph: IVisualPlugin = {
        name: "forceGraph",
        capabilities: samples.ForceGraph.capabilities,
        create: () => new samples.ForceGraph()
    };

    export let gantt: IVisualPlugin = {
        name: "gantt",
        capabilities: samples.Gantt.capabilities,
        create: () => new samples.Gantt()
    };

    export let streamGraph: IVisualPlugin = {
        name: "streamGraph",
        capabilities: samples.StreamGraph.capabilities,
        create: () => new samples.StreamGraph()
    };

    export let pulseChart: IVisualPlugin = {
        name: "pulseChart",
        capabilities: samples.PulseChart.capabilities,
        create: () => new samples.PulseChart()
    };

    export var lineDotChart: IVisualPlugin = {
        name: "lineDotChart",
        capabilities: samples.LineDotChart.capabilities,
        create: () => new samples.LineDotChart()
    };
}