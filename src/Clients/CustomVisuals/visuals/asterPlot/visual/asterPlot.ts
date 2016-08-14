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
    import ArcDescriptor = D3.Layout.ArcDescriptor;
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    import createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;
    import PixelConverter = jsCommon.PixelConverter;
    import IStringResourceProvider = jsCommon.IStringResourceProvider;
    import ValueFormatter = powerbi.visuals.valueFormatter;
    import LegendData = powerbi.visuals.LegendData;
    import IValueFormatter = powerbi.visuals.IValueFormatter;
    import SelectableDataPoint = powerbi.visuals.SelectableDataPoint;
    import TooltipDataItem = powerbi.visuals.TooltipDataItem;
    import IInteractivityService = powerbi.visuals.IInteractivityService;
    import IInteractiveBehavior = powerbi.visuals.IInteractiveBehavior;
    import ISelectionHandler = powerbi.visuals.ISelectionHandler;
    import IVisualWarning = powerbi.IVisualWarning;
    import IVisualErrorMessage = powerbi.IVisualErrorMessage;
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
    import LegendPosition = powerbi.visuals.LegendPosition;
    import dataLabelUtils = powerbi.visuals.dataLabelUtils;
    import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
    import DataViewValueColumns = powerbi.DataViewValueColumns;
    import DataViewCategoricalColumn = powerbi.DataViewCategoricalColumn;
    import converterHelper = powerbi.visuals.converterHelper;
    import DataViewCategoryColumn = powerbi.DataViewCategoryColumn;
    import DataViewValueColumn = powerbi.DataViewValueColumn;
    import IVisual = powerbi.IVisual;
    import createDisplayNameGetter = powerbi.data.createDisplayNameGetter;
    import legendPosition = powerbi.visuals.legendPosition;
    import IDataColorPalette = powerbi.IDataColorPalette;
    import ColorHelper = powerbi.visuals.ColorHelper;
    import valueFormatter = powerbi.visuals.valueFormatter;
    import TooltipBuilder = powerbi.visuals.TooltipBuilder;
    import DataViewScopeIdentity = powerbi.DataViewScopeIdentity;
    import SelectionId = powerbi.visuals.SelectionId;
    import LegendIcon = powerbi.visuals.LegendIcon;
    import IVisualHostServices = powerbi.IVisualHostServices;
    import ILegend = powerbi.visuals.ILegend;
    import VisualInitOptions = powerbi.VisualInitOptions;
    import SelectEventArgs = powerbi.SelectEventArgs;
    import appendClearCatcher = powerbi.visuals.appendClearCatcher;
    import createInteractivityService = powerbi.visuals.createInteractivityService;
    import createLegend = powerbi.visuals.createLegend;
    import VisualUpdateOptions = powerbi.VisualUpdateOptions;
    import MinervaAnimationDuration = powerbi.visuals.AnimatorCommon.MinervaAnimationDuration;
    import SVGUtil = powerbi.visuals.SVGUtil;
    import TooltipManager = powerbi.visuals.TooltipManager;
    import TooltipEvent = powerbi.visuals.TooltipEvent;
    import ILabelLayout = powerbi.visuals.ILabelLayout;
    import TextProperties = powerbi.TextProperties;
    import TextMeasurementService = powerbi.TextMeasurementService;
    import DataLabelManager = powerbi.DataLabelManager;
    import LabelEnabledDataPoint = powerbi.visuals.LabelEnabledDataPoint;
    import Legend = powerbi.visuals.Legend;
    import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
    import DataViewObjectPropertyTypeDescriptor = powerbi.data.DataViewObjectPropertyTypeDescriptor;
    import VisualDataRoleKind = powerbi.VisualDataRoleKind;

    var AsterPlotVisualClassName: string = "asterPlot";
    var AsterRadiusRatio: number = 0.9;
    var AsterConflictRatio = 0.9;

    export interface AsterPlotData {
        dataPoints: AsterDataPoint[];
        highlightedDataPoints?: AsterDataPoint[];
        settings: AsterPlotSettings;
        hasHighlights: boolean;
        legendData: LegendData;
        labelFormatter: IValueFormatter;
        centerText: string;
    }

    export interface AsterArcDescriptor extends ArcDescriptor {
        isLabelHasConflict?: boolean;
        data: AsterDataPoint;
    }

    export interface AsterDataPoint extends SelectableDataPoint {
        color: string;
        sliceHeight: number;
        sliceWidth: number;
        label: string;
        highlight?: boolean;
        tooltipInfo: TooltipDataItem[];
        labelFontSize: string;
    }

    export interface AsterPlotBehaviorOptions {
        selection: D3.Selection;
        clearCatcher: D3.Selection;
        interactivityService: IInteractivityService;
        hasHighlights: boolean;
    }

    class AsterPlotWebBehavior implements IInteractiveBehavior {
        private selection: D3.Selection;
        private clearCatcher: D3.Selection;
        private interactivityService: IInteractivityService;
        private hasHighlights: boolean;

        public bindEvents(options: AsterPlotBehaviorOptions, selectionHandler: ISelectionHandler) {
            this.selection = options.selection;
            this.clearCatcher = options.clearCatcher;
            this.interactivityService = options.interactivityService;
            this.hasHighlights = options.hasHighlights;

            this.selection.on("click", (d, i: number) => {
                selectionHandler.handleSelection(d.data, d3.event.ctrlKey);
            });

            this.clearCatcher.on("click", () => {
                selectionHandler.handleClearSelection();
            });

            this.renderSelection(this.interactivityService.hasSelection());
        }

        public renderSelection(hasSelection: boolean) {

            this.selection.style("fill-opacity", (d) => {
                return asterPlotUtils.getFillOpacity(
                    d.data.selected,
                    d.data.highlight,
                    hasSelection,
                    this.hasHighlights);
            });
        }
    }

    export class AsterPlotWarning implements IVisualWarning {
        private message: string;
        constructor(message: string) {
            this.message = message;
        }

        public get code(): string {
            return "AsterPlotWarning";
        }

        public getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage {
            return {
                message: this.message,
                title: resourceProvider.get(""),
                detail: resourceProvider.get("")
            };
        }
    }

    class VisualLayout {
        private marginValue: IMargin;
        private viewportValue: IViewport;
        private viewportInValue: IViewport;
        private minViewportValue: IViewport;
        private originalViewportValue: IViewport;
        private previousOriginalViewportValue: IViewport;

        public defaultMargin: IMargin;
        public defaultViewport: IViewport;

        constructor(defaultViewport?: IViewport, defaultMargin?: IMargin) {
            this.defaultViewport = defaultViewport || { width: 0, height: 0 };
            this.defaultMargin = defaultMargin || { top: 0, bottom: 0, right: 0, left: 0 };
        }

        public get viewport(): IViewport {
            return this.viewportValue || (this.viewportValue = this.defaultViewport);
        }

        public get viewportCopy(): IViewport {
            return _.clone(this.viewport);
        }

        //Returns viewport minus margin
        public get viewportIn(): IViewport {
            return this.viewportInValue || this.viewport;
        }

        public get minViewport(): IViewport {
            return this.minViewportValue || { width: 0, height: 0 };
        }

        public get margin(): IMargin {
            return this.marginValue || (this.marginValue = this.defaultMargin);
        }

        public set minViewport(value: IViewport) {
            this.setUpdateObject(value, v => this.minViewportValue = v, VisualLayout.restrictToMinMax);
        }

        public set viewport(value: IViewport) {
            this.previousOriginalViewportValue = _.clone(this.originalViewportValue);
            this.originalViewportValue = _.clone(value);
            this.setUpdateObject(value,
                v => this.viewportValue = v,
                o => VisualLayout.restrictToMinMax(o, this.minViewport));
        }

        public set margin(value: IMargin) {
            this.setUpdateObject(value, v => this.marginValue = v, VisualLayout.restrictToMinMax);
        }

        //Returns true if viewport has updated after last change.
        public get viewportChanged(): boolean {
            return !!this.originalViewportValue && (!this.previousOriginalViewportValue
                || this.previousOriginalViewportValue.height !== this.originalViewportValue.height
                || this.previousOriginalViewportValue.width !== this.originalViewportValue.width);
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

        private setUpdateObject<T>(object: T, setObjectFn: (T) => void, beforeUpdateFn?: (T) => void): void {
            object = _.clone(object);
            setObjectFn(VisualLayout.createNotifyChangedObject(object, o => {
                if(beforeUpdateFn) beforeUpdateFn(object);
                this.update();
            }));

            if(beforeUpdateFn) beforeUpdateFn(object);
            this.update();
        }

        private static createNotifyChangedObject<T>(object: T, objectChanged: (o?: T, key?: string) => void): T {
            var result: T = <any>{};
            _.keys(object).forEach(key => Object.defineProperty(result, key, {
                    get: () => object[key],
                    set: (value) => { object[key] = value; objectChanged(object, key); },
                    enumerable: true,
                    configurable: true
                }));
            return result;
        }

        private static restrictToMinMax<T>(value: T, minValue?: T): T {
            _.keys(value).forEach(x => value[x] = Math.max(minValue && minValue[x] || 0, value[x]));
            return value;
        }
    }

    class Helpers {
        public static setAttrThroughTransitionIfNotResized(
            element: D3.Selection,
            setTransision: (t: D3.Transition.Transition) => D3.Transition.Transition,
            attrName: string,
            attrValue: (data: any, index: number) => any,
            attrTransitionValue: (data: any, index: number) => any,
            viewportChanged: boolean) {
            if(viewportChanged) {
                element.attr(attrName, attrValue);
            } else {
                setTransision(element.transition()).attrTween(attrName, attrTransitionValue);
            }
        }

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

    export class AsterPlotSettings {
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
                case "fill": 
                    return DataViewObjects.getFillColor;
                default:
                    return DataViewObjects.getValue;
            }
        }

        public static enumerateObjectInstances(
            settings = new this(),
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

        public originalSettings: AsterPlotSettings;
        public createOriginalSettings(): void {
            this.originalSettings = _.cloneDeep(this);
        }

        //Default Settings
        public legend = {
            show: false,
            position: LegendPosition[LegendPosition.Top],
            showTitle: true,
            titleText: "",
            labelColor: LegendData.DefaultLegendLabelFillColor,
            fontSize: 8,
        };
        public labels = {
            show: false,
            color: dataLabelUtils.defaultLabelColor,
            displayUnits: 0,
            precision: dataLabelUtils.defaultLabelPrecision,
            fontSize: dataLabelUtils.DefaultFontSizeInPt,
        };
        public outerLine = {
            show: false,
            thickness: 1,
        };
    }

    export class AsterPlotColumns<T> {
        public static Roles = Object.freeze(
            _.mapValues(new AsterPlotColumns<string>(), (x, i) => i));

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
            var series = categorical && values.source && this.getSeriesValues(dataView);
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
        public Y: T = null;
    }

    export class AsterPlot implements IVisual {
        public static capabilities: VisualCapabilities = {
            dataRoles: [
                {
                    displayName: "Category",
                    name: AsterPlotColumns.Roles.Category,
                    kind: VisualDataRoleKind.Grouping,
                },
                {
                    displayName: "Y Axis",
                    name: AsterPlotColumns.Roles.Y,
                    kind: VisualDataRoleKind.Measure,
                },
            ],
            dataViewMappings: [{
                conditions: [
                    { "Category": { max: 1 }, "Y": { max: 2 } }
                ],
                categorical: {
                    categories: {
                        for: { in: "Category" },
                        dataReductionAlgorithm: { top: {} }
                    },
                    values: {
                        select: [{ bind: { to: "Y" } }]
                    },
                }
            }],
            objects: {
                general: {
                    displayName: createDisplayNameGetter("Visual_General"),
                    properties: {
                        formatString: {
                            type: { formatting: { formatString: true } },
                        },
                    },
                },
                legend: {
                    displayName: "Legend",
                    description: "Display legend options",
                    properties: {
                        show: {
                            displayName: "Show",
                            type: { bool: true }
                        },
                        position: {
                            displayName: "Position",
                            description: "Select the location for the legend",
                            type: { enumeration: legendPosition.type }
                        },
                        showTitle: {
                            displayName: "Title",
                            description: "Display a title for legend symbols",
                            type: { bool: true }
                        },
                        titleText: {
                            displayName: "Legend Name",
                            description: "Title text",
                            type: { text: true },
                            suppressFormatPainterCopy: true
                        },
                        labelColor: {
                            displayName: "Color",
                            type: { fill: { solid: { color: true } } }
                        },
                        fontSize: {
                            displayName: "Text Size",
                            type: { formatting: { fontSize: true } }
                        }
                    }
                },
                label: {
                    displayName: "Center Label",
                    properties: {
                        fill: {
                            displayName: "Fill",
                            type: { fill: { solid: { color: true } } }
                        }
                    }
                },
                labels: {
                    displayName: "Detail Labels",
                    properties: {
                        show: {
                            type: { bool: true }
                        },
                        color: {
                            displayName: "Color",
                            type: { fill: { solid: { color: true } } }
                        },
                        displayUnits: {
                            displayName: "Display Units",
                            type: { formatting: { displayUnits: true } },
                        },
                        precision: {
                            displayName: "Decimal Places",
                            placeHolderText: "Auto",
                            type: { numeric: true },
                        },
                        fontSize: {
                            displayName: "Text Size",
                            type: { formatting: { fontSize: true } },
                        },
                    },
                },
                outerLine: {
                    displayName: "Outer line",
                    properties: {
                        show: {
                            displayName: "Show",
                            type: { bool: true }
                        },
                        thickness: {
                            displayName: "Thickness",
                            type: { numeric: true }
                        }
                    }
                }
            },
            supportsHighlight: true,
        };

        private static AsterSlices: ClassAndSelector = createClassAndSelector("asterSlices");
        private static AsterSlice: ClassAndSelector = createClassAndSelector("asterSlice");
        private static AsterHighlightedSlice: ClassAndSelector = createClassAndSelector("asterHighlightedSlice");
        private static OuterLine: ClassAndSelector = createClassAndSelector("outerLine");
        private static labelGraphicsContextClass: ClassAndSelector = createClassAndSelector("labels");
        private static linesGraphicsContextClass: ClassAndSelector = createClassAndSelector("lines");
        private static CenterLabelClass: ClassAndSelector = createClassAndSelector("centerLabel");
        private static CenterTextFontHeightCoefficient = 0.4;
        private static CenterTextFontWidthCoefficient = 1.9;

        public static converter(dataView: DataView, colors: IDataColorPalette): AsterPlotData {
            var categorical = AsterPlotColumns.getCategoricalColumns(dataView);
            var catValues = AsterPlotColumns.getCategoricalValues(dataView);
            if(!categorical
                || !categorical.Category
                || _.isEmpty(categorical.Category.values)
                || _.isEmpty(categorical.Y)
                || _.isEmpty(categorical.Y[0].values)) {
                return;
            }

            var settings = AsterPlot.parseSettings(dataView, categorical.Category.source);
            var properties = AsterPlotSettings.getProperties(AsterPlot.capabilities);

            var dataPoints: AsterDataPoint[] = [];
            var highlightedDataPoints: AsterDataPoint[] = [];
            var legendData = <LegendData>{
                    dataPoints: [],
                    title: null,
                    fontSize: AsterPlotSettings.Default.legend.fontSize,
                    labelColor: LegendData.DefaultLegendLabelFillColor
                };

            var colorHelper: ColorHelper = new ColorHelper(colors/*, properties.dataPoint.fill*/);

            var hasHighlights: boolean = !!(categorical.Y[0].highlights);

            var maxValue: number = Math.max(d3.min(<number[]>categorical.Y[0].values));
            var minValue: number = Math.min(0, d3.min(<number[]>categorical.Y[0].values));
            var labelFormatter: IValueFormatter = ValueFormatter.create({
                format: ValueFormatter.getFormatString(categorical.Y[0].source, properties.general.formatString),
                precision: settings.labels.precision,
                value: (settings.labels.displayUnits === 0) && (maxValue != null) ? maxValue : settings.labels.displayUnits,
            });
            var categorySourceFormatString = valueFormatter.getFormatString(categorical.Category.source, properties.general.formatString);
            var fontSizeInPx: string = PixelConverter.fromPoint(settings.labels.fontSize);

            for (var i = 0; i < catValues.Category.length; i++) {
                var formattedCategoryValue = valueFormatter.format(catValues.Category[i], categorySourceFormatString);
                var currentValue = <number>categorical.Y[0].values[i];

                var tooltipInfo: TooltipDataItem[] = TooltipBuilder.createTooltipInfo(
                    properties.general.formatString,
                    dataView.categorical,
                    formattedCategoryValue,
                    currentValue,
                    null,
                    null,
                    0);

                if (categorical.Y.length > 1) {
                    var toolTip: TooltipDataItem = TooltipBuilder.createTooltipInfo(
                        properties.general.formatString,
                        dataView.categorical,
                        formattedCategoryValue,
                        categorical.Y[1].values[i],
                        null,
                        null,
                        1)[1];
                    if (toolTip)
                        tooltipInfo.push(toolTip);

                    currentValue += <number>categorical.Y[1].values[i];
                }

                var identity: DataViewScopeIdentity = categorical.Category.identity[i];
                var color: string = colorHelper.getColorForMeasure(categorical.Category.objects && categorical.Category.objects[i], identity.key);
                var selector: SelectionId = SelectionId.createWithId(identity);
                var sliceWidth: number = Math.max(0, categorical.Y.length > 1 ? <number>categorical.Y[1].values[i] : 1);

                if(sliceWidth > 0) {
                    dataPoints.push({
                        sliceHeight: <number>categorical.Y[0].values[i] - minValue,
                        sliceWidth: sliceWidth,
                        label: labelFormatter.format(currentValue),
                        color: color,
                        identity: selector,
                        selected: false,
                        tooltipInfo: tooltipInfo,
                        labelFontSize: fontSizeInPx,
                        highlight: false,
                    });
                }

                // Handle legend data
                if (settings.legend.show) {
                    legendData.dataPoints.push({
                        label: formattedCategoryValue,
                        color: color,
                        icon: LegendIcon.Box,
                        selected: false,
                        identity: selector
                    });
                }

                // Handle highlights
                if (hasHighlights) {
                    var highlightIdentity: SelectionId = SelectionId.createWithHighlight(selector);
                    var notNull: boolean = categorical.Y[0].highlights[i] != null;
                    currentValue = notNull ? <number>categorical.Y[0].highlights[i] : 0;

                    tooltipInfo = TooltipBuilder.createTooltipInfo(
                        properties.general.formatString,
                        dataView.categorical,
                        formattedCategoryValue,
                        currentValue,
                        null,
                        null,
                        0);

                    if (categorical.Y.length > 1) {
                        var toolTip: TooltipDataItem = TooltipBuilder.createTooltipInfo(
                            properties.general.formatString,
                            dataView.categorical,
                            formattedCategoryValue,
                            categorical.Y[1].highlights[i],
                            null,
                            null,
                            1)[1];
                        if (toolTip)
                            tooltipInfo.push(toolTip);

                        currentValue += categorical.Y[1].highlights[i] !== null ? <number>categorical.Y[1].highlights[i] : 0;
                    }

                    highlightedDataPoints.push({
                        sliceHeight: notNull ? <number>categorical.Y[0].highlights[i] - minValue : null,
                        sliceWidth: Math.max(0, (categorical.Y.length > 1 && categorical.Y[1].highlights[i] !== null) ? <number>categorical.Y[1].highlights[i] : sliceWidth),
                        label: labelFormatter.format(currentValue),
                        color: color,
                        identity: highlightIdentity,
                        selected: false,
                        tooltipInfo: tooltipInfo,
                        labelFontSize: fontSizeInPx,
                        highlight: true,
                    });
                }
            }

            return dataPoints.length && <AsterPlotData>{
                    dataPoints: dataPoints,
                    settings: settings,
                    hasHighlights: hasHighlights,
                    legendData: legendData,
                    highlightedDataPoints: highlightedDataPoints,
                    labelFormatter: labelFormatter,
                    centerText: categorical.Category.source.displayName
                };
        }

        private static parseSettings(dataView: DataView, categorySource: DataViewMetadataColumn): AsterPlotSettings {
            var settings = AsterPlotSettings.parse(dataView, AsterPlot.capabilities);
            settings.labels.precision = Math.min(17, Math.max(0, settings.labels.precision));
            settings.outerLine.thickness = Math.min(300, Math.max(1, settings.outerLine.thickness));
            settings.createOriginalSettings();
            if(_.isEmpty(settings.legend.titleText)) {
                settings.legend.titleText = categorySource.displayName;
            }

            return settings;
        }

        private layout: VisualLayout;
        private svg: D3.Selection;
        private mainGroupElement: D3.Selection;
        private mainLabelsElement: D3.Selection;
        private slicesElement: D3.Selection;
        private centerText: D3.Selection;
        private clearCatcher: D3.Selection;
        private colors: IDataColorPalette;
        private hostServices: IVisualHostServices;
        private interactivityService: IInteractivityService;
        private legend: ILegend;
        private data: AsterPlotData;
        private get settings(): AsterPlotSettings {
            return this.data && this.data.settings;
        }

        private behavior: IInteractiveBehavior;

        public init(options: VisualInitOptions): void {
            this.hostServices = options.host;
            this.hostServices.canSelect = (args: SelectEventArgs) => {
                let selectors = _.map(args.visualObjects, (visualObject) => powerbi.data.Selector.convertSelectorsByColumnToSelector(visualObject.selectorsByColumn));

                // We can't have multiple selections if any include more than one identity
                if (selectors.length > 1) {
                    if (selectors.some((value: data.Selector) => value && value.data && value.data.length > 1))
                        return false;
                    }

                return true;
            };

            this.layout = new VisualLayout(options.viewport, { top: 10, right: 10, bottom: 15, left: 10 });
            var element: JQuery = options.element;
            var svg: D3.Selection = this.svg = d3.select(element.get(0))
                .append("svg")
                .classed(AsterPlotVisualClassName, true)
                .style("position", "absolute");

            this.colors = options.style.colorPalette.dataColors;
            this.mainGroupElement = svg.append("g");
            this.mainLabelsElement = svg.append("g");
            this.behavior = new AsterPlotWebBehavior();
            this.clearCatcher = appendClearCatcher(this.mainGroupElement);
            this.slicesElement = this.mainGroupElement.append("g").classed(AsterPlot.AsterSlices.class, true);

            var interactivity = options.interactivity;
            this.interactivityService = createInteractivityService(this.hostServices);
            this.legend = createLegend(element, interactivity && interactivity.isInteractiveLegend, this.interactivityService, true);
        }

        public update(options: VisualUpdateOptions) {
            if (!options || !options.dataViews || !options.dataViews[0]) {
                return; // or clear the view, display an error, etc.
            }

            this.layout.viewport = options.viewport;

            var duration = options.suppressAnimations ? 0 : MinervaAnimationDuration;
            var data = AsterPlot.converter(options.dataViews[0], this.colors);

            if (!data) {
                this.clear();
                return;
            }

            this.data = data;

            if (this.interactivityService) {
                this.interactivityService.applySelectionStateToData(this.data.dataPoints);
                this.interactivityService.applySelectionStateToData(this.data.highlightedDataPoints);
            }

            this.renderLegend();
            this.updateViewPortAccordingToLegend();

            this.svg.attr(this.layout.viewport);

            var transformX: number = (this.layout.viewportIn.width + this.layout.margin.right) / 2;
            var transformY: number = (this.layout.viewportIn.height + this.layout.margin.bottom) / 2;

            this.mainGroupElement.attr("transform", SVGUtil.translate(transformX, transformY));
            this.mainLabelsElement.attr("transform", SVGUtil.translate(transformX, transformY));

            // Move back the clearCatcher
            this.clearCatcher.attr("transform", SVGUtil.translate(-transformX, -transformY));

            dataLabelUtils.cleanDataLabels(this.mainLabelsElement, true);

            this.renderArcsAndLabels(duration);

            if(this.data.hasHighlights) {
                this.renderArcsAndLabels(duration, true);
            } else {
                this.slicesElement.selectAll(AsterPlot.AsterHighlightedSlice.selector).remove();
            }

            if (this.interactivityService) {
                var behaviorOptions: AsterPlotBehaviorOptions = {
                    selection: this.slicesElement.selectAll(AsterPlot.AsterSlice.selector + ", " + AsterPlot.AsterHighlightedSlice.selector),
                    clearCatcher: this.clearCatcher,
                    interactivityService: this.interactivityService,
                    hasHighlights: this.data.hasHighlights
                };

                this.interactivityService.bind(
                    this.data.dataPoints.concat(this.data.highlightedDataPoints),
                    this.behavior,
                    behaviorOptions);
            }
        }

        private renderArcsAndLabels(duration: number, isHighlight: boolean = false): D3.UpdateSelection {
            var viewportRadius: number = Math.min(this.layout.viewportIn.width, this.layout.viewportIn.height) / 2,
                innerRadius: number = 0.3 * (this.settings.labels.show ? viewportRadius * AsterRadiusRatio : viewportRadius),
                maxScore: number = d3.max(this.data.dataPoints, d => d.sliceHeight),
                totalWeight: number = d3.sum(this.data.dataPoints, d => d.sliceWidth);

            var pie: D3.Layout.PieLayout = d3.layout.pie()
                .sort(null)
                .value((dataPoint: AsterDataPoint) => {
                    if (!totalWeight || !dataPoint || isNaN(dataPoint.sliceWidth)) {
                        return 0;
                    }

                    return dataPoint.sliceWidth / totalWeight;
                });

            var arc: D3.Svg.Arc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius((arcDescriptor: AsterArcDescriptor) => {
                    var height: number = 0;

                    if (maxScore) {
                        var radius: number = viewportRadius - innerRadius,
                            sliceHeight: number = 1;

                        sliceHeight = arcDescriptor
                            && arcDescriptor.data
                            && !isNaN(arcDescriptor.data.sliceHeight)
                                ? arcDescriptor.data.sliceHeight
                                : sliceHeight;

                        height = radius * sliceHeight / maxScore;
                    }

                    //The chart should shrink if data labels are on
                    var heightIsLabelsOn = innerRadius + (this.settings.labels.show ? height * AsterRadiusRatio : height);

                    // Prevent from data to be inside the inner radius
                    return Math.max(heightIsLabelsOn, innerRadius);
                });

            var arcDescriptorDataPoints: AsterArcDescriptor[] = pie(isHighlight ? this.data.highlightedDataPoints : this.data.dataPoints);

            var classSelector: ClassAndSelector = isHighlight
                ? AsterPlot.AsterHighlightedSlice
                : AsterPlot.AsterSlice;

            var selection = this.slicesElement
                .selectAll(classSelector.selector)
                .data(
                    arcDescriptorDataPoints,
                    (d: AsterArcDescriptor, i: number) => {
                        return d.data
                            ? d.data.identity.getKey()
                            : i;
                    });

            selection
                .enter()
                .append("path")
                .classed(classSelector.class, true)
                .attr("stroke", "#333");

            selection
                .attr("fill", d => d.data.color)
                .call(selection => {
                    return Helpers.setAttrThroughTransitionIfNotResized(
                        selection,
                        s => s.duration(duration),
                        "d",
                        arc,
                        Helpers.interpolateArc(arc),
                        this.layout.viewportChanged);
                });

            selection
                .exit()
                .remove();

            TooltipManager.addTooltip(selection, (tooltipEvent: TooltipEvent) => tooltipEvent.data.data.tooltipInfo);

            // Draw data labels only if they are on and there are no highlights or there are highlights and this is the highlighted data labels
            if (this.settings.labels.show && (!this.data.hasHighlights || (this.data.hasHighlights && isHighlight))) {
                var labelRadCalc = (d: AsterDataPoint) => {
                    var height: number = viewportRadius * (d && !isNaN(d.sliceHeight) ? d.sliceHeight : 1) / maxScore + innerRadius;
                    return Math.max(height, innerRadius);
                };
                var labelArc = d3.svg.arc()
                    .innerRadius(d => labelRadCalc(d.data))
                    .outerRadius(d => labelRadCalc(d.data));

                var lineRadCalc = (d: AsterDataPoint) => {
                    var height: number = (viewportRadius - innerRadius) * (d && !isNaN(d.sliceHeight) ? d.sliceHeight : 1) / maxScore;
                    height = innerRadius + height * AsterRadiusRatio;
                    return Math.max(height, innerRadius);
                };
                var outlineArc = d3.svg.arc()
                    .innerRadius(d => lineRadCalc(d.data))
                    .outerRadius(d => lineRadCalc(d.data));

                var labelLayout = this.getLabelLayout(labelArc, this.layout.viewport);
                this.drawLabels(
                    arcDescriptorDataPoints.filter(x => !isHighlight || x.data.sliceHeight !== null),
                    this.mainLabelsElement,
                    labelLayout,
                    this.layout.viewport,
                    outlineArc,
                    labelArc);
            }
            else {
                dataLabelUtils.cleanDataLabels(this.mainLabelsElement, true);
            }

            // Draw center text and outline once for original data points
            if (!isHighlight) {
                this.drawCenterText(innerRadius);
                this.drawOuterLine(innerRadius, _.max(arcDescriptorDataPoints.map(d => arc.outerRadius()(d))), arcDescriptorDataPoints);
            }

            return selection;
        }

        private getLabelLayout(arc: D3.Svg.Arc, viewport: IViewport): ILabelLayout {
            var midAngle = function (d: ArcDescriptor) { return d.startAngle + (d.endAngle - d.startAngle) / 2; };
            var textProperties: TextProperties = {
                fontFamily: dataLabelUtils.StandardFontFamily,
                fontSize: PixelConverter.fromPoint(this.settings.labels.fontSize),
                text: "",
            };
            var isLabelsHasConflict = function (d: AsterArcDescriptor) {
                var pos = arc.centroid(d);
                textProperties.text = d.data.label;
                var textWidth = TextMeasurementService.measureSvgTextWidth(textProperties);
                var horizontalSpaceAvaliableForLabels = viewport.width / 2 - Math.abs(pos[0]);
                var textHeight = TextMeasurementService.estimateSvgTextHeight(textProperties);
                var verticalSpaceAvaliableForLabels = viewport.height / 2 - Math.abs(pos[1]);
                d.isLabelHasConflict = textWidth > horizontalSpaceAvaliableForLabels || textHeight > verticalSpaceAvaliableForLabels;
                return d.isLabelHasConflict;
            };

            return {
                labelText: (d: AsterArcDescriptor) => {
                    textProperties.text = d.data.label;
                    var pos = arc.centroid(d);
                    var xPos = isLabelsHasConflict(d) ? pos[0] * AsterConflictRatio : pos[0];
                    var spaceAvaliableForLabels = viewport.width / 2 - Math.abs(xPos);
                    return TextMeasurementService.getTailoredTextOrDefault(textProperties, spaceAvaliableForLabels);
                },
                labelLayout: {
                    x: (d: AsterArcDescriptor) => {
                        var pos = arc.centroid(d);
                        textProperties.text = d.data.label;
                        var xPos = d.isLabelHasConflict ? pos[0] * AsterConflictRatio : pos[0];
                        return xPos;
                    },
                    y: (d: AsterArcDescriptor) => {
                        var pos = arc.centroid(d);
                        var yPos = d.isLabelHasConflict ? pos[1] * AsterConflictRatio : pos[1];
                        return yPos;
                    },
                },
                filter: (d: AsterArcDescriptor) => (d != null && !_.isEmpty(d.data.label)),
                style: {
                    "fill": this.settings.labels.color,
                    "font-size": textProperties.fontSize,
                    "text-anchor": (d: AsterArcDescriptor) => midAngle(d) < Math.PI ? "start" : "end",
                },
            };
        }

        private drawLabels(data: ArcDescriptor[],
            context: D3.Selection,
            layout: ILabelLayout,
            viewport: IViewport,
            outlineArc: D3.Svg.Arc,
            labelArc: D3.Svg.Arc): void {

            // Hide and reposition labels that overlap
            var dataLabelManager = new DataLabelManager();
            var filteredData = dataLabelManager.hideCollidedLabels(viewport, data, layout, true /* addTransform */);

            if (filteredData.length === 0) {
                dataLabelUtils.cleanDataLabels(context, true);
                return;
            }

            // Draw labels
            if (context.select(AsterPlot.labelGraphicsContextClass.selector).empty())
                context.append("g").classed(AsterPlot.labelGraphicsContextClass.class, true);

            var labels = context
                .select(AsterPlot.labelGraphicsContextClass.selector)
                .selectAll(".data-labels").data(filteredData, (d: ArcDescriptor) => d.data.identity.getKey());

            labels.enter().append("text").classed("data-labels", true);

            if (!labels)
                return;

            labels
                .attr({ x: (d: LabelEnabledDataPoint) => d.labelX, y: (d: LabelEnabledDataPoint) => d.labelY, dy: ".35em" })
                .text((d: LabelEnabledDataPoint) => d.labeltext)
                .style(layout.style);

            labels
                .exit()
                .remove();

            // Draw lines
            if (context.select(AsterPlot.linesGraphicsContextClass.selector).empty())
                context.append("g").classed(AsterPlot.linesGraphicsContextClass.class, true);

            // Remove lines for null and zero values
            filteredData = _.filter(filteredData, (d: ArcDescriptor) => d.data.sliceHeight !== null && d.data.sliceHeight !== 0);

            var lines = context.select(AsterPlot.linesGraphicsContextClass.selector).selectAll("polyline")
                .data(filteredData, (d: ArcDescriptor) => d.data.identity.getKey());

            var labelLinePadding = 4;
            var chartLinePadding = 1.02;

            var midAngle = function (d: ArcDescriptor) { return d.startAngle + (d.endAngle - d.startAngle) / 2; };

            lines.enter()
                .append("polyline")
                .classed("line-label", true);

            lines
                .attr("points", function (d) {
                    var textPoint = [d.labelX, d.labelY];
                    textPoint[0] = textPoint[0] + ((midAngle(d) < Math.PI ? -1 : 1) * labelLinePadding);
                    var chartPoint = outlineArc.centroid(d);
                    chartPoint[0] *= chartLinePadding;
                    chartPoint[1] *= chartLinePadding;
                    return [chartPoint, textPoint];
                }).
                style({
                    "opacity": 0.5,
                    "fill-opacity": 0,
                    "stroke": (d: ArcDescriptor) => this.settings.labels.color,
                });

            lines
                .exit()
                .remove();

        }

        private renderLegend(): void {
            if (this.settings.legend.show) {

                // Force update for title text
                var legendObject = _.clone(this.settings.legend);
                legendObject.labelColor = <any>{ solid: { color: legendObject.labelColor } };
                LegendData.update(this.data.legendData, <any>legendObject);
                this.legend.changeOrientation(LegendPosition[this.settings.legend.position]);
            }

            this.legend.drawLegend(this.data.legendData, this.layout.viewportCopy);
            Legend.positionChartArea(this.svg, this.legend);
        }

        private updateViewPortAccordingToLegend(): void {
            if (!this.settings.legend.show)
                return;

            var legendMargins: IViewport = this.legend.getMargins();
            var legendPosition: LegendPosition = LegendPosition[this.settings.legend.position];

            switch (legendPosition) {
                case LegendPosition.Top:
                case LegendPosition.TopCenter:
                case LegendPosition.Bottom:
                case LegendPosition.BottomCenter: {
                    this.layout.viewport.height -= legendMargins.height;
                    break;
                }
                case LegendPosition.Left:
                case LegendPosition.LeftCenter:
                case LegendPosition.Right:
                case LegendPosition.RightCenter: {
                    this.layout.viewport.width -= legendMargins.width;
                    break;
                }
                default:
                    break;
            }
        }

        private drawOuterLine(innerRadius: number, radius: number, data: ArcDescriptor[]): void {
            var mainGroup = this.mainGroupElement;
            var outlineArc = d3.svg.arc()
                .innerRadius(innerRadius)
                .outerRadius(radius);
            if (this.settings.outerLine.show) {
                var OuterThickness: string = this.settings.outerLine.thickness + "px";
                var outerLine = mainGroup.selectAll(AsterPlot.OuterLine.selector).data(data);
                outerLine.enter().append("path");
                outerLine.attr("fill", "none")
                    .attr({
                        "stroke": "#333",
                        "stroke-width": OuterThickness,
                        "d": outlineArc
                    })
                    .style("opacity", 1)
                    .classed(AsterPlot.OuterLine.class, true);
                outerLine.exit().remove();
            }
            else
                mainGroup.selectAll(AsterPlot.OuterLine.selector).remove();
        }

        private drawCenterText(innerRadius: number): void {
            if (_.isEmpty(this.data.centerText)) {
                this.mainGroupElement.select(AsterPlot.CenterLabelClass.selector).remove();
                return;
            }

            var centerTextProperties: TextProperties = {
                fontFamily: dataLabelUtils.StandardFontFamily,
                fontWeight: "bold",
                fontSize: PixelConverter.toString(innerRadius * AsterPlot.CenterTextFontHeightCoefficient),
                text: this.data.centerText
            };

            if (this.mainGroupElement.select(AsterPlot.CenterLabelClass.selector).empty())
                this.centerText = this.mainGroupElement.append("text").classed(AsterPlot.CenterLabelClass.class, true);

            this.centerText
                .style({
                    "line-height": 1,
                    "font-weight": centerTextProperties.fontWeight,
                    "font-size": centerTextProperties.fontSize,
                    "fill": this.settings.labels.color
                })
                .attr({
                    "dy": "0.35em",
                    "text-anchor": "middle"
                })
                .text(TextMeasurementService.getTailoredTextOrDefault(centerTextProperties, innerRadius * AsterPlot.CenterTextFontWidthCoefficient));
        }

        private clear(): void {
            this.mainGroupElement.selectAll("path").remove();
            this.mainGroupElement.select(AsterPlot.CenterLabelClass.selector).remove();
            dataLabelUtils.cleanDataLabels(this.mainLabelsElement, true);
            this.legend.drawLegend({ dataPoints: [] }, this.layout.viewportCopy);
        }

        public onClearSelection(): void {
            if (this.interactivityService)
                this.interactivityService.clearSelection();
        }

        // This function retruns the values to be displayed in the property pane for each object.
        // Usually it is a bind pass of what the property pane gave you, but sometimes you may want to do
        // validation and return other values/defaults
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumerationObject {
            var instances = AsterPlotSettings.enumerateObjectInstances(
                this.settings && this.settings.originalSettings,
                options,
                AsterPlot.capabilities);

            return instances.complete();
        }
    }

    export module asterPlotUtils {
        export var DimmedOpacity: number = 0.4;
        export var DefaultOpacity: number = 1.0;

        export function getFillOpacity(selected: boolean, highlight: boolean, hasSelection: boolean, hasPartialHighlights: boolean): number {
            if ((hasPartialHighlights && !highlight) || (hasSelection && !selected)) {
                return DimmedOpacity;
            }

            return DefaultOpacity;
        }
    }
}
