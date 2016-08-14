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
    import Fill = powerbi.Fill;
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    import PixelConverter = jsCommon.PixelConverter;
    import createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;
    import getCategoryIndexOfRole = powerbi.data.DataRoleHelper.getCategoryIndexOfRole;
    import getMeasureIndexOfRole = powerbi.data.DataRoleHelper.getMeasureIndexOfRole;
    import registerStandardInteractivityHandlers = powerbi.visuals.InteractivityUtils.registerStandardInteractivityHandlers;
    import createDisplayNameGetter = powerbi.data.createDisplayNameGetter;
    import IInteractiveBehavior = powerbi.visuals.IInteractiveBehavior;
    import DataViewObjectDescriptor = powerbi.data.DataViewObjectDescriptor;
    import Lazy = jsCommon.Lazy;
    import ISize = powerbi.visuals.shapes.ISize;
    import measureSvgTextWidth = powerbi.TextMeasurementService.measureSvgTextWidth;
    import measureSvgTextHeight = powerbi.TextMeasurementService.measureSvgTextHeight;
    import estimateSvgTextHeight = powerbi.TextMeasurementService.estimateSvgTextHeight;
    import svgEllipsis = powerbi.TextMeasurementService.svgEllipsis;
    import addTooltip = powerbi.visuals.TooltipManager.addTooltip;
    import fromPoint = jsCommon.PixelConverter.fromPoint;
    import LabelTextProperties = powerbi.visuals.dataLabelUtils.LabelTextProperties;
    import getLabelFormattedText = powerbi.visuals.dataLabelUtils.getLabelFormattedText;
    import equalWithPrecision = powerbi.Double.equalWithPrecision;
    import GetAnimationDuration = powerbi.visuals.AnimatorCommon.GetAnimationDuration;
    import getTailoredTextOrDefault = powerbi.TextMeasurementService.getTailoredTextOrDefault;
    import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
    import ChartAxesLabels = powerbi.visuals.ChartAxesLabels;
    import DataViewValueColumn = powerbi.DataViewValueColumn;
    import SelectableDataPoint = powerbi.visuals.SelectableDataPoint;
    import TooltipEnabledDataPoint = powerbi.visuals.TooltipEnabledDataPoint;
    import ContentPositions = powerbi.ContentPositions;
    import LegendData = powerbi.visuals.LegendData;
    import NumberRange = powerbi.NumberRange;
    import PointDataLabelsSettings = powerbi.visuals.PointDataLabelsSettings;
    import SelectionId = powerbi.visuals.SelectionId;
    import DataViewObjectPropertyIdentifier = powerbi.DataViewObjectPropertyIdentifier;
    import IVisual = powerbi.IVisual;
    import TextProperties = powerbi.TextProperties;
    import ILegend = powerbi.visuals.ILegend;
    import IVisualStyle = powerbi.IVisualStyle;
    import IAxisProperties = powerbi.visuals.IAxisProperties;
    import IDataColorPalette = powerbi.IDataColorPalette;
    import VisualInitOptions = powerbi.VisualInitOptions;
    import InteractivityOptions = powerbi.InteractivityOptions;
    import IInteractivityService = powerbi.visuals.IInteractivityService;
    import DataViewObject = powerbi.DataViewObject;
    import IVisualHostServices = powerbi.IVisualHostServices;
    import IGenericAnimator = powerbi.visuals.IGenericAnimator;
    import IMargin = powerbi.visuals.IMargin;
    import IViewport = powerbi.IViewport;
    import VisualCapabilities = powerbi.VisualCapabilities;
    import VisualDataRoleKind = powerbi.VisualDataRoleKind;
    import legendPosition = powerbi.visuals.legendPosition;
    import BaseAnimator = powerbi.visuals.BaseAnimator;
    import yAxisPosition = powerbi.visuals.yAxisPosition;
    import appendClearCatcher = powerbi.visuals.appendClearCatcher;
    import createInteractivityService = powerbi.visuals.createInteractivityService;
    import createLegend = powerbi.visuals.createLegend;
    import AxisHelper = powerbi.visuals.AxisHelper;
    import DataViewMetadata = powerbi.DataViewMetadata;
    import DataViewObjects = powerbi.DataViewObjects;
    import IValueFormatter = powerbi.visuals.IValueFormatter;
    import DataViewScopeIdentity = powerbi.DataViewScopeIdentity;
    import DataViewCategorical = powerbi.DataViewCategorical;
    import DataViewCategoryColumn = powerbi.DataViewCategoryColumn;
    import DataViewValueColumns = powerbi.DataViewValueColumns;
    import DataViewValueColumnGroup = powerbi.DataViewValueColumnGroup;
    import valueFormatter = powerbi.visuals.valueFormatter;
    import dataLabelUtils = powerbi.visuals.dataLabelUtils;
    import LegendDataPoint = powerbi.visuals.LegendDataPoint;
    import ColorHelper = powerbi.visuals.ColorHelper;
    import LegendIcon = powerbi.visuals.LegendIcon;
    import DataViewCategoricalColumn = powerbi.DataViewCategoricalColumn;
    import SelectionIdBuilder = powerbi.visuals.SelectionIdBuilder;
    import TooltipSeriesDataItem = powerbi.visuals.TooltipSeriesDataItem;
    import TooltipDataItem = powerbi.visuals.TooltipDataItem;
    import TooltipBuilder = powerbi.visuals.TooltipBuilder;
    import VisualUpdateOptions = powerbi.VisualUpdateOptions;
    import getInvalidValueWarnings = powerbi.visuals.getInvalidValueWarnings;
    import legendProps = powerbi.visuals.legendProps;
    import LegendPosition = powerbi.visuals.LegendPosition;
    import Legend = powerbi.visuals.Legend;
    import ILabelLayout = powerbi.visuals.ILabelLayout;
    import SVGUtil = powerbi.visuals.SVGUtil;
    import TooltipEvent = powerbi.visuals.TooltipEvent;
    import CalculateScaleAndDomainOptions = powerbi.visuals.CalculateScaleAndDomainOptions;
    import ObjectEnumerationBuilder = powerbi.visuals.ObjectEnumerationBuilder;
    import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
    import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
    import GradientUtils = powerbi.visuals.GradientUtils;
    import axisType = powerbi.visuals.axisType;
    import axisScale = powerbi.visuals.axisScale;
    import VisualObjectInstance = powerbi.VisualObjectInstance;
    import axisStyle = powerbi.visuals.axisStyle;
    import ISelectionHandler = powerbi.visuals.ISelectionHandler;
    import DataView = powerbi.DataView;

    export interface ElementProperty {
        [propertyName: string]: any;
    }

    export interface ElementProperties {
        name: string;
        selector: string;
        className?: string;
        data?: any;
        styles?: ElementProperty;
        attributes?: ElementProperty;
    }

    interface EnhancedScatterChartMeasureMetadataIndexes {
        category?: number;
        x?: number;
        y?: number;
        size?: number;
        colorFill?: number;
        shape?: number;
        image?: number;
        rotation?: number;
        backdrop?: number;
        xStart?: number;
        xEnd?: number;
        yStart?: number;
        yEnd?: number;
    }

    interface EnhancedScatterChartMeasureMetadataColumns {
        x?: DataViewMetadataColumn;
        y?: DataViewMetadataColumn;
        size?: DataViewMetadataColumn;
    }

    interface EnhancedScatterChartMeasureMetadata {
        idx: EnhancedScatterChartMeasureMetadataIndexes;
        cols: EnhancedScatterChartMeasureMetadataColumns;
        axesLabels: ChartAxesLabels;
    }

    export interface EnhancedScatterChartRadiusData {
        sizeMeasure: DataViewValueColumn;
        index: number;
    }

    export interface EnhancedScatterChartDataPoint extends SelectableDataPoint, TooltipEnabledDataPoint {
        x: any;
        y: any;
        size: number | ISize;
        radius: EnhancedScatterChartRadiusData;
        fill: string;
        labelFill?: string;
        labelFontSize: any;
        contentPosition: ContentPositions;
        formattedCategory: Lazy<string>;
        colorFill?: string;
        svgurl?: string;
        shapeSymbolType?: (number) => string;
        rotation: number;
        backdrop?: string;
        xStart?: number;
        xEnd?: number;
        yStart?: number;
        yEnd?: number;
    }

    export interface EnhancedScatterChartBackdrop {
        show: boolean;
        url: string;
    }

    export interface EnhancedScatterChartAxesLabels {
        x: string;
        y: string;
        y2?: string;
    }

    export interface EnhancedScatterChartData {
        useShape: boolean;
        useCustomColor: boolean;
        backdrop?: EnhancedScatterChartBackdrop;
        outline?: boolean;
        crosshair?: boolean;
        xCol: DataViewMetadataColumn;
        yCol: DataViewMetadataColumn;
        dataPoints: EnhancedScatterChartDataPoint[];
        legendData: LegendData;
        axesLabels: EnhancedScatterChartAxesLabels;
        size?: DataViewMetadataColumn;
        sizeRange: NumberRange;
        dataLabelsSettings: PointDataLabelsSettings;
        defaultDataPointColor?: string;
        showAllDataPoints?: boolean;
        hasDynamicSeries?: boolean;
        fillPoint?: boolean;
        colorBorder?: boolean;
        colorByCategory?: boolean;
        selectedIds: SelectionId[];
    }

    export interface EnhancedScatterDataRange {
        minRange: number;
        maxRange: number;
        delta: number;
    }

    export interface EnhancedScatterChartProperty {
        [properyName: string]: DataViewObjectPropertyIdentifier;
    }

    export interface EnhancedScatterChartProperties {
        [properyName: string]: EnhancedScatterChartProperty;
    }

    export class EnhancedScatterChart implements IVisual {
        private static AxisGraphicsContextClassName: string = "axisGraphicsContext";
        private static ClassName: string = "enhancedScatterChart";
        private static MainGraphicsContextClassName: string = "mainGraphicsContext";
        private static LegendLabelFontSizeDefault: number = 9;
        private static LabelDisplayUnitsDefault: number = 0;
        private static AxisFontSize: number = 11;
        private static CrosshairTextMargin: number = 5;
        private static BubbleRadius = 3 * 2;

        private static MinSizeRange = 200;
        private static MaxSizeRange = 3000;

        private static AreaOf300By300Chart = 90000;

        private static DataLabelXOffset: number = 2;
        private static DataLabelYOffset: number = 1.8;

        private static DotClasses: ClassAndSelector = createClassAndSelector("dot");
        private static ImageClasses: ClassAndSelector = createClassAndSelector("img");

        private static TextProperties: TextProperties = {
            fontFamily: "'Segoe UI', wf_segoe-ui_normal, helvetica, arial, sans-serif",
            fontSize: PixelConverter.toString(EnhancedScatterChart.AxisFontSize),
        };

        public static CrosshairCanvasSelector: ClassAndSelector = createClassAndSelector("crosshairCanvas");
        public static CrosshairLineSelector: ClassAndSelector = createClassAndSelector("crosshairLine");
        public static CrosshairVerticalLineSelector: ClassAndSelector = createClassAndSelector("crosshairVerticalLine");
        public static CrosshairHorizontalLineSelector: ClassAndSelector = createClassAndSelector("crosshairHorizontalLine");
        public static CrosshairTextSelector: ClassAndSelector = createClassAndSelector("crosshairText");

        public static MaxTranslateValue: number = 1e+25;
        public static MinTranslateValue: number = 1e-25;

        public static DefaultBubbleOpacity = 0.85;
        public static DimmedBubbleOpacity = 0.4;

        private legend: ILegend;
        private svgScrollable: D3.Selection;
        private axisGraphicsContext: D3.Selection;
        private axisGraphicsContextScrollable: D3.Selection;
        private xAxisGraphicsContext: D3.Selection;
        private backgroundGraphicsContext: D3.Selection;
        private y1AxisGraphicsContext: D3.Selection;
        private svg: D3.Selection;
        private element: JQuery;
        private mainGraphicsSVGSelection: D3.Selection;
        private mainGraphicsContext: D3.Selection;
        private clearCatcher: D3.Selection;
        private mainGraphicsG: D3.Selection;

        private crosshairCanvasSelection: D3.Selection;
        private crosshairVerticalLineSelection: D3.Selection;
        private crosshairHorizontalLineSelection: D3.Selection;
        private crosshairTextSelection: D3.Selection;

        private style: IVisualStyle;
        private data: EnhancedScatterChartData;
        private dataView: DataView;

        private xAxisProperties: IAxisProperties;
        private yAxisProperties: IAxisProperties;
        private colors: IDataColorPalette;
        private options: VisualInitOptions;
        private interactivity: InteractivityOptions;
        private interactivityService: IInteractivityService;
        private categoryAxisProperties: DataViewObject;
        private valueAxisProperties: DataViewObject;
        private yAxisOrientation: string;
        private scrollY: boolean;
        private scrollX: boolean;

        private dataViews: DataView[];
        private legendObjectProperties: DataViewObject;
        private hostServices: IVisualHostServices;
        private layerLegendData: LegendData;
        private legendLabelFontSize: number;
        private hasCategoryAxis: boolean;
        private yAxisIsCategorical: boolean;
        private bottomMarginLimit: number;
        private leftRightMarginLimit: number;
        private isXScrollBarVisible: boolean;
        private isYScrollBarVisible: boolean;
        private ScrollBarWidth = 10;
        private categoryAxisHasUnitType: boolean;
        private valueAxisHasUnitType: boolean;
        private svgDefaultImage: string;
        private oldBackdrop: string;

        private behavior: IInteractiveBehavior;
        private animator: IGenericAnimator;
        private keyArray: string[];

        private _margin: IMargin;
        private get margin(): IMargin {
            return this._margin || { left: 0, right: 0, top: 0, bottom: 0 };
        }

        private set margin(value: IMargin) {
            this._margin = $.extend({}, value);
            this._viewportIn = EnhancedScatterChart.substractMargin(this.viewport, this.margin);
        }

        private _viewport: IViewport;
        private get viewport(): IViewport {
            return this._viewport || { width: 0, height: 0 };
        }

        private set viewport(value: IViewport) {
            this._viewport = $.extend({}, value);
            this._viewportIn = EnhancedScatterChart.substractMargin(this.viewport, this.margin);
        }

        private _viewportIn: IViewport;
        private get viewportIn(): IViewport {
            return this._viewportIn || this.viewport;
        }

        private get legendViewport(): IViewport {
            return this.legend.getMargins();
        }

        public static ColumnCategory: string = "Category";
        public static ColumnSeries: string = "Series";
        public static ColumnX: string = "X";
        public static ColumnY: string = "Y";
        public static ColumnSize: string = "Size";
        public static ColumnGradient: string = "Gradient";
        public static ColumnColorFill: string = "ColorFill";
        public static ColumnShape: string = "Shape";
        public static ColumnImage: string = "Image";
        public static ColumnRotation: string = "Rotation";
        public static ColumnBackdrop: string = "Backdrop";
        public static ColumnXStart: string = "X Start";
        public static ColumnXEnd: string = "X End";
        public static ColumnYStart: string = "Y Start";
        public static ColumnYEnd: string = "Y End";

        public static capabilities: VisualCapabilities = {
            dataRoles: [
                {
                    name: EnhancedScatterChart.ColumnCategory,
                    kind: VisualDataRoleKind.Grouping,
                    displayName: createDisplayNameGetter("Role_DisplayName_Details"),
                }, {
                    name: EnhancedScatterChart.ColumnSeries,
                    kind: VisualDataRoleKind.Grouping,
                    displayName: createDisplayNameGetter("Role_DisplayName_Legend"),
                }, {
                    name: EnhancedScatterChart.ColumnX,
                    kind: VisualDataRoleKind.Measure,
                    displayName: createDisplayNameGetter("Role_DisplayName_X"),
                }, {
                    name: EnhancedScatterChart.ColumnY,
                    kind: VisualDataRoleKind.Measure,
                    displayName: createDisplayNameGetter("Role_DisplayName_Y"),
                }, {
                    name: EnhancedScatterChart.ColumnSize,
                    kind: VisualDataRoleKind.Measure,
                    displayName: createDisplayNameGetter("Role_DisplayName_Size"),
                }, {
                    name: EnhancedScatterChart.ColumnGradient,
                    kind: VisualDataRoleKind.Measure,
                    displayName: createDisplayNameGetter("Role_DisplayName_Gradient"),
                }, {
                    name: EnhancedScatterChart.ColumnColorFill,
                    kind: VisualDataRoleKind.Grouping,
                    displayName: "Customized Color",
                }, {
                    name: EnhancedScatterChart.ColumnShape,
                    kind: VisualDataRoleKind.Measure,
                    displayName: "Shape",
                }, {
                    name: EnhancedScatterChart.ColumnImage,
                    kind: VisualDataRoleKind.Grouping,
                    displayName: "Image",
                }, {
                    name: EnhancedScatterChart.ColumnRotation,
                    kind: VisualDataRoleKind.Measure,
                    displayName: "Rotation",
                }, {
                    name: EnhancedScatterChart.ColumnBackdrop,
                    kind: VisualDataRoleKind.Grouping,
                    displayName: "Backdrop",
                }, {
                    name: EnhancedScatterChart.ColumnXStart,
                    kind: VisualDataRoleKind.Measure,
                    displayName: "X Start",
                }, {
                    name: EnhancedScatterChart.ColumnXEnd,
                    kind: VisualDataRoleKind.Measure,
                    displayName: "X End",
                }, {
                    name: EnhancedScatterChart.ColumnYStart,
                    kind: VisualDataRoleKind.Measure,
                    displayName: "Y Start",
                }, {
                    name: EnhancedScatterChart.ColumnYEnd,
                    kind: VisualDataRoleKind.Measure,
                    displayName: "Y End",
                }
            ],
            dataViewMappings: [{
                conditions: [{
                    "Category": { max: 1 },
                    "Series": { max: 1 },
                    "X": { max: 1 },
                    "Y": { max: 1 },
                    "Size": { max: 1 },
                    "Gradient": { max: 0 },
                    "ColorFill": { max: 1 },
                    "Shape": { max: 1 },
                    "Image": { max: 0 },
                    "Rotation": { max: 1 },
                    "Backdrop": { max: 1 },
                    "X Start": { max: 1 },
                    "X End": { max: 1 },
                    "Y Start": { max: 1 },
                    "Y End": { max: 1 }
                }, {
                    "Category": { max: 1 },
                    "Series": { max: 0 },
                    "X": { max: 1 },
                    "Y": { max: 1 },
                    "Size": { max: 1 },
                    "Gradient": { max: 1 },
                    "ColorFill": { max: 1 },
                    "Shape": { max: 1 },
                    "Image": { max: 0 },
                    "Rotation": { max: 1 },
                    "Backdrop": { max: 1 },
                    "X Start": { max: 1 },
                    "X End": { max: 1 },
                    "Y Start": { max: 1 },
                    "Y End": { max: 1 }
                }, {
                    "Category": { max: 1 },
                    "Series": { max: 1 },
                    "X": { max: 1 },
                    "Y": { max: 1 },
                    "Size": { max: 1 },
                    "Gradient": { max: 0 },
                    "ColorFill": { max: 0 },
                    "Shape": { max: 0 },
                    "Image": { max: 1 },
                    "Rotation": { max: 1 },
                    "Backdrop": { max: 1 },
                    "X Start": { max: 1 },
                    "X End": { max: 1 },
                    "Y Start": { max: 1 },
                    "Y End": { max: 1 }
                }, {
                    "Category": { max: 1 },
                    "Series": { max: 0 },
                    "X": { max: 1 },
                    "Y": { max: 1 },
                    "Size": { max: 1 },
                    "Gradient": { max: 1 },
                    "ColorFill": { max: 0 },
                    "Shape": { max: 0 },
                    "Image": { max: 1 },
                    "Rotation": { max: 1 },
                    "Backdrop": { max: 1 },
                    "X Start": { max: 1 },
                    "X End": { max: 1 },
                    "Y Start": { max: 1 },
                    "Y End": { max: 1 }
                }],
                categorical: {
                    categories: {
                        for: { in: EnhancedScatterChart.ColumnCategory },
                        dataReductionAlgorithm: { sample: {} }
                    },
                    values: {
                        group: {
                            by: EnhancedScatterChart.ColumnSeries,
                            select: [
                                { bind: { to: EnhancedScatterChart.ColumnX } },
                                { bind: { to: EnhancedScatterChart.ColumnY } },
                                { bind: { to: EnhancedScatterChart.ColumnSize } },
                                { bind: { to: EnhancedScatterChart.ColumnGradient } },
                                { bind: { to: EnhancedScatterChart.ColumnColorFill } },
                                { bind: { to: EnhancedScatterChart.ColumnShape } },
                                { bind: { to: EnhancedScatterChart.ColumnImage } },
                                { bind: { to: EnhancedScatterChart.ColumnRotation } },
                                { bind: { to: EnhancedScatterChart.ColumnBackdrop } },
                                { bind: { to: EnhancedScatterChart.ColumnXStart } },
                                { bind: { to: EnhancedScatterChart.ColumnXEnd } },
                                { bind: { to: EnhancedScatterChart.ColumnYStart } },
                                { bind: { to: EnhancedScatterChart.ColumnYEnd } },
                            ],
                            dataReductionAlgorithm: { top: {} }
                        }
                    },
                    rowCount: { preferred: { min: 2 } }
                },
            }],
            objects: {
                dataPoint: {
                    displayName: createDisplayNameGetter("Visual_DataPoint"),
                    properties: {
                        defaultColor: {
                            displayName: createDisplayNameGetter("Visual_DefaultColor"),
                            type: { fill: { solid: { color: true } } }
                        },
                        showAllDataPoints: {
                            displayName: createDisplayNameGetter("Visual_DataPoint_Show_All"),
                            type: { bool: true }
                        },
                        useShape: {
                            displayName: createDisplayNameGetter("Visual_UseImage"),
                            type: { bool: true }
                        },
                        fill: {
                            displayName: createDisplayNameGetter("Visual_Fill"),
                            type: { fill: { solid: { color: true } } }
                        },
                        fillRule: {
                            displayName: createDisplayNameGetter("Visual_Gradient"),
                            type: { fillRule: {} },
                            rule: {
                                inputRole: EnhancedScatterChart.ColumnGradient,
                                output: {
                                    property: "fill",
                                    selector: [EnhancedScatterChart.ColumnCategory],
                                },
                            }
                        }
                    }
                },
                general: {
                    displayName: createDisplayNameGetter("Visual_General"),
                    properties: {
                        formatString: {
                            type: { formatting: { formatString: true } },
                        },
                    },
                },
                categoryAxis: {
                    displayName: createDisplayNameGetter("Visual_XAxis"),
                    properties: {
                        show: {
                            displayName: createDisplayNameGetter("Visual_Show"),
                            type: { bool: true }
                        },
                        axisScale: {
                            displayName: createDisplayNameGetter("Visual_Axis_Scale"),
                            type: { formatting: { axisScale: true } }
                        },
                        start: {
                            displayName: createDisplayNameGetter("Visual_Axis_Start"),
                            type: { numeric: true }
                        },
                        end: {
                            displayName: createDisplayNameGetter("Visual_Axis_End"),
                            type: { numeric: true }
                        },
                        showAxisTitle: {
                            displayName: createDisplayNameGetter("Visual_Axis_Title"),
                            type: { bool: true }
                        },
                        axisStyle: {
                            displayName: createDisplayNameGetter("Visual_Axis_Style"),
                            type: { formatting: { axisStyle: true } }
                        },
                        axisColor: {
                            displayName: "Color",
                            type: { fill: { solid: { color: true } } }
                        },
                        labelDisplayUnits: {
                            displayName: "Display Units",
                            type: { formatting: { labelDisplayUnits: true } },
                        },
                    }
                },
                valueAxis: {
                    displayName: createDisplayNameGetter("Visual_YAxis"),
                    properties: {
                        show: {
                            displayName: createDisplayNameGetter("Visual_Show"),
                            type: { bool: true }
                        },
                        position: {
                            displayName: createDisplayNameGetter("Visual_YAxis_Position"),
                            type: { formatting: { yAxisPosition: true } }
                        },
                        axisScale: {
                            displayName: createDisplayNameGetter("Visual_Axis_Scale"),
                            type: { formatting: { axisScale: true } }
                        },
                        start: {
                            displayName: createDisplayNameGetter("Visual_Axis_Start"),
                            type: { numeric: true }
                        },
                        end: {
                            displayName: createDisplayNameGetter("Visual_Axis_End"),
                            type: { numeric: true }
                        },
                        showAxisTitle: {
                            displayName: createDisplayNameGetter("Visual_Axis_Title"),
                            type: { bool: true }
                        },
                        axisStyle: {
                            displayName: createDisplayNameGetter("Visual_Axis_Style"),
                            type: { formatting: { axisStyle: true } }
                        },
                        axisColor: {
                            displayName: "Color",
                            type: { fill: { solid: { color: true } } }
                        },
                        labelDisplayUnits: {
                            displayName: "Display Units",
                            type: { formatting: { labelDisplayUnits: true } },
                        }
                    }
                },
                legend: {
                    displayName: createDisplayNameGetter("Visual_Legend"),
                    properties: {
                        show: {
                            displayName: createDisplayNameGetter("Visual_Show"),
                            type: { bool: true }
                        },
                        position: {
                            displayName: createDisplayNameGetter("Visual_LegendPosition"),
                            description: createDisplayNameGetter("Visual_LegendPositionDescription"),
                            type: { enumeration: legendPosition.type },
                        },
                        showTitle: {
                            displayName: createDisplayNameGetter("Visual_LegendShowTitle"),
                            description: createDisplayNameGetter("Visual_LegendShowTitleDescription"),
                            type: { bool: true }
                        },
                        titleText: {
                            displayName: "Legend Name",
                            description: createDisplayNameGetter("Visual_LegendNameDescription"),
                            type: { text: true }
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
                categoryLabels: {
                    displayName: createDisplayNameGetter("Visual_CategoryLabels"),
                    properties: {
                        show: {
                            displayName: createDisplayNameGetter("Visual_Show"),
                            type: { bool: true }
                        },
                        color: {
                            displayName: createDisplayNameGetter("Visual_LabelsFill"),
                            type: { fill: { solid: { color: true } } }
                        },
                        fontSize: {
                            displayName: "Text Size",
                            type: { formatting: { fontSize: true } }
                        },
                    },
                },
                fillPoint: {
                    displayName: createDisplayNameGetter("Visual_FillPoint"),
                    properties: {
                        show: {
                            displayName: createDisplayNameGetter("Visual_Fill"),
                            type: { bool: true }
                        },
                    },
                },
                backdrop: {
                    displayName: "Backdrop",
                    properties: {
                        show: {
                            displayName: createDisplayNameGetter("Visual_Show"),
                            type: { bool: true }
                        },
                        url: {
                            displayName: "Image URL",
                            type: { text: true }
                        },
                    },
                },
                crosshair: {
                    displayName: "Crosshair",
                    properties: {
                        show: {
                            displayName: "Crosshair",
                            type: { bool: true }
                        },
                    },
                },
                outline: {
                    displayName: "Outline",
                    properties: {
                        show: {
                            displayName: createDisplayNameGetter("Visual_Outline"),
                            type: { bool: true }
                        }
                    }
                }
            }
        };

        /**
         * Public for testability.
         */
        public static getPropertiesByCapabilities<T>(capabilities: VisualCapabilities): T {
            var propertiesByCapabilities: T = <T>{};

            if (!capabilities) {
                return propertiesByCapabilities;
            }

            for (var objectName in capabilities.objects) {
                var objectDescriptor: DataViewObjectDescriptor = capabilities.objects[objectName];

                propertiesByCapabilities[objectName] = {};

                if (objectDescriptor) {
                    for (var propertyName in objectDescriptor.properties) {
                        propertiesByCapabilities[objectName][propertyName] = {
                            objectName: objectName,
                            propertyName: propertyName
                        };
                    }
                }
            }

            return propertiesByCapabilities;
        }

        /**
         * Public for testability.
         */
        public static Properties: EnhancedScatterChartProperties =
            EnhancedScatterChart.getPropertiesByCapabilities<EnhancedScatterChartProperties>(EnhancedScatterChart.capabilities);

        private static substractMargin(viewport: IViewport, margin: IMargin): IViewport {
            return {
                width: Math.max(viewport.width - (margin.left + margin.right), 0),
                height: Math.max(viewport.height - (margin.top + margin.bottom), 0)
            };
        }

        private static getCustomSymbolType(shape: any): (number) => string {
            var customSymbolTypes = d3.map({
                "circle": (size) => {
                    var r = Math.sqrt(size / Math.PI);
                    return "M0," + r + "A" + r + "," + r + " 0 1,1 0," + (-r) + "A" + r + "," + r + " 0 1,1 0," + r + "Z";
                },

                "cross": function (size) {
                    var r = Math.sqrt(size / 5) / 2;
                    return "M" + -3 * r + "," + -r
                        + "H" + -r + "V" + -3 * r + "H" + r + "V" + -r + "H" + 3 * r + "V" + r + "H" + r + "V" + 3 * r + "H" + -r + "V" + r + "H" + -3 * r + "Z";
                },

                "diamond": (size) => {
                    var ry = Math.sqrt(size / (2 * Math.tan(Math.PI / 6))),
                        rx = ry * Math.tan(Math.PI / 6);
                    return "M0," + -ry
                        + "L" + rx + ",0"
                        + " 0," + ry
                        + " " + -rx + ",0"
                        + "Z";
                },

                "square": (size) => {
                    var r = Math.sqrt(size) / 2;
                    return "M" + -r + "," + -r
                        + "L" + r + "," + -r
                        + " " + r + "," + r
                        + " " + -r + "," + r
                        + "Z";
                },

                "triangle-up": (size) => {
                    var rx = Math.sqrt(size / Math.sqrt(3)),
                        ry = rx * Math.sqrt(3) / 2;
                    return "M0," + -ry
                        + "L" + rx + "," + ry
                        + " " + -rx + "," + ry
                        + "Z";
                },

                "triangle-down": (size) => {
                    var rx = Math.sqrt(size / Math.sqrt(3)),
                        ry = rx * Math.sqrt(3) / 2;
                    return "M0," + ry
                        + "L" + rx + "," + -ry
                        + " " + -rx + "," + -ry
                        + "Z";
                },

                "star": (size) => {
                    var outerRadius = Math.sqrt(size / 2);
                    var innerRadius = Math.sqrt(size / 10);
                    var results = "";
                    var angle = Math.PI / 5;
                    for (var i = 0; i < 10; i++) {
                        // Use outer or inner radius depending on what iteration we are in.
                        var r = (i & 1) === 0 ? outerRadius : innerRadius;
                        var currX = Math.cos(i * angle) * r;
                        var currY = Math.sin(i * angle) * r;
                        // Our first time we simply append the coordinates, subsequet times
                        // we append a ", " to distinguish each coordinate pair.
                        if (i === 0) {
                            results = "M" + currX + "," + currY + "L";
                        } else {
                            results += " " + currX + "," + currY;
                        }
                    }
                    return results + "Z";
                },

                "hexagon": (size) => {
                    var r = Math.sqrt(size / (6 * Math.sqrt(3)));
                    var r2 = Math.sqrt(size / (2 * Math.sqrt(3)));

                    return "M0," + (2 * r) + "L" + (-r2) + "," + r + " " + (-r2) + "," + (-r) + " 0," + (-2 * r) + " " + r2 + "," + (-r) + " " + r2 + "," + r + "Z";
                },

                "x": (size) => {
                    var r = Math.sqrt(size / 10);
                    return "M0," + r + "L" + (-r) + "," + 2 * r + " " + (-2 * r) + "," + r + " " + (-r) + ",0 " + (-2 * r) + "," + (-r) + " " + (-r) + "," + (-2 * r) + " 0," + (-r) + " " + r + "," + (-2 * r) + " " + (2 * r) + "," + (-r) + " " + r + ",0 " + (2 * r) + "," + r + " " + r + "," + (2 * r) + "Z";
                },

                "uparrow": (size) => {
                    var r = Math.sqrt(size / 12);
                    return "M" + r + "," + (3 * r) + "L" + (-r) + "," + (3 * r) + " " + (-r) + "," + (-r) + " " + (-2 * r) + "," + (-r) + " 0," + (-3 * r) + " " + (2 * r) + "," + (-r) + " " + r + "," + (-r) + "Z";
                },

                "downarrow": (size) => {
                    var r = Math.sqrt(size / 12);
                    return "M0," + (3 * r) + "L" + (-2 * r) + "," + r + " " + (-r) + "," + r + " " + (-r) + "," + (-3 * r) + " " + r + "," + (-3 * r) + " " + r + "," + r + " " + (2 * r) + "," + r + "Z";
                }
            });

            var defaultValue = customSymbolTypes.entries()[0].value;

            if (!shape) {
                return defaultValue;
            } else if (isNaN(shape)) {
                return customSymbolTypes[shape && shape.toString().toLowerCase()] || defaultValue;
            } else {
                var result = customSymbolTypes.entries()[Math.floor(shape)];

                return result ? result.value : defaultValue;
            }
        }

        public init(options: VisualInitOptions): void {
            this.options = options;
            this.animator = new BaseAnimator();

            this.behavior = new CustomVisualBehavior([new EnhancedScatterChartWebBehavior(
                EnhancedScatterChart.DimmedBubbleOpacity,
                EnhancedScatterChart.DefaultBubbleOpacity
            )]);

            var element: JQuery = this.element = options.element;

            this.viewport = _.clone(options.viewport);
            this.style = options.style;
            this.hostServices = options.host;
            this.colors = this.style.colorPalette.dataColors;
            this.interactivity = options.interactivity;

            this.margin = {
                top: 1,
                right: 1,
                bottom: 1,
                left: 1
            };

            this.yAxisOrientation = yAxisPosition.left;
            this.adjustMargins();

            var showLinesOnX: boolean = this.scrollY = true;
            var showLinesOnY: boolean = this.scrollX = true;

            var svg: D3.Selection = this.svg = d3.select(element.get(0))
                .append("svg")
                .style("position", "absolute")
                .classed(EnhancedScatterChart.ClassName, true);

            var axisGraphicsContext = this.axisGraphicsContext = svg.append("g")
                .classed(EnhancedScatterChart.AxisGraphicsContextClassName, true);

            this.svgScrollable = svg.append("svg")
                .classed("svgScrollable", true)
                .style("overflow", "hidden");

            var axisGraphicsContextScrollable = this.axisGraphicsContextScrollable = this.svgScrollable.append("g")
                .classed(EnhancedScatterChart.AxisGraphicsContextClassName, true);

            this.clearCatcher = appendClearCatcher(this.axisGraphicsContextScrollable);

            var axisGroup: D3.Selection = showLinesOnX
                ? axisGraphicsContextScrollable
                : axisGraphicsContext;

            this.backgroundGraphicsContext = axisGraphicsContext.append("svg:image");

            this.xAxisGraphicsContext = showLinesOnX
                ? axisGraphicsContext.append("g").attr("class", "x axis")
                : axisGraphicsContextScrollable.append("g").attr("class", "x axis");

            this.y1AxisGraphicsContext = axisGroup.append("g").attr("class", "y axis");

            this.xAxisGraphicsContext.classed("showLinesOnAxis", showLinesOnX);
            this.y1AxisGraphicsContext.classed("showLinesOnAxis", showLinesOnY);

            this.xAxisGraphicsContext.classed("hideLinesOnAxis", !showLinesOnX);
            this.y1AxisGraphicsContext.classed("hideLinesOnAxis", !showLinesOnY);
            this.interactivityService = createInteractivityService(this.hostServices);

            this.legend = createLegend(
                element,
                this.interactivity && this.interactivity.isInteractiveLegend,
                this.interactivityService,
                true);

            this.mainGraphicsG = this.axisGraphicsContextScrollable
                .append("g")
                .classed(EnhancedScatterChart.MainGraphicsContextClassName, true);

            this.mainGraphicsSVGSelection = this.mainGraphicsG.append("svg");
            this.mainGraphicsContext = this.mainGraphicsSVGSelection.append("g");

            this.svgDefaultImage = "";
            this.keyArray = [];
        }

        private adjustMargins(): void {
            // Adjust margins if ticks are not going to be shown on either axis
            var xAxis = this.element.find(".x.axis");

            if (AxisHelper.getRecommendedNumberOfTicksForXAxis(this.viewportIn.width) === 0
                && AxisHelper.getRecommendedNumberOfTicksForYAxis(this.viewportIn.height) === 0) {
                this.margin = {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                };

                xAxis.hide();
            } else {
                xAxis.show();
            }
        }

        private getValueAxisProperties(dataViewMetadata: DataViewMetadata, axisTitleOnByDefault?: boolean): DataViewObject {
            var toReturn: DataViewObject = {};

            if (!dataViewMetadata) {
                return toReturn;
            }

            var objects: DataViewObjects = dataViewMetadata.objects;

            if (objects) {
                var valueAxisObject = objects["valueAxis"];
                if (valueAxisObject) {
                    toReturn = {
                        show: valueAxisObject["show"],
                        position: valueAxisObject["position"],
                        axisScale: valueAxisObject["axisScale"],
                        start: valueAxisObject["start"],
                        end: valueAxisObject["end"],
                        showAxisTitle: valueAxisObject["showAxisTitle"] == null ? axisTitleOnByDefault : valueAxisObject["showAxisTitle"],
                        axisStyle: valueAxisObject["axisStyle"],
                        axisColor: valueAxisObject["axisColor"],
                        secShow: valueAxisObject["secShow"],
                        secPosition: valueAxisObject["secPosition"],
                        secAxisScale: valueAxisObject["secAxisScale"],
                        secStart: valueAxisObject["secStart"],
                        secEnd: valueAxisObject["secEnd"],
                        secShowAxisTitle: valueAxisObject["secShowAxisTitle"],
                        secAxisStyle: valueAxisObject["secAxisStyle"],
                        labelDisplayUnits: valueAxisObject["labelDisplayUnits"],
                    };
                }
            }
            return toReturn;
        }

        private getCategoryAxisProperties(dataViewMetadata: DataViewMetadata, axisTitleOnByDefault?: boolean): DataViewObject {
            var toReturn: DataViewObject = {};

            if (!dataViewMetadata) {
                return toReturn;
            }

            var objects: DataViewObjects = dataViewMetadata.objects;

            if (objects) {
                var categoryAxisObject = objects["categoryAxis"];

                if (categoryAxisObject) {
                    toReturn = {
                        show: categoryAxisObject["show"],
                        axisType: categoryAxisObject["axisType"],
                        axisScale: categoryAxisObject["axisScale"],
                        axisColor: categoryAxisObject["axisColor"],
                        start: categoryAxisObject["start"],
                        end: categoryAxisObject["end"],
                        showAxisTitle: categoryAxisObject["showAxisTitle"] == null
                            ? axisTitleOnByDefault : categoryAxisObject["showAxisTitle"],
                        axisStyle: categoryAxisObject["axisStyle"],
                        labelDisplayUnits: categoryAxisObject["labelDisplayUnits"]
                    };
                }
            }

            return toReturn;
        }

        public static converter(
            dataView: DataView,
            colorPalette: IDataColorPalette,
            interactivityService?: IInteractivityService,
            categoryAxisProperties?: DataViewObject,
            valueAxisProperties?: DataViewObject): EnhancedScatterChartData {

            if (!dataView) {
                return EnhancedScatterChart.getDefaultData();
            }

            var categoryValues: any[],
                categoryFormatter: IValueFormatter,
                categoryObjects: DataViewObjects[],
                categoryIdentities: DataViewScopeIdentity[],
                categoryQueryName: string,
                dataViewCategorical: DataViewCategorical = dataView.categorical,
                dataViewMetadata: DataViewMetadata = dataView.metadata,
                categories: DataViewCategoryColumn[] = dataViewCategorical.categories || [],
                dataValues: DataViewValueColumns = dataViewCategorical.values,
                hasDynamicSeries: boolean = !!dataValues.source,
                grouped: DataViewValueColumnGroup[] = dataValues.grouped(),
                dvSource = dataValues.source,
                scatterMetadata = EnhancedScatterChart.getMetadata(categories, grouped, dvSource),
                categoryIndex: number = scatterMetadata.idx.category,
                useShape: boolean = scatterMetadata.idx.image >= 0,
                useCustomColor: boolean = scatterMetadata.idx.colorFill >= 0;

            if (dataViewCategorical.categories &&
                dataViewCategorical.categories.length > 0 &&
                dataViewCategorical.categories[categoryIndex]) {

                var mainCategory: DataViewCategoryColumn = dataViewCategorical.categories[categoryIndex];

                categoryValues = mainCategory.values;

                categoryFormatter = valueFormatter.create({
                    format: valueFormatter.getFormatString(
                        mainCategory.source,
                        EnhancedScatterChart.Properties["general"]["formatString"]),
                    value: categoryValues[0],
                    value2: categoryValues[categoryValues.length - 1]
                });

                categoryIdentities = mainCategory.identity;
                categoryObjects = mainCategory.objects;
                categoryQueryName = mainCategory.source ? mainCategory.source.queryName : null;
            }
            else {
                categoryValues = [null];
                // creating default formatter for null value (to get the right string of empty value from the locale)
                categoryFormatter = valueFormatter.createDefaultFormatter(null);
            }

            var dataLabelsSettings = dataLabelUtils.getDefaultPointLabelSettings(),
                fillPoint = false,
                backdrop = { show: false, url: "" },
                crosshair = false,
                outline = false,
                defaultDataPointColor: string = "",
                showAllDataPoints = true;

            if (dataViewMetadata && dataViewMetadata.objects) {
                var objects = dataViewMetadata.objects;

                defaultDataPointColor = DataViewObjects.getFillColor(
                    objects,
                    EnhancedScatterChart.Properties["dataPoint"]["defaultColor"]);

                showAllDataPoints = DataViewObjects.getValue<boolean>(
                    objects,
                    EnhancedScatterChart.Properties["dataPoint"]["showAllDataPoints"]);

                var labelsObj = objects["categoryLabels"];
                if (labelsObj) {
                    dataLabelsSettings.show = (labelsObj["show"] !== undefined)
                        ? <boolean>labelsObj["show"] : dataLabelsSettings.show;

                    dataLabelsSettings.fontSize = (labelsObj["fontSize"] !== undefined)
                        ? <number>labelsObj["fontSize"] : dataLabelsSettings.fontSize;

                    if (labelsObj["color"] !== undefined) {
                        dataLabelsSettings.labelColor = (<Fill>labelsObj["color"]).solid.color;
                    }
                }

                fillPoint = DataViewObjects.getValue<boolean>(
                    objects,
                    EnhancedScatterChart.Properties["fillPoint"]["show"],
                    fillPoint);

                var backdropObject = objects["backdrop"];
                if (backdropObject !== undefined) {
                    backdrop.show = <boolean>backdropObject["show"];
                    if (backdrop.show) {
                        backdrop.url = <string>backdropObject["url"];
                    }
                }

                var crosshairObject = objects["crosshair"];
                if (crosshairObject !== undefined) {
                    crosshair = <boolean>crosshairObject["show"];
                }

                var outlineObject = objects["outline"];
                if (outlineObject !== undefined) {
                    outline = <boolean>outlineObject["show"];
                }
            }

            var dataPoints = EnhancedScatterChart.createDataPoints(
                dataValues,
                scatterMetadata,
                categories,
                categoryValues,
                categoryFormatter,
                categoryIdentities,
                categoryObjects,
                colorPalette,
                hasDynamicSeries,
                dataLabelsSettings,
                defaultDataPointColor,
                categoryQueryName);

            if (interactivityService) {
                interactivityService.applySelectionStateToData(dataPoints);
            }

            var legendItems: LegendDataPoint[] = [];

            if (hasDynamicSeries) {
                var formatString: string = valueFormatter.getFormatString(
                    dvSource,
                    EnhancedScatterChart.Properties["general"]["formatString"]);

                legendItems = EnhancedScatterChart.createSeriesLegend(
                    dataValues,
                    colorPalette,
                    dataValues,
                    formatString,
                    defaultDataPointColor);
            }

            var legendTitle: string = dataValues && dvSource
                ? dvSource.displayName
                : "";

            if (!legendTitle) {
                legendTitle = categories &&
                    categories[categoryIndex] &&
                    categories[categoryIndex].source &&
                    categories[categoryIndex].source.displayName
                    ? categories[categoryIndex].source.displayName : "";
            }

            var legendData = { title: legendTitle, dataPoints: legendItems };

            var sizeRange = EnhancedScatterChart.getSizeRangeForGroups(grouped, scatterMetadata.idx.size);

            if (categoryAxisProperties && categoryAxisProperties["showAxisTitle"] !== null && categoryAxisProperties["showAxisTitle"] === false) {
                scatterMetadata.axesLabels.x = null;
            }
            if (valueAxisProperties && valueAxisProperties["showAxisTitle"] !== null && valueAxisProperties["showAxisTitle"] === false) {
                scatterMetadata.axesLabels.y = null;
            }

            if (dataPoints && dataPoints[0]) {
                var point = dataPoints[0];
                if (point.backdrop != null) {
                    backdrop.show = true;
                    backdrop.url = point.backdrop;
                }
                if (point.xStart != null) {
                    categoryAxisProperties["start"] = point.xStart;
                }
                if (point.xEnd != null) {
                    categoryAxisProperties["end"] = point.xEnd;
                }
                if (point.yStart != null) {
                    valueAxisProperties["start"] = point.yStart;
                }
                if (point.yEnd != null) {
                    valueAxisProperties["end"] = point.yEnd;
                }
            }

            return {
                xCol: scatterMetadata.cols.x,
                yCol: scatterMetadata.cols.y,
                dataPoints: dataPoints,
                legendData: legendData,
                axesLabels: scatterMetadata.axesLabels,
                selectedIds: [],
                size: scatterMetadata.cols.size,
                sizeRange: sizeRange,
                dataLabelsSettings: dataLabelsSettings,
                defaultDataPointColor: defaultDataPointColor,
                hasDynamicSeries: hasDynamicSeries,
                showAllDataPoints: showAllDataPoints,
                fillPoint: fillPoint,
                useShape: useShape,
                useCustomColor: useCustomColor,
                backdrop: backdrop,
                crosshair: crosshair,
                outline: outline
            };
        }

        private static createSeriesLegend(
            dataValues: DataViewValueColumns,
            colorPalette: IDataColorPalette,
            categorical: DataViewValueColumns,
            formatString: string,
            defaultDataPointColor: string): LegendDataPoint[] {

            var legendItems: LegendDataPoint[] = [],
                grouped: DataViewValueColumnGroup[] = dataValues.grouped(),
                colorHelper: ColorHelper = new ColorHelper(
                    colorPalette,
                    EnhancedScatterChart.Properties["dataPoint"]["fill"],
                    defaultDataPointColor);

            for (var i = 0, len = grouped.length; i < len; i++) {
                var grouping: DataViewValueColumnGroup = grouped[i],
                    selectionId: SelectionId,
                    color: string;

                color = colorHelper.getColorForSeriesValue(grouping.objects, dataValues.identityFields, grouping.name);

                selectionId = grouping.identity
                    ? SelectionId.createWithId(grouping.identity)
                    : SelectionId.createNull();

                legendItems.push({
                    color: color,
                    icon: LegendIcon.Circle,
                    label: valueFormatter.format(grouping.name, formatString),
                    identity: selectionId,
                    selected: false,
                });
            }

            return legendItems;
        }

        private static getSizeRangeForGroups(
            dataViewValueGroups: DataViewValueColumnGroup[],
            sizeColumnIndex: number): NumberRange {

            var result: NumberRange = {};

            if (dataViewValueGroups) {
                dataViewValueGroups.forEach((group) => {
                    var sizeColumn: DataViewValueColumn = EnhancedScatterChart.getMeasureValue(sizeColumnIndex, group.values),
                        currentRange: NumberRange = AxisHelper.getRangeForColumn(sizeColumn);

                    if (result.min == null || result.min > currentRange.min) {
                        result.min = currentRange.min;
                    }

                    if (result.max == null || result.max < currentRange.max) {
                        result.max = currentRange.max;
                    }
                });
            }

            return result;
        }

        private static getMetadata(
            categories: DataViewCategoryColumn[],
            grouped: DataViewValueColumnGroup[],
            source: DataViewMetadataColumn): EnhancedScatterChartMeasureMetadata {

            var categoryIndex: number = getCategoryIndexOfRole(categories, EnhancedScatterChart.ColumnCategory),
                colorFillIndex: number = getCategoryIndexOfRole(categories, EnhancedScatterChart.ColumnColorFill),
                imageIndex: number = getCategoryIndexOfRole(categories, EnhancedScatterChart.ColumnImage),
                backdropIndex: number = getCategoryIndexOfRole(categories, EnhancedScatterChart.ColumnBackdrop),
                xIndex: number = getMeasureIndexOfRole(grouped, EnhancedScatterChart.ColumnX),
                yIndex: number = getMeasureIndexOfRole(grouped, EnhancedScatterChart.ColumnY),
                sizeIndex: number = getMeasureIndexOfRole(grouped, EnhancedScatterChart.ColumnSize),
                shapeIndex: number = getMeasureIndexOfRole(grouped, EnhancedScatterChart.ColumnShape),
                rotationIndex: number = getMeasureIndexOfRole(grouped, EnhancedScatterChart.ColumnRotation),
                xStartIndex: number = getMeasureIndexOfRole(grouped, EnhancedScatterChart.ColumnXStart),
                xEndIndex: number = getMeasureIndexOfRole(grouped, EnhancedScatterChart.ColumnXEnd),
                yStartIndex: number = getMeasureIndexOfRole(grouped, EnhancedScatterChart.ColumnYStart),
                yEndIndex: number = getMeasureIndexOfRole(grouped, EnhancedScatterChart.ColumnYEnd),
                xCol: DataViewMetadataColumn,
                yCol: DataViewMetadataColumn,
                sizeCol: DataViewMetadataColumn,
                xAxisLabel: string = "",
                yAxisLabel: string = "";

            if (grouped && grouped.length) {
                var firstGroup: DataViewValueColumnGroup = grouped[0];

                if (xIndex >= 0) {
                    xCol = firstGroup.values[xIndex].source;
                    xAxisLabel = firstGroup.values[xIndex].source.displayName;
                }

                if (yIndex >= 0) {
                    yCol = firstGroup.values[yIndex].source;
                    yAxisLabel = firstGroup.values[yIndex].source.displayName;
                }

                if (sizeIndex >= 0) {
                    sizeCol = firstGroup.values[sizeIndex].source;
                }
            }

            return {
                idx: {
                    category: categoryIndex,
                    x: xIndex,
                    y: yIndex,
                    size: sizeIndex,
                    colorFill: colorFillIndex,
                    shape: shapeIndex,
                    image: imageIndex,
                    rotation: rotationIndex,
                    backdrop: backdropIndex,
                    xStart: xStartIndex,
                    xEnd: xEndIndex,
                    yStart: yStartIndex,
                    yEnd: yEndIndex
                },
                cols: {
                    x: xCol,
                    y: yCol,
                    size: sizeCol
                },
                axesLabels: {
                    x: xAxisLabel,
                    y: yAxisLabel
                }
            };
        }

        public static createLazyFormattedCategory(formatter: IValueFormatter, value: string): Lazy<string> {
            return new Lazy(() => formatter.format(value));
        }

        private static createDataPoints(
            dataValues: DataViewValueColumns,
            metadata: EnhancedScatterChartMeasureMetadata,
            categories: DataViewCategoryColumn[],
            categoryValues: any[],
            categoryFormatter: IValueFormatter,
            categoryIdentities: DataViewScopeIdentity[],
            categoryObjects: DataViewObjects[],
            colorPalette: IDataColorPalette,
            hasDynamicSeries: boolean,
            labelSettings: PointDataLabelsSettings,
            defaultDataPointColor?: string,
            categoryQueryName?: string): EnhancedScatterChartDataPoint[] {

            var dataPoints: EnhancedScatterChartDataPoint[] = [],
                colorHelper: ColorHelper,
                indicies: EnhancedScatterChartMeasureMetadataIndexes = metadata.idx,
                formatStringProp: DataViewObjectPropertyIdentifier,
                dataValueSource: DataViewMetadataColumn = dataValues.source,
                grouped: DataViewValueColumnGroup[] = dataValues.grouped(),
                fontSizeInPx: string = PixelConverter.fromPoint(labelSettings.fontSize);

            formatStringProp = EnhancedScatterChart.Properties["general"]["formatString"];

            colorHelper = new ColorHelper(
                colorPalette,
                EnhancedScatterChart.Properties["dataPoint"]["fill"],
                defaultDataPointColor);

            for (var categoryIdx = 0, ilen = categoryValues.length; categoryIdx < ilen; categoryIdx++) {
                var categoryValue = categoryValues[categoryIdx];

                for (var seriesIdx = 0, len = grouped.length; seriesIdx < len; seriesIdx++) {
                    var measureColorFill: DataViewCategoricalColumn = categories[indicies.colorFill],
                        measureImage: DataViewCategoricalColumn = categories[indicies.image],
                        measureBackdrop: DataViewCategoricalColumn = categories[indicies.backdrop];

                    var grouping: DataViewValueColumnGroup = grouped[seriesIdx],
                        seriesValues: DataViewValueColumn[] = grouping.values,
                        measureX: DataViewValueColumn = EnhancedScatterChart.getMeasureValue(indicies.x, seriesValues),
                        measureY: DataViewValueColumn = EnhancedScatterChart.getMeasureValue(indicies.y, seriesValues),
                        measureSize: DataViewValueColumn = EnhancedScatterChart.getMeasureValue(indicies.size, seriesValues),
                        measureShape: DataViewValueColumn = EnhancedScatterChart.getMeasureValue(indicies.shape, seriesValues),
                        measureRotation: DataViewValueColumn = EnhancedScatterChart.getMeasureValue(indicies.rotation, seriesValues),
                        measureXStart: DataViewValueColumn = EnhancedScatterChart.getMeasureValue(indicies.xStart, seriesValues),
                        measureXEnd: DataViewValueColumn = EnhancedScatterChart.getMeasureValue(indicies.xEnd, seriesValues),
                        measureYStart: DataViewValueColumn = EnhancedScatterChart.getMeasureValue(indicies.yStart, seriesValues),
                        measureYEnd: DataViewValueColumn = EnhancedScatterChart.getMeasureValue(indicies.yEnd, seriesValues);

                    //TODO: need to update (refactor) these lines below.
                    var xVal = measureX && measureX.values && !isNaN(<number>measureX.values[categoryIdx]) ? measureX.values[categoryIdx] : null,
                        yVal = measureY && measureY.values && !isNaN(<number>measureY.values[categoryIdx]) ? measureY.values[categoryIdx] : 0;

                    var hasNullValue = (xVal == null) || (yVal == null);

                    if (hasNullValue) {
                        continue;
                    }

                    var size: number,
                        colorFill: string,
                        shapeSymbolType: (number) => string,
                        image: string,
                        rotation: number,
                        backdrop: string,
                        xStart: number,
                        xEnd: number,
                        yStart: number,
                        yEnd: number,
                        color: string;

                    size = EnhancedScatterChart.getValueFromDataViewValueColumnById(measureSize, categoryIdx);

                    colorFill = EnhancedScatterChart.getValueFromDataViewValueColumnById(
                        measureColorFill, categoryIdx);

                    shapeSymbolType = EnhancedScatterChart.getCustomSymbolType(
                        EnhancedScatterChart.getValueFromDataViewValueColumnById(measureShape, categoryIdx));

                    image = EnhancedScatterChart.getValueFromDataViewValueColumnById(measureImage, categoryIdx);
                    rotation = EnhancedScatterChart.getNumberFromDataViewValueColumnById(measureRotation, categoryIdx);
                    backdrop = EnhancedScatterChart.getValueFromDataViewValueColumnById(measureBackdrop, categoryIdx);
                    xStart = EnhancedScatterChart.getValueFromDataViewValueColumnById(measureXStart, categoryIdx);
                    xEnd = EnhancedScatterChart.getValueFromDataViewValueColumnById(measureXEnd, categoryIdx);
                    yStart = EnhancedScatterChart.getValueFromDataViewValueColumnById(measureYStart, categoryIdx);
                    yEnd = EnhancedScatterChart.getValueFromDataViewValueColumnById(measureYEnd, categoryIdx);

                    if (hasDynamicSeries) {
                        color = colorHelper.getColorForSeriesValue(grouping.objects, dataValues.identityFields, grouping.name);
                    } else {
                        // If we have no Size measure then use a blank query name
                        var measureSource: string = (measureSize != null)
                            ? measureSize.source.queryName
                            : "";

                        color = colorHelper.getColorForMeasure(categoryObjects && categoryObjects[categoryIdx], measureSource);
                    }

                    var category: DataViewCategoryColumn = categories && categories.length > 0
                        ? categories[indicies.category]
                        : null;

                    var identity: SelectionId = SelectionIdBuilder.builder()
                        .withCategory(category, categoryIdx)
                        .withSeries(dataValues, grouping)
                        .createSelectionId();

                    //TODO: need to refactor these lines below.
                    var seriesData: TooltipSeriesDataItem[] = [];
                    if (dataValueSource) {
                        // Dynamic series
                        seriesData.push({ value: grouping.name, metadata: { source: dataValueSource, values: [] } });
                    }

                    if (measureX) {
                        seriesData.push({ value: xVal, metadata: measureX });
                    }

                    if (measureY) {
                        seriesData.push({ value: yVal, metadata: measureY });
                    }

                    if (measureSize && measureSize.values && measureSize.values.length > 0) {
                        seriesData.push({ value: measureSize.values[categoryIdx], metadata: measureSize });
                    }

                    if (measureColorFill && measureColorFill.values && measureColorFill.values.length > 0) {
                        seriesData.push({ value: measureColorFill.values[categoryIdx], metadata: measureColorFill });
                    }

                    if (measureShape && measureShape.values && measureShape.values.length > 0) {
                        seriesData.push({ value: measureShape.values[categoryIdx], metadata: measureShape });
                    }

                    if (measureImage && measureImage.values && measureImage.values.length > 0) {
                        seriesData.push({ value: measureImage.values[categoryIdx], metadata: measureImage });
                    }

                    if (measureRotation && measureRotation.values && measureRotation.values.length > 0) {
                        seriesData.push({ value: measureRotation.values[categoryIdx], metadata: measureRotation });
                    }

                    if (measureBackdrop && measureBackdrop.values && measureBackdrop.values.length > 0) {
                        seriesData.push({ value: measureBackdrop.values[categoryIdx], metadata: measureBackdrop });
                    }

                    if (measureXStart && measureXStart.values && measureXStart.values.length > 0) {
                        seriesData.push({ value: measureXStart.values[categoryIdx], metadata: measureXStart });
                    }

                    if (measureXEnd && measureXEnd.values && measureXEnd.values.length > 0) {
                        seriesData.push({ value: measureXEnd.values[categoryIdx], metadata: measureXEnd });
                    }

                    if (measureYStart && measureYStart.values && measureYStart.values.length > 0) {
                        seriesData.push({ value: measureYStart.values[categoryIdx], metadata: measureYStart });
                    }

                    if (measureYEnd && measureYEnd.values && measureYEnd.values.length > 0) {
                        seriesData.push({ value: measureYEnd.values[categoryIdx], metadata: measureYEnd });
                    }

                    var tooltipInfo: TooltipDataItem[] = TooltipBuilder.createTooltipInfo(
                        formatStringProp, /* formatStringProp */
                        undefined, /* dataViewCat */
                        categoryValue, /* categoryValue */
                        null, /* value */
                        category ? [category] : undefined, /* categories */
                        seriesData, /* seriesData */
                        undefined /* seriesIndex */); 

                    var dataPoint: EnhancedScatterChartDataPoint = {
                        x: xVal,
                        y: yVal,
                        size: size,
                        radius: { sizeMeasure: measureSize, index: categoryIdx },
                        fill: color,
                        formattedCategory: this.createLazyFormattedCategory(categoryFormatter, categoryValue),
                        selected: false,
                        identity: identity,
                        tooltipInfo: tooltipInfo,
                        labelFill: labelSettings.labelColor,
                        labelFontSize: fontSizeInPx,
                        contentPosition: 8, //ContentPositions.MiddleLeft
                        colorFill: colorFill,
                        shapeSymbolType: shapeSymbolType,
                        svgurl: image,
                        rotation: rotation,
                        backdrop: backdrop,
                        xStart: xStart,
                        xEnd: xEnd,
                        yStart: yStart,
                        yEnd: yEnd
                    };

                    dataPoints.push(dataPoint);
                }
            }

            return dataPoints;
        }

        private static getMeasureValue(measureIndex: number, seriesValues: DataViewValueColumn[]): DataViewValueColumn {
            if (seriesValues && measureIndex >= 0) {
                return seriesValues[measureIndex];
            }

            return null;
        }

        private static getNumberFromDataViewValueColumnById(dataViewValueColumn: DataViewCategoricalColumn, index: number): number {
            var value: number = EnhancedScatterChart.getValueFromDataViewValueColumnById(dataViewValueColumn, index);

            return value && !isNaN(value)
                ? value
                : 0;
        }

        private static getValueFromDataViewValueColumnById(dataViewValueColumn: DataViewCategoricalColumn, index: number): any {
            return dataViewValueColumn && dataViewValueColumn.values
                ? dataViewValueColumn.values[index]
                : null;
        }

        private static getDefaultData(): EnhancedScatterChartData {
            return {
                xCol: undefined,
                yCol: undefined,
                dataPoints: [],
                legendData: { dataPoints: [] },
                axesLabels: { x: "", y: "" },
                selectedIds: [],
                sizeRange: [],
                dataLabelsSettings: dataLabelUtils.getDefaultPointLabelSettings(),
                defaultDataPointColor: null,
                hasDynamicSeries: false,
                useShape: false,
                useCustomColor: false,
            };
        }

        public setData(dataViews: DataView[]) {
            this.data = EnhancedScatterChart.getDefaultData();

            if (dataViews && dataViews.length > 0) {
                var dataView: DataView = dataViews[0];

                if (dataView) {
                    this.categoryAxisProperties = this.getCategoryAxisProperties(dataView.metadata, true);
                    this.valueAxisProperties = this.getValueAxisProperties(dataView.metadata, true);

                    this.dataView = dataView;

                    if (dataView.categorical && dataView.categorical.values) {
                        this.data = EnhancedScatterChart.converter(
                            dataView,
                            this.colors,
                            this.interactivityService,
                            this.categoryAxisProperties,
                            this.valueAxisProperties);
                    }
                }
            }
        }

        public update(options: VisualUpdateOptions) {

            debug.assertValue(options, "options");

            var dataViews: DataView[] = this.dataViews = options.dataViews;

            this.viewport = _.clone(options.viewport);

            if (!dataViews) {
                return;
            }

            if (dataViews && dataViews.length > 0) {
                var warnings = getInvalidValueWarnings(
                    dataViews,
                    false /*supportsNaN*/,
                    false /*supportsNegativeInfinity*/,
                    false /*supportsPositiveInfinity*/);

                if (warnings && warnings.length > 0)
                    this.hostServices.setWarnings(warnings);

                this.populateObjectProperties(dataViews);
            }

            this.setData(dataViews);

            // Note: interactive legend shouldn"t be rendered explicitly here
            // The interactive legend is being rendered in the render method of ICartesianVisual
            if (!(this.options.interactivity && this.options.interactivity.isInteractiveLegend)) {
                this.renderLegend();
            }

            this.render(options.suppressAnimations);

        }

        private populateObjectProperties(dataViews: DataView[]) {
            if (dataViews && dataViews.length > 0) {
                var dataViewMetadata = dataViews[0].metadata;

                if (dataViewMetadata) {
                    this.legendObjectProperties = DataViewObjects.getObject(dataViewMetadata.objects, "legend", {});
                }
                else {
                    this.legendObjectProperties = {};
                }
                this.categoryAxisProperties = this.getCategoryAxisProperties(dataViewMetadata);
                this.valueAxisProperties = this.getValueAxisProperties(dataViewMetadata);
                var axisPosition = this.valueAxisProperties["position"];
                this.yAxisOrientation = axisPosition ? axisPosition.toString() : yAxisPosition.left;
            }
        }

        private renderLegend(): void {
            var legendData: LegendData = { title: "", dataPoints: [] };
            var legend: ILegend = this.legend;

            this.layerLegendData = this.data.legendData;
            if (this.layerLegendData) {
                legendData.title = this.layerLegendData.title || "";
                legendData.dataPoints = legendData.dataPoints.concat(this.layerLegendData.dataPoints || []);
                legendData.fontSize = this.legendLabelFontSize ? this.legendLabelFontSize : EnhancedScatterChart.LegendLabelFontSizeDefault;
                if (this.layerLegendData.grouped) {
                    legendData.grouped = true;
                }
            }

            var legendProperties = this.legendObjectProperties;

            if (legendProperties) {
                LegendData.update(legendData, legendProperties);
                var position = <string>legendProperties[legendProps.position];

                if (position)
                    legend.changeOrientation(LegendPosition[position]);
            }
            else {
                legend.changeOrientation(LegendPosition.Top);
            }

            if (legendData.dataPoints.length === 1 && !legendData.grouped) {
                legendData.dataPoints = [];
            }

            var viewport = this.viewport;
            legend.drawLegend(legendData, { height: viewport.height, width: viewport.width });
            Legend.positionChartArea(this.svg, legend);
        }

        private shouldRenderAxis(axisProperties: IAxisProperties, propertyName: string = "show"): boolean {
            if (!axisProperties) {
                return false;
            }
            else if (axisProperties.isCategoryAxis && (!this.categoryAxisProperties || this.categoryAxisProperties[propertyName] == null || this.categoryAxisProperties[propertyName])) {
                return axisProperties.values && axisProperties.values.length > 0;
            }
            else if (!axisProperties.isCategoryAxis && (!this.valueAxisProperties || this.valueAxisProperties[propertyName] == null || this.valueAxisProperties[propertyName])) {
                return axisProperties.values && axisProperties.values.length > 0;
            }

            return false;
        }

        private getMaxMarginFactor(): number {
            return this.options.style.maxMarginFactor || 0.25;
        }

        private adjustViewportbyBackdrop(): void {
            var img = new Image();
            var that = this;
            img.src = this.data.backdrop.url;
            img.onload = function () {
                if (that.oldBackdrop !== this.src) {
                    that.render(true);
                    that.oldBackdrop = this.src;
                }
            };

            if (img.width > 0 && img.height > 0) {
                if (img.width * this.viewportIn.height < this.viewportIn.width * img.height) {
                    var deltaWidth = this.viewportIn.width - this.viewportIn.height * img.width / img.height;
                    this.viewport = { width: this.viewport.width - deltaWidth, height: this.viewport.height };
                } else {
                    var deltaHeight = this.viewportIn.height - this.viewportIn.width * img.height / img.width;
                    this.viewport = { width: this.viewport.width, height: this.viewport.height - deltaHeight };
                }
            }
        }

        public render(suppressAnimations: boolean): void {
            this.viewport.height -= this.legendViewport.height;
            this.viewport.width -= this.legendViewport.width;

            if (this.viewportIn.width === 0 || this.viewportIn.height === 0) {
                return;
            }

            var maxMarginFactor = this.getMaxMarginFactor();
            this.leftRightMarginLimit = this.viewport.width * maxMarginFactor;
            var bottomMarginLimit = this.bottomMarginLimit = Math.max(25, Math.ceil(this.viewport.height * maxMarginFactor));

            // reset defaults
            this.margin.top = 8;
            this.margin.bottom = bottomMarginLimit;
            this.margin.right = 0;

            this.calculateAxes(
                this.categoryAxisProperties,
                this.valueAxisProperties,
                EnhancedScatterChart.TextProperties,
                true);

            this.yAxisIsCategorical = this.yAxisProperties.isCategoryAxis;
            this.hasCategoryAxis = this.yAxisIsCategorical ? this.yAxisProperties && this.yAxisProperties.values.length > 0 : this.xAxisProperties && this.xAxisProperties.values.length > 0;

            var renderXAxis = this.shouldRenderAxis(this.xAxisProperties);
            var renderY1Axis = this.shouldRenderAxis(this.yAxisProperties);

            var mainAxisScale;
            this.isXScrollBarVisible = false;
            this.isYScrollBarVisible = false;
            var tickLabelMargins;
            var axisLabels: ChartAxesLabels;
            var chartHasAxisLabels: boolean;

            var yAxisOrientation = this.yAxisOrientation;
            var showY1OnRight = yAxisOrientation === yAxisPosition.right;

            this.calculateAxes(
                this.categoryAxisProperties,
                this.valueAxisProperties,
                EnhancedScatterChart.TextProperties, true);

            var doneWithMargins = false,
                maxIterations = 2,
                numIterations = 0;

            while (!doneWithMargins && numIterations < maxIterations) {
                numIterations++;

                tickLabelMargins = AxisHelper.getTickLabelMargins(
                    { width: this.viewportIn.width, height: this.viewport.height },
                    this.leftRightMarginLimit,
                    measureSvgTextWidth,
                    measureSvgTextHeight,
                    { x: this.xAxisProperties, y1: this.yAxisProperties },
                    this.bottomMarginLimit,
                    EnhancedScatterChart.TextProperties,
                    this.isXScrollBarVisible || this.isYScrollBarVisible,
                    showY1OnRight,
                    renderXAxis,
                    renderY1Axis,
                    false);

                // We look at the y axes as main and second sides, if the y axis orientation is right so the main side represents the right side
                var maxMainYaxisSide = showY1OnRight ? tickLabelMargins.yRight : tickLabelMargins.yLeft,
                    maxSecondYaxisSide = showY1OnRight ? tickLabelMargins.yLeft : tickLabelMargins.yRight,
                    xMax = tickLabelMargins.xMax;

                maxMainYaxisSide += 10;
                maxSecondYaxisSide += 10;
                xMax += 12;
                if (showY1OnRight && renderY1Axis) {
                    maxSecondYaxisSide += 20;
                }

                if (!showY1OnRight && renderY1Axis) {
                    maxMainYaxisSide += 20;
                }

                this.addUnitTypeToAxisLabel(this.xAxisProperties, this.yAxisProperties);

                axisLabels = { x: this.xAxisProperties.axisLabel, y: this.yAxisProperties.axisLabel, y2: null };
                chartHasAxisLabels = (axisLabels.x != null) || (axisLabels.y != null || axisLabels.y2 != null);

                if (axisLabels.x != null)
                    xMax += 18;

                if (axisLabels.y != null)
                    maxMainYaxisSide += 20;

                if (axisLabels.y2 != null)
                    maxSecondYaxisSide += 20;

                this.margin.left = showY1OnRight ? maxSecondYaxisSide : maxMainYaxisSide;
                this.margin.right = showY1OnRight ? maxMainYaxisSide : maxSecondYaxisSide;
                this.margin.bottom = xMax;

                // re-calculate the axes with the new margins
                var previousTickCountY1 = this.yAxisProperties.values.length;

                this.calculateAxes(
                    this.categoryAxisProperties,
                    this.valueAxisProperties,
                    EnhancedScatterChart.TextProperties,
                    true);

                // the minor padding adjustments could have affected the chosen tick values, which would then need to calculate margins again
                // e.g. [0,2,4,6,8] vs. [0,5,10] the 10 is wider and needs more margin.
                if (this.yAxisProperties.values.length === previousTickCountY1)
                    doneWithMargins = true;
            }
            // we have to do the above process again since changes are made to viewport.

            if (this.data.backdrop && this.data.backdrop.show && (this.data.backdrop.url !== undefined)) {
                this.adjustViewportbyBackdrop();

                doneWithMargins = false;
                maxIterations = 2;
                numIterations = 0;

                while (!doneWithMargins && numIterations < maxIterations) {
                    numIterations++;

                    tickLabelMargins = AxisHelper.getTickLabelMargins(
                        { width: this.viewportIn.width, height: this.viewport.height },
                        this.leftRightMarginLimit,
                        measureSvgTextWidth,
                        measureSvgTextHeight,
                        { x: this.xAxisProperties, y1: this.yAxisProperties },
                        this.bottomMarginLimit,
                        EnhancedScatterChart.TextProperties,
                        this.isXScrollBarVisible || this.isYScrollBarVisible,
                        showY1OnRight,
                        renderXAxis,
                        renderY1Axis,
                        false);

                    // We look at the y axes as main and second sides, if the y axis orientation is right so the main side represents the right side
                    var maxMainYaxisSide = showY1OnRight ? tickLabelMargins.yRight : tickLabelMargins.yLeft,
                        maxSecondYaxisSide = showY1OnRight ? tickLabelMargins.yLeft : tickLabelMargins.yRight,
                        xMax = tickLabelMargins.xMax;

                    maxMainYaxisSide += 10;

                    if (showY1OnRight && renderY1Axis){
                        maxSecondYaxisSide += 15;
                    }

                    xMax += 12;

                    this.addUnitTypeToAxisLabel(this.xAxisProperties, this.yAxisProperties);

                    axisLabels = { x: this.xAxisProperties.axisLabel, y: this.yAxisProperties.axisLabel, y2: null };
                    chartHasAxisLabels = (axisLabels.x != null) || (axisLabels.y != null || axisLabels.y2 != null);

                    if (axisLabels.x != null)
                        xMax += 18;

                    if (axisLabels.y != null)
                        maxMainYaxisSide += 20;

                    if (axisLabels.y2 != null)
                        maxSecondYaxisSide += 20;

                    this.margin.left = showY1OnRight ? maxSecondYaxisSide : maxMainYaxisSide;
                    this.margin.right = showY1OnRight ? maxMainYaxisSide : maxSecondYaxisSide;
                    this.margin.bottom = xMax;

                    // re-calculate the axes with the new margins
                    var previousTickCountY1 = this.yAxisProperties.values.length;

                    this.calculateAxes(
                        this.categoryAxisProperties,
                        this.valueAxisProperties,
                        EnhancedScatterChart.TextProperties,
                        true);

                    // the minor padding adjustments could have affected the chosen tick values, which would then need to calculate margins again
                    // e.g. [0,2,4,6,8] vs. [0,5,10] the 10 is wider and needs more margin.
                    if (this.yAxisProperties.values.length === previousTickCountY1)
                        doneWithMargins = true;
                }
            }

            this.renderChart(
                mainAxisScale,
                this.xAxisProperties,
                this.yAxisProperties,
                tickLabelMargins,
                chartHasAxisLabels,
                axisLabels,
                suppressAnimations);

            this.updateAxis();

            if (!this.data) {
                return;
            }

            var data: EnhancedScatterChartData = this.data,
                dataPoints: EnhancedScatterChartDataPoint[] = this.data.dataPoints,
                hasSelection: boolean = this.interactivityService && this.interactivityService.hasSelection();

            this.mainGraphicsSVGSelection
                .attr("width", this.viewportIn.width)
                .attr("height", this.viewportIn.height);

            var sortedData: EnhancedScatterChartDataPoint[] = dataPoints.sort((a, b) => {
                return b.radius.sizeMeasure
                    ? (<number>b.radius.sizeMeasure.values[b.radius.index] - <number>a.radius.sizeMeasure.values[a.radius.index])
                    : 0;
            });

            var duration: number = GetAnimationDuration(this.animator, suppressAnimations),
                scatterMarkers: D3.UpdateSelection = this.drawScatterMarkers(sortedData, hasSelection, data.sizeRange, duration),
                dataLabelsSettings: PointDataLabelsSettings = this.data.dataLabelsSettings;

            if (dataLabelsSettings.show) {
                var layout: ILabelLayout,
                    clonedDataPoints: EnhancedScatterChartDataPoint[],
                    labels: D3.UpdateSelection;

                layout = this.getEnhanchedScatterChartLabelLayout(dataLabelsSettings, this.viewportIn, data.sizeRange);

                clonedDataPoints = this.cloneDataPoints(dataPoints);

                //fix bug 3863: drawDefaultLabelsForDataPointChart add to datapoints[xxx].size = object , which causes when
                //category labels is on and Fill Points option off to fill the points when mouse click occures because of default size
                //is set to datapoints.
                labels = dataLabelUtils.drawDefaultLabelsForDataPointChart(
                    clonedDataPoints,
                    this.mainGraphicsG,
                    layout,
                    this.viewportIn);

                if (labels) {
                    labels.attr("transform", (d: EnhancedScatterChartDataPoint) => {
                        var size: ISize = <ISize>d.size,
                            dx: number,
                            dy: number;

                        dx = size.width / EnhancedScatterChart.DataLabelXOffset;
                        dy = size.height / EnhancedScatterChart.DataLabelYOffset;

                        return SVGUtil.translate(dx, dy);
                    });
                }
            }
            else {
                dataLabelUtils.cleanDataLabels(this.mainGraphicsG);
            }

            this.renderCrosshair();

            var behaviorOptions: EnhancedScatterBehaviorOptions;

            if (this.interactivityService) {
                behaviorOptions = {
                    dataPointsSelection: scatterMarkers,
                    data: this.data,
                    plotContext: this.mainGraphicsSVGSelection,
                };
            }

            addTooltip(scatterMarkers, (tooltipEvent: TooltipEvent) => tooltipEvent.data.tooltipInfo);

            SVGUtil.flushAllD3TransitionsIfNeeded(this.options);

            if (this.behavior) {
                var layerBehaviorOptions: any[] = [behaviorOptions];

                if (this.interactivityService) {
                    var cbehaviorOptions: CustomVisualBehaviorOptions = {
                        layerOptions: layerBehaviorOptions,
                        clearCatcher: this.clearCatcher,
                    };

                    this.interactivityService.bind(dataPoints, this.behavior, cbehaviorOptions);
                }
            }
        }

        private cloneDataPoints(dataPoints: EnhancedScatterChartDataPoint[]): EnhancedScatterChartDataPoint[] {
            return dataPoints.map((dataPoint: EnhancedScatterChartDataPoint) => {
                return _.clone(dataPoint);
            });
        }

        private darkenZeroLine(g: D3.Selection): void {
            var zeroTick = g.selectAll("g.tick").filter((data) => data === 0).node();
            if (zeroTick) {
                d3.select(zeroTick).select("line").classed("zero-line", true);
            }
        }

        private getCategoryAxisFill(): Fill {
            if (this.dataView && this.dataView.metadata.objects) {
                var label = this.dataView.metadata.objects["categoryAxis"];
                if (label) {
                    return <Fill>label["axisColor"];
                }
            }
            return { solid: { color: "#333" } };
        }

        private getEnhanchedScatterChartLabelLayout(labelSettings: PointDataLabelsSettings,
            viewport: IViewport,
            sizeRange: NumberRange): ILabelLayout {

            var xScale = this.xAxisProperties.scale;
            var yScale = this.yAxisProperties.scale;
            var fontSizeInPx = fromPoint(labelSettings.fontSize);
            var fontFamily: string = LabelTextProperties.fontFamily;

            return {
                labelText: (d: EnhancedScatterChartDataPoint) => {
                    return getLabelFormattedText({
                        label: d.formattedCategory.getValue(),
                        fontSize: labelSettings.fontSize,
                        maxWidth: viewport.width,
                    });
                },
                labelLayout: {
                    x: (d: EnhancedScatterChartDataPoint) => xScale(d.x),
                    y: (d: EnhancedScatterChartDataPoint) => {
                        var margin = EnhancedScatterChart.getBubbleRadius(d.radius, sizeRange, viewport) + dataLabelUtils.labelMargin;

                        return labelSettings.position === 0 /* Above */
                            ? yScale(d.y) - margin
                            : yScale(d.y) + margin;
                    },
                },
                filter: (d: EnhancedScatterChartDataPoint) => (d != null && d.formattedCategory.getValue() != null),
                style: {
                    "fill": (d: EnhancedScatterChartDataPoint) => d.labelFill,
                    "font-size": fontSizeInPx,
                    "font-family": fontFamily,
                },
            };
        }

        private static getBubbleRadius(
            radiusData: EnhancedScatterChartRadiusData,
            sizeRange: NumberRange,
            viewport: IViewport): number {

            let actualSizeDataRange = null,
                bubblePixelAreaSizeRange = null,
                measureSize = radiusData.sizeMeasure;

            if (!measureSize) {
                return EnhancedScatterChart.BubbleRadius;
            }

            let minSize = sizeRange.min ? sizeRange.min : 0,
                maxSize = sizeRange.max ? sizeRange.max : 0;

            let min = Math.min(minSize, 0),
                max = Math.max(maxSize, 0);

            actualSizeDataRange = {
                minRange: min,
                maxRange: max,
                delta: max - min
            };

            bubblePixelAreaSizeRange = EnhancedScatterChart.getBubblePixelAreaSizeRange(
                viewport,
                EnhancedScatterChart.MinSizeRange,
                EnhancedScatterChart.MaxSizeRange);

            if (measureSize.values) {
                let sizeValue = <number>measureSize.values[radiusData.index];

                if (sizeValue != null) {
                    return EnhancedScatterChart.projectSizeToPixels(
                        sizeValue,
                        actualSizeDataRange,
                        bubblePixelAreaSizeRange) / 2;
                }
            }

            return EnhancedScatterChart.BubbleRadius;
        }

        private static getBubblePixelAreaSizeRange(
            viewPort: IViewport,
            minSizeRange: number,
            maxSizeRange: number): EnhancedScatterDataRange {

            let ratio = 1.0;
            if (viewPort.height > 0 && viewPort.width > 0) {
                let minSize = Math.min(viewPort.height, viewPort.width);
                ratio = (minSize * minSize) / EnhancedScatterChart.AreaOf300By300Chart;
            }

            let minRange: number = Math.round(minSizeRange * ratio),
                maxRange: number = Math.round(maxSizeRange * ratio);

            return {
                minRange: minRange,
                maxRange: maxRange,
                delta: maxRange - minRange
            };
        }

        public static projectSizeToPixels(
            size: number,
            actualSizeDataRange: EnhancedScatterDataRange,
            bubblePixelAreaSizeRange: EnhancedScatterDataRange): number {

            let projectedSize = 0;
            if (actualSizeDataRange) {
                // Project value on the required range of bubble area sizes
                projectedSize = bubblePixelAreaSizeRange.maxRange;
                if (actualSizeDataRange.delta !== 0) {
                    let value = Math.min(Math.max(size, actualSizeDataRange.minRange), actualSizeDataRange.maxRange);

                    projectedSize = EnhancedScatterChart.project(value, actualSizeDataRange, bubblePixelAreaSizeRange);
                }

                projectedSize = Math.sqrt(projectedSize / Math.PI) * 2;
            }

            return Math.round(projectedSize);
        }

        public static project(
            value: number,
            actualSizeDataRange: EnhancedScatterDataRange,
            bubblePixelAreaSizeRange: EnhancedScatterDataRange): number {

            if (actualSizeDataRange.delta === 0 || bubblePixelAreaSizeRange.delta === 0) {
                return (EnhancedScatterChart.rangeContains(actualSizeDataRange, value))
                    ? bubblePixelAreaSizeRange.minRange
                    : null;
            }

            let relativeX = (value - actualSizeDataRange.minRange) / actualSizeDataRange.delta;

            return bubblePixelAreaSizeRange.minRange + relativeX * bubblePixelAreaSizeRange.delta;
        }

        public static rangeContains(range: EnhancedScatterDataRange, value: number): boolean {
            return range.minRange <= value && value <= range.maxRange;
        }

        private getValueAxisFill(): Fill {
            if (this.dataView && this.dataView.metadata.objects) {
                var label = this.dataView.metadata.objects["valueAxis"];

                if (label) {
                    return <Fill>label["axisColor"];
                }
            }

            return { solid: { color: "#333" } };
        }

        /**
         * Public for testability.
         */
        public renderCrosshair(): D3.Selection {
            if (!this.mainGraphicsSVGSelection) {
                return;
            }

            this.crosshairCanvasSelection = this.addCrosshairCanvasToDOM(this.mainGraphicsSVGSelection);

            if (this.data && this.data.crosshair) {
                this.crosshairVerticalLineSelection = this.addCrosshairLineToDOM(
                    this.crosshairCanvasSelection, EnhancedScatterChart.CrosshairVerticalLineSelector);

                this.crosshairHorizontalLineSelection = this.addCrosshairLineToDOM(
                    this.crosshairCanvasSelection, EnhancedScatterChart.CrosshairHorizontalLineSelector);

                this.crosshairTextSelection = this.addCrosshairTextToDOM(this.crosshairCanvasSelection);

                this.bindCrosshairEvents();
            }

            return this.crosshairCanvasSelection;
        }

        /**
         * Public for testability.
         */
        public addCrosshairCanvasToDOM(rootElement: D3.Selection): D3.Selection {
            var crosshairCanvasSelector: ClassAndSelector = EnhancedScatterChart.CrosshairCanvasSelector;

            return this.addElementToDOM(rootElement, {
                name: "g",
                selector: crosshairCanvasSelector.selector,
                className: crosshairCanvasSelector.class,
                styles: { display: "none" }
            });
        }

        /**
         * Public for testability.
         */
        public addCrosshairLineToDOM(rootElement: D3.Selection, elementSelector: ClassAndSelector): D3.Selection {
            var crosshairLineSelector: ClassAndSelector = EnhancedScatterChart.CrosshairLineSelector;

            return this.addElementToDOM(rootElement, {
                name: "line",
                selector: elementSelector.selector,
                className: `${crosshairLineSelector.class} ${elementSelector.class}`,
                attributes: { x1: 0, y1: 0, x2: 0, y2: 0 }
            });
        }

        /**
         * Public for testability.
         */
        public addCrosshairTextToDOM(rootElement: D3.Selection): D3.Selection {
            var crosshairTextSelector: ClassAndSelector = EnhancedScatterChart.CrosshairTextSelector;

            return this.addElementToDOM(rootElement, {
                name: "text",
                selector: crosshairTextSelector.selector,
                className: crosshairTextSelector.class
            });
        }

        /**
         * Public for testability.
         */
        public bindCrosshairEvents(): void {
            if (!this.axisGraphicsContextScrollable) {
                return;
            }

            this.axisGraphicsContextScrollable
                .on("mousemove", () => {
                    var currentTarget: SVGElement = <SVGElement>d3.event.currentTarget,
                        coordinates: number[] = d3.mouse(currentTarget),
                        svgNode: SVGElement = currentTarget.viewportElement,
                        scaledRect: ClientRect = svgNode.getBoundingClientRect(),
                        domRect: SVGRect = (<any>svgNode).getBBox(),
                        ratioX: number = scaledRect.width / domRect.width,
                        ratioY: number = scaledRect.height / domRect.height,
                        x: number = coordinates[0],
                        y: number = coordinates[1];

                    if (domRect.width > 0 && !equalWithPrecision(ratioX, 1.0, 0.00001)) {
                        x = x / ratioX;
                    }

                    if (domRect.height > 0 && !equalWithPrecision(ratioY, 1.0, 0.00001)) {
                        y = y / ratioY;
                    }

                    this.updateCrosshair(x, y);
                })
                .on("mouseover", () => {
                    this.crosshairCanvasSelection.style("display", "block");
                })
                .on("mouseout", () => {
                    this.crosshairCanvasSelection.style("display", "none");
                });
        }

        /**
         * Public for testability.
         */
        public updateCrosshair(x: number, y: number): void {
            if (!this.viewportIn ||
                !this.crosshairHorizontalLineSelection ||
                !this.crosshairVerticalLineSelection ||
                !this.crosshairTextSelection ||
                !this.xAxisProperties) {

                return;
            }

            var crosshairTextMargin: number = EnhancedScatterChart.CrosshairTextMargin,
                xScale = <D3.Scale.LinearScale>this.xAxisProperties.scale,
                yScale = <D3.Scale.LinearScale>this.yAxisProperties.scale,
                xFormated: number,
                yFormated: number;

            this.crosshairHorizontalLineSelection
                .attr({ x1: 0, y1: y, x2: this.viewportIn.width, y2: y });

            this.crosshairVerticalLineSelection
                .attr({ x1: x, y1: 0, x2: x, y2: this.viewportIn.height });

            xFormated = Math.round(xScale.invert(x) * 100) / 100;
            yFormated = Math.round(yScale.invert(y) * 100) / 100;

            this.crosshairTextSelection
                .attr({ x: x + crosshairTextMargin, y: y - crosshairTextMargin })
                .text(`(${xFormated}, ${yFormated})`);
        }

        /**
         * Public for testability.
         */
        public addElementToDOM(rootElement: D3.Selection, properties: ElementProperties): D3.Selection {
            if (!rootElement || !properties) {
                return null;
            }

            var elementSelection: D3.Selection,
                elementUpdateSelection: D3.UpdateSelection;

            elementSelection = rootElement
                .selectAll(properties.selector);

            elementUpdateSelection = elementSelection.data(properties.data || [[]]);

            elementUpdateSelection
                .enter()
                .append(properties.name)
                .attr(properties.attributes)
                .style(properties.styles)
                .classed(properties.className, true);

            elementUpdateSelection
                .exit()
                .remove();

            return elementUpdateSelection;
        }

        private renderBackground() {
            if (this.data.backdrop && this.data.backdrop.show && (this.data.backdrop.url !== undefined)) {
                this.backgroundGraphicsContext
                    .attr("xlink:href", this.data.backdrop.url)
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", this.viewportIn.width)
                    .attr("height", this.viewportIn.height);
            } else {
                this.backgroundGraphicsContext
                    .attr("width", 0)
                    .attr("height", 0);
            }
        }

        private renderChart(
            mainAxisScale: any,
            xAxis: IAxisProperties,
            yAxis: IAxisProperties,
            tickLabelMargins: any,
            chartHasAxisLabels: boolean,
            axisLabels: ChartAxesLabels,
            suppressAnimations: boolean,
            scrollScale?: any,
            extent?: number[]) {

            var bottomMarginLimit: number = this.bottomMarginLimit,
                leftRightMarginLimit: number = this.leftRightMarginLimit,
                duration: number = GetAnimationDuration(this.animator, suppressAnimations);

            this.renderBackground();

            //hide show x-axis here
            if (this.shouldRenderAxis(xAxis)) {
                xAxis.axis.orient("bottom");
                if (!xAxis.willLabelsFit)
                    xAxis.axis.tickPadding(5);

                var xAxisGraphicsElement = this.xAxisGraphicsContext;
                if (duration) {
                    xAxisGraphicsElement
                        .transition()
                        .duration(duration)
                        .call(xAxis.axis)
                        .call(this.darkenZeroLine);
                }
                else {
                    xAxisGraphicsElement
                        .call(xAxis.axis)
                        .call(this.darkenZeroLine);
                }

                var xZeroTick: D3.UpdateSelection = xAxisGraphicsElement
                    .selectAll("g.tick")
                    .filter((data) => data === 0);

                if (xZeroTick) {
                    var xZeroColor: Fill = this.getValueAxisFill();

                    if (xZeroColor) {
                        xZeroTick
                            .selectAll("line")
                            .style({ "stroke": xZeroColor.solid.color });
                    }
                }

                var xAxisTextNodes: D3.Selection = xAxisGraphicsElement.selectAll("text");

                if (xAxis.willLabelsWordBreak) {
                    xAxisTextNodes.call(
                        AxisHelper.LabelLayoutStrategy.wordBreak,
                        xAxis,
                        bottomMarginLimit);
                } else {
                    xAxisTextNodes.call(
                        AxisHelper.LabelLayoutStrategy.rotate,
                        bottomMarginLimit,
                        getTailoredTextOrDefault,
                        EnhancedScatterChart.TextProperties,
                        !xAxis.willLabelsFit,
                        bottomMarginLimit === tickLabelMargins.xMax,
                        xAxis,
                        this.margin,
                        this.isXScrollBarVisible || this.isYScrollBarVisible);
                }
            }
            else {
                this.xAxisGraphicsContext.selectAll("*").remove();
            }

            if (this.shouldRenderAxis(yAxis)) {
                var yAxisOrientation = this.yAxisOrientation;

                yAxis.axis
                    .tickSize(-this.viewportIn.width)
                    .tickPadding(10)
                    .orient(yAxisOrientation.toLowerCase());

                var y1AxisGraphicsElement = this.y1AxisGraphicsContext;
                if (duration) {
                    y1AxisGraphicsElement
                        .transition()
                        .duration(duration)
                        .call(yAxis.axis)
                        .call(this.darkenZeroLine);
                }
                else {
                    y1AxisGraphicsElement
                        .call(yAxis.axis)
                        .call(this.darkenZeroLine);
                }

                var yZeroTick = y1AxisGraphicsElement.selectAll("g.tick").filter((data) => data === 0);
                if (yZeroTick) {
                    var yZeroColor = this.getCategoryAxisFill();
                    if (yZeroColor) {
                        yZeroTick.selectAll("line").style({ "stroke": yZeroColor.solid.color });
                    }
                }

                if (tickLabelMargins.yLeft >= leftRightMarginLimit) {
                    y1AxisGraphicsElement.selectAll("text")
                        .call(AxisHelper.LabelLayoutStrategy.clip,
                        // Can"t use padding space to render text, so subtract that from available space for ellipses calculations
                        leftRightMarginLimit - 10,
                        svgEllipsis);
                }

                // TODO: clip (svgEllipsis) the Y2 labels
            }
            else {
                this.y1AxisGraphicsContext.selectAll("*").remove();
            }
            // Axis labels
            //TODO: Add label for second Y axis for combo chart
            if (chartHasAxisLabels) {
                var hideXAxisTitle = !this.shouldRenderAxis(xAxis, "showAxisTitle");
                var hideYAxisTitle = !this.shouldRenderAxis(yAxis, "showAxisTitle");
                var hideY2AxisTitle = this.valueAxisProperties && this.valueAxisProperties["secShowAxisTitle"] != null && this.valueAxisProperties["secShowAxisTitle"] === false;

                this.renderAxesLabels(axisLabels, this.legendViewport.height, hideXAxisTitle, hideYAxisTitle, hideY2AxisTitle);
            }
            else {
                this.axisGraphicsContext.selectAll(".xAxisLabel").remove();
                this.axisGraphicsContext.selectAll(".yAxisLabel").remove();
            }
        }

        private renderAxesLabels(axisLabels: ChartAxesLabels, legendMargin: number, hideXAxisTitle: boolean, hideYAxisTitle: boolean, hideY2AxisTitle: boolean): void {
            this.axisGraphicsContext.selectAll(".xAxisLabel").remove();
            this.axisGraphicsContext.selectAll(".yAxisLabel").remove();

            var margin = this.margin;
            var width = this.viewportIn.width;
            var height = this.viewport.height;
            var fontSize = EnhancedScatterChart.AxisFontSize;
            var yAxisOrientation = this.yAxisOrientation;
            var showY1OnRight = yAxisOrientation === yAxisPosition.right;

            if (!hideXAxisTitle) {
                var xAxisLabel = this.axisGraphicsContext.append("text")
                    .style("text-anchor", "middle")
                    .text(axisLabels.x)
                    .call((text: D3.Selection) => {
                        text.each(function () {
                            var text = d3.select(this);
                            text.attr({
                                "class": "xAxisLabel",
                                "transform": SVGUtil.translate(width / 2, height - fontSize - 2)
                            });
                        });
                    });

                xAxisLabel.call(AxisHelper.LabelLayoutStrategy.clip,
                    width,
                    svgEllipsis);
            }

            if (!hideYAxisTitle) {
                var yAxisLabel = this.axisGraphicsContext.append("text")
                    .style("text-anchor", "middle")
                    .text(axisLabels.y)
                    .call((text: D3.Selection) => {
                        text.each(function () {
                            var text = d3.select(this);
                            text.attr({
                                "class": "yAxisLabel",
                                "transform": "rotate(-90)",
                                "y": showY1OnRight ? width + margin.right - fontSize : -margin.left,
                                "x": -((height - margin.top - legendMargin) / 2),
                                "dy": "1em"
                            });
                        });
                    });

                yAxisLabel.call(
                    AxisHelper.LabelLayoutStrategy.clip,
                    height - (margin.bottom + margin.top),
                    svgEllipsis);
            }

            if (!hideY2AxisTitle && axisLabels.y2) {
                var y2AxisLabel = this.axisGraphicsContext.append("text")
                    .style("text-anchor", "middle")
                    .text(axisLabels.y2)
                    .call((text: D3.Selection) => {
                        text.each(function () {
                            var text = d3.select(this);
                            text.attr({
                                "class": "yAxisLabel",
                                "transform": "rotate(-90)",
                                "y": showY1OnRight ? -margin.left : width + margin.right - fontSize,
                                "x": -((height - margin.top - legendMargin) / 2),
                                "dy": "1em"
                            });
                        });
                    });

                y2AxisLabel.call(
                    AxisHelper.LabelLayoutStrategy.clip,
                    height - (margin.bottom + margin.top),
                    svgEllipsis);
            }
        }

        private updateAxis(): void {
            this.adjustMargins();

            var yAxisOrientation = this.yAxisOrientation;
            var showY1OnRight = yAxisOrientation === yAxisPosition.right;

            this.xAxisGraphicsContext
                .attr("transform", SVGUtil.translate(0, this.viewportIn.height));

            this.y1AxisGraphicsContext
                .attr("transform", SVGUtil.translate(showY1OnRight ? this.viewportIn.width : 0, 0));

            this.svg.attr({
                "width": this.viewport.width,
                "height": this.viewport.height
            });

            this.svgScrollable.attr({
                "width": this.viewport.width,
                "height": this.viewport.height
            });

            this.svgScrollable.attr({
                "x": 0
            });

            var left: number = this.margin.left;
            var top: number = this.margin.top;

            this.axisGraphicsContext.attr("transform", SVGUtil.translate(left, top));
            this.axisGraphicsContextScrollable.attr("transform", SVGUtil.translate(left, top));
            this.clearCatcher.attr("transform", SVGUtil.translate(-left, -top));

            if (this.isXScrollBarVisible) {
                this.svgScrollable.attr({
                    "x": left
                });
                this.axisGraphicsContextScrollable.attr("transform", SVGUtil.translate(0, top));
                this.svgScrollable.attr("width", this.viewportIn.width);
                this.svg.attr("width", this.viewport.width)
                    .attr("height", this.viewport.height + this.ScrollBarWidth);
            }
            else if (this.isYScrollBarVisible) {
                this.svgScrollable.attr("height", this.viewportIn.height + top);
                this.svg.attr("width", this.viewport.width + this.ScrollBarWidth)
                    .attr("height", this.viewport.height);
            }
        }

        private getUnitType(xAxis: IAxisProperties) {
            if (xAxis.formatter &&
                xAxis.formatter.displayUnit &&
                xAxis.formatter.displayUnit.value > 1)
                return xAxis.formatter.displayUnit.title;
            return null;
        }

        private addUnitTypeToAxisLabel(xAxis: IAxisProperties, yAxis: IAxisProperties): void {
            var unitType = this.getUnitType(xAxis);
            if (xAxis.isCategoryAxis) {
                this.categoryAxisHasUnitType = unitType !== null;
            }
            else {
                this.valueAxisHasUnitType = unitType !== null;
            }

            if (xAxis.axisLabel && unitType) {
                if (xAxis.isCategoryAxis) {
                    xAxis.axisLabel = AxisHelper.createAxisLabel(this.categoryAxisProperties, xAxis.axisLabel, unitType);
                }
                else {
                    xAxis.axisLabel = AxisHelper.createAxisLabel(this.valueAxisProperties, xAxis.axisLabel, unitType);
                }
            }

            unitType = this.getUnitType(yAxis);

            if (!yAxis.isCategoryAxis) {
                this.valueAxisHasUnitType = unitType !== null;
            }
            else {
                this.categoryAxisHasUnitType = unitType !== null;
            }

            if (yAxis.axisLabel && unitType) {
                if (!yAxis.isCategoryAxis) {
                    yAxis.axisLabel = AxisHelper.createAxisLabel(this.valueAxisProperties, yAxis.axisLabel, unitType);
                }
                else {
                    yAxis.axisLabel = AxisHelper.createAxisLabel(this.categoryAxisProperties, yAxis.axisLabel, unitType);
                }
            }
        }

        private drawScatterMarkers(
            scatterData: EnhancedScatterChartDataPoint[],
            hasSelection: boolean,
            sizeRange: NumberRange,
            duration: number): D3.UpdateSelection {

            var xScale = this.xAxisProperties.scale,
                yScale = this.yAxisProperties.scale,
                shouldEnableFill = (!sizeRange || !sizeRange.min) && this.data.fillPoint;

            var markers: D3.UpdateSelection,
                useCustomColor = this.data.useCustomColor;

            if (!this.data.useShape) {
                this.mainGraphicsContext
                    .selectAll(EnhancedScatterChart.ImageClasses.selector)
                    .remove();

                markers = this.mainGraphicsContext
                    .classed("ScatterMarkers", true)
                    .selectAll(EnhancedScatterChart.DotClasses.selector)
                    .data(scatterData, (d: EnhancedScatterChartDataPoint) => d.identity.getKey());

                markers
                    .enter()
                    .append("path")
                    .classed(EnhancedScatterChart.DotClasses.class, true)
                    .attr("id", "markershape");

                markers
                    .style({
                        "stroke-opacity": (d: EnhancedScatterChartDataPoint) => {
                            return EnhancedScatterChart.getBubbleOpacity(d, hasSelection);
                        },
                        "stroke-width": "1px",
                        "stroke": (d: EnhancedScatterChartDataPoint) => {
                            var color = useCustomColor ? d.colorFill : d.fill;
                            if (this.data.outline) {
                                return d3.rgb(color).darker();
                            } else {
                                return d3.rgb(color);
                            }
                        },
                        "fill": (d: EnhancedScatterChartDataPoint) => d3.rgb(useCustomColor ? d.colorFill : d.fill),
                        "fill-opacity": (d: EnhancedScatterChartDataPoint) => (d.size != null || shouldEnableFill)
                            ? EnhancedScatterChart.getBubbleOpacity(d, hasSelection) : 0,
                    })
                    .attr("d", (d: EnhancedScatterChartDataPoint) => {
                        var r: number = EnhancedScatterChart.getBubbleRadius(d.radius, sizeRange, this.viewport),
                            area: number = 4 * r * r;

                        return d.shapeSymbolType(area);
                    })
                    .transition()
                    .duration((d) => {
                        if (this.keyArray.indexOf(d.identity.getKey()) >= 0) {
                            return duration;
                        } else {
                            return 0;
                        }
                    })
                    .attr("transform", function (d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ") rotate(" + d.rotation + ")"; });
            } else {
                this.mainGraphicsContext
                    .selectAll(EnhancedScatterChart.DotClasses.selector)
                    .remove();

                markers = this.mainGraphicsContext
                    .classed("ScatterMarkers", true)
                    .selectAll(EnhancedScatterChart.ImageClasses.selector)
                    .data(scatterData, (d: EnhancedScatterChartDataPoint) => d.identity.getKey());

                markers
                    .enter()
                    .append("svg:image")
                    .classed(EnhancedScatterChart.ImageClasses.class, true)
                    .attr("id", "markerimage");

                markers
                    .attr("xlink:href", (d) => {
                        if (d.svgurl !== undefined && d.svgurl != null && d.svgurl !== "") {
                            return d.svgurl;
                        } else {
                            return this.svgDefaultImage;
                        }
                    })
                    .attr("width", (d) => {
                        return EnhancedScatterChart.getBubbleRadius(d.radius, sizeRange, this.viewport) * 2;
                    })
                    .attr("height", (d) => {
                        return EnhancedScatterChart.getBubbleRadius(d.radius, sizeRange, this.viewport) * 2;
                    })
                    .transition()
                    .duration((d) => {
                        if (this.keyArray.indexOf(d.identity.getKey()) >= 0) {
                            return duration;
                        } else {
                            return 0;
                        }
                    })
                    .attr("transform", (d) => {
                        var radius: number = EnhancedScatterChart.getBubbleRadius(d.radius, sizeRange, this.viewport);

                        return "translate(" + (xScale(d.x) - radius) + "," + (yScale(d.y) - radius) + ") rotate(" + d.rotation + "," + radius + "," + radius + ")";
                    });
            }

            markers.exit().remove();
            this.keyArray = [];
            for (var i = 0; i < scatterData.length; i++) {
                this.keyArray.push(scatterData[i].identity.getKey());
            }

            return markers;
        }

        public static getBubbleOpacity(d: EnhancedScatterChartDataPoint, hasSelection: boolean): number {
            if (hasSelection && !d.selected) {
                return EnhancedScatterChart.DimmedBubbleOpacity;
            }
            return EnhancedScatterChart.DefaultBubbleOpacity;
        }

        public calculateAxes(
            categoryAxisProperties: DataViewObject,
            valueAxisProperties: DataViewObject,
            textProperties: TextProperties,
            scrollbarVisible: boolean): IAxisProperties[] {

            var visualOptions: CalculateScaleAndDomainOptions = {
                viewport: this.viewport,
                margin: this.margin,
                forcedXDomain: [categoryAxisProperties ? categoryAxisProperties["start"] : null, categoryAxisProperties ? categoryAxisProperties["end"] : null],
                forceMerge: valueAxisProperties && valueAxisProperties["secShow"] === false,
                showCategoryAxisLabel: false,
                showValueAxisLabel: false,
                categoryAxisScaleType: categoryAxisProperties && categoryAxisProperties["axisScale"] != null ? <string>categoryAxisProperties["axisScale"] : null,
                valueAxisScaleType: valueAxisProperties && valueAxisProperties["axisScale"] != null ? <string>valueAxisProperties["axisScale"] : null,
                valueAxisDisplayUnits: valueAxisProperties && valueAxisProperties["labelDisplayUnits"] != null ? <number>valueAxisProperties["labelDisplayUnits"] : EnhancedScatterChart.LabelDisplayUnitsDefault,
                categoryAxisDisplayUnits: categoryAxisProperties && categoryAxisProperties["labelDisplayUnits"] != null ? <number>categoryAxisProperties["labelDisplayUnits"] : EnhancedScatterChart.LabelDisplayUnitsDefault,
                trimOrdinalDataOnOverflow: false
            };

            if (valueAxisProperties) {
                visualOptions.forcedYDomain = AxisHelper.applyCustomizedDomain(
                    [valueAxisProperties["start"], valueAxisProperties["end"]],
                    visualOptions.forcedYDomain);
            }

            visualOptions.showCategoryAxisLabel = (!!categoryAxisProperties && !!categoryAxisProperties["showAxisTitle"]);

            visualOptions.showValueAxisLabel = true;

            var width = this.viewport.width - (this.margin.left + this.margin.right);

            var axes = this.calculateAxesProperties(visualOptions);

            axes[0].willLabelsFit = AxisHelper.LabelLayoutStrategy.willLabelsFit(
                axes[0],
                width,
                measureSvgTextWidth,
                textProperties);

            // If labels do not fit and we are not scrolling, try word breaking
            axes[0].willLabelsWordBreak = (!axes[0].willLabelsFit && !scrollbarVisible) && AxisHelper.LabelLayoutStrategy.willLabelsWordBreak(
                axes[0],
                this.margin,
                width,
                measureSvgTextWidth,
                estimateSvgTextHeight,
                getTailoredTextOrDefault,
                textProperties);

            return axes;
        }

        public calculateAxesProperties(options: CalculateScaleAndDomainOptions): IAxisProperties[] {
            var data: EnhancedScatterChartData = this.data,
                dataPoints: EnhancedScatterChartDataPoint[] = data.dataPoints;

            this.margin = options.margin;
            this.viewport = options.viewport;

            var minY: number = 0,
                maxY: number = 10,
                minX: number = 0,
                maxX: number = 10;

            if (dataPoints.length > 0) {
                minY = d3.min<EnhancedScatterChartDataPoint, number>(dataPoints, d => d.y);
                maxY = d3.max<EnhancedScatterChartDataPoint, number>(dataPoints, d => d.y);
                minX = d3.min<EnhancedScatterChartDataPoint, number>(dataPoints, d => d.x);
                maxX = d3.max<EnhancedScatterChartDataPoint, number>(dataPoints, d => d.x);
            }

            var xDomain: number[] = [minX, maxX],
                combinedXDomain: number[],
                combinedYDomain: number[],
                xAxisFormatString: string,
                yAxisFormatString: string;

            combinedXDomain = AxisHelper.combineDomain(
                this.optimizeTranslateValues(options.forcedXDomain), xDomain);

            xAxisFormatString = valueFormatter.getFormatString(
                data.xCol,
                EnhancedScatterChart.Properties["general"]["formatString"]);

            this.xAxisProperties = AxisHelper.createAxis({
                pixelSpan: this.viewportIn.width,
                dataDomain: combinedXDomain,
                metaDataColumn: data.xCol,
                formatString: xAxisFormatString,
                outerPadding: 0,
                isScalar: true,
                isVertical: false,
                forcedTickCount: options.forcedTickCount,
                useTickIntervalForDisplayUnits: true,
                isCategoryAxis: true, //scatter doesn"t have a categorical axis, but this is needed for the pane to react correctly to the x-axis toggle one/off
                scaleType: options.categoryAxisScaleType,
                axisDisplayUnits: options.categoryAxisDisplayUnits
            });

            this.xAxisProperties.axis.tickSize(-this.viewportIn.height, 0);
            this.xAxisProperties.axisLabel = this.data.axesLabels.x;

            combinedYDomain = AxisHelper.combineDomain(
                this.optimizeTranslateValues(options.forcedYDomain), [minY, maxY]);

            yAxisFormatString = valueFormatter.getFormatString(
                data.yCol,
                EnhancedScatterChart.Properties["general"]["formatString"]);

            this.yAxisProperties = AxisHelper.createAxis({
                pixelSpan: this.viewportIn.height,
                dataDomain: combinedYDomain,
                metaDataColumn: data.yCol,
                formatString: yAxisFormatString,
                outerPadding: 0,
                isScalar: true,
                isVertical: true,
                forcedTickCount: options.forcedTickCount,
                useTickIntervalForDisplayUnits: true,
                isCategoryAxis: false,
                scaleType: options.valueAxisScaleType,
                axisDisplayUnits: options.valueAxisDisplayUnits
            });

            this.yAxisProperties.axisLabel = this.data.axesLabels.y;

            return [this.xAxisProperties, this.yAxisProperties];
        }

        /**
         * Public for testability.
         */
        public optimizeTranslateValues(values: number[]): number[] {
            if (values && values.map) {
                return values.map((value: number) => {
                    return this.optimizeTranslateValue(value);
                });
            }

            return values;
        }

        /**
         * Public for testability.
         */
        public optimizeTranslateValue(value: number): number {
            if (value) {
                var numberSign: number = value >= 0 ? 1 : -1,
                    absoluteValue: number = Math.abs(value);

                if (absoluteValue > EnhancedScatterChart.MaxTranslateValue) {
                    return EnhancedScatterChart.MaxTranslateValue * numberSign;
                } else if (absoluteValue < EnhancedScatterChart.MinTranslateValue) {
                    return EnhancedScatterChart.MinTranslateValue * numberSign;
                }
            }

            return value;
        }

        private enumerateDataPoints(enumeration: ObjectEnumerationBuilder): void {
            var data = this.data;
            if (!data)
                return;

            var seriesCount = data.dataPoints.length;

            if (!data.hasDynamicSeries) {
                var showAllDataPoints: boolean = data.showAllDataPoints;

                // Add default color and show all slices
                enumeration.pushInstance({
                    objectName: "dataPoint",
                    selector: null,
                    properties: {
                        defaultColor: {
                            solid: { color: data.defaultDataPointColor || this.colors.getColorByIndex(0).value }
                        }
                    }
                }).pushInstance({
                    objectName: "dataPoint",
                    selector: null,
                    properties: { showAllDataPoints: showAllDataPoints }
                });

                if (showAllDataPoints) {
                    for (var i = 0; i < seriesCount; i++) {
                        var seriesDataPoints = data.dataPoints[i];
                        enumeration.pushInstance({
                            objectName: "dataPoint",
                            displayName: seriesDataPoints.formattedCategory.getValue(),
                            selector: ColorHelper.normalizeSelector(seriesDataPoints.identity.getSelector(), /*isSingleSeries*/ true),
                            properties: {
                                fill: { solid: { color: seriesDataPoints.fill } }
                            },
                        });
                    }
                }
            }
            else {
                var legendDataPointLength = data.legendData.dataPoints.length;
                for (var i = 0; i < legendDataPointLength; i++) {
                    var series = data.legendData.dataPoints[i];
                    enumeration.pushInstance({
                        objectName: "dataPoint",
                        displayName: series.label,
                        selector: ColorHelper.normalizeSelector(series.identity.getSelector()),
                        properties: {
                            fill: { solid: { color: series.color } }
                        },
                    });
                }
            }
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            var enumeration = new ObjectEnumerationBuilder();

            switch (options.objectName) {
                case "dataPoint":
                    var categoricalDataView: DataViewCategorical = this.dataView && this.dataView.categorical ? this.dataView.categorical : null;
                    if (!GradientUtils.hasGradientRole(categoricalDataView))
                        this.enumerateDataPoints(enumeration);
                    break;
                case "categoryAxis":
                    this.getCategoryAxisValues(enumeration);
                    break;
                case "valueAxis":
                    this.getValueAxisValues(enumeration);
                    break;
                case "categoryLabels":
                    if (this.data)
                        dataLabelUtils.enumerateCategoryLabels(enumeration, this.data.dataLabelsSettings, true);
                    else
                        dataLabelUtils.enumerateCategoryLabels(enumeration, null, true);
                    break;
                case "fillPoint":
                    var sizeRange = this.data.sizeRange;
                    // Check if the card should be shown or not
                    if (sizeRange && sizeRange.min)
                        break;

                    enumeration.pushInstance({
                        objectName: "fillPoint",
                        selector: null,
                        properties: {
                            show: this.data.fillPoint,
                        },
                    });
                    break;
                case "backdrop":
                    enumeration.pushInstance({
                        objectName: "backdrop",
                        displayName: "Backdrop",
                        selector: null,
                        properties: {
                            show: this.data.backdrop ? this.data.backdrop.show : false,
                            url: this.data.backdrop ? this.data.backdrop.url : null
                        },
                    });
                    break;
                case "crosshair":
                    enumeration.pushInstance({
                        objectName: "crosshair",
                        selector: null,
                        properties: {
                            show: this.data.crosshair
                        },
                    });
                    break;
                case "outline":
                    enumeration.pushInstance({
                        objectName: "outline",
                        selector: null,
                        properties: {
                            show: this.data.outline
                        },
                    });
                    break;
                case "legend":
                    this.enumerateLegend(enumeration);
                    break;
            }
            return enumeration.complete();
        }

        public hasLegend(): boolean {
            return this.data && this.data.hasDynamicSeries;
        }

        private enumerateLegend(enumeration: ObjectEnumerationBuilder): void {
            if (!this.hasLegend()) {
                return;
            }

            var show: boolean = DataViewObject.getValue<boolean>(
                this.legendObjectProperties,
                legendProps.show,
                this.legend.isVisible());

            var showTitle: boolean = DataViewObject.getValue<boolean>(
                this.legendObjectProperties,
                legendProps.showTitle,
                true);

            var titleText: string = DataViewObject.getValue<string>(
                this.legendObjectProperties,
                legendProps.titleText,
                this.layerLegendData ? this.layerLegendData.title : "");

            var legendLabelColor: string = DataViewObject.getValue<string>(
                this.legendObjectProperties,
                legendProps.labelColor,
                LegendData.DefaultLegendLabelFillColor);

            this.legendLabelFontSize = DataViewObject.getValue<number>(
                this.legendObjectProperties,
                legendProps.fontSize,
                EnhancedScatterChart.LegendLabelFontSizeDefault);

            var position: string = DataViewObject.getValue<string>(
                this.legendObjectProperties,
                legendProps.position,
                legendPosition.top);

            enumeration.pushInstance({
                selector: null,
                properties: {
                    show: show,
                    position: position,
                    showTitle: showTitle,
                    titleText: titleText,
                    labelColor: legendLabelColor,
                    fontSize: this.legendLabelFontSize,
                },
                objectName: "legend"
            });
        }

        private getCategoryAxisValues(enumeration: ObjectEnumerationBuilder): void {
            var supportedType = axisType.both,
                isScalar = true,
                logPossible = false,
                scaleOptions = [
                    axisScale.log,
                    axisScale.linear
                ];//until options can be update in propPane, show all options

            if (!isScalar) {
                if (this.categoryAxisProperties) {
                    this.categoryAxisProperties["start"] = null;
                    this.categoryAxisProperties["end"] = null;
                }
            }

            var instance: VisualObjectInstance = {
                selector: null,
                properties: {},
                objectName: "categoryAxis",
                validValues: {
                    axisScale: scaleOptions
                }
            };

            instance.properties["show"] = this.categoryAxisProperties && this.categoryAxisProperties["show"] != null ? this.categoryAxisProperties["show"] : true;
            if (this.yAxisIsCategorical)//in case of e.g. barChart
                instance.properties["position"] = this.valueAxisProperties && this.valueAxisProperties["position"] != null ? this.valueAxisProperties["position"] : yAxisPosition.left;
            if (supportedType === axisType.both) {
                instance.properties["axisType"] = isScalar ? axisType.scalar : axisType.categorical;
            }
            if (isScalar) {
                instance.properties["axisScale"] = (this.categoryAxisProperties && this.categoryAxisProperties["axisScale"] != null && logPossible) ? this.categoryAxisProperties["axisScale"] : axisScale.linear;
                instance.properties["start"] = this.categoryAxisProperties ? this.categoryAxisProperties["start"] : null;
                instance.properties["end"] = this.categoryAxisProperties ? this.categoryAxisProperties["end"] : null;
                instance.properties["labelDisplayUnits"] = this.categoryAxisProperties && this.categoryAxisProperties["labelDisplayUnits"] != null ? this.categoryAxisProperties["labelDisplayUnits"] : EnhancedScatterChart.LabelDisplayUnitsDefault;
            }
            instance.properties["showAxisTitle"] = this.categoryAxisProperties && this.categoryAxisProperties["showAxisTitle"] != null ? this.categoryAxisProperties["showAxisTitle"] : true;

            enumeration
                .pushInstance(instance)
                .pushInstance({
                    selector: null,
                    properties: {
                        axisStyle: this.categoryAxisProperties && this.categoryAxisProperties["axisStyle"]
                            ? this.categoryAxisProperties["axisStyle"] : axisStyle.showTitleOnly,
                        labelColor: this.categoryAxisProperties ? this.categoryAxisProperties["labelColor"] : null
                    },
                    objectName: "categoryAxis",
                    validValues: {
                        axisStyle: this.categoryAxisHasUnitType
                            ? [axisStyle.showTitleOnly, axisStyle.showUnitOnly, axisStyle.showBoth]
                            : [axisStyle.showTitleOnly]
                    }
                });
        }

        //todo: wrap all these object getters and other related stuff into an interface
        private getValueAxisValues(enumeration: ObjectEnumerationBuilder): void {
            var scaleOptions = [axisScale.log, axisScale.linear];  //until options can be update in propPane, show all options
            var logPossible = false;

            var instance: VisualObjectInstance = {
                selector: null,
                properties: {},
                objectName: "valueAxis",
                validValues: {
                    axisScale: scaleOptions,
                    secAxisScale: scaleOptions
                }
            };

            instance.properties["show"] = this.valueAxisProperties && this.valueAxisProperties["show"] != null ? this.valueAxisProperties["show"] : true;

            if (!this.yAxisIsCategorical) {
                instance.properties["position"] = this.valueAxisProperties && this.valueAxisProperties["position"] != null ? this.valueAxisProperties["position"] : yAxisPosition.left;
            }
            instance.properties["axisScale"] = (this.valueAxisProperties && this.valueAxisProperties["axisScale"] != null && logPossible) ? this.valueAxisProperties["axisScale"] : axisScale.linear;
            instance.properties["start"] = this.valueAxisProperties ? this.valueAxisProperties["start"] : null;
            instance.properties["end"] = this.valueAxisProperties ? this.valueAxisProperties["end"] : null;
            instance.properties["showAxisTitle"] = this.valueAxisProperties && this.valueAxisProperties["showAxisTitle"] != null ? this.valueAxisProperties["showAxisTitle"] : true;
            instance.properties["labelDisplayUnits"] = this.valueAxisProperties && this.valueAxisProperties["labelDisplayUnits"] != null ? this.valueAxisProperties["labelDisplayUnits"] : EnhancedScatterChart.LabelDisplayUnitsDefault;

            enumeration
                .pushInstance(instance)
                .pushInstance({
                    selector: null,
                    properties: {
                        axisStyle: this.valueAxisProperties && this.valueAxisProperties["axisStyle"] != null ? this.valueAxisProperties["axisStyle"] : axisStyle.showTitleOnly,
                        labelColor: this.valueAxisProperties ? this.valueAxisProperties["labelColor"] : null
                    },
                    objectName: "valueAxis",
                    validValues: {
                        axisStyle: this.valueAxisHasUnitType ? [axisStyle.showTitleOnly, axisStyle.showUnitOnly, axisStyle.showBoth] : [axisStyle.showTitleOnly]
                    },
                });
        }

        public onClearSelection(): void {
            if (this.interactivityService)
                this.interactivityService.clearSelection();
        }
    }

    export interface CustomVisualBehaviorOptions {
        layerOptions: any[];
        clearCatcher: D3.Selection;
    }

    export class CustomVisualBehavior implements IInteractiveBehavior {
        private behaviors: IInteractiveBehavior[];

        constructor(behaviors: IInteractiveBehavior[]) {
            this.behaviors = behaviors || [];
        }

        public bindEvents(options: CustomVisualBehaviorOptions, selectionHandler: ISelectionHandler): void {
            let behaviors: IInteractiveBehavior[] = this.behaviors;

            for (let i = 0, ilen = behaviors.length; i < ilen; i++) {
                behaviors[i].bindEvents(options.layerOptions[i], selectionHandler);
            }

            options.clearCatcher.on("click", () => {
                selectionHandler.handleClearSelection();
            });
        }

        public renderSelection(hasSelection: boolean) {
            for (let behavior of this.behaviors) {
                behavior.renderSelection(hasSelection);
            }
        }
    }

    export interface EnhancedScatterBehaviorOptions {
        dataPointsSelection: D3.Selection;
        data: EnhancedScatterChartData;
        plotContext: D3.Selection;
    }

    export class EnhancedScatterChartWebBehavior implements IInteractiveBehavior {
        private dimmedBubbleOpacity: number;
        private defaultBubbleOpacity: number;

        private bubbles: D3.Selection;
        private shouldEnableFill: boolean;
        private colorBorder: boolean;

        constructor(dimmedBubbleOpacity: number, defaultBubbleOpacity: number) {
            this.dimmedBubbleOpacity = dimmedBubbleOpacity;
            this.defaultBubbleOpacity = defaultBubbleOpacity;
        }

        public bindEvents(options: EnhancedScatterBehaviorOptions, selectionHandler: ISelectionHandler): void {
            let bubbles: D3.Selection = this.bubbles = options.dataPointsSelection,
                data: EnhancedScatterChartData = options.data;

            this.shouldEnableFill = (!data.sizeRange || !data.sizeRange.min) && data.fillPoint;
            this.colorBorder = data.colorBorder;

            registerStandardInteractivityHandlers(bubbles, selectionHandler);
        }

        public renderSelection(hasSelection: boolean) {
            let shouldEnableFill: boolean = this.shouldEnableFill,
                colorBorder: boolean = this.colorBorder;

            this.bubbles.style("fill-opacity", (d: EnhancedScatterChartDataPoint) => {
                return this.getMarkerFillOpacity(d.size != null, shouldEnableFill, hasSelection, d.selected);
            });

            this.bubbles.style("stroke-opacity", (d: EnhancedScatterChartDataPoint) => {
                return this.getMarkerStrokeOpacity(d.size != null, colorBorder, hasSelection, d.selected);
            });
        }

        private getMarkerFillOpacity(
            hasSize: boolean,
            shouldEnableFill: boolean,
            hasSelection: boolean,
            isSelected: boolean): number {

            if (hasSize || shouldEnableFill) {
                if (hasSelection && !isSelected) {
                    return this.dimmedBubbleOpacity;
                }

                return this.defaultBubbleOpacity;
            } else {
                return 0;
            }
        }

        public getMarkerStrokeOpacity(
            hasSize: boolean,
            colorBorder: boolean,
            hasSelection: boolean,
            isSelected: boolean): number {

            if (hasSize && colorBorder) {
                return 1;
            } else {
                if (hasSelection && !isSelected) {
                    return this.dimmedBubbleOpacity;
                }

                return this.defaultBubbleOpacity;
            }
        }
    }
}
