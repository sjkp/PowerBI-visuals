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
    import PixelConverter = jsCommon.PixelConverter;
    import LegendData = powerbi.visuals.LegendData;
    import IDataLabelInfo = powerbi.IDataLabelInfo;
    import LabelEnabledDataPoint = powerbi.visuals.LabelEnabledDataPoint;
    import SelectableDataPoint = powerbi.visuals.SelectableDataPoint;
    import TooltipDataItem = powerbi.visuals.TooltipDataItem;
    import IMargin = powerbi.visuals.IMargin;
    import IViewport = powerbi.IViewport;
    import VisualCapabilities = powerbi.VisualCapabilities;
    import DataView = powerbi.DataView;
    import DataViewObjectPropertyIdentifier = powerbi.DataViewObjectPropertyIdentifier;
    import IEnumType = powerbi.IEnumType;
    import createEnumType = powerbi.createEnumType;
    import IEnumMember = powerbi.IEnumMember;
    import DataViewObjects = powerbi.DataViewObjects;
    import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
    import ObjectEnumerationBuilder = powerbi.visuals.ObjectEnumerationBuilder;
    import VisualObjectInstance = powerbi.VisualObjectInstance;
    import dataLabelUtils = powerbi.visuals.dataLabelUtils;
    import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
    import DataViewValueColumns = powerbi.DataViewValueColumns;
    import DataViewCategoricalColumn = powerbi.DataViewCategoricalColumn;
    import converterHelper = powerbi.visuals.converterHelper;
    import DataViewCategoryColumn = powerbi.DataViewCategoryColumn;
    import DataViewValueColumn = powerbi.DataViewValueColumn;
    import IVisual = powerbi.IVisual;
    import VisualDataRoleKind = powerbi.VisualDataRoleKind;
    import createDisplayNameGetter = powerbi.data.createDisplayNameGetter;
    import IDataColorPalette = powerbi.IDataColorPalette;
    import SelectionManager = powerbi.visuals.utility.SelectionManager;
    import ColorHelper = powerbi.visuals.ColorHelper;
    import valueFormatter = powerbi.visuals.valueFormatter;
    import SelectionId = powerbi.visuals.SelectionId;
    import SelectionIdBuilder = powerbi.visuals.SelectionIdBuilder;
    import TooltipBuilder = powerbi.visuals.TooltipBuilder;
    import VisualInitOptions = powerbi.VisualInitOptions;
    import VisualUpdateOptions = powerbi.VisualUpdateOptions;
    import AnimatorCommon = powerbi.visuals.AnimatorCommon;
    import DataLabelManager = powerbi.DataLabelManager;
    import DataLabelArrangeGrid = powerbi.DataLabelArrangeGrid;
    import shapes = powerbi.visuals.shapes;
    import IRect = powerbi.visuals.IRect;
    import SVGUtil = powerbi.visuals.SVGUtil;
    import TooltipManager = powerbi.visuals.TooltipManager;
    import TooltipEvent = powerbi.visuals.TooltipEvent;
    import ILabelLayout = powerbi.visuals.ILabelLayout;
    import DataViewObjectPropertyTypeDescriptor = powerbi.data.DataViewObjectPropertyTypeDescriptor;
    import lessWithPrecision = powerbi.Double.lessWithPrecision;

    export interface ChordChartData {
        settings: ChordChartSettings;
        dataView: DataView;
        dataMatrix: number[][];
        labelDataPoints: ChordArcDescriptor[];
        legendData?: LegendData;
        tooltipData: ChordTooltipData[][];
        sliceTooltipData: ChordTooltipData[];
        tickUnit: number;
        differentFromTo: boolean;
        defaultDataPointColor?: string;
        prevAxisVisible: boolean;
    }

    export interface ChordArcDescriptor extends D3.Layout.ArcDescriptor, IDataLabelInfo {
        data: ChordArcLabelData;
    }

    export interface ChordTicksArcDescriptor extends D3.Layout.ArcDescriptor {
        angleLabels: { angle: number, label: string }[];
    }

    export interface ChordArcLabelData extends LabelEnabledDataPoint, SelectableDataPoint {
        label: string;
        labelColor: string;
        barColor: string;
        isCategory: boolean;
    }

    export interface ChordLabelEnabledDataPoint extends LabelEnabledDataPoint {
        data?: ChordArcLabelData;
    }

    export interface ChordTooltipData {
        tooltipInfo: TooltipDataItem[];
    }

    class VisualLayout {
        private marginValue: IMargin;
        private viewportValue: IViewport;
        private viewportInValue: IViewport;
        private minViewportValue: IViewport;

        public defaultMargin: IMargin;
        public defaultViewport: IViewport;

        constructor(defaultViewport?: IViewport, defaultMargin?: IMargin) {
            this.defaultViewport = defaultViewport || { width: 0, height: 0 };
            this.defaultMargin = defaultMargin || { top: 0, bottom: 0, right: 0, left: 0 };
        }

        public get margin(): IMargin {
            return this.marginValue || (this.margin = this.defaultMargin);
        }

        public set margin(value: IMargin) {
            this.marginValue = VisualLayout.restrictToMinMax(value);
            this.update();
        }

        public get viewport(): IViewport {
            return this.viewportValue || (this.viewportValue = this.defaultViewport);
        }

        public set viewport(value: IViewport) {
            this.viewportValue = VisualLayout.restrictToMinMax(value, this.minViewport);
            this.update();
        }

        public get viewportIn(): IViewport {
            return this.viewportInValue || this.viewport;
        }

        public get minViewport(): IViewport {
            return this.minViewportValue;
        }

        public set minViewport(value: IViewport) {
            this.minViewportValue = value;
        }

        public get viewportInIsZero(): boolean {
            return this.viewportIn.width === 0 || this.viewportIn.height === 0;
        }

        public resetMargin(): void {
            this.margin = this.defaultMargin;
        }

        private update(): void {
            this.viewportInValue = VisualLayout.restrictToMinMax({
                width: this.viewport.width - (this.margin.left + this.margin.right),
                height: this.viewport.height - (this.margin.top + this.margin.bottom)
            }, this.minViewportValue);
        }

        private static restrictToMinMax<T>(value: T, minValue?: T): T {
            var result = $.extend({}, value);
            _.keys(value).forEach(x => result[x] = Math.max(minValue && minValue[x] || 0, value[x]));
            return result;
        }
    }

    class ChordChartHelpers {
        public static interpolateArc(arc: D3.Svg.Arc) {
            return function (data) {
                if (!this.oldData) {
                    this.oldData = data;
                    return () => arc(data);
                }

                var interpolation = d3.interpolate(this.oldData, data);
                this.oldData = interpolation(0);
                return (x) => arc(interpolation(x));
            };
        }

        public static addContext(context: any, fn: Function): any {
            return <any>function() {
                return fn.apply(context, [this].concat(_.toArray(arguments)));
            };
        }
    }

    export class ChordChartSettings {
        public static get Default() { 
            return new this();
        }

        public static parse(dataView: DataView, capabilities: VisualCapabilities) {
            var settings = new this();
            if(!dataView || !dataView.metadata || !dataView.metadata.objects) {
                return settings;
            }

            var properties = this.getProperties(capabilities);
            for(var objectKey in capabilities.objects) {
                for(var propKey in capabilities.objects[objectKey].properties) {
                    if(!settings[objectKey] || !_.has(settings[objectKey], propKey)) {
                        continue;
                    }

                    var type = capabilities.objects[objectKey].properties[propKey].type;
                    var getValueFn = this.getValueFnByType(type);
                    settings[objectKey][propKey] = getValueFn(
                        dataView.metadata.objects,
                        properties[objectKey][propKey],
                        settings[objectKey][propKey]);
                }
            }

            return settings;
        }

        public static getProperties(capabilities: VisualCapabilities)
            : { [i: string]: { [i: string]: DataViewObjectPropertyIdentifier } } & { 
                general: { formatString: DataViewObjectPropertyIdentifier },
                dataPoint: { fill: DataViewObjectPropertyIdentifier } } {
            var objects  = _.merge({ 
                general: { properties: { formatString: {} } } 
            }, capabilities.objects);
            var properties = <any>{};
            for(var objectKey in objects) {
                properties[objectKey] = {};
                for(var propKey in objects[objectKey].properties) {
                    properties[objectKey][propKey] = <DataViewObjectPropertyIdentifier> {
                        objectName: objectKey,
                        propertyName: propKey
                    };
                }
            }

            return properties;
        }

        public static createEnumTypeFromEnum(type: any): IEnumType {
            var even: any = false;
            return createEnumType(Object.keys(type)
                .filter((key,i) => ((!!(i % 2)) === even && type[key] === key
                    && !void(even = !even)) || (!!(i % 2)) !== even)
                .map(x => <IEnumMember>{ value: x, displayName: x }));
        }

        private static getValueFnByType(type: DataViewObjectPropertyTypeDescriptor) {
            switch(_.keys(type)[0]) {
                case 'fill': 
                    return DataViewObjects.getFillColor;
                default:
                    return DataViewObjects.getValue;
            }
        }

        public static enumerateObjectInstances(
            settings: any,
            options: EnumerateVisualObjectInstancesOptions,
            capabilities: VisualCapabilities): ObjectEnumerationBuilder {

            var enumeration = new ObjectEnumerationBuilder();
            var object = settings && settings[options.objectName];
            if(!object) {
                return enumeration;
            }

            var instance = <VisualObjectInstance>{
                objectName: options.objectName,
                selector: null,
                properties: {}
            };

            for(var key in object) {
                if(_.has(object,key)) {
                    instance.properties[key] = object[key];
                }
            }

            enumeration.pushInstance(instance);
            return enumeration;
        }

        //Default Settings
        public dataPoint = {
            defaultColor: null,
            showAllDataPoints: false
        };
        public axis = {
            show: true
        };
        public labels = {
            show: true,
            color: dataLabelUtils.defaultLabelColor,
            fontSize: dataLabelUtils.DefaultFontSizeInPt
        };
    }

    export class ChordChartColumns<T> {
        public static Roles = Object.freeze(
            _.mapValues(new ChordChartColumns<string>(), (x, i) => i));

        public static getColumnSources(dataView: DataView) {
            return this.getColumnSourcesT<DataViewMetadataColumn>(dataView);
        }

        public static getTableValues(dataView: DataView) {
            var table = dataView && dataView.table;
            var columns = this.getColumnSourcesT<any[]>(dataView);
            return columns && table && _.mapValues(
                columns, (n: DataViewMetadataColumn, i) => n && table.rows.map(row => row[n.index]));
        }

        public static getTableRows(dataView: DataView) {
            var table = dataView && dataView.table;
            var columns = this.getColumnSourcesT<any[]>(dataView);
            return columns && table && table.rows.map(row =>
                _.mapValues(columns, (n: DataViewMetadataColumn, i) => n && row[n.index]));
        }

        public static getCategoricalValues(dataView: DataView) {
            var categorical = dataView && dataView.categorical;
            var categories = categorical && categorical.categories || [];
            var values = categorical && categorical.values || <DataViewValueColumns>[];
            var series: string[] = categorical && values.source && this.getSeriesValues(dataView);
            return categorical && _.mapValues(new this<any[]>(), (n, i) =>
                (<DataViewCategoricalColumn[]>_.toArray(categories)).concat(_.toArray(values))
                    .filter(x => x.source.roles && x.source.roles[i]).map(x => x.values)[0]
                || values.source && values.source.roles && values.source.roles[i] && series);
        }

        public static getSeriesValues(dataView: DataView) {
            return dataView && dataView.categorical && dataView.categorical.values
                && dataView.categorical.values.map(x => converterHelper.getSeriesName(x.source));
        }

        public static getCategoricalColumns(dataView: DataView) {
            var categorical = dataView && dataView.categorical;
            var categories = categorical && categorical.categories || [];
            var values = categorical && categorical.values || <DataViewValueColumns>[];
            return categorical && _.mapValues(
                new this<DataViewCategoryColumn & DataViewValueColumn[] & DataViewValueColumns>(),
                (n, i) => categories.filter(x => x.source.roles && x.source.roles[i])[0]
                    || values.source && values.source.roles && values.source.roles[i]
                    || values.filter(x => x.source.roles && x.source.roles[i]));
        }

        private static getColumnSourcesT<T>(dataView: DataView) {
            var columns = dataView && dataView.metadata && dataView.metadata.columns;
            return columns && _.mapValues(
                new this<T>(), (n, i) => columns.filter(x => x.roles && x.roles[i])[0]);
        }

        //Data Roles
        public Category: T = null;
        public Series: T = null;
        public Y: T = null;
    }

    export class ChordChart implements IVisual {
        public static capabilities: VisualCapabilities = {
            dataRoles: [
                {
                    name: ChordChartColumns.Roles.Category,
                    kind: VisualDataRoleKind.Grouping,
                    displayName: 'From',
                }, {
                    name: ChordChartColumns.Roles.Series,
                    kind: VisualDataRoleKind.Grouping,
                    displayName: 'To',
                }, {
                    name: ChordChartColumns.Roles.Y,
                    kind: VisualDataRoleKind.Measure,
                    displayName: "Values",
                }
            ],
            dataViewMappings: [{
                conditions: [
                    { 'Category': { max: 1 }, 'Series': { max: 0 } },
                    { 'Category': { max: 1 }, 'Series': { min: 1, max: 1 }, 'Y': { max: 1 } },
                    { 'Category': { max: 1 }, 'Series': { max: 0 }, 'Y': { min: 0, max: 1 } },
                ],
                categorical: {
                    categories: {
                        for: { in: 'Category' },
                        dataReductionAlgorithm: { top: {} }
                    },
                    values: {
                        group: {
                            by: 'Series',
                            select: [{ bind: { to: 'Y' } }],
                            dataReductionAlgorithm: { top: {} }
                        },
                    },
                    rowCount: { preferred: { min: 2 }, supported: { min: 1 } }
                },
            }],
            objects: {
                dataPoint: {
                    displayName: createDisplayNameGetter('Visual_DataPoint'),
                    properties: {
                        defaultColor: {
                            displayName: createDisplayNameGetter('Visual_DefaultColor'),
                            type: { fill: { solid: { color: true } } }
                        },
                        showAllDataPoints: {
                            displayName: createDisplayNameGetter('Visual_DataPoint_Show_All'),
                            type: { bool: true }
                        },
                        fill: {
                            displayName: createDisplayNameGetter('Visual_Fill'),
                            type: { fill: { solid: { color: true } } }
                        },
                    },
                },
                axis: {
                    displayName: 'Axis',
                    properties: {
                        show: {
                            type: { bool: true }
                        },
                    },
                },
                labels: {
                    displayName: 'Labels',
                    properties: {
                        show: {
                            type: { bool: true }
                        },
                        color: {
                            displayName: createDisplayNameGetter("Visual_Reference_Line_Data_Label_Color"),
                            description: createDisplayNameGetter('Visual_Reference_Line_Data_Label_Color_Description'),
                            type: { fill: { solid: { color: true } } }
                        },
                        fontSize: {
                            displayName: createDisplayNameGetter('Visual_TextSize'),
                            type: { formatting: { fontSize: true } },
                        },
                    },
                }
            }
        };

        public static PolylineOpacity = 0.5;

        private static OuterArcRadiusRatio = 0.9;
        private static InnerArcRadiusRatio = 0.8;
        private static LabelMargin = 10;
        private static DefaultMargin: IMargin = { left: 10, right: 10, top: 10, bottom: 10 };
        private static VisualClassName = 'chordChart';
        private static TicksFontSize = 12;

        private static sliceClass: ClassAndSelector = {
            class: 'slice',
            selector: '.slice',
        };

        private static chordClass: ClassAndSelector = {
            class: 'chord',
            selector: '.chord',
        };

        private static sliceTicksClass: ClassAndSelector = {
            class: 'slice-ticks',
            selector: '.slice-ticks'
        };

        private static tickPairClass: ClassAndSelector = {
            class: 'tick-pair',
            selector: '.tick-pair'
        };

        private static tickLineClass: ClassAndSelector = {
            class: 'tick-line',
            selector: '.tick-line'
        };

        private static tickTextClass: ClassAndSelector = {
            class: 'tick-text',
            selector: '.tick-text'
        };

        private static labelGraphicsContextClass: ClassAndSelector = {
            class: 'labels',
            selector: '.labels',
        };

        private static labelsClass: ClassAndSelector = {
            class: 'data-labels',
            selector: '.data-labels',
        };

        private static linesGraphicsContextClass: ClassAndSelector = {
            class: 'lines',
            selector: '.lines',
        };

        private static lineClass: ClassAndSelector = {
            class: 'line-label',
            selector: '.line-label',
        };

        private chordLayout: D3.Layout.ChordLayout;
        private element: JQuery;

        private svg: D3.Selection;
        private mainGraphicsContext: D3.Selection;
        private slices: D3.Selection;
        private labels: D3.Selection;
        private lines: D3.Selection;

        private data: ChordChartData;
        private get settings(): ChordChartSettings {
            return this.data && this.data.settings;
        }
        private layout: VisualLayout;
        private duration: number;
        private colors: IDataColorPalette;
        private selectionManager: SelectionManager;

        private radius: number;
        private get innerRadius(): number {
            return this.radius * ChordChart.InnerArcRadiusRatio;
        }
        private get outerRadius(): number {
            return this.radius * ChordChart.OuterArcRadiusRatio;
        }

        /* Convert a DataView into a view model */
        public static converter(dataView: DataView, colors: IDataColorPalette, prevAxisVisible: boolean): ChordChartData {
            var properties = ChordChartSettings.getProperties(ChordChart.capabilities);
            var settings = ChordChart.parseSettings(dataView);
            var columns = ChordChartColumns.getCategoricalColumns(dataView);
            var sources = ChordChartColumns.getColumnSources(dataView);
            var catValues = ChordChartColumns.getCategoricalValues(dataView);

            if (!catValues || _.isEmpty(catValues.Category) || _.isEmpty(catValues.Y)) {
                return null;
            }

            catValues.Series = catValues.Series || ChordChartColumns.getSeriesValues(dataView);

            var dataMatrix: number[][] = [];
            var legendData: LegendData = {
                dataPoints: [],
                title: sources.Y.displayName || "",
            };
            var toolTipData: ChordTooltipData[][] = [];
            var sliceTooltipData: ChordTooltipData[] = [];
            var max: number = 1000;
            var seriesIndex: number[] = _.mapValues(_.invert(catValues.Series), parseFloat); /* series index array */
            var catIndex: number[] = _.mapValues(_.invert(catValues.Category), parseFloat);    /* index array for category names */
            var isDiffFromTo: boolean = false;  /* boolean variable indicates that From and To are different */
            var labelData: ChordArcLabelData[] = [];    /* label data: !important */
            var colorHelper = new ColorHelper(colors, properties.dataPoint.fill, settings.dataPoint.defaultColor);
            var totalFields: any[] = this.union_arrays(catValues.Category, catValues.Series).reverse();

            if (ChordChart.getValidArrayLength(totalFields) ===
                ChordChart.getValidArrayLength(catValues.Category) + ChordChart.getValidArrayLength(catValues.Series)) {
                isDiffFromTo = true;
            }

            var categoryColumnFormatter = valueFormatter.create({
                format: valueFormatter.getFormatString(sources.Category, properties.general.formatString, true)
                    || sources.Category.format
            });
            var valueColumnFormatter = valueFormatter.create({
                format: valueFormatter.getFormatString(sources.Y, properties.general.formatString, true)
                    || sources.Y.format
            });

            for (var i: number = 0, iLen = totalFields.length; i < iLen; i++) {
                var id: SelectionId = null;
                var color: string = '';
                var isCategory: boolean = false;

                if (catIndex[totalFields[i]] !== undefined) {
                    var index = catIndex[totalFields[i]];
                    id = SelectionIdBuilder
                        .builder()
                        .withCategory(columns.Category, catIndex[totalFields[i]])
                        .createSelectionId();
                    isCategory = true;
                    var thisCategoryObjects = columns.Category.objects ? columns.Category.objects[index] : undefined;

                    color = colorHelper.getColorForSeriesValue(thisCategoryObjects, /* cat.identityFields */ undefined, catValues.Category[index]);

                } else if (seriesIndex[totalFields[i]] !== undefined) {
                    var index = seriesIndex[totalFields[i]];

                    var seriesData = columns.Y[index];
                    var seriesObjects = seriesData && seriesData.objects && seriesData.objects[0];
                    var seriesNameStr = converterHelper.getSeriesName(seriesData.source);

                    id = SelectionId.createWithId(seriesData.identity);
                    isCategory = false;

                    color = colorHelper.getColorForSeriesValue(seriesObjects, /* values.identityFields */ undefined, seriesNameStr);
                }

                labelData.push({
                    label: totalFields[i],
                    labelColor: settings.labels.color,
                    barColor: color,
                    isCategory: isCategory,
                    identity: id,
                    selected: false,
                    labelFontSize: PixelConverter.fromPointToPixel(settings.labels.fontSize)
                });

                dataMatrix.push([]);
                toolTipData.push([]);

                for (var j = 0, jLen = totalFields.length; j < jLen; j++) {
                    var elementValue: number = 0;
                    var tooltipInfo: TooltipDataItem[] = [];

                    if (catIndex[totalFields[i]] !== undefined &&
                        seriesIndex[totalFields[j]] !== undefined) {
                        var row: number = catIndex[totalFields[i]];
                        var col: number = seriesIndex[totalFields[j]];
                        if (columns.Y[col].values[row] !== null) {
                            elementValue = columns.Y[col].values[row];

                            if (elementValue > max)
                                max = elementValue;

                            tooltipInfo = TooltipBuilder.createTooltipInfo(
                                properties.general.formatString,
                                dataView.categorical,
                                categoryColumnFormatter.format(catValues.Category[i]),
                                valueColumnFormatter.format(elementValue),
                                null,
                                null,
                                col,
                                row);
                        }
                    } else if (isDiffFromTo && catIndex[totalFields[j]] !== undefined &&
                        seriesIndex[totalFields[i]] !== undefined) {
                        var row: number = catIndex[totalFields[j]];
                        var col: number = seriesIndex[totalFields[i]];
                        if (columns.Y[col].values[row] !== null) {
                            elementValue = columns.Y[col].values[row];
                        }
                    }

                    dataMatrix[i].push(elementValue || 0);
                    toolTipData[i].push({
                        tooltipInfo: tooltipInfo
                    });
                }

                var totalSum = d3.sum(dataMatrix[i]);

                sliceTooltipData.push({
                    tooltipInfo: [{
                        displayName: totalFields[i],
                        value: valueColumnFormatter.format(totalSum)
                    }]
                });
            }

            var chordLayout = d3.layout.chord()
                .padding(0.1)
                .matrix(dataMatrix);

            var unitLength: number = Math.round(max / 5).toString().length - 1;

            return {
                dataMatrix: dataMatrix,
                dataView: dataView,
                settings: settings,
                labelDataPoints: ChordChart.getChordArcDescriptors(chordLayout.groups(), labelData),
                legendData: legendData,
                tooltipData: toolTipData,
                sliceTooltipData: sliceTooltipData,
                tickUnit: Math.pow(10, unitLength),
                differentFromTo: isDiffFromTo,
                prevAxisVisible: prevAxisVisible === undefined ? settings.axis.show : prevAxisVisible,
            };
        }

        private static parseSettings(dataView: DataView): ChordChartSettings {
            return ChordChartSettings.parse(dataView, ChordChart.capabilities);
        }

        /* Check every element of the array and returns the count of elements which are valid(not undefined) */
        private static getValidArrayLength(array: any[]): number {
            var len = 0;
            for (var i: number = 0, iLen = array.length; i < iLen; i++) {
                if (array[i] !== undefined) {
                    len++;
                }
            }
            return len;
        }

        private static getChordArcDescriptors(groups: D3.Layout.ArcDescriptor[], datum: ChordArcLabelData[]): ChordArcDescriptor[] {
            var labelDataPoints: ChordArcDescriptor[] = groups;
            labelDataPoints.forEach((x,i) => x.data = datum[i]);
            return labelDataPoints;
        }

        public init(options: VisualInitOptions): void {
            var element = this.element = options.element;
            this.selectionManager = new SelectionManager({ hostServices: options.host });
            this.layout = new VisualLayout(options.viewport, ChordChart.DefaultMargin);
            this.layout.minViewport = { width: 150, height:150 };

            this.svg = d3.select(element.get(0))
                .append('svg')
                .style('position', 'absolute')
                .classed(ChordChart.VisualClassName, true);

            this.mainGraphicsContext = this.svg
                .append('g');

            this.mainGraphicsContext
                .append('g')
                .classed('chords', true);

            this.slices = this.mainGraphicsContext
                .append('g')
                .classed('slices', true);

            this.mainGraphicsContext
                .append('g')
                .classed('ticks', true);

            this.labels = this.mainGraphicsContext
                .append('g')
                .classed(ChordChart.labelGraphicsContextClass.class, true);

            this.lines = this.mainGraphicsContext
                .append('g')
                .classed(ChordChart.linesGraphicsContextClass.class, true);

            this.colors = options.style.colorPalette.dataColors;
        }

        /* Called for data, size, formatting changes*/
        public update(options: VisualUpdateOptions) {
            // assert dataView
            if (!options.dataViews || !options.dataViews[0]) {
                return;
            }

            this.layout.viewport = options.viewport;
            this.duration = options.suppressAnimations ? 0 : AnimatorCommon.MinervaAnimationDuration;
            this.data = ChordChart.converter(options.dataViews[0], this.colors, this.settings && this.settings.axis.show);
            if(!this.data) {
                this.clear();
                return;
            }

            this.layout.resetMargin();
            this.layout.margin.top = this.layout.margin.bottom = PixelConverter.fromPointToPixel(this.settings.labels.fontSize) / 2;

            this.render();
        }

        /* Enumerate format values */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions) {
            var instances = ChordChartSettings.enumerateObjectInstances(this.settings, options, ChordChart.capabilities);

            if (this.settings 
                && options.objectName === "dataPoint"
                && !_.isEmpty(this.data.labelDataPoints)
                && this.settings.dataPoint.showAllDataPoints) {

                for (var i: number = 0, length = this.data.labelDataPoints.length; i < length; i++) {
                    var labelDataPoint: ChordArcLabelData = this.data.labelDataPoints[i].data;

                    if (labelDataPoint.isCategory) {
                        var colorInstance: VisualObjectInstance = {
                            objectName: 'dataPoint',
                            displayName: labelDataPoint.label,
                            selector: ColorHelper.normalizeSelector(labelDataPoint.identity.getSelector()),
                            properties: {
                                fill: { solid: { color: labelDataPoint.barColor } }
                            }
                        };

                        instances.pushInstance(colorInstance);
                    }
                }
            }

            return instances.complete();
        }

        /* Calculate radius */
        private calculateRadius(): number {
            if (this.settings.labels.show) {
                // if we have category or data labels, use a sigmoid to blend the desired denominator from 2 to 3.
                // if we are taller than we are wide, we need to use a larger denominator to leave horizontal room for the labels.
                var hw = this.layout.viewportIn.height / this.layout.viewportIn.width;
                var denom = 2 + (1 / (1 + Math.exp(-5 * (hw - 1))));
                return Math.min(this.layout.viewportIn.height, this.layout.viewportIn.width) / denom;
            }

            // no labels
            return Math.min(this.layout.viewportIn.height, this.layout.viewportIn.width) / 2;
        }

        private drawCategoryLabels(): void {
            /** Multiplier to place the end point of the reference line at 0.05 * radius away from the outer edge of the chord/pie. */

            var arc: D3.Svg.Arc = d3.svg.arc()
                .innerRadius(0)
                .outerRadius(this.innerRadius);

            var outerArc: D3.Svg.Arc = d3.svg.arc()
                .innerRadius(this.outerRadius)
                .outerRadius(this.outerRadius);

            if (this.settings.labels.show) {
                var labelLayout = this.getChordChartLabelLayout(outerArc);
                var filteredData = this.getDataLabelManager().hideCollidedLabels(
                    this.layout.viewportIn,
                    this.data.labelDataPoints,
                    labelLayout,
                    /* addTransform */ true);

                this.renderLabels(filteredData, labelLayout, true);
                this.renderLines(filteredData, arc, outerArc);
            }
            else {
                dataLabelUtils.cleanDataLabels(this.labels);
                dataLabelUtils.cleanDataLabels(this.lines, true);
            }
        }

        private getDataLabelManager(): DataLabelManager {
            var dataLabelManager = new DataLabelManager();
            (<any>dataLabelManager).hasCollisions = hasCollisions.bind(dataLabelManager);
            return dataLabelManager;

            function hasCollisions(arrangeGrid: DataLabelArrangeGrid, info: IDataLabelInfo, position: IRect, size: shapes.ISize) {
                if (arrangeGrid.hasConflict(position)) {
                    return true;
                }

                var intersection = { left: 0, top: position.height / 2, width: size.width, height: size.height };
                intersection = shapes.Rect.inflate(intersection, {
                    left: DataLabelManager.InflateAmount,
                    top: 0,
                    right: DataLabelManager.InflateAmount,
                    bottom: 0 });
                intersection = shapes.Rect.intersect(intersection, position);

                if (shapes.Rect.isEmpty(intersection)) {
                    return true;
                }

                return lessWithPrecision(intersection.height, position.height / 2);
            }
        }

        private render(): void {
            this.chordLayout = d3.layout.chord()
                .padding(0.1)
                //.sortGroups(d3.descending)
                .matrix(this.data.dataMatrix);

            this.radius = this.calculateRadius();

            var arc: D3.Svg.Arc = d3.svg.arc().innerRadius(this.radius).outerRadius(this.innerRadius);

            this.svg
                .attr({
                    'width': this.layout.viewport.width,
                    'height': this.layout.viewport.height
                });

            this.mainGraphicsContext
                .attr('transform', SVGUtil.translate(this.layout.viewport.width / 2, this.layout.viewport.height / 2));

            var sliceShapes = this.slices
                .selectAll('path' + ChordChart.sliceClass.selector)
                .data(this.getChordTicksArcDescriptors());

            sliceShapes.enter()
                .insert("path")
                .classed(ChordChart.sliceClass.class, true);

            sliceShapes.style('fill', (d, i) => this.data.labelDataPoints[i].data.barColor)
                .style("stroke", (d, i) => this.data.labelDataPoints[i].data.barColor)
                .on('click', ChordChartHelpers.addContext(this, (context, d, i) => {
                   this.selectionManager.select(this.data.labelDataPoints[i].data.identity).then(ids=> {
                        if (ids.length > 0) {
                            this.mainGraphicsContext.selectAll(".chords path.chord")
                                .style("opacity", 1);

                            this.slices.selectAll("path.slice")
                                .style('opacity', 0.3);

                            this.mainGraphicsContext.selectAll(".chords path.chord")
                                .filter(d => d.source.index !== i && d.target.index !== i)
                                .style("opacity", 0.3);

                            d3.select(context).style('opacity', 1);
                        } else {
                            sliceShapes.style('opacity', 1);
                            this.mainGraphicsContext.selectAll(".chords path.chord")
                                .filter(d => d.source.index !== i && d.target.index !== i)
                                .style("opacity", 1);
                        }
                    });

                    d3.event.stopPropagation();
                }))
                .transition()
                .duration(this.duration)
                .attrTween('d', ChordChartHelpers.interpolateArc(arc));

            sliceShapes.exit()
                .remove();

            TooltipManager.addTooltip(sliceShapes, (tooltipEvent: TooltipEvent) =>
                this.data.sliceTooltipData[tooltipEvent.data.index].tooltipInfo);

            var chordShapes = this.svg.select('.chords')
                .selectAll('path' + ChordChart.chordClass.selector)
                .data(this.chordLayout.chords);

            chordShapes
                .enter().insert("path")
                .classed(ChordChart.chordClass.class, true);

            chordShapes.style("fill", (d, i) => this.data.labelDataPoints[d.target.index].data.barColor)
                .style("opacity", 1)
                .transition()
                .duration(this.duration)
                .attr("d", d3.svg.chord().radius(this.radius));

            chordShapes.exit()
                .remove();

            this.svg
                .on('click', () => this.selectionManager.clear().then(() => {
                    sliceShapes.style('opacity', 1);
                    chordShapes.style('opacity', 1);
                }));

            this.drawTicks();
            this.drawCategoryLabels();

            TooltipManager.addTooltip(chordShapes, (tooltipEvent: TooltipEvent) => {
                var tooltipInfo: TooltipDataItem[] = [];
                if (this.data.differentFromTo) {
                    tooltipInfo = this.data.tooltipData[tooltipEvent.data.source.index]
                    [tooltipEvent.data.source.subindex]
                        .tooltipInfo;
                } else {
                    tooltipInfo.push({
                        displayName: this.data.labelDataPoints[tooltipEvent.data.source.index].data.label
                        + '->' + this.data.labelDataPoints[tooltipEvent.data.source.subindex].data.label,
                        value: this.data.dataMatrix[tooltipEvent.data.source.index]
                        [tooltipEvent.data.source.subindex].toString()
                    });
                    tooltipInfo.push({
                        displayName: this.data.labelDataPoints[tooltipEvent.data.target.index].data.label
                        + '->' + this.data.labelDataPoints[tooltipEvent.data.target.subindex].data.label,
                        value: this.data.dataMatrix[tooltipEvent.data.target.index]
                        [tooltipEvent.data.target.subindex].toString()
                    });
                }
                return tooltipInfo;
            });
        }

        private clear() {
            this.mainGraphicsContext.selectAll(ChordChart.sliceClass.selector).remove();
            this.mainGraphicsContext.selectAll(ChordChart.sliceTicksClass.selector).remove();
            this.mainGraphicsContext.selectAll(ChordChart.chordClass.selector).remove();
            this.mainGraphicsContext.selectAll(ChordChart.labelsClass.selector).remove();
            this.mainGraphicsContext.selectAll(ChordChart.lineClass.selector).remove();
        }

        private clearTicks() {
            var empty = [];
            var tickLines = this.mainGraphicsContext.selectAll(ChordChart.tickLineClass.selector).data(empty);
            tickLines.exit().remove();

            var tickTexts = this.mainGraphicsContext.selectAll(ChordChart.tickTextClass.selector).data(empty);
            tickTexts.exit().remove();

            this.mainGraphicsContext.selectAll(ChordChart.tickPairClass.selector).remove();
            this.mainGraphicsContext.selectAll(ChordChart.sliceTicksClass.selector).remove();
        }

        private getChordTicksArcDescriptors(): ChordTicksArcDescriptor[] {
            var groups = this.chordLayout.groups();
            var maxValue = !_.isEmpty(groups) && _.max(groups, x => x.value).value || 0;
            var minValue = !_.isEmpty(groups) && _.min(groups, x => x.value).value || 0;
            var radiusCoeff = this.radius/Math.abs(maxValue - minValue)*1.25;

            var formatter = valueFormatter.create({
                format: "0.##",
                value: maxValue
            });
            groups.forEach((x: ChordTicksArcDescriptor) => {
                var k = (x.endAngle - x.startAngle) / x.value;
                var absValue = Math.abs(x.value);
                var range = d3.range(0, absValue, absValue - 1 < 0.15 ? 0.15 : absValue - 1);
                if(x.value < 0) {
                    range = range.map(x => x * -1).reverse();
                }

                for(var i = 1; i < range.length; i++) {
                    var gapSize = Math.abs(range[i] - range[i - 1]) * radiusCoeff;
                    if(gapSize < ChordChart.TicksFontSize) {
                        if(range.length > 2 && i === range.length - 1) {
                            range.splice(--i, 1);
                        } else {
                            range.splice(i--, 1);
                        }
                    }
                }

                x.angleLabels = range.map((v, i) => <any>{ angle: v * k + x.startAngle, label: formatter.format(v) });
            });
            return <ChordTicksArcDescriptor[]>groups;
        }

        /* Draw axis(ticks) around the arc */
        private drawTicks(): void {
            if (this.settings.axis.show) {
                var tickShapes = this.mainGraphicsContext.select('.ticks')
                    .selectAll('g' + ChordChart.sliceTicksClass.selector)
                    .data(this.chordLayout.groups);
                var animDuration = (this.data.prevAxisVisible === this.settings.axis.show) ? this.duration : 0;

                tickShapes.enter().insert('g')
                    .classed(ChordChart.sliceTicksClass.class, true);

                var tickPairs = tickShapes.selectAll('g' + ChordChart.tickPairClass.selector)
                    .data((d: ChordTicksArcDescriptor) => d.angleLabels);

                tickPairs.enter().insert('g')
                    .classed(ChordChart.tickPairClass.class, true);

                tickPairs.transition()
                    .duration(animDuration)
                    .attr('transform', (d) =>
                        'rotate(' + (d.angle * 180 / Math.PI - 90) + ')' + 'translate(' + this.innerRadius + ',0)');

                tickPairs.selectAll('line' + ChordChart.tickLineClass.selector)
                    .data((d) => [d])
                    .enter().insert('line')
                    .classed(ChordChart.tickLineClass.class, true)
                    .style("stroke", "#000")
                    .attr("x1", 1)
                    .attr("y1", 0)
                    .attr("x2", 5)
                    .attr("y2", 0);

                tickPairs.selectAll('text' + ChordChart.tickTextClass.selector)
                    .data((d) => [d])
                    .enter().insert('text')
                    .classed(ChordChart.tickTextClass.class, true)
                    .style('pointer-events', "none")
                    .attr("x", 8)
                    .attr("dy", ".35em");

                tickPairs
                    .selectAll('text' + ChordChart.tickTextClass.selector)
                    .text(d => d.label)
                    .style("text-anchor", d => d.angle > Math.PI ? "end" : null)
                    .attr("transform", d => d.angle > Math.PI ? "rotate(180)translate(-16)" : null);

                tickPairs.exit()
                    .remove();

                tickShapes.exit()
                    .remove();

            } else {
                this.clearTicks();
            }

        }

        private renderLabels(
            filteredData: ChordLabelEnabledDataPoint[],
            layout: ILabelLayout,
            isDonut: boolean = false,
            forAnimation: boolean = false): void {

            // Check for a case where resizing leaves no labels - then we need to remove the labels 'g'
            if (filteredData.length === 0) {
                dataLabelUtils.cleanDataLabels(this.labels, true);
                return null;
            }

            // line chart ViewModel has a special 'key' property for point identification since the 'identity' field is set to the series identity
            var hasKey: boolean = (<any>filteredData)[0].key !== null;
            var hasDataPointIdentity: boolean = (<any>filteredData)[0].identity !== null;
            var getIdentifier = hasKey
                ? (d: any) => d.key
                : hasDataPointIdentity ? (d: SelectableDataPoint) => d.identity.getKey() : undefined;

            var dataLabels = isDonut
                ? this.labels.selectAll(ChordChart.labelsClass.selector)
                    .data(filteredData, (d: ChordLabelEnabledDataPoint) => d.data.identity.getKey())
                : getIdentifier !== null
                    ? this.labels.selectAll(ChordChart.labelsClass.selector).data(filteredData, getIdentifier)
                    : this.labels.selectAll(ChordChart.labelsClass.selector).data(filteredData);

            var newLabels = dataLabels.enter()
                .append('text')
                .classed(ChordChart.labelsClass.class, true);
            if (forAnimation)
                newLabels.style('opacity', 0);

            dataLabels
                .attr({ x: (d: LabelEnabledDataPoint) => d.labelX, y: (d: LabelEnabledDataPoint) => d.labelY, dy: '.35em' })
                .text((d: LabelEnabledDataPoint) => d.labeltext)
                .style(layout.style);

            dataLabels
                .exit()
                .remove();
        }

        private renderLines(filteredData: LabelEnabledDataPoint[], arc: D3.Svg.Arc, outerArc: D3.Svg.Arc): void {
            var lines = this.lines.selectAll('polyline')
                .data(filteredData, (d: ChordArcDescriptor) => d.data.identity.getKey());
            var innerLinePointMultiplier = 2.05;

            var midAngle = (d: ChordArcDescriptor) => d.startAngle + (d.endAngle - d.startAngle) / 2;

            lines.enter()
                .append('polyline')
                .classed(ChordChart.lineClass.class, true);

            lines
                .attr('points', d => {
                    var textPoint = outerArc.centroid(d);
                    textPoint[0] = (this.radius + ChordChart.LabelMargin/2) * (midAngle(d) < Math.PI ? 1 : -1);
                    var midPoint = outerArc.centroid(d);
                    var chartPoint = arc.centroid(d);
                    chartPoint[0] *= innerLinePointMultiplier;
                    chartPoint[1] *= innerLinePointMultiplier;
                    return [chartPoint, midPoint, textPoint];
                }).
                style({
                    'opacity': (d: ChordArcDescriptor) => ChordChart.PolylineOpacity,
                    'stroke': (d: ChordArcDescriptor) => d.data.labelColor,
                    'pointer-events': "none"
                });

            lines
                .exit()
                .remove();
        }

        /* Get label layout */
        private getChordChartLabelLayout(outerArc: D3.Svg.Arc): ILabelLayout {
            var midAngle = (d: ChordArcDescriptor) => d.startAngle + (d.endAngle - d.startAngle) / 2;
            var maxLabelWidth: number = (this.layout.viewportIn.width - this.radius * 2 - ChordChart.LabelMargin * 2)/1.6;

            return {
                labelText: (d: ChordLabelEnabledDataPoint) => {
                    // show only category label
                    return dataLabelUtils.getLabelFormattedText({
                        label: d.data.label,
                        maxWidth: maxLabelWidth,
                        fontSize: PixelConverter.fromPointToPixel(this.settings.labels.fontSize),
                    });
                },
                labelLayout: {
                    x: (d: ChordArcDescriptor) =>
                        (this.radius + ChordChart.LabelMargin) * (midAngle(d) < Math.PI ? 1 : -1),
                    y: (d: ChordArcDescriptor) => {
                        var pos = outerArc.centroid(d);
                        return pos[1];
                    },
                },
                filter: (d: ChordArcDescriptor) => (d !== null && d.data !== null && d.data.label !== null),
                style: {
                    'fill': (d: ChordArcDescriptor) => d.data.labelColor,
                    'text-anchor': (d: ChordArcDescriptor) => midAngle(d) < Math.PI ? 'start' : 'end',
                    'font-size': (d: ChordArcDescriptor) => PixelConverter.fromPoint(this.settings.labels.fontSize),
                },
            };
        }

        /* Utility function for union two arrays without duplicates */
        private static union_arrays(x: any[], y: any[]): any[] {
            var obj: Object = {};

            for (var i: number = 0; i < x.length; i++) {
                obj[x[i]] = x[i];
            }

            for (var i: number = 0; i < y.length; i++) {
                obj[y[i]] = y[i];
            }

            var res: string[] = [];

            for (var k in obj) {
                if (obj.hasOwnProperty(k)) {  // <-- optional
                    res.push(obj[k]);
                }
            }
            return res;
        }
    }
}
