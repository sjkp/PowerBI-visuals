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
    import Color = jsCommon.Color;
    import PixelConverter = jsCommon.PixelConverter;
    import Polygon = shapes.Polygon;
    import DataRoleHelper = powerbi.data.DataRoleHelper;

    export interface MapConstructionOptions {
        filledMap?: boolean;
        geocoder?: IGeocoder;
        mapControlFactory?: IMapControlFactory;
        behavior?: MapBehavior;
        tooltipsEnabled?: boolean;
        tooltipBucketEnabled?: boolean;
        filledMapDataLabelsEnabled?: boolean;
        disableZooming?: boolean;
        disablePanning?: boolean;
        isLegendScrollable?: boolean;
        viewChangeThrottleInterval?: number; // Minimum interval between viewChange events (in milliseconds)
        enableCurrentLocation?: boolean;
    }

    export interface IMapControlFactory {
        createMapControl(element: HTMLElement, options?: Microsoft.Maps.MapOptions): Microsoft.Maps.Map;
        ensureMap(locale: string, action: () => void): void;
    }

    export interface MapData {
        dataPoints: MapDataPoint[];
        geocodingCategory: string;
        hasDynamicSeries: boolean;
        hasSize: boolean;
    }

    /**
     * The main map data point, which exists for each category
     */
    export interface MapDataPoint {
        geocodingQuery: string;
        value: number;
        categoryValue: string;
        subDataPoints: MapSubDataPoint[];
        location?: IGeocodeCoordinate;
        paths?: IGeocodeBoundaryPolygon[];
        radius?: number;
    }

    /**
     * SubDataPoint that carries series-based data.  For category only maps
     * there will only be one of these on each MapDataPoint; for dynamic series,
     * there will be one per series for each MapDataPoint.
     */
    export interface MapSubDataPoint {
        value: number;
        fill: string;
        stroke: string;
        identity: SelectionId;
        tooltipInfo: TooltipDataItem[];
    }

    export interface MapRendererData {
        bubbleData?: MapBubble[];
        sliceData?: MapSlice[][];
        shapeData?: MapShape[];
    }

    export interface MapVisualDataPoint extends TooltipEnabledDataPoint, SelectableDataPoint {
        x: number;
        y: number;
        radius: number;
        fill: string;
        stroke: string;
        strokeWidth: number;
        labeltext: string;
        labelFill: string;
    }

    export interface MapBubble extends MapVisualDataPoint {
    }

    export interface MapSlice extends MapVisualDataPoint {
        value: number;
        startAngle?: number;
        endAngle?: number;
    }

    export interface MapShape extends TooltipEnabledDataPoint, SelectableDataPoint {
        absolutePointArray: Float64Array;
        path: string;
        fill: string;
        stroke: string;
        strokeWidth: number;
        key: string;
        labeltext: string;
        displayLabel: boolean;
        catagoryLabeltext?: string;
        labelFormatString: string;
    }

    /**
     * Used because data points used in D3 pie layouts are placed within a container with pie information.
     */
    export interface MapSliceContainer {
        data: MapSlice;
    }

    /** Note: public for UnitTest */
    export interface IMapDataPointRenderer {
        init(mapControl: Microsoft.Maps.Map, mapDiv: JQuery, addClearCatcher: boolean): void;
        setData(data: MapData): void;
        getDataPointCount(): number;
        converter(viewPort: IViewport, dataView: DataView, labelSettings: PointDataLabelsSettings, interactivityService: IInteractivityService, tooltipsEnabled: boolean): MapRendererData;
        updateInternal(data: MapRendererData, viewport: IViewport, dataChanged: boolean, interactivityService: IInteractivityService, redrawDataLabels: boolean): MapBehaviorOptions;
        updateInternalDataLabels(viewport: IViewport, redrawDataLabels: boolean): void;
        getDataPointPadding(): number;
        clearDataPoints(): void;
    }

    export interface DataViewMetadataAutoGeneratedColumn extends DataViewMetadataColumn {
        /**
         * Indicates that the column was added manually.
         */
        isAutoGeneratedColumn?: boolean;
    }

    export const MaxLevelOfDetail = 23;
    export const MinLevelOfDetail = 1;
    export const DefaultFillOpacity = 0.5;
    export const DefaultBackgroundColor = "#000000";
    export const LeaderLineColor = "#000000";

    export class MapBubbleDataPointRenderer implements IMapDataPointRenderer {
        private mapControl: Microsoft.Maps.Map;
        private mapData: MapData;
        private maxDataPointRadius: number;
        private svg: D3.Selection;
        private clearSvg: D3.Selection;
        private clearCatcher: D3.Selection;
        private bubbleGraphicsContext: D3.Selection;
        private sliceGraphicsContext: D3.Selection;
        private labelGraphicsContext: D3.Selection;
        private labelBackgroundGraphicsContext: D3.Selection;
        private sliceLayout: D3.Layout.PieLayout;
        private arc: D3.Svg.Arc;
        private dataLabelsSettings: PointDataLabelsSettings;
        private tooltipsEnabled: boolean;
        private static validLabelPositions: NewPointLabelPosition[] = [NewPointLabelPosition.Above, NewPointLabelPosition.Below, NewPointLabelPosition.Left, NewPointLabelPosition.Right];
        private mapRendererData: MapRendererData;
        private root: JQuery;

        public constructor(tooltipsEnabled: boolean) {
            this.tooltipsEnabled = tooltipsEnabled;
        }

        public init(mapControl: Microsoft.Maps.Map, mapDiv: JQuery, addClearCatcher: boolean): void {
            /*
                The layout of the visual would look like :
                <div class="visual mapControl">
                    <div class="MicrosoftMap">
                        <!-- Bing maps stuff -->
                        <svg>
                            <rect class="clearCatcher"></rect>
                        </svg>
                    </div>
                    <svg>
                        <g class="mapBubbles>
                            <!-- our geometry -->
                        </g>
                        <g class="mapSlices>
                            <!-- our geometry -->
                        </g>
                    </svg>
                </div>

            */

            this.mapControl = mapControl;
            this.root = mapDiv;
            let root = d3.select(mapDiv[0]);
            root.attr("drag-resize-disabled", "true"); // Enable panning within the maps in IE
            let svg = this.svg = root
                .append('svg')
                .style("position", "absolute") // Absolute position so that the svg will overlap with the canvas.
                .style("pointer-events", "none");
            if (addClearCatcher) {
                let clearSvg = this.clearSvg = d3.select(<HTMLElement>this.mapControl.getRootElement())
                    .append('svg')
                    .style('position', 'absolute'); // Absolute position so that the svg will overlap with the canvas.
                this.clearCatcher = appendClearCatcher(clearSvg);
            }
            this.bubbleGraphicsContext = svg
                .append("g")
                .classed("mapBubbles", true);
            this.sliceGraphicsContext = svg
                .append("g")
                .classed("mapSlices", true);
            this.labelBackgroundGraphicsContext = svg
                .append("g")
                .classed(NewDataLabelUtils.labelBackgroundGraphicsContextClass.class, true);
            this.labelGraphicsContext = svg
                .append("g")
                .classed(NewDataLabelUtils.labelGraphicsContextClass.class, true);
            this.sliceLayout = d3.layout.pie()
                .sort(null)
                .value((d: MapSlice) => {
                    return d.value;
                });
            this.arc = d3.svg.arc();
            this.clearMaxDataPointRadius();
            this.dataLabelsSettings = dataLabelUtils.getDefaultMapLabelSettings();
        }

        public setData(data: MapData): void {
            this.mapData = data;
        }

        public clearDataPoints(): void {
            this.mapData = {
                dataPoints: [],
                geocodingCategory: null,
                hasDynamicSeries: false,
                hasSize: false,
            };
        }

        public getDataPointCount(): number {
            if (!this.mapData)
                return 0;
            // Filter out any data points without a location since those aren't actually being drawn
            return _.filter(this.mapData.dataPoints, (value: MapDataPoint) => !!value.location).length;
        }

        public getDataPointPadding(): number {
            return this.maxDataPointRadius * 2;
        }

        private clearMaxDataPointRadius(): void {
            this.maxDataPointRadius = 0;
        }

        private setMaxDataPointRadius(dataPointRadius: number): void {
            this.maxDataPointRadius = Math.max(dataPointRadius, this.maxDataPointRadius);
        }

        public getDefaultMap(geocodingCategory: string, dataPointCount: number): void {
            this.clearDataPoints();
        }

        public converter(viewport: IViewport, dataView: DataView, labelSettings: PointDataLabelsSettings, interactivityService: IInteractivityService, tooltipsEnabled: boolean = true): MapRendererData {
            let mapControl = this.mapControl;
            let widthOverTwo = viewport.width / 2;
            let heightOverTwo = viewport.height / 2;

            let strokeWidth = 1;

            //update data label settings
            this.dataLabelsSettings = labelSettings;

            // See MapSeriesPresenter::GetDataPointRadius for the PV behavior
            let radiusScale = Math.min(viewport.width, viewport.height) / 384;
            this.clearMaxDataPointRadius();

            let bubbleData: MapBubble[] = [];
            let sliceData: MapSlice[][] = [];
            let categorical: DataViewCategorical = dataView ? dataView.categorical : null;

            let grouped: DataViewValueColumnGroup[];
            let sizeIndex = -1;
            let dataValuesSource: DataViewMetadataColumn;
            if (categorical && categorical.values) {
                grouped = categorical.values.grouped();
                sizeIndex = DataRoleHelper.getMeasureIndexOfRole(grouped, "Size");
                dataValuesSource = categorical.values.source;
            }

            let dataPoints = this.mapData ? this.mapData.dataPoints : [];
            let hasSize = this.mapData.hasSize;
            for (let categoryIndex = 0, categoryCount = dataPoints.length; categoryIndex < categoryCount; categoryIndex++) {
                let dataPoint = dataPoints[categoryIndex];
                let categoryValue = dataPoint.categoryValue;
                let location = dataPoint.location;

                if (location) {
                    let xy = mapControl.tryLocationToPixel(new Microsoft.Maps.Location(location.latitude, location.longitude));
                    let x = xy.x + widthOverTwo;
                    let y = xy.y + heightOverTwo;

                    let radius = dataPoint.radius * radiusScale;
                    this.setMaxDataPointRadius(radius);
                    let subDataPoints = dataPoint.subDataPoints;

                    let seriesCount = subDataPoints.length;
                    if (seriesCount === 1) {
                        let subDataPoint: MapSubDataPoint = subDataPoints[0];

                        bubbleData.push({
                            x: x,
                            y: y,
                            labeltext: categoryValue,
                            radius: radius,
                            fill: subDataPoint.fill,
                            stroke: subDataPoint.stroke,
                            strokeWidth: strokeWidth,
                            tooltipInfo: subDataPoint.tooltipInfo,
                            identity: subDataPoint.identity,
                            selected: false,
                            labelFill: labelSettings.labelColor,
                        });
                    }
                    else {
                        let slices = [];

                        for (var seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
                            let subDataPoint: MapSubDataPoint = subDataPoints[seriesIndex];
                            let value = hasSize ? subDataPoint.value : 1; // Normalize values if there is no size in the data

                            slices.push({
                                x: x,
                                y: y,
                                labeltext: categoryValue,
                                radius: radius,
                                fill: subDataPoint.fill,
                                stroke: subDataPoint.stroke,
                                strokeWidth: strokeWidth,
                                value: value,
                                tooltipInfo: subDataPoint.tooltipInfo,
                                identity: subDataPoint.identity,
                                selected: false,
                                labelFill: labelSettings.labelColor,
                            });
                        }
                        if (interactivityService) {
                            interactivityService.applySelectionStateToData(slices);
                        }
                        sliceData.push(slices);
                    }
                }
            }

            if (interactivityService) {
                interactivityService.applySelectionStateToData(bubbleData);
            }

            return { bubbleData: bubbleData, sliceData: sliceData };
        }

        public updateInternal(data: MapRendererData, viewport: IViewport, dataChanged: boolean, interactivityService: IInteractivityService, redrawDataLabels: boolean): MapBehaviorOptions {
            debug.assertValue(viewport, "viewport");
            Map.removeTransform3d(this.root);

            this.mapRendererData = data;
            if (this.svg) {
                this.svg
                    .style("width", viewport.width.toString() + "px")
                    .style("height", viewport.height.toString() + "px");
            }
            if (this.clearSvg) {
                this.clearSvg
                    .style("width", viewport.width.toString() + "px")
                    .style("height", viewport.height.toString() + "px");
            }

            let arc = this.arc;

            let hasSelection = interactivityService && interactivityService.hasSelection();

            let bubbles = this.bubbleGraphicsContext.selectAll(".bubble").data(data.bubbleData, (d: MapBubble) => d.identity.getKey());

            bubbles.enter()
                .append("circle")
                .classed("bubble", true);
            bubbles
                .attr("cx", (d: MapBubble) => d.x)
                .attr("cy", (d: MapBubble) => d.y)
                .attr("r", (d: MapBubble) => d.radius)
                .style("fill", (d: MapBubble) => d.fill)
                .style("stroke", (d: MapBubble) => d.stroke)
                .style("fill-opacity", (d: MapBubble) => ColumnUtil.getFillOpacity(d.selected, false, hasSelection, false))
                .style("strokeWidth", (d: MapBubble) => d.strokeWidth)
                .style("stroke-opacity", (d: MapBubble) => ColumnUtil.getFillOpacity(d.selected, false, hasSelection, false))
                .style("cursor", "default");
            bubbles.exit().remove();

            if (this.tooltipsEnabled) {
                TooltipManager.addTooltip(this.bubbleGraphicsContext, (tooltipEvent: TooltipEvent) => tooltipEvent.data.tooltipInfo);
                bubbles.style("pointer-events", "all");
            }

            let sliceData = data.sliceData;

            let sliceContainers = this.sliceGraphicsContext.selectAll(".sliceContainer").data(sliceData);
            sliceContainers.enter()
                .append("g")
                .classed("sliceContainer", true);

            sliceContainers.exit().remove();

            let sliceLayout = this.sliceLayout;
            let slices = sliceContainers.selectAll(".slice")
                .data(function (d) {
                    return sliceLayout(d);
                }, (d: MapSliceContainer) => d.data.identity.getKey());

            slices.enter()
                .append("path")
                .classed("slice", true);

            slices
                .style("fill", (t: MapSliceContainer) => t.data.fill)
                .style("fill-opacity", (d) => ColumnUtil.getFillOpacity(d.data.selected, false, hasSelection, false))
                .style("stroke", (t: MapSliceContainer) => t.data.stroke)
                .style("strokeWidth", (t: MapSliceContainer) => t.data.strokeWidth)
                .style("stroke-opacity", (d) => ColumnUtil.getFillOpacity(d.data.selected, false, hasSelection, false))
                .style("cursor", "default")
                .attr("transform", (t: MapSliceContainer) => SVGUtil.translate(t.data.x, t.data.y))
                .attr('d', (t: MapSliceContainer) => {
                    return arc.innerRadius(0).outerRadius((t: MapSliceContainer) => t.data.radius)(t);
                });

            slices.exit().remove();

            this.updateInternalDataLabels(viewport, redrawDataLabels);

            if (this.tooltipsEnabled) {
                TooltipManager.addTooltip(this.sliceGraphicsContext, (tooltipEvent: TooltipEvent) => tooltipEvent.data.data.tooltipInfo);
                slices.style("pointer-events", "all");
            }

            let allData: SelectableDataPoint[] = data.bubbleData.slice();
            for (let i = 0, ilen = sliceData.length; i < ilen; i++) {
                allData.push.apply(allData, sliceData[i]);
            }

            let behaviorOptions: MapBehaviorOptions = {
                bubbleEventGroup: this.bubbleGraphicsContext,
                sliceEventGroup: this.sliceGraphicsContext,
                bubbles: bubbles,
                slices: slices,
                clearCatcher: this.clearCatcher,
                dataPoints: allData,
            };
            return behaviorOptions;
        }

        public updateInternalDataLabels(viewport: IViewport, redrawDataLabels: boolean): void {
            let labelSettings = this.dataLabelsSettings;
            let dataLabels: Label[] = [];
            if (labelSettings && (labelSettings.show || labelSettings.showCategory)) {
                let labelDataPoints = this.createLabelDataPoints();
                let labelLayout = new LabelLayout({
                    maximumOffset: NewDataLabelUtils.maxLabelOffset,
                    startingOffset: NewDataLabelUtils.startingLabelOffset
                });
                let labelDataPointsGroup: LabelDataPointGroup = {
                    labelDataPoints: labelDataPoints,
                    maxNumberOfLabels: labelDataPoints.length
                };
                dataLabels = labelLayout.layout([labelDataPointsGroup], { width: viewport.width, height: viewport.height });
            }

            NewDataLabelUtils.drawLabelBackground(this.labelGraphicsContext, dataLabels, powerbi.visuals.DefaultBackgroundColor, powerbi.visuals.DefaultFillOpacity);
            NewDataLabelUtils.drawDefaultLabels(this.labelGraphicsContext, dataLabels, false); // Once we properly split up and handle show and showCategory, the false here should change to !labelSettings.showCategory
        }

        private createLabelDataPoints(): LabelDataPoint[] {
            let data = this.mapRendererData;
            let labelDataPoints: LabelDataPoint[] = [];
            let dataPoints = data.bubbleData;
            dataPoints = dataPoints.concat(_.map(data.sliceData, (value: MapSlice[]) => value[0]));
            let labelSettings = this.dataLabelsSettings;

            for (let dataPoint of dataPoints) {
                debug.assertValue(dataPoint, 'dataPoint should never be null/undefined');
                let text = dataPoint.labeltext;

                let properties: TextProperties = {
                    text: text,
                    fontFamily: NewDataLabelUtils.LabelTextProperties.fontFamily,
                    fontSize: PixelConverter.fromPoint(labelSettings.fontSize),
                    fontWeight: NewDataLabelUtils.LabelTextProperties.fontWeight,
                };
                let textWidth = TextMeasurementService.measureSvgTextWidth(properties);
                let textHeight = TextMeasurementService.estimateSvgTextHeight(properties);

                labelDataPoints.push({
                    isPreferred: true,
                    text: text,
                    textSize: {
                        width: textWidth,
                        height: textHeight,
                    },
                    outsideFill: labelSettings.labelColor ? labelSettings.labelColor : NewDataLabelUtils.defaultInsideLabelColor, // Use inside for outside colors because we draw backgrounds for map labels
                    insideFill: NewDataLabelUtils.defaultInsideLabelColor,
                    parentType: LabelDataPointParentType.Point,
                    parentShape: {
                        point: {
                            x: dataPoint.x,
                            y: dataPoint.y,
                        },
                        radius: dataPoint.radius,
                        validPositions: MapBubbleDataPointRenderer.validLabelPositions,
                    },
                    fontSize: labelSettings.fontSize,
                    identity: undefined,
                    hasBackground: true,
                });
            }

            return labelDataPoints;
        }
    }

    export interface FilledMapParams {
        level: number;
        maxPolygons: number;
        strokeWidth: number;
    }

    export class MapShapeDataPointRenderer implements IMapDataPointRenderer {
        private mapControl: Microsoft.Maps.Map;
        private svg: D3.Selection;
        private clearSvg: D3.Selection;
        private clearCatcher: D3.Selection;
        private polygonInfo: MapPolygonInfo;
        private mapData: MapData;
        private shapeGraphicsContext: D3.Selection;
        private labelGraphicsContext: D3.Selection;
        private labelBackgroundGraphicsContext: D3.Selection;
        private maxShapeDimension: number;
        private mapRendererData: MapRendererData;
        private dataLabelsSettings: PointDataLabelsSettings;
        private filledMapDataLabelsEnabled: boolean;
        private tooltipsEnabled: boolean;
        private labelLayout: FilledMapLabelLayout;
        private static validLabelPolygonPositions: NewPointLabelPosition[] = [NewPointLabelPosition.Center, NewPointLabelPosition.Below, NewPointLabelPosition.Above, NewPointLabelPosition.Right, NewPointLabelPosition.Left, NewPointLabelPosition.BelowRight, NewPointLabelPosition.BelowLeft, NewPointLabelPosition.AboveRight, NewPointLabelPosition.AboveLeft];
        private root: JQuery;

        public static getFilledMapParams(category: string, dataCount: number): FilledMapParams {
            switch (category) {
                case MapUtil.CategoryTypes.Continent:
                case MapUtil.CategoryTypes.CountryRegion:
                    if (dataCount < 10) {
                        return { level: 1, maxPolygons: 50, strokeWidth: 0 };
                    }
                    else if (dataCount < 30) {
                        return { level: 1, maxPolygons: 20, strokeWidth: 0 };
                    }
                    return { level: 1, maxPolygons: 5, strokeWidth: 0 };
                default:
                    if (dataCount < 100) {
                        return { level: 1, maxPolygons: 5, strokeWidth: 6 };
                    }
                    if (dataCount < 200) {
                        return { level: 0, maxPolygons: 5, strokeWidth: 6 };
                    }
                    return { level: 0, maxPolygons: 5, strokeWidth: 0 };
            }
        }

        public static buildPaths(locations: IGeocodeBoundaryPolygon[]): IGeocodeBoundaryPolygon[] {
            let paths = [];
            for (let i = 0; i < locations.length; i++) {
                let location = locations[i];
                let polygon = location.geographic;

                if (polygon.length > 2) {
                    paths.push(location);
                }
            }

            return paths;
        }

        public constructor(fillMapDataLabelsEnabled: boolean, tooltipsEnabled: boolean) {
            this.filledMapDataLabelsEnabled = fillMapDataLabelsEnabled;
            this.tooltipsEnabled = tooltipsEnabled;
        }

        public init(mapControl: Microsoft.Maps.Map, mapDiv: JQuery, addClearCatcher: boolean): void {
            /*
                The layout of the visual would look like :
                <div class="visual mapControl">
                    <div class="MicrosoftMap">
                        <!-- Bing maps stuff -->
                        <svg>
                            <rect class="clearCatcher"></rect>
                        </svg>
                    </div>
                    <svg>
                        <g class="mapShapes>
                            <!-- our geometry -->
                        </g>
                    </svg>
                </div>

            */

            this.mapControl = mapControl;
            this.polygonInfo = new MapPolygonInfo();

            this.root = mapDiv;
            let root = d3.select(mapDiv[0]);
            root.attr('drag-resize-disabled', 'true'); // Enable panning within the maps in IE
            let svg = this.svg = root
                .append('svg')
                .style('position', 'absolute') // Absolute position so that the svg will overlap with the canvas.
                .style("pointer-events", "none");
            if (addClearCatcher) {
                let clearSvg = this.clearSvg = d3.select(<HTMLElement>this.mapControl.getRootElement())
                    .append('svg')
                    .style('position', 'absolute'); // Absolute position so that the svg will overlap with the canvas.
                this.clearCatcher = appendClearCatcher(clearSvg);
            }
            this.shapeGraphicsContext = svg
                .append('g')
                .classed('mapShapes', true);
            this.labelBackgroundGraphicsContext = svg
                .append("g")
                .classed(NewDataLabelUtils.labelBackgroundGraphicsContextClass.class, true);
            this.labelGraphicsContext = svg
                .append("g")
                .classed(NewDataLabelUtils.labelGraphicsContextClass.class, true);

            this.clearMaxShapeDimension();
            this.dataLabelsSettings = dataLabelUtils.getDefaultMapLabelSettings();
        }

        public setData(data: MapData): void {
            this.mapData = data;
        }

        public clearDataPoints(): void {
            this.mapData = {
                dataPoints: [],
                geocodingCategory: null,
                hasDynamicSeries: false,
                hasSize: false,
            };
        }

        public getDataPointCount(): number {
            if (!this.mapData)
                return 0;
            // Filter out any data points without a location since those aren't actually being drawn
            return _.filter(this.mapData.dataPoints, (value: MapDataPoint) => !!value.paths).length;
        }

        public converter(viewport: IViewport, dataView: DataView, labelSettings: PointDataLabelsSettings, interactivityService?: IInteractivityService): MapRendererData {
            this.clearMaxShapeDimension();
            this.dataLabelsSettings = labelSettings;
            let strokeWidth = 1;

            let shapeData: MapShape[] = [];

            let dataPoints = this.mapData ? this.mapData.dataPoints : [];
            for (let categoryIndex = 0, categoryCount = dataPoints.length; categoryIndex < categoryCount; categoryIndex++) {
                let categorical: DataViewCategorical = dataView ? dataView.categorical : null;
                let dataPoint: MapDataPoint = dataPoints[categoryIndex];
                let subDataPoint = dataPoint.subDataPoints[0];
                let paths = dataPoint.paths;

                let grouped: DataViewValueColumnGroup[];
                let sizeIndex = -1;
                let dataValuesSource: DataViewMetadataColumn;

                if (categorical && categorical.values) {
                    grouped = categorical.values.grouped();
                    sizeIndex = DataRoleHelper.getMeasureIndexOfRole(grouped, "Size");
                    dataValuesSource = categorical.values.source;
                }

                if (paths) {
                    let value = dataPoint.value;
                    let categoryValue = dataPoint.categoryValue;

                    let identity = subDataPoint.identity;
                    let idKey = identity.getKey();
                    let formattersCache = NewDataLabelUtils.createColumnFormatterCacheManager();

                    //Determine Largest Shape
                    let mainShapeIndex = MapShapeDataPointRenderer.getIndexOfLargestShape(paths);

                    for (let pathIndex = 0, pathCount = paths.length; pathIndex < pathCount; pathIndex++) {
                        let path = paths[pathIndex];
                        let labelFormatString = (dataView && dataView.categorical && !_.isEmpty(dataView.categorical.values)) ? valueFormatter.getFormatString(dataView.categorical.values[0].source, filledMapProps.general.formatString) : undefined;
                        this.setMaxShapeDimension(path.absoluteBounds.width, path.absoluteBounds.height);
                        let formatter = formattersCache.getOrCreate(labelFormatString, labelSettings);

                        shapeData.push({
                            absolutePointArray: path.absolute,
                            path: path.absoluteString,
                            fill: subDataPoint.fill,
                            stroke: subDataPoint.stroke,
                            strokeWidth: strokeWidth,
                            tooltipInfo: subDataPoint.tooltipInfo,
                            identity: identity,
                            selected: false,
                            key: JSON.stringify({ id: idKey, pIdx: pathIndex }),
                            displayLabel: pathIndex === mainShapeIndex,
                            labeltext: categoryValue,
                            catagoryLabeltext: (value != null) ? NewDataLabelUtils.getLabelFormattedText(formatter.format(value)) : undefined,
                            labelFormatString: labelFormatString,
                        });
                    }
                }
            }

            if (interactivityService)
                interactivityService.applySelectionStateToData(shapeData);

            return { shapeData: shapeData };
        }

        public updateInternal(data: MapRendererData, viewport: IViewport, dataChanged: boolean, interactivityService: IInteractivityService, redrawDataLabels: boolean): MapBehaviorOptions {
            debug.assertValue(viewport, "viewport");
            Map.removeTransform3d(this.root);

            this.mapRendererData = data;
            if (this.svg) {
                this.svg
                    .style("width", viewport.width.toString() + "px")
                    .style("height", viewport.height.toString() + "px");
            }
            if (this.clearSvg) {
                this.clearSvg
                    .style("width", viewport.width.toString() + "px")
                    .style("height", viewport.height.toString() + "px");
            }

            this.polygonInfo.reCalc(this.mapControl, viewport.width, viewport.height);
            this.shapeGraphicsContext.attr("transform", this.polygonInfo.transformToString(this.polygonInfo.transform));

            let hasSelection = interactivityService && interactivityService.hasSelection();

            let shapes = this.shapeGraphicsContext.selectAll("polygon").data(data.shapeData, (d: MapShape) => d.key);

            shapes.enter()
                .append("polygon")
                .classed("shape", true)
                .attr("points", (d: MapShape) => { // Always add paths to any new data points
                    return d.path;
                });

            shapes
                .style("fill", (d: MapShape) => d.fill)
                .style("fill-opacity", (d: MapShape) => ColumnUtil.getFillOpacity(d.selected, false, hasSelection, false))
                .style("cursor", "default");

            if (dataChanged) {
                // We only update the paths of existing shapes if we have a change in the data.  Updating the lengthy path
                // strings every update during resize or zooming/panning is extremely bad for performance.
                shapes
                    .attr("points", (d: MapShape) => {
                        return d.path;
                    });
            }

            shapes.exit()
                .remove();

            this.updateInternalDataLabels(viewport, redrawDataLabels);

            if (this.tooltipsEnabled) {
                TooltipManager.addTooltip(this.shapeGraphicsContext, (tooltipEvent: TooltipEvent) => tooltipEvent.data.tooltipInfo);
                shapes.style("pointer-events", "all");
            }

            let behaviorOptions: MapBehaviorOptions = {
                shapeEventGroup: this.shapeGraphicsContext,
                shapes: shapes,
                clearCatcher: this.clearCatcher,
                dataPoints: data.shapeData,
            };

            return behaviorOptions;
        }

        public getDataPointPadding() {
            return 12;
        }

        public static getIndexOfLargestShape(paths: IGeocodeBoundaryPolygon[]): number {
            let largestShapeIndex = 0;
            let largestShapeArea = 0;

            for (let pathIndex = 0, pathCount = paths.length; pathIndex < pathCount; pathIndex++) {
                let path = paths[pathIndex];

                // Using the area of the polygon (and taking the largest)
                let polygon = new Polygon(path.absolute);
                let currentShapeArea = Math.abs(Polygon.calculateAbsolutePolygonArea(polygon.polygonPoints));

                if (currentShapeArea > largestShapeArea) {
                    largestShapeIndex = pathIndex;
                    largestShapeArea = currentShapeArea;
                }
            }

            return largestShapeIndex;
        }

        public updateInternalDataLabels(viewport: IViewport, redrawDataLabels: boolean): void {
            let labelSettings = this.dataLabelsSettings;
            let labels: Label[];

            if (labelSettings && (labelSettings.show || labelSettings.showCategory)) {
                let labelDataPoints = this.createLabelDataPoints();

                if (this.labelLayout === undefined) {
                    this.labelLayout = new FilledMapLabelLayout();
                }
                labels = this.labelLayout.layout(labelDataPoints, { width: viewport.width, height: viewport.height }, this.polygonInfo.transform, redrawDataLabels);
            }

            this.drawLabelStems(this.labelGraphicsContext, labels, labelSettings.show, labelSettings.showCategory);
            NewDataLabelUtils.drawLabelBackground(this.labelGraphicsContext, labels, powerbi.visuals.DefaultBackgroundColor, powerbi.visuals.DefaultFillOpacity);
            NewDataLabelUtils.drawDefaultLabels(this.labelGraphicsContext, labels, false, labelSettings.show && labelSettings.showCategory);
        }

        private clearMaxShapeDimension(): void {
            this.maxShapeDimension = 0;
        }

        private setMaxShapeDimension(width: number, height: number): void {
            this.maxShapeDimension = Math.max(width, this.maxShapeDimension);
            this.maxShapeDimension = Math.max(height, this.maxShapeDimension);
        }

        private createLabelDataPoints(): LabelDataPoint[] {
            let data = this.mapRendererData;
            let labelDataPoints: LabelDataPoint[] = [];
            if (this.filledMapDataLabelsEnabled) {
                let dataShapes = data.shapeData;
                let labelSettings = this.dataLabelsSettings;

                for (let dataShape of dataShapes) {

                    if (!dataShape.displayLabel) {
                        continue;
                    }
                    let text, secondRowText: string;
                    let secondRowTextWidth: number = 0;
                    let hasSecondRow: boolean = false;

                    if (this.dataLabelsSettings.show && !this.dataLabelsSettings.showCategory) {
                        text = dataShape.catagoryLabeltext;
                        if (text === undefined)
                            continue;
                    } else if (this.dataLabelsSettings.showCategory && !this.dataLabelsSettings.show) {
                        text = dataShape.labeltext;
                        if (text === undefined)
                            continue;
                    } else if (this.dataLabelsSettings.showCategory && this.dataLabelsSettings.show) {
                        text = dataShape.catagoryLabeltext;
                        secondRowText = dataShape.labeltext;
                        if (text === undefined && secondRowText === undefined)
                            continue;
                        hasSecondRow = true;
                    }

                    if (hasSecondRow) {
                        let secondRowProperties: TextProperties = {
                            text: secondRowText,
                            fontFamily: NewDataLabelUtils.LabelTextProperties.fontFamily,
                            fontSize: NewDataLabelUtils.LabelTextProperties.fontSize,
                            fontWeight: NewDataLabelUtils.LabelTextProperties.fontWeight,
                        };
                        secondRowTextWidth = TextMeasurementService.measureSvgTextWidth(secondRowProperties);
                    }

                    let firstRowProperties: TextProperties = {
                        text: text,
                        fontFamily: NewDataLabelUtils.LabelTextProperties.fontFamily,
                        fontSize: NewDataLabelUtils.LabelTextProperties.fontSize,
                        fontWeight: NewDataLabelUtils.LabelTextProperties.fontWeight,
                    };
                    let textWidth = TextMeasurementService.measureSvgTextWidth(firstRowProperties);
                    let textHeight = TextMeasurementService.estimateSvgTextHeight(firstRowProperties);

                    if (secondRowText && dataShape.labeltext !== undefined && dataShape.catagoryLabeltext !== undefined) {
                        textHeight = textHeight * 2;
                    }

                    let labelDataPoint: LabelDataPoint = {
                        parentType: LabelDataPointParentType.Polygon,
                        parentShape:
                        {
                            polygon: new Polygon(dataShape.absolutePointArray),
                            validPositions: MapShapeDataPointRenderer.validLabelPolygonPositions,
                        },
                        text: text,
                        secondRowText: secondRowText,
                        textSize: {
                            width: Math.max(textWidth, secondRowTextWidth),
                            height: textHeight,
                        },
                        insideFill: labelSettings.labelColor,
                        outsideFill: labelSettings.labelColor ? labelSettings.labelColor : NewDataLabelUtils.defaultInsideLabelColor, // Use inside for outside colors because we draw backgrounds for map labels
                        isPreferred: false,
                        identity: undefined,
                        hasBackground: true,
                    };
                    labelDataPoints.push(labelDataPoint);
                }
            }
            return labelDataPoints;
        }

        private drawLabelStems(labelsContext: D3.Selection, dataLabels: Label[], showText: boolean, showCategory: boolean) {
            let filteredLabels = _.filter(dataLabels, (d: Label) => d.isVisible);
            let key = (d: Label, index: number) => { return d.identity ? d.identity.getKeyWithoutHighlight() : index; };
            NewDataLabelUtils.drawLabelLeaderLines(labelsContext, filteredLabels, key, LeaderLineColor);
        }
    }

    /** Note: public for UnitTest */
    export interface SimpleRange {
        min: number;
        max: number;
    }

    /**
     * Interface used to track geocoding requests, a new context being created on each data change.
     * Its identity is used to track whether the context has changed so that we don't add data points
     * for old geocode requests.
     */
    interface GeocodingContext {
        // Deferred whose promise is used to timeout/cancel geocoding requests
        timeout: IDeferred<any>;
    }

    const DefaultLocationZoomLevel = 11;

    export class Map implements IVisual {
        public currentViewport: IViewport;

        private pendingGeocodingRender: boolean;
        private mapControl: Microsoft.Maps.Map;
        private minLongitude: number;
        private maxLongitude: number;
        private minLatitude: number;
        private maxLatitude: number;
        private style: IVisualStyle;
        private colors: IDataColorPalette;
        private dataPointRenderer: IMapDataPointRenderer;
        private geocodingCategory: string;
        private legend: ILegend;
        private legendHeight;
        private legendData: LegendData;
        private element: JQuery;
        private dataView: DataView;
        private dataLabelsSettings: PointDataLabelsSettings;
        private static MapContainer = {
            cssClass: 'mapControl',
            selector: '.mapControl'
        };
        public static StrokeDarkenColorValue = 255 * 0.25;
        public static ScheduleRedrawInterval = 3000;
        private interactivityService: IInteractivityService;
        private behavior: MapBehavior;
        private defaultDataPointColor: string;
        private showAllDataPoints: boolean;
        private dataPointsToEnumerate: LegendDataPoint[];
        private hasDynamicSeries: boolean;
        private geoTaggingAnalyzerService: powerbi.IGeoTaggingAnalyzerService;
        private isFilledMap: boolean;
        private host: IVisualHostServices;
        private geocoder: IGeocoder;
        private promiseFactory: IPromiseFactory;
        private mapControlFactory: IMapControlFactory;
        private tooltipsEnabled: boolean;
        private tooltipBucketEnabled: boolean;
        private filledMapDataLabelsEnabled: boolean;
        private disableZooming: boolean;
        private disablePanning: boolean;
        private locale: string;
        private isLegendScrollable: boolean;
        private viewChangeThrottleInterval: number;
        private root: JQuery;
        private enableCurrentLocation: boolean;
        private isCurrentLocation: boolean;
        private boundsHaveBeenUpdated: boolean;
        private geocodingContext: GeocodingContext;
        private isDestroyed: boolean = false;

        constructor(options: MapConstructionOptions) {
            if (options.filledMap) {
                this.dataPointRenderer = new MapShapeDataPointRenderer(options.filledMapDataLabelsEnabled, options.tooltipsEnabled);
                this.filledMapDataLabelsEnabled = options.filledMapDataLabelsEnabled;
                this.isFilledMap = true;
            }
            else {
                this.dataPointRenderer = new MapBubbleDataPointRenderer(options.tooltipsEnabled);
                this.isFilledMap = false;
            }
            this.mapControlFactory = options.mapControlFactory ? options.mapControlFactory : this.getDefaultMapControlFactory();
            this.behavior = options.behavior;
            this.tooltipsEnabled = options.tooltipsEnabled;
            this.tooltipBucketEnabled = options.tooltipBucketEnabled;
            this.disableZooming = options.disableZooming;
            this.disablePanning = options.disablePanning;
            this.isLegendScrollable = !!options.behavior;
            this.viewChangeThrottleInterval = options.viewChangeThrottleInterval;
            this.enableCurrentLocation = options.enableCurrentLocation;
            this.boundsHaveBeenUpdated = false;
        }

        public init(options: VisualInitOptions) {
            debug.assertValue(options, 'options');
            let element = this.element = options.element;
            this.pendingGeocodingRender = false;
            this.currentViewport = options.viewport;
            this.style = options.style;
            this.colors = this.style.colorPalette.dataColors;
            if (this.behavior)
                this.interactivityService = createInteractivityService(options.host);
            this.dataLabelsSettings = dataLabelUtils.getDefaultMapLabelSettings();
            this.legend = powerbi.visuals.createLegend(element, options.interactivity && options.interactivity.isInteractiveLegend, this.interactivityService, this.isLegendScrollable);
            this.legendHeight = 0;
            this.legendData = { dataPoints: [] };
            this.geoTaggingAnalyzerService = powerbi.createGeoTaggingAnalyzerService(options.host.getLocalizedString);
            this.host = options.host;
            if (options.host.locale)
                this.locale = options.host.locale();
            this.geocoder = options.host.geocoder();
            this.promiseFactory = options.host.promiseFactory();

            this.resetBounds();

            this.isDestroyed = false;

            this.mapControlFactory.ensureMap(this.locale, () => {
                if (this.isDestroyed)
                    return;

                Map.removeHillShading();
                Microsoft.Maps.loadModule('Microsoft.Maps.Overlays.Style', {
                    callback: () => {
                        if (this.isDestroyed)
                            return;
                        this.initialize(element[0]);
                        if (this.enableCurrentLocation) {
                            this.createCurrentLocation(element);
                        }
                    }
                });
            });
        }

        public destroy(): void {
            this.isDestroyed = true;

            if (this.geocodingContext && this.geocodingContext.timeout) {
                this.geocodingContext.timeout.resolve(null);
            }
        }

        private createCurrentLocation(element: JQuery): void {
            let myLocBtn = InJs.DomFactory.div().addClass("mapCurrentLocation").appendTo(element);
            let pushpin: Microsoft.Maps.Pushpin;

            myLocBtn.on('click',() => {

                if (this.isCurrentLocation) {
                    // Restore previous map view and remove pushpin
                    if (pushpin) {
                        this.mapControl.entities.remove(pushpin);
                    }
                    this.updateInternal(false, false);
                    this.isCurrentLocation = false;
                } else {
                    this.host.geolocation().getCurrentPosition((position: Position) => {
                        let location = new Microsoft.Maps.Location(position.coords.latitude, position.coords.longitude);
                        if (pushpin) {
                            this.mapControl.entities.remove(pushpin);
                        }
                        pushpin = MapUtil.CurrentLocation.createPushpin(location);
                        this.mapControl.entities.push(pushpin);
                        this.updateMapView(location, DefaultLocationZoomLevel);
                        this.isCurrentLocation = true;
                    });
                }

            });
        }

        private addDataPoint(dataPoint: MapDataPoint): void {
            let location = dataPoint.location;
            this.updateBounds(location.latitude, location.longitude);

            this.scheduleRedraw();
        }

        private scheduleRedraw(): void {
            if (!this.pendingGeocodingRender && this.mapControl) {
                this.pendingGeocodingRender = true;
                // Maintain a 3 second delay between redraws from geocoded geometry
                setTimeout(() => {
                    this.updateInternal(true, true);
                    this.pendingGeocodingRender = false;
                }, Map.ScheduleRedrawInterval);
            }
        }

        private enqueueGeoCode(dataPoint: MapDataPoint): void {
            let location = this.geocoder.tryGeocodeImmediate(dataPoint.geocodingQuery, this.geocodingCategory);
            if (location)
                this.completeGeoCode(dataPoint, location);
            else {
                let geocodingContext = this.geocodingContext;
                this.geocoder.geocode(dataPoint.geocodingQuery, this.geocodingCategory, { timeout: geocodingContext.timeout.promise }).then((location) => {
                    if (!this.isDestroyed && location && geocodingContext === this.geocodingContext) {
                        this.completeGeoCode(dataPoint, location);
                    }
                });
            }
        }

        private completeGeoCode(dataPoint: MapDataPoint, location: IGeocodeCoordinate): void {
            dataPoint.location = location;
            this.addDataPoint(dataPoint);
        }

        private enqueueGeoCodeAndGeoShape(dataPoint: MapDataPoint, params: FilledMapParams): void {
            let location = this.geocoder.tryGeocodeImmediate(dataPoint.geocodingQuery, this.geocodingCategory);
            if (location)
                this.completeGeoCodeAndGeoShape(dataPoint, params, location);
            else {
                let geocodingContext = this.geocodingContext;
                this.geocoder.geocode(dataPoint.geocodingQuery, this.geocodingCategory, { timeout: geocodingContext.timeout.promise }).then((location) => {
                    if (!this.isDestroyed && location && geocodingContext === this.geocodingContext) {
                        this.completeGeoCodeAndGeoShape(dataPoint, params, location);
                    }
                });
            }
        }

        private completeGeoCodeAndGeoShape(dataPoint: MapDataPoint, params: FilledMapParams, location: IGeocodeCoordinate): void {
            dataPoint.location = location;
            this.enqueueGeoShape(dataPoint, params);
        }

        private enqueueGeoShape(dataPoint: MapDataPoint, params: FilledMapParams): void {
            debug.assertValue(dataPoint.location, "cachedLocation");
            let result = this.geocoder.tryGeocodeBoundaryImmediate(dataPoint.location.latitude, dataPoint.location.longitude, this.geocodingCategory, params.level, params.maxPolygons);
            if (result)
                this.completeGeoShape(dataPoint, params, result);
            else {
                let geocodingContext = this.geocodingContext;
                this.geocoder.geocodeBoundary(dataPoint.location.latitude, dataPoint.location.longitude, this.geocodingCategory, params.level, params.maxPolygons, { timeout: geocodingContext.timeout.promise })
                    .then((result: IGeocodeBoundaryCoordinate) => {
                        if (!this.isDestroyed && result && geocodingContext === this.geocodingContext)
                            this.completeGeoShape(dataPoint, params, result); 
                    });
            }
        }

        private completeGeoShape(dataPoint: MapDataPoint, params: FilledMapParams, result: IGeocodeBoundaryCoordinate): void {
            let paths;
            if (result.locations.length === 0 || result.locations[0].geographic) {
                paths = MapShapeDataPointRenderer.buildPaths(result.locations);
            }
            else {
                MapUtil.calcGeoData(result);
                paths = MapShapeDataPointRenderer.buildPaths(result.locations);
            }
            dataPoint.paths = paths;
            this.addDataPoint(dataPoint);
        }

        private getOptimumLevelOfDetail(width: number, height: number): number {
            let dataPointCount = this.dataPointRenderer.getDataPointCount();
            if (dataPointCount === 0)
                return MapUtil.MinLevelOfDetail;

            let threshold: number = this.dataPointRenderer.getDataPointPadding();

            for (let levelOfDetail = MapUtil.MaxLevelOfDetail; levelOfDetail >= MapUtil.MinLevelOfDetail; levelOfDetail--) {
                let minXmaxY = MapUtil.latLongToPixelXY(this.minLatitude, this.minLongitude, levelOfDetail);
                let maxXminY = MapUtil.latLongToPixelXY(this.maxLatitude, this.maxLongitude, levelOfDetail);

                if (maxXminY.x - minXmaxY.x + threshold <= width && minXmaxY.y - maxXminY.y + threshold <= height) {
                    // if we have less than 2 data points we should not zoom in "too much"
                    if (dataPointCount < 2)
                        levelOfDetail = Math.min(MapUtil.MaxAutoZoomLevel, levelOfDetail);

                    return levelOfDetail;
                }
            }

            return MapUtil.MinLevelOfDetail;
        }
        private getViewCenter(levelOfDetail: number): Microsoft.Maps.Location {
            let minXmaxY = MapUtil.latLongToPixelXY(this.minLatitude, this.minLongitude, levelOfDetail);
            let maxXminY = MapUtil.latLongToPixelXY(this.maxLatitude, this.maxLongitude, levelOfDetail);
            return MapUtil.pixelXYToLocation((minXmaxY.x + maxXminY.x) / 2.0, (maxXminY.y + minXmaxY.y) / 2.0, levelOfDetail);
        }

        private resetBounds(): void {
            this.boundsHaveBeenUpdated = false;
            this.minLongitude = MapUtil.MaxAllowedLongitude;
            this.maxLongitude = MapUtil.MinAllowedLongitude;
            this.minLatitude = MapUtil.MaxAllowedLatitude;
            this.maxLatitude = MapUtil.MinAllowedLatitude;
        }

        private updateBounds(latitude: number, longitude: number): void {
            this.boundsHaveBeenUpdated = true;
            if (longitude < this.minLongitude) {
                this.minLongitude = longitude;
            }

            if (longitude > this.maxLongitude) {
                this.maxLongitude = longitude;
            }

            if (latitude < this.minLatitude) {
                this.minLatitude = latitude;
            }

            if (latitude > this.maxLatitude) {
                this.maxLatitude = latitude;
            }
        }

        public static legendObject(dataView: DataView): DataViewObject {
            return dataView &&
                dataView.metadata &&
                dataView.metadata.objects &&
                <DataViewObject>dataView.metadata.objects['legend'];
        }

        public static isLegendHidden(dataView: DataView): boolean {
            let legendObject = Map.legendObject(dataView);
            return legendObject != null && legendObject[legendProps.show] === false;
        }

        public static legendPosition(dataView: DataView): LegendPosition {
            let legendObject = Map.legendObject(dataView);
            return legendObject && LegendPosition[<string>legendObject[legendProps.position]];
        }

        public static getLegendFontSize(dataView: DataView): number {
            let legendObject = Map.legendObject(dataView);
            return (legendObject && <number>legendObject[legendProps.fontSize]) || SVGLegend.DefaultFontSizeInPt;
        }

        public static isShowLegendTitle(dataView: DataView): boolean {
            let legendObject = Map.legendObject(dataView);
            return legendObject && <boolean>legendObject[legendProps.showTitle];
        }

        private legendTitle(): string {
            let legendObject = Map.legendObject(this.dataView);
            return (legendObject && <string>legendObject[legendProps.titleText]) || this.legendData.title;
        }

        private renderLegend(legendData: LegendData): void {
            let hideLegend = Map.isLegendHidden(this.dataView);
            let showTitle = Map.isShowLegendTitle(this.dataView);
            let title = this.legendTitle();
            // Update the legendData based on the hide flag.  Cartesian passes in no-datapoints. OnResize reuses the legendData, so this can't mutate.
            let clonedLegendData: LegendData = {
                dataPoints: hideLegend ? [] : legendData.dataPoints,
                grouped: legendData.grouped,
                title: showTitle ? title : "",
                fontSize: Map.getLegendFontSize(this.dataView)
            };

            // Update the orientation to match what's in the dataView
            let targetOrientation = Map.legendPosition(this.dataView);
            if (targetOrientation !== undefined) {
                this.legend.changeOrientation(targetOrientation);
            } else {
                this.legend.changeOrientation(LegendPosition.Top);
            }

            this.legend.drawLegend(clonedLegendData, this.currentViewport);
        }

        /** Note: public for UnitTest */
        public static calculateGroupSizes(categorical: DataViewCategorical, grouped: DataViewValueColumnGroup[], groupSizeTotals: number[], sizeMeasureIndex: number, currentValueScale: SimpleRange): SimpleRange {
            let categoryCount = categorical.values[0].values.length;
            let seriesCount = grouped.length;

            for (let i = 0, len = categoryCount; i < len; ++i) {
                let groupTotal = null;
                if (sizeMeasureIndex >= 0) {
                    for (let j = 0; j < seriesCount; ++j) {
                        let value = grouped[j].values[sizeMeasureIndex].values[i];
                        if (value) {
                            if (groupTotal === null) {
                                groupTotal = value;
                            } else {
                                groupTotal += value;
                            }
                        }
                    }
                }

                groupSizeTotals.push(groupTotal);

                if (groupTotal) {
                    if (!currentValueScale) {
                        currentValueScale = {
                            min: groupTotal,
                            max: groupTotal
                        };
                    } else {
                        currentValueScale.min = Math.min(currentValueScale.min, groupTotal);
                        currentValueScale.max = Math.max(currentValueScale.max, groupTotal);
                    }
                }
            }

            return currentValueScale;
        }

        /** Note: public for UnitTest */
        public static calculateRadius(range: SimpleRange, value?: number): number {
            let rangeDiff = range ? range.max - range.min : 0;
            let radius = 6;
            if (range != null && value != null && rangeDiff !== 0) {
                radius = (14 * ((value - range.min) / rangeDiff)) + 6;
            }

            return radius;
        }

        /** Note: public for UnitTest */
        public static getGeocodingCategory(categorical: DataViewCategorical, geoTaggingAnalyzerService: IGeoTaggingAnalyzerService): string {
            if (categorical && categorical.categories && categorical.categories.length > 0 && categorical.categories[0].source) {
                // Check categoryString for manually specified information in the model
                let type = <ValueType>categorical.categories[0].source.type;
                if (type && type.categoryString) {
                    return geoTaggingAnalyzerService.getFieldType(type.categoryString);
                }

                // Check the category name
                let categoryName = categorical.categories[0].source.displayName;
                let geotaggedResult = geoTaggingAnalyzerService.getFieldType(categoryName);
                if (geotaggedResult)
                    return geotaggedResult;

                // Checking roles for VRM backwards compatibility
                let roles = categorical.categories[0].source.roles;
                if (roles) {
                    let roleNames = Object.keys(roles);
                    for (let i = 0, len = roleNames.length; i < len; ++i) {
                        let typeFromRoleName = geoTaggingAnalyzerService.getFieldType(roleNames[i]);
                        if (typeFromRoleName)
                            return typeFromRoleName;
                    }
                }
            }

            return undefined;
        }

        /** Note: public for UnitTest */
        public static hasSizeField(values: DataViewValueColumns, defaultIndexIfNoRole?: number): boolean {
            if (_.isEmpty(values))
                return false;

            for (let i = 0, ilen = values.length; i < ilen; i++) {
                let roles = values[i].source.roles;

                // case for Power Q&A since Power Q&A does not assign role to measures.
                if (!roles && i === defaultIndexIfNoRole && values[i].source.type.numeric)
                    return true;

                if (roles) {
                    let roleNames = Object.keys(roles);
                    for (let j = 0, jlen = roleNames.length; j < jlen; j++) {
                        let role = roleNames[j];
                        if (role === "Size")
                            return true;
                    }
                }
            }
            return false;
        }

        public static shouldEnumerateDataPoints(dataView: DataView, usesSizeForGradient: boolean): boolean {
            let hasSeries = DataRoleHelper.hasRoleInDataView(dataView, 'Series');
            let gradientRole = usesSizeForGradient ? 'Size' : 'Gradient';
            let hasGradientRole = DataRoleHelper.hasRoleInDataView(dataView, gradientRole);
            return hasSeries || !hasGradientRole;
        }

        public static shouldEnumerateCategoryLabels(isFilledMap: boolean, filledMapDataLabelsEnabled: boolean): boolean {
            return (!isFilledMap || filledMapDataLabelsEnabled);
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            let enumeration = new ObjectEnumerationBuilder();
            switch (options.objectName) {
                case 'dataPoint':
                    if (Map.shouldEnumerateDataPoints(this.dataView, this.isFilledMap)) {
                        let bubbleData: MapBubble[] = [];
                        //TODO: better way of getting this data
                        let hasDynamicSeries = this.hasDynamicSeries;
                        if (!hasDynamicSeries) {
                            let mapData = this.dataPointRenderer.converter(this.getMapViewPort(), this.dataView, this.dataLabelsSettings, this.interactivityService, this.tooltipsEnabled);
                            bubbleData = mapData.bubbleData;
                        }
                        Map.enumerateDataPoints(enumeration, this.dataPointsToEnumerate, this.colors, hasDynamicSeries, this.defaultDataPointColor, this.showAllDataPoints, bubbleData);
                    }
                    break;
                case 'categoryLabels':
                    if (Map.shouldEnumerateCategoryLabels(this.isFilledMap, this.filledMapDataLabelsEnabled)) {
                        dataLabelUtils.enumerateCategoryLabels(enumeration, this.dataLabelsSettings, true, true);
                    }
                    break;
                case 'legend':
                    if (this.hasDynamicSeries) {
                        Map.enumerateLegend(enumeration, this.dataView, this.legend, this.legendTitle());
                    }
                    break;
                case 'labels':
                    if (this.filledMapDataLabelsEnabled) {
                        this.dataLabelsSettings = this.dataLabelsSettings ? this.dataLabelsSettings : dataLabelUtils.getDefaultMapLabelSettings();
                        let labelSettingOptions: VisualDataLabelsSettingsOptions = {
                            enumeration: enumeration,
                            dataLabelsSettings: this.dataLabelsSettings,
                            show: true,
                            displayUnits: true,
                            precision: true,
                        };
                        dataLabelUtils.enumerateDataLabels(labelSettingOptions);
                    }
                    break;
            }
            return enumeration.complete();
        }

        public static enumerateDataPoints(enumeration: ObjectEnumerationBuilder, dataPoints: LegendDataPoint[], colors: IDataColorPalette, hasDynamicSeries: boolean, defaultDataPointColor: string, showAllDataPoints: boolean, bubbleData: MapBubble[]): void {
            let seriesLength = dataPoints && dataPoints.length;

            if (hasDynamicSeries) {
                for (let i = 0; i < seriesLength; i++) {

                    let dataPoint = dataPoints[i];
                    enumeration.pushInstance({
                        objectName: 'dataPoint',
                        displayName: dataPoint.label,
                        selector: ColorHelper.normalizeSelector(dataPoint.identity.getSelector()),
                        properties: {
                            fill: { solid: { color: dataPoint.color } }
                        },
                    });
                }
            }
            else {
                enumeration.pushInstance({
                    objectName: 'dataPoint',
                    selector: null,
                    properties: {
                        defaultColor: { solid: { color: defaultDataPointColor || colors.getColorByIndex(0).value } }
                    },
                }).pushInstance({
                    objectName: 'dataPoint',
                    selector: null,
                    properties: {
                        showAllDataPoints: !!showAllDataPoints
                    },
                });

                if (bubbleData) {
                    for (let i = 0; i < bubbleData.length; i++) {
                        let bubbleDataPoint = bubbleData[i];
                        enumeration.pushInstance({
                            objectName: 'dataPoint',
                            displayName: bubbleDataPoint.labeltext,
                            selector: ColorHelper.normalizeSelector(bubbleDataPoint.identity.getSelector()),
                            properties: {
                                fill: { solid: { color: Color.normalizeToHexString(bubbleDataPoint.fill) } }
                            },
                        });
                    }
                }

            }
        }

        public static enumerateLegend(enumeration: ObjectEnumerationBuilder, dataView: DataView, legend: ILegend, legendTitle: string): void {
            enumeration.pushInstance({
                selector: null,
                properties: {
                    show: !Map.isLegendHidden(dataView),
                    position: LegendPosition[legend.getOrientation()],
                    showTitle: Map.isShowLegendTitle(dataView),
                    titleText: legendTitle,
                    fontSize: Map.getLegendFontSize(dataView)
                },
                objectName: 'legend'
            });
        }

        public onDataChanged(options: VisualDataChangedOptions): void {
            debug.assertValue(options, 'options');

            this.resetBounds();

            if (this.geocodingContext && this.geocodingContext.timeout) {
                this.geocodingContext.timeout.resolve(null);
            }
            this.geocodingContext = {
                timeout: this.promiseFactory.defer<any>(),
            };

            if (this.behavior)
                this.behavior.resetZoomPan();

            this.dataLabelsSettings = dataLabelUtils.getDefaultMapLabelSettings();
            this.defaultDataPointColor = null;
            this.showAllDataPoints = null;
            let dataView = this.dataView = options.dataViews[0];
            let isFilledMap = this.isFilledMap;
            let warnings = [];
            let data: MapData = {
                dataPoints: [],
                geocodingCategory: null,
                hasDynamicSeries: false,
                hasSize: false,
            };

            if (dataView) {
                // Handle object-based settings
                if (dataView.metadata && dataView.metadata.objects) {
                    let objects = dataView.metadata.objects;

                    this.defaultDataPointColor = DataViewObjects.getFillColor(objects, mapProps.dataPoint.defaultColor);
                    this.showAllDataPoints = DataViewObjects.getValue<boolean>(objects, mapProps.dataPoint.showAllDataPoints);

                    this.dataLabelsSettings.showCategory = DataViewObjects.getValue<boolean>(objects, filledMapProps.categoryLabels.show, this.dataLabelsSettings.showCategory);

                    if (isFilledMap) {
                        this.dataLabelsSettings.precision = DataViewObjects.getValue(objects, filledMapProps.labels.labelPrecision, this.dataLabelsSettings.precision);
                        this.dataLabelsSettings.precision = (this.dataLabelsSettings.precision !== dataLabelUtils.defaultLabelPrecision && this.dataLabelsSettings.precision < 0) ? 0 : this.dataLabelsSettings.precision;
                        this.dataLabelsSettings.displayUnits = DataViewObjects.getValue<number>(objects, filledMapProps.labels.labelDisplayUnits, this.dataLabelsSettings.displayUnits);
                        let datalabelsObj = objects['labels'];
                        if (datalabelsObj) {
                            this.dataLabelsSettings.show = (datalabelsObj['show'] !== undefined) ? <boolean>datalabelsObj['show'] : this.dataLabelsSettings.show;
                            if (datalabelsObj['color'] !== undefined) {
                                this.dataLabelsSettings.labelColor = (<Fill>datalabelsObj['color']).solid.color;
                            }
                        }
                    }
                    else {
                        let categoryLabelsObj = <DataLabelObject>objects['categoryLabels'];
                        if (categoryLabelsObj)
                            dataLabelUtils.updateLabelSettingsFromLabelsObject(categoryLabelsObj, this.dataLabelsSettings);
                    }
                }

                // Convert data
                let colorHelper = new ColorHelper(this.colors, mapProps.dataPoint.fill, this.defaultDataPointColor);
                data = Map.converter(dataView, colorHelper, this.geoTaggingAnalyzerService, isFilledMap, this.tooltipBucketEnabled);
                this.hasDynamicSeries = data.hasDynamicSeries;

                // Create legend
                this.legendData = Map.createLegendData(dataView, colorHelper);
                this.dataPointsToEnumerate = this.legendData.dataPoints;
                this.renderLegend(this.legendData);

                // Start geocoding or geoshaping
                if (data != null) {
                    this.geocodingCategory = data.geocodingCategory;
                    this.mapControlFactory.ensureMap(this.locale, () => {
                        if (this.isDestroyed)
                            return;

                        Map.removeHillShading();
                        let params;
                        if (isFilledMap) {
                            params = MapShapeDataPointRenderer.getFilledMapParams(this.geocodingCategory, data.dataPoints.length);
                        }
                        for (let dataPoint of data.dataPoints) {
                            if (!dataPoint.location) {
                                let categoryValue = dataPoint.categoryValue;
                                if (categoryValue != null && categoryValue !== "") { // If we don't have a location, but the category value is non-null and not an empty string
                                    if (isFilledMap)
                                        this.enqueueGeoCodeAndGeoShape(dataPoint, params);
                                    else
                                        this.enqueueGeoCode(dataPoint);
                                }
                            }
                            else if (isFilledMap && !dataPoint.paths) {
                                this.enqueueGeoShape(dataPoint, params);
                            }
                            else {
                                this.addDataPoint(dataPoint);
                            }
                        }
                    });
                }
                else {
                    // No data from conversion, so clear data points
                    this.clearDataPoints();
                }

                if (isFilledMap) {
                    if (!this.geocodingCategory || !this.geoTaggingAnalyzerService.isGeoshapable(this.geocodingCategory)) {
                        warnings.push(new FilledMapWithoutValidGeotagCategoryWarning());
                    }
                }
            }
            else {
                this.clearDataPoints();
                this.renderLegend({
                    dataPoints: [],
                    title: undefined,
                });
                this.dataPointsToEnumerate = [];
            }

            if (!_.isEmpty(warnings))
                this.host.setWarnings(warnings);

            this.dataPointRenderer.setData(data);

            this.updateInternal(true /* dataChanged */, true /* redrawDataLabels */);
        }

        public static converter(dataView: DataView, colorHelper: ColorHelper, geoTaggingAnalyzerService: IGeoTaggingAnalyzerService, isFilledMap: boolean, tooltipBucketEnabled?: boolean): MapData {
            let reader = powerbi.data.createIDataViewCategoricalReader(dataView);
            let dataPoints: MapDataPoint[] = [];
            let hasDynamicSeries = reader.hasDynamicSeries();
            let seriesColumnIdentifier = reader.getSeriesColumnIdentityFields();
            let sizeQueryName = reader.getMeasureQueryName('Size');
            if (sizeQueryName == null)
                sizeQueryName = '';
            let hasSize = reader.hasValues('Size');
            let geocodingCategory = null;
            let formatStringProp = mapProps.general.formatString;

            if (reader.hasCategories()) {
                // Calculate category totals and range for radius calculation
                let categoryTotals: number[] = [];
                let categoryTotalRange: SimpleRange;
                if (hasSize) {
                    let categoryMin: number = undefined;
                    let categoryMax: number = undefined;
                    for (let categoryIndex = 0, categoryCount = reader.getCategoryCount(); categoryIndex < categoryCount; categoryIndex++) {
                        let categoryTotal: number;
                        for (let seriesIndex = 0, seriesCount = reader.getSeriesCount(); seriesIndex < seriesCount; seriesIndex++) {
                            let currentValue = reader.getValue('Size', categoryIndex, seriesIndex);
                            // Dont initialze categoryTotal to zero until you find a null value so that it remains undefined for categories that have no non-null values (0 is rendered by filled map while null is not)
                            if (categoryTotal == null && currentValue != null)
                                categoryTotal = 0;
                            if (categoryTotal != null)
                                categoryTotal += currentValue;
                        }
                        categoryTotals.push(categoryTotal);
                        if (categoryTotal != null) {
                            if (categoryMin === undefined || categoryTotal < categoryMin)
                                categoryMin = categoryTotal;
                            if (categoryMax === undefined || categoryTotal > categoryMax)
                                categoryMax = categoryTotal;
                        }
                    }
                    categoryTotalRange = (categoryMin !== undefined && categoryMax !== undefined) ? {
                        max: categoryMax,
                        min: categoryMin,
                    } : undefined;
                }

                let hasLatLongGroup = reader.hasCompositeCategories() && reader.hasCategoryWithRole('X') && reader.hasCategoryWithRole('Y');
                let hasCategoryGroup = reader.hasCategoryWithRole('Category');

                geocodingCategory = Map.getGeocodingCategory(dataView.categorical, geoTaggingAnalyzerService);

                if (hasLatLongGroup || hasCategoryGroup) {
                    // Create data points
                    for (let categoryIndex = 0, categoryCount = reader.getCategoryCount(); categoryIndex < categoryCount; categoryIndex++) {
                        // Get category information
                        let categoryValue: string = undefined;
                        // The category objects should come from whichever category exists; in the case of a composite category, the objects should be the same for
                        //   both categories, so we only need to obtain them from one role.
                        let categoryObjects = hasCategoryGroup ? reader.getCategoryObjects('Category', categoryIndex) : reader.getCategoryObjects('Y', categoryIndex);
                        let location: IGeocodeCoordinate;
                        let categoryTooltipItem: TooltipDataItem;
                        let latitudeTooltipItem: TooltipDataItem;
                        let longitudeTooltipItem: TooltipDataItem;
                        let seriesTooltipItem: TooltipDataItem;
                        let sizeTooltipItem: TooltipDataItem;
                        let gradientTooltipItem: TooltipDataItem;
                        if (hasCategoryGroup) {
                            // Set category value
                            categoryValue = converterHelper.formatFromMetadataColumn(reader.getCategoryValue('Category', categoryIndex), reader.getCategoryMetadataColumn('Category'), formatStringProp);
                            categoryTooltipItem = {
                                displayName: reader.getCategoryDisplayName('Category'),
                                value: categoryValue,
                            };

                            // Create location from latitude and longitude if they exist as values
                            if (reader.hasValues('Y') && reader.hasValues('X')) {
                                let latitude = reader.getFirstNonNullValueForCategory('Y', categoryIndex);
                                let longitude = reader.getFirstNonNullValueForCategory('X', categoryIndex);
                                if (latitude != null && longitude != null) {
                                    location = { latitude: latitude, longitude: longitude };
                                }
                                latitudeTooltipItem = {
                                    displayName: reader.getValueDisplayName('Y'),
                                    value: converterHelper.formatFromMetadataColumn(latitude, reader.getValueMetadataColumn('Y'), formatStringProp),
                                };
                                longitudeTooltipItem = {
                                    displayName: reader.getValueDisplayName('X'),
                                    value: converterHelper.formatFromMetadataColumn(longitude, reader.getValueMetadataColumn('X'), formatStringProp),
                                };
                            }
                        }
                        else {
                            let latitude = reader.getCategoryValue('Y', categoryIndex);
                            let longitude = reader.getCategoryValue('X', categoryIndex);

                            if (latitude != null && longitude != null) {
                                // Combine latitude and longitude to create the category value
                                categoryValue = latitude + ', ' + longitude;
                                // Create location from latitude and longitude
                                location = { latitude: latitude, longitude: longitude };
                                latitudeTooltipItem = {
                                    displayName: reader.getCategoryDisplayName('Y'),
                                    value: converterHelper.formatFromMetadataColumn(latitude, reader.getCategoryMetadataColumn('Y'), formatStringProp),
                                };
                                longitudeTooltipItem = {
                                    displayName: reader.getCategoryDisplayName('X'),
                                    value: converterHelper.formatFromMetadataColumn(longitude, reader.getCategoryMetadataColumn('X'), formatStringProp),
                                };
                            }
                        }
                        let value: number = hasSize ? categoryTotals[categoryIndex] : undefined;

                        // Calculate sub data points by series
                        let subDataPoints: MapSubDataPoint[] = [];
                        let seriesCount = reader.getSeriesCount();
                        if (!hasSize && !hasDynamicSeries) {
                            seriesCount = 1;
                        }
                        for (let seriesIndex = 0; seriesIndex < seriesCount; seriesIndex++) {
                            let color: string;

                            if (hasDynamicSeries) {
                                color = colorHelper.getColorForSeriesValue(reader.getSeriesObjects(seriesIndex), seriesColumnIdentifier, <string>(reader.getSeriesName(seriesIndex)));
                            }
                            else if (reader.hasCategoryWithRole('Series')) {
                                color = colorHelper.getColorForSeriesValue(reader.getCategoryObjects('Series', categoryIndex), reader.getCategoryColumnIdentityFields('Series'), categoryValue);
                            }
                            else {
                                color = colorHelper.getColorForMeasure(categoryObjects, sizeQueryName);
                            }

                            let colorRgb = Color.parseColorString(color);
                            let stroke = Color.hexString(Color.darken(colorRgb, Map.StrokeDarkenColorValue));
                            colorRgb.A = 0.6;
                            let fill = Color.rgbString(colorRgb);

                            let identityBuilder = new SelectionIdBuilder()
                                .withCategory(reader.getCategoryColumn(hasCategoryGroup ? 'Category' : 'Y'), categoryIndex)
                                .withMeasure(sizeQueryName);
                            if (hasDynamicSeries) {
                                identityBuilder = identityBuilder.withSeries(reader.getSeriesValueColumns(), reader.getSeriesValueColumnGroup(seriesIndex));
                            }

                            if (hasDynamicSeries) {
                                seriesTooltipItem = {
                                    displayName: reader.getSeriesDisplayName(),
                                    value: converterHelper.formatFromMetadataColumn(reader.getSeriesName(seriesIndex), reader.getSeriesMetadataColumn(), formatStringProp),
                                };
                            }

                            let subsliceValue: number;
                            if (hasSize) {
                                subsliceValue = reader.getValue('Size', categoryIndex, seriesIndex);
                                sizeTooltipItem = {
                                    displayName: reader.getValueDisplayName('Size'),
                                    value: converterHelper.formatFromMetadataColumn(subsliceValue, reader.getValueMetadataColumn('Size', seriesIndex), formatStringProp),
                                };
                            }
                            if (reader.hasValues('Gradient')) {
                                gradientTooltipItem = {
                                    displayName: reader.getValueDisplayName('Gradient'),
                                    value: converterHelper.formatFromMetadataColumn(reader.getValue('Gradient', categoryIndex, seriesIndex), reader.getValueMetadataColumn('Gradient', seriesIndex), formatStringProp),
                                };
                            }

                            // Combine any existing tooltip items
                            let tooltipInfo: TooltipDataItem[] = [];
                            if (categoryTooltipItem)
                                tooltipInfo.push(categoryTooltipItem);
                            if (seriesTooltipItem)
                                tooltipInfo.push(seriesTooltipItem);
                            if (latitudeTooltipItem)
                                tooltipInfo.push(latitudeTooltipItem);
                            if (longitudeTooltipItem)
                                tooltipInfo.push(longitudeTooltipItem);
                            if (sizeTooltipItem)
                                tooltipInfo.push(sizeTooltipItem);
                            if (gradientTooltipItem)
                                tooltipInfo.push(gradientTooltipItem);

                            if (tooltipBucketEnabled) {
                                TooltipBuilder.addTooltipBucketItem(reader, tooltipInfo, categoryIndex, seriesIndex);
                            }

                            // Do not create subslices for data points with null or zero if not filled map
                            if (subsliceValue || !hasSize || (subsliceValue === 0 && isFilledMap)) {
                                subDataPoints.push({
                                    value: subsliceValue,
                                    fill: fill,
                                    stroke: stroke,
                                    identity: identityBuilder.createSelectionId(),
                                    tooltipInfo: tooltipInfo,
                                });
                            }
                        }

                        // Skip data points that have a null or zero if not filled map
                        if (value || !hasSize || (value === 0 && isFilledMap)) {
                            dataPoints.push({
                                geocodingQuery: categoryValue,
                                value: value,
                                categoryValue: categoryValue,
                                subDataPoints: subDataPoints,
                                radius: Map.calculateRadius(categoryTotalRange, value),
                                location: location,
                            });
                        }
                    }
                }
            }

            let mapData: MapData = {
                dataPoints: dataPoints,
                geocodingCategory: geocodingCategory,
                hasDynamicSeries: hasDynamicSeries,
                hasSize: hasSize,
            };

            return mapData;
        }

        public static createLegendData(dataView: DataView, colorHelper: ColorHelper): LegendData {
            let reader = powerbi.data.createIDataViewCategoricalReader(dataView);
            let legendDataPoints: LegendDataPoint[] = [];
            let legendTitle: string;
            if (reader.hasDynamicSeries()) {
                legendTitle = reader.getSeriesDisplayName();
                let seriesColumnIdentifier = reader.getSeriesColumnIdentityFields();
                for (let seriesIndex = 0, seriesCount = reader.getSeriesCount(); seriesIndex < seriesCount; seriesIndex++) {
                    let color = colorHelper.getColorForSeriesValue(reader.getSeriesObjects(seriesIndex), seriesColumnIdentifier, <string>reader.getSeriesName(seriesIndex));
                    let identity = new SelectionIdBuilder().withSeries(reader.getSeriesValueColumns(), reader.getSeriesValueColumnGroup(seriesIndex)).createSelectionId();
                    legendDataPoints.push({
                        color: color,
                        label: valueFormatter.format(reader.getSeriesName(seriesIndex)),
                        icon: LegendIcon.Circle,
                        identity: identity,
                        selected: false,
                    });
                }
            }
            let legendData: LegendData = {
                dataPoints: legendDataPoints,
                title: legendTitle,
            };
            return legendData;
        }

        private swapLogoContainerChildElement() {
            // This is a workaround that allow maps to be printed from the IE and Edge browsers.
            // For some unknown reason, the presence of an <a> child element in the .LogoContainer
            // prevents dashboard map visuals from showing up when printed.
            // The trick is to swap out the <a> element with a <div> container.
            // There are no user impacts or visual changes.
            let logoContainer = this.element.find('.LogoContainer');

            if (logoContainer) {
                let aNode = logoContainer.find('a');
                if (aNode == null)
                    return;

                let divNode = $('<div>');
                aNode.children().clone().appendTo(divNode);
                aNode.remove();
                divNode.appendTo(logoContainer);
            }
        }

        public onResizing(viewport: IViewport): void {
            if (this.currentViewport.width !== viewport.width || this.currentViewport.height !== viewport.height) {
                this.currentViewport = viewport;
                this.renderLegend(this.legendData);
                this.updateInternal(false /* dataChanged */, false);
            }
        }

        private initialize(container: HTMLElement): void {
            let mapOptions = {
                credentials: MapUtil.Settings.BingKey,
                showMapTypeSelector: false,
                enableClickableLogo: false,
                enableSearchLogo: false,
                mapTypeId: Microsoft.Maps.MapTypeId.road,
                customizeOverlays: true,
                showDashboard: false,
                showScalebar: false,
                disableKeyboardInput: true, // Workaround for the BingMaps control moving focus from QnA
                disableZooming: this.disableZooming,
                disablePanning: this.disablePanning,
            };
            let divQuery = this.root = InJs.DomFactory.div().addClass(Map.MapContainer.cssClass).appendTo(container);
            this.mapControl = this.mapControlFactory.createMapControl(divQuery[0], mapOptions);

            if (this.viewChangeThrottleInterval !== undefined) {
                Microsoft.Maps.Events.addThrottledHandler(this.mapControl, 'viewchange', () => { this.onViewChanged(); },
                    this.viewChangeThrottleInterval);
            } else {
                Microsoft.Maps.Events.addHandler(this.mapControl, 'viewchange', () => { this.onViewChanged(); });
            }

            Microsoft.Maps.Events.addHandler(this.mapControl, "viewchangeend", () => { this.onViewChangeEnded(); });
            this.dataPointRenderer.init(this.mapControl, divQuery, !!this.behavior);

            if (!this.pendingGeocodingRender) {
                this.updateInternal(true /* dataChanged */, true);
            }
        }

        private onViewChanged() {
            this.updateOffsets(false, false /* dataChanged */);
            if (this.behavior)
                this.behavior.viewChanged();

            this.swapLogoContainerChildElement();
        }

        private onViewChangeEnded() {

            this.dataPointRenderer.updateInternalDataLabels(this.currentViewport, true);
        }

        private getMapViewPort(): IViewport {
            let currentViewport = this.currentViewport;
            let legendMargins = this.legend.getMargins();

            let mapViewport = {
                width: currentViewport.width - legendMargins.width,
                height: currentViewport.height - legendMargins.height,
            };

            return mapViewport;
        }

        public static removeTransform3d(mapRoot: JQuery): void {
            // don't remove transform3d from bing maps images in safari (using applewebkit engine)
            let userAgent = window.navigator.userAgent.toLowerCase();
            if (mapRoot && userAgent.indexOf('applewebkit') === -1) {
                let imageTiles = mapRoot.find('img');
                imageTiles.css('transform', '');
            }
        }

        private updateInternal(dataChanged: boolean, redrawDataLabels: boolean) {
            if (this.mapControl) {
                let isLegendVisible = this.legend.isVisible();

                if (!isLegendVisible)
                    this.legendData = { dataPoints: [] };

                let mapDiv = this.element.children(Map.MapContainer.selector);
                let mapViewport = this.getMapViewPort();
                mapDiv.height(mapViewport.height);
                mapDiv.width(mapViewport.width);

                // With the risk of double drawing, if the position updates to nearly the same, the map control won't call viewchange, so explicitly update the points
                this.updateOffsets(dataChanged, redrawDataLabels);

                // Set zoom level after we rendered that map as we need the max size of the bubbles/ pie slices to calculate it
                if (this.boundsHaveBeenUpdated && !(this.behavior && this.behavior.hasReceivedZoomOrPanEvent())) {
                    let levelOfDetail = this.getOptimumLevelOfDetail(mapViewport.width, mapViewport.height);
                    let center = this.getViewCenter(levelOfDetail);

                    this.updateMapView(center, levelOfDetail);
                }
            }
        }

        private updateMapView(center: Microsoft.Maps.Location, levelOfDetail: number): void {
            this.mapControl.setView({ center: center, zoom: levelOfDetail, animate: true });
        }

        private updateOffsets(dataChanged: boolean, redrawDataLabels: boolean) {
            let dataView = this.dataView;
            let data: MapRendererData;
            let viewport = this.getMapViewPort();
            if (dataView && dataView.categorical) {
                // currentViewport may not exist in UnitTests
                data = this.dataPointRenderer.converter(viewport, this.dataView, this.dataLabelsSettings, this.interactivityService, this.tooltipsEnabled);
            }
            else {
                data = {
                    bubbleData: [],
                    shapeData: [],
                    sliceData: [],
                };
            }

            let behaviorOptions = this.dataPointRenderer.updateInternal(data, viewport, dataChanged, this.interactivityService, redrawDataLabels);
            Legend.positionChartArea(d3.select(this.root[0]), this.legend);

            if (this.interactivityService && behaviorOptions) {
                this.interactivityService.bind(behaviorOptions.dataPoints, this.behavior, behaviorOptions);
            }
        }

        public onClearSelection(): void {
            this.interactivityService.clearSelection();
            this.updateOffsets(false, false /* dataChanged */);
        }

        private clearDataPoints(): void {
            this.dataPointRenderer.clearDataPoints();
            this.legend.drawLegend({ dataPoints: [] }, this.currentViewport);
        }

        private getDefaultMapControlFactory(): IMapControlFactory {
            return {
                createMapControl: (element: HTMLElement, options: Microsoft.Maps.MapOptions) => new Microsoft.Maps.Map(element, options),
                ensureMap: jsCommon.ensureMap,
            };
        }

        private static removeHillShading() {
            Microsoft.Maps.Globals.roadUriFormat = Microsoft.Maps.Globals.roadUriFormat.replace('&shading=hill', '');
        }
    }
}