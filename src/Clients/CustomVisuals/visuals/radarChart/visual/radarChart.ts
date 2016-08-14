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

/// <reference path="../../../_references.ts"/>

module powerbi.visuals.samples {
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    import CreateClassAndSelector = jsCommon.CssConstants.createClassAndSelector;
    import PixelConverter = jsCommon.PixelConverter;

    export interface RadarChartConstructorOptions {
        animator?: IGenericAnimator;
        svg?: D3.Selection;
        margin?: IMargin;
    }

    export interface RadarChartDatapoint extends SelectableDataPoint {
        x: number;
        y: number;
        y0?: number;
        color?: string;
        value?: number;
        tooltipInfo?: TooltipDataItem[];
        labelFormatString?: string;
        labelFontSize?: string;
    }

    export interface RadarChartData {
        legendData: LegendData;
        series: RadarChartSeries[];
        settings: RadarChartSettings;
        dataLabelsSettings: PointDataLabelsSettings;
    }

    export interface RadarChartSeries {
        fill: string;
        name: string;
        data: RadarChartDatapoint[];
        identity: SelectionId;
    }

    export interface RadarChartSettings {
        showLegend?: boolean;
    }

    export interface RadarChartBehaviorOptions {
        selection: D3.Selection;
        clearCatcher: D3.Selection;
    }

    /**
     * RadarChartBehavior
     */
    export class RadarChartWebBehavior implements IInteractiveBehavior {
        private selection: D3.Selection;

        public bindEvents(options: RadarChartBehaviorOptions, selectionHandler: ISelectionHandler): void {
            var selection = this.selection = options.selection;
            var clearCatcher = options.clearCatcher;

            selection.on('click', function (d: SelectableDataPoint) {
                selectionHandler.handleSelection(d, d3.event.ctrlKey);
                d3.event.stopPropagation();
            });

            clearCatcher.on('click', function () {
                selectionHandler.handleClearSelection();
            });
        }

        public renderSelection(hasSelection: boolean): void {
            this.selection.style("opacity", (d: SelectableDataPoint) => (hasSelection && !d.selected) ? RadarChart.DimmedAreaFillOpacity : RadarChart.NodeFillOpacity);
        }
    }

    export class RadarChart implements IVisual {
        public static capabilities: VisualCapabilities = {
            dataRoles: [
                {
                    displayName: 'Category',
                    name: 'Category',
                    kind: powerbi.VisualDataRoleKind.Grouping,
                },
                {
                    displayName: 'Y Axis',
                    name: 'Y',
                    kind: powerbi.VisualDataRoleKind.Measure,
                },
            ],
            dataViewMappings: [{
                conditions: [{ 'Category': { min: 1, max: 1 } }],
                categorical: {
                    categories: {
                        for: { in: 'Category' },
                        dataReductionAlgorithm: { top: {} }
                    },
                    values: {
                        select: [{ bind: { to: 'Y' } }]
                    }
                }
            }],
            objects: {
                general: {
                    displayName: data.createDisplayNameGetter('Visual_General'),
                    properties: {
                        formatString: {
                            type: { formatting: { formatString: true } },
                        },
                    },
                },
                legend: {
                    displayName: data.createDisplayNameGetter('Visual_Legend'),
                    description: data.createDisplayNameGetter('Visual_LegendDescription'),
                    properties: {
                        show: {
                            displayName: data.createDisplayNameGetter('Visual_Show'),
                            type: { bool: true }
                        },
                        position: {
                            displayName: data.createDisplayNameGetter('Visual_LegendPosition'),
                            description: data.createDisplayNameGetter('Visual_LegendPositionDescription'),
                            type: { enumeration: legendPosition.type }
                        },
                        showTitle: {
                            displayName: data.createDisplayNameGetter('Visual_LegendShowTitle'),
                            description: data.createDisplayNameGetter('Visual_LegendShowTitleDescription'),
                            type: { bool: true }
                        },
                        titleText: {
                            displayName: data.createDisplayNameGetter('Visual_LegendName'),
                            description: data.createDisplayNameGetter('Visual_LegendNameDescription'),
                            type: { text: true },
                            suppressFormatPainterCopy: true
                        },
                        labelColor: {
                            displayName: data.createDisplayNameGetter('Visual_LegendTitleColor'),
                            type: { fill: { solid: { color: true } } }
                        },
                        fontSize: {
                            displayName: data.createDisplayNameGetter('Visual_TextSize'),
                            type: { formatting: { fontSize: true } }
                        }
                    }
                },
                dataPoint: {
                    displayName: data.createDisplayNameGetter('Visual_DataPoint'),
                    description: data.createDisplayNameGetter('Visual_DataPointDescription'),
                    properties: {
                        fill: {
                            displayName: data.createDisplayNameGetter('Visual_Fill'),
                            type: { fill: { solid: { color: true } } }
                        }
                    }
                },
                labels: {
                    displayName: data.createDisplayNameGetter('Visual_DataPointsLabels'),
                    description: data.createDisplayNameGetter('Visual_DataPointsLabelsDescription'),
                    properties: {
                        show: {
                            displayName: data.createDisplayNameGetter('Visual_Show'),
                            type: { bool: true }
                        },
                        color: {
                            displayName: data.createDisplayNameGetter('Visual_LabelsFill'),
                            description: data.createDisplayNameGetter('Visual_LabelsFillDescription'),
                            type: { fill: { solid: { color: true } } }
                        },
                        labelDisplayUnits: {
                            displayName: data.createDisplayNameGetter('Visual_DisplayUnits'),
                            description: data.createDisplayNameGetter('Visual_DisplayUnitsDescription'),
                            type: { formatting: { labelDisplayUnits: true } },
                            suppressFormatPainterCopy: true,
                        },
                        labelPrecision: {
                            displayName: data.createDisplayNameGetter('Visual_Precision'),
                            description: data.createDisplayNameGetter('Visual_PrecisionDescription'),
                            placeHolderText: data.createDisplayNameGetter('Visual_Precision_Auto'),
                            type: { numeric: true },
                            suppressFormatPainterCopy: true,
                        },
                        fontSize: {
                            displayName: data.createDisplayNameGetter('Visual_TextSize'),
                            type: { formatting: { fontSize: true } }
                        },
                    }
                }
            }
        };

        /** Note: Public for testability */
        public static formatStringProp: DataViewObjectPropertyIdentifier = {
            objectName: 'general',
            propertyName: 'formatString',
        };

        private static Properties: any = {
            legend: {
                show: <DataViewObjectPropertyIdentifier>{ objectName: 'legend', propertyName: 'show' }
            },
            dataPoint: {
                fill: <DataViewObjectPropertyIdentifier>{ objectName: 'dataPoint', propertyName: 'fill' }
            },
            labels: {
                show: <DataViewObjectPropertyIdentifier>{ objectName: 'labels', propertyName: 'show' },
                color: <DataViewObjectPropertyIdentifier>{ objectName: 'labels', propertyName: 'color' },
                displayUnits: <DataViewObjectPropertyIdentifier>{ objectName: 'labels', propertyName: 'labelDisplayUnits' },
                precision: <DataViewObjectPropertyIdentifier>{ objectName: 'labels', propertyName: 'labelPrecision' },
                fontSize: <DataViewObjectPropertyIdentifier>{ objectName: 'labels', propertyName: 'fontSize' },
            }
        };

        private static VisualClassName = 'radarChart';
        private static Segments: ClassAndSelector = CreateClassAndSelector('segments');
        private static SegmentNode: ClassAndSelector = CreateClassAndSelector('segmentNode');
        private static ZeroSegment: ClassAndSelector = CreateClassAndSelector('zeroSegment');
        private static ZeroSegmentNode: ClassAndSelector = CreateClassAndSelector('zeroSegmentNode');
        private static ZeroLabel: ClassAndSelector = CreateClassAndSelector('zeroLabel');
        private static Axis: ClassAndSelector = CreateClassAndSelector('axis');
        private static AxisNode: ClassAndSelector = CreateClassAndSelector('axisNode');
        private static AxisLabel: ClassAndSelector = CreateClassAndSelector('axisLabel');
        private static Chart: ClassAndSelector = CreateClassAndSelector('chart');
        private static ChartNode: ClassAndSelector = CreateClassAndSelector('chartNode');
        private static ChartArea: ClassAndSelector = CreateClassAndSelector('chartArea');
        private static ChartPolygon: ClassAndSelector = CreateClassAndSelector('chartPolygon');
        private static ChartDot: ClassAndSelector = CreateClassAndSelector('chartDot');
        private static MaxPrecision: number = 17;
        private static MinPrecision: number = 0;

        private svg: D3.Selection;
        private segments: D3.Selection;
        private zeroSegment: D3.Selection;
        private axis: D3.Selection;
        private chart: D3.Selection;

        private mainGroupElement: D3.Selection;
        private colors: IDataColorPalette;
        private viewport: IViewport;
        private interactivityService: IInteractivityService;

        private animator: IGenericAnimator;
        private margin: IMargin;
        private legend: ILegend;
        private legendObjectProperties: DataViewObject;
        private radarChartData: RadarChartData;
        private isInteractiveChart: boolean;
        private zeroPointRadius: number;

        private static DefaultMargin: IMargin = {
            top: 50,
            bottom: 50,
            right: 100,
            left: 100
        };

        private static SegmentLevels: number = 6;
        private static SegmentFactor: number = 1;
        private static Radians: number = 2 * Math.PI;
        private static Scale: number = 1;
        public static NodeFillOpacity = 1;
        public static AreaFillOpacity = 0.6;
        public static DimmedAreaFillOpacity = 0.4;
        private angle: number;
        private radius: number;

        public static AxesLabelsFontFamily: string = "sans-serif";
        public static AxesLabelsfontSize: string = "11px";
        public static AxesLabelsMaxWidth: number = 200;

        public static converter(dataView: DataView, colors: IDataColorPalette): RadarChartData {
            if (!dataView ||
                !dataView.categorical ||
                !dataView.categorical.categories ||
                !(dataView.categorical.categories.length > 0) ||
                !dataView.categorical.categories[0] ||
                !dataView.categorical.values ||
                !(dataView.categorical.values.length > 0) ||
                !colors) {
                return {
                    legendData: {
                        dataPoints: []
                    },
                    settings: {
                        showLegend: true
                    },
                    series: [],
                    dataLabelsSettings: dataLabelUtils.getDefaultPointLabelSettings(),
                };
            }

            var catDv: DataViewCategorical = dataView.categorical,
                values: DataViewValueColumns = catDv.values,
                grouped: DataViewValueColumnGroup[] = catDv && catDv.values ? catDv.values.grouped() : null,
                series: RadarChartSeries[] = [],
                colorHelper = new ColorHelper(colors, RadarChart.Properties.dataPoint.fill);

            var legendData: LegendData = {
                fontSize: 8.25,
                dataPoints: [],
                title: ""
            };

            //Parse legend settings          
            var legendSettings: RadarChartSettings = RadarChart.parseSettings(dataView);
            var dataLabelsSettings: PointDataLabelsSettings = RadarChart.parseLabelSettings(dataView);

            for (var i = 0, iLen = values.length; i < iLen; i++) {
                var color = colors.getColorByIndex(i).value,
                    serieIdentity: SelectionId,
                    queryName: string,
                    displayName: string,
                    dataPoints: RadarChartDatapoint[] = [];

                var columnGroup: DataViewValueColumnGroup = grouped
                    && grouped.length > i && grouped[i].values? grouped[i] : null;

                if (values[i].source) {
                    var source = values[i].source;

                    if (source.queryName) {
                        queryName = source.queryName;
                        serieIdentity = SelectionId.createWithMeasure(queryName);
                    }

                    if (source.displayName)
                        displayName = source.displayName;

                    if (source.objects) {
                        var objects: any = source.objects;
                        color = colorHelper.getColorForMeasure(objects, queryName);
                    }
                }

                legendData.dataPoints.push({
                    label: displayName,
                    color: color,
                    icon: LegendIcon.Box,
                    selected: false,
                    identity: serieIdentity
                });

                for (var k = 0, kLen = values[i].values.length; k < kLen; k++) {
                    var dataPointIdentity: SelectionId = SelectionIdBuilder
                        .builder()
                        .withMeasure(queryName)
                        .withCategory(catDv.categories[0], k)
                        .withSeries(dataView.categorical.values, columnGroup)
                        .createSelectionId();

                    var tooltipInfo: TooltipDataItem[] = TooltipBuilder.createTooltipInfo(RadarChart.formatStringProp,
                        catDv,
                        catDv.categories[0].values[k],
                        values[i].values[k],
                        null,
                        null,
                        i);

                    var labelFormatString = valueFormatter.getFormatString(catDv.values[i].source, RadarChart.formatStringProp);
                    var fontSizeInPx = jsCommon.PixelConverter.fromPoint(dataLabelsSettings.fontSize);

                    dataPoints.push({
                        x: k,
                        y: <number>values[i].values[k],
                        color: color,
                        identity: dataPointIdentity,
                        selected: false,
                        tooltipInfo: tooltipInfo,
                        value: <number>values[i].values[k],
                        labelFormatString: labelFormatString,
                        labelFontSize: fontSizeInPx,
                    });
                }

                if (dataPoints.length > 0)
                    series.push({
                        fill: color,
                        name: displayName,
                        data: dataPoints,
                        identity: serieIdentity,
                    });
            }

            return {
                legendData: legendData,
                settings: legendSettings,
                series: series,
                dataLabelsSettings: dataLabelsSettings,
            };
        }

        public constructor(options?: RadarChartConstructorOptions) {
            if (options) {
                if (options.svg)
                    this.svg = options.svg;

                if (options.animator)
                    this.animator = options.animator;

                if (options.margin)
                    this.margin = options.margin;
            }
        }

        public init(options: VisualInitOptions): void {
            var element = options.element;

            if (!this.svg) {
                this.svg = d3.select(element.get(0)).append('svg');
                this.svg.style('position', 'absolute');
            }

            if (!this.margin)
                this.margin = RadarChart.DefaultMargin;

            this.svg.classed(RadarChart.VisualClassName, true);
            this.interactivityService = visuals.createInteractivityService(options.host);
            this.isInteractiveChart = options.interactivity && options.interactivity.isInteractiveLegend;
            this.legend = createLegend(element,
                this.isInteractiveChart,
                this.interactivityService,
                true,
                LegendPosition.Top);
            this.colors = options.style.colorPalette.dataColors;
            this.mainGroupElement = this.svg.append('g');

            this.segments = this.mainGroupElement
                .append('g')
                .classed(RadarChart.Segments.class, true);

            this.zeroSegment = this.mainGroupElement
                .append('g')
                .classed(RadarChart.ZeroSegment.class, true);

            this.axis = this.mainGroupElement
                .append('g')
                .classed(RadarChart.Axis.class, true);

            this.chart = this.mainGroupElement
                .append('g')
                .classed(RadarChart.Chart.class, true);
        }

        public update(options: VisualUpdateOptions): void {
            if (!options.dataViews || !options.dataViews[0])
                return;

            var dataView = options.dataViews[0];
            this.radarChartData = RadarChart.converter(dataView, this.colors);
            var categories: any[] = [],
                series = this.radarChartData.series,
                dataViewMetadataColumn: DataViewMetadataColumn,
                duration = AnimatorCommon.GetAnimationDuration(this.animator, options.suppressAnimations);

            if (dataView.categorical &&
                dataView.categorical.categories &&
                dataView.categorical.categories[0] &&
                dataView.categorical.categories[0].values)
                categories = dataView.categorical.categories[0].values;

            if (dataView.metadata && dataView.metadata.columns && dataView.metadata.columns.length > 0)
                dataViewMetadataColumn = dataView.metadata.columns[0];

            this.viewport = {
                height: options.viewport.height > 0 ? options.viewport.height : 0,
                width: options.viewport.width > 0 ? options.viewport.width : 0
            };

            this.parseLegendProperties(dataView);
            this.renderLegend(this.radarChartData);
            this.updateViewport();

            this.svg
                .attr({
                    'height': this.viewport.height,
                    'width': this.viewport.width
                });

            var mainGroup = this.mainGroupElement;
            mainGroup.attr('transform', SVGUtil.translate(this.viewport.width / 2, this.viewport.height / 2));

            var width: number = this.viewport.width - this.margin.left - this.margin.right;
            var height: number = this.viewport.height - this.margin.top - this.margin.bottom;

            this.angle = RadarChart.Radians / categories.length;
            this.radius = RadarChart.SegmentFactor * RadarChart.Scale * Math.min(width, height) / 2;

            this.drawCircularSegments(categories);
            this.drawAxes(categories);
            this.drawAxesLabels(categories, dataViewMetadataColumn);
            this.drawChart(series, duration);
            this.drawDataLabels(series);
            this.drawZeroCircularSegment(categories);

            if (this.zeroPointRadius !== 0)
                this.drawZeroLabel();
            else
                this.mainGroupElement.selectAll(RadarChart.ZeroLabel.selector).remove();
        }

        private getRadarChartLabelLayout(labelSettings: PointDataLabelsSettings, allDataPoints: RadarChartDatapoint[]): ILabelLayout {
            var formattersCache = dataLabelUtils.createColumnFormatterCacheManager();
            var angle: number = this.angle;
            var viewport = this.viewport;
            var halfHeight = this.viewport.height / 2;
            var halfWidth = this.viewport.width / 2;
            var y: any = this.calculateChartDomain(this.radarChartData.series);

            return {
                labelText: (d: RadarChartDatapoint) => {

                    var formmater = formattersCache.getOrCreate(d.labelFormatString, labelSettings);

                    if (labelSettings.displayUnits === 0) {
                        var maxDataPoint: RadarChartDatapoint = _.max(allDataPoints, d => d.value);
                        var maxValue = maxDataPoint.value > 0 ? maxDataPoint.value : 0;

                        formmater = formattersCache.getOrCreate(d.labelFormatString, labelSettings, maxValue);
                    }
                    return dataLabelUtils.getLabelFormattedText({ label: formmater.format(d.value), maxWidth: viewport.width, fontSize: labelSettings.fontSize });
                },
                labelLayout: {
                    x: (d: RadarChartDatapoint) => -1 * y(d.y) * Math.sin(d.x * angle) + halfWidth,
                    y: (d: RadarChartDatapoint) => -1 * y(d.y) * Math.cos(d.x * angle) + halfHeight - 7,
                },
                filter: (d: RadarChartDatapoint) => {
                    return (d != null && d.value != null);
                },
                style: {
                    'fill': labelSettings.labelColor,
                    'font-size': (d: RadarChartDatapoint) => PixelConverter.fromPoint(labelSettings.fontSize),
                },
            };
        }

        private drawCircularSegments(values: string[]): void {
            var data = [];
            var angle: number = this.angle,
                factor: number = RadarChart.SegmentFactor,
                levels: number = RadarChart.SegmentLevels,
                radius: number = this.radius;

            for (var level = 0; level < levels - 1; level++) {
                var levelFactor: number = radius * ((level + 1) / levels);
                var transform: number = -1 * levelFactor;

                for (var i = 0; i < values.length; i++)
                    data.push({
                        x1: levelFactor * (1 - factor * Math.sin(i * angle)),
                        y1: levelFactor * (1 - factor * Math.cos(i * angle)),
                        x2: levelFactor * (1 - factor * Math.sin((i + 1) * angle)),
                        y2: levelFactor * (1 - factor * Math.cos((i + 1) * angle)),
                        translate: SVGUtil.translate(transform, transform)
                    });
            }

            var selection = this.mainGroupElement
                .select(RadarChart.Segments.selector)
                .selectAll(RadarChart.SegmentNode.selector)
                .data(data);

            selection
                .enter()
                .append('svg:line')
                .classed(RadarChart.SegmentNode.class, true);
            selection
                .attr({
                    'x1': item => item.x1,
                    'y1': item => item.y1,
                    'x2': item => item.x2,
                    'y2': item => item.y2,
                    'transform': item => item.translate
                });

            selection.exit().remove();
        }

        private drawDataLabels(series: RadarChartSeries[]): void {
            var allDataPoints: RadarChartDatapoint[] = this.getAllDataPointsList(series);

            if (this.radarChartData.dataLabelsSettings.show) {
                var layout = this.getRadarChartLabelLayout(this.radarChartData.dataLabelsSettings, allDataPoints);
                var viewport = this.viewport;

                var labels = dataLabelUtils.drawDefaultLabelsForDataPointChart(allDataPoints, this.mainGroupElement, layout, viewport);
                labels.attr('transform', SVGUtil.translate(-(viewport.width / 2), -(viewport.height / 2)));
            }
            else
                dataLabelUtils.cleanDataLabels(this.mainGroupElement);
        }

        private drawAxes(values: string[]): void {
            var angle: number = this.angle,
                radius: number = -1 * this.radius;

            var selection: D3.Selection = this.mainGroupElement
                .select(RadarChart.Axis.selector)
                .selectAll(RadarChart.AxisNode.selector);

            var axis = selection.data(values);

            axis
                .enter()
                .append('svg:line');
            axis
                .attr({
                    'x1': 0,
                    'y1': 0,
                    'x2': (name, i) => radius * Math.sin(i * angle),
                    'y2': (name, i) => radius * Math.cos(i * angle)
                })
                .classed(RadarChart.AxisNode.class, true);

            axis.exit().remove();
        }

        private drawAxesLabels(values: string[], dataViewMetadataColumn?: DataViewMetadataColumn): void {
            var angle: number = this.angle,
                radius: number = -1 * this.radius,
                length: number = values.length;

            var formatter = valueFormatter.create({
                format: valueFormatter.getFormatString(dataViewMetadataColumn, RadarChart.formatStringProp, true),
                value: values[0],
                value2: values[length - 1],
            });

            var selection: D3.Selection = this.mainGroupElement
                .select(RadarChart.Axis.selector)
                .selectAll(RadarChart.AxisLabel.selector);

            var labels = selection.data(values);

            labels
                .enter()
                .append('svg:text');

            labels
                .attr({
                    'text-anchor': 'middle',
                    'dy': '1.5em',
                    'transform': SVGUtil.translate(0, -10),
                    'x': (name, i) => { return (radius - 30) * Math.sin(i * angle); },
                    'y': (name, i) => { return (radius - 20) * Math.cos(i * angle); }
                })
                .text(item => {
                    var properties: TextProperties = {
                        fontFamily: RadarChart.AxesLabelsFontFamily,
                        fontSize: RadarChart.AxesLabelsfontSize,
                        text: formatter.format(item)
                    };
                    return TextMeasurementService.getTailoredTextOrDefault(properties, Math.min(RadarChart.AxesLabelsMaxWidth, this.viewport.width));
                })
                .classed(RadarChart.AxisLabel.class, true);

            labels.exit().remove();
        }

        private drawChart(series: RadarChartSeries[], duration: number): void {
            var angle: number = this.angle,
                dotRadius: number = 5,
                dataPoints: RadarChartDatapoint[][] = this.getDataPoints(series);

            var stack = d3.layout.stack();
            var layers = stack(dataPoints);
            var y: any = this.calculateChartDomain(series);

            var calculatePoints = (points) => {
                return points.map((value) => {
                    var x1 = -1 * y(value.y) * Math.sin(value.x * angle);
                    var y1 = -1 * y(value.y) * Math.cos(value.x * angle);
                    return `${x1},${y1}`;
                }).join(' ');
            };

            var areas = this.chart.selectAll(RadarChart.ChartArea.selector).data(layers);

            areas
                .enter()
                .append('g')
                .classed(RadarChart.ChartArea.class, true);

            var polygon = areas.selectAll(RadarChart.ChartPolygon.selector).data(d => {
                if (d && d.length > 0) {
                    return [d];
                }

                return [];
            });
            polygon
                .enter()
                .append('polygon')
                .classed(RadarChart.ChartPolygon.class, true);
            polygon
                .style('fill', d => d[0].color)
                .style('opacity', RadarChart.DimmedAreaFillOpacity)
                .on('mouseover', function (d) {
                    d3.select(this).transition()
                        .duration(duration)
                        .style('opacity', RadarChart.AreaFillOpacity);
                })
                .on('mouseout', function (d) {
                    d3.select(this).transition()
                        .duration(duration)
                        .style('opacity', RadarChart.DimmedAreaFillOpacity);
                })
                .attr('points', calculatePoints);
            polygon.exit().remove();

            areas.exit().remove();
            var selection = this.chart.selectAll(RadarChart.ChartNode.selector).data(layers);

            selection
                .enter()
                .append('g')
                .classed(RadarChart.ChartNode.class, true);

            var dots = selection.selectAll(RadarChart.ChartDot.selector)
                .data((d: RadarChartDatapoint[]) => { return d.filter(d => d.y != null); });

            dots.enter()
                .append('svg:circle')
                .classed(RadarChart.ChartDot.class, true);
            dots.attr('r', dotRadius)
                .attr({
                    'cx': (value) => -1 * y(value.y) * Math.sin(value.x * angle),
                    'cy': (value) => -1 * y(value.y) * Math.cos(value.x * angle)
                })
                .style('fill', d => d.color);

            dots.exit().remove();
            TooltipManager.addTooltip(dots, (tooltipEvent: TooltipEvent) => tooltipEvent.data.tooltipInfo, true);

            selection.exit().remove();
            var behaviorOptions: RadarChartBehaviorOptions = undefined;

            if (this.interactivityService) {
                // Register interactivity
                var dataPointsToBind = this.getAllDataPointsList(series);

                behaviorOptions = { selection: dots, clearCatcher: this.svg };
                this.interactivityService.bind(dataPointsToBind, new RadarChartWebBehavior(), behaviorOptions);
            }
        }

        private calculateChartDomain(series: RadarChartSeries[]): any {
            var radius: number = this.radius,
                dataPointsList: RadarChartDatapoint[] = this.getAllDataPointsList(series);

            var minValue: number = d3.min(dataPointsList, (d) => { return d.y; });
            var maxValue: number = d3.max(dataPointsList, (d) => { return d.y; });

            if (this.isPercentChart(dataPointsList)) {
                minValue = minValue >= 0 ? 0 : -1;
                maxValue = maxValue <= 0 ? 0 : 1;
            }

            var y = d3.scale.linear()
                .domain([minValue, maxValue]).range([0, radius]);

            // Calculate zero ring radius
            this.zeroPointRadius = ((minValue < 0) && (maxValue > 0)) ? y(0) : 0;

            return y;
        }

        private renderLegend(radarChartData: RadarChartData): void {
            if (!radarChartData.legendData)
                return;

            var legendData: LegendData = radarChartData.legendData;

            if (this.legendObjectProperties) {
                LegendData.update(legendData, this.legendObjectProperties);
                var position = <string>this.legendObjectProperties[legendProps.position];

                if (position)
                    this.legend.changeOrientation(LegendPosition[position]);
            }
            else
                this.legend.changeOrientation(LegendPosition.Top);

            var viewport = this.viewport;
            this.legend.drawLegend(legendData, { height: viewport.height, width: viewport.width });
            Legend.positionChartArea(this.svg, this.legend);
        }

        private drawZeroCircularSegment(values: string[]): void {
            var data = [];
            var angle: number = this.angle,
                factor: number = RadarChart.SegmentFactor,
                radius: number = this.zeroPointRadius,
                transform: number = -1 * radius;

            for (var i = 0; i < values.length; i++)
                data.push({
                    x1: radius * (1 - factor * Math.sin(i * angle)),
                    y1: radius * (1 - factor * Math.cos(i * angle)),
                    x2: radius * (1 - factor * Math.sin((i + 1) * angle)),
                    y2: radius * (1 - factor * Math.cos((i + 1) * angle)),
                    translate: SVGUtil.translate(transform, transform)
                });

            var selection = this.mainGroupElement
                .select(RadarChart.ZeroSegment.selector)
                .selectAll(RadarChart.ZeroSegmentNode.selector)
                .data(data);

            selection
                .enter()
                .append('svg:line')
                .classed(RadarChart.ZeroSegmentNode.class, true);
            selection
                .attr({
                    'x1': item => item.x1,
                    'y1': item => item.y1,
                    'x2': item => item.x2,
                    'y2': item => item.y2,
                    'transform': item => item.translate
                });

            selection.exit().remove();
        }

        private drawZeroLabel() {
            var data = [];
            data.push({
                'x': this.zeroPointRadius * (1 - RadarChart.SegmentFactor) + 5,
                'y': -1 * this.zeroPointRadius
            });

            var zeroLabel = this.mainGroupElement
                .select(RadarChart.ZeroSegment.selector)
                .selectAll(RadarChart.ZeroLabel.selector).data(data);

            zeroLabel
                .enter()
                .append('text')
                .classed(RadarChart.ZeroLabel.class, true).text("0");
            zeroLabel
                .attr({
                    'x': item => item.x,
                    'y': item => item.y
                });
        }

        private getDataPoints(series: RadarChartSeries[]): RadarChartDatapoint[][] {
            var dataPoints: RadarChartDatapoint[][] = [];

            for (var i: number = 0; i < series.length; i++) {
                dataPoints.push(series[i].data);
            }

            return dataPoints;
        }

        private getAllDataPointsList(series: RadarChartSeries[]): RadarChartDatapoint[] {
            var dataPoints: RadarChartDatapoint[] = [];

            for (var i: number = 0; i < series.length; i++) {
                dataPoints = dataPoints.concat(series[i].data);
            }

            return dataPoints;
        }

        private isPercentChart(dataPointsList: RadarChartDatapoint[]): boolean {
            for (var i: number = 0; i < dataPointsList.length; i++) {
                if (dataPointsList[i].labelFormatString.indexOf("%") === -1) {
                    return false;
                }
            }

            return true;
        }

        private parseLegendProperties(dataView: DataView): void {
            if (!dataView || !dataView.metadata) {
                this.legendObjectProperties = {};
                return;
            }

            this.legendObjectProperties = DataViewObjects.getObject(dataView.metadata.objects, "legend", {});
        }

        private static parseSettings(dataView: DataView): RadarChartSettings {
            var objects: DataViewObjects;

            if (!dataView || !dataView.metadata || !dataView.metadata.columns || !dataView.metadata.objects)
                objects = null;
            else
                objects = dataView.metadata.objects;

            return {
                showLegend: DataViewObjects.getValue(objects, RadarChart.Properties.legend.show, true)
            };
        }

        private static getPrecision(value: number): number {
            return Math.max(RadarChart.MinPrecision, Math.min(RadarChart.MaxPrecision, value));
        }

        private static parseLabelSettings(dataView: DataView): PointDataLabelsSettings {
            var objects: DataViewObjects;

            if (!dataView || !dataView.metadata || !dataView.metadata.objects)
                objects = null;
            else
                objects = dataView.metadata.objects;

            var dataLabelsSettings: PointDataLabelsSettings = dataLabelUtils.getDefaultPointLabelSettings();

            var labelsObj: PointDataLabelsSettings = {
                show: DataViewObjects.getValue(objects, RadarChart.Properties.labels.show, dataLabelsSettings.show),
                labelColor: DataViewObjects.getFillColor(objects, RadarChart.Properties.labels.color, dataLabelsSettings.labelColor),
                displayUnits: DataViewObjects.getValue(objects, RadarChart.Properties.labels.displayUnits, dataLabelsSettings.displayUnits),
                precision: RadarChart.getPrecision(DataViewObjects.getValue(objects, RadarChart.Properties.labels.precision, dataLabelsSettings.precision)),
                fontSize: DataViewObjects.getValue(objects, RadarChart.Properties.labels.fontSize, dataLabelsSettings.fontSize),
                position: dataLabelsSettings.position
            };

            return labelsObj;
        }

        // This function returns the values to be displayed in the property pane for each object.
        // Usually it is a bind pass of what the property pane gave you, but sometimes you may want to do
        // validation and return other values/defaults
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            var enumeration = new ObjectEnumerationBuilder();
            var settings: RadarChartSettings;

            if (!this.radarChartData || !this.radarChartData.settings)
                return [];

            settings = this.radarChartData.settings;

            switch (options.objectName) {
                case "legend":
                    enumeration.pushInstance(this.enumerateLegend(settings));
                    break;
                case "dataPoint":
                    this.enumerateDataPoint(enumeration);
                    break;
                case 'labels':
                    this.enumerateDataLabels(enumeration);
                    break;
            }

            return enumeration.complete();
        }

        private getLabelSettingsOptions(enumeration: ObjectEnumerationBuilder, labelSettings: PointDataLabelsSettings): VisualDataLabelsSettingsOptions {
            return {
                enumeration: enumeration,
                dataLabelsSettings: labelSettings,
                show: true,
                displayUnits: true,
                precision: true,
                fontSize: true,
            };
        }

        private enumerateDataLabels(enumeration: ObjectEnumerationBuilder): void {
            var labelSettings = this.radarChartData.dataLabelsSettings;

            //Draw default settings
            dataLabelUtils.enumerateDataLabels(this.getLabelSettingsOptions(enumeration, labelSettings));
        }

        private enumerateLegend(settings: RadarChartSettings): VisualObjectInstance {
            var showTitle: boolean = true,
                titleText: string = "",
                legend: VisualObjectInstance,
                labelColor: DataColorPalette,
                fontSize: number = 8;

            showTitle = DataViewObject.getValue(this.legendObjectProperties, legendProps.showTitle, showTitle);
            titleText = DataViewObject.getValue(this.legendObjectProperties, legendProps.titleText, titleText);
            labelColor = DataViewObject.getValue(this.legendObjectProperties, legendProps.labelColor, labelColor);
            fontSize = DataViewObject.getValue(this.legendObjectProperties, legendProps.fontSize, fontSize);
            legend = {
                objectName: "legend",
                displayName: "legend",
                selector: null,
                properties: {
                    show: settings.showLegend,
                    position: LegendPosition[this.legend.getOrientation()],
                    showTitle: showTitle,
                    titleText: titleText,
                    labelColor: labelColor,
                    fontSize: fontSize,
                }
            };

            return legend;
        }

        private enumerateDataPoint(enumeration: ObjectEnumerationBuilder): void {
            if (!this.radarChartData || !this.radarChartData.series)
                return;

            var series: RadarChartSeries[] = this.radarChartData.series;

            for (var i: number = 0; i < series.length; i++) {
                var serie = series[i];

                enumeration.pushInstance({
                    objectName: "dataPoint",
                    displayName: serie.name,
                    selector: ColorHelper.normalizeSelector(serie.identity.getSelector(), false),
                    properties: {
                        fill: { solid: { color: serie.fill } }
                    }
                });
            }
        }

        private updateViewport(): void {
            var legendMargins: IViewport = this.legend.getMargins(),
                legendPosition: LegendPosition;

            legendPosition = LegendPosition[<string>this.legendObjectProperties[legendProps.position]];

            switch (legendPosition) {
                case LegendPosition.Top:
                case LegendPosition.TopCenter:
                case LegendPosition.Bottom:
                case LegendPosition.BottomCenter:
                    this.viewport.height -= legendMargins.height;
                    break;

                case LegendPosition.Left:
                case LegendPosition.LeftCenter:
                case LegendPosition.Right:
                case LegendPosition.RightCenter:
                    this.viewport.width -= legendMargins.width;
                    break;
            }
        }
    }
}