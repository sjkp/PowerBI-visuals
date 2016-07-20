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
    import PixelConverter = jsCommon.PixelConverter;
    import IStringResourceProvider = jsCommon.IStringResourceProvider;
    import createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    import SelectionManager = powerbi.visuals.utility.SelectionManager;
    import ValueFormatter = powerbi.visuals.valueFormatter;
    import getAnimationDuration = powerbi.visuals.AnimatorCommon.GetAnimationDuration;
    import IGenericAnimator = powerbi.visuals.IGenericAnimator;
    import IMargin = powerbi.visuals.IMargin;
    import TooltipEnabledDataPoint = powerbi.visuals.TooltipEnabledDataPoint;
    import SelectionId = powerbi.visuals.SelectionId;
    import IValueFormatter = powerbi.visuals.IValueFormatter;
    import DataViewObjectPropertyIdentifier = powerbi.DataViewObjectPropertyIdentifier;
    import IVisualWarning = powerbi.IVisualWarning;
    import IVisualErrorMessage = powerbi.IVisualErrorMessage;
    import IVisual = powerbi.IVisual;
    import axisStyle = powerbi.visuals.axisStyle;
    import yAxisPosition = powerbi.visuals.yAxisPosition;
    import VisualCapabilities = powerbi.VisualCapabilities;
    import VisualDataRoleKind = powerbi.VisualDataRoleKind;
    import createDisplayNameGetter = powerbi.data.createDisplayNameGetter;
    import ValueTypeDescriptor = powerbi.ValueTypeDescriptor;
    import ValueType = powerbi.ValueType;
    import IViewport = powerbi.IViewport;
    import IVisualHostServices = powerbi.IVisualHostServices;
    import IDataColorPalette = powerbi.IDataColorPalette;
    import TextProperties = powerbi.TextProperties;
    import VisualInitOptions = powerbi.VisualInitOptions;
    import IVisualStyle = powerbi.IVisualStyle;
    import DataColorPalette = powerbi.visuals.DataColorPalette;
    import DataView = powerbi.DataView;
    import DataViewScopeIdentity = powerbi.DataViewScopeIdentity;
    import TooltipDataItem = powerbi.visuals.TooltipDataItem;
    import DataViewObjects = powerbi.DataViewObjects;
    import ColorHelper = powerbi.visuals.ColorHelper;
    import Fill = powerbi.Fill;
    import VisualUpdateOptions = powerbi.VisualUpdateOptions;
    import SVGUtil = powerbi.visuals.SVGUtil;
    import TooltipManager = powerbi.visuals.TooltipManager;
    import TooltipEvent = powerbi.visuals.TooltipEvent;
    import ILabelLayout = powerbi.visuals.ILabelLayout;
    import dataLabelUtils = powerbi.visuals.dataLabelUtils;
    import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
    import VisualObjectInstance = powerbi.VisualObjectInstance;
    import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
    import DateTimeSequence = powerbi.DateTimeSequence;
    import applyCustomizedDomain = powerbi.visuals.AxisHelper.applyCustomizedDomain;
    import combineDomain = powerbi.visuals.AxisHelper.combineDomain;
    import willLabelsFit = powerbi.visuals.AxisHelper.LabelLayoutStrategy.willLabelsFit;
    import willLabelsWordBreak = powerbi.visuals.AxisHelper.LabelLayoutStrategy.willLabelsWordBreak;
    import axisScale = powerbi.visuals.axisScale;
    import TextMeasurementService = powerbi.TextMeasurementService;
    import valueFormatter = powerbi.visuals.valueFormatter;
    import ValueFormatterOptions = powerbi.visuals.ValueFormatterOptions;
    import NumberRange = powerbi.NumberRange;
    import IAxisProperties = powerbi.visuals.IAxisProperties;

    type D3Element =
        D3.UpdateSelection |
        D3.Selection |
        D3.Selectors |
        D3.Transition.Transition;

    export interface HistogramConstructorOptions {
        svg?: D3.Selection;
        animator?: IGenericAnimator;
        margin?: IMargin;
    }

    export interface HistogramAxisSettings {
        axisColor?: string;
        displayUnits?: number;
        precision?: number;
        title?: boolean;
        show?: boolean;
        style?: string;
    }

    export interface HistogramXAxisSettings extends HistogramAxisSettings {
    }

    export interface HistogramYAxisSettings extends HistogramAxisSettings {
        start?: number;
        end?: number;
        position?: string;
    }

    export interface HistogramLabelSettings {
        show?: boolean;
        color?: string;
        displayUnits?: number;
        precision?: number;
        fontSize?: number;
    }

    export interface HistogramSettings {
        displayName?: string;
        fillColor?: string;
        frequency: boolean;
        bins?: number;
        precision: number;
        maxX?: number;

        xAxisSettings: HistogramXAxisSettings;
        yAxisSettings: HistogramYAxisSettings;
        labelSettings: HistogramLabelSettings;
    }

    export interface HistogramData extends D3.Layout.Bin, TooltipEnabledDataPoint {
        range: number[];
        selectionIds: SelectionId[];
    }

    export interface HistogramDataView {
        data: HistogramData[];
        xScale?: D3.Scale.LinearScale;
        yScale?: D3.Scale.LinearScale;
        settings: HistogramSettings;
        formatter: IValueFormatter;
        xLabelFormatter?: IValueFormatter;
        yLabelFormatter?: IValueFormatter;
    }

    interface HistogramCalculateScaleAndDomainOptions {
        viewport: IViewport;
        margin: IMargin;
        showCategoryAxisLabel: boolean;
        showValueAxisLabel: boolean;
        forceMerge: boolean;
        categoryAxisScaleType: string;
        valueAxisScaleType: string;
        trimOrdinalDataOnOverflow: boolean;
        forcedTickCount?: number;
        forcedYDomain?: any[];
        forcedXDomain?: any[];
        ensureXDomain?: NumberRange;
        ensureYDomain?: NumberRange;
        categoryAxisDisplayUnits?: number;
        categoryAxisPrecision?: number;
        valueAxisDisplayUnits?: number;
        valueAxisPrecision?: number;
    }

    interface HistogramValue {
        value: number;
        selectionId: SelectionId;
        frequency: number;
    }

    interface Legend {
        text: string;
        transform?: string;
        dx?: string;
        dy?: string;
    }

    interface Brackets {
        left: string;
        right: string;
    }

    interface HistogramProperty {
        [propertyName: string]: DataViewObjectPropertyIdentifier;
    }

    interface HistogramProperties {
        [objectName: string]: HistogramProperty;
    }

    export class HistogramChartWarning implements IVisualWarning {
        public static ErrorInvalidDataValues: string = "Some data values are invalid or too big";

        private message: string;
        constructor(message: string) {
            this.message = message;
        }

        public get code(): string {
            return "BulletChartWarning";
        }

        public getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage {
            return {
                message: this.message,
                title: resourceProvider.get(""),
                detail: resourceProvider.get("")
            };
        }
    }

    export class Histogram implements IVisual {
        private static ClassName: string = "histogram";
        private static FrequencyText: string = "Frequency";
        private static DensityText: string = "Density";

        private static Properties: HistogramProperties = {
            general: {
                bins: {
                    objectName: "general",
                    propertyName: "bins"
                },
                frequency: {
                    objectName: "general",
                    propertyName: "frequency"
                },
                formatString: {
                    objectName: "general",
                    propertyName: "formatString"
                }
            },
            dataPoint: {
                fill: {
                    objectName: "dataPoint",
                    propertyName: "fill"
                }
            },
            labels: {
                show: {
                    objectName: "labels",
                    propertyName: "show"
                },
                color: {
                    objectName: "labels",
                    propertyName: "color"
                },
                displayUnits: {
                    objectName: "labels",
                    propertyName: "displayUnits"
                },
                precision: {
                    objectName: "labels",
                    propertyName: "precision"
                },
                fontSize: {
                    objectName: "labels",
                    propertyName: "fontSize"
                }
            },
            xAxis: {
                show: {
                    objectName: "xAxis",
                    propertyName: "show"
                },
                axisColor: {
                    objectName: "xAxis",
                    propertyName: "axisColor"
                },
                title: {
                    objectName: "xAxis",
                    propertyName: "title"
                },
                displayUnits: {
                    objectName: "xAxis",
                    propertyName: "displayUnits"
                },
                precision: {
                    objectName: "xAxis",
                    propertyName: "precision"
                },
                style: {
                    objectName: "xAxis",
                    propertyName: "style"
                }
            },
            yAxis: {
                show: {
                    objectName: "yAxis",
                    propertyName: "show"
                },
                axisColor: {
                    objectName: "yAxis",
                    propertyName: "axisColor"
                },
                title: {
                    objectName: "yAxis",
                    propertyName: "title"
                },
                displayUnits: {
                    objectName: "yAxis",
                    propertyName: "displayUnits"
                },
                precision: {
                    objectName: "yAxis",
                    propertyName: "precision"
                },
                style: {
                    objectName: "yAxis",
                    propertyName: "style"
                },
                start: {
                    objectName: "yAxis",
                    propertyName: "start"
                },
                end: {
                    objectName: "yAxis",
                    propertyName: "end"
                },
                position: {
                    objectName: "yAxis",
                    propertyName: "position"
                }
            }
        };

        private static DefaultHistogramSettings: HistogramSettings = {
            frequency: true,
            displayName: "Histogram",
            bins: null,
            fillColor: "#5f9ea0",
            precision: 2,
            xAxisSettings: {
                show: true,
                axisColor: "#5f9ea0",
                title: true,
                displayUnits: 0,
                precision: 2,
                style: axisStyle.showTitleOnly,
            },
            yAxisSettings: {
                show: true,
                axisColor: "#5f9ea0",
                title: true,
                displayUnits: 0,
                precision: 2,
                style: axisStyle.showTitleOnly,
                start: 0,
                position: yAxisPosition.left,
            },
            labelSettings: {
                show: false,
                color: "#5f9ea0",
                displayUnits: 0,
                precision: 2,
                fontSize: 9
            },
        };

        private static Axes: ClassAndSelector = createClassAndSelector('axes');
        private static Axis: ClassAndSelector = createClassAndSelector('axis');
        private static Labels: ClassAndSelector = createClassAndSelector('labels');
        private static Columns: ClassAndSelector = createClassAndSelector('columns');
        private static Column: ClassAndSelector = createClassAndSelector('column');
        private static Legends: ClassAndSelector = createClassAndSelector('legends');
        private static Legend: ClassAndSelector = createClassAndSelector('legend');

        private static MinNumberOfBins: number = 0;
        private static MaxNumberOfBins: number = 100;
        private static MinPrecision: number = 0;
        private static MaxPrecision: number = 17; // max number of decimals in float

        private static AdditionalWidthOfLabel: number = 3;

        private static LegendSizeWhenTitleIsActive: number = 50;
        private static LegendSizeWhenTitleIsNotActive: number = 25;

        private static InnerPaddingRatio: number = 1;

        public static capabilities: VisualCapabilities = {
            dataRoles: [
                {
                    name: "Values",
                    kind: VisualDataRoleKind.Grouping,
                    displayName: createDisplayNameGetter("Role_DisplayName_Values")
                }, {
                    name: "Frequency",
                    kind: VisualDataRoleKind.Measure,
                    displayName: "Frequency"
                }
            ],
            dataViewMappings: [{
                conditions: [{ "Values": { min: 1, max: 1 }, "Frequency": { min: 0, max: 1 } }],
                categorical: {
                    categories: {
                        bind: { to: "Values" },
                        dataReductionAlgorithm: { top: {} }
                    },
                    values: { for: { in: "Frequency" } }
                }
            }],
            sorting: {
                implicit: {
                    clauses: [{ role: "Values", direction: 1 /*SortDirection.Ascending*/ }] //Constant SortDirection.Ascending currently is not supported on the msit
                }
            },
            objects: {
                general: {
                    displayName: createDisplayNameGetter("Visual_General"),
                    properties: {
                        formatString: { type: { formatting: { formatString: true } } },
                        bins: {
                            displayName: "Bins",
                            type: { numeric: true }
                        },
                        frequency: {
                            displayName: "Frequency",
                            type: { bool: true }
                        }
                    },
                },
                dataPoint: {
                    displayName: createDisplayNameGetter("Visual_DataPoint"),
                    properties: {
                        fill: {
                            displayName: createDisplayNameGetter('Visual_Fill'),
                            type: { fill: { solid: { color: true } } }
                        }
                    }
                },
                xAxis: {
                    displayName: 'X-Axis',
                    properties: {
                        show: {
                            displayName: "Show",
                            type: { bool: true },
                        },
                        axis: {
                            displayName: 'Axis',
                            type: { bool: true }
                        },
                        axisColor: {
                            displayName: "Color",
                            type: { fill: { solid: { color: true } } }
                        },
                        title: {
                            displayName: "Title",
                            type: { bool: true }
                        },
                        displayUnits: {
                            displayName: "Display Units",
                            type: { formatting: { labelDisplayUnits: true } }
                        },
                        precision: {
                            displayName: "Decimal Places",
                            type: { numeric: true },
                        },
                        style: {
                            displayName: "Style",
                            type: { enumeration: axisStyle.type }
                        },
                    }
                },
                yAxis: {
                    displayName: 'Y-Axis',
                    properties: {
                        show: {
                            displayName: "Show",
                            type: { bool: true },
                        },
                        axis: {
                            displayName: 'yAxis',
                            type: { bool: true }
                        },
                        axisColor: {
                            displayName: "Color",
                            type: { fill: { solid: { color: true } } }
                        },
                        title: {
                            displayName: "Title",
                            type: { bool: true }
                        },
                        displayUnits: {
                            displayName: "Display Units",
                            type: { formatting: { labelDisplayUnits: true } }
                        },
                        precision: {
                            displayName: "Decimal Places",
                            type: { numeric: true },
                        },
                        style: {
                            displayName: "Style",
                            type: { enumeration: axisStyle.type }
                        },
                        start: {
                            displayName: "Start",
                            type: { numeric: true },
                            placeHolderText: "Start",
                            suppressFormatPainterCopy: true,
                        },
                        end: {
                            displayName: "End",
                            type: { numeric: true },
                            placeHolderText: "End",
                            suppressFormatPainterCopy: true,
                        },
                        position: {
                            displayName: "Position",
                            type: { enumeration: yAxisPosition.type },
                        },
                    }
                },
                labels: {
                    displayName: "Data Labels",
                    properties: {
                        show: {
                            displayName: "Show",
                            type: { bool: true }
                        },
                        color: {
                            displayName: "Color",
                            type: { fill: { solid: { color: true } } }
                        },
                        displayUnits: {
                            displayName: "Display Units",
                            type: { formatting: { labelDisplayUnits: true } },
                            suppressFormatPainterCopy: true
                        },
                        precision: {
                            displayName: "Decimal Places",
                            type: { numeric: true },
                            suppressFormatPainterCopy: true
                        },
                        fontSize: {
                            displayName: "Text Size",
                            type: { formatting: { fontSize: true } }
                        },
                    },
                },
            }
        };

        private ColumnPadding: number = 1;
        private MinColumnHeight: number = 1;
        private MinOpacity: number = 0.3;
        private MaxOpacity: number = 1;

        private TooltipDisplayName: string = "Range";
        private SeparatorNumbers: string = ", ";
        private LegendSize: number = 50;
        private YLegendSize: number = 50;
        private XLegendSize: number = 50;
        private AxisSize: number = 30;
        private DataLabelMargin: number = 0;
        private widthOfColumn: number = 0;
        private yTitleMargin: number = 0;
        private outerPadding: number = 5;
        private xAxisProperties: IAxisProperties;
        private yAxisProperties: IAxisProperties;

        private ExcludeBrackets: Brackets = {
            left: "(",
            right: ")"
        };

        private IncludeBrackets: Brackets = {
            left: "[",
            right: "]"
        };

        private margin: IMargin = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        };

        private durationAnimations: number = 200;

        private viewport: IViewport;
        private hostService: IVisualHostServices;
        private selectionManager: SelectionManager;
        private colors: IDataColorPalette;

        private root: D3.Selection;
        private svg: D3.Selection;
        private main: D3.Selection;
        private axes: D3.Selection;
        private axisX: D3.Selection;
        private axisY: D3.Selection;
        private legend: D3.Selection;
        private columns: D3.Selection;
        private labels: D3.Selection;

        private histogramDataView: HistogramDataView;

        private animator: IGenericAnimator;

        private get columnsSelection(): D3.Selection {
            return this.main.select(Histogram.Columns.selector)
                .selectAll(Histogram.Column.selector);
        }

        private textProperties: TextProperties = {
            fontFamily: 'wf_segoe-ui_normal',
            fontSize: PixelConverter.toString(9),
        };

        constructor(histogramConstructorOptions?: HistogramConstructorOptions) {
            if (histogramConstructorOptions) {
                if (histogramConstructorOptions.svg) {
                    this.svg = histogramConstructorOptions.svg;
                }

                if (histogramConstructorOptions.animator) {
                    this.animator = histogramConstructorOptions.animator;
                }

                this.margin = histogramConstructorOptions.margin || this.margin;
            }
        }

        public init(visualsOptions: VisualInitOptions): void {
            this.hostService = visualsOptions.host;

            if (this.svg) {
                this.root = this.svg;
            } else {
                this.root = d3.select(visualsOptions.element.get(0))
                    .append("svg");
            }

            var style: IVisualStyle = visualsOptions.style;

            this.colors = style && style.colorPalette
                ? style.colorPalette.dataColors
                : new DataColorPalette();

            this.root.classed(Histogram.ClassName, true);

            this.main = this.root.append("g");

            this.axes = this.main
                .append("g")
                .classed(Histogram.Axes.class, true);

            this.axisX = this.axes
                .append("g")
                .classed(Histogram.Axis.class, true);

            this.axisY = this.axes
                .append("g")
                .classed(Histogram.Axis.class, true);

            this.legend = this.main
                .append("g")
                .classed(Histogram.Legends.class, true);

            this.columns = this.main
                .append("g")
                .classed(Histogram.Columns.class, true);

            this.labels = this.main
                .append("g")
                .classed(Histogram.Labels.class, true);

            this.selectionManager = new SelectionManager({ hostServices: visualsOptions.host });
        }

        public converter(dataView: DataView): HistogramDataView {
            if (!dataView ||
                !dataView.categorical ||
                !dataView.categorical.categories ||
                !dataView.categorical.categories[0] ||
                !dataView.categorical.categories[0].values ||
                !(dataView.categorical.categories[0].values.length > 0)) {
                return null;
            }

            var settings: HistogramSettings,
                histogramLayout: D3.Layout.HistogramLayout,
                values: HistogramValue[],
                numericalValues: number[] = [],
                data: D3.Layout.Bin[],
                xScale: D3.Scale.LinearScale,
                yScale: D3.Scale.LinearScale,
                valueFormatter: IValueFormatter,
                frequencies: number[] = [],
                identities: DataViewScopeIdentity[] = [],
                shiftByValues: number = 0,
                sumFrequency: number = 0,
                xLabelFormatter: IValueFormatter,
                yLabelFormatter: IValueFormatter;

            if (dataView.categorical.values &&
                dataView.categorical.values[0] &&
                dataView.categorical.values[0].values) {
                frequencies = dataView.categorical.values[0].values;
            }

            if (dataView.categorical.categories[0].identity
                && dataView.categorical.categories[0].identity.length > 0) {
                identities = dataView.categorical.categories[0].identity;
            }

            settings = this.parseSettings(dataView);

            if (!settings) {
                return null;
            }

            values = Histogram.getValuesByFrequencies(
                dataView.categorical.categories[0].values,
                frequencies,
                identities);

            values.forEach((value: HistogramValue) => {
                numericalValues.push(value.value);
                sumFrequency += value.frequency;
            });

            histogramLayout = d3.layout.histogram();

            if (settings.bins && settings.bins > Histogram.MinNumberOfBins) {
                histogramLayout = histogramLayout.bins(settings.bins);
            }

            data = histogramLayout.frequency(settings.frequency)(numericalValues);

            data.forEach((bin: D3.Layout.Bin, index: number) => {
                var filteredValues: HistogramValue[],
                    frequency: number;

                filteredValues = values.filter((value: HistogramValue) => {
                    return Histogram.isValueContainedInRange(value, bin, index);
                });

                frequency = filteredValues.reduce((previousValue: number, currentValue: HistogramValue): number => {
                    return previousValue + currentValue.frequency;
                }, 0);

                bin.y = settings.frequency
                    ? frequency
                    : frequency / sumFrequency;

                shiftByValues += bin.length;
            });

            var yAxisSettings: HistogramYAxisSettings = settings.yAxisSettings;

            var maxYvalue = (yAxisSettings.end !== null) && (yAxisSettings.end > yAxisSettings.start) ?
                yAxisSettings.end : d3.max(data, (item: D3.Layout.Bin) => item.y);

            var minYValue = (yAxisSettings.start < maxYvalue) ? yAxisSettings.start : 0;
            settings.yAxisSettings.end = maxYvalue;
            settings.yAxisSettings.start = minYValue;
            settings.maxX = d3.max(data, (item: D3.Layout.Bin) => d3.max(item));

            xScale = d3.scale.linear()
                .domain([
                    d3.min(data, (item: D3.Layout.Bin) => d3.min(item)),
                    d3.max(data, (item: D3.Layout.Bin) => d3.max(item))
                ])
                .range([0, this.viewport.width - this.YLegendSize - this.AxisSize]);

            yScale = d3.scale.linear()
                .domain([
                    minYValue,
                    maxYvalue
                ])
                .range([this.viewport.height - this.LegendSize, this.outerPadding]);

            valueFormatter = ValueFormatter.create({
                format: ValueFormatter.getFormatString(
                    dataView.categorical.categories[0].source, Histogram.Properties["general"]["formatString"]),
                value: values[0].value,
                value2: values[values.length - 1].value,
                precision: settings.precision
            });

            xLabelFormatter = ValueFormatter.create({
                value: settings.xAxisSettings.displayUnits === 0 ? values[values.length - 1].value : settings.xAxisSettings.displayUnits,
                precision: settings.xAxisSettings.precision
            });

            yLabelFormatter = ValueFormatter.create({
                value: settings.yAxisSettings.displayUnits,
                precision: settings.yAxisSettings.precision
            });

            return {
                xScale: xScale,
                yScale: yScale,
                settings: settings,
                data: this.getData(values, numericalValues, data, settings, yLabelFormatter, xLabelFormatter),
                formatter: valueFormatter,
                xLabelFormatter: xLabelFormatter,
                yLabelFormatter: yLabelFormatter
            };
        }

        private static getValuesByFrequencies(sourceValues: number[], frequencies: number[], identities: DataViewScopeIdentity[]): HistogramValue[] {
            var values: HistogramValue[] = [];

            sourceValues.forEach((item: number, index: number) => {
                var frequency: number = 1,
                    value: number = Number(item);

                value = isNaN(value) ? 0 : value;

                if (frequencies
                    && frequencies[index]
                    && !isNaN(frequencies[index])
                    && frequencies[index] > 1) {
                    frequency = frequencies[index];
                }

                values.push({
                    value: value,
                    frequency: frequency,
                    selectionId: SelectionId.createWithId(identities[index])
                });
            });

            return values;
        }

        private getData(
            values: HistogramValue[],
            numericalValues: number[],
            data: D3.Layout.Bin[],
            settings: HistogramSettings,
            yValueFormatter: IValueFormatter,
            xValueFormatter: IValueFormatter): HistogramData[] {
            var minValue: number = d3.min(numericalValues),
                maxValue: number = d3.max(numericalValues);
            var fontSizeInPx = PixelConverter.fromPoint(settings.labelSettings.fontSize);

            return data.map((bin: any, index: number): HistogramData => {
                bin.range = Histogram.getRange(minValue, maxValue, bin.dx, index);
                bin.tooltipInfo = this.getTooltipData(bin.y, bin.range, settings, index === 0, yValueFormatter, xValueFormatter);
                bin.selectionIds = Histogram.getSelectionIds(values, bin, index);
                bin.labelFontSize = fontSizeInPx;
                return bin;
            });
        }

        private static getRange(minValue: number, maxValue: number, step: number, index: number): number[] {
            var leftBorder: number = minValue + index * step,
                rightBorder: number = leftBorder + step;

            return [leftBorder, rightBorder];
        }

        private getTooltipData(
            value: number,
            range: number[],
            settings: HistogramSettings,
            includeLeftBorder: boolean,
            yValueFormatter: IValueFormatter,
            xValueFormatter: IValueFormatter): TooltipDataItem[] {

            return [{
                displayName: Histogram.getLegendText(settings),
                value: yValueFormatter.format(value)
            }, {
                    displayName: this.TooltipDisplayName,
                    value: this.rangeToString(range, includeLeftBorder, xValueFormatter)
                }];
        }

        private static getSelectionIds(values: HistogramValue[], bin: HistogramData, index: number): SelectionId[] {
            var selectionIds: SelectionId[] = [];

            values.forEach((value: HistogramValue) => {
                if (Histogram.isValueContainedInRange(value, bin, index)) {
                    selectionIds.push(value.selectionId);
                }
            });

            return selectionIds;
        }

        private static isValueContainedInRange(value: HistogramValue, bin: D3.Layout.Bin, index: number): boolean {
            return ((index === 0 && value.value >= bin.x) || (value.value > bin.x)) && value.value <= bin.x + bin.dx;
        }

        private parseSettings(dataView: DataView): HistogramSettings {
            if (!dataView ||
                !dataView.metadata ||
                !dataView.metadata.columns ||
                !dataView.metadata.columns[0]) {
                return null;
            }

            var histogramSettings: HistogramSettings = <HistogramSettings>{},
                objects: DataViewObjects,
                colorHelper: ColorHelper;

            colorHelper = new ColorHelper(
                this.colors,
                Histogram.Properties["dataPoint"]["fill"],
                Histogram.DefaultHistogramSettings.fillColor);

            histogramSettings.displayName =
                dataView.metadata.columns[0].displayName || Histogram.DefaultHistogramSettings.displayName;

            objects = Histogram.getObjectsFromDataView(dataView);

            var xAxisSettings: HistogramXAxisSettings = {
                axisColor: Histogram.getXAxisColor(objects).solid.color,
                title: Histogram.getXTitle(objects),
                precision: Histogram.getXPrecision(objects),
                style: Histogram.getXStyle(objects),
                displayUnits: Histogram.getXDisplayUnit(objects),
                show: Histogram.getXAxisShow(objects),
            };

            var yAxisSettings: HistogramYAxisSettings = {
                axisColor: Histogram.getYAxisColor(objects).solid.color,
                title: Histogram.getYTitle(objects),
                precision: Histogram.getYPrecision(objects),
                style: Histogram.getYStyle(objects),
                displayUnits: Histogram.getYDisplayUnit(objects),
                show: Histogram.getYAxisShow(objects),

                start: Histogram.getYStart(objects),
                end: Histogram.getYEnd(objects),
                position: Histogram.getYPosition(objects),
            };

            var labelSettings: HistogramLabelSettings = {
                show: Histogram.getLabelShow(objects),
                color: Histogram.getLabelColor(objects).solid.color,
                displayUnits: Histogram.getLabelDisplayUnits(objects),
                precision: Histogram.getLabelPrecision(objects),
                fontSize: Histogram.getLabelFontSize(objects),
            };

            histogramSettings.fillColor = colorHelper.getColorForMeasure(objects, "");
            histogramSettings.bins = Histogram.getBins(objects);
            histogramSettings.frequency = Histogram.getFrequency(objects);
            histogramSettings.precision = Histogram.getPrecision(objects);
            histogramSettings.displayName = Histogram.getLegend(histogramSettings.displayName, xAxisSettings.style, xAxisSettings.displayUnits);

            histogramSettings.xAxisSettings = xAxisSettings;
            histogramSettings.yAxisSettings = yAxisSettings;
            histogramSettings.labelSettings = labelSettings;

            return histogramSettings;
        }

        private static getLegend(title: string, style: string, displayUnit: number): string {
            var retValue: string;
            var formatter: IValueFormatter = ValueFormatter.create({
                value: displayUnit
            });

            switch (style) {
                case axisStyle.showTitleOnly:
                    retValue = title;
                    break;
                case axisStyle.showUnitOnly:
                    retValue = displayUnit === 0 || displayUnit === 1 ? title : formatter.displayUnit.title;
                    break;
                case axisStyle.showBoth:
                    retValue = displayUnit === 0 || displayUnit === 1 ? title : title + " (" + formatter.displayUnit.title + ")";
                    break;
            }
            return retValue;
        }

        private static getLabelFontSize(objects: DataViewObjects): number {
            return DataViewObjects.getValue<number>(
                objects,
                Histogram.Properties["labels"]["fontSize"],
                Histogram.DefaultHistogramSettings.labelSettings.fontSize
            );
        }

        private static getLabelShow(objects: DataViewObjects): boolean {
            return DataViewObjects.getValue<boolean>(
                objects,
                Histogram.Properties["labels"]["show"],
                Histogram.DefaultHistogramSettings.labelSettings.show
            );
        }

        private static getLabelColor(objects: DataViewObjects): Fill {
            return DataViewObjects.getValue<Fill>(
                objects,
                Histogram.Properties["labels"]["color"],
                {
                    solid: {
                        color: Histogram.DefaultHistogramSettings.labelSettings.color
                    }
                }
            );
        }

        private static getLabelDisplayUnits(objects: DataViewObjects): number {
            return DataViewObjects.getValue<number>(
                objects,
                Histogram.Properties["labels"]["displayUnits"],
                Histogram.DefaultHistogramSettings.labelSettings.displayUnits
            );
        }

        private static getLabelPrecision(objects: DataViewObjects): number {
            var precision: number = DataViewObjects.getValue(
                objects,
                Histogram.Properties["labels"]["precision"],
                Histogram.DefaultHistogramSettings.labelSettings.precision);

            if (precision <= Histogram.MinPrecision) {
                return Histogram.MinPrecision;
            } else if (precision >= Histogram.MaxPrecision) {
                return Histogram.MaxPrecision;
            }

            return precision;
        }

        private static getXStyle(objects: DataViewObjects): string {
            return DataViewObjects.getValue<string>(
                objects,
                Histogram.Properties["xAxis"]["style"],
                Histogram.DefaultHistogramSettings.xAxisSettings.style
            );
        }

        private static getXDisplayUnit(objects: DataViewObjects): number {
            return DataViewObjects.getValue<number>(
                objects,
                Histogram.Properties["xAxis"]["displayUnits"],
                Histogram.DefaultHistogramSettings.xAxisSettings.displayUnits
            );
        }

        private static getXPrecision(objects: DataViewObjects): number {
            var precision: number = DataViewObjects.getValue(
                objects,
                Histogram.Properties["xAxis"]["precision"],
                Histogram.DefaultHistogramSettings.xAxisSettings.precision);

            if (precision <= Histogram.MinPrecision) {
                return Histogram.MinPrecision;
            } else if (precision >= Histogram.MaxPrecision) {
                return Histogram.MaxPrecision;
            }

            return precision;
        }

        private static getXAxisShow(objects: DataViewObjects): boolean {
            return DataViewObjects.getValue<boolean>(
                objects,
                Histogram.Properties["xAxis"]["show"],
                Histogram.DefaultHistogramSettings.xAxisSettings.show
            );
        }

        private static getXAxisColor(objects: DataViewObjects): Fill {
            return DataViewObjects.getValue<Fill>(
                objects,
                Histogram.Properties["xAxis"]["axisColor"],
                {
                    solid: {
                        color: Histogram.DefaultHistogramSettings.xAxisSettings.axisColor
                    }
                }
            );
        }

        private static getXTitle(objects: DataViewObjects): boolean {
            return DataViewObjects.getValue<boolean>(
                objects,
                Histogram.Properties["xAxis"]["title"],
                Histogram.DefaultHistogramSettings.xAxisSettings.title);
        }

        private static getYStyle(objects: DataViewObjects): string {
            return DataViewObjects.getValue<string>(
                objects,
                Histogram.Properties["yAxis"]["style"],
                Histogram.DefaultHistogramSettings.yAxisSettings.style
            );
        }

        private static getYPosition(objects: DataViewObjects): string {
            return DataViewObjects.getValue<string>(
                objects,
                Histogram.Properties["yAxis"]["position"],
                Histogram.DefaultHistogramSettings.yAxisSettings.position
            );
        }

        private static getYAxisShow(objects: DataViewObjects): boolean {
            return DataViewObjects.getValue<boolean>(
                objects,
                Histogram.Properties["yAxis"]["show"],
                Histogram.DefaultHistogramSettings.yAxisSettings.show
            );
        }

        private static getYAxisColor(objects: DataViewObjects): Fill {
            return DataViewObjects.getValue<Fill>(
                objects,
                Histogram.Properties["yAxis"]["axisColor"],
                {
                    solid: {
                        color: Histogram.DefaultHistogramSettings.yAxisSettings.axisColor
                    }
                }
            );
        }

        private static getYStart(objects: DataViewObjects): number {
            return DataViewObjects.getValue<number>(
                objects,
                Histogram.Properties["yAxis"]["start"],
                Histogram.DefaultHistogramSettings.yAxisSettings.start
            );
        }

        private static getYEnd(objects: DataViewObjects): number {
            return DataViewObjects.getValue<number>(
                objects,
                Histogram.Properties["yAxis"]["end"],
                Histogram.DefaultHistogramSettings.yAxisSettings.end
            );
        }

        private static getYDisplayUnit(objects: DataViewObjects): number {
            return DataViewObjects.getValue<number>(
                objects,
                Histogram.Properties["yAxis"]["displayUnits"],
                Histogram.DefaultHistogramSettings.yAxisSettings.displayUnits
            );
        }

        private static getYPrecision(objects: DataViewObjects): number {
            var precision: number = DataViewObjects.getValue(
                objects,
                Histogram.Properties["yAxis"]["precision"],
                Histogram.DefaultHistogramSettings.yAxisSettings.precision
            );

            if (precision <= Histogram.MinPrecision) {
                return Histogram.MinPrecision;
            } else if (precision >= Histogram.MaxPrecision) {
                return Histogram.MaxPrecision;
            }

            return precision;
        }

        private static getYTitle(objects: DataViewObjects): boolean {
            return DataViewObjects.getValue<boolean>(
                objects,
                Histogram.Properties["yAxis"]["title"],
                Histogram.DefaultHistogramSettings.yAxisSettings.title);
        }

        private static getBins(objects: DataViewObjects): number {
            var binsNumber: number = Number(DataViewObjects.getValue<number>(
                objects,
                Histogram.Properties["general"]["bins"],
                Histogram.DefaultHistogramSettings.bins)
            );

            if (!binsNumber || isNaN(binsNumber) || (binsNumber <= Histogram.MinNumberOfBins)) {
                return Histogram.DefaultHistogramSettings.bins;
            }

            if (binsNumber > Histogram.MaxNumberOfBins) {
                return Histogram.MaxNumberOfBins;
            }

            return binsNumber;
        }

        private static getFrequency(objects: DataViewObjects): boolean {
            return DataViewObjects.getValue<boolean>(
                objects,
                Histogram.Properties["general"]["frequency"],
                Histogram.DefaultHistogramSettings.frequency
            );
        }

        private static getPrecision(objects: DataViewObjects): number {
            var precision: number = DataViewObjects.getValue(
                objects,
                Histogram.Properties["labels"]["precision"],
                Histogram.DefaultHistogramSettings.precision
            );

            if (precision <= Histogram.MinPrecision) {
                return Histogram.MinPrecision;
            }

            if (precision >= Histogram.MaxPrecision) {
                return Histogram.MaxPrecision;
            }

            return precision;
        }

        public validateData(data: HistogramDataView): boolean {
            if (data && data.data.some(x => x.range.some(x => isNaN(x) || x === Infinity || x === -Infinity))) {
                this.hostService.setWarnings([new HistogramChartWarning(HistogramChartWarning.ErrorInvalidDataValues)]);
                return false;
            }
            return true;
        }

        public update(visualUpdateOptions: VisualUpdateOptions): void {
            if (!visualUpdateOptions ||
                !visualUpdateOptions.dataViews ||
                !visualUpdateOptions.dataViews[0]) {
                return;
            }

            var dataView: DataView = visualUpdateOptions.dataViews[0],
                widthOfLabel: number;

            this.durationAnimations = getAnimationDuration(
                this.animator,
                visualUpdateOptions.suppressAnimations);

            this.setSize(visualUpdateOptions.viewport);

            this.histogramDataView = this.converter(dataView);

            if (!this.validateData(this.histogramDataView)) {
                this.histogramDataView.data = [];
            }

            if (!this.histogramDataView) {
                return;
            }

            this.YLegendSize = this.getLegendSize(this.histogramDataView.settings.yAxisSettings);
            this.XLegendSize = this.getLegendSize(this.histogramDataView.settings.xAxisSettings);

            widthOfLabel = this.getWidthOfLabel();

            this.xAxisProperties = this.calculateXAxes(
                dataView.categorical.categories[0].source,
                this.textProperties,
                widthOfLabel,
                false);

            var ySource = dataView.categorical.values &&
                dataView.categorical.values[0] &&
                dataView.categorical.values[0].values
                    ? dataView.categorical.values[0].source
                    : dataView.categorical.categories[0].source;

            this.yAxisProperties = this.calculateYAxes(
                ySource,
                this.textProperties,
                widthOfLabel,
                false);

            this.render();
        }

        private getLegendSize(axisSettings: HistogramAxisSettings): number {
            return axisSettings.title
                ? Histogram.LegendSizeWhenTitleIsActive
                : Histogram.LegendSizeWhenTitleIsNotActive;
        }

        private getWidthOfLabel(): number {
            if (!this.histogramDataView || !this.histogramDataView.settings) {
                return;
            }

            var ticLabel = this.histogramDataView.xLabelFormatter.format(this.histogramDataView.settings.maxX);

            var textProperties: TextProperties = {
                text: ticLabel,
                fontFamily: this.textProperties.fontFamily,
                fontSize: this.textProperties.fontSize
            };

            return TextMeasurementService.measureSvgTextWidth(textProperties) + Histogram.AdditionalWidthOfLabel;
        }

        private setSize(viewport: IViewport): void {
            var height: number,
                width: number;

            height = viewport.height -
                this.margin.top -
                this.margin.bottom;

            width = viewport.width -
                this.margin.left -
                this.margin.right;

            this.viewport = {
                height: height,
                width: width
            };

            this.updateElements(viewport.height, viewport.width);
        }

        private updateElements(height: number, width: number): void {
            this.root.attr({
                "height": height,
                "width": width
            });

            this.main.attr("transform", SVGUtil.translate(this.margin.left, this.margin.top));
            this.legend.attr("transform", SVGUtil.translate(this.margin.left, this.margin.top));

            this.axisX.attr(
                "transform",
                SVGUtil.translate(0, this.viewport.height - this.XLegendSize)
            );
        }

        public shouldShowYOnRight(): boolean {
            return this.histogramDataView.settings.yAxisSettings.position === yAxisPosition.right;
        }

        private columsAndAxesTransform(labelWidth: number): void {
            var constMargin = 20;
            var shiftToRight: number = this.shouldShowYOnRight() ? 10 :
                this.histogramDataView.settings.yAxisSettings.title ? this.margin.left + labelWidth + constMargin : this.margin.left + labelWidth;

            this.DataLabelMargin = shiftToRight;

            this.columns.attr("transform", SVGUtil.translate(shiftToRight, 0));
            this.axes.attr("transform", SVGUtil.translate(shiftToRight, 0));

            this.axisY.attr('transform', SVGUtil.translate(
                this.shouldShowYOnRight() ? this.viewport.width - this.AxisSize - this.YLegendSize + 0.01 : 0, 0));

            this.axisX.attr(
                "transform",
                SVGUtil.translate(0, this.viewport.height - this.XLegendSize));

        }

        private render(): void {
            if (!this.histogramDataView || !this.histogramDataView.settings) {
                return;
            }

            this.renderAxes();
            var columnsSelection: D3.UpdateSelection = this.renderColumns();

            this.adjustTransformToAxisLabels();

            this.renderLegend();

            if (this.histogramDataView.settings.labelSettings.show) {
                this.renderLabels();
            } else {
                this.main.selectAll('.labels').selectAll('*').remove();
            }

            this.bindSelectionHandler(columnsSelection);
        }

        private adjustTransformToAxisLabels(): void {
            var maxWidthOfLabael = 0;
            this.main.selectAll('g.axis').filter((d, index) => index === 1).selectAll('g.tick text')
                .each(function (d, i) {
                    var p = TextMeasurementService.getSvgMeasurementProperties(this);
                    var textProperties: TextProperties = {
                        text: p.text,
                        fontFamily: p.fontFamily,
                        fontSize: p.fontSize
                    };
                    var widthOfLabel = TextMeasurementService.measureSvgTextWidth(textProperties);
                    if (widthOfLabel > maxWidthOfLabael)
                        maxWidthOfLabael = widthOfLabel;
                });
            var constMargin = 70;
            this.yTitleMargin = this.shouldShowYOnRight() ? this.viewport.width - this.AxisSize - constMargin + this.YLegendSize + maxWidthOfLabael : 0;
            this.columsAndAxesTransform(maxWidthOfLabael);
        }

        private renderColumns(): D3.UpdateSelection {
            var data: HistogramData[] = this.histogramDataView.data,
                yScale: D3.Scale.LinearScale = this.histogramDataView.yScale,
                countOfValues: number = data.length,
                widthOfColumn: number,
                updateColumnsSelection: D3.UpdateSelection;

            widthOfColumn = countOfValues && ((this.viewport.width - this.AxisSize - this.YLegendSize) / countOfValues - this.ColumnPadding);

            if (widthOfColumn < 0) {
                widthOfColumn = 0;
            }

            this.widthOfColumn = widthOfColumn;
            updateColumnsSelection = this.columnsSelection.data(data);

            updateColumnsSelection
                .enter()
                .append("svg:rect");

            updateColumnsSelection
                .attr("x", this.ColumnPadding / 2)
                .attr("width", widthOfColumn)
                .attr("height", (item: HistogramData) => this.getColumnHeight(item, yScale))
                .style("fill", this.histogramDataView.settings.fillColor)
                .attr("class", Histogram.Column.class)
                .attr("transform", (item: HistogramData, index: number) => SVGUtil.translate(
                    widthOfColumn * index + this.ColumnPadding * index,
                    yScale(item.y) - this.ColumnPadding / 2.5));

            if (countOfValues) {
                //if data is empty, it throws for some reason
                updateColumnsSelection.classed(Histogram.Column.class);
            }

            updateColumnsSelection.exit().remove();

            Histogram.renderTooltip(updateColumnsSelection);

            return updateColumnsSelection;
        }

        private static renderTooltip(selection: D3.UpdateSelection): void {
            TooltipManager.addTooltip(selection, (tooltipEvent: TooltipEvent) => {
                return (<HistogramData>tooltipEvent.data).tooltipInfo;
            });
        }

        private getColumnHeight(column: D3.Layout.Bin, y: D3.Scale.LinearScale): number {
            var height: number = this.viewport.height - this.XLegendSize - y(column.y);

            return height > 0 ? height : this.MinColumnHeight;
        }

        private renderAxes(): void {
            var xAxis: D3.Svg.Axis,
                yAxis: D3.Svg.Axis;

            xAxis = this.xAxisProperties.axis
                .tickFormat((item: number) => this.histogramDataView.xLabelFormatter.format(item))
                .orient('bottom');

            yAxis = this.yAxisProperties.axis
                .orient(this.histogramDataView.settings.yAxisSettings.position.toLowerCase())
                .tickFormat((item: number) => this.histogramDataView.yLabelFormatter.format(item));

            var xShow: boolean = this.histogramDataView.settings.xAxisSettings.show;
            var yShow: boolean = this.histogramDataView.settings.yAxisSettings.show;

            if (xShow) {
                this.axisX
                    .transition()
                    .duration(1)
                    .call(xAxis);
            } else {
                this.axisX.selectAll('*').remove();
            }

            if (yShow) {
                this.axisY
                    .call(yAxis);
            } else {
                this.axisY.selectAll('*').remove();
            }

            this.main.selectAll('g.axis').filter((d, index) => index === 0).selectAll('g.tick text').style({
                'fill': this.histogramDataView.settings.xAxisSettings.axisColor,
            });

            this.main.selectAll('g.axis').filter((d, index) => index === 1).selectAll('g.tick text').style({
                'fill': this.histogramDataView.settings.yAxisSettings.axisColor,
            });
        }

        private getLabaelLayout(): ILabelLayout {
            var labelSettings: HistogramLabelSettings = this.histogramDataView.settings.labelSettings;

            var fontSizeInPx: string = PixelConverter.fromPoint(labelSettings.fontSize);
            var dataLabelFormatter = ValueFormatter.create({
                value: labelSettings.displayUnits,
                precision: labelSettings.precision
            });

            return {
                labelText: (b: D3.Layout.Bin) => {
                    return dataLabelFormatter.format(b.y).toString();
                },
                labelLayout: {
                    x: (b: D3.Layout.Bin) => this.DataLabelMargin + this.histogramDataView.xScale(b.x) + this.widthOfColumn / 2,
                    y: (b: D3.Layout.Bin) => this.histogramDataView.yScale(b.y) - 5
                },
                filter: (b: D3.Layout.Bin) => {
                    return (b != null);
                },
                style: {
                    'fill': labelSettings.color,
                    'font-size': fontSizeInPx,
                },
            };
        }

        private renderLabels(): void {
            var layout = this.getLabaelLayout();
            var dataPointsArray = this.histogramDataView.data;
            dataLabelUtils.drawDefaultLabelsForDataPointChart(dataPointsArray, this.main, layout, this.viewport);
        }

        private static rangesToArray(data: HistogramData[]): number[] {
            return data.reduce((previousValue: number[], currentValue: HistogramData, index: number) => {
                var range: number[];

                range = (index === 0)
                    ? currentValue.range
                    : currentValue.range.slice(1);

                return previousValue.concat(range);
            }, []);
        }

        private rangeToString(range: number[], includeLeftBorder: boolean, valueFormatter: IValueFormatter): string {
            var leftBracket: string,
                rightBracket: string = this.IncludeBrackets.right,
                leftBorder: string = valueFormatter.format(range[0]),
                rightBorder: string = valueFormatter.format(range[1]);

            leftBracket = includeLeftBorder
                ? this.IncludeBrackets.left
                : this.ExcludeBrackets.left;

            return `${leftBracket}${leftBorder}${this.SeparatorNumbers}${rightBorder}${rightBracket}`;
        }

        private renderLegend(): void {
            var legendElements: D3.Selection,
                legendSelection: D3.UpdateSelection,
                datalegends: Legend[] = this.getDataLegends(this.histogramDataView.settings);

            legendElements = this.main
                .select(Histogram.Legends.selector)
                .selectAll(Histogram.Legend.selector);

            legendSelection = legendElements.data(datalegends);

            legendSelection
                .enter()
                .append("svg:text");

            legendSelection
                .attr("x", 0)
                .attr("y", 0)
                .attr("dx", (item: Legend) => item.dx)
                .attr("dy", (item: Legend) => item.dy)
                .attr("transform", (item: Legend) => item.transform)
                .attr("class", Histogram.Legend.class)
                .text((item: Legend) => item.text)
                .classed(Histogram.Legend.class, true);

            legendSelection
                .exit()
                .remove();

            this.legend.select('text').style({
                'display': this.histogramDataView.settings.xAxisSettings.title === true ? 'block' : 'none',
            });

            this.legend.selectAll('text').filter((d, index) => index === 1).style({
                'display': this.histogramDataView.settings.yAxisSettings.title === true ? 'block' : 'none',
            });
        }

        private getDataLegends(settings: HistogramSettings): Legend[] {
            var bottomLegendText: string = Histogram.getLegendText(settings);
            bottomLegendText = Histogram.getLegend(bottomLegendText, settings.yAxisSettings.style, settings.yAxisSettings.displayUnits);

            return [{
                transform: SVGUtil.translate(
                    this.viewport.width / 2,
                    this.viewport.height),
                text: settings.displayName,
                dx: "1em",
                dy: "-1em"
            }, {
                    transform: SVGUtil.translateAndRotate(
                        this.shouldShowYOnRight() ? this.yTitleMargin : 0,
                        this.viewport.height / 2,
                        0,
                        0,
                        270),
                    text: bottomLegendText,
                    dx: "3em"
                }];
        }

        private static getLegendText(settings: HistogramSettings): string {
            return settings.frequency
                ? Histogram.FrequencyText
                : Histogram.DensityText;
        }

        private bindSelectionHandler(columnsSelection: D3.UpdateSelection): void {
            this.setSelection(columnsSelection);

            columnsSelection.on("click", (data: HistogramData) => {
                this.selectionManager.clear();

                data.selectionIds.forEach((selectionId: SelectionId) => {
                    this.selectionManager.select(selectionId, true).then((selectionIds: SelectionId[]) => {
                        if (selectionIds.length > 0) {
                            this.setSelection(columnsSelection, data);
                        } else {
                            this.setSelection(columnsSelection);
                        }
                    });
                });

                d3.event.stopPropagation();
            });

            this.root.on("click", () => {
                this.selectionManager.clear();
                this.setSelection(columnsSelection);
            });
        }

        private setSelection(columnsSelection: D3.UpdateSelection, data?: HistogramData): void {
            columnsSelection.transition()
                .duration(this.durationAnimations)
                .style("fill-opacity", this.MaxOpacity);

            if (!data) {
                return;
            }

            columnsSelection
                .filter((columnSelection: HistogramData) => {
                    return columnSelection !== data;
                })
                .transition()
                .duration(this.durationAnimations)
                .style("fill-opacity", this.MinOpacity);
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
            var instances: VisualObjectInstance[] = [],
                settings: HistogramSettings;

            if (!this.histogramDataView ||
                !this.histogramDataView.settings) {
                return instances;
            }

            settings = this.histogramDataView.settings;

            switch (options.objectName) {
                case "general": {
                    var general: VisualObjectInstance = {
                        objectName: "general",
                        displayName: "general",
                        selector: null,
                        properties: {
                            bins: settings.bins,
                            frequency: settings.frequency
                        }
                    };

                    instances.push(general);
                    break;
                }
                case "dataPoint": {
                    var dataPoint: VisualObjectInstance = {
                        objectName: "dataPoint",
                        displayName: "dataPoint",
                        selector: null,
                        properties: {
                            fill: settings.fillColor
                        }
                    };

                    instances.push(dataPoint);
                    break;
                }
                case "labels": {
                    var labelsSettings: HistogramLabelSettings = settings.labelSettings;
                    var labels: VisualObjectInstance = {
                        objectName: "labels",
                        displayName: "labels",
                        selector: null,
                        properties: {
                            show: labelsSettings.show,
                            color: labelsSettings.color,
                            displayUnits: labelsSettings.displayUnits,
                            precision: labelsSettings.precision,
                            fontSize: labelsSettings.fontSize
                        }
                    };
                    instances.push(labels);
                    break;
                }
                case "xAxis": {
                    var xAxisSettings: HistogramXAxisSettings = settings.xAxisSettings;
                    var xAxis: VisualObjectInstance = {
                        objectName: "xAxis",
                        displayName: "X-Axis",
                        selector: null,
                        properties: {
                            show: xAxisSettings.show,
                            title: xAxisSettings.title,
                            style: xAxisSettings.style,
                            axisColor: xAxisSettings.axisColor,
                            displayUnits: xAxisSettings.displayUnits,
                            precision: xAxisSettings.precision,
                        }
                    };
                    instances.push(xAxis);
                    break;
                }
                case "yAxis": {
                    var yAxisSettings: HistogramYAxisSettings = settings.yAxisSettings;
                    var yAxis: VisualObjectInstance = {
                        objectName: "yAxis",
                        displayName: "Y-Axis",
                        selector: null,
                        properties: {
                            show: yAxisSettings.show,
                            position: yAxisSettings.position,
                            start: yAxisSettings.start,
                            end: yAxisSettings.end,
                            title: yAxisSettings.title,
                            style: yAxisSettings.style,
                            axisColor: yAxisSettings.axisColor,
                            displayUnits: yAxisSettings.displayUnits,
                            precision: yAxisSettings.precision,
                        }
                    };
                    instances.push(yAxis);
                    break;
                }
            }
            return instances;
        }

        private static getObjectsFromDataView(dataView: DataView): DataViewObjects {
            if (!dataView ||
                !dataView.metadata ||
                !dataView.metadata.columns ||
                !dataView.metadata.objects) {
                return null;
            }

            return dataView.metadata.objects;
        }

        public destroy(): void {
            this.root = null;
        }

        private calculateXAxes(
            source: DataViewMetadataColumn,
            textProperties: TextProperties,
            widthOfLabel: number,
            scrollbarVisible: boolean): IAxisProperties {

            var axes: IAxisProperties,
                visualOptions: HistogramCalculateScaleAndDomainOptions,
                width: number = this.viewport.width;

            visualOptions = {
                viewport: this.viewport,
                margin: this.margin,
                forcedXDomain: Histogram.rangesToArray(this.histogramDataView.data),
                forceMerge: true,
                showCategoryAxisLabel: false,
                showValueAxisLabel: false,
                categoryAxisScaleType: axisScale.linear,
                valueAxisScaleType: null,
                trimOrdinalDataOnOverflow: false
            };

            axes = this.calculateXAxesProperties(
                visualOptions,
                source,
                Histogram.InnerPaddingRatio,
                widthOfLabel);

            axes.willLabelsFit = willLabelsFit(
                axes,
                width,
                TextMeasurementService.measureSvgTextWidth,
                textProperties);

            // If labels do not fit and we are not scrolling, try word breaking
            axes.willLabelsWordBreak = (!axes.willLabelsFit && !scrollbarVisible) && willLabelsWordBreak(
                axes, this.margin, width, TextMeasurementService.measureSvgTextWidth,
                TextMeasurementService.estimateSvgTextHeight, TextMeasurementService.getTailoredTextOrDefault,
                textProperties);

            return axes;
        }

        private calculateXAxesProperties(
            options: HistogramCalculateScaleAndDomainOptions,
            metaDataColumn: DataViewMetadataColumn,
            innerPaddingRatio: number,
            minOrdinalRectThickness: number): IAxisProperties {

            var xAxisProperties = HistogramAxisHelper.createAxis({
                pixelSpan: this.viewport.width - this.YLegendSize - this.AxisSize,
                dataDomain: options.forcedXDomain,
                metaDataColumn: metaDataColumn,
                formatString: valueFormatter.getFormatString(metaDataColumn, Histogram.Properties["general"]["formatString"]),
                outerPadding: 0,
                isScalar: false,
                isVertical: false,
                useTickIntervalForDisplayUnits: true,
                isCategoryAxis: true,
                getValueFn: (index, type) => index,
                scaleType: options.categoryAxisScaleType,
                innerPaddingRatio: innerPaddingRatio,
                minOrdinalRectThickness: minOrdinalRectThickness,
                tickLabelPadding: undefined
            });

            xAxisProperties.axisLabel = this.histogramDataView.settings.displayName;

            return xAxisProperties;
        }

        private calculateYAxes(
            source: DataViewMetadataColumn,
            textProperties: TextProperties,
            widthOfLabel: number,
            scrollbarVisible: boolean): IAxisProperties {

            var yAxisSettings: HistogramYAxisSettings,
                visualOptions: HistogramCalculateScaleAndDomainOptions;

            visualOptions = {
                viewport: this.viewport,
                margin: this.margin,
                forceMerge: true,
                showCategoryAxisLabel: true,
                showValueAxisLabel: false,
                categoryAxisScaleType: axisScale.linear,
                valueAxisScaleType: null,
                trimOrdinalDataOnOverflow: false
            };

            yAxisSettings = this.histogramDataView.settings.yAxisSettings;

            visualOptions.forcedYDomain = applyCustomizedDomain(
                [yAxisSettings.start, yAxisSettings.end],
                visualOptions.forcedYDomain);

            return this.calculateYAxesProperties(
                visualOptions,
                source,
                Histogram.InnerPaddingRatio,
                widthOfLabel);
        }

        private calculateYAxesProperties(
            options: HistogramCalculateScaleAndDomainOptions,
            metaDataColumn: DataViewMetadataColumn,
            innerPaddingRatio: number,
            minOrdinalRectThickness: number): IAxisProperties {

            var yAxisSettings: HistogramYAxisSettings = this.histogramDataView.settings.yAxisSettings;

            return HistogramAxisHelper.createAxis({
                pixelSpan: this.viewport.height - this.XLegendSize + 5,
                dataDomain: combineDomain(options.forcedYDomain, [yAxisSettings.start, yAxisSettings.end]),
                metaDataColumn: metaDataColumn,
                formatString: valueFormatter.getFormatString(metaDataColumn, Histogram.Properties["general"]["formatString"]),
                outerPadding: this.outerPadding,
                isScalar: true,
                isVertical: true,
                useTickIntervalForDisplayUnits: true,
                isCategoryAxis: false,
                getValueFn: (index, type) => index,
                scaleType: options.categoryAxisScaleType,
                innerPaddingRatio: innerPaddingRatio,
                minOrdinalRectThickness: minOrdinalRectThickness,
                tickLabelPadding: undefined
            });
        }
    }

    /**
     * HistogramAxisHelper based on AxisHelper (Visuals/common/axisHelper.ts).
     */
    export module HistogramAxisHelper {
        import NumberFormat = powerbi.NumberFormat;
        import BaseCreateAxisOptions = powerbi.visuals.CreateAxisOptions;

        /**
         * Default ranges are for when we have a field chosen for the axis,
         * but no values are returned by the query.
         */
        export var emptyDomain = [0, 0];

        var InnerPaddingRatio: number = 0.2;
        var TickLabelPadding: number = 2; // between text labels, used by AxisHelper
        var MinOrdinalRectThickness: number = 20;

        var ScalarTickLabelPadding: number = 3;
        var MinTickCount: number = 2;
        var DefaultBestTickCount: number = 3;

        export interface CreateScaleResult {
            scale: D3.Scale.GenericScale<any>;
            bestTickCount: number;
            usingDefaultDomain?: boolean;
        }

        export interface CreateAxisOptions extends BaseCreateAxisOptions {
            innerPaddingRatio: number;
            tickLabelPadding: number;
            minOrdinalRectThickness: number;
            maxTickCount?: number;
        }

        /**
         * Create a D3 axis including scale. Can be vertical or horizontal, and either datetime, numeric, or text.
         * @param options The properties used to create the axis.
         */
        export function createAxis(options: CreateAxisOptions): IAxisProperties {
            var pixelSpan = options.pixelSpan,
                dataDomain = options.dataDomain,
                metaDataColumn = options.metaDataColumn,
                formatString = options.formatString,
                outerPadding = options.outerPadding || 0,
                isCategoryAxis = !!options.isCategoryAxis,
                isScalar = !!options.isScalar,
                isVertical = !!options.isVertical,
                useTickIntervalForDisplayUnits = !!options.useTickIntervalForDisplayUnits, // DEPRECATE: same meaning as isScalar?
                getValueFn = options.getValueFn,
                categoryThickness = options.categoryThickness,
                axisDisplayUnits = options.axisDisplayUnits,
                axisPrecision = options.axisPrecision,
                is100Pct = !!options.is100Pct,
                tickLabelPadding: number = options.tickLabelPadding || TickLabelPadding;

            var dataType: ValueType = getCategoryValueType(metaDataColumn, isScalar);

            // Create the Scale
            var scaleResult: CreateScaleResult = createScale(options);
            var scale = scaleResult.scale;
            var bestTickCount = scaleResult.bestTickCount;
            var scaleDomain = scale.domain();
            var isLogScaleAllowed = isLogScalePossible(dataDomain, dataType);

            // fix categoryThickness if scalar and the domain was adjusted when making the scale "nice"
            if (categoryThickness && isScalar && dataDomain && dataDomain.length === 2) {
                var oldSpan = dataDomain[1] - dataDomain[0];
                var newSpan = scaleDomain[1] - scaleDomain[0];
                if (oldSpan > 0 && newSpan > 0) {
                    categoryThickness = categoryThickness * oldSpan / newSpan;
                }
            }

            // Prepare Tick Values for formatting
            var tickValues: any[];
            if (isScalar && bestTickCount === 1) {
                tickValues = [dataDomain[0]];
            }
            else {
                var minTickInterval = isScalar ? getMinTickValueInterval(formatString, dataType, is100Pct) : undefined;
                tickValues = getRecommendedTickValues(bestTickCount, scale, dataType, isScalar, minTickInterval);
            }

            if (options.scaleType && options.scaleType === axisScale.log && isLogScaleAllowed) {
                tickValues = tickValues.filter((d) => { return powerOfTen(d); });
            }

            var formatter = createFormatter(
                scaleDomain,
                dataDomain,
                dataType,
                isScalar,
                formatString,
                bestTickCount,
                tickValues,
                getValueFn,
                useTickIntervalForDisplayUnits,
                axisDisplayUnits,
                axisPrecision);

            // sets default orientation only, cartesianChart will fix y2 for comboChart
            // tickSize(pixelSpan) is used to create gridLines
            var axis = d3.svg.axis()
                .scale(scale)
                .tickSize(6, 0)
                .orient(isVertical ? 'left' : 'bottom')
                .ticks(bestTickCount)
                .tickValues(tickValues);

            var formattedTickValues = [];
            if (metaDataColumn)
                formattedTickValues = formatAxisTickValues(axis, tickValues, formatter, dataType, getValueFn);

            var xLabelMaxWidth;
            // Use category layout of labels if specified, otherwise use scalar layout of labels
            if (!isScalar && categoryThickness) {
                xLabelMaxWidth = Math.max(1, categoryThickness - tickLabelPadding * 2);
            }
            else {
                // When there are 0 or 1 ticks, then xLabelMaxWidth = pixelSpan       
                xLabelMaxWidth = tickValues.length > 1 ? getScalarLabelMaxWidth(scale, tickValues) : pixelSpan;
                xLabelMaxWidth = xLabelMaxWidth - ScalarTickLabelPadding * 2;
            }

            return {
                scale: scale,
                axis: axis,
                formatter: formatter,
                values: formattedTickValues,
                axisType: dataType,
                axisLabel: null,
                isCategoryAxis: isCategoryAxis,
                xLabelMaxWidth: xLabelMaxWidth,
                categoryThickness: categoryThickness,
                outerPadding: outerPadding,
                usingDefaultDomain: scaleResult.usingDefaultDomain,
                isLogScaleAllowed: isLogScaleAllowed,
                dataDomain: dataDomain,
            };
        }

        /**
         * Indicates whether the number is power of 10.
         */
        export function powerOfTen(d: any): boolean {
            var value = Math.abs(d);
            // formula log2(Y)/log2(10) = log10(Y)
            // because double issues this won't return exact value
            // we need to ceil it to nearest number.
            var log10: number = Math.log(value) / Math.LN10;
            log10 = Math.ceil(log10 - 1e-12);
            return value / Math.pow(10, log10) === 1;
        }

        function getScalarLabelMaxWidth(scale: D3.Scale.GenericScale<any>, tickValues: number[]): number {
            debug.assertValue(scale, "scale");
            debug.assertNonEmpty(tickValues, "tickValues");
            // find the distance between two ticks. scalar ticks can be anywhere, such as:
            // |---50----------100--------|
            if (scale && !_.isEmpty(tickValues)) {
                return Math.abs(scale(tickValues[1]) - scale(tickValues[0]));
            }

            return 1;
        }

        export function createFormatter(
            scaleDomain: any[],
            dataDomain: any[],
            dataType,
            isScalar: boolean,
            formatString: string,
            bestTickCount: number,
            tickValues: any[],
            getValueFn: any,
            useTickIntervalForDisplayUnits: boolean = false,
            axisDisplayUnits?: number,
            axisPrecision?: number): IValueFormatter {

            var formatter: IValueFormatter;
            if (dataType.dateTime) {
                if (isScalar) {
                    var value = new Date(scaleDomain[0]);
                    var value2 = new Date(scaleDomain[1]);
                    // datetime with only one value needs to pass the same value
                    // (from the original dataDomain value, not the adjusted scaleDomain)
                    // so formatting works correctly.
                    if (bestTickCount === 1)
                        value = value2 = new Date(dataDomain[0]);
                    // this will ignore the formatString and create one based on the smallest non-zero portion of the values supplied.
                    formatter = valueFormatter.create({
                        format: formatString,
                        value: value,
                        value2: value2,
                        tickCount: bestTickCount,
                    });
                }
                else {
                    // Use the model formatString for ordinal datetime
                    formatter = valueFormatter.createDefaultFormatter(formatString, true);
                }
            }
            else {
                if (getValueFn == null && !isScalar) {
                    debug.assertFail('getValueFn must be supplied for ordinal tickValues');
                }
                if (useTickIntervalForDisplayUnits && isScalar && tickValues.length > 1) {
                    var value1 = axisDisplayUnits ? axisDisplayUnits : tickValues[1] - tickValues[0];

                    var options: ValueFormatterOptions = {
                        format: formatString,
                        value: value1,
                        value2: 0, //force tickInterval or display unit to be used
                        allowFormatBeautification: true,
                    };

                    if (axisPrecision)
                        options.precision = axisPrecision;
                    else
                        options.detectAxisPrecision = true;

                    formatter = valueFormatter.create(options);
                }
                else {
                    // do not use display units, just the basic value formatter
                    // datetime is handled above, so we are ordinal and either boolean, numeric, or text.
                    formatter = valueFormatter.createDefaultFormatter(formatString, true);
                }
            }

            return formatter;
        }

        export function getMinTickValueInterval(formatString: string, columnType: ValueType, is100Pct?: boolean): number {
            var isCustomFormat = formatString && !NumberFormat.isStandardFormat(formatString);
            if (isCustomFormat) {
                var precision = NumberFormat.getCustomFormatMetadata(formatString, true /*calculatePrecision*/).precision;
                if (formatString.indexOf('%') > -1)
                    precision += 2; //percent values are multiplied by 100 during formatting
                return Math.pow(10, -precision);
            }
            else if (is100Pct)
                return 0.01;
            else if (columnType.integer)
                return 1;

            return 0;
        }

        /**
         * Format the linear tick labels or the category labels.
         */
        function formatAxisTickValues(
            axis: D3.Svg.Axis,
            tickValues: any[],
            formatter: IValueFormatter,
            dataType: ValueType,
            getValueFn?: (index: number, type: ValueType) => any) {

            var formattedTickValues = [];

            if (!getValueFn)
                getValueFn = data => data;

            if (formatter) {
                axis.tickFormat(d => formatter.format(getValueFn(d, dataType)));
                formattedTickValues = tickValues.map(d => formatter.format(getValueFn(d, dataType)));
            }
            else {
                formattedTickValues = tickValues.map((d) => getValueFn(d, dataType));
            }

            return formattedTickValues;
        }

        export function isLogScalePossible(domain: any[], axisType?: ValueType): boolean {
            if (domain == null)
                return false;
            if (isDateTime(axisType))
                return false;

            return (domain[0] > 0 && domain[1] > 0) || (domain[0] < 0 && domain[1] < 0);//doman must exclude 0
        }

        export function isDateTime(type: ValueTypeDescriptor): boolean {
            return !!(type && type.dateTime);
        }

        export function getRecommendedTickValues(maxTicks: number,
            scale: D3.Scale.GenericScale<any>,
            axisType: ValueType,
            isScalar: boolean,
            minTickInterval?: number): any[] {

            if (!isScalar || isOrdinalScale(scale)) {
                return getRecommendedTickValuesForAnOrdinalRange(maxTicks, scale.domain());
            }
            else if (isDateTime(axisType)) {
                return getRecommendedTickValuesForADateTimeRange(maxTicks, scale.domain());
            }
            return getRecommendedTickValuesForAQuantitativeRange(maxTicks, scale, minTickInterval);
        }

        export function getRecommendedTickValuesForAnOrdinalRange(maxTicks: number, labels: string[]): string[] {
            var tickLabels: string[] = [];

            // return no ticks in this case
            if (maxTicks <= 0)
                return tickLabels;

            var len = labels.length;
            if (maxTicks > len)
                return labels;

            for (var i = 0, step = Math.ceil(len / maxTicks); i < len; i += step) {
                tickLabels.push(labels[i]);
            }
            return tickLabels;
        }

        export function getRecommendedTickValuesForAQuantitativeRange(maxTicks: number, scale: D3.Scale.GenericScale<any>, minInterval?: number): number[] {
            var tickLabels: number[] = [];

            //if maxticks is zero return none
            if (maxTicks === 0)
                return tickLabels;

            var quantitiveScale = <D3.Scale.QuantitativeScale>scale;
            if (quantitiveScale.ticks) {
                tickLabels = quantitiveScale.ticks(maxTicks);
                if (tickLabels.length > maxTicks && maxTicks > 1)
                    tickLabels = quantitiveScale.ticks(maxTicks - 1);
                if (tickLabels.length < MinTickCount) {
                    tickLabels = quantitiveScale.ticks(maxTicks + 1);
                }
                tickLabels = createTrueZeroTickLabel(tickLabels);

                if (minInterval && tickLabels.length > 1) {
                    var tickInterval = tickLabels[1] - tickLabels[0];
                    while (tickInterval > 0 && tickInterval < minInterval) {
                        for (var i = 1; i < tickLabels.length; i++) {
                            tickLabels.splice(i, 1);
                        }

                        tickInterval = tickInterval * 2;
                    }
                    // keep at least two labels - the loop above may trim all but one if we have odd # of tick labels and dynamic range < minInterval
                    if (tickLabels.length === 1) {
                        tickLabels.push(tickLabels[0] + minInterval);
                    }
                }
                return tickLabels;
            }

            debug.assertFail('must pass a quantitative scale to this method');

            return tickLabels;
        }

        function getRecommendedTickValuesForADateTimeRange(maxTicks: number, dataDomain: number[]): number[] {
            var tickLabels: number[] = [];

            if (dataDomain[0] === 0 && dataDomain[1] === 0)
                return [];

            var dateTimeTickLabels = DateTimeSequence.calculate(new Date(dataDomain[0]), new Date(dataDomain[1]), maxTicks).sequence;
            tickLabels = dateTimeTickLabels.map(d => d.getTime());
            tickLabels = ensureValuesInRange(tickLabels, dataDomain[0], dataDomain[1]);
            return tickLabels;
        }

        export function isOrdinalScale(scale: any): boolean {
            return typeof scale.invert === 'undefined';
        }

        /**
         * Gets the ValueType of a category column, defaults to Text if the type is not present.
         */
        export function getCategoryValueType(metadataColumn: DataViewMetadataColumn, isScalar?: boolean): ValueType {
            if (metadataColumn && columnDataTypeHasValue(metadataColumn.type))
                return <ValueType>metadataColumn.type;

            if (isScalar) {
                return ValueType.fromDescriptor({ numeric: true });
            }

            return ValueType.fromDescriptor({ text: true });
        }

        export function columnDataTypeHasValue(dataType: ValueTypeDescriptor) {
            return dataType && (dataType.bool || dataType.numeric || dataType.text || dataType.dateTime);
        }

        export function createScale(options: CreateAxisOptions): CreateScaleResult {
            var pixelSpan = options.pixelSpan,
                dataDomain = options.dataDomain,
                metaDataColumn = options.metaDataColumn,
                outerPadding = options.outerPadding || 0,
                isScalar = !!options.isScalar,
                isVertical = !!options.isVertical,
                forcedTickCount = options.forcedTickCount,
                categoryThickness = options.categoryThickness,
                shouldClamp = !!options.shouldClamp,
                maxTickCount = options.maxTickCount,
                innerPaddingRatio: number = options.innerPaddingRatio || InnerPaddingRatio,
                minOrdinalRectThickness: number = options.minOrdinalRectThickness || MinOrdinalRectThickness;

            var dataType: ValueType = getCategoryValueType(metaDataColumn, isScalar);

            var maxTicks = isVertical ? getRecommendedNumberOfTicksForYAxis(pixelSpan) : getRecommendedNumberOfTicksForXAxis(pixelSpan);
            if (maxTickCount &&
                maxTicks > maxTickCount)
                maxTicks = maxTickCount;

            var scalarDomain = dataDomain ? dataDomain.slice() : null;
            var bestTickCount = maxTicks;
            var scale: D3.Scale.GenericScale<any>;
            var usingDefaultDomain = false;

            if (dataDomain == null || (dataDomain.length === 2 && dataDomain[0] == null && dataDomain[1] == null) || (dataDomain.length !== 2 && isScalar)) {
                usingDefaultDomain = true;

                if (dataType.dateTime || !isOrdinal(dataType))
                    dataDomain = emptyDomain;
                else //ordinal
                    dataDomain = [];

                if (isOrdinal(dataType)) {
                    scale = createOrdinalScale(
                        pixelSpan,
                        dataDomain,
                        innerPaddingRatio,
                        categoryThickness ? outerPadding / categoryThickness : 0);
                }
                else {
                    scale = createNumericalScale(options.scaleType, pixelSpan, dataDomain, dataType, outerPadding, bestTickCount);
                }
            }
            else {
                if (isScalar && dataDomain.length > 0) {
                    bestTickCount = forcedTickCount !== undefined
                        ? (maxTicks !== 0 ? forcedTickCount : 0)
                        : getBestNumberOfTicks(dataDomain[0], dataDomain[dataDomain.length - 1], [metaDataColumn], maxTicks, dataType.dateTime);

                    var normalizedRange = normalizeLinearDomain({ min: dataDomain[0], max: dataDomain[dataDomain.length - 1] });
                    scalarDomain = [normalizedRange.min, normalizedRange.max];
                }

                if (isScalar && dataType.numeric && !dataType.dateTime) {
                    scale = createNumericalScale(options.scaleType, pixelSpan, scalarDomain, dataType, outerPadding, bestTickCount, shouldClamp);
                }
                else if (isScalar && dataType.dateTime) {
                    // Use of a linear scale, instead of a D3.time.scale, is intentional since we want
                    // to control the formatting of the time values, since d3's implementation isn't
                    // in accordance to our design.
                    //     scalarDomain: should already be in long-int time (via category.values[0].getTime())
                    scale = createLinearScale(pixelSpan, scalarDomain, outerPadding, null, shouldClamp); // DO NOT PASS TICKCOUNT
                }
                else if (dataType.text || dataType.dateTime || dataType.numeric || dataType.bool) {
                    scale = createOrdinalScale(
                        pixelSpan,
                        scalarDomain,
                        innerPaddingRatio,
                        categoryThickness ? outerPadding / categoryThickness : 0);

                    bestTickCount = maxTicks === 0 ? 0
                        : Math.min(
                            scalarDomain.length,
                            (pixelSpan - outerPadding * 2) / minOrdinalRectThickness);
                }
                else {
                    debug.assertFail('unsupported dataType, something other than text or numeric');
                }
            }

            // vertical ordinal axis (e.g. categorical bar chart) does not need to reverse
            if (isVertical && isScalar) {
                scale.range(scale.range().reverse());
            }

            normalizeInfinityInScale(scale);

            return {
                scale: scale,
                bestTickCount: bestTickCount,
                usingDefaultDomain: usingDefaultDomain,
            };
        }

        export function normalizeInfinityInScale(scale: D3.Scale.GenericScale<any>): void {
            // When large values (eg Number.MAX_VALUE) are involved, a call to scale.nice occasionally
            // results in infinite values being included in the domain. To correct for that, we need to
            // re-normalize the domain now to not include infinities.
            var scaledDomain = scale.domain();
            for (var i = 0, len = scaledDomain.length; i < len; ++i) {
                if (scaledDomain[i] === Number.POSITIVE_INFINITY)
                    scaledDomain[i] = Number.MAX_VALUE;
                else if (scaledDomain[i] === Number.NEGATIVE_INFINITY)
                    scaledDomain[i] = -Number.MAX_VALUE;
            }

            scale.domain(scaledDomain);
        }

        export function createOrdinalScale(
            pixelSpan: number,
            dataDomain: any[],
            innerPaddingRatio: number,
            outerPaddingRatio: number): D3.Scale.OrdinalScale {

            debug.assert(outerPaddingRatio >= 0 && outerPaddingRatio < 4, 'outerPaddingRatio should be a value between zero and four');

            var scale = d3.scale.ordinal()
                /* Avoid using rangeRoundBands here as it is adding some extra padding to the axis*/
                .rangeBands([0, pixelSpan], innerPaddingRatio, outerPaddingRatio)
                .domain(dataDomain);
            return scale;
        }

        function normalizeLinearDomain(domain: NumberRange): NumberRange {
            if (isNaN(domain.min) || isNaN(domain.max)) {
                domain.min = emptyDomain[0];
                domain.max = emptyDomain[1];
            }
            else if (domain.min === domain.max) {
                // d3 linear scale will give zero tickValues if max === min, so extend a little
                domain.min = domain.min < 0 ? domain.min * 1.2 : domain.min * 0.8;
                domain.max = domain.max < 0 ? domain.max * 0.8 : domain.max * 1.2;
            }
            else {
                // Check that min is very small and is a negligable portion of the whole domain.
                // (fix floating pt precision bugs)
                // sometimes highlight value math causes small negative numbers which makes the axis add
                // a large tick interval instead of just rendering at zero.
                if (Math.abs(domain.min) < 0.0001 && domain.min / (domain.max - domain.min) < 0.0001) {
                    domain.min = 0;
                }
            }

            return domain;
        }

        //this function can return different scales e.g. log, linear
        // NOTE: export only for testing, do not access directly
        export function createNumericalScale(
            axisScaleType: string,
            pixelSpan: number,
            dataDomain: any[],
            dataType: ValueType,
            outerPadding: number = 0,
            niceCount?: number,
            shouldClamp?: boolean): D3.Scale.GenericScale<any> {

            if (axisScaleType === axisScale.log && isLogScalePossible(dataDomain, dataType)) {
                return createLogScale(pixelSpan, dataDomain, outerPadding, niceCount);
            }
            else {
                return createLinearScale(pixelSpan, dataDomain, outerPadding, niceCount, shouldClamp);
            }
        }

        function createLogScale(pixelSpan: number, dataDomain: any[], outerPadding: number = 0, niceCount?: number): D3.Scale.LinearScale {
            debug.assert(isLogScalePossible(dataDomain), "dataDomain cannot include 0");
            var scale = d3.scale.log()
                .range([outerPadding, pixelSpan - outerPadding])
                .domain([dataDomain[0], dataDomain[1]])
                .clamp(true);

            if (niceCount) {
                scale.nice(niceCount);
            }

            return scale;
        }

        // NOTE: export only for testing, do not access directly
        export function createLinearScale(pixelSpan: number, dataDomain: any[], outerPadding: number = 0, niceCount?: number, shouldClamp?: boolean): D3.Scale.LinearScale {
            var scale = d3.scale.linear()
                .range([outerPadding, pixelSpan - outerPadding])
                .domain([dataDomain[0], dataDomain[1]])
                .clamp(shouldClamp);
            // .nice(undefined) still modifies the scale boundaries, and for datetime this messes things up.
            // we use millisecond ticks since epoch for datetime, so we don't want any "nice" with numbers like 17398203392.
            if (niceCount) {
                scale.nice(niceCount);
            }
            return scale;
        }

        export function getRecommendedNumberOfTicksForXAxis(availableWidth: number) {
            if (availableWidth < 300)
                return 3;
            if (availableWidth < 500)
                return 5;

            return 8;
        }

        export function getRecommendedNumberOfTicksForYAxis(availableWidth: number) {
            if (availableWidth < 150)
                return 3;
            if (availableWidth < 300)
                return 5;

            return 8;
        }

        export function isOrdinal(type: ValueTypeDescriptor): boolean {
            return !!(type && (type.text || type.bool || (type.misc && type.misc.barcode) || (type.geography && type.geography.postalCode)));
        }

        /**
         * Get the best number of ticks based on minimum value, maximum value,
         * measure metadata and max tick count.
         * 
         * @param min The minimum of the data domain.
         * @param max The maximum of the data domain.
         * @param valuesMetadata The measure metadata array.
         * @param maxTickCount The max count of intervals.
         * @param isDateTime - flag to show single tick when min is equal to max.
         */
        export function getBestNumberOfTicks(min: number, max: number, valuesMetadata: DataViewMetadataColumn[], maxTickCount: number, isDateTime?: boolean): number {
            debug.assert(maxTickCount >= 0, "maxTickCount must be greater or equal to zero");

            if (isNaN(min) || isNaN(max))
                return DefaultBestTickCount;

            debug.assert(min <= max, "min value needs to be less or equal to max value");

            if (maxTickCount <= 1 || (max <= 1 && min >= -1))
                return maxTickCount;

            if (min === max) {
                // datetime needs to only show one tick value in this case so formatting works correctly
                if (!!isDateTime)
                    return 1;
                return DefaultBestTickCount;
            }

            if (hasNonIntegerData(valuesMetadata))
                return maxTickCount;

            // e.g. 5 - 2 + 1 = 4, => [2,3,4,5]
            return Math.min(max - min + 1, maxTickCount);
        }

        export function ensureValuesInRange(values: number[], min: number, max: number): number[] {
            debug.assert(min <= max, "min must be less or equal to max");
            var filteredValues = values.filter(v => v >= min && v <= max);
            if (filteredValues.length < 2)
                filteredValues = [min, max];
            return filteredValues;
        }

        export function hasNonIntegerData(valuesMetadata: DataViewMetadataColumn[]): boolean {
            for (var i = 0, len = valuesMetadata.length; i < len; i++) {
                var currentMetadata = valuesMetadata[i];
                if (currentMetadata && currentMetadata.type && !currentMetadata.type.integer) {
                    return true;
                }
            }

            return false;
        }

        /** 
         * Round out very small zero tick values (e.g. -1e-33 becomes 0).
         * 
         * @param ticks Array of numbers (from d3.scale.ticks([maxTicks])).
         * @param epsilon Max ratio of calculated tick interval which we will recognize as zero.
         * 
         * e.g.
         *     ticks = [-2, -1, 1e-10, 3, 4]; epsilon = 1e-5;
         *     closeZero = 1e-5 * | 2 - 1 | = 1e-5
         *     // Tick values <= 1e-5 replaced with 0
         *     return [-2, -1, 0, 3, 4];
         */
        function createTrueZeroTickLabel(ticks: number[], epsilon: number = 1e-5): number[] {
            if (!ticks || ticks.length < 2)
                return ticks;

            var closeZero = epsilon * Math.abs(ticks[1] - ticks[0]);

            return ticks.map((tick) => Math.abs(tick) <= closeZero ? 0 : tick);
        }
    }
}
