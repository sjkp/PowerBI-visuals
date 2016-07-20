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
    import getAnimationDuration = powerbi.visuals.AnimatorCommon.GetAnimationDuration;
    import CreateClassAndSelector = jsCommon.CssConstants.createClassAndSelector;
    import AxisScale = powerbi.visuals.axisScale;
    import PixelConverter = jsCommon.PixelConverter;
    import IEnumType = powerbi.IEnumType;
    import createEnumType = powerbi.createEnumType;
    import DataViewObjectPropertyIdentifier = powerbi.DataViewObjectPropertyIdentifier;
    import SelectionId = powerbi.visuals.SelectionId;
    import IGenericAnimator = powerbi.visuals.IGenericAnimator;
    import IMargin = powerbi.visuals.IMargin;
    import TooltipDataItem = powerbi.visuals.TooltipDataItem;
    import VisualDataLabelsSettings = powerbi.visuals.VisualDataLabelsSettings;
    import IValueFormatter = powerbi.visuals.IValueFormatter;
    import Fill = powerbi.Fill;
    import SelectableDataPoint = powerbi.visuals.SelectableDataPoint;
    import IVisual = powerbi.IVisual;
    import IViewport = powerbi.IViewport;
    import VisualCapabilities = powerbi.VisualCapabilities;
    import VisualDataRoleKind = powerbi.VisualDataRoleKind;
    import IInteractiveBehavior = powerbi.visuals.IInteractiveBehavior;
    import IDataColorPalette = powerbi.IDataColorPalette;
    import IInteractivityService = powerbi.visuals.IInteractivityService;
    import TextProperties = powerbi.TextProperties;
    import dataLabelUtils = powerbi.visuals.dataLabelUtils;
    import LegendData = powerbi.visuals.LegendData;
    import DataView = powerbi.DataView;
    import DataViewObjects = powerbi.DataViewObjects;
    import DataViewValueColumns = powerbi.DataViewValueColumns;
    import SelectionIdBuilder = powerbi.visuals.SelectionIdBuilder;
    import VisualInitOptions = powerbi.VisualInitOptions;
    import createInteractivityService = powerbi.visuals.createInteractivityService;
    import appendClearCatcher = powerbi.visuals.appendClearCatcher;
    import VisualUpdateOptions = powerbi.VisualUpdateOptions;
    import SVGUtil = powerbi.visuals.SVGUtil;
    import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
    import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
    import ObjectEnumerationBuilder = powerbi.visuals.ObjectEnumerationBuilder;
    import DataViewObject = powerbi.DataViewObject;
    import valueFormatter = powerbi.visuals.valueFormatter;
    import ILabelLayout = powerbi.visuals.ILabelLayout;
    import TooltipManager = powerbi.visuals.TooltipManager;
    import TooltipEvent = powerbi.visuals.TooltipEvent;
    import IAxisProperties = powerbi.visuals.IAxisProperties;
    import NumberRange = powerbi.NumberRange;
    import AxisHelper = powerbi.visuals.AxisHelper;
    import TextMeasurementService = powerbi.TextMeasurementService;
    import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
    import ISelectionHandler = powerbi.visuals.ISelectionHandler;

    var MaxXAxisHeight: number = 40;
    var LabelMargin: number = 15;
    var DefaultRadius: number = 5;
    var DefaultStrokeWidth: number = 1;
    var DefaultDataPointColor = "#00B8AA";
    var MinPrecision: number = 0;
    var MaxPrecision: number = 17;
    export module DotPlotLabelsOrientation {
        export enum Orientation {
            Horizontal,
            Vertical,
        };
        export var type: IEnumType = createEnumType([
            { value: Orientation[0], displayName: "Horizontal" },
            { value: Orientation[1], displayName: "Vertical" }
       ]);
    }
    export var DotPlotProperties: any = {
        general: {
            formatString: <DataViewObjectPropertyIdentifier>{
                objectName: "general",
                propertyName: "formatString"
            }
        },
        labels: {
            show: <DataViewObjectPropertyIdentifier>{
                objectName: "labels",
                propertyName: "show"
            },
            fontSize: <DataViewObjectPropertyIdentifier>{
                objectName: "labels",
                propertyName: "fontSize"
            },
            labelPrecision: <DataViewObjectPropertyIdentifier>{
                objectName: "labels",
                propertyName: "labelPrecision"
            },
            labelDisplayUnits: <DataViewObjectPropertyIdentifier>{
                objectName: "labels",
                propertyName: "labelDisplayUnits"
            },
            labelColor: <DataViewObjectPropertyIdentifier>{
                objectName: "labels",
                propertyName: "color"
            },
            orientation: <DataViewObjectPropertyIdentifier>{
                objectName: "labels",
                propertyName: "orientation"
            }
        },
        dataPoint: {
            fill: <DataViewObjectPropertyIdentifier>{
                objectName: "dataPoint",
                propertyName: "fill"
            }
        },
        categories: {
            show: <DataViewObjectPropertyIdentifier>{
                objectName: "categories",
                propertyName: "show"
            },
            fontColor: <DataViewObjectPropertyIdentifier>{
                objectName: "categories",
                propertyName: "fontColor"
            },
            fontSize: <DataViewObjectPropertyIdentifier>{
                objectName: "categories",
                propertyName: "fontSize"
            }
        },
        categoryAxis: {
            show: <DataViewObjectPropertyIdentifier>{
                objectName: "categoryAxis",
                propertyName: "show"
            },
            showAxisTitle: <DataViewObjectPropertyIdentifier>{
                objectName: "categoryAxis",
                propertyName: "showAxisTitle"
            },
            labelColor: <DataViewObjectPropertyIdentifier>{
                objectName: "categoryAxis",
                propertyName: "labelColor"
            }
        }
    };

    export interface DotPlotCalculateScaleAndDomainOptions {
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

    export interface DotPlotSelectors {
        svgPlotSelector: ClassAndSelector;
        plotSelector: ClassAndSelector;
        plotGroupSelector: ClassAndSelector;
        axisSelector: ClassAndSelector;
        xAxisSelector: ClassAndSelector;
        circleSeletor: ClassAndSelector;
    }

    export interface DotPlotChartCategory {
        value: string;
        selectionId: SelectionId;
        textWidth:number;
    }

    export interface DotPlotConstructorOptions {
        animator?: IGenericAnimator;
        svg?: D3.Selection;
        margin?: IMargin;
        radius?: number;
        strokeWidth?: number;
    }

    export interface DotPlotDataPoint {
        x: number;
        y: number;
        tooltipInfo: TooltipDataItem[];
    }

    export interface DotPlotSettings {
        labelSettings?: VisualDataLabelsSettings;
        formatter?: IValueFormatter;
        tooltipFormatter?: IValueFormatter;
        categorySettings?: DotPlotCategorySettings;
        defaultDataPointColor?: string;
        categoryAxisSettings?: DotPlotCategoryAxisSettings;
        labelOrientation?:DotPlotLabelsOrientation.Orientation;
        labelTextMaxSize:number;
        xAxisLabelTexMaxSize:number;
    }

    export interface DotPlotCategoryAxisSettings {
        show?: boolean;
        showAxisTitle?: boolean;
        labelColor?: Fill;
    }

    export interface DotPlotCategorySettings {
        show?: boolean;
        fontColor?: string;
        fontSize?: number;
    }

    export interface DotPlotDataGroup extends SelectableDataPoint {
        label?: string;
        value?: number;
        color?: string;
        tooltipInfo?: TooltipDataItem[];
        dataPoints: DotPlotDataPoint[];
        labelFontSize: string;
        highlight?: boolean;
    }

    export interface DotPlotDataView {
        displayName: string;
        dataPoints: DotPlotDataGroup[];
        values: any[];
        settings: DotPlotSettings;
        categories: DotPlotChartCategory[];
    }

    export class DotPlot implements IVisual {
        private viewportIn: IViewport;

        public static capabilities: VisualCapabilities = {
            dataRoles: [
            {
                name: 'Category',
                kind: powerbi.VisualDataRoleKind.Grouping,
                displayName: 'Category'
            },
            {
                    name: "Values",
                    kind: VisualDataRoleKind.Measure,
                    displayName: 'Values'
            }
            ],
            dataViewMappings: [{
                conditions: [
                    { 'Category': { max: 1 }, 'Values': { max: 1 } },
                ],
                categorical: {
                    categories: {
                        for: { in: 'Category' },
                        dataReductionAlgorithm: { top: {} }
                    },
                    values: {
                        group: {
                            by: "Series",
                            select: [{ for: { in: "Values" } }],
                            dataReductionAlgorithm: { top: {} }
                        }
                    }
                },
            }],
            objects: {
                general: {
                    displayName: 'General',
                    properties: {
                        formatString: {
                            type: { formatting: { formatString: true } },
                        },
                    },
                },
                categoryAxis: {
                    displayName: 'X-Axis',
                    properties: {
                        show: {
                            displayName: 'Show',
                            type: { bool: true },
                        },
                        showAxisTitle: {
                            displayName: 'Title',
                            description: 'Title options',
                            type: { bool: true }
                    },
                        labelColor: {
                            displayName: 'Label color',
                            type: { fill: { solid: { color: true } } }
                        }
                    }
                },
                dataPoint: {
                    displayName: 'Data colors',
                    properties: {
                        fill: {
                            displayName: 'Fill',
                            type: { fill: { solid: { color: true } } }
                        }
                    }
                },
                labels: {
                    displayName: "Data labels",
                    description: 'Display data label options',
                    properties: {
                        show: {
                            displayName: 'Show',
                            type: { bool: true }
                        },
                        showSeries: {
                            displayName: 'Show',
                            type: { bool: true }
                        },
                        color: {
                            displayName: 'Color',
                            description: 'Select color for data labels',
                            type: { fill: { solid: { color: true } } }
                        },
                        labelDisplayUnits: {
                            displayName: 'Display units',
                            description: 'Select the units (millions, billions, etc.)',
                            type: { formatting: { labelDisplayUnits: true } },
                            suppressFormatPainterCopy: true
                        },
                        labelPrecision: {
                            displayName: 'Decimal places',
                            description: 'Select the number of decimal places to display',
                            placeHolderText: 'Auto',
                            type: { numeric: true },
                            suppressFormatPainterCopy: true
                        },
                        showAll: {
                            displayName: 'Customize series',
                            type: { bool: true }
                        },
                        fontSize: {
                            displayName: 'Text Size',
                            type: { formatting: { fontSize: true } }
                        },
                         orientation: {
                            displayName: "Orientation",
                            type: { enumeration: DotPlotLabelsOrientation.type }
                        }
                    }
                }
            }
        };

        private DefaultMargin: IMargin = {
            top: 10,
            bottom: 10,
            right: 20,
            left: 20
        };

        private svg: D3.Selection;
        private xAxis: D3.Selection;
        private dotPlot: D3.Selection;
        private clearCatcher: D3.Selection;
        private behavior: IInteractiveBehavior;

        private colors: IDataColorPalette;
        private dataView: DataView;
        private animator: IGenericAnimator;
        private durationAnimations: number = 200;
        private dotPlotDataView: DotPlotDataView;

        private radius: number;
        private strokeWidth: number;
        private interactivityService: IInteractivityService;
        private scaleType: string = AxisScale.linear;
        private textProperties: TextProperties = {
            fontFamily: 'wf_segoe-ui_normal',
            fontSize: jsCommon.PixelConverter.toString(9),
        };

        private dotPlotSelectors: DotPlotSelectors =
        {
            svgPlotSelector: CreateClassAndSelector('dotplot'),
            plotSelector: CreateClassAndSelector('dotplotSelector'),
            plotGroupSelector: CreateClassAndSelector('dotplotGroup'),
            axisSelector: CreateClassAndSelector('axisGraphicsContext'),
            xAxisSelector: CreateClassAndSelector('x axis'),
            circleSeletor: CreateClassAndSelector('circleSelector'),
        };

        private DefaultDotPlotSettings: DotPlotSettings = {
            labelSettings: {
                show: true,
                precision: 2,
                fontSize: dataLabelUtils.DefaultFontSizeInPt,
                displayUnits: 0,
                labelColor: dataLabelUtils.defaultLabelColor,
            },
            categorySettings: {
                show: true,
                fontColor: LegendData.DefaultLegendLabelFillColor
            },
            defaultDataPointColor: DefaultDataPointColor,
            categoryAxisSettings: {
                show: true,
                showAxisTitle: true,
                labelColor: { solid: { color: dataLabelUtils.defaultLabelColor } }
            },
            labelOrientation: DotPlotLabelsOrientation.Orientation.Horizontal,
            labelTextMaxSize:0,
            xAxisLabelTexMaxSize:0
        };

        private static getTooltipData(value: number): TooltipDataItem[] {
            return [{
                displayName: "Value",
                value: value.toString()
            }];
        }

        public static converter(dataView: DataView, objects: DataViewObjects, scale: D3.Scale.OrdinalScale, defaultMargin: IMargin, defaultSetting: DotPlotSettings, colors: IDataColorPalette, viewport: IViewport, radius: number): DotPlotDataView {
            var values: DataViewValueColumns = dataView.categorical.values,
                dataPointsGroup: DotPlotDataGroup[] = [],
                displayName: string = dataView.categorical.categories[0].source.displayName,
                settings: DotPlotSettings,
                defaultColor = DataViewObjects.getFillColor(objects, DotPlotProperties.dataPoint.fill, colors.getColorByIndex(0).value);

            var categories: DotPlotChartCategory[] = dataView.categorical.categories[0].values.map((x, i) => <DotPlotChartCategory>{
                value: x,
                selectionId: SelectionId.createWithId(dataView.categorical.categories[0].identity[i])
            });
             settings = {
                categorySettings: this.getCategorySettings(objects, defaultSetting),
                defaultDataPointColor: defaultColor,
                labelSettings: this.parseSettings(objects, defaultSetting),
                categoryAxisSettings: this.parseCategoryAxisSettings(objects, defaultSetting),
                labelOrientation: ((DataViewObjects.getValue<DotPlotLabelsOrientation.Orientation>(objects, DotPlotProperties.labels.orientation , DotPlotLabelsOrientation.Orientation.Horizontal)+'') === 'Vertical' ?DotPlotLabelsOrientation.Orientation.Vertical:DotPlotLabelsOrientation.Orientation.Horizontal),
                labelTextMaxSize: 0,
				xAxisLabelTexMaxSize:0
				
                 };
                 
            var textPropertiesCat: powerbi.TextProperties = {
                text: "W",
                fontFamily: "Segoe UI" ,
                fontSize: settings.labelSettings.fontSize + "px"
            };
            
            var maxValue = 0;                
            for (var valueId in values) {
                var value = values[valueId];
                var max = _.max(value.values);
                maxValue = max > maxValue? max: maxValue;
            }
			
			var maxXAxisLabelValue = 0;
            if(settings.labelOrientation === DotPlotLabelsOrientation.Orientation.Vertical) 
            for (var catId in categories) {
                var category = categories[catId];
                category.textWidth = powerbi.TextMeasurementService.measureSvgTextWidth(textPropertiesCat) *  category.value.length;
                maxXAxisLabelValue = category.value.length > maxXAxisLabelValue? category.value.length: maxXAxisLabelValue;
            }
                             
            settings.labelTextMaxSize = powerbi.TextMeasurementService.measureSvgTextWidth(textPropertiesCat) *  (maxValue + ' ').length;
            settings.xAxisLabelTexMaxSize = powerbi.TextMeasurementService.measureSvgTextWidth(textPropertiesCat) *  maxXAxisLabelValue;
            if(settings.labelOrientation === DotPlotLabelsOrientation.Orientation.Vertical) 
            MaxXAxisHeight = settings.xAxisLabelTexMaxSize;
            
            var categoryColumn = dataView.categorical.categories[0];
            var diameter: number = 2 * radius + 1;
            var dotsTotalHeight: number = viewport.height - radius - MaxXAxisHeight - ( settings.labelOrientation  === DotPlotLabelsOrientation.Orientation.Vertical? settings.labelTextMaxSize:0);
            var maxDots: number = Math.floor((dotsTotalHeight - defaultMargin.top) / diameter) - 1;
            var fontSizeInPx: string = PixelConverter.fromPoint(settings.labelSettings.fontSize);

            var yScale: D3.Scale.LinearScale = d3.scale.linear()
                .domain([0, maxDots])
                .range([dotsTotalHeight - defaultMargin.bottom, defaultMargin.top + defaultMargin.bottom]);
            
                
            for (var valueId in values) {
                var value = values[valueId];
                
                var min = _.min(value.values);
                var max = _.max(value.values);
                var color = DataViewObjects.getFillColor(objects, DotPlotProperties.dataPoint.fill, colors.getColorByIndex(0).value);
                var length = value && value.values ? value.values.length : 0;
                var minDots = min / (max / maxDots);
                var dotsScale = d3.scale.log().domain([min < 0 ? 1 : min, max]).range([minDots <= 0 ? 1 : minDots, maxDots]).clamp(true);

                for (var k = 0; k < length; k++) {
                    var y = dotsScale(value.values[k]);
                    var dataPoints: DotPlotDataPoint[] = [];

                    for (var level = 0; level < y; level++) {
                        dataPoints.push({
                            x: scale(categories[k].value) + scale.rangeBand() / 2,
                            y: yScale(level) + ( settings.labelOrientation  === DotPlotLabelsOrientation.Orientation.Vertical? settings.labelTextMaxSize:0),
                            tooltipInfo: DotPlot.getTooltipData(value.values[k].toFixed(settings.labelSettings.precision))
                        });
                    }

                    var categorySelectionId = SelectionIdBuilder.builder().withCategory(categoryColumn, k).createSelectionId();
                    var tooltipInfo = DotPlot.getTooltipData(value.values[k].toFixed(settings.labelSettings.precision));

                    dataPointsGroup.push({
                        selected: false,
                        value: value.values[k],
                        label: value.values[k],
                        color: color,
                        identity: categorySelectionId,
                        tooltipInfo: tooltipInfo,
                        dataPoints: dataPoints,
                        labelFontSize: fontSizeInPx
                    });
                }
            }

            return {
                dataPoints: dataPointsGroup,
                values: dataView.categorical.categories[0].values,
                displayName: displayName,
                categories: categories,
                settings: settings
            };
        }

        public constructor(options?: DotPlotConstructorOptions) {
            if (options) {
                if (options.svg) {
                    this.svg = options.svg;
                }
                if (options.animator) {
                    this.animator = options.animator;
                }

                this.radius = options.radius || DefaultRadius;
                this.strokeWidth = options.strokeWidth || DefaultStrokeWidth;
            }
        }

        public init(options: VisualInitOptions): void {
            var element = options.element;
            this.behavior = new DotplotBehavior();

            this.interactivityService = createInteractivityService(options.host);
            this.radius = DefaultRadius;
            this.strokeWidth = DefaultStrokeWidth;
            this.colors = options.style.colorPalette.dataColors;

            this.svg = d3.select(element.get(0)).append('svg').classed(this.dotPlotSelectors.svgPlotSelector.class, true).style('position', 'absolute').style('left', '5px');
            this.clearCatcher = appendClearCatcher(this.svg);

            var axisGraphicsContext = this.svg.append('g').classed(this.dotPlotSelectors.axisSelector.class, true);
            this.dotPlot = this.svg.append('g').classed(this.dotPlotSelectors.plotSelector.class, true);
            this.xAxis = axisGraphicsContext.append("g").classed(this.dotPlotSelectors.xAxisSelector.class, true);
        }

        public update(options: VisualUpdateOptions): void {
            if (!options.dataViews || !options.dataViews[0]) return;

            this.durationAnimations = getAnimationDuration(this.animator, options.suppressAnimations);
            var dataView = this.dataView = options.dataViews[0];
            var viewport = options.viewport;

            if (!dataView ||
                !dataView.categorical ||
                !dataView.categorical.values ||
                dataView.categorical.values.length < 1 ||
                !dataView.categorical ||
                !dataView.categorical.categories ||
                !dataView.categorical.categories[0]) {
                this.clearData();
                return;
            }

            var viewportIn: IViewport =
                {
                    height: (viewport.height - this.DefaultMargin.top),
                    width: (viewport.width - this.DefaultMargin.left)
                };
            this.viewportIn = viewportIn;

            this.svg.style({
                height: PixelConverter.toString(viewport.height),
                width: PixelConverter.toString(viewport.width)
            });

            var objects = DotPlot.getObjectsFromDataView(dataView);
            var categoryAxisSettings = DotPlot.parseCategoryAxisSettings(objects, this.DefaultDotPlotSettings);

            var xAxisProperties = this.calculateAxes(viewportIn, categoryAxisSettings, this.textProperties, objects, false);
            var data = DotPlot.converter(dataView, objects, <D3.Scale.OrdinalScale>xAxisProperties.scale, this.DefaultMargin, this.DefaultDotPlotSettings, this.colors, viewport, this.radius);

            this.dotPlotDataView = data;
            var dataPoints = data.dataPoints;

            if (this.interactivityService)
                this.interactivityService.applySelectionStateToData(dataPoints);

            this.renderAxis(viewportIn.height - MaxXAxisHeight, viewportIn, xAxisProperties, categoryAxisSettings, data, this.durationAnimations);
            this.drawDotPlot(dataPoints, data.settings);

            var dataLabelsSettings = data.settings.labelSettings;
            if (dataLabelsSettings.show) {
                var layout = this.getEnhanchedDotplotLayout(dataLabelsSettings, viewportIn);
                var labels: D3.UpdateSelection = dataLabelUtils.drawDefaultLabelsForDataPointChart(dataPoints, this.svg, layout, viewportIn, !options.suppressAnimations, this.durationAnimations);
                if (labels)
                    labels.attr('transform', (d) => {
                        if(data.settings.labelOrientation === DotPlotLabelsOrientation.Orientation.Vertical) 
                        return SVGUtil.translateAndRotate(d.size.height/2, 0 - d.size.width/2, d.anchorPoint.x, d.anchorPoint.y, -90);
                        else
                        return SVGUtil.translate(0, 0);
                    });
            }
            else {
                dataLabelUtils.cleanDataLabels(this.svg);
            }
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            var enumeration = new ObjectEnumerationBuilder();

            switch (options.objectName) {
                case 'dataPoint':
                    this.enumerateDataPoints(enumeration, this.dataView);
                    break;
                case 'labels':
                    this.enumerateDataLabels(enumeration, this.dataView);
                    break;
                case 'categories':
                    this.enumerateCategories(enumeration, this.dataView);
                    break;
                case 'categoryAxis':
                    this.enumerateCategoryAxisValues(enumeration, this.dataView);
                    break;
            }

            return enumeration.complete();
        }

        private enumerateCategoryAxisValues(enumeration: ObjectEnumerationBuilder, dataView: DataView): void {
            var objects = dataView && dataView.metadata ? dataView.metadata.objects : undefined;
            enumeration.pushInstance({
                objectName: "categoryAxis",
                displayName: "Category Axis",
                selector: null,
                properties: {
                    show: DataViewObjects.getValue<boolean>(objects, DotPlotProperties.categoryAxis.show, this.DefaultDotPlotSettings.categoryAxisSettings.show),
                    showAxisTitle: DataViewObjects.getValue<boolean>(objects, DotPlotProperties.categoryAxis.showAxisTitle, this.DefaultDotPlotSettings.categoryAxisSettings.showAxisTitle),
                    labelColor: objects && objects['categoryAxis'] && objects['categoryAxis']['labelColor'] ?
                        objects['categoryAxis']['labelColor'] :
                        this.DefaultDotPlotSettings.categoryAxisSettings.labelColor
                }
            });
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

        private static parseSettings(objects: DataViewObjects, defaultDotPlotSettings: DotPlotSettings): VisualDataLabelsSettings {
            var precision = this.getPrecision(objects, defaultDotPlotSettings);

            return {
                show: DataViewObjects.getValue(objects, DotPlotProperties.labels.show, defaultDotPlotSettings.labelSettings.show),
                precision: precision,
                fontSize: DataViewObjects.getValue(objects, DotPlotProperties.labels.fontSize, defaultDotPlotSettings.labelSettings.fontSize),
                displayUnits: DataViewObjects.getValue<number>(objects, DotPlotProperties.labels.labelDisplayUnits, defaultDotPlotSettings.labelSettings.displayUnits),
                labelColor: DataViewObjects.getFillColor(objects, DotPlotProperties.labels.labelColor, defaultDotPlotSettings.labelSettings.labelColor),
            };
        }

        private static parseCategoryAxisSettings(objects: DataViewObjects, defaultDotPlotSettings: DotPlotSettings): DotPlotCategoryAxisSettings {
            return {
                show: DataViewObjects.getValue(objects, DotPlotProperties.categoryAxis.show, defaultDotPlotSettings.categoryAxisSettings.show),
                showAxisTitle: DataViewObjects.getValue(objects, DotPlotProperties.categoryAxis.showAxisTitle, defaultDotPlotSettings.categoryAxisSettings.showAxisTitle),
                labelColor: objects && objects['categoryAxis'] && objects['categoryAxis']['labelColor'] ?
                        objects['categoryAxis']['labelColor'] :
                        defaultDotPlotSettings.categoryAxisSettings.labelColor
            };
        }

        private static getCategorySettings(objects: DataViewObjects, defaultDotPlotSettings: DotPlotSettings): DotPlotCategorySettings {
            return {
                show: DataViewObject.getValue<boolean>(objects, DotPlotProperties.categories.show, defaultDotPlotSettings.categorySettings.show),
                fontColor: DataViewObjects.getFillColor(objects, DotPlotProperties.categories.fontColor, defaultDotPlotSettings.categorySettings.fontColor)
            };
        }

        private static getPrecision(objects: DataViewObjects, defaultDotPlotSettings: DotPlotSettings): number {
            var precision: number = DataViewObjects.getValue<number>(objects, DotPlotProperties.labels.labelPrecision, defaultDotPlotSettings.labelSettings.precision);

            if (precision <= MinPrecision)
                return MinPrecision;

            if (precision >= MaxPrecision)
                return MaxPrecision;

            return precision;
        }

        private drawDotPlot(data: DotPlotDataGroup[], setting: DotPlotSettings): void {
            var selection: D3.UpdateSelection = this.dotPlot.selectAll(this.dotPlotSelectors.plotGroupSelector.selector).data(data);
            var hasSelection = this.interactivityService && this.interactivityService.hasSelection();

            selection
                .enter()
                .append('g')
                .attr(
                {
                    stroke: "black",
                    "stroke-width": this.strokeWidth
                }).
                style("fill-opacity", (item: DotPlotDataGroup) => ColumnUtil.getFillOpacity(item.selected, item.highlight, hasSelection, false)).
                classed(this.dotPlotSelectors.plotGroupSelector.class, true);

            var circleSelection = selection.selectAll(this.dotPlotSelectors.circleSeletor.selector).data((d: DotPlotDataGroup) => { return d.dataPoints; });
            circleSelection.enter().append('circle')
                .classed(this.dotPlotSelectors.circleSeletor.class, true);

            circleSelection.attr(
                {
                    cx: (point: DotPlotDataPoint) => { return point.x; },
                    cy: (point: DotPlotDataPoint) => { return point.y; },
                    r: this.radius,
                    fill: setting.defaultDataPointColor
                });

            this.renderTooltip(selection);
            circleSelection.exit().remove();
            selection.exit().remove();

            var interactivityService = this.interactivityService;
            if (interactivityService) {
                interactivityService.applySelectionStateToData(data);

                var behaviorOptions: DotplotBehaviorOptions = {
                    columns: selection,
                    clearCatcher: this.clearCatcher,
                    interactivityService: this.interactivityService,
                };
                interactivityService.bind(data, this.behavior, behaviorOptions);
            }
        }

        private getEnhanchedDotplotLayout(labelSettings: VisualDataLabelsSettings, viewport: IViewport): ILabelLayout {
            var fontSizeInPx = jsCommon.PixelConverter.fromPoint(labelSettings.fontSize);

            var formatter: IValueFormatter = valueFormatter.create({
                format: valueFormatter.getFormatString(this.dataView.categorical.categories[0].source, DotPlotProperties.general.formatString),
                precision: labelSettings.precision,
                value: labelSettings.displayUnits
            });

            return {
                labelText: function(d) {
                    return dataLabelUtils.getLabelFormattedText({
                        label: formatter.format(d.label),
                        fontSize: labelSettings.fontSize,
                        maxWidth: viewport.width,
                    });
                },
                labelLayout: {
                    x: (d: DotPlotDataGroup) => d.dataPoints[d.dataPoints.length - 1].x - 5,
                    y: (d: DotPlotDataGroup) => d.dataPoints[d.dataPoints.length - 1].y - LabelMargin - 5
                },
                filter: function (d) {
                    return (d && d.dataPoints && d.dataPoints[d.dataPoints.length - 1]);
                },
                style: {
                    'fill': labelSettings.labelColor,
                    'font-size': fontSizeInPx
                },
            };
        }

        private enumerateDataLabels(enumeration: ObjectEnumerationBuilder, dataView: DataView): void {
            var objects = dataView && dataView.metadata ? dataView.metadata.objects : undefined;
            enumeration.pushInstance({
                objectName: "labels",
                displayName: "Labels",
                selector: null,
                properties: {
                    show: DataViewObjects.getValue<boolean>(objects, DotPlotProperties.labels.show, this.DefaultDotPlotSettings.labelSettings.show),
                    fontSize: DataViewObjects.getValue<number>(objects, DotPlotProperties.labels.fontSize, this.DefaultDotPlotSettings.labelSettings.fontSize),
                    labelPrecision: DataViewObjects.getValue<number>(objects, DotPlotProperties.labels.labelPrecision, this.DefaultDotPlotSettings.labelSettings.precision),
                    labelDisplayUnits: DataViewObjects.getValue<number>(objects, DotPlotProperties.labels.labelDisplayUnits, this.DefaultDotPlotSettings.labelSettings.displayUnits),
                    color: DataViewObjects.getFillColor(objects, DotPlotProperties.labels.labelColor, this.DefaultDotPlotSettings.labelSettings.labelColor),
                    orientation: DataViewObjects.getValue<DotPlotLabelsOrientation.Orientation>(objects, DotPlotProperties.labels.orientation , DotPlotLabelsOrientation.Orientation.Horizontal)
                }
            });
        }

        private enumerateDataPoints(enumeration: ObjectEnumerationBuilder, dataView: DataView): void {
            var objects = dataView && dataView.metadata ? dataView.metadata.objects : undefined;
            var dataPointColor = DataViewObjects.getFillColor(objects, DotPlotProperties.dataPoint.fill, this.DefaultDotPlotSettings.defaultDataPointColor);
            enumeration.pushInstance({
                objectName: "dataPoint",
                displayName: "Data Points",
                selector: null,
                properties: {
                    fill: { solid: { color: dataPointColor } }
                }
            });
        }

        private enumerateCategories(enumeration: ObjectEnumerationBuilder, dataView: DataView): void {
            var objects = dataView && dataView.metadata ? dataView.metadata.objects : undefined;
            var categoriesSettings = DotPlot.getCategorySettings(objects, this.DefaultDotPlotSettings);
            enumeration.pushInstance({
                objectName: "categories",
                displayName: "Categories",
                selector: null,
                properties: {
                    show: categoriesSettings.show,
                    fontSize: categoriesSettings.fontSize,
                    fontColor: categoriesSettings.fontColor
                }
            });
        }

        private clearData(): void {
            this.dotPlot.selectAll("*").remove();
            this.xAxis.selectAll("*").remove();
            dataLabelUtils.cleanDataLabels(this.svg);
        }

        private renderTooltip(selection: D3.UpdateSelection): void {
            TooltipManager.addTooltip(selection, (tooltipEvent: TooltipEvent) =>
                (<DotPlotDataGroup>tooltipEvent.data).tooltipInfo);
        }

        private calculateAxes(
            viewportIn: IViewport,
            categoryAxisSettings: DotPlotCategoryAxisSettings,
            textProperties: TextProperties,
            objects: DataViewObjects,
            scrollbarVisible: boolean): IAxisProperties {

            var category = this.dataView.categorical.categories && this.dataView.categorical.categories.length > 0
                ? this.dataView.categorical.categories[0]
                : {
                    source: undefined,
                    values: [valueFormatter.format(null)],
                    identity: undefined,
                };

            var visualOptions: CalculateScaleAndDomainOptions = {
                viewport: viewportIn,
                margin: this.DefaultMargin,
                forcedXDomain: this.dataView.categorical.categories[0].values,
                forceMerge: false,
                showCategoryAxisLabel: false,
                showValueAxisLabel: false,
                categoryAxisScaleType: this.scaleType,
                valueAxisScaleType: null,
                valueAxisDisplayUnits: 0,
                categoryAxisDisplayUnits: 0,
                trimOrdinalDataOnOverflow: false,
            };

            var width = viewportIn.width;
            var axes = this.calculateAxesProperties(viewportIn, categoryAxisSettings, visualOptions, category.source, objects);
            axes.willLabelsFit = AxisHelper.LabelLayoutStrategy.willLabelsFit(
                axes,
                width,
                TextMeasurementService.measureSvgTextWidth,
                textProperties);

             var orientation =   ((DataViewObjects.getValue<DotPlotLabelsOrientation.Orientation>(objects, DotPlotProperties.labels.orientation , DotPlotLabelsOrientation.Orientation.Horizontal)+'') === 'Vertical' ?DotPlotLabelsOrientation.Orientation.Vertical:DotPlotLabelsOrientation.Orientation.Horizontal);

            // If labels do not fit and we are not scrolling, try word breaking
            if(orientation !== DotPlotLabelsOrientation.Orientation.Vertical)
            axes.willLabelsWordBreak = (!axes.willLabelsFit && !scrollbarVisible) && AxisHelper.LabelLayoutStrategy.willLabelsWordBreak(
                axes, this.DefaultMargin, width, TextMeasurementService.measureSvgTextWidth,
                TextMeasurementService.estimateSvgTextHeight, TextMeasurementService.getTailoredTextOrDefault,
                textProperties);
                else
                 axes.willLabelsWordBreak = false;

            return axes;
        }

        private calculateAxesProperties(viewportIn: IViewport, categoryAxisSettings: DotPlotCategoryAxisSettings, options: CalculateScaleAndDomainOptions, metaDataColumn: DataViewMetadataColumn, objects: DataViewObjects): IAxisProperties {
            var xAxisProperties = AxisHelper.createAxis({
                pixelSpan: viewportIn.width,
                dataDomain: options.forcedXDomain,
                metaDataColumn: metaDataColumn,
                formatString: valueFormatter.getFormatString(metaDataColumn, DotPlotProperties.general.formatString),
                outerPadding: 0,
                isScalar: false,
                isVertical: false,
                forcedTickCount: options.forcedTickCount,
                useTickIntervalForDisplayUnits: true,
                isCategoryAxis: true,
                getValueFn: (index, type) => categoryAxisSettings.show ? index : '',
                scaleType: options.categoryAxisScaleType,
                axisDisplayUnits: options.categoryAxisDisplayUnits,
            });

            if (categoryAxisSettings.show)
                // Should handle the label, units of the label and the axis style
                xAxisProperties.axisLabel = AxisHelper.createAxisLabel(objects, '', ''); //axes.x.axisLabel);
            return xAxisProperties;
        }

        private renderAxis(height: number, viewportIn: IViewport, xAxisProperties: IAxisProperties, categoryAxisSettings: DotPlotCategoryAxisSettings, data: DotPlotDataView, duration: number): void {
            this.xAxis.attr(
                {
                    transform: SVGUtil.translate(0, height)
                });

            var xAxis = xAxisProperties.axis;
            xAxis.orient('bottom');

            this.xAxis
                .transition()
                .duration(duration)
                .call(xAxis)
                .call(DotPlot.setAxisLabelColor, categoryAxisSettings.labelColor);
                         
            var xAxisTicks: D3.Selection = this.xAxis.selectAll('.tick text');
            xAxisTicks.data(xAxisProperties.values);
            if(data.settings.labelOrientation !== DotPlotLabelsOrientation.Orientation.Vertical) 
            xAxisTicks.call(AxisHelper.LabelLayoutStrategy.clip,
                xAxisProperties.xLabelMaxWidth,
                TextMeasurementService.svgEllipsis);
                if(data.settings.labelOrientation === DotPlotLabelsOrientation.Orientation.Vertical) 
                xAxisTicks.attr('transform', (d) => {
                    var textHeight = 12;
                    var textWidth = powerbi.TextMeasurementService.measureSvgTextWidth(d);

                        return SVGUtil.translateAndRotate(textHeight/2-2*textHeight, textWidth+20, 0, 0, -90);
                    });
                
            xAxisTicks.append('title').text((d) => d);

            this.xAxis.selectAll('line').style('opacity', data.settings.categoryAxisSettings.show ? 1 : 0);

            this.xAxis.selectAll('.xAxisLabel').remove();
            if (data.settings.categoryAxisSettings.showAxisTitle) {
                this.xAxis.append("text")
                    .text(this.dataView.categorical.categories[0].source.displayName)
                    .style("text-anchor", "middle")
                    .attr('class', 'xAxisLabel')
                    .style('fill', categoryAxisSettings.labelColor.solid.color)
                    .attr('transform', 'translate(' + (viewportIn.width / 2) + ','+ (data.settings.xAxisLabelTexMaxSize>0?data.settings.xAxisLabelTexMaxSize: 40) +')');
            }
        }

        private static setAxisLabelColor(g: D3.Selection, fill: Fill): void {
            g.selectAll('g.tick text').style('fill', fill && fill.solid ? fill.solid.color : null);
        }
    }

    export interface DotplotBehaviorOptions {
        columns: D3.Selection;
        clearCatcher: D3.Selection;
        interactivityService: IInteractivityService;
    }

    export class DotplotBehavior implements IInteractiveBehavior {
        private columns: D3.Selection;
        private clearCatcher: D3.Selection;
        private interactivityService: IInteractivityService;

        public bindEvents(options: DotplotBehaviorOptions, selectionHandler: ISelectionHandler): void {
            this.columns = options.columns;
            this.clearCatcher = options.clearCatcher;
            this.interactivityService = options.interactivityService;

            this.columns.on('click', (d: SelectableDataPoint, i: number) => {
                selectionHandler.handleSelection(d, d3.event.ctrlKey);
            });

            options.clearCatcher.on('click', () => {
                selectionHandler.handleClearSelection();
            });
        }

      public renderSelection(hasSelection: boolean) {
            var hasHighlights = this.interactivityService.hasSelection();

            this.columns.style("fill-opacity", (d: DotPlotDataGroup) => {
                return dotPlotUtils.getFillOpacity(d.selected, d.highlight, !d.highlight && hasSelection, !d.selected && hasHighlights);
            });
        }
    }

    export module dotPlotUtils {
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
