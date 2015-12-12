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

module powerbi.visuals.samples {
    import SelectionManager = utility.SelectionManager;
    import ValueFormatter = powerbi.visuals.valueFormatter;
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    import createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;

    export interface AreaRangeChartConstructorOptions {
        animator?: IGenericAnimator;
    }

    export interface AreaRangeChartSeries {
        name: string;
        data: AreaRangeChartDataPoint[];
        color: string;
        identity: SelectionId;
    }

    export interface AreaRangeChartDataPoint extends SelectableDataPoint, TooltipEnabledDataPoint, LabelEnabledDataPoint {
        x: number;
        y0: number;
        y1: number;
    }

    export interface AreaRangeChartLegend extends DataViewObject {
        show?: boolean;
        showTitle?: boolean;
        titleText?: string;
        position?: LegendPosition;
    }

    export interface AreaRangeChartSettings {
        displayName?: string;
        fillColor?: string;
        precision: number;
        legend?: AreaRangeChartLegend;
        colors?: IColorPalette;
    }

    export interface AreaRangeChartData {
        series: AreaRangeChartSeries[];
        categories: any[];
        legendData: LegendData;
        xAxisProperties: IAxisProperties;
        yAxisProperties: IAxisProperties;
        settings: AreaRangeChartSettings;
        formatter: IValueFormatter;
    }

    export class AreaRangeChart implements IVisual {

        private static properties = {
            general: {
                formatString: <DataViewObjectPropertyIdentifier>{
                    objectName: "general",
                    propertyName: "formatString"
                }
            },
            legend: {
                show: <DataViewObjectPropertyIdentifier>{ objectName: 'legend', propertyName: 'show' },
                position: <DataViewObjectPropertyIdentifier>{ objectName: 'legend', propertyName: 'position' },
                showTitle: <DataViewObjectPropertyIdentifier>{ objectName: 'legend', propertyName: 'showTitle' },
                titleText: <DataViewObjectPropertyIdentifier>{ objectName: 'legend', propertyName: 'titleText' },
            },
            dataPoint: {
                defaultColor: <DataViewObjectPropertyIdentifier>{ objectName: 'dataPoint', propertyName: 'defaultColor' },
                fill: <DataViewObjectPropertyIdentifier>{ objectName: 'dataPoint', propertyName: 'fill' },
                showAllDataPoints: <DataViewObjectPropertyIdentifier>{ objectName: 'dataPoint', propertyName: 'showAllDataPoints' },
            },
            labels: {
                labelPrecision: <DataViewObjectPropertyIdentifier>{
                    objectName: "labels",
                    propertyName: "labelPrecision"
                }
            }
        };

        private static RoleNames = {
            Category: "Category",
            Series: "Series",
            Lower: "Lower",
            Upper: "Upper",
        };

        public static capabilities: VisualCapabilities = {
            dataRoles: [
                {
                    name: AreaRangeChart.RoleNames.Category,
                    kind: powerbi.VisualDataRoleKind.Grouping,
                    displayName: data.createDisplayNameGetter("Role_DisplayName_Category")
                },
                {
                    name: AreaRangeChart.RoleNames.Series,
                    kind: powerbi.VisualDataRoleKind.Grouping,
                    displayName: data.createDisplayNameGetter("Role_DisplayName_Series")
                },
                {
                    name: AreaRangeChart.RoleNames.Lower,
                    kind: powerbi.VisualDataRoleKind.Measure,
                    displayName: 'Y1'
                },
                {
                    name: AreaRangeChart.RoleNames.Upper,
                    kind: powerbi.VisualDataRoleKind.Measure,
                    displayName: data.createDisplayNameGetter("Role_DisplayName_Y2")
                },
            ],
            dataViewMappings: [
                {
                    conditions: [
                        {
                            "Category": { max: 1 },
                            "Series": { max: 1 },
                            "Lower": { max: 1 },
                            "Upper": { max: 1 }
                        },
                    ],
                    categorical: {
                        categories: {
                            for: { in: AreaRangeChart.RoleNames.Category },
                            dataReductionAlgorithm: { top: {} }
                        },
                        values: {
                            group: {
                                by: AreaRangeChart.RoleNames.Series,
                                select: [
                                    { bind: { to: AreaRangeChart.RoleNames.Lower } },
                                    { bind: { to: AreaRangeChart.RoleNames.Upper } }
                                ]
                            },
                        },
                    }
                }
            ],
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
                    properties: {
                        show: {
                            displayName: data.createDisplayNameGetter('Visual_Show'),
                            type: { bool: true }
                        },
                        position: {
                            displayName: data.createDisplayNameGetter('Visual_LegendPosition'),
                            type: { formatting: { legendPosition: true } }
                        },
                        showTitle: {
                            displayName: data.createDisplayNameGetter('Visual_LegendShowTitle'),
                            type: { bool: true }
                        },
                        titleText: {
                            displayName: data.createDisplayNameGetter('Visual_LegendTitleText'),
                            type: { text: true }
                        }
                    }
                },
                dataPoint: {
                    displayName: data.createDisplayNameGetter('Visual_DataPoint'),
                    properties: {
                        defaultColor: {
                            displayName: data.createDisplayNameGetter('Visual_DefaultColor'),
                            type: { fill: { solid: { color: true } } }
                        },
                        showAllDataPoints: {
                            displayName: data.createDisplayNameGetter('Visual_DataPoint_Show_All'),
                            type: { bool: true }
                        },
                        fill: {
                            displayName: data.createDisplayNameGetter('Visual_Fill'),
                            type: { fill: { solid: { color: true } } }
                        }
                    }
                },
                label: {
                    displayName: data.createDisplayNameGetter("Label"),
                    properties: {
                        fill: {
                            displayName: data.createDisplayNameGetter("Fill"),
                            type: { fill: { solid: { color: true } } }
                        }
                    }
                }
            }
        };

        private static VisualClassName = 'areaRangeChart';

        private static Chart: ClassAndSelector = createClassAndSelector('chart');
        private static Area: ClassAndSelector = createClassAndSelector('area');
        private static Axis: ClassAndSelector = createClassAndSelector('axis');

        private static DimmedFillOpacity = 0.5;
        private static FillOpacity = 0.9;

        private svg: D3.Selection;

        private colors: IDataColorPalette;
        private selectionManager: SelectionManager;
        private dataView: DataView;
        private viewport: IViewport;

        private animator: IGenericAnimator;
        private margin: IMargin;
        private legend: ILegend;

        private data: AreaRangeChartData;

        private static DefaultSettings: AreaRangeChartSettings = {
            displayName: "Area Range Chart",
            precision: 2,
            legend: {
                show: true,
                position: LegendPosition.Top,
                showTitle: true,
            }
        };

        private static DefaultMargin: IMargin = {
            top: 20,
            bottom: 50,
            right: 0,
            left: 50,
        };

        private chart: D3.Selection;
        private axis: D3.Selection;
        private axisX: D3.Selection;
        private axisY: D3.Selection;

        private scaleType: string = axisScale.linear;

        public constructor(options?: AreaRangeChartConstructorOptions) {
            if (options) {
                this.animator = options.animator;
            }

            this.margin = AreaRangeChart.DefaultMargin;
        }

        public init(options: VisualInitOptions): void {
            let element = options.element;
            this.selectionManager = new SelectionManager({ hostServices: options.host });

            this.colors = options.style.colorPalette.dataColors;
            this.legend = createLegend(element, false, null);

            this.svg = d3.select(element.get(0))
                .append('svg')
                .classed(AreaRangeChart.VisualClassName, true);

            this.chart = this.svg
                .append('g')
                .classed(AreaRangeChart.Chart.class, true);

            this.axis = this.svg
                .append('g')
                .classed(AreaRangeChart.Axis.class, true);

            this.axisX = this.axis
                .append('g')
                .classed(AreaRangeChart.Axis.class, true);

            this.axisY = this.axis
                .append('g')
                .classed(AreaRangeChart.Axis.class, true);
        }

        public update(options: VisualUpdateOptions): void {
            if (!options.dataViews || !options.dataViews[0]) {
                return;
            }

            let dataView = this.dataView = options.dataViews[0];

            this.setSize(options.viewport);
            let data = this.data = this.converter(dataView, this.colors);

            let duration = AnimatorCommon.GetAnimationDuration(this.animator, options.suppressAnimations);
            this.render(data, duration);
        }

        private render(data: AreaRangeChartData, duration: number): void {
            if (!data || !data.settings) {
                this.svg.empty();
                return;
            }

            let legendData = data.legendData;

            this.renderAxis(data, duration);
            this.renderChart(data, duration);

            if (data.settings.legend) {
                LegendData.update(legendData, data.settings.legend);
                this.legend.changeOrientation(data.settings.legend.position);
            }

            this.legend.drawLegend(legendData, this.viewport);
        }

        private setSize(viewport: IViewport): void {
            let height: number,
                width: number;

            height = viewport.height - this.margin.top - this.margin.bottom;
            width = viewport.width - this.margin.left - this.margin.right;

            this.viewport = {
                height: height,
                width: width
            };

            this.updateElements(viewport.height, viewport.width);
        }

        private updateElements(height: number, width: number): void {
            this.svg.attr({
                'height': height,
                'width': width
            });
            this.chart.attr('transform', SVGUtil.translate(this.margin.left, this.margin.top));
            this.axisY.attr('transform', SVGUtil.translate(this.margin.left, this.margin.top));
            this.axisX.attr('transform', SVGUtil.translate(this.margin.left, this.margin.top + this.viewport.height));
        }

        private getObjectsFromDataView(dataView: DataView): DataViewObjects {
            if (!dataView ||
                !dataView.metadata ||
                !dataView.metadata.columns ||
                !dataView.metadata.objects) {
                return null;
            }

            return this.dataView.metadata.objects;
        }

        private getPrecision(objects: DataViewObjects): number {
            let precision: number = DataViewObjects.getValue(
                objects,
                AreaRangeChart.properties.labels.labelPrecision,
                AreaRangeChart.DefaultSettings.precision);

            return precision;
        }

        private getLegendSettings(objects: DataViewObjects): DataViewObject {
            let legend: any = objects["legend"];

            legend.show = DataViewObjects.getValue(objects,
                AreaRangeChart.properties.legend.show,
                AreaRangeChart.DefaultSettings.legend.show);
            legend.position = DataViewObjects.getValue(objects,
                AreaRangeChart.properties.legend.position,
                AreaRangeChart.DefaultSettings.legend.position);
            legend.showTitle = DataViewObjects.getValue(objects,
                AreaRangeChart.properties.legend.showTitle,
                AreaRangeChart.DefaultSettings.legend.showTitle);
            legend.titleText = DataViewObjects.getValue(objects,
                AreaRangeChart.properties.legend.titleText,
                AreaRangeChart.DefaultSettings.legend.titleText);

            return legend;
        }

        private getDataColorsSettings(objects: DataViewObjects): IColorPalette {
            let legend: any = objects["dataPoints"];
            return legend;
        }

        private parseSettings(dataView: DataView): AreaRangeChartSettings {
            let settings: AreaRangeChartSettings = <AreaRangeChartSettings>{},
                objects: DataViewObjects;

            settings.displayName = AreaRangeChart.DefaultSettings.displayName;
            settings.fillColor = AreaRangeChart.DefaultSettings.fillColor;

            objects = this.getObjectsFromDataView(dataView);

            if (objects) {
                settings.precision = this.getPrecision(objects);

                settings.legend = this.getLegendSettings(objects);
                settings.colors = this.getDataColorsSettings(objects);
            }
            return settings;
        }

        private getTooltipData(categoryColumn: DataViewCategoricalColumn, y0: any, y1: any, categoryIndex: number, valueFormatter: IValueFormatter): TooltipDataItem[] {
            return [
                {
                    displayName: categoryColumn.source.displayName,
                    value: categoryColumn.values[categoryIndex],
                }, {
                    displayName: y0.source.displayName,
                    value: valueFormatter.format(y0.values[categoryIndex])
                }, {
                    displayName: y1.source.displayName,
                    value: valueFormatter.format(y1.values[categoryIndex])
                }];
        }

        public converter(dataView: DataView, colors: IDataColorPalette): AreaRangeChartData {
            let settings: AreaRangeChartSettings,
                categories: any[],
                valueColumns: DataViewValueColumns,
                valueFormatter: IValueFormatter;

            if (!dataView ||
                !dataView.categorical ||
                !dataView.categorical.categories ||
                !dataView.categorical.categories[0] ||
                !dataView.categorical.categories[0].values ||
                !(dataView.categorical.categories[0].values.length > 0) ||
                !dataView.categorical.values) {
                return;
            }

            settings = this.parseSettings(dataView);
            if (!settings) {
                return;
            }

            let categoryColumn = dataView.categorical.categories[0];
            categories = categoryColumn.values;
            valueColumns = dataView.categorical.values;
            let grouped: DataViewValueColumnGroup[] = valueColumns.grouped();
            let lowerMeasureIndex = DataRoleHelper.getMeasureIndexOfRole(grouped, AreaRangeChart.RoleNames.Lower);
            let upperMeasureIndex = DataRoleHelper.getMeasureIndexOfRole(grouped, AreaRangeChart.RoleNames.Upper);
            let colorHelper = new ColorHelper(this.colors, AreaRangeChart.properties.dataPoint.fill, settings.fillColor);
            let hasDynamicSeries = !!valueColumns.source;

            if (lowerMeasureIndex < 0 || upperMeasureIndex < 0) {
                return;
            }

            valueFormatter = ValueFormatter.create({
                format: ValueFormatter.getFormatString(valueColumns[0].source, AreaRangeChart.properties.general.formatString),
                value: valueColumns[0],
                precision: settings.precision
            });

            let series: AreaRangeChartSeries[] = [];
            for (let seriesIndex = 0; seriesIndex < grouped.length; seriesIndex++) {
                let group: DataViewValueColumnGroup = grouped[seriesIndex];
                let color = colorHelper.getColorForSeriesValue(group.objects, valueColumns.identityFields, group.name);
                let id = SelectionIdBuilder
                    .builder()
                    .withSeries(valueColumns, group)
                    .createSelectionId();

                let dataPoints: AreaRangeChartDataPoint[] = [];
                for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
                    let y0_group = group.values[lowerMeasureIndex];
                    let y1_group = group.values[upperMeasureIndex];

                    let y0 = y0_group.values[categoryIndex];
                    let y1 = y1_group.values[categoryIndex];

                    let pointId = SelectionIdBuilder
                        .builder()
                        .withSeries(valueColumns, group)
                        .withCategory(categoryColumn, categoryIndex)
                        .createSelectionId();

                    dataPoints.push({
                        x: categoryIndex,
                        y0: y0,
                        y1: y1,
                        tooltipInfo: this.getTooltipData(categoryColumn, y0_group, y1_group, categoryIndex, valueFormatter),
                        identity: pointId,
                        selected: false,
                    });
                }

                series.push({
                    name: group.name,
                    color: color,
                    data: dataPoints,
                    identity: id,
                });
            };

            let legendTitle = hasDynamicSeries ? valueColumns.source.displayName : "";

            return {
                xAxisProperties: this.getXAxisProperties(categoryColumn),
                yAxisProperties: this.getYAxisProperties(valueColumns, lowerMeasureIndex, upperMeasureIndex),
                settings: settings,
                series: series,
                legendData: this.getLegend(series, legendTitle),
                categories: categories,
                formatter: valueFormatter,
            };
        }

        private calculateYDomain(valueColumns: DataViewValueColumns, lowerMeasureIndex: number, upperMeasureIndex: number): number[] {
            let min = 0,
                max = 0;
            for (let i = 0; i < valueColumns.length; i++) {
                let range = AxisHelper.getRangeForColumn(valueColumns[i]);
                if (range.min < min) {
                    min = range.min;
                }
                if (range.max > max) {
                    max = range.max;
                }
            }

            return [min, max];
        }

        private getXAxisProperties(categoryColumn: DataViewCategoricalColumn): IAxisProperties {
            let xDomain = _.range(0, categoryColumn.values.length);

            let categoryThickness = this.viewport.width / (xDomain.length + (CartesianChart.OuterPaddingRatio * 2));
            categoryThickness = Math.max(categoryThickness, CartesianChart.MinOrdinalRectThickness);

            let xAxisProperties = AxisHelper.createAxis({
                pixelSpan: this.viewport.width,
                dataDomain: xDomain,
                metaDataColumn: categoryColumn.source,
                formatStringProp: AreaRangeChart.properties.general.formatString,
                outerPadding: 0,
                isScalar: false,
                isVertical: false,
                useTickIntervalForDisplayUnits: true,
                getValueFn: (index, type) => categoryColumn.values[index],
                categoryThickness: categoryThickness,
                isCategoryAxis: true,
                scaleType: this.scaleType,
            });

            return xAxisProperties;
        }

        private getYAxisProperties(valueColumns: DataViewValueColumns, lowerMeasureIndex: number, upperMeasureIndex: number): IAxisProperties {
            let grouped = valueColumns.grouped();
            let yDomain = this.calculateYDomain(valueColumns, lowerMeasureIndex, upperMeasureIndex);

            let yAxisProperties = AxisHelper.createAxis({
                pixelSpan: this.viewport.height,
                dataDomain: yDomain,
                metaDataColumn: grouped[0].values[lowerMeasureIndex].source,
                formatStringProp: AreaRangeChart.properties.general.formatString,
                outerPadding: 0,
                isScalar: true,
                isVertical: true,
                useTickIntervalForDisplayUnits: true,
                isCategoryAxis: false,
                scaleType: this.scaleType,
            });

            return yAxisProperties;
        }

        private renderAxis(data: AreaRangeChartData, duration: number): void {
            let xAxis = data.xAxisProperties.axis;
            let yAxis = data.yAxisProperties.axis;

            xAxis.orient('bottom');
            yAxis.orient('left');

            this.axisX
                .transition()
                .duration(duration)
                .call(xAxis);

            this.axisY
                .transition()
                .duration(duration)
                .call(yAxis);
        }

        private renderChart(data: AreaRangeChartData, duration: number): void {
            let series: AreaRangeChartSeries[] = data.series,
                xScale: D3.Scale.OrdinalScale = <D3.Scale.OrdinalScale>data.xAxisProperties.scale,
                yScale: D3.Scale.LinearScale = <D3.Scale.LinearScale>data.yAxisProperties.scale,
                sm = this.selectionManager;

            let area: D3.Svg.Area = d3.svg.area()
                .x((d: AreaRangeChartDataPoint) => (xScale(d.x) + xScale.rangeBand() / 2))
                .y0((d: AreaRangeChartDataPoint) => yScale(d.y0))
                .y1((d: AreaRangeChartDataPoint) => yScale(d.y1));

            let selection = this.chart.selectAll(AreaRangeChart.Area.selector).data(series);

            selection
                .enter()
                .append('svg:path')
                .classed(AreaRangeChart.Area.class, true);

            selection
                .attr('fill', (d: AreaRangeChartSeries) => d.color)
                .attr('stroke', (d: AreaRangeChartSeries) => d.color)
                .attr('d', (d: AreaRangeChartSeries) => area(d.data))
                .style('fill-opacity', AreaRangeChart.DimmedFillOpacity)
                .on('click', function(d: AreaRangeChartSeries) {
                    sm.select(d.identity).then(ids => {
                        if (ids.length > 0) {
                            selection.style('fill-opacity', AreaRangeChart.DimmedFillOpacity);
                            d3.select(this).transition()
                                .duration(duration)
                                .style('fill-opacity', AreaRangeChart.FillOpacity);
                        } else {
                            selection.style('fill-opacity', AreaRangeChart.DimmedFillOpacity);
                        }
                    });
                    d3.event.stopPropagation();
                });

            selection.exit().remove();
            this.renderTooltip(selection, xScale);
        }

        private static findClosestXAxisIndex(currentX: number, xAxisValues: AreaRangeChartDataPoint[]): number {
            let closestValueIndex: number = -1;
            let minDistance = Number.MAX_VALUE;
            for (let i in xAxisValues) {
                let distance = Math.abs(currentX - (<AreaRangeChartDataPoint>xAxisValues[i]).x);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestValueIndex = i;
                }
            }
            return closestValueIndex;
        }

        public static getTooltipInfoByPointX(pointData: any, xScale: D3.Scale.OrdinalScale, pointX: number): TooltipDataItem[] {

            let index: number = 0;
            let currentX = powerbi.visuals.AxisHelper.invertScale(xScale, pointX);
            index = AreaRangeChart.findClosestXAxisIndex(currentX, pointData.data);
            return pointData.data[index].tooltipInfo;
        }

        private renderTooltip(selection: D3.UpdateSelection, xScale: D3.Scale.OrdinalScale): void {
            TooltipManager.addTooltip(selection, (tooltipEvent: TooltipEvent) => {
                let pointX: number = tooltipEvent.elementCoordinates[0];
                return AreaRangeChart.getTooltipInfoByPointX(tooltipEvent.data, xScale, pointX);
            }, true);
        }

        private getLegend(series: AreaRangeChartSeries[], title: string): LegendData {
            let legendItems: LegendDataPoint[] = [];
            for (let i = 0; i < series.length; i++) {
                let value: AreaRangeChartSeries = series[i];
                if (!value.identity.hasIdentity()) {
                    continue;
                }

                legendItems.push({
                    label: value.name,
                    color: value.color,
                    icon: LegendIcon.Box,
                    selected: false,
                    identity: value.identity,
                });
            }

            return {
                dataPoints: legendItems,
                title: title,
            };
        }

        private enumerateLegend(enumeration: ObjectEnumerationBuilder): ObjectEnumerationBuilder {
            let data = this.data;
            if (!data) {
                return;
            }

            let legendObjectProperties: DataViewObjects = { legend: data.settings.legend };

            let show = DataViewObjects.getValue(legendObjectProperties, AreaRangeChart.properties.legend.show, this.legend.isVisible());
            let showTitle = DataViewObjects.getValue(legendObjectProperties, AreaRangeChart.properties.legend.showTitle, true);
            let titleText = DataViewObjects.getValue(legendObjectProperties, AreaRangeChart.properties.legend.titleText, this.data.legendData.title);

            enumeration.pushInstance({
                selector: null,
                objectName: 'legend',
                properties: {
                    show: show,
                    position: LegendPosition[this.legend.getOrientation()],
                    showTitle: showTitle,
                    titleText: titleText
                }
            });
        }

        private enumerateDataPoints(enumeration: ObjectEnumerationBuilder): ObjectEnumerationBuilder {
            let data = this.data;
            if (!data)
                return;

            let series = data.series;

            for (let i = 0; i < series.length; i++) {
                let item = series[i];

                let color = item.color;
                let selector = item.identity.getSelector();
                let isSingleSeries = !!selector.data;

                enumeration.pushInstance({
                    objectName: 'dataPoint',
                    displayName: item.name,
                    selector: ColorHelper.normalizeSelector(selector, isSingleSeries),
                    properties: {
                        fill: { solid: { color: color } }
                    },
                });
            }
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            let enumeration = new ObjectEnumerationBuilder();

            switch (options.objectName) {
                case 'legend':
                    this.enumerateLegend(enumeration);
                    break;
                case 'dataPoint':
                    this.enumerateDataPoints(enumeration);
                    break;
            }
            return enumeration.complete();
        }
    }
}
