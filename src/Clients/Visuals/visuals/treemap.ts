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
    import CssConstants = jsCommon.CssConstants;

    export interface TreemapConstructorOptions {
        animator?: ITreemapAnimator;
        isScrollable: boolean;
        behavior?: TreemapWebBehavior;
        tooltipsEnabled?: boolean;
        tooltipBucketEnabled?: boolean;
    }

    export interface TreemapData {
        root: TreemapNode;
        hasHighlights: boolean;
        legendData: LegendData;
        dataLabelsSettings: VisualDataLabelsSettings;
        legendObjectProperties?: DataViewObject;
        dataWasCulled: boolean;
        hasNegativeValues?: boolean;
        allValuesAreNegative?: boolean;
    }

    /**
     * Treemap node (we extend D3 node (GraphNode) because treemap layout methods rely on the type).
     */
    export interface TreemapNode extends D3.Layout.GraphNode, SelectableDataPoint, TooltipEnabledDataPoint, LabelEnabledDataPoint {
        key: any;
        originalValue: number;
        highlightMultiplier?: number;
        highlightValue?: number;
        originalHighlightValue?: number;
        color: string;
        highlightedTooltipInfo?: TooltipDataItem[];
    }

    interface TreemapRawData {
        values: number[][];
        highlights?: number[][];
        highlightsOverflow?: boolean;
        totalValue: number;
        hasNegativeValues?: boolean;
        allValuesAreNegative?: boolean;
    }

    export interface ITreemapLayout {
        shapeClass: (d: TreemapNode) => string;
        shapeLayout: {
            x: (d: TreemapNode) => number;
            y: (d: TreemapNode) => number;
            width: (d: TreemapNode) => number;
            height: (d: TreemapNode) => number;
        };
        highlightShapeClass: (d: TreemapNode) => string;
        highlightShapeLayout: {
            x: (d: TreemapNode) => number;
            y: (d: TreemapNode) => number;
            width: (d: TreemapNode) => number;
            height: (d: TreemapNode) => number;
        };
        zeroShapeLayout: {
            x: (d: TreemapNode) => number;
            y: (d: TreemapNode) => number;
            width: (d: TreemapNode) => number;
            height: (d: TreemapNode) => number;
        };
        majorLabelClass: (d: TreemapNode) => string;
        majorLabelLayout: {
            x: (d: TreemapNode) => number;
            y: (d: TreemapNode) => number;
        };
        majorLabelText: (d: TreemapNode) => string;
        minorLabelClass: (d: TreemapNode) => string;
        minorLabelLayout: {
            x: (d: TreemapNode) => number;
            y: (d: TreemapNode) => number;
        };
        minorLabelText: (d: TreemapNode) => string;
        areMajorLabelsEnabled: () => boolean;
        areMinorLabelsEnabled: () => boolean;
    }

    // Todo: move to shared location
    interface DataPointObject extends DataViewObject {
        fill: Fill;
    }

    export interface ValueShape {
        validShape: boolean;
        dataWasCulled: boolean;
    }

    /**
     * Renders an interactive treemap visual from categorical data.
     */
    export class Treemap implements IVisual {
        public static DimmedShapeOpacity = 0.4;

        private static ClassName = 'treemap';
        public static LabelsGroupClassName = "labels";
        public static MajorLabelClassName = 'majorLabel';
        public static MinorLabelClassName = 'minorLabel';
        public static ShapesClassName = "shapes";
        public static TreemapNodeClassName = "treemapNode";
        public static RootNodeClassName = 'rootNode';
        public static ParentGroupClassName = 'parentGroup';
        public static NodeGroupClassName = 'nodeGroup';
        public static HighlightNodeClassName = 'treemapNodeHighlight';
        private static TextMargin = 5;
        private static MinorLabelTextSize = 10;
        private static MinTextWidthForMinorLabel = 18;
        private static MajorLabelTextSize = 12;
        private static MinTextWidthForMajorLabel = 22;
        private static MajorLabelTextProperties: TextProperties = {
            fontFamily: Font.Family.regular.css,
            fontSize: Treemap.MajorLabelTextSize + 'px'
        };

        /**
         * A rect with an area of 9 is a treemap rectangle of only
         * a single pixel in the middle with a 1 pixel stroke on each edge.
         */
        private static CullableArea = 9;

        private svg: D3.Selection;
        private treemap: D3.Layout.TreeMapLayout;
        private shapeGraphicsContext: D3.Selection;
        private labelGraphicsContext: D3.Selection;
        // TODO: Remove this once all visuals have implemented update.
        private currentViewport: IViewport;
        private legend: ILegend;

        private data: TreemapData;
        private style: IVisualStyle;
        private colors: IDataColorPalette;
        private element: JQuery;
        private options: VisualInitOptions;
        private isScrollable: boolean;
        private hostService: IVisualHostServices;
        private tooltipsEnabled: boolean;
        private tooltipBucketEnabled: boolean;

        /**
         * Note: Public for testing.
         */
        public animator: ITreemapAnimator;
        private interactivityService: IInteractivityService;
        private behavior: TreemapWebBehavior;

        // TODO: Remove this once all visuals have implemented update.
        private dataViews: DataView[];

        public static getLayout(labelsSettings: VisualDataLabelsSettings, alternativeScale: number): ITreemapLayout {
            let formattersCache = dataLabelUtils.createColumnFormatterCacheManager();
            let majorLabelsEnabled = labelsSettings.showCategory;
            let minorLabelsEnabled = labelsSettings.show || labelsSettings.showCategory;

            return {
                shapeClass: (d) => Treemap.getNodeClass(d, false),
                shapeLayout: Treemap.createTreemapShapeLayout(false),
                highlightShapeClass: (d) => Treemap.getNodeClass(d, true),
                highlightShapeLayout: Treemap.createTreemapShapeLayout(true),
                zeroShapeLayout: Treemap.createTreemapZeroShapeLayout(),
                majorLabelClass: (d) => Treemap.MajorLabelClassName,
                majorLabelLayout: {
                    x: (d) => d.x + Treemap.TextMargin,
                    y: (d) => d.y + Treemap.TextMargin + Treemap.MajorLabelTextSize,
                },
                majorLabelText: (d) => Treemap.createMajorLabelText(d, labelsSettings, alternativeScale, formattersCache),

                minorLabelClass: (d) => Treemap.MinorLabelClassName,
                minorLabelLayout: {
                    x: (d) => d.x + Treemap.TextMargin,
                    y: (d) => d.y + d.dy - Treemap.TextMargin,
                },
                minorLabelText: (d) => Treemap.createMinorLabelText(d, labelsSettings, alternativeScale, formattersCache),
                areMajorLabelsEnabled: () => majorLabelsEnabled,
                areMinorLabelsEnabled: () => minorLabelsEnabled,
            };
        }

        constructor(options?: TreemapConstructorOptions) {
            this.tooltipsEnabled = options && options.tooltipsEnabled;
            this.tooltipBucketEnabled = options && options.tooltipBucketEnabled;
            if (options && options.animator) {
                this.animator = options.animator;
                this.isScrollable = options.isScrollable ? options.isScrollable : false;
                this.behavior = options.behavior;
            }
        }

        public init(options: VisualInitOptions): void {
            this.options = options;
            let element = options.element;

            // Ensure viewport is empty on init
            element.empty();

            this.svg = d3.select(element.get(0))
                .append('svg')
                .style('position', 'absolute')
                .classed(Treemap.ClassName, true);
            this.shapeGraphicsContext = this.svg
                .append('g')
                .classed(Treemap.ShapesClassName, true);
            this.labelGraphicsContext = this.svg
                .append('g')
                .classed(Treemap.LabelsGroupClassName, true);

            this.element = element;

            // avoid deep copy
            this.currentViewport = {
                height: options.viewport.height,
                width: options.viewport.width,
            };

            this.style = options.style;

            this.treemap = d3.layout.treemap()
                .sticky(false)
                .sort((a, b) => a.size - b.size)
                .value((d) => d.size)
                .round(false);

            if (this.behavior) {
                this.interactivityService = createInteractivityService(options.host);
            }
            this.legend = createLegend(element, options.interactivity && options.interactivity.isInteractiveLegend, this.interactivityService, this.isScrollable);
            this.colors = this.style.colorPalette.dataColors;

            this.hostService = options.host;
        }

        /**
         * Note: Public for testing purposes.
         */
        public static converter(dataView: DataView, colors: IDataColorPalette, labelSettings: VisualDataLabelsSettings, interactivityService: IInteractivityService, viewport: IViewport, legendObjectProperties?: DataViewObject, tooltipsEnabled: boolean = true, tooltipBucketEnabled?: boolean): TreemapData {
            let reader = data.createIDataViewCategoricalReader(dataView);
            let hasNegativeValues: boolean;
            let allValuesAreNegative: boolean;

            let rootNode: TreemapNode = {
                key: "root",
                name: "root",
                originalValue: undefined,
                children: [],
                selected: false,
                highlightMultiplier: 0,
                identity: SelectionId.createNull(),
                color: undefined,
            };

            let allNodes: TreemapNode[] = [];
            let hasHighlights: boolean;
            let legendDataPoints: LegendDataPoint[] = [];
            let legendTitle = "";
            let colorHelper = new ColorHelper(colors, treemapProps.dataPoint.fill);
            let dataWasCulled = undefined;
            
            if (dataView && dataView.metadata && dataView.metadata.objects) {
                let objects = dataView.metadata.objects;

                labelSettings.show = DataViewObjects.getValue(objects, treemapProps.labels.show, labelSettings.show);
                labelSettings.labelColor = DataViewObjects.getFillColor(objects, treemapProps.labels.color, labelSettings.labelColor);
                labelSettings.displayUnits = DataViewObjects.getValue(objects, treemapProps.labels.labelDisplayUnits, labelSettings.displayUnits);
                labelSettings.precision = DataViewObjects.getValue(objects, treemapProps.labels.labelPrecision, labelSettings.precision);
                labelSettings.showCategory = DataViewObjects.getValue(objects, treemapProps.categoryLabels.show, labelSettings.showCategory);
            }

            // If we values or a gradient, render the tree map
            if (reader.hasValues(treemapRoles.values) || reader.hasValues(treemapRoles.gradient)) {
                
                // If we don't have a values column, but do have a gradient one, use that as values
                let valueColumnRoleName = reader.hasValues(treemapRoles.values) ? treemapRoles.values : treemapRoles.gradient;
                let categorical = dataView.categorical;
                hasHighlights = reader.hasHighlights(valueColumnRoleName);

                let formatStringProp = treemapProps.general.formatString;
                let result = Treemap.getValuesFromCategoricalDataView(dataView, hasHighlights, valueColumnRoleName);
                let values = result.values;
                let highlights = result.highlights;
                let totalValue = result.totalValue;
                if (result.highlightsOverflow) {
                    hasHighlights = false;
                    values = highlights;
                }
                hasNegativeValues = result.hasNegativeValues;
                allValuesAreNegative = result.allValuesAreNegative;

                let cullableValue = Treemap.getCullableValue(totalValue, viewport);

                let hasDynamicSeries = reader.hasDynamicSeries();
                dataWasCulled = false;
                let gradientValueColumn: DataViewValueColumn = reader.getValueColumn(treemapRoles.gradient, 0); // Gradient is only used if we have only one series or series are nondynamic (and therefore don't affect gradient)
                
                if ((categorical.categories == null) && !_.isEmpty(values)) {
                    // No categories, sliced by series and measures
                    for (let seriesIndex = 0, seriesCount = reader.getSeriesCount(valueColumnRoleName); seriesIndex < seriesCount; seriesIndex++) {

                        let valueColumn = reader.getValueColumn(valueColumnRoleName, seriesIndex);

                        let value = values[0][seriesIndex];

                        let valueShape = Treemap.checkValueForShape(value, cullableValue, allValuesAreNegative, dataWasCulled);
                        dataWasCulled = valueShape.dataWasCulled;
                        if (!valueShape.validShape)
                            continue;
                         
                        let nodeName = hasDynamicSeries ? converterHelper.formatFromMetadataColumn(reader.getSeriesValueColumnGroup(seriesIndex).name, reader.getSeriesMetadataColumn(), formatStringProp) : converterHelper.formatFromMetadataColumn(reader.getValueDisplayName(valueColumnRoleName, seriesIndex), valueColumn.source, formatStringProp);

                        let identity = new SelectionIdBuilder()
                            .withSeries(dataView.categorical.values, hasDynamicSeries ? valueColumn : undefined)
                            .withMeasure(valueColumn.source.queryName)
                            .createSelectionId();

                        let key = identity.getKey();

                        let color = hasDynamicSeries
                            ? colorHelper.getColorForSeriesValue(reader.getSeriesObjects(seriesIndex), categorical.values.identityFields, converterHelper.getSeriesName(valueColumn.source))
                            : colorHelper.getColorForMeasure(valueColumn.source.objects, valueColumn.source.queryName);

                        let highlightedValue = hasHighlights ? highlights[0][seriesIndex] : undefined;

                        let tooltipInfo: TooltipDataItem[];
                        if (tooltipsEnabled) {
                            tooltipInfo = [];

                            if (hasDynamicSeries) {
                                let seriesMetadataColumn = reader.getSeriesMetadataColumn();
                                let seriesValue = reader.getSeriesValueColumnGroup(seriesIndex).name;
                                tooltipInfo.push({
                                    displayName: seriesMetadataColumn.displayName,
                                    value: converterHelper.formatFromMetadataColumn(seriesValue, seriesMetadataColumn, formatStringProp),
                                });
                            }

                            if (value != null) {
                                tooltipInfo.push({
                                    displayName: valueColumn.source.displayName,
                                    value: converterHelper.formatFromMetadataColumn(value, valueColumn.source, formatStringProp),
                                });
                            }

                            if (highlightedValue != null) {
                                tooltipInfo.push({
                                    displayName: ToolTipComponent.localizationOptions.highlightedValueDisplayName,
                                    value: converterHelper.formatFromMetadataColumn(highlightedValue, valueColumn.source, formatStringProp),
                                });
                            }
                            if (tooltipBucketEnabled) {
                                TooltipBuilder.addTooltipBucketItem(reader, tooltipInfo, 0, hasDynamicSeries ? seriesIndex : undefined);
                            }
                        }
                        
                        let node: TreemapNode = {
                            key: key,
                            name: nodeName,
                            size: allValuesAreNegative ? Math.abs(value) : value,
                            originalValue: value,
                            color: color,
                            selected: false,
                            identity: identity,
                            tooltipInfo: tooltipInfo,
                            highlightedTooltipInfo: tooltipInfo,
                            labelFormatString: valueFormatter.getFormatString(valueColumn.source, formatStringProp),
                        };
                        if (hasHighlights && highlights) {
                            node.highlightMultiplier = value !== 0 ? highlightedValue / value : 0;
                            node.highlightValue = (allValuesAreNegative && highlightedValue != null) ? Math.abs(highlightedValue) : highlightedValue;
                            node.originalHighlightValue = highlightedValue;
                        }
                        rootNode.children.push(node);
                        allNodes.push(node);
                        legendDataPoints.push({
                            label: nodeName,
                            color: color,
                            icon: LegendIcon.Box,
                            identity: identity,
                            selected: false
                        });
                    }
                }
                else if (categorical.categories && categorical.categories.length > 0) {
                    // Count the columns that have the value roles
                    let seriesCount = reader.getSeriesCount(valueColumnRoleName);

                    // Do not add second level if there's only one series.
                    let omitSecondLevel = seriesCount === 1;

                    // Create the first level from categories
                    let categoryColumn = categorical.categories[0];

                    legendTitle = categoryColumn.source.displayName;
                    let categoryFormat = valueFormatter.getFormatString(categoryColumn.source, formatStringProp);

                    for (let categoryIndex = 0, categoryLen = values.length; categoryIndex < categoryLen; categoryIndex++) {
                        let objects = categoryColumn.objects && categoryColumn.objects[categoryIndex];

                        let color = colorHelper.getColorForSeriesValue(objects, categoryColumn.identityFields, categoryColumn.values[categoryIndex]);
                        
                        let categoryValue = valueFormatter.format(categoryColumn.values[categoryIndex], categoryFormat);

                        let currentValues = values[categoryIndex];

                        // This section area builds the tooltip for the parent node. It's only displayed if the node doesn't have any children (essentially if omitSecondLevel is true).
                        // seriesIndex is the index of the 1st series with the role Values.
                        let seriesIndex = 0;
                        let value = currentValues[seriesIndex];
                        let highlightValue = hasHighlights && highlights ? highlights[categoryIndex][seriesIndex] : undefined;
                                                
                        let tooltipInfo: TooltipDataItem[];
                        let categoryTooltipItem: TooltipDataItem;

                        if (tooltipsEnabled) {
                            tooltipInfo = [];

                            categoryTooltipItem = {
                                displayName: categoryColumn.source.displayName,
                                value: categoryValue,
                            };
                            tooltipInfo.push(categoryTooltipItem);

                            let valueColumnMetadata: DataViewMetadataColumn = reader.getValueMetadataColumn(valueColumnRoleName, seriesIndex); 
                            if (value != null) {
                                tooltipInfo.push({
                                    displayName: valueColumnMetadata.displayName,
                                    value: converterHelper.formatFromMetadataColumn(value, valueColumnMetadata, formatStringProp),
                                });
                            }

                            if (highlightValue != null) {
                                tooltipInfo.push({
                                    displayName: ToolTipComponent.localizationOptions.highlightedValueDisplayName,
                                    value: converterHelper.formatFromMetadataColumn(highlightValue, valueColumnMetadata, formatStringProp),
                                });
                            }

                            let gradientValueColumnMetadata = gradientValueColumn ? gradientValueColumn.source : undefined;
                            if (omitSecondLevel && gradientValueColumnMetadata && gradientValueColumnMetadata !== valueColumnMetadata && gradientValueColumn.values[categoryIndex] != null ) {
                                tooltipInfo.push({
                                    displayName: gradientValueColumnMetadata.displayName,
                                    value: converterHelper.formatFromMetadataColumn(gradientValueColumn.values[categoryIndex] , gradientValueColumnMetadata, formatStringProp),
                                });
                            }

                            if (tooltipBucketEnabled) {
                                TooltipBuilder.addTooltipBucketItem(reader, tooltipInfo, categoryIndex, seriesIndex);
                            }
                        }

                        let identity: SelectionId = SelectionIdBuilder.builder()
                            .withCategory(categoryColumn, categoryIndex)
                            .withMeasure(omitSecondLevel ? reader.getValueMetadataColumn(valueColumnRoleName, seriesIndex).queryName : undefined)
                            .createSelectionId();

                        let key = JSON.stringify({ nodeKey: identity.getKey(), depth: 1 });

                        let node: TreemapNode = {
                            key: key,
                            name: categoryValue,
                            originalValue: undefined,
                            color: color,
                            selected: false,
                            identity: identity,
                            tooltipInfo: tooltipInfo,
                            highlightedTooltipInfo: tooltipInfo,
                            labelFormatString: seriesCount === 1 ? valueFormatter.getFormatString(reader.getValueMetadataColumn(valueColumnRoleName, seriesIndex), formatStringProp) : categoryFormat,
                        };
                        if (hasHighlights) {
                            node.highlightMultiplier = value !== 0 ? highlightValue / value : 0;
                            node.highlightValue = (allValuesAreNegative && highlightValue != null) ? Math.abs(highlightValue) : highlightValue;
                            node.originalHighlightValue = highlightValue;
                        }

                        legendDataPoints.push({
                            label: categoryValue,
                            color: color,
                            icon: LegendIcon.Box,
                            identity: identity,
                            selected: false
                        });

                        let total = 0;
                        let highlightTotal = 0; // Used if omitting second level

                        for (; seriesIndex < seriesCount; seriesIndex++) {

                            let valueColumn = reader.getValueColumn(valueColumnRoleName, seriesIndex);

                            let value = currentValues[seriesIndex];

                            let highlight: number;

                            let valueShape = Treemap.checkValueForShape(value, cullableValue, allValuesAreNegative, dataWasCulled);
                            dataWasCulled = valueShape.dataWasCulled;
                            if (!valueShape.validShape)
                                continue;

                            total += value;

                            if (hasHighlights) {
                                highlight = highlights[categoryIndex][seriesIndex];
                                highlightTotal += highlight;
                            }

                            if (!omitSecondLevel) {
                                let childName: string = null;
                                if (reader.hasDynamicSeries()) {
                                    // Measure: use name and index
                                    childName = converterHelper.formatFromMetadataColumn(reader.getSeriesName(seriesIndex), reader.getSeriesMetadataColumn(), formatStringProp);
                                }
                                else {
                                    // Series group instance
                                    childName = converterHelper.formatFromMetadataColumn(reader.getValueDisplayName(valueColumnRoleName, seriesIndex), reader.getValueMetadataColumn(valueColumnRoleName, seriesIndex), formatStringProp);
                                }

                                let categoricalValues = categorical ? categorical.values : null;
                                let measureId = valueColumn.source.queryName;
                                let childIdentity = SelectionIdBuilder.builder()
                                    .withCategory(categoryColumn, categoryIndex)
                                    .withSeries(categoricalValues, valueColumn)
                                    .withMeasure(measureId)
                                    .createSelectionId();
                                let childKey = JSON.stringify({ nodeKey: childIdentity.getKey(), depth: 2 });

                                let highlightedValue = hasHighlights && highlight !== 0 ? highlight : undefined;

                                let tooltipInfo: TooltipDataItem[];
                                if (tooltipsEnabled) {
                                    tooltipInfo = [];

                                    tooltipInfo.push(categoryTooltipItem);

                                    if (hasDynamicSeries) {
                                        if (!categoryColumn || categoryColumn.source !== categoricalValues.source) {
                                            // Category/series on the same column -- don't repeat its value in the tooltip.
                                            tooltipInfo.push({
                                                displayName: categoricalValues.source.displayName,
                                                value: converterHelper.formatFromMetadataColumn(reader.getSeriesName(seriesIndex), categoricalValues.source, formatStringProp),
                                            });
                                        }
                                    }

                                    if (value != null) {
                                        tooltipInfo.push({
                                            displayName: valueColumn.source.displayName,
                                            value: converterHelper.formatFromMetadataColumn(value, valueColumn.source, formatStringProp),
                                        });
                                    }

                                    if (highlightValue != null) {
                                        tooltipInfo.push({
                                            displayName: ToolTipComponent.localizationOptions.highlightedValueDisplayName,
                                            value: converterHelper.formatFromMetadataColumn(highlightedValue, valueColumn.source, formatStringProp),
                                        });
                                    }

                                    if (tooltipBucketEnabled) {
                                        TooltipBuilder.addTooltipBucketItem(reader, tooltipInfo, categoryIndex, hasDynamicSeries ? seriesIndex : undefined);
                                    }
                                }

                                let childNode: TreemapNode = {
                                    key: childKey,
                                    name: childName,
                                    size: allValuesAreNegative ? Math.abs(value) : value,
                                    originalValue: value,
                                    color: color,
                                    selected: false,
                                    identity: childIdentity,
                                    tooltipInfo: tooltipInfo,
                                    highlightedTooltipInfo: tooltipInfo,
                                    labelFormatString: valueFormatter.getFormatString(valueColumn.source, formatStringProp),
                                };
                                if (hasHighlights) {
                                    childNode.highlightMultiplier = value !== 0 ? highlight / value : 0;
                                    childNode.highlightValue = (allValuesAreNegative && highlight != null) ? Math.abs(highlight) : null;
                                    childNode.originalHighlightValue = highlight;
                                }
                                if (node.children == null)
                                    node.children = [];

                                node.children.push(childNode);
                                allNodes.push(childNode);
                            }
                        }

                        if (total) {
                            node.size = allValuesAreNegative ? Math.abs(total) : total;
                            node.originalValue = total;
                            rootNode.children.push(node);
                            allNodes.push(node);
                        }
                        if (hasHighlights)
                            node.highlightMultiplier = total ? highlightTotal / total : 0;
                    }
                }
            }

            if (interactivityService) {
                interactivityService.applySelectionStateToData(allNodes);
                interactivityService.applySelectionStateToData(legendDataPoints);
            }

            return {
                root: rootNode,
                hasHighlights: hasHighlights,
                legendData: { title: legendTitle, dataPoints: legendDataPoints, fontSize: SVGLegend.DefaultFontSizeInPt },
                dataLabelsSettings: labelSettings,
                legendObjectProperties: legendObjectProperties,
                dataWasCulled: dataWasCulled,
                hasNegativeValues: hasNegativeValues,
                allValuesAreNegative: allValuesAreNegative,
            };
        }

        private static normalizedValue(value: number, allValuesAreNegative: boolean): number {
            if (value == null || isNaN(value))
                return 0;
            else if (value === Number.POSITIVE_INFINITY)
                return Number.MAX_VALUE;
            else if (value === Number.NEGATIVE_INFINITY)
                return -Number.MAX_VALUE;
            else if (allValuesAreNegative)
                return Math.abs(value);
            else if (value < 0)
                return 0;
            else
                return value;
        }

        private static getValuesFromCategoricalDataView(dataView: DataView, hasHighlights: boolean, valueColumnRoleName: string): TreemapRawData {
            let reader = data.createIDataViewCategoricalReader(dataView);
            let categoryCount = reader.getCategoryCount() || 1;
            let seriesCount = reader.getSeriesCount(valueColumnRoleName);

            let values: number[][] = [];
            let highlights: number[][] = [];
            let totalValue = 0;
            for (let i = 0; i < categoryCount; i++) {
                values.push([]);
                if (hasHighlights)
                    highlights.push([]);
            }

            let hasNegativeValues: boolean;
            let allValuesAreNegative: boolean = undefined;

            let highlightsOverflow: boolean;
            for (let seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let value = reader.getValue(valueColumnRoleName, categoryIndex, seriesIndex);
                    values[categoryIndex].push(value);
                    let highlight: any;
                    if (hasHighlights) {
                        highlight = reader.getHighlight(valueColumnRoleName, categoryIndex, seriesIndex);
                        highlights[categoryIndex].push(highlight);
                        if (highlight == null)
                            highlight = 0;
                    }

                    if (allValuesAreNegative === undefined) {
                        allValuesAreNegative = ((hasHighlights ? highlight <= 0 : true) && value <= 0) ? true: false;
                    }
                    else {
                        allValuesAreNegative = allValuesAreNegative && (hasHighlights ? highlight <= 0 : true) && value <= 0;
                    }
                    
                    if (!hasNegativeValues)
                        hasNegativeValues = value < 0 || (hasHighlights ? highlight < 0 : false);
                }
            }

            allValuesAreNegative = !!allValuesAreNegative;

            for (let seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
                for (let categoryIndex = 0; categoryIndex < categoryCount; categoryIndex++) {
                    let value = values[categoryIndex][seriesIndex];
                    value = Treemap.normalizedValue(value, allValuesAreNegative);
                    totalValue += value; 
                    if (hasHighlights) {
                        let highlight = highlights[categoryIndex][seriesIndex];
                        highlight = Treemap.normalizedValue(highlight, allValuesAreNegative);
                        if (!highlightsOverflow && highlight > value) {
                            highlightsOverflow = true;
                        }
                    }
                }
            }

            return {
                values: values,
                highlights: hasHighlights ? highlights : undefined,
                highlightsOverflow: hasHighlights ? highlightsOverflow : undefined,
                totalValue: allValuesAreNegative ? Math.abs(totalValue) : totalValue,
                hasNegativeValues: hasNegativeValues,
                allValuesAreNegative: allValuesAreNegative,
            };
        }

        private static getCullableValue(totalValue: number, viewport: IViewport): number {
            let totalArea = viewport.width * viewport.height;
            let culledPercent = Treemap.CullableArea / totalArea;
            return culledPercent * totalValue;
        }

        public update(options: VisualUpdateOptions) {
            debug.assertValue(options, 'options');

            let dataViews = this.dataViews = options.dataViews;
            this.currentViewport = options.viewport;
            let dataViewCategorical = dataViews && dataViews.length > 0 && dataViews[0].categorical ? dataViews[0].categorical : undefined;
            let labelSettings = dataLabelUtils.getDefaultTreemapLabelSettings();
            let legendObjectProperties = null;

            if (dataViewCategorical) {
                let dataView = dataViews[0];
                let dataViewMetadata = dataView.metadata;
                let objects: DataViewObjects;
                if (dataViewMetadata)
                    objects = dataViewMetadata.objects;

                if (objects) {
                    legendObjectProperties = objects['legend'];
                }

                this.data = Treemap.converter(dataView, this.colors, labelSettings, this.interactivityService, this.currentViewport, legendObjectProperties, this.tooltipsEnabled, this.tooltipBucketEnabled);
            }
            else {
                let rootNode: TreemapNode = {
                    key: "root",
                    name: "root",
                    originalValue: undefined,
                    children: [],
                    selected: false,
                    highlightMultiplier: 0,
                    identity: SelectionId.createNull(),
                    color: undefined,
                };
                let legendData: LegendData = { title: "", dataPoints: [] };
                let treeMapData: TreemapData = {
                    root: rootNode,
                    hasHighlights: false,
                    legendData: legendData,
                    dataLabelsSettings: labelSettings,
                    dataWasCulled: false,
                    hasNegativeValues: false,
                    allValuesAreNegative: false,
                };
                this.data = treeMapData;
            }

            this.updateInternal(options.suppressAnimations);

            if (dataViews) {
                let warnings = getInvalidValueWarnings(
                    dataViews,
                    false /*supportsNaN*/,
                    false /*supportsNegativeInfinity*/,
                    false /*supportsPositiveInfinity*/);

                if (this.data.allValuesAreNegative) {
                    warnings.push(new AllNegativeValuesWarning());
                }
                else if (this.data.hasNegativeValues) {
                    warnings.push(new NegativeValuesNotSupportedWarning());
                }
                this.hostService.setWarnings(warnings);
            }
        }

        // TODO: Remove this once all visuals have implemented update.
        public onDataChanged(options: VisualDataChangedOptions): void {
            this.update({
                suppressAnimations: options.suppressAnimations,
                dataViews: options.dataViews,
                viewport: this.currentViewport
            });
        }

        // TODO: Remove this once all visuals have implemented update.
        public onResizing(viewport: IViewport): void {
            this.update({
                suppressAnimations: true,
                dataViews: this.dataViews,
                viewport: viewport
            });
        }

        public onClearSelection(): void {
            if (this.interactivityService)
                this.interactivityService.clearSelection();
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            let data = this.data;
            if (!data)
                return;

            let objectName = options.objectName,
                enumeration = new ObjectEnumerationBuilder();

            let dataLabelsSettings = this.data.dataLabelsSettings
                ? this.data.dataLabelsSettings
                : dataLabelUtils.getDefaultTreemapLabelSettings();

            switch (objectName) {
                case 'dataPoint':
                    let dataViewCat: DataViewCategorical = this.dataViews && this.dataViews.length > 0 && this.dataViews[0] && this.dataViews[0].categorical;
                    let hasGradientRole = GradientUtils.hasGradientRole(dataViewCat);
                    if (!hasGradientRole)
                        this.enumerateDataPoints(enumeration, data);
                    break;
                case 'legend':
                    return this.enumerateLegend(data);
                case 'labels':
                    let labelSettingOptions: VisualDataLabelsSettingsOptions = {
                        enumeration: enumeration,
                        dataLabelsSettings: dataLabelsSettings,
                        show: true,
                        displayUnits: true,
                        precision: true,
                    };
                    dataLabelUtils.enumerateDataLabels(labelSettingOptions);
                    break;
                case 'categoryLabels':
                    dataLabelUtils.enumerateCategoryLabels(enumeration, dataLabelsSettings, false /* withFill */, true /* isShowCategory */);
                    break;
            }

            return enumeration.complete();
        }

        private enumerateDataPoints(enumeration: ObjectEnumerationBuilder, data: TreemapData): void {
            let rootChildren = data.root.children;
            if (_.isEmpty(rootChildren))
                return;

            for (let y = 0; y < rootChildren.length; y++) {
                let treemapNode = <TreemapNode>rootChildren[y];
                enumeration.pushInstance({
                    displayName: treemapNode.name,
                    selector: ColorHelper.normalizeSelector(treemapNode.identity.getSelector()),
                    properties: {
                        fill: { solid: { color: treemapNode.color } }
                    },
                    objectName: 'dataPoint'
                });
            }
        }

        private enumerateLegend(data: TreemapData): VisualObjectInstance[] {
            let legendObjectProperties: DataViewObjects = { legend: data.legendObjectProperties };

            let show = DataViewObjects.getValue(legendObjectProperties, treemapProps.legend.show, this.legend.isVisible());
            let showTitle = DataViewObjects.getValue(legendObjectProperties, treemapProps.legend.showTitle, true);
            let titleText = DataViewObjects.getValue(legendObjectProperties, treemapProps.legend.titleText, this.data.legendData.title);
            let labelColor = DataViewObject.getValue(legendObjectProperties, legendProps.labelColor, this.data.legendData ? this.data.legendData.labelColor : LegendData.DefaultLegendLabelFillColor);
            let labelFontSize = DataViewObject.getValue(legendObjectProperties, legendProps.fontSize, this.data.legendData && this.data.legendData.fontSize ? this.data.legendData.fontSize : SVGLegend.DefaultFontSizeInPt);

            return [{
                selector: null,
                objectName: 'legend',
                properties: {
                    show: show,
                    position: LegendPosition[this.legend.getOrientation()],
                    showTitle: showTitle,
                    titleText: titleText,
                    labelColor: labelColor,
                    fontSize: labelFontSize,
                }
            }];
        }

        public static checkValueForShape(value: any, cullableValue: number, allValuesAreNegative: boolean, dataWasCulled: boolean): ValueShape {
            let shouldCullValue = undefined;
            if (!value) {
                return {
                    validShape: false, 
                    dataWasCulled: dataWasCulled,
                };
            }
            else {
                if (!allValuesAreNegative)
                    shouldCullValue = value < cullableValue;
                else
                    shouldCullValue = Math.abs(value) < cullableValue;

                if (shouldCullValue) {
                    dataWasCulled = dataWasCulled || shouldCullValue;
                    return {
                        validShape: false,
                        dataWasCulled: dataWasCulled,
                    };
                }
                return {
                    validShape: true,
                    dataWasCulled: dataWasCulled,
                };
            }
        }

        private calculateTreemapSize(): IViewport {
            let legendMargins = this.legend.getMargins();
            return {
                height: this.currentViewport.height - legendMargins.height,
                width: this.currentViewport.width - legendMargins.width
            };
        }

        private initViewportDependantProperties(duration: number = 0): void {

            let viewport = this.calculateTreemapSize();

            this.svg.attr({
                width: viewport.width,
                height: viewport.height
            });
            Legend.positionChartArea(this.svg, this.legend);

            SVGUtil.flushAllD3TransitionsIfNeeded(this.options);
        }

        private static hasChildrenWithIdentity(node: D3.Layout.GraphNode): boolean {
            let children = node.children;
            if (!children)
                return false;

            let count = children.length;
            if (count === 0)
                return false;

            for (let i = count - 1; i >= 0; i--) {
                if ((<TreemapNode>children[i]).identity.hasIdentity())
                    return true;
            }

            return false;
        }

        private static canDisplayMajorLabel(node: TreemapNode): boolean {
            // Only display major labels for level 1
            if (node.depth !== 1)
                return false;

            if (_.isEmpty(node.name))
                return false;

            // Check if the room is enough for text with or without ellipse
            let availableWidth = node.dx - Treemap.TextMargin * 2;
            if (availableWidth < Treemap.MinTextWidthForMajorLabel)
                return false;
            
            // Check if the shape is high enough for label
            let textHeightWithMargin = Treemap.MajorLabelTextSize + Treemap.TextMargin * 2;
            if (node.dy < textHeightWithMargin)
                return false;

            return true;
        }

        private static canDisplayMinorLabel(node: TreemapNode, labelSettings: VisualDataLabelsSettings): boolean {
            // Only display minor labels for level 1 and 2
            if (node.depth < 1 || node.depth > 2)
                return false;

            // If a depth 1 node has children or is not showing data labels, do not show minor labels
            if (node.depth === 1 && (node.children || !labelSettings.show)) {
                return false;
            }

            if (_.isEmpty(node.name))
                return false;
            
            // Check if the room is enough for text with or without ellipse
            let availableWidth = node.dx - Treemap.TextMargin * 2;
            if (availableWidth < Treemap.MinTextWidthForMinorLabel)
                return false;
            
            // Check if the shape is high enough for label
            let textHeightWithMargin = Treemap.MinorLabelTextSize + Treemap.TextMargin * 2;
            if (node.dy < textHeightWithMargin)
                return false;
            if (node.depth === 1) {
                let roomTop = node.y + Treemap.MajorLabelTextSize + Treemap.TextMargin * 2;
                if (node.y + node.dy - roomTop < textHeightWithMargin)
                    return false;
            }
            else if (node.depth === 2) {
                let parent = node.parent;
                let roomTop = Math.max(parent.y + Treemap.MajorLabelTextSize + Treemap.TextMargin * 2, node.y);

                // Parent's label needs the room
                if (node.y + node.dy - roomTop < textHeightWithMargin)
                    return false;
            }

            return true;
        }

        private static createMajorLabelText(node: TreemapNode, labelsSettings: VisualDataLabelsSettings, alternativeScale: number, formattersCache: IColumnFormatterCacheManager): string {
            let spaceAvaliableForLabels = node.dx - Treemap.TextMargin * 2;
            let baseTextProperties = Treemap.MajorLabelTextProperties;
            let textProperties: powerbi.TextProperties = {
                text: node.name,
                fontFamily: baseTextProperties.fontFamily,
                fontSize: baseTextProperties.fontSize
            };

            return TextMeasurementService.getTailoredTextOrDefault(textProperties, spaceAvaliableForLabels);
        }

        private static createMinorLabelText(node: TreemapNode, labelsSettings: VisualDataLabelsSettings, alternativeScale: number, formattersCache: IColumnFormatterCacheManager): string {
            let spaceAvaliableForLabels = node.dx - Treemap.TextMargin * 2;
            let label = node.name;
            if (labelsSettings.show) {
                let measureFormatter = formattersCache.getOrCreate(node.labelFormatString, labelsSettings, alternativeScale);
                // Create measure label
                label = dataLabelUtils.getLabelFormattedText({
                    label: node.originalHighlightValue != null ? node.originalHighlightValue : node.originalValue, maxWidth:
                    spaceAvaliableForLabels, formatter: measureFormatter
                });
                // Add category if needed (we're showing category and the node depth is 2)
                if (labelsSettings.showCategory && node.depth === 2)
                    label = dataLabelUtils.getLabelFormattedText({
                        label: node.name,
                        maxWidth: spaceAvaliableForLabels
                    }) + " " + label;
            }

            return dataLabelUtils.getLabelFormattedText({
                label: label,
                maxWidth: spaceAvaliableForLabels,
                fontSize: labelsSettings.fontSize
            });
        }

        public static getFill(d: TreemapNode, isHighlightRect: boolean): string {
            // NOTE: only painted shapes will catch click event. We either paint children or their parent but not both.

            // If it's a leaf with no category, parent will be painted instead (and support interactivity)
            if (d.depth > 1 && !d.identity.hasIdentity() && !isHighlightRect)
                return CssConstants.noneValue;

            // If it's not a leaf and it has children with a category, children will be painted
            if (Treemap.hasChildrenWithIdentity(d))
                return CssConstants.noneValue;

            return d.color;
        }

        public static getFillOpacity(d: TreemapNode, hasSelection: boolean, hasHighlights: boolean, isHighlightRect: boolean): string {
            if (hasHighlights) {
                if (isHighlightRect)
                    return null;
                return Treemap.DimmedShapeOpacity.toString();
            }

            if (!hasSelection || d.selected)
                return null;

            // Parent node is selected (as an optimization, we only check below level 1 because root node cannot be selected anyway)
            if (d.depth > 1 && (<TreemapNode>d.parent).selected)
                return null;

            // It's a parent node with interactive children, fall back to default opacity
            if (Treemap.hasChildrenWithIdentity(d))
                return null;

            return Treemap.DimmedShapeOpacity.toString();
        }

        private updateInternal(suppressAnimations: boolean): void {
            let data = this.data;
            let hasHighlights = data && data.hasHighlights;
            let labelSettings = data ? data.dataLabelsSettings : null;
            let duration = AnimatorCommon.GetAnimationDuration(this.animator, suppressAnimations);

            if (!(this.options.interactivity && this.options.interactivity.isInteractiveLegend) && this.data) {
                this.renderLegend();
            }

            this.initViewportDependantProperties(duration);
            let viewport = this.calculateTreemapSize();

            this.treemap.size([viewport.width, viewport.height]);

            // Shapes are drawn for all nodes
            let nodes = (data && data.root) ? this.treemap.nodes(data.root) : [];
            // Highlight shapes are drawn only for nodes with non-null/undefed highlightMultipliers that have no children
            let highlightNodes = nodes.filter((value: TreemapNode) => value.highlightMultiplier != null && (!value.children || value.children.length === 0));
            let majorLabeledNodes = [];
            let minorLabeledNodes = [];
            let alternativeScale: number = null;

            // Only populate major labels if category labels are turned on
            if (labelSettings.showCategory) {
                majorLabeledNodes = nodes.filter((d: TreemapNode) => Treemap.canDisplayMajorLabel(d));
            }

            // Only populate minor labels if category or data labels are turned on
            if (labelSettings.show || labelSettings.showCategory) {
                minorLabeledNodes = nodes.filter((d: TreemapNode) => Treemap.canDisplayMinorLabel(d, labelSettings));

                // If the display unit is 0 we calculate the format scale using the maximum value available
                if (labelSettings.displayUnits === 0)
                    alternativeScale = <number>d3.max(minorLabeledNodes, (d: TreemapNode) => Math.abs(d.value));
            }

            let treemapLayout = Treemap.getLayout(labelSettings, alternativeScale);
            let shapes: D3.UpdateSelection;
            let highlightShapes: D3.UpdateSelection;
            let majorLabels: D3.UpdateSelection;
            let minorLabels: D3.UpdateSelection;
            let result: TreemapAnimationResult;
            if (this.animator && !suppressAnimations) {
                let options: TreemapAnimationOptions = {
                    viewModel: data,
                    nodes: nodes,
                    highlightNodes: highlightNodes,
                    majorLabeledNodes: majorLabeledNodes,
                    minorLabeledNodes: minorLabeledNodes,
                    shapeGraphicsContext: this.shapeGraphicsContext,
                    labelGraphicsContext: this.labelGraphicsContext,
                    interactivityService: this.interactivityService,
                    layout: treemapLayout,
                    labelSettings: labelSettings,
                };
                result = this.animator.animate(options);
                shapes = result.shapes;
                highlightShapes = result.highlightShapes;
                majorLabels = result.majorLabels;
                minorLabels = result.minorLabels;
            }
            if (!this.animator || suppressAnimations || result.failed) {
                let hasSelection = this.interactivityService && this.interactivityService.hasSelection();
                let shapeGraphicsContext = this.shapeGraphicsContext;
                shapes = Treemap.drawDefaultShapes(shapeGraphicsContext, nodes, hasSelection, hasHighlights, treemapLayout);
                highlightShapes = Treemap.drawDefaultHighlightShapes(shapeGraphicsContext, highlightNodes, hasSelection, hasHighlights, treemapLayout);
                let labelGraphicsContext = this.labelGraphicsContext;
                majorLabels = Treemap.drawDefaultMajorLabels(labelGraphicsContext, majorLabeledNodes, labelSettings, treemapLayout);
                minorLabels = Treemap.drawDefaultMinorLabels(labelGraphicsContext, minorLabeledNodes, labelSettings, treemapLayout);
            }

            if (this.interactivityService) {
                let behaviorOptions: TreemapBehaviorOptions = {
                    shapes: shapes,
                    highlightShapes: highlightShapes,
                    majorLabels: majorLabels,
                    minorLabels: minorLabels,
                    nodes: <TreemapNode[]>nodes,
                    hasHighlights: data.hasHighlights,
                };

                this.interactivityService.bind(<TreemapNode[]>nodes, this.behavior, behaviorOptions);
            }

            if (this.tooltipsEnabled) {
                TooltipManager.addTooltip(shapes, (tooltipEvent: TooltipEvent) => tooltipEvent.data.highlightedTooltipInfo ? tooltipEvent.data.highlightedTooltipInfo : tooltipEvent.data.tooltipInfo);
                TooltipManager.addTooltip(highlightShapes, (tooltipEvent: TooltipEvent) => tooltipEvent.data.highlightedTooltipInfo);
            }

            SVGUtil.flushAllD3TransitionsIfNeeded(this.options);
        }

        private renderLegend(): void {
            let legendObjectProperties = this.data.legendObjectProperties;
            if (legendObjectProperties) {
                let legendData = this.data.legendData;
                LegendData.update(legendData, legendObjectProperties);
                let position = <string>legendObjectProperties[legendProps.position];
                if (position)
                    this.legend.changeOrientation(LegendPosition[position]);

                this.legend.drawLegend(legendData, this.currentViewport);
            } else {
                // TODO: Draw should be the only API. Visuals should only call that with orientation, props, etc 
                // instead of managing state. Will follow up with another change.
                this.legend.changeOrientation(LegendPosition.Top);
                this.legend.drawLegend({ dataPoints: [] }, this.currentViewport);
            }
        }

        private static getNodeClass(d: TreemapNode, highlight?: boolean): string {
            let nodeClass: string;
            switch (d.depth) {
                case 1:
                    nodeClass = Treemap.ParentGroupClassName;
                    break;
                case 2:
                    nodeClass = Treemap.NodeGroupClassName;
                    break;
                case 0:
                    nodeClass = Treemap.RootNodeClassName;
                    break;
                default:
                    debug.assertFail('Treemap only supports 2 levels maxiumum');
            }
            nodeClass += " " + (highlight ? Treemap.HighlightNodeClassName : Treemap.TreemapNodeClassName);
            return nodeClass;
        }

        private static createTreemapShapeLayout(isHighlightRect = false) {
            return {
                x: (d: TreemapNode) => d.x,
                y: (d: TreemapNode) => d.y + (isHighlightRect ? d.dy * (1 - d.highlightMultiplier) : 0),
                width: (d: TreemapNode) => Math.max(0, d.dx),
                height: (d: TreemapNode) => Math.max(0, d.dy * (isHighlightRect ? d.highlightMultiplier : 1)),
            };
        }

        private static createTreemapZeroShapeLayout() {
            return {
                x: (d: TreemapNode) => d.x,
                y: (d: TreemapNode) => d.y + d.dy,
                width: (d: TreemapNode) => Math.max(0, d.dx),
                height: (d: TreemapNode) => 0,
            };
        }

        public static drawDefaultShapes(context: D3.Selection, nodes: D3.Layout.GraphNode[], hasSelection: boolean, hasHighlights: boolean, layout: ITreemapLayout): D3.UpdateSelection {
            let isHighlightShape = false;
            let shapes = context.selectAll('.' + Treemap.TreemapNodeClassName)
                .data(nodes, (d: TreemapNode) => d.key);

            shapes.enter().append('rect')
                .attr('class', layout.shapeClass);

            shapes
                .style("fill", (d: TreemapNode) => Treemap.getFill(d, isHighlightShape))
                .style("fill-opacity", (d: TreemapNode) => Treemap.getFillOpacity(d, hasSelection, hasHighlights, isHighlightShape))
                .attr(layout.shapeLayout);

            shapes.exit().remove();

            return shapes;
        }

        public static drawDefaultHighlightShapes(context: D3.Selection, nodes: D3.Layout.GraphNode[], hasSelection: boolean, hasHighlights: boolean, layout: ITreemapLayout): D3.UpdateSelection {
            let isHighlightShape = true;
            let highlightShapes = context.selectAll('.' + Treemap.HighlightNodeClassName)
                .data(nodes, (d) => d.key + "highlight");

            highlightShapes.enter().append('rect')
                .attr('class', layout.highlightShapeClass);

            highlightShapes
                .style("fill", (d: TreemapNode) => Treemap.getFill(d, isHighlightShape))
                .style("fill-opacity", (d: TreemapNode) => Treemap.getFillOpacity(d, hasSelection, hasHighlights, isHighlightShape))
                .attr(layout.highlightShapeLayout);

            highlightShapes.exit().remove();
            return highlightShapes;
        }

        public static drawDefaultMajorLabels(context: D3.Selection, nodes: D3.Layout.GraphNode[], labelSettings: VisualDataLabelsSettings, layout: ITreemapLayout): D3.UpdateSelection {
            let labels = context
                .selectAll('.' + Treemap.MajorLabelClassName)
                .data(nodes, (d: TreemapNode) => d.key);

            labels.enter().append('text')
                .attr('class', layout.majorLabelClass);

            labels
                .attr(layout.majorLabelLayout)
                .text(layout.majorLabelText)
                .style('fill', () => labelSettings.labelColor);

            labels.exit().remove();

            return labels;
        }

        public static drawDefaultMinorLabels(context: D3.Selection, nodes: D3.Layout.GraphNode[], labelSettings: VisualDataLabelsSettings, layout: ITreemapLayout): D3.UpdateSelection {
            let labels = context
                .selectAll('.' + Treemap.MinorLabelClassName)
                .data(nodes, (d: TreemapNode) => d.key);

            labels.enter().append('text')
                .attr('class', layout.minorLabelClass);

            labels
                .attr(layout.minorLabelLayout)
                .text(layout.minorLabelText)
                .style('fill', () => labelSettings.labelColor);

            labels.exit().remove();

            return labels;
        }

        public static cleanMinorLabels(context: D3.Selection) {
            let empty = [];
            let labels = context
                .selectAll('.' + Treemap.LabelsGroupClassName)
                .selectAll('.' + Treemap.MinorLabelClassName)
                .data(empty);
            labels.exit().remove();
        }
    }
}