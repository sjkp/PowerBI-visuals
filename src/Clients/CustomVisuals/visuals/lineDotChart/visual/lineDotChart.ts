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
    import SelectionManager = utility.SelectionManager;

    export interface LineDotPoint {
        time: number | Date;
        value: number;
        dot: number;
        sum: number;
        selector: SelectionId;
    }

    export interface Legend {
        text: string;
        transform?: string;
        dx?: string;
        dy?: string;
    }

    export interface LineDotChartViewModel {
        points: LineDotPoint[];
        settings: LineDotChartSettings;
        xAxis: IAxisProperties;
        yAxis: IAxisProperties;
        yAxis2: IAxisProperties;
        legends: Legend[];
    };

    export interface LineDotChartSettings {
        lineFill: string;
        lineThickness: number;
        dotFill: string;
        dotSizeMin: number;
        dotSizeMax: number;
        counterTitle: string;
        // precision: number;
        xAxisTitle: string;
        yAxisTitle: string;
        duration: number;
        isanimated: boolean;
        isstopped: boolean;
    };

    export class LineDotChart implements IVisual {
        private selectionManager: SelectionManager;
        private hostServices: IVisualHostServices;
        private isDateTime: boolean;

        private static DefaultSettings: LineDotChartSettings = {
            lineFill: 'rgb(102, 212, 204)',
            lineThickness: 3,
            dotFill: '#005c55',
            dotSizeMin: 4,
            dotSizeMax: 38,
            counterTitle: 'Total features',
            // precision: 2,
            xAxisTitle: '',
            yAxisTitle: '',
            duration: 20,
            isanimated: true,
            isstopped: true
        };

        /**
        * Informs the System what it can do
        * Fields, Formatting options, data reduction & QnA hints
        */
        public static capabilities: VisualCapabilities = {
            dataRoles: [
                {
                    name: "Date",
                    kind: VisualDataRoleKind.Grouping,
                    displayName: 'Date'
                }, 
                {
                    name: "Values",
                    kind: VisualDataRoleKind.Measure,
                    displayName:'Values'
                },
                // {
                //     name: "Labels",
                //     kind: VisualDataRoleKind.Measure,
                //     displayName: 'Labels'
                // }
            ],
            dataViewMappings: [{
                conditions: [{
                    "Date": {
                        min: 0,
                        max: 1
                    },
                    "Values": {
                        min: 0,
                        max: 1
                    },
                    "Labels": {
                        min: 0,
                        max: 1
                    }
                }],
                categorical: {
                    categories: {
                        for: { in: "Date" },
                        dataReductionAlgorithm: { sample: {} }
                    },
                    values: {
                        for: { in: "Values" }
                    },
                    // labels: {
                    //     for: { in: "Labels" }
                    // }
                }
            }],
            objects: {
                general: {
                    displayName: data.createDisplayNameGetter("Visual_General"),
                    properties: {
                        formatString: {
                            type: {
                                formatting: {
                                    formatString: true
                                }
                            },
                        }
                    },
                },
                lineoptions: {
                    displayName: 'Line',
                    properties: {
                        fill: {
                            displayName: data.createDisplayNameGetter('Visual_Fill'),
                            type: { fill: { solid: { color: true } } }
                        },
                        lineThickness: {
                            displayName: 'Thickness',
                            type: { numeric: true }
                        }
                    }
                },
                dotoptions: {
                    displayName: 'Dot',
                    properties: {
                        color: {
                            displayName: data.createDisplayNameGetter('Visual_Fill'),
                            type: { fill: { solid: { color: true } } }
                        },
                        dotSizeMin: {
                            displayName: 'Min size',
                            type: { numeric: true }
                        },
                        dotSizeMax: {
                            displayName: 'Min size',
                            type: { numeric: true }
                        }
                    }
                },
                counteroptions: {
                    displayName: 'Counter',
                    properties: {
                        counterTitle: {
                            displayName: 'Title',
                            type: { text: true }
                        }
                    }
                },
                misc: {
                    displayName: 'Animation',
                    properties: {
                        isanimated: {
                            displayName: 'Animated',
                            type: { bool: true }
                        },
                        isstopped: {
                            displayName: 'Stop on load',
                            type: { bool: true }
                        },
                        duration: {
                            displayName: 'Time',
                            type: { numeric: true }
                        }
                    }
                }
                // ,
                // labels: {
                //     displayName: data.createDisplayNameGetter('Visual_DataPointsLabels'),
                //     properties: {
                //         labelPrecision: {
                //             displayName: data.createDisplayNameGetter('Visual_Precision'),
                //             type: { numeric: true }
                //         }
                //     }
                // }
            }
        };

        private static Identity: ClassAndSelector = {
            "class": "lineDotChart",
            selector: ".lineDotChart"
        };

        private static Axes: ClassAndSelector = {
            "class": "axes",
            selector: ".axes"
        };

        private static Axis: ClassAndSelector = {
            "class": "axis",
            selector: ".axis"
        };

        private static Legends: ClassAndSelector = {
            "class": "legends",
            selector: ".legends"
        };

        private static Legend: ClassAndSelector = {
            "class": "legend",
            selector: ".legend"
        };

        private static Values: ClassAndSelector = {
            "class": "line",
            selector: ".line"
        };

        private static Properties: any = {
            general: {
                formatString: <DataViewObjectPropertyIdentifier>{
                    objectName: "general",
                    propertyName: "formatString"
                }
            },
            lineoptions: {
                fill: <DataViewObjectPropertyIdentifier>{
                    objectName: "lineoptions",
                    propertyName: "fill"
                },
                lineThickness: <DataViewObjectPropertyIdentifier>{
                    objectName: "lineoptions",
                    propertyName: "lineThickness"
                }
            },
            dotoptions: {
                color: <DataViewObjectPropertyIdentifier>{
                    objectName: "dotoptions",
                    propertyName: "color"
                },
                dotSizeMin: <DataViewObjectPropertyIdentifier>{
                    objectName: "dotoptions",
                    propertyName: "dotSizeMin"
                },
                dotSizeMax: <DataViewObjectPropertyIdentifier>{
                    objectName: "dotoptions",
                    propertyName: "dotSizeMax"
                }
            },
            counteroptions: {
                counterTitle: <DataViewObjectPropertyIdentifier>{
                    objectName: "counteroptions",
                    propertyName: "counterTitle"
                }
            },
            // labels: {
            //     labelPrecision: <DataViewObjectPropertyIdentifier>{
            //         objectName: "labels",
            //         propertyName: "labelPrecision"
            //     }
            // },
            misc: {
                isanimated: <DataViewObjectPropertyIdentifier>{
                    objectName: "misc",
                    propertyName: "isanimated"
                },
                isstopped: <DataViewObjectPropertyIdentifier>{
                    objectName: "misc",
                    propertyName: "isstopped"
                },
                duration: <DataViewObjectPropertyIdentifier>{
                    objectName: "misc",
                    propertyName: "duration"
                }
            }
        };

        private model: LineDotChartViewModel;
        private root: D3.Selection;
        private main: D3.Selection;
        private axes: D3.Selection;
        private axisX: D3.Selection;
        private axisY: D3.Selection;
        private axisY2: D3.Selection;
        private legends: D3.Selection;
        private line: D3.Selection;
        private colors: IDataColorPalette;

        private margin: IMargin = {
            top: 10,
            right: 30,
            bottom: 10,
            left: 10
        };

        private LegendSize: number = 50;
        private AxisSize: number = 30;

        /* One time setup*/
        public init(options: VisualInitOptions): void {
            this.hostServices = options.host;
            this.selectionManager = new SelectionManager({ hostServices: this.hostServices });
            this.root = d3.select(options.element.get(0))
                .append('svg')
                .classed(LineDotChart.Identity.class, true);

            this.root.on('click', (d: LineDotPoint) => { this.clearSelection(); } );

            this.main = this.root.append('g');
            this.axes = this.main.append('g').classed(LineDotChart.Axes.class, true);
            this.axisX = this.axes.append('g').classed(LineDotChart.Axis.class, true);
            this.axisY = this.axes.append('g').classed(LineDotChart.Axis.class, true);
            this.axisY2 = this.axes.append('g').classed(LineDotChart.Axis.class, true);
            this.legends = this.main.append('g').classed(LineDotChart.Legends.class, true);
            this.line = this.main.append('g').classed(LineDotChart.Values.class, true);

            this.colors = options.style && options.style.colorPalette
                ? options.style.colorPalette.dataColors
                : new DataColorPalette();
        }

        /* Called for data, size, formatting changes*/
        public update(options: VisualUpdateOptions) {
            if (!options.dataViews || !options.dataViews[0]) {
                return;
            }

            var viewport: IViewport = options.viewport;
            var model: LineDotChartViewModel = this.model = this.converter(options.dataViews[0], viewport);
            // if (!model) {
            //     return;
            // }

            this.clearSelection();
            this.resize(viewport);
            // this.draw(model, !options.suppressAnimations);
            this.draw(model);
        }

        /*About to remove your visual, do clean up here */
        public destroy() {
            this.root = null;
        }

        public setIsStopped(isstopped: Boolean): void {
            var objects: VisualObjectInstancesToPersist = {
                merge: [
                    <VisualObjectInstance>{
                        objectName: "misc",
                        selector: undefined,
                        properties: {
                            "isstopped": isstopped,
                        }
                    }
                ]
            };
            this.hostServices.persistProperties(objects);
            this.hostServices.onSelect({ visualObjects: [] });
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
            var instances: VisualObjectInstance[] = [];

            if (!this.model || !this.model.settings) {
                return instances;
            }

            var settings: LineDotChartSettings = this.model.settings;

            switch (options.objectName) {
                case "lineoptions":
                    var lineoptions: VisualObjectInstance = {
                        objectName: "lineoptions",
                        displayName: "lineoptions",
                        selector: null,
                        properties: {
                            fill: settings.lineFill,
                            lineThickness: settings.lineThickness
                        }
                    };

                    instances.push(lineoptions);
                    break;

                case "dotoptions":
                    var dotoptions: VisualObjectInstance = {
                        objectName: "dotoptions",
                        displayName: "dotoptions",
                        selector: null,
                        properties: {
                            color: settings.dotFill,
                            dotSizeMin: settings.dotSizeMin,
                            dotSizeMax: settings.dotSizeMax
                        }
                    };

                    instances.push(dotoptions);
                    break;

                case "counteroptions":
                    var counteroptions: VisualObjectInstance = {
                        objectName: "counteroptions",
                        displayName: "counteroptions",
                        selector: null,
                        properties: {
                            counterTitle: settings.counterTitle
                        }
                    };

                    instances.push(counteroptions);
                    break;

                // case "labels":
                //     var labels: VisualObjectInstance = {
                //         objectName: "labels",
                //         displayName: "labels",
                //         selector: null,
                //         properties: {
                //             labelPrecision: settings.precision
                //         }
                //     };

                //     instances.push(labels);
                //     break;

                case "misc": 
                    var misc: VisualObjectInstance = {
                        objectName: "misc",
                        displayName: "misc",
                        selector: null,
                        properties: {
                            isanimated: settings.isanimated,
                            isstopped: settings.isstopped,
                            duration: settings.duration
                        }
                    };

                    instances.push(misc);
                    break;
            }

            return instances;
        }

        private selectDot(dotelement: SVGCircleElement, selector: SelectionId) {
            var dot: D3.Selection = d3.select(dotelement);
            if (!dot.classed('point_selected')) {
                if (selector) {
                    this.selectionManager.select(selector);
                }

                this.root.classed("filtered", true);
                this.line.selectAll('circle.point')
                    .classed('point_selected', false);
                d3.select(dotelement)
                    .classed('point_selected', true);
            } else {
                this.clearSelection();
            }

            d3.event.stopPropagation();
        }

        private clearSelection(): void {
            this.root.classed("filtered", false);
            this.root.selectAll("circle.point").classed("point_selected", false);
            this.selectionManager.clear();
        }

        // Convert a DataView into a view model
        private converter(dataView: DataView, viewport: IViewport): LineDotChartViewModel {
            if (!dataView.categorical ||
                !dataView.categorical.categories ||
                !dataView.categorical.categories[0] ||
                !dataView.categorical.categories[0].values ||
                !(dataView.categorical.categories[0].values.length > 0) ||
                !dataView.categorical ||
                !dataView.categorical.values ||
                !dataView.categorical.values[0] ||
                !dataView.categorical.values[0].values ||
                !(dataView.categorical.values[0].values.length > 0)
            ) {
                return null;
            }

            var values: any[] = [];
            var metadataColumn: DataViewMetadataColumn;
            var extent: any[];
            var min: any;
            var max: any;
            var that = this;

            var categoryType: ValueType = AxisHelper.getCategoryValueType(dataView.categorical.categories[0].source, true);
            this.isDateTime = AxisHelper.isDateTime(categoryType);
            var isScalar = true;

            var settings: LineDotChartSettings = this.parseSettings(dataView);
            var effectiveWidth: number = Math.max(0, viewport.width - this.margin.left - this.margin.right - this.LegendSize - this.AxisSize);
            var effectiveHeight: number = Math.max(0, viewport.height - this.margin.top - this.margin.bottom - this.LegendSize);

            var format: string = "";
            var formatter: IValueFormatter;

            // X for categories
            values = dataView.categorical.categories[0].values;
            metadataColumn = dataView.categorical.categories[0].source;
            extent = d3.extent(values);

            if (this.isDateTime) {
                min = extent[0].getTime();
                max = extent[1].getTime();

                min = new Date(min);
                max = new Date(max + (max - min)*.05);

                // var xDomain: number[] = isScalar ? [min, max] : [min.getTime(), max.getTime()]
                // var format: string = "MMM dd yyyy HH:mm";
                format = "MMM dd yyyy";
                formatter = valueFormatter.create({ format: format });
            } else {
                min = extent[0];
                max = extent[1];

                max = max + (max - min)*.05;

                formatter = valueFormatter.create({ value: 0 });
            }

            var xAxis = AxisHelper.createAxis({
                pixelSpan: effectiveWidth,
                dataDomain: [min, max],
                metaDataColumn: metadataColumn,
                formatString: null,
                //formatString: LineDotChart.Properties.general.formatString,
                outerPadding: 0,
                isCategoryAxis: true,
                isScalar: isScalar,
                isVertical: false,
                forcedTickCount: undefined,
                useTickIntervalForDisplayUnits: true,
                // axisPrecision: settings.precision,
                getValueFn: (index, type) => {
                    if(that.isDateTime) {
                        return formatter.format(new Date(index));
                    } else {
                        return index;
                    }
                }
            });
            xAxis.formatter = formatter;

            metadataColumn = dataView.categorical.values[0].source;

            values = dataView.categorical.values[0].values;
            extent = d3.extent(values);
            min = extent[0];
            max = extent[1];

            var result: LineDotPoint[] = [];
            var value_sum: number = 0;
            var value: number = 0;
            var time: number = 0;
            var selector: SelectionId;

            for (var i = 0; i < dataView.categorical.categories[0].values.length; i++) {
                value = dataView.categorical.values[0].values[i];
                time = dataView.categorical.categories[0].values[i];
                value_sum += value;
                selector = SelectionId.createWithId(dataView.categorical.categories[0].identity[i]);
                result.push({
                    dot: (value - min) / (max - min),
                    value: value,
                    sum: value_sum,
                    time: time,
                    selector: selector
                });
            }

            // make some space for counter + 25%
            value_sum = value_sum + (value_sum - min) * 0.10;

            var yAxis = AxisHelper.createAxis({
                pixelSpan: effectiveHeight,
                dataDomain: [min, value_sum],
                metaDataColumn: metadataColumn,
                formatString: null,
                outerPadding: 0,
                isCategoryAxis: false,
                isScalar: true,
                isVertical: true,
                useTickIntervalForDisplayUnits: true
            });

            var yAxis2 = AxisHelper.createAxis({
                pixelSpan: effectiveHeight,
                dataDomain: [min, value_sum],
                metaDataColumn: metadataColumn,
                formatString: null,
                outerPadding: 0,
                isCategoryAxis: false,
                isScalar: true,
                isVertical: true,
                useTickIntervalForDisplayUnits: true
            });
            yAxis2.axis.orient('right');

            // Show gridlines on the chart to make the values more readable.
            // TODO: Make this a configuration setting that can be toggled.
            // xAxis.axis = xAxis.axis.tickSize(-effectiveHeight);
            // yAxis.axis = yAxis.axis.tickSize(-effectiveWidth);
            return {
                points: result,
                settings: settings,
                xAxis: xAxis,
                yAxis: yAxis,
                yAxis2: yAxis2,
                legends: this.generateAxisLabels(viewport, settings)
            };
        }

        private parseSettings(dataView: DataView): LineDotChartSettings {
            if (!dataView ||
                !dataView.metadata ||
                !dataView.metadata.columns ||
                !dataView.metadata.columns[0]) {
                return null;
            }

            var objects: DataViewObjects = dataView.metadata.objects;
            var lineFillColorHelper: ColorHelper = new ColorHelper(this.colors, LineDotChart.Properties.lineoptions.fill, LineDotChart.DefaultSettings.lineFill);
            var dotFillColorHelper: ColorHelper = new ColorHelper(this.colors, LineDotChart.Properties.dotoptions.color, LineDotChart.DefaultSettings.dotFill);
            var xAxisTitle: string = LineDotChart.DefaultSettings.xAxisTitle;
            var yAxisTitle: string = LineDotChart.DefaultSettings.yAxisTitle;

            if (
                dataView.categorical.categories[0] &&
                dataView.categorical.categories[0].source &&
                dataView.categorical.categories[0].source.displayName &&
                dataView.categorical.values[0] &&
                dataView.categorical.values[0].source &&
                dataView.categorical.values[0].source.displayName) {
                xAxisTitle = dataView.categorical.categories[0].source.displayName;
                yAxisTitle = dataView.categorical.values[0].source.displayName;
            }

            var lineThickness: number = LineDotChart.DefaultSettings.lineThickness;
            var dotSizeMin: number = LineDotChart.DefaultSettings.dotSizeMin;
            var dotSizeMax: number = LineDotChart.DefaultSettings.dotSizeMax;
            var counterTitle: string = LineDotChart.DefaultSettings.counterTitle;
            var isanimated: boolean = LineDotChart.DefaultSettings.isanimated;
            var isstopped: boolean = LineDotChart.DefaultSettings.isstopped;
            var duration: number = LineDotChart.DefaultSettings.duration;
            if (objects) {
                lineThickness = DataViewObjects.getValue(
                    objects,
                    LineDotChart.Properties.lineoptions.lineThickness,
                    LineDotChart.DefaultSettings.lineThickness
                );
                dotSizeMin = DataViewObjects.getValue(
                    objects,
                    LineDotChart.Properties.dotoptions.dotSizeMin,
                    LineDotChart.DefaultSettings.dotSizeMin
                );
                dotSizeMax = DataViewObjects.getValue(
                    objects,
                    LineDotChart.Properties.dotoptions.dotSizeMax,
                    LineDotChart.DefaultSettings.dotSizeMax
                );
                counterTitle = DataViewObjects.getValue(
                    objects,
                    LineDotChart.Properties.counteroptions.counterTitle,
                    LineDotChart.DefaultSettings.counterTitle
                );
                isanimated = DataViewObjects.getValue(
                    objects,
                    LineDotChart.Properties.misc.isanimated,
                    LineDotChart.DefaultSettings.isanimated
                );
                isstopped = DataViewObjects.getValue(
                    objects,
                    LineDotChart.Properties.misc.isstopped,
                    LineDotChart.DefaultSettings.isstopped
                );
                duration = DataViewObjects.getValue(
                    objects,
                    LineDotChart.Properties.misc.duration,
                    LineDotChart.DefaultSettings.duration
                );
                
            }

            return {
                // precision: LineDotChart.getPrecision(objects),
                xAxisTitle: xAxisTitle,
                yAxisTitle: yAxisTitle,
                lineFill: lineFillColorHelper.getColorForMeasure(objects, ''),
                lineThickness: lineThickness,
                dotFill: dotFillColorHelper.getColorForMeasure(objects, ''),
                dotSizeMin: dotSizeMin,
                dotSizeMax: dotSizeMax,
                counterTitle: counterTitle,
                isstopped: isstopped,
                isanimated: isanimated,
                duration: duration
            };
        }

        // private static getPrecision(objects: DataViewObjects): number {
        //     if (!objects) {
        //         return LineDotChart.DefaultSettings.precision;
        //     }

        //     var precision: number = DataViewObjects.getValue(
        //         objects,
        //         LineDotChart.Properties.labels.labelPrecision,
        //         LineDotChart.DefaultSettings.precision);

        //     if (precision < LineDotChart.MinPrecision) {
        //         return LineDotChart.MinPrecision;
        //     }

        //     return precision;
        // }

        private generateAxisLabels(viewport: IViewport, settings: LineDotChartSettings): Legend[] {
            return [
                {
                    transform: SVGUtil.translate(
                        (viewport.width - this.margin.left - this.margin.right) / 2,
                        (viewport.height - this.margin.top - this.margin.bottom)),
                    text: settings.xAxisTitle,
                    dx: "1em",
                    dy: "-1em"
                }, {
                    transform: SVGUtil.translateAndRotate(
                        0,
                        (viewport.height - this.margin.top - this.margin.bottom) / 2,
                        0,
                        0,
                        270),
                    text: settings.yAxisTitle,
                    dx: "3em"
                }
            ];
        }

        private resize(viewport: IViewport): void {
            this.root.attr({
                'height': Math.max(0, viewport.height),
                'width': Math.max(0, viewport.width)
            });

            this.main.attr('transform', SVGUtil.translate(this.margin.left, this.margin.top));
            this.legends.attr('transform', SVGUtil.translate(this.margin.left, this.margin.top));
            this.line.attr('transform', SVGUtil.translate(this.margin.left + this.LegendSize, 0));
            this.axes.attr('transform', SVGUtil.translate(this.margin.left + this.LegendSize, 0));
            this.axisX.attr('transform', SVGUtil.translate(0, viewport.height - this.margin.top - this.margin.bottom - this.LegendSize));
            this.axisY2.attr('transform', SVGUtil.translate(viewport.width - this.margin.left - this.margin.right - this.LegendSize - this.AxisSize, 0));
        }

        private draw(model: LineDotChartViewModel): void {
            var that = this;
            // Clear canvas
            this.line.selectAll('*').remove();

            this.legends.selectAll('*').remove();
            this.axisX.selectAll('*').remove();
            this.axisY.selectAll('*').remove();
            this.axisY2.selectAll('*').remove();

            if (!model) {
                return;
            }

            this.renderLegends(model);

            if (model && model.points && model.points.length) {

                this.axisX.call(model.xAxis.axis);
                this.axisY.call(model.yAxis.axis);
                this.axisY2.call(model.yAxis2.axis);

                if (model.settings.isanimated) {
                    var playBtn = this.line
                        .append("g")
                        .classed("lineDotChart__playBtn", true)
                        .attr("transform", "translate(40, 20)");

                    playBtn
                        .append("circle")
                        .attr("r", 34 / 2);

                    // play / reset buttin
                    if (model.settings.isstopped) {
                        playBtn
                            .append("path")
                            .attr("d", "M0 2l10 6-10 6z")
                            .attr("transform", "translate(-4,-8)");

                        playBtn
                            .on('click.lineDotChart__playBt', function() {
                                that.setIsStopped(false);
                            });

                        return;
                    } else {
                        playBtn
                            .append("path")
                            .attr("d", "M0 2l10 6-10 6z")
                            .attr("transform-origin", "center")
                            .attr("transform", "translate(6, 8) rotate(180)");

                        playBtn
                            .append("rect")
                            .attr("width", "2")
                            .attr("height", "12")
                            .attr("transform", "translate(-7,-6)");

                        playBtn
                            .on('click.lineDotChart__playBt', function() {
                                that.setIsStopped(true);
                            });
                    }
                }

                var clip = this.line
                    .append("clipPath")
                    .attr("id", "lineClip")
                    .append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", 1)
                    .attr("height", 10000);

                // Draw the line
                var line: D3.Svg.Line = d3.svg.line()
                    .x((d: LineDotPoint) => model.xAxis.scale(d.time))
                    .y((d: LineDotPoint) => model.yAxis.scale(d.sum));
                    // .interpolate("basis");

                var lineSelection: D3.UpdateSelection = this.line.selectAll('path.plot')
                    .data([model.points]);

                lineSelection.enter().append('path');
                lineSelection
                    .classed('plot', true)
                    .attr('stroke', (d, i) => model.settings.lineFill)
                    .attr('stroke-width', model.settings.lineThickness)
                    .attr('d', line);

                var totalLength: number = (<SVGPathElement>lineSelection.node()).getTotalLength();
                var line_left = (<SVGPathElement>lineSelection.node()).getPointAtLength(0).x;
                var line_right = (<SVGPathElement>lineSelection.node()).getPointAtLength(totalLength).x;

                lineSelection
                    .attr("clip-path", "url(" + location.href + "#lineClip)");

                if(!model.settings.isanimated) {
                    clip
                        .interrupt()
                        .attr('x', line_left)
                        .attr('width', line_right - line_left);
                } else {
                    clip
                        .attr('x', line_left)
                        .interrupt()
                        .transition()
                        .ease("linear")
                        .duration(model.settings.duration * 1000)
                        .attr('width', line_right - line_left);
                }
                lineSelection
                    .exit().remove();

                var point_time: number = 300;
                var counter_time: number = 0; // point_time / 100;

                // Draw the individual data points that will be shown on hover with a tooltip
                var lineTipSelection: D3.UpdateSelection = this.line.selectAll('circle.point')
                    .data(model.points);

                var that = this;

                lineTipSelection.enter()
                    .append('circle')
                    .attr('fill', model.settings.dotFill)
                    .attr('opacity', .77)
                    .attr('r', (d: LineDotPoint) => model.settings.dotSizeMin + d.dot * (model.settings.dotSizeMax - model.settings.dotSizeMin))
                    .classed('point', true)
                    .on('mouseover.point', this.showDataPoint)
                    .on('mouseout.point', this.hideDataPoint)
                    .on("click.point", function(d: LineDotPoint) {
                        that.selectDot(this, d.selector);
                    });

                if (!model.settings.isanimated) {
                    lineTipSelection
                        .interrupt()
                        .attr('transform', (d: LineDotPoint) => 
                            'translate(' + model.xAxis.scale(d.time) + ' ' + model.yAxis.scale(d.sum) + ') scale(1)'
                        );
                } else {
                    lineTipSelection
                        .interrupt()
                        .attr('transform', (d: LineDotPoint) => 
                            'translate(' + model.xAxis.scale(d.time) + ' ' + model.yAxis.scale(d.sum) + ') scale(0.005)'
                        )
                        .transition()
                        .duration(point_time)
                        .delay((d: LineDotPoint, i: number) => this.pointDelay(model.points, i, model.settings.duration))
                        .ease("linear")
                        .attr('transform', (d: LineDotPoint) => 
                            'translate(' + model.xAxis.scale(d.time) + ' ' + model.yAxis.scale(d.sum) + ') scale(3.4)'
                        )
                        .transition()
                        .duration(point_time)
                        .delay((d: LineDotPoint, i: number) => this.pointDelay(model.points, i, model.settings.duration) + point_time)
                        .ease("elastic")
                        .attr('transform', (d: LineDotPoint) =>
                            'translate(' + model.xAxis.scale(d.time) + ' ' + model.yAxis.scale(d.sum) + ') scale(1)'
                        );
                }

                lineTipSelection.exit().remove();

                for (var i = 0; i < lineTipSelection[0].length; i++) {
                    this.addTooltip(model, lineTipSelection[0][i]);
                }

                // Feature Counter text 
                var lineTextSelection: D3.UpdateSelection = this.line.selectAll('text')
                    .data(model.points);

                lineTextSelection.enter()
                    .append("text")
                    .classed('text', true)
                    .text((d: LineDotPoint, i: number) => {
                        // if (model.points[i + 1]) {
                            return model.settings.counterTitle + ' ' + (i + 1);
                        // } else {
                        //     // TODO: CRAZY hard code
                        //     return model.settings.counterTitle + ' 265'
                        // }
                    })
                    .attr('x', line_right - 260)
                    .attr('y', 30);

                if (!model.settings.isanimated) {
                    // opacity 1 only for last
                    lineTextSelection
                        .interrupt()
                        .attr('transform', 'translate(0 0)')
                        .attr('opacity', (d: LineDotPoint, i: number) => Number(i === model.points.length - 1));
                } else {
                    lineTextSelection
                        // .attr('transform', 'translate(-40 0)')
                        .attr('opacity', 0)
                        .interrupt()
                        .transition()
                        .duration(counter_time)
                        .delay((d: LineDotPoint, i: number) => this.pointDelay(model.points, i, model.settings.duration))
                        .attr('transform', 'translate(0 0)')
                        .attr('opacity', 1)
                        .transition()
                        .duration(counter_time)
                        .delay((d: LineDotPoint, i: number) => {
                            if (model.points[i + 1]) {
                                return this.pointDelay(model.points, i+1, model.settings.duration);
                            } else {
                                return Number.POSITIVE_INFINITY;
                            }
                        })
                        // .attr('transform', 'translate(40 0)')
                        .attr('opacity', 0)
                     ;

                }
                lineTextSelection.exit().remove();

            }
        }

        private pointDelay(points: LineDotPoint[], num: number, animation_duration: number): number {
            if (!points.length || !points[num] || num === 0) {
                return 0;
            }
            if (this.isDateTime) {
                let time: Date = <Date>points[num].time;
                var min: number = (<Date>points[0].time).getTime();
                var max: number = (<Date>points[points.length - 1].time).getTime();
                var val: number = time.getTime();
            } else {
                let time: number = <number>points[num].time;
                var min: number = <number>points[0].time;
                var max: number = <number>points[points.length - 1].time;
                var val: number = time;
            }
            return animation_duration * 1000 * (val - min) / (max - min);
        }

        private showDataPoint(data: LineDotPoint, index: number): void {
            d3.select(<any>this).classed('show', true);
        }

        private hideDataPoint(data: LineDotPoint, index: number): void {
            d3.select(<any>this).classed('show', false);
        }

        private addTooltip(model: LineDotChartViewModel, element: any): void {
            var selection: D3.Selection = d3.select(element);
            var data: LineDotPoint = selection.datum();
            TooltipManager.addTooltip(selection, (event) => {
                return [
                    {
                        displayName: model.settings.xAxisTitle,
                        value: model.xAxis.formatter.format(data.time)
                    },
                    {
                        displayName: model.settings.yAxisTitle,
                        value: data.value.toString()
                    }
                ];
            });
        }

        private renderLegends(model: LineDotChartViewModel): void {
            var legendSelection: D3.UpdateSelection = this.legends
                .selectAll(LineDotChart.Legend.selector)
                .data(model.legends);

            legendSelection
                .enter()
                .append("svg:text");

            legendSelection
                .attr("x", 0)
                .attr("y", 0)
                .attr("dx", (item: Legend) => item.dx)
                .attr("dy", (item: Legend) => item.dy)
                .attr("transform", (item: Legend) => item.transform)
                .text((item: Legend) => item.text)
                .classed(LineDotChart.Legend.class, true);

            legendSelection
                .exit()
                .remove();
        }
    }
}
