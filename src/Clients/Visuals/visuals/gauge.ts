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
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    import createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;
    import PixelConverter = jsCommon.PixelConverter;
    import DataRoleHelper = powerbi.data.DataRoleHelper;
    import ISize = powerbi.visuals.shapes.ISize;

    export interface GaugeData extends TooltipEnabledDataPoint {
        total: number;
        metadataColumn: DataViewMetadataColumn;
        minColumnMetadata: DataViewMetadataColumn;
        maxColumnMetadata: DataViewMetadataColumn;
        targetColumnMetadata: DataViewMetadataColumn;
        targetSettings: GaugeTargetSettings;
        dataLabelsSettings: VisualDataLabelsSettings;
        calloutValueLabelsSettings: VisualDataLabelsSettings;
        dataPointSettings: GaugeDataPointSettings;
    }

    interface KpiArcAttributes {
        start: number;
        end: number;
        fill: string;
    }

    export interface GaugeTargetSettings {
        min: number;
        max: number;
        target: number;
    }

    export interface GaugeTargetData extends GaugeTargetSettings {
        value: number;
        tooltipItems: TooltipDataItem[];
    }

    export interface GaugeDataPointSettings {
        fillColor: string;
        targetColor: string;
    }

    interface GaugeStyle {
        transition: {
            ease: string
        };
        arcColors: {
            background: string;
            foreground: string;
        };
        targetLine: {
            show: boolean;
            color: string;
            thickness: number;
        };
        labels: {
            count: number;
            padding: number;
            fontSize: number;
        };
        kpiBands: {
            show: boolean;
            separationRadians: number;
            thickness: number;
        };
    }

    const enum GaugeLabelPosition {
        None,
        LeftRight,
        Bottom
    }

    interface GaugeLabel {
        text: string;
        size: ISize;
    }

    export interface GaugeSmallViewPortProperties {
        hideGaugeSideNumbersOnSmallViewPort: boolean;
        smallGaugeMarginsOnSmallViewPort: boolean;
        MinHeightGaugeSideNumbersVisible: number;
        GaugeMarginsOnSmallViewPort: number;
    }

    export interface GaugeVisualProperties {
        radius: number;
        innerRadiusOfArc: number;
        innerRadiusFactor: number;
        left: number;
        top: number;
        height: number;
        width: number;
        margin: IMargin;
        transformString: string;
    }

    export interface AnimatedNumberProperties {
        transformString: string;
        viewport: IViewport;
    }

    export interface GaugeConstructorOptions {
        gaugeSmallViewPortProperties?: GaugeSmallViewPortProperties;
        animator?: IGenericAnimator;
        tooltipsEnabled?: boolean;
        tooltipBucketEnabled?: boolean;
    }

    export interface GaugeDataViewObjects extends DataViewObjects {
        axis: GaugeDataViewObject;
    }

    export interface GaugeDataViewObject extends DataViewObject {
        min?: number;
        max?: number;
        target?: number;
    }

    /** 
     * Renders a number that can be animate change in value.
     */
    export class Gauge implements IVisual {
        private static MinDistanceFromBottom = 10;
        private static MinWidthForTargetLabel = 150;
        private static DefaultTopBottomMargin = 20;
        private static ReducedLeftRightMargin = 15;
        private static DEFAULT_MAX = 1;
        private static DEFAULT_MIN = 0;
        private static VisualClassName = 'gauge';
        private static DefaultStyleProperties: GaugeStyle = {
            transition: {
                ease: 'cubic-in-out'
            },
            arcColors: {
                background: '#e9e9e9',
                foreground: '#00B8AA'
            },
            targetLine: {
                show: true,
                color: '#666666',
                thickness: 2
            },
            labels: {
                count: 2,
                padding: 5,
                fontSize: NewDataLabelUtils.DefaultLabelFontSizeInPt,
            },
            kpiBands: {
                show: false,
                separationRadians: Math.PI / 128,
                thickness: 5
            },
        };
        private static DefaultTargetSettings: GaugeTargetSettings = {
            min: 0,
            max: 1,
            target: undefined
        };
        private static DefaultDataPointSettings: GaugeDataPointSettings = {
            fillColor: Gauge.DefaultStyleProperties.arcColors.foreground,
            targetColor: Gauge.DefaultStyleProperties.targetLine.color
        };

        private static InnerRadiusFactor = 0.7;
        private static KpiBandDistanceFromMainArc = 2;
        private static MainGaugeGroupClassName = 'mainGroup';
        private static LabelText: ClassAndSelector = createClassAndSelector('labelText');
        private static TargetConnector: ClassAndSelector = createClassAndSelector('targetConnector');
        private static TargetText: ClassAndSelector = createClassAndSelector('targetText');

        /** Note: Public for testability */
        public static formatStringProp: DataViewObjectPropertyIdentifier = {
            objectName: 'general',
            propertyName: 'formatString',
        };

        private svg: D3.Selection;
        private mainGraphicsContext: D3.Selection;
        private currentViewport: IViewport;
        private element: JQuery;
        private style: IVisualStyle;
        private data: GaugeData;
        private color: D3.Scale.OrdinalScale;

        private backgroundArc: D3.Svg.Arc;
        private foregroundArc: D3.Svg.Arc;
        private kpiArcs: D3.Svg.Arc[];

        private kpiArcPaths: D3.Selection[];
        private foregroundArcPath: D3.Selection;
        private backgroundArcPath: D3.Selection;
        private targetLine: D3.Selection;
        private targetConnector: D3.Selection;
        private targetText: D3.Selection;
        private options: VisualInitOptions;

        private lastAngle = -Math.PI / 2;
        private margin: IMargin;
        private animatedNumberGrapicsContext: D3.Selection;
        private animatedNumber: AnimatedNumber;
        private settings: GaugeStyle;
        private targetSettings: GaugeTargetSettings;
        private gaugeVisualProperties: GaugeVisualProperties;
        private gaugeSmallViewPortProperties: GaugeSmallViewPortProperties;
        private showTargetLabel: boolean;

        private tooltipsEnabled: boolean;
        private tooltipBucketEnabled: boolean;

        private hostService: IVisualHostServices;
        private labels: GaugeLabel[];

        // TODO: Remove this once all visuals have implemented update.
        private dataView: DataView;

        public animator: IGenericAnimator;

        constructor(options?: GaugeConstructorOptions) {
            if (options) {
                if (options.gaugeSmallViewPortProperties) {
                    this.gaugeSmallViewPortProperties = options.gaugeSmallViewPortProperties;
                }
                this.animator = options.animator;
                this.tooltipsEnabled = options.tooltipsEnabled;
                this.tooltipBucketEnabled = options.tooltipBucketEnabled;
            }
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            let enumeration = new ObjectEnumerationBuilder();

            switch (options.objectName) {
                case 'axis':
                    this.enumerateAxis(enumeration);
                    break;
                case 'labels': {
                    let labelSettings = this.data ? this.data.dataLabelsSettings : dataLabelUtils.getDefaultGaugeLabelSettings();
                    dataLabelUtils.enumerateDataLabels(this.getDataLabelSettingsOptions(enumeration, labelSettings));
                    break;
                }
                case 'calloutValue': {
                    let labelSettings = this.data ? this.data.calloutValueLabelsSettings : dataLabelUtils.getDefaultGaugeLabelSettings();
                    dataLabelUtils.enumerateDataLabels(this.getDataLabelSettingsOptions(enumeration, labelSettings));
                    break;
                }
                case 'dataPoint': {
                    this.enumerateDataPoint(enumeration);
                    break;
                }
            }
            return enumeration.complete();
        }

        private getDataLabelSettingsOptions(enumeration: ObjectEnumerationBuilder, labelSettings: VisualDataLabelsSettings): VisualDataLabelsSettingsOptions {
            return {
                dataLabelsSettings: labelSettings,
                show: true,
                precision: true,
                displayUnits: true,
                fontSize: true,
                enumeration: enumeration,
            };
        }

        private enumerateAxis(enumeration: ObjectEnumerationBuilder): void {
            let dataView: DataView = this.dataView;

            if (dataView && dataView.metadata) {
                let properties: GaugeTargetSettings = Gauge.getGaugeObjectsProperties(dataView);
                enumeration.pushInstance({
                    selector: null,
                    objectName: 'axis',
                    properties: <any>properties,
                });
            }
        }

        private enumerateDataPoint(enumeration: ObjectEnumerationBuilder): void {
            let dataPointSettings = this.data ? this.data.dataPointSettings : Gauge.DefaultDataPointSettings;
            let properties: any = {};

            properties.fill = { solid: { color: dataPointSettings.fillColor } };

            if (dataPointSettings.targetColor != null) {
                properties.target = { solid: { color: dataPointSettings.targetColor } };
            }

            enumeration.pushInstance({
                selector: null,
                objectName: gaugeProps.dataPoint.target.objectName,
                properties: properties
            });
        }

        private static getGaugeObjectsProperties(dataView: DataView): GaugeTargetSettings {
            let properties: any = {};
            let objects: GaugeDataViewObjects = <GaugeDataViewObjects>dataView.metadata.objects;
            let hasAxisObject: boolean = !!objects && !!objects.axis;

            if (!DataRoleHelper.hasRoleInDataView(dataView, gaugeRoleNames.minValue))
                properties.min = hasAxisObject ? objects.axis.min : undefined;

            if (!DataRoleHelper.hasRoleInDataView(dataView, gaugeRoleNames.maxValue))
                properties.max = hasAxisObject ? objects.axis.max : undefined;

            if (!DataRoleHelper.hasRoleInDataView(dataView, gaugeRoleNames.targetValue))
                properties.target = hasAxisObject ? objects.axis.target : undefined;

            return properties;
        }

        public init(options: VisualInitOptions) {
            this.element = options.element;
            this.currentViewport = options.viewport;
            this.style = options.style;
            this.options = options;
            this.settings = Gauge.DefaultStyleProperties;
            this.targetSettings = Gauge.DefaultTargetSettings;

            this.setMargins();

            this.color = d3.scale.ordinal().range(
                this.style.colorPalette.dataColors.getSentimentColors().map(
                    color => color.value));

            this.hostService = options.host;
            let svg = this.svg = d3.select(this.element.get(0)).append('svg');
            svg.classed(Gauge.VisualClassName, true);
            let mainGraphicsContext = this.mainGraphicsContext = svg.append('g');
            mainGraphicsContext.attr('class', Gauge.MainGaugeGroupClassName);

            this.initKpiBands();

            let backgroundArc = this.backgroundArc = d3.svg.arc()
                .innerRadius(0)
                .outerRadius(0)
                .startAngle(-Math.PI / 2)
                .endAngle(Math.PI / 2);

            let foregroundArc = this.foregroundArc = d3.svg.arc()
                .innerRadius(0)
                .outerRadius(0)
                .startAngle(-Math.PI / 2);

            this.backgroundArcPath = mainGraphicsContext.append('path')
                .classed('backgroundArc', true)
                .attr('d', backgroundArc);

            this.foregroundArcPath = mainGraphicsContext.append('path')
                .datum({ endAngle: -Math.PI / 2 })
                .classed('foregroundArc', true)
                .attr('d', foregroundArc);

            let g = this.animatedNumberGrapicsContext = svg.append('g');

            this.animatedNumber = new AnimatedNumber(g);
            this.animatedNumber.init(options);

            let gaugeDrawingOptions = this.gaugeVisualProperties = this.getGaugeVisualProperties();
            let animatedNumberProperties = this.getAnimatedNumberProperties(
                gaugeDrawingOptions.radius,
                gaugeDrawingOptions.innerRadiusFactor,
                gaugeDrawingOptions.top,
                gaugeDrawingOptions.left);
            this.animatedNumberGrapicsContext.attr('transform', animatedNumberProperties.transformString);
            this.animatedNumber.onResizing(animatedNumberProperties.viewport);
        }

        public update(options: VisualUpdateOptions) {
            debug.assertValue(options, 'options');

            this.currentViewport = options.viewport;
            if (!options.dataViews || !options.dataViews[0]) {
                return;
            }

            let dataView = this.dataView = options.dataViews[0];
            let reader = data.createIDataViewCategoricalReader(dataView);
            this.data = Gauge.converter(reader, this.tooltipBucketEnabled);
            this.targetSettings = this.data.targetSettings;
            this.dataView.single = { value: this.data.total };
            this.labels = this.createLabels();

            // Only show the target label if:
            //   1. There is a target
            //   2. The target is inside boundaries
            //   3. The viewport width is big enough for a target
            //   4. We're showing label text for side numbers
            //   5. Data label settings specify to show
            this.showTargetLabel = this.targetSettings.target != null
                && (this.targetSettings.target >= this.targetSettings.min && this.targetSettings.target <= this.targetSettings.max) 
                && (this.currentViewport.width > Gauge.MinWidthForTargetLabel || this.getLabelsPosition() !== GaugeLabelPosition.Bottom)
                && this.showSideNumbersLabelText()
                && this.data.dataLabelsSettings.show;

            this.setMargins();

            this.gaugeVisualProperties = this.getGaugeVisualProperties();
            this.drawViewPort(this.gaugeVisualProperties);
            this.updateInternal(options.suppressAnimations);
            this.updateCalloutValue(options.suppressAnimations);

            let warnings = getInvalidValueWarnings(
                [dataView],
                false /*supportsNaN*/,
                false /*supportsNegativeInfinity*/,
                false /*supportsPositiveInfinity*/);

            this.hostService.setWarnings(warnings);
        }

        private updateCalloutValue(suppressAnimations: boolean): void {
            if (this.data.calloutValueLabelsSettings.show) {
                let animatedNumberProperties = this.getAnimatedNumberProperties(
                    this.gaugeVisualProperties.radius,
                    this.gaugeVisualProperties.innerRadiusFactor,
                    this.gaugeVisualProperties.top,
                    this.gaugeVisualProperties.left);
                this.animatedNumberGrapicsContext.attr('transform', animatedNumberProperties.transformString);
                this.animatedNumber.setTextColor(this.data.calloutValueLabelsSettings.labelColor);

                let calloutValue: number = this.data ? this.data.total : null;
                let formatter = this.getFormatter(this.data.calloutValueLabelsSettings, this.data.metadataColumn, calloutValue);

                this.animatedNumber.setFormatter(formatter);
                this.animatedNumber.update({
                    viewport: animatedNumberProperties.viewport,
                    dataViews: [this.dataView],
                    suppressAnimations: suppressAnimations,
                });

                this.animatedNumberGrapicsContext.selectAll('title').remove();
                this.animatedNumberGrapicsContext.append('title').text([formatter.format(calloutValue)]);
            }
            else {
                this.animatedNumber.clear();
                this.animatedNumberGrapicsContext.selectAll('title').remove();
            }
        }

        public onDataChanged(options: VisualDataChangedOptions): void {
            // TODO: Remove onDataChanged & onResizing once all visuals have implemented update.
            this.update({
                dataViews: options.dataViews,
                suppressAnimations: options.suppressAnimations,
                viewport: this.currentViewport
            });
        }

        public onResizing(viewport: IViewport): void {
            // TODO: Remove onDataChanged & onResizing once all visuals have implemented update.
            this.update({
                dataViews: [this.dataView],
                suppressAnimations: true,
                viewMode: ViewMode.View,
                viewport: viewport
            });
        }

        /**
         * Populates Gauge data based on roles or axis settings.
         */
        private static parseGaugeData(reader: data.IDataViewCategoricalReader, tooltipBucketEnabled?: boolean): GaugeTargetData {
            let dataViewObjects = <GaugeDataViewObjects>reader.getStaticObjects();
            let valueMetadata = reader.getValueMetadataColumn(gaugeRoleNames.y);
            let axisObject = dataViewObjects ? dataViewObjects.axis : null;
            let isValueDefined = reader.hasValues(gaugeRoleNames.y);
            let isMaxDefined = reader.hasValues(gaugeRoleNames.maxValue);
            let isMinDefined = reader.hasValues(gaugeRoleNames.minValue);
            let valueIndex = 0;

            let data: GaugeTargetData = {
                max: null,
                min: null,
                target: null,
                value: null,
                tooltipItems: []
            };

            // Set value
            if (isValueDefined) {
                data.value = reader.getValue(gaugeRoleNames.y, valueIndex);
                let value = converterHelper.formatFromMetadataColumn(data.value, valueMetadata, Gauge.formatStringProp);
                data.tooltipItems.push({ displayName: reader.getValueDisplayName(gaugeRoleNames.y), value: value });
            }

            // Set target
            if (reader.hasValues(gaugeRoleNames.targetValue)) {
                let targetMetadata = reader.getValueMetadataColumn(gaugeRoleNames.targetValue);
                data.target = reader.getValue(gaugeRoleNames.targetValue, valueIndex);
                let value = converterHelper.formatFromMetadataColumn(data.target, targetMetadata, Gauge.formatStringProp);
                data.tooltipItems.push({ displayName: reader.getValueDisplayName(gaugeRoleNames.targetValue), value: value });
            }
            else if (axisObject) {
                data.target = axisObject.target;
            }

            // For maxumum we set values in such priority: 
            // 1. Maximum column
            // 2. Property pane axis settings
            // 3. If the value column is specified and it has no percent formatting and min is undefined: 
            //                                                      a. 2 * value if value > 0
            //                                                      b. 0 if value < 0
            // 4. Use Default Max value what is 1 right now. 
            if (isMaxDefined) {
                data.max = reader.getValue(gaugeRoleNames.maxValue, valueIndex);
            }
            else if (axisObject && axisObject.max != null) {
                data.max = axisObject.max;
            }
            else {
                data.max = Gauge.DEFAULT_MAX;
                if (isValueDefined && data.value && data.value !== 0) {
                    let hasPercent = false;
                    if (valueMetadata) {
                        let formatString = valueFormatter.getFormatString(valueMetadata, Gauge.formatStringProp, true);
                        if (formatString != null) {
                            hasPercent = valueFormatter.getFormatMetadata(formatString).hasPercent;
                        }
                    }

                    if (!hasPercent && !isMinDefined) {
                        data.max = data.value < 0 ? Gauge.DEFAULT_MIN : 2 * data.value;
                    }
                }
            }

            // For minimum we set values in such priority: 
            // 1. Minimum column.
            // 2. Property pane axis settings.
            // 3. Use Default Min value what is 0 right now for value >= 0.
            // 4. Use value * 2 for value < 0 and max hasn't been specified.
            if (isMinDefined) {
                data.min = reader.getValue(gaugeRoleNames.minValue, valueIndex);
            }
            else if (axisObject && axisObject.min != null) {
                data.min = axisObject.min;
            }
            else {
                data.min = Gauge.DEFAULT_MIN;
                if (!isMaxDefined && isValueDefined && data.value != null && data.value < 0) {
                    data.min = 2 * data.value;
                }
            }

            if (tooltipBucketEnabled) {
                TooltipBuilder.addTooltipBucketItem(reader, data.tooltipItems, 0);
            }

            return data;
        }

        /** Note: Made public for testability */
        public static converter(reader: data.IDataViewCategoricalReader, tooltipBucketEnabled: boolean = true): GaugeData {
            let objectSettings = reader.getStaticObjects();
            let metadataColumn = reader.getValueMetadataColumn(gaugeRoleNames.y);
            let gaugeData = Gauge.parseGaugeData(reader, tooltipBucketEnabled);
            let value = gaugeData.value;

            return {
                total: value,
                tooltipInfo: gaugeData.tooltipItems,
                maxColumnMetadata: reader.getValueMetadataColumn(gaugeRoleNames.maxValue),
                minColumnMetadata: reader.getValueMetadataColumn(gaugeRoleNames.minValue),
                targetColumnMetadata: reader.getValueMetadataColumn(gaugeRoleNames.targetValue),
                metadataColumn: metadataColumn,
                targetSettings: { min: gaugeData.min, max: gaugeData.max, target: gaugeData.target },
                dataLabelsSettings: Gauge.convertDataLabelSettings(objectSettings, "labels"),
                calloutValueLabelsSettings: Gauge.convertDataLabelSettings(objectSettings, "calloutValue"),
                dataPointSettings: Gauge.convertDataPointSettings(objectSettings, gaugeData)
            };
        }

        private static convertDataLabelSettings(objects: DataViewObjects, objectName: string): VisualDataLabelsSettings {
            let dataLabelsSettings = dataLabelUtils.getDefaultGaugeLabelSettings();
            if (objects) {
                // Handle label settings
                let labelsObj = <DataLabelObject>objects[objectName];
                dataLabelUtils.updateLabelSettingsFromLabelsObject(labelsObj, dataLabelsSettings);
            }

            return dataLabelsSettings;
        }

        private static convertDataPointSettings(objects: DataViewObjects, targetSettings: GaugeTargetSettings): GaugeDataPointSettings {

            // Default the fill color the the default fill color. Default the target to undefined as it's only used if there's a target.
            let fillColor = Gauge.DefaultDataPointSettings.fillColor;
            let targetColor: string;

            if (objects) {

                fillColor = DataViewObjects.getFillColor(objects, gaugeProps.dataPoint.fill, Gauge.DefaultDataPointSettings.fillColor);

                if (targetSettings && (targetSettings.target != null)) {
                    targetColor = DataViewObjects.getFillColor(objects, gaugeProps.dataPoint.target, Gauge.DefaultDataPointSettings.targetColor);
                }
            }
            else if (targetSettings && (targetSettings.target != null)) {
                // If there isn't metadata, but a target is set, default to the default target color
                targetColor = Gauge.DefaultDataPointSettings.targetColor;
            }

            return {
                fillColor: fillColor,
                targetColor: targetColor
            };
        }

        private initKpiBands() {
            if (!this.settings.kpiBands.show)
                return;
            let kpiArcs = this.kpiArcs = [];
            let kpiArcPaths = this.kpiArcPaths = [];
            let mainGraphicsContext = this.mainGraphicsContext;

            for (let i = 0; i < 3; i++) {
                let arc = d3.svg.arc()
                    .innerRadius(0)
                    .outerRadius(0)
                    .startAngle(0)
                    .endAngle(0);

                kpiArcs.push(arc);

                let arcPath = mainGraphicsContext.append('path')
                    .attr("d", arc);

                kpiArcPaths.push(arcPath);
            }
        }

        /**
         * Indicates whether gauge arc is valid.
         */
        private isValid(): boolean {
            if (!this.data || !this.data.targetSettings)
                return false;

            let targetSettings = this.data.targetSettings;

            return $.isNumeric(targetSettings.min) && $.isNumeric(targetSettings.max) || targetSettings.min > targetSettings.max;
        }

        private updateKpiBands(radius: number, innerRadiusFactor: number, tString: string, kpiAngleAttr: KpiArcAttributes[]) {
            if (!this.settings.kpiBands.show)
                return;

            for (let i = 0; i < kpiAngleAttr.length; i++) {
                this.kpiArcs[i]
                    .innerRadius(radius * innerRadiusFactor - (Gauge.KpiBandDistanceFromMainArc + this.settings.kpiBands.thickness))
                    .outerRadius(radius * innerRadiusFactor - Gauge.KpiBandDistanceFromMainArc)
                    .startAngle(kpiAngleAttr[i].start)
                    .endAngle(kpiAngleAttr[i].end);

                this.kpiArcPaths[i]
                    .attr('fill', kpiAngleAttr[i].fill)
                    .attr('d', this.kpiArcs[i])
                    .attr('transform', tString);
            }
        }

        private removeTargetElements() {
            if (this.targetLine) {
                this.targetLine.remove();
                this.targetText.remove();
                this.targetConnector.remove();
                this.targetLine = this.targetConnector = this.targetText = null;
            }
        }

        private getTargetRatio(): number {
            let targetSettings = this.targetSettings;
            let range = targetSettings.max - targetSettings.min;
            if (range !== 0)
                return (targetSettings.target - targetSettings.min) / range;

            return 0;
        }

        private updateTargetLine(radius: number, innerRadius: number, left, top) {
            if (!this.targetLine) {
                this.targetLine = this.mainGraphicsContext.append('line');
            }

            let angle = this.getTargetRatio() * Math.PI;

            let outY = top - radius * Math.sin(angle);
            let outX = left - radius * Math.cos(angle);

            let inY = top - innerRadius * Math.sin(angle);
            let inX = left - innerRadius * Math.cos(angle);

            this.targetLine.attr({
                x1: inX,
                y1: inY,
                x2: outX,
                y2: outY
            });
        }

        /** Note: public for testability */
        public getAnimatedNumberProperties(radius: number,
            innerRadiusFactor: number,
            top: number, left: number): AnimatedNumberProperties {
            let boxAngle = Math.PI / 4;
            let scale = 1;
            let innerRadiusOfArc = radius * innerRadiusFactor;
            let innerRadiusForTextBoundingBox = innerRadiusOfArc - (this.settings.kpiBands.show
                ? (Gauge.KpiBandDistanceFromMainArc + this.settings.kpiBands.thickness)
                : 0);
            let innerRCos = innerRadiusForTextBoundingBox * Math.cos(boxAngle);
            let innerRSin = innerRadiusForTextBoundingBox * Math.sin(boxAngle);
            let innerY = top - innerRSin;
            let innerX = left - innerRCos;
            innerY = innerY * scale;
            innerX = innerX * scale;
            let animatedNumberWidth = innerRCos * 2;

            let properties: AnimatedNumberProperties = {
                transformString: SVGUtil.translate(innerX, innerY),
                viewport: { height: innerRSin, width: animatedNumberWidth }
            };
            return properties;
        }

        /** Note: public for testability */
        public getGaugeVisualProperties(): GaugeVisualProperties {
            let viewport = this.currentViewport;
            let margin: IMargin = this.margin;
            let width = viewport.width - margin.right - margin.left;
            let halfWidth = width / 2;
            let height = viewport.height - margin.top - margin.bottom;
            let radius = Math.min(halfWidth, height);
            let innerRadiusFactor = Gauge.InnerRadiusFactor;
            let left = margin.left + halfWidth;
            let top = radius + (height - radius) / 2 + margin.top;
            let tString = SVGUtil.translate(left, top);
            let innerRadiusOfArc = radius * innerRadiusFactor;

            let gaugeData: GaugeVisualProperties = {
                radius: radius,
                innerRadiusOfArc: innerRadiusOfArc,
                left: left,
                top: top,
                height: height,
                width: width,
                margin: margin,
                transformString: tString,
                innerRadiusFactor: innerRadiusFactor
            };

            return gaugeData;
        }

        /** Note: public for testability */
        public drawViewPort(drawOptions: GaugeVisualProperties): void {
            debug.assertAnyValue(drawOptions, "Gauge options");

            let separation = this.settings.kpiBands.separationRadians;
            let innerRadiusFactor = Gauge.InnerRadiusFactor;

            let backgroudArc = this.backgroundArc;
            let color = this.color;

            let attrs: KpiArcAttributes[] = [{
                fill: color(0),
                start: -Math.PI / 2,
                end: -Math.PI / 2 + Math.PI / 4 - separation
            }, {
                    fill: color(1),
                    start: -Math.PI / 2 + Math.PI * 1 / 4 + separation,
                    end: -Math.PI / 2 + Math.PI * 3 / 4 - separation
                }, {
                    fill: color(2),
                    start: -Math.PI / 2 + Math.PI * 3 / 4 + separation,
                    end: Math.PI / 2
                }];

            let radius = drawOptions.radius;
            let transformString = drawOptions.transformString;
            this.updateKpiBands(radius, innerRadiusFactor, transformString, attrs);

            backgroudArc
                .innerRadius(radius * innerRadiusFactor)
                .outerRadius(radius)
                .startAngle(-Math.PI / 2)
                .endAngle(Math.PI / 2);

            this.backgroundArcPath
                .attr("d", backgroudArc)
                .attr("transform", transformString);

            let foregroundArc = this.foregroundArc;

            foregroundArc
                .innerRadius(radius * innerRadiusFactor)
                .outerRadius(radius)
                .startAngle(-Math.PI / 2);

            this.foregroundArcPath
                .datum({ endAngle: this.lastAngle })
                .attr("transform", transformString)
                .attr("d", foregroundArc);

            let innerRadiusOfArc = drawOptions.innerRadiusOfArc;
            let left = drawOptions.left;
            let top = drawOptions.top;
            let margin = drawOptions.margin;
            let height = drawOptions.height;
            let targetSettings = this.targetSettings;

            if (!this.settings.targetLine.show || !this.isValid() || !$.isNumeric(targetSettings.target)) {
                this.removeTargetElements();
            } else {
                if (targetSettings.min > targetSettings.target || targetSettings.max < targetSettings.target) {
                    this.removeTargetElements();
                } else {
                    this.updateTargetLine(radius, innerRadiusOfArc, left, top);
                    this.renderTarget(radius, height, drawOptions.width, margin);
                }
            }
            this.svg.attr('height', this.currentViewport.height).attr('width', this.currentViewport.width);
        }

        public getValueAngle(): number {
            let settings = this.data.targetSettings;
            let total = this.data.total;
            if (!this.isValid() || !$.isNumeric(total)) {
                return 0;
            }

            let adjustedTotal = Math.min(Math.max(total, settings.min), settings.max);
            let angle: number = (adjustedTotal - settings.min) / (settings.max - settings.min);

            return angle;
        }

        private createLabels(): GaugeLabel[] {
            let targetSettings = this.targetSettings;
            let arr: GaugeLabel[] = [];
            let label: GaugeLabel = null;

            let textProperties: TextProperties = {
                fontFamily: NewDataLabelUtils.LabelTextProperties.fontFamily,
                fontSize: PixelConverter.fromPoint(this.data.dataLabelsSettings.fontSize || NewDataLabelUtils.DefaultLabelFontSizeInPt),
                fontWeight: NewDataLabelUtils.LabelTextProperties.fontWeight,
            };

            let minFormatter = this.getFormatter(this.data.dataLabelsSettings, this.data.minColumnMetadata, targetSettings.max);
            textProperties.text = minFormatter.format(targetSettings.min);
            label = {
                size: {
                    width: TextMeasurementService.measureSvgTextWidth(textProperties),
                    height: TextMeasurementService.estimateSvgTextHeight(textProperties)
                },
                text: textProperties.text
            };
            arr.push(label);

            let maxFormatter = this.getFormatter(this.data.dataLabelsSettings, this.data.maxColumnMetadata, targetSettings.max);
            textProperties.text = maxFormatter.format(targetSettings.max);
            label = {
                size: {
                    width: TextMeasurementService.measureSvgTextWidth(textProperties),
                    height: TextMeasurementService.estimateSvgTextHeight(textProperties)
                },
                text: textProperties.text
            };

            arr.push(label);
            return arr;
        }

        private updateInternal(suppressAnimations: boolean) {
            let height = this.gaugeVisualProperties.height;
            let width = this.gaugeVisualProperties.width;
            let radius = this.gaugeVisualProperties.radius;
            let margin: IMargin = this.margin;
            let duration = AnimatorCommon.GetAnimationDuration(this.animator, suppressAnimations);

            let data = this.data;
            let lastAngle = this.lastAngle = -Math.PI / 2 + Math.PI * this.getValueAngle();
            this.foregroundArcPath
                .transition()
                .ease(this.settings.transition.ease)
                .duration(duration)
                .call(this.arcTween, [lastAngle, this.foregroundArc]);

            this.renderMinMaxLabels(this.labels, radius, height, width, margin);
            this.updateVisualConfigurations();
            this.updateVisualStyles();
            if (this.tooltipsEnabled) {
                TooltipManager.addTooltip(this.foregroundArcPath, (tooltipEvent: TooltipEvent) => data.tooltipInfo);
                TooltipManager.addTooltip(this.backgroundArcPath, (tooltipEvent: TooltipEvent) => data.tooltipInfo);
            }
        }

        private updateVisualStyles() {
            let fillColor: string = this.data.dataLabelsSettings.labelColor || this.style.labelText.color.value;
            this.mainGraphicsContext.selectAll('text')
                .style({
                    'fill': fillColor,
                });
        }

        private updateVisualConfigurations() {
            let configOptions = this.settings;
            let dataPointSettings = this.data.dataPointSettings;

            this.mainGraphicsContext
                .select('line')
                .attr({
                    stroke: dataPointSettings.targetColor,
                    'stroke-width': configOptions.targetLine.thickness,
                });

            this.backgroundArcPath.style('fill', configOptions.arcColors.background);
            this.foregroundArcPath.style('fill', dataPointSettings.fillColor);
        }

        private renderMinMaxLabels(ticks: GaugeLabel[], radius: number, height: number, width: number, margin: IMargin) {
            this.svg.selectAll(Gauge.LabelText.selector).remove();
            if (!this.data.dataLabelsSettings.show) return;

            let total = ticks.length;
            let divisor = total - 1;
            let position = this.getLabelsPosition();
            let fontSize = PixelConverter.fromPoint(this.data.dataLabelsSettings.fontSize || NewDataLabelUtils.DefaultLabelFontSizeInPt);
            let padding = this.settings.labels.padding;
            for (let index = 0; index < total; index++) {
                let y = this.gaugeVisualProperties.top;
                let textProperties: TextProperties = {
                    text: ticks[index].text,
                    fontFamily: NewDataLabelUtils.LabelTextProperties.fontFamily,
                    fontSize: PixelConverter.fromPoint(this.data.dataLabelsSettings.fontSize || NewDataLabelUtils.DefaultLabelFontSizeInPt),
                    fontWeight: NewDataLabelUtils.LabelTextProperties.fontWeight,
                };

                if (this.showSideNumbersLabelText()) {

                    let x = (margin.left + width / 2) - (radius * Math.cos(Math.PI * index / divisor));
                    let anchor: string;
                    let onRight = index === 1;
                    let onBottom = false;

                    if (position === GaugeLabelPosition.Bottom) {
                        // If this is a min or max label and we're showing them on the bottom rather than the sides
                        // Adjust the label display properties to appear under the arc
                        onBottom = true;
                        y += padding;

                        // Align the labels with the outer edge of the arc
                        anchor = onRight ? 'end' : 'start';
                        textProperties.text = TextMeasurementService.getTailoredTextOrDefault(textProperties, radius);
                    }
                    else {
                        // For all other labels, display around the arc
                        anchor = onRight ? 'start' : 'end';
                        x += padding * (onRight ? 1 : -1);
                    }

                    let text = this.mainGraphicsContext
                        .append('text')
                        .attr({
                            'x': x,
                            'y': y,
                            'dy': onBottom ? fontSize : 0,
                            'class': Gauge.LabelText.class
                        })
                        .style({
                            'text-anchor': anchor,
                            'font-size': fontSize
                        })
                        .text(textProperties.text)
                        .append('title').text(textProperties.text);

                    if (!onBottom)
                        this.truncateTextIfNeeded(text, x, onRight);
                }
            }
        }

        private truncateTextIfNeeded(text: D3.Selection, positionX: number, onRight: boolean) {
            let availableSpace = (onRight ? this.currentViewport.width - positionX : positionX);
            text.call(AxisHelper.LabelLayoutStrategy.clip,
                availableSpace,
                TextMeasurementService.svgEllipsis);
        }

        private getFormatter(dataLabelSettings: VisualDataLabelsSettings, metadataColumn: DataViewMetadataColumn, maxValue?: number): IValueFormatter {
            let max = dataLabelSettings.displayUnits === 0 ? maxValue : null;
            if (!metadataColumn || !metadataColumn.objects || _.isEmpty(DataViewObjects.getValue<string>(metadataColumn.objects, Gauge.formatStringProp))) {
                metadataColumn = this.data.metadataColumn;
            }

            let formatString: string = valueFormatter.getFormatString(metadataColumn, Gauge.formatStringProp);
            let precision = dataLabelUtils.getLabelPrecision(dataLabelSettings.precision, formatString);
            let valueFormatterOptions: ValueFormatterOptions = dataLabelUtils.getOptionsForLabelFormatter(dataLabelSettings, formatString, max, precision);
            valueFormatterOptions.formatSingleValues = dataLabelSettings.displayUnits > 0 ? false : true;
            return valueFormatter.create(valueFormatterOptions);
        }

        private renderTarget(radius: number, height: number, width: number, margin: IMargin) {
            let targetSettings = this.targetSettings;

            let target = targetSettings.target;
            let tRatio = this.getTargetRatio();
            let top = (radius + (height - radius) / 2 + margin.top);
            let flag = tRatio > 0.5;
            let padding = this.settings.labels.padding;
            let anchor = flag ? 'start' : 'end';
            let formatter = this.getFormatter(this.data.dataLabelsSettings, this.data.targetColumnMetadata, targetSettings.max);
            let maxRatio = Math.asin(Gauge.MinDistanceFromBottom / radius) / Math.PI;

            let finalRatio = tRatio < maxRatio || tRatio > (1 - maxRatio)
                ? flag
                    ? 1 - maxRatio
                    : maxRatio
                : tRatio;

            let targetX = (margin.left + width / 2) - ((radius + padding) * Math.cos(Math.PI * finalRatio));
            let targetY = top - ((radius + padding) * Math.sin(Math.PI * finalRatio));

            if (!this.targetText) {
                this.targetText = this.mainGraphicsContext
                    .append('text')
                    .classed(Gauge.TargetText.class, true);
            }

            this.targetText
                .attr({
                    'x': targetX,
                    'y': targetY,
                })
                .style({
                    'text-anchor': anchor,
                    'display': this.showTargetLabel ? '' : 'none',
                    'font-size': this.style.labelText.fontSize
                })
                .text(formatter.format(target));

            this.truncateTextIfNeeded(this.targetText, targetX, flag);
            this.targetText.call(tooltipUtils.tooltipUpdate, [formatter.format(target)]);

            if (!this.targetConnector) {
                this.targetConnector = this.mainGraphicsContext
                    .append('line')
                    .classed(Gauge.TargetConnector.class, true);
            }

            // Hide the target connector if the text is going to align with the target line in the arc
            // It should only be shown if the target text is displaced (ex. when the target is very close to min/max)
            if (tRatio === finalRatio) {
                this.targetConnector.style('display', 'none');
            }
            else {
                this.targetConnector
                    .attr({
                        'x1': (margin.left + width / 2) - (radius * Math.cos(Math.PI * tRatio)),
                        'y1': top - (radius * Math.sin(Math.PI * tRatio)),
                        'x2': targetX,
                        'y2': targetY
                    })
                    .style({
                        'stroke-width': this.settings.targetLine.thickness,
                        'stroke': this.settings.targetLine.color,
                        'display': ''
                    });
            }
        }

        private arcTween(transition, arr): void {
            transition.attrTween('d', (d) => {
                let interpolate = d3.interpolate(d.endAngle, arr[0]);
                return (t) => {
                    d.endAngle = interpolate(t);
                    return arr[1](d);
                };
            });
        }

        private getLabelsPosition(): GaugeLabelPosition {
            if (!this.data || !this.data.dataLabelsSettings.show || _.isEmpty(this.labels)) {
                return GaugeLabelPosition.None;
            }

            let textWidth = this.labels[0].size.width + this.labels[1].size.width;
            let textHeight = this.labels[0].size.height;
            if (this.currentViewport.height - textHeight > (this.currentViewport.width - textWidth) / 2) {
                return GaugeLabelPosition.Bottom;
            }

            // We want to show the start/end ticks on the bottom when there
            // is insufficient space for the left and right label text
            if (this.gaugeVisualProperties) {
                let labels = this.labels;
                let visualWhitespace = (this.currentViewport.width - (this.gaugeVisualProperties.radius * 2)) / 2;
                let maxLabelWidth = visualWhitespace - this.settings.labels.padding;

                for (let label of labels) {
                    if (label.size.width > maxLabelWidth)
                        return GaugeLabelPosition.Bottom;
                }
            }

            return GaugeLabelPosition.LeftRight;
        }

        private setMargins(): void {
            // Used for mobile phones.
            if (this.gaugeSmallViewPortProperties) {
                if (this.gaugeSmallViewPortProperties.smallGaugeMarginsOnSmallViewPort && (this.currentViewport.height < this.gaugeSmallViewPortProperties.MinHeightGaugeSideNumbersVisible)) {
                    let margins = this.gaugeSmallViewPortProperties.GaugeMarginsOnSmallViewPort;
                    this.margin = { top: margins, bottom: margins, left: margins, right: margins };
                    return;
                }
            }

            let labelsPosition = this.getLabelsPosition();
            this.margin = {
                bottom: 0, 
                left: 0,
                right: 0,
                top: this.showTargetLabel ? Gauge.DefaultTopBottomMargin : 0
            };

            if (labelsPosition === GaugeLabelPosition.Bottom) {
                this.margin.bottom = this.labels[0].size.height + this.settings.labels.padding * 2;

                if (this.showTargetLabel) {
                    let targetSettings = this.targetSettings;
                    // If we're showing the target label, only reduce the margin on the side that doesn't have a target label
                    let tRatio = (targetSettings.target - targetSettings.min) / (targetSettings.max - targetSettings.min);

                    if (tRatio > 0.5)
                        this.margin.left = Gauge.ReducedLeftRightMargin;
                    else
                        this.margin.right = Gauge.ReducedLeftRightMargin;
                }
            }
            else if (labelsPosition === GaugeLabelPosition.LeftRight) {
                let padding = this.settings.labels.padding * 2;
                this.margin.left = this.labels[0].size.width + padding;
                this.margin.right = this.labels[1].size.width + padding;
                this.margin.bottom = padding;
            }
        }

        private showSideNumbersLabelText(): boolean {
            if (this.gaugeSmallViewPortProperties) {
                if (this.gaugeSmallViewPortProperties.hideGaugeSideNumbersOnSmallViewPort) {
                    if (this.currentViewport.height < this.gaugeSmallViewPortProperties.MinHeightGaugeSideNumbersVisible) {
                        return false;
                    }
                }
            }

            return true;
        }
    }
}