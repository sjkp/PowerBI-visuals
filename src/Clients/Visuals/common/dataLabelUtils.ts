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
    import LabelStyle = labelStyle;

    export const enum PointLabelPosition {
        Above,
        Below,
    }

    export interface PointDataLabelsSettings extends VisualDataLabelsSettings {
        position: PointLabelPosition;
    }

    export interface LabelFormattedTextOptions {
        label: any;
        maxWidth?: number;
        format?: string;
        formatter?: IValueFormatter;
        fontSize?: number;
    }

    export interface VisualDataLabelsSettings {
        show: boolean;
        showLabelPerSeries?: boolean;
        isSeriesExpanded?: boolean;
        displayUnits?: number;
        showCategory?: boolean;
        position?: any;
        precision?: number;
        labelColor: string;
        categoryLabelColor?: string;
        fontSize?: number;
        labelStyle?: any;
    }

    /*
    Options for setting the labels card on the property pane
    */
    export interface VisualDataLabelsSettingsOptions {
        show: boolean;
        enumeration: ObjectEnumerationBuilder;
        dataLabelsSettings: VisualDataLabelsSettings;
        displayUnits?: boolean;
        precision?: boolean;
        position?: boolean;
        positionObject?: string[];
        selector?: powerbi.data.Selector;
        fontSize?: boolean;
        showAll?: boolean;
        labelDensity?: boolean;
        labelStyle?: boolean;
    }

    export interface LabelEnabledDataPoint {
        //for collistion detection use
        labelX?: number;
        labelY?: number;
        //for overriding color from label settings
        labelFill?: string;
        //for display units and precision
        labeltext?: string;
        //taken from column metadata
        labelFormatString?: string;
        isLabelInside?: boolean;
        labelFontSize?: number;
    }

    export interface IColumnFormatterCache {
        [column: string]: IValueFormatter;
        defaultFormatter?: IValueFormatter;
    }

    export interface IColumnFormatterCacheManager {
        cache: IColumnFormatterCache;
        getOrCreate: (formatString: string, labelSetting: VisualDataLabelsSettings, value2?: number) => IValueFormatter;
    }

    export interface LabelPosition {
        y: (d: any, i: number) => number;
        x: (d: any, i: number) => number;
    }

    export interface ILabelLayout {
        labelText: (d: any) => string;
        labelLayout: LabelPosition;
        filter: (d: any) => boolean;
        style: {};
    }

    export interface DataLabelObject extends DataViewObject {
        show: boolean;
        color: Fill;
        labelDisplayUnits: number;
        labelPrecision?: number;
        labelPosition: any;
        fontSize?: number;
        showAll?: boolean;
        showSeries?: boolean;
        labelDensity?: string;
        labelStyle?: any;
    }

    export module dataLabelUtils {
        export const minLabelFontSize: number = 8;
        export const labelMargin: number = 8;
        export const maxLabelWidth: number = 50;
        export const defaultColumnLabelMargin: number = 5;
        export const defaultColumnHalfLabelHeight: number = 4;
        export const defaultLabelDensity: string = "50";
        export const DefaultDy: string = '-0.15em';
        export const DefaultFontSizeInPt = 9;
        export const StandardFontFamily = Font.Family.regular.css;
        export const LabelTextProperties: TextProperties = {
            fontFamily: Font.Family.regularSecondary.css,
            fontSize: PixelConverter.fromPoint(DefaultFontSizeInPt),
            fontWeight: 'normal',
        };
        export const defaultLabelColor = "#777777";
        export const defaultInsideLabelColor = "#ffffff";
        export const hundredPercentFormat = "0.00 %;-0.00 %;0.00 %";
        
        export const defaultLabelPrecision: number = undefined;
        const defaultCountLabelPrecision: number = 0;

        const labelGraphicsContextClass: ClassAndSelector = createClassAndSelector('labels');
        const linesGraphicsContextClass: ClassAndSelector = createClassAndSelector('lines');
        const labelsClass: ClassAndSelector = createClassAndSelector('data-labels');
        const lineClass: ClassAndSelector = createClassAndSelector('line-label');

        export function updateLabelSettingsFromLabelsObject(labelsObj: DataLabelObject, labelSettings: VisualDataLabelsSettings): void {
            if (labelsObj) {
                if (labelsObj.show !== undefined)
                    labelSettings.show = labelsObj.show;
                if (labelsObj.showSeries !== undefined)
                    labelSettings.show = labelsObj.showSeries;
                if (labelsObj.color !== undefined)
                    labelSettings.labelColor = labelsObj.color.solid.color;
                if (labelsObj.labelDisplayUnits !== undefined)
                    labelSettings.displayUnits = labelsObj.labelDisplayUnits;
                if (labelsObj.labelPrecision !== undefined)
                    labelSettings.precision = (labelsObj.labelPrecision >= 0) ? labelsObj.labelPrecision : defaultLabelPrecision;
                if (labelsObj.fontSize !== undefined)
                    labelSettings.fontSize = labelsObj.fontSize;
                if (labelsObj.showAll !== undefined)
                    labelSettings.showLabelPerSeries = labelsObj.showAll;
                if (labelsObj.labelStyle !== undefined)
                    labelSettings.labelStyle = labelsObj.labelStyle;
                if(labelsObj.labelPosition) {
                    labelSettings.position = labelsObj.labelPosition;
                }
            }
        }

        export function updateLineChartLabelSettingsFromLabelsObject(labelsObj: DataLabelObject, labelSettings: LineChartDataLabelsSettings): void {

            updateLabelSettingsFromLabelsObject(labelsObj, labelSettings);

            if (labelsObj && labelsObj.labelDensity !== undefined)
                labelSettings.labelDensity = labelsObj.labelDensity;
        }

        export function getDefaultLabelSettings(show: boolean = false, labelColor?: string, fontSize?: number): VisualDataLabelsSettings {
            return {
                show: show,
                position: PointLabelPosition.Above,
                displayUnits: 0,
                precision: defaultLabelPrecision,
                labelColor: labelColor || defaultLabelColor,
                fontSize: fontSize || DefaultFontSizeInPt,
            };
        }

        export function getDefaultCardLabelSettings(labelColor: string, categoryLabelColor: string, fontSize?: number): VisualDataLabelsSettings {
            let labelSettings = getDefaultLabelSettings(true, labelColor, fontSize);
            labelSettings.showCategory = true;
            labelSettings.categoryLabelColor = categoryLabelColor;
            return labelSettings;
        }

        export function getDefaultTreemapLabelSettings(): VisualDataLabelsSettings {
            return {
                show: false,
                displayUnits: 0,
                precision: defaultLabelPrecision,
                labelColor: defaultInsideLabelColor,
                showCategory: true,
            };
        }

        export function getDefaultSunburstLabelSettings(): VisualDataLabelsSettings {
            return {
                show: false,                                
                labelColor: defaultInsideLabelColor,
                fontSize: DefaultFontSizeInPt,
                displayUnits: 0,
                precision: defaultLabelPrecision,
                showCategory: true,
            };
        }

        export function getDefaultColumnLabelSettings(isLabelPositionInside: boolean): VisualDataLabelsSettings {
            let labelSettings = getDefaultLabelSettings(false, undefined);
            labelSettings.position = null;
            labelSettings.labelColor = undefined;
            return labelSettings;
        }

        export function getDefaultPointLabelSettings(): PointDataLabelsSettings {
            return {
                show: false,
                position: PointLabelPosition.Above,
                displayUnits: 0,
                precision: defaultLabelPrecision,
                labelColor: defaultLabelColor,
                fontSize: DefaultFontSizeInPt,
            };
        }

        export function getDefaultLineChartLabelSettings(isComboChart?: boolean): LineChartDataLabelsSettings {
            return {
                show: false,
                position: PointLabelPosition.Above,
                displayUnits: 0,
                precision: defaultLabelPrecision,
                labelColor: defaultLabelColor,
                fontSize: DefaultFontSizeInPt,
                labelDensity: defaultLabelDensity,
            };
        }

        export function getDefaultMapLabelSettings(): PointDataLabelsSettings {
            return {
                show: false,
                showCategory: false,
                position: PointLabelPosition.Above,
                displayUnits: 0,
                precision: defaultLabelPrecision,
                labelColor: defaultInsideLabelColor,
                fontSize: DefaultFontSizeInPt,
            };
        }

        export function getDefaultDonutLabelSettings(): VisualDataLabelsSettings {
            let labelSettings = dataLabelUtils.getDefaultLabelSettings(true, defaultLabelColor, DefaultFontSizeInPt);
            labelSettings.labelStyle = LabelStyle.category;
            return labelSettings;
        }

        export function getDefaultGaugeLabelSettings(): VisualDataLabelsSettings {
            return {
                show: true,
                displayUnits: 0,
                precision: defaultLabelPrecision,
                labelColor: null,
                position: null,
                fontSize: dataLabelUtils.minLabelFontSize,
            };
        }

        export function getDefaultKpiLabelSettings(): VisualDataLabelsSettings {
            return {
                show: false,
                displayUnits: 0,
                precision: defaultLabelPrecision,
                labelColor: defaultLabelColor,
                position: null,
                showCategory: true,
            };
        }

        export function getLabelPrecision(precision: number, format: string): number {
            debug.assertAnyValue(format, 'format');

            if (precision !== defaultLabelPrecision)
                return precision;

            if (format === 'g' || format === 'G')
                return;

            if (format) {
                // Calculate precision from positive format by default
                let positiveFormat = NumberFormat.getComponents(format).positive;
                let formatMetadata = NumberFormat.getCustomFormatMetadata(positiveFormat, true /*calculatePrecision*/);
                if (formatMetadata.hasDots) {
                    return formatMetadata.precision;
                }
            }

            // For count fields we do not want a precision by default
            return defaultCountLabelPrecision;
        }

        export function drawDefaultLabelsForDataPointChart(data: any[], context: D3.Selection, layout: ILabelLayout,
            viewport: IViewport, isAnimator: boolean = false, animationDuration?: number, hasSelection?: boolean): D3.UpdateSelection {
            debug.assertValue(data, 'data cannot be null or undefined');

            // Hide and reposition labels that overlap
            let dataLabelManager = new DataLabelManager();
            let filteredData = dataLabelManager.hideCollidedLabels(viewport, data, layout);

            let hasAnimation = isAnimator && !!animationDuration;
            let labels = selectLabels(filteredData, context, false, hasAnimation);

            if (!labels)
                return;

            if (hasAnimation) {
                labels
                    .text((d: LabelEnabledDataPoint) => d.labeltext)
                    .transition()
                    .duration(animationDuration)
                    .style(layout.style)
                    .style('opacity', hasSelection ? (d: SelectableDataPoint) => ColumnUtil.getFillOpacity(d.selected, false, hasSelection, false) : 1)
                    .attr({ x: (d: LabelEnabledDataPoint) => d.labelX, y: (d: LabelEnabledDataPoint) => d.labelY });

                labels
                    .exit()
                    .transition()
                    .duration(animationDuration)
                    .style('opacity', 0) //fade out labels that are removed
                    .remove();
            }
            else {
                labels
                    .attr({ x: (d: LabelEnabledDataPoint) => d.labelX, y: (d: LabelEnabledDataPoint) => d.labelY })
                    .text((d: LabelEnabledDataPoint) => d.labeltext)
                    .style(layout.style);

                labels
                    .exit()
                    .remove();
            }

            return labels;
        }
       
        function selectLabels(filteredData: LabelEnabledDataPoint[], context: D3.Selection, isDonut: boolean = false, forAnimation: boolean = false): D3.UpdateSelection {

            // Check for a case where resizing leaves no labels - then we need to remove the labels 'g'
            if (filteredData.length === 0) {
                cleanDataLabels(context, true);
                return null;
            }

            if (context.select(labelGraphicsContextClass.selector).empty())
                context.append('g').classed(labelGraphicsContextClass.class, true);

            // line chart ViewModel has a special 'key' property for point identification since the 'identity' field is set to the series identity
            let hasKey: boolean = (<any>filteredData)[0].key != null;
            let hasDataPointIdentity: boolean = (<any>filteredData)[0].identity != null;
            let getIdentifier = hasKey ?
                (d: any) => d.key
                : hasDataPointIdentity ?
                    (d: SelectableDataPoint) => d.identity.getKey()
                    : undefined;

            let labels = isDonut ?
                context.select(labelGraphicsContextClass.selector).selectAll(labelsClass.selector).data(filteredData, (d: DonutArcDescriptor) => d.data.identity.getKey())
                : getIdentifier != null ?
                    context.select(labelGraphicsContextClass.selector).selectAll(labelsClass.selector).data(filteredData, getIdentifier)
                    : context.select(labelGraphicsContextClass.selector).selectAll(labelsClass.selector).data(filteredData);

            let newLabels = labels.enter()
                .append('text')
                .classed(labelsClass.class, true);
            if (forAnimation)
                newLabels.style('opacity', 0);

            return labels;
        }

        export function cleanDataLabels(context: D3.Selection, removeLines: boolean = false) {
            let empty = [];
            let labels = context.selectAll(labelsClass.selector).data(empty);
            labels.exit().remove();
            context.selectAll(labelGraphicsContextClass.selector).remove();
            if (removeLines) {
                let lines = context.selectAll(lineClass.selector).data(empty);
                lines.exit().remove();
                context.selectAll(linesGraphicsContextClass.selector).remove();
            }
        }

        export function setHighlightedLabelsOpacity(context: D3.Selection, hasSelection: boolean, hasHighlights: boolean) {
            context.selectAll(labelsClass.selector).style("fill-opacity", (d: ColumnChartDataPoint) => {
                let labelOpacity = ColumnUtil.getFillOpacity(d.selected, d.highlight, !d.highlight && hasSelection, !d.selected && hasHighlights) < 1 ? 0 : 1;
                return labelOpacity;
            });
        }

        export function getLabelFormattedText(options: LabelFormattedTextOptions): string {
            let properties: TextProperties = {
                text: options.formatter
                    ? options.formatter.format(options.label)
                    : formattingService.formatValue(options.label, options.format),
                fontFamily: LabelTextProperties.fontFamily,
                fontSize: PixelConverter.fromPoint(options.fontSize),
                fontWeight: LabelTextProperties.fontWeight,
            };
            return TextMeasurementService.getTailoredTextOrDefault(properties, options.maxWidth ? options.maxWidth : maxLabelWidth);
        }

        export function getLabelLayoutXYForWaterfall(xAxisProperties: IAxisProperties, categoryWidth: number, yAxisProperties: IAxisProperties, dataDomain: number[]): LabelPosition {
            return {
                x: (d: WaterfallChartDataPoint) => xAxisProperties.scale(d.categoryIndex) + (categoryWidth / 2),
                y: (d: WaterfallChartDataPoint) => getWaterfallLabelYPosition(yAxisProperties.scale, d, dataDomain)
            };
        }

        function getWaterfallLabelYPosition(scale: D3.Scale.GenericScale<any>, d: WaterfallChartDataPoint, dataDomain: number[]): number {

            let yValue = scale(0) - scale(Math.abs(d.value));
            let yPos = scale(d.position);
            let scaleMinDomain = scale(dataDomain[0]);
            let endPosition = scale(d.position + d.value);

            if (d.value < 0) {
                let properties: TextProperties = {
                    text: d.labeltext,
                    fontFamily: dataLabelUtils.LabelTextProperties.fontFamily,
                    fontSize: dataLabelUtils.LabelTextProperties.fontSize,
                    fontWeight: dataLabelUtils.LabelTextProperties.fontWeight,
                };
                let outsideBelowPosition = yPos + yValue + TextMeasurementService.estimateSvgTextHeight(properties);
                // Try to honor the position, but if the label doesn't fit where specified, then swap the position.
                if (scaleMinDomain > outsideBelowPosition) {
                    return outsideBelowPosition;
                }
            }
            else {
                let outsideAbovePosition = yPos - yValue - dataLabelUtils.labelMargin;
                // Try to honor the position, but if the label doesn't fit where specified, then swap the position.
                if (outsideAbovePosition > 0) {
                    return outsideAbovePosition;
                }
            }
            d.isLabelInside = true;
            return getWaterfallInsideLabelYPosition(yPos, endPosition, scaleMinDomain);
        }

        function getWaterfallInsideLabelYPosition(startPosition: number, endPosition: number, scaleMinDomain: number): number {
            // Get the start and end position of the column
            // If the start or end is outside of the visual because of clipping - adjust the position
            startPosition = startPosition < 0 ? 0 : startPosition;
            startPosition = startPosition > scaleMinDomain ? scaleMinDomain : startPosition;

            endPosition = endPosition < 0 ? 0 : endPosition;
            endPosition = endPosition > scaleMinDomain ? scaleMinDomain : endPosition;

            return (Math.abs(endPosition - startPosition) / 2) + Math.min(startPosition, endPosition);
        }

        export function doesDataLabelFitInShape(d: WaterfallChartDataPoint, yAxisProperties: IAxisProperties, layout: WaterfallLayout): boolean {

            if (d == null || d.value === null)
                return false;

            let properties: TextProperties = {
                text: layout.labelText(d),
                fontFamily: dataLabelUtils.LabelTextProperties.fontFamily,
                fontSize: dataLabelUtils.LabelTextProperties.fontSize,
                fontWeight: dataLabelUtils.LabelTextProperties.fontWeight,
            };

            let outsidePosition = WaterfallChart.getRectTop(yAxisProperties.scale, d.position, d.value) - dataLabelUtils.labelMargin;

            // The shape is fit to be outside
            if (outsidePosition > 0)
                return true;

            let textWidth = TextMeasurementService.measureSvgTextWidth(properties);
            let textHeight = TextMeasurementService.estimateSvgTextHeight(properties);

            let shapeWidth = layout.categoryWidth;
            let shapeHeight = Math.abs(AxisHelper.diffScaled(yAxisProperties.scale, Math.max(0, Math.abs(d.value)), 0));

            //checking that labels aren't greater than shape
            if ((textWidth > shapeWidth) || (textHeight > shapeHeight))
                return false;
            return true;
        }

        export function getMapLabelLayout(labelSettings: PointDataLabelsSettings): ILabelLayout {

            return {
                labelText: (d: MapVisualDataPoint) => {
                    return getLabelFormattedText({
                        label: d.labeltext,
                        fontSize: labelSettings.fontSize
                    });
                },
                labelLayout: {
                    x: (d: MapVisualDataPoint) => d.x,
                    y: (d: MapVisualDataPoint) => {
                        let margin = d.radius + labelMargin;
                        return labelSettings.position === PointLabelPosition.Above ? d.y - margin : d.y + margin;
                    },
                },
                filter: (d: MapVisualDataPoint) => {
                    return (d != null && d.labeltext != null);
                },
                style: {
                    'fill': (d: MapVisualDataPoint) => d.labelFill,
                    'font-size': PixelConverter.fromPoint(labelSettings.fontSize),
                },
            };
        }

        export function getColumnChartLabelLayout(
            data: ColumnChartData,
            labelLayoutXY: any,
            isColumn: boolean,
            isHundredPercent: boolean,
            axisFormatter: IValueFormatter,
            axisOptions: ColumnAxisOptions,
            interactivityService: IInteractivityService,
            visualWidth?: number): ILabelLayout {

            let formatOverride: string = (isHundredPercent) ? hundredPercentFormat : null;
            let formattersCache = createColumnFormatterCacheManager();
            let hasSelection = interactivityService ? interactivityService.hasSelection() : false;

            return {
                labelText: (d: ColumnChartDataPoint) => {
                    let formatString = (formatOverride != null) ? formatOverride : d.labelFormatString;
                    let value2: number = getDisplayUnitValueFromAxisFormatter(axisFormatter, d.labelSettings);
                    let formatter = formattersCache.getOrCreate(formatString, d.labelSettings, value2);
                    return getLabelFormattedText({
                        label: formatter.format(d.value),
                        maxWidth: maxLabelWidth
                    });
                },
                labelLayout: labelLayoutXY,
                filter: (d: ColumnChartDataPoint) => dataLabelUtils.getColumnChartLabelFilter(d, hasSelection, data.hasHighlights, axisOptions, visualWidth),
                style: {
                    'fill': (d: ColumnChartDataPoint) => d.labelFill,
                    'text-anchor': isColumn ? 'middle' : 'start',
                },
            };
        }
        
        /**
         * Valide for stacked column/bar chart and 100% stacked column/bar chart,
         * that labels that should to be inside the shape aren't bigger then shapes.
         */
        function validateLabelsSize(d: ColumnChartDataPoint, axisOptions: ColumnAxisOptions, visualWidth?: number): boolean {
            let xScale = axisOptions.xScale;
            let yScale = axisOptions.yScale;
            let columnWidth = axisOptions.columnWidth;
            let properties: TextProperties = {
                text: d.labeltext,
                fontFamily: dataLabelUtils.LabelTextProperties.fontFamily,
                fontSize: dataLabelUtils.LabelTextProperties.fontSize,
                fontWeight: dataLabelUtils.LabelTextProperties.fontWeight,
            };
            let textWidth = TextMeasurementService.measureSvgTextWidth(properties);
            let textHeight = TextMeasurementService.estimateSvgTextHeight(properties);
            let shapeWidth, shapeHeight;
            let inside = false;
            let outsidePosition: number = ColumnUtil.calculatePosition(d, axisOptions);
            switch (d.chartType) {
                case ColumnChartType.stackedBar:
                case ColumnChartType.hundredPercentStackedBar:
                    // if the series isn't last or the label doesn't fit where specified, then it should be inside 
                    if (!d.lastSeries || (outsidePosition + textWidth > visualWidth) || d.chartType === ColumnChartType.hundredPercentStackedBar) {
                        shapeWidth = -StackedUtil.getSize(xScale, d.valueAbsolute);
                        shapeHeight = columnWidth;
                        inside = true;
                    }
                    break;
                case ColumnChartType.clusteredBar:
                   
                    // if the label doesn't fit where specified, then it should be inside 
                    if ((outsidePosition + textWidth) > visualWidth) {
                        shapeWidth = Math.abs(AxisHelper.diffScaled(xScale, 0, d.value));
                        shapeHeight = columnWidth;
                        inside = true;
                    }
                    break;
                case ColumnChartType.stackedColumn:
                case ColumnChartType.hundredPercentStackedColumn:
                    // if the series isn't last or the label doesn't fit where specified, then it should be inside 
                    if (!d.lastSeries || outsidePosition <= 0 || d.chartType === ColumnChartType.hundredPercentStackedColumn) {
                        shapeWidth = columnWidth;
                        shapeHeight = StackedUtil.getSize(yScale, d.valueAbsolute);
                        inside = true;
                    }
                    break;
                case ColumnChartType.clusteredColumn:
                    // if the label doesn't fit where specified, then it should be inside 
                    if (outsidePosition <= 0) {
                        shapeWidth = columnWidth;
                        shapeHeight = Math.abs(AxisHelper.diffScaled(yScale, 0, d.value));
                        inside = true;
                    }
                    break;
                default:
                    return true;
            }

            //checking that labels aren't greater than shape
            if (inside && ((textWidth > shapeWidth) || textHeight > shapeHeight)) return false;
            return true;
        }

        export function getColumnChartLabelFilter(d: ColumnChartDataPoint, hasSelection: boolean, hasHighlights: boolean, axisOptions: ColumnAxisOptions, visualWidth?: number): any {
            //labels of dimmed are hidden
            let shapesOpacity = hasSelection ? ColumnUtil.getFillOpacity(d.selected, d.highlight, !d.highlight && hasSelection, !d.selected && hasHighlights) :
                ColumnUtil.getFillOpacity(d.selected, d.highlight, hasSelection, hasHighlights);
            return (d != null && d.value != null && validateLabelsSize(d, axisOptions, visualWidth) && shapesOpacity === 1);
        }

        export function getScatterChartLabelLayout(xScale: D3.Scale.GenericScale<any>, yScale: D3.Scale.GenericScale<any>, labelSettings: PointDataLabelsSettings, viewport: IViewport, sizeRange: NumberRange): ILabelLayout {

            return {
                labelText: (d: ScatterChartDataPoint) => {
                    return getLabelFormattedText({
                        label: d.formattedCategory.getValue(),
                        maxWidth: maxLabelWidth * 2.0
                    });
                },
                labelLayout: {
                    x: (d: ScatterChartDataPoint) => xScale(d.x),
                    y: (d: ScatterChartDataPoint) => {
                        let margin = ScatterChart.getBubbleRadius(d.radius, sizeRange, viewport) + labelMargin;
                        return labelSettings.position === PointLabelPosition.Above ? yScale(d.y) - margin : yScale(d.y) + margin;
                    },
                },
                filter: (d: ScatterChartDataPoint) => {
                    return (d != null && d.formattedCategory.getValue() != null);
                },
                style: {
                    'fill': (d: ScatterChartDataPoint) => d.labelFill,
                },
            };
        }

        export function getLineChartLabelLayout(xScale: D3.Scale.GenericScale<any>, yScale: D3.Scale.GenericScale<any>, labelSettings: PointDataLabelsSettings, isScalar: boolean, axisFormatter: IValueFormatter): ILabelLayout {
            let formattersCache = createColumnFormatterCacheManager();

            return {
                labelText: (d: LineChartDataPoint) => {
                    let value2: number = getDisplayUnitValueFromAxisFormatter(axisFormatter, d.labelSettings);
                    let formatter = formattersCache.getOrCreate(d.labelFormatString, d.labelSettings, value2);
                    return getLabelFormattedText({ label: formatter.format(d.value) });
                },
                labelLayout: {
                    x: (d: LineChartDataPoint) => xScale(isScalar ? d.categoryValue : d.categoryIndex),
                    y: (d: LineChartDataPoint) => { return labelSettings.position === PointLabelPosition.Above ? yScale(d.value) - labelMargin : yScale(d.value) + labelMargin; },
                },
                filter: (d: LineChartDataPoint) => {
                    return (d != null && d.value != null);
                },
                style: {
                    'fill': (d: LineChartDataPoint) => d.labelFill,
                    'font-size': (d: LineChartDataPoint) => PixelConverter.fromPoint(d.labelSettings.fontSize),
                },
            };
        }

        export function enumerateDataLabels(
            options: VisualDataLabelsSettingsOptions): ObjectEnumerationBuilder {

            debug.assertValue(options, 'options');
            debug.assertValue(options.enumeration, 'enumeration');

            if (!options.dataLabelsSettings)
                return;

            let instance: VisualObjectInstance = {
                objectName: 'labels',
                selector: options.selector,
                properties: {},
            };

            if (options.show && options.selector) {
                instance.properties['showSeries'] = options.dataLabelsSettings.show;
            }
            else if (options.show) {
                instance.properties['show'] = options.dataLabelsSettings.show;
            }

            instance.properties['color'] = options.dataLabelsSettings.labelColor || defaultLabelColor;

            if (options.displayUnits) {
                instance.properties['labelDisplayUnits'] = options.dataLabelsSettings.displayUnits;
            }
            if (options.precision) {
                let precision = options.dataLabelsSettings.precision;
                instance.properties['labelPrecision'] = precision === defaultLabelPrecision ? null : precision;
            }
            if (options.position) {
                instance.properties['labelPosition'] = options.dataLabelsSettings.position;
                if (options.positionObject) {
                    debug.assert(!instance.validValues, '!instance.validValues');

                    instance.validValues = { 'labelPosition': options.positionObject };
                }
            }
            if (options.labelStyle)
                instance.properties['labelStyle'] = options.dataLabelsSettings.labelStyle;
            if (options.fontSize)
                instance.properties['fontSize'] = options.dataLabelsSettings.fontSize;
            if (options.labelDensity) {
                var lineChartSettings = <LineChartDataLabelsSettings> options.dataLabelsSettings;
                if (lineChartSettings)
                    instance.properties['labelDensity'] = lineChartSettings.labelDensity;
            }
            //Keep show all as the last property of the instance.
            if (options.showAll)
                instance.properties['showAll'] = options.dataLabelsSettings.showLabelPerSeries;

            return options.enumeration.pushInstance(instance);
        }

        export function enumerateCategoryLabels(enumeration: ObjectEnumerationBuilder, dataLabelsSettings: VisualDataLabelsSettings, withFill: boolean, isShowCategory: boolean = false, fontSize?: number): void {
            let labelSettings = (dataLabelsSettings)
                ? dataLabelsSettings
                : getDefaultPointLabelSettings();

            let instance: VisualObjectInstance = {
                objectName: 'categoryLabels',
                selector: null,
                properties: {
                    show: isShowCategory
                        ? labelSettings.showCategory
                        : labelSettings.show,
                    fontSize: dataLabelsSettings ? dataLabelsSettings.fontSize : DefaultFontSizeInPt,
                },
            };

            if (withFill) {
                instance.properties['color'] = labelSettings.categoryLabelColor
                    ? labelSettings.categoryLabelColor
                    : labelSettings.labelColor;
            }

            if (fontSize) {
                instance.properties['fontSize'] = fontSize;
            }

            enumeration.pushInstance(instance);
        }

        function getDisplayUnitValueFromAxisFormatter(axisFormatter: IValueFormatter, labelSettings: VisualDataLabelsSettings): number {
            if (axisFormatter && axisFormatter.displayUnit && labelSettings.displayUnits === 0)
                return axisFormatter.displayUnit.value;
            return null;
        }

        export function createColumnFormatterCacheManager(): IColumnFormatterCacheManager {
            return <IColumnFormatterCacheManager> {

                cache: { defaultFormatter: null, },
                getOrCreate(formatString: string, labelSetting: VisualDataLabelsSettings, value2?: number) {
                    if (formatString) {
                        let cacheKeyObject = {
                            formatString: formatString,
                            displayUnits: labelSetting.displayUnits,
                            precision: getLabelPrecision(labelSetting.precision, formatString),
                            value2: value2
                        };
                        let cacheKey = JSON.stringify(cacheKeyObject);
                        if (!this.cache[cacheKey])
                            this.cache[cacheKey] = valueFormatter.create(getOptionsForLabelFormatter(labelSetting, formatString, value2, cacheKeyObject.precision));
                        return this.cache[cacheKey];
                    }
                    if (!this.cache.defaultFormatter) {
                        this.cache.defaultFormatter = valueFormatter.create(getOptionsForLabelFormatter(labelSetting, formatString, value2, labelSetting.precision));
                    }
                    return this.cache.defaultFormatter;
                }
            };
        }

        export function getOptionsForLabelFormatter(labelSetting: VisualDataLabelsSettings, formatString: string, value2?: number, precision?: number): ValueFormatterOptions {
            return {
                displayUnitSystemType: DisplayUnitSystemType.DataLabels,
                format: formatString,
                precision: precision,
                value: labelSetting.displayUnits,
                value2: value2,
                allowFormatBeautification: true,
            };
        }

        export function isTextWidthOverflows(textWidth, maxTextWidth): boolean {
            return textWidth > maxTextWidth;
        };

        export function isTextHeightOverflows(textHeight, innerChordLength): boolean {
            return textHeight > innerChordLength;
        };
    }
}
