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

/// <reference path="./_references.ts"/>

module powerbi.visuals {
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    import createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;
    import PixelConverter = jsCommon.PixelConverter;

    export enum LegendIcon {
        Box,
        Circle,
        Line
    }

    export enum LegendPosition {
        Top,
        Bottom,
        Right,
        Left,
        None,
        TopCenter,
        BottomCenter,
        RightCenter,
        LeftCenter,
    }

    export interface LegendPosition2D {
        textPosition?: Point;
        glyphPosition?: Point;
    }

    export interface LegendDataPoint extends SelectableDataPoint, LegendPosition2D {
        label: string;
        color: string;
        icon: LegendIcon;
        category?: string;
        measure?: any;
        iconOnlyOnLabel?: boolean;
        tooltip?: string;
        layerNumber?: number;
    }

    export interface LegendData {
        title?: string;
        dataPoints: LegendDataPoint[];
        grouped?: boolean;
        labelColor?: string;
        fontSize?: number;
    }

    export const legendProps = {
        show: 'show',
        position: 'position',
        titleText: 'titleText',
        showTitle: 'showTitle',
        labelColor: 'labelColor',
        fontSize: 'fontSize',
    };

    export function createLegend(legendParentElement: JQuery,
        interactive: boolean,
        interactivityService: IInteractivityService,
        isScrollable: boolean = false,
        legendPosition: LegendPosition = LegendPosition.Top): ILegend {
        if (interactive) return new CartesianChartInteractiveLegend(legendParentElement);
        else return new SVGLegend(legendParentElement, legendPosition, interactivityService, isScrollable);
    }

    export interface ILegend {
        getMargins(): IViewport;

        isVisible(): boolean;
        changeOrientation(orientation: LegendPosition): void;
        getOrientation(): LegendPosition;
        drawLegend(data: LegendData, viewport: IViewport);
        /**
         * Reset the legend by clearing it
         */
        reset(): void;
    }

    export module Legend {
        export function isLeft(orientation: LegendPosition): boolean {
            switch (orientation) {
                case LegendPosition.Left:
                case LegendPosition.LeftCenter:
                    return true;
                default:
                    return false;
            }
        }

        export function isTop(orientation: LegendPosition): boolean {
            switch (orientation) {
                case LegendPosition.Top:
                case LegendPosition.TopCenter:
                    return true;
                default:
                    return false;
            }
        }

        export function positionChartArea(chartArea: D3.Selection, legend: ILegend): void {
            let legendMargins = legend.getMargins();
            let legendOrientation = legend.getOrientation();
            chartArea.style({
                'margin-left': Legend.isLeft(legendOrientation) ? legendMargins.width + 'px' : null,
                'margin-top': Legend.isTop(legendOrientation) ? legendMargins.height + 'px' : null,
            });
        }
    }

    interface TitleLayout {
        x: number;
        y: number;
        text: string;
        width: number;
        height: number;
    }

    const enum NavigationArrowType {
        Increase,
        Decrease
    }

    interface NavigationArrow {
        x: number;
        y: number;
        path: string;
        rotateTransform: string;
        type: NavigationArrowType;
    }

    interface LegendLayout {
        numberOfItems: number;
        title: TitleLayout;
        navigationArrows: NavigationArrow[];
    }
    
    interface LegendItem {
        dataPoint: LegendDataPoint;
        textProperties: TextProperties;
        width: number;
        desiredWidth: number;
        desiredOverMaxWidth: boolean;
    }

    export class SVGLegend implements ILegend {
        private orientation: LegendPosition;
        private viewport: IViewport;
        private parentViewport: IViewport;
        private svg: D3.Selection;
        private group: D3.Selection;
        private clearCatcher: D3.Selection;
        private element: JQuery;
        private interactivityService: IInteractivityService;
        private legendDataStartIndex = 0;
        private arrowPosWindow = 1;
        private data: LegendData;
        private isScrollable: boolean;

        private lastCalculatedWidth = 0;
        private visibleLegendWidth = 0;
        private visibleLegendHeight = 0;
        private legendFontSizeMarginDifference = 0;
        private legendFontSizeMarginValue = 0;

        public static DefaultFontSizeInPt = 8;
        private static LegendIconRadius = 5;
        private static LegendIconRadiusFactor = 5;
        private static MaxTextLength = 60;
        private static MaxTitleLength = 80;
        private static TextAndIconPadding = 5;
        private static TitlePadding = 15;
        private static LegendEdgeMariginWidth = 10;
        private static LegendMaxWidthFactor = 0.3;
        private static TopLegendHeight = 24;
        private static DefaultTextMargin = PixelConverter.fromPointToPixel(SVGLegend.DefaultFontSizeInPt);
        private static DefaultMaxLegendFactor = SVGLegend.MaxTitleLength / SVGLegend.DefaultTextMargin;
        private static LegendIconYRatio = 0.52;
        
        // Navigation Arrow constants
        private static LegendArrowOffset = 10;
        private static LegendArrowHeight = 15;
        private static LegendArrowWidth = 7.5;

        private static DefaultFontFamily: string = Font.Family.regular.css;
        private static DefaultTitleFontFamily: string = Font.Family.semibold.css;

        private static LegendItem: ClassAndSelector = createClassAndSelector('legendItem');
        private static LegendText: ClassAndSelector = createClassAndSelector('legendText');
        private static LegendIcon: ClassAndSelector = createClassAndSelector('legendIcon');
        private static LegendTitle: ClassAndSelector = createClassAndSelector('legendTitle');
        private static NavigationArrow: ClassAndSelector = createClassAndSelector('navArrow');

        constructor(
            element: JQuery,
            legendPosition: LegendPosition,
            interactivityService: IInteractivityService,
            isScrollable: boolean) {

            this.svg = d3.select(element.get(0)).append('svg').style('position', 'absolute');
            this.svg.style('display', 'inherit');
            this.svg.classed('legend', true);
            if (interactivityService)
                this.clearCatcher = appendClearCatcher(this.svg);
            this.group = this.svg.append('g').attr('id', 'legendGroup');
            this.interactivityService = interactivityService;
            this.isScrollable = isScrollable;
            this.element = element;
            this.changeOrientation(legendPosition);
            this.parentViewport = { height: 0, width: 0 };
            this.calculateViewport();
            this.updateLayout();
        }

        private updateLayout() {
            let legendViewport = this.viewport;
            let orientation = this.orientation;
            this.svg.attr({
                'height': legendViewport.height || (orientation === LegendPosition.None ? 0 : this.parentViewport.height),
                'width': legendViewport.width || (orientation === LegendPosition.None ? 0 : this.parentViewport.width)
            });

            let isRight = orientation === LegendPosition.Right || orientation === LegendPosition.RightCenter;
            let isBottom = orientation === LegendPosition.Bottom || orientation === LegendPosition.BottomCenter;
            this.svg.style({
                'margin-left': isRight ? (this.parentViewport.width - legendViewport.width) + 'px' : null,
                'margin-top': isBottom ? (this.parentViewport.height - legendViewport.height) + 'px' : null,
            });
        }

        private calculateViewport(): void {
            switch (this.orientation) {
                case LegendPosition.Top:
                case LegendPosition.Bottom:
                case LegendPosition.TopCenter:
                case LegendPosition.BottomCenter:
                    let pixelHeight = PixelConverter.fromPointToPixel(this.data && this.data.fontSize ? this.data.fontSize : SVGLegend.DefaultFontSizeInPt);
                    let fontHeightSize = SVGLegend.TopLegendHeight + (pixelHeight - SVGLegend.DefaultFontSizeInPt);
                    this.viewport = { height: fontHeightSize, width: 0 };
                    return;
                case LegendPosition.Right:
                case LegendPosition.Left:
                case LegendPosition.RightCenter:
                case LegendPosition.LeftCenter:
                    let width = this.lastCalculatedWidth ? this.lastCalculatedWidth : this.parentViewport.width * SVGLegend.LegendMaxWidthFactor;
                    this.viewport = { height: 0, width: width };
                    return;

                case LegendPosition.None:
                    this.viewport = { height: 0, width: 0 };
            }
        }

        public getMargins(): IViewport {
            return this.viewport;
        }

        public isVisible(): boolean {
            return this.orientation !== LegendPosition.None;
        }

        public changeOrientation(orientation: LegendPosition): void {
            if (orientation) {
                this.orientation = orientation;
            } else {
                this.orientation = LegendPosition.Top;
            }
            this.svg.attr('orientation', orientation);
        }

        public getOrientation(): LegendPosition {
            return this.orientation;
        }

        public drawLegend(data: LegendData, viewport: IViewport): void {
            // clone because we modify legend item label with ellipsis if it is truncated
            let clonedData = Prototype.inherit(data);
            let newDataPoints: LegendDataPoint[] = [];
            for (let dp of data.dataPoints) {
                newDataPoints.push(Prototype.inherit(dp));
            }
            clonedData.dataPoints = newDataPoints;

            this.setTooltipToLegendItems(clonedData);
            this.drawLegendInternal(clonedData, viewport, true /* perform auto width */);
        }

        public drawLegendInternal(data: LegendData, viewport: IViewport, autoWidth: boolean): void {
            this.parentViewport = viewport;
            this.data = data;

            if (this.interactivityService)
                this.interactivityService.applySelectionStateToData(data.dataPoints);

            if (data.dataPoints.length === 0) {
                this.changeOrientation(LegendPosition.None);
            }

            if (this.getOrientation() === LegendPosition.None) {
                data.dataPoints = [];
            }

            // Adding back the workaround for Legend Left/Right position for Map
            let mapControl = this.element.children(".mapControl");
            if (mapControl.length > 0 && !this.isTopOrBottom(this.orientation)) {
                mapControl.css("display", "inline-block");
            }

            this.calculateViewport();

            let layout = this.calculateLayout(data, autoWidth);
            let titleLayout = layout.title;
            let titleData = titleLayout ? [titleLayout] : [];
            let hasSelection = this.interactivityService && powerbi.visuals.dataHasSelection(data.dataPoints);

            let group = this.group;

            //transform the wrapping group if position is centered
            if (this.isCentered(this.orientation)) {
                let centerOffset = 0;
                if (this.isTopOrBottom(this.orientation)) {
                    centerOffset = Math.max(0, (this.parentViewport.width - this.visibleLegendWidth) / 2);
                    group.attr('transform', SVGUtil.translate(centerOffset, 0));
                }
                else {
                    centerOffset = Math.max((this.parentViewport.height - this.visibleLegendHeight) / 2);
                    group.attr('transform', SVGUtil.translate(0, centerOffset));
                }
            }
            else {
                group.attr('transform', null);
            }

            let legendTitle = group
                .selectAll(SVGLegend.LegendTitle.selector)
                .data(titleData);

            legendTitle.enter()
                .append('text')
                .classed(SVGLegend.LegendTitle.class, true);

            legendTitle
                .style({
                    'fill': data.labelColor,
                    'font-size': PixelConverter.fromPoint(data.fontSize),
                    'font-family': SVGLegend.DefaultTitleFontFamily
                })
                .text((d: TitleLayout) => d.text)
                .attr({
                    'x': (d: TitleLayout) => d.x,
                    'y': (d: TitleLayout) => d.y
                })
                .append('title').text(data.title);

            legendTitle.exit().remove();

            let virtualizedDataPoints = data.dataPoints.slice(this.legendDataStartIndex, this.legendDataStartIndex + layout.numberOfItems);

            let iconRadius = TextMeasurementService.estimateSvgTextHeight(SVGLegend.getTextProperties(false, '', this.data.fontSize)) / SVGLegend.LegendIconRadiusFactor;
            iconRadius = (this.legendFontSizeMarginValue > SVGLegend.DefaultTextMargin) && iconRadius > SVGLegend.LegendIconRadius
                ? iconRadius :
                SVGLegend.LegendIconRadius;

            let legendItems = group
                .selectAll(SVGLegend.LegendItem.selector)
                .data(virtualizedDataPoints, (d: LegendDataPoint) => d.identity.getKey() + (d.layerNumber != null ? d.layerNumber : ''));

            let itemsEnter = legendItems.enter()
                .append('g')
                .classed(SVGLegend.LegendItem.class, true);

            itemsEnter
                .append('circle')
                .classed(SVGLegend.LegendIcon.class, true);

            itemsEnter
                .append('text')
                .classed(SVGLegend.LegendText.class, true);

            itemsEnter
                .append('title')
                .text((d: LegendDataPoint) => d.tooltip);

            legendItems
                .select(SVGLegend.LegendIcon.selector)
                .attr({
                    'cx': (d: LegendDataPoint, i) => d.glyphPosition.x,
                    'cy': (d: LegendDataPoint) => d.glyphPosition.y,
                    'r': iconRadius,
                })
                .style({
                    'fill': (d: LegendDataPoint) => {
                        if (hasSelection && !d.selected)
                            return LegendBehavior.dimmedLegendColor;
                        else
                            return d.color;
                    }
                });

            legendItems
                .select('title')
                .text((d: LegendDataPoint) => d.tooltip);

            legendItems
                .select(SVGLegend.LegendText.selector)
                .attr({
                    'x': (d: LegendDataPoint) => d.textPosition.x,
                    'y': (d: LegendDataPoint) => d.textPosition.y,
                })
                .text((d: LegendDataPoint) => d.label)
                .style({
                    'fill': data.labelColor,
                    'font-size': PixelConverter.fromPoint(data.fontSize)
                });

            if (this.interactivityService) {
                let iconsSelection = legendItems.select(SVGLegend.LegendIcon.selector);
                let behaviorOptions: LegendBehaviorOptions = {
                    legendItems: legendItems,
                    legendIcons: iconsSelection,
                    clearCatcher: this.clearCatcher,
                };

                this.interactivityService.bind(data.dataPoints, new LegendBehavior(), behaviorOptions, { isLegend: true });
            }

            legendItems.exit().remove();

            this.drawNavigationArrows(layout.navigationArrows);

            this.updateLayout();
        }

        private normalizePosition(points: any[]): void {
            if (this.legendDataStartIndex >= points.length) {
                this.legendDataStartIndex = points.length - 1;
            }

            if (this.legendDataStartIndex < 0) {
                this.legendDataStartIndex = 0;
            }
        }

        private calculateTitleLayout(title: string): TitleLayout {
            let width = 0;
            let hasTitle = !_.isEmpty(title);

            if (hasTitle) {
                let isHorizontal = this.isTopOrBottom(this.orientation);
                let maxMeasureLength: number;

                if (isHorizontal) {
                    let fontSizeMargin = this.legendFontSizeMarginValue > SVGLegend.DefaultTextMargin ? SVGLegend.TextAndIconPadding + this.legendFontSizeMarginDifference : SVGLegend.TextAndIconPadding;
                    let fixedHorizontalIconShift = SVGLegend.TextAndIconPadding + SVGLegend.LegendIconRadius;
                    let fixedHorizontalTextShift = SVGLegend.LegendIconRadius + fontSizeMargin + fixedHorizontalIconShift;
                    // TODO This can be negative for narrow viewports. May need to rework this logic.
                    maxMeasureLength = this.parentViewport.width * SVGLegend.LegendMaxWidthFactor - fixedHorizontalTextShift - SVGLegend.LegendEdgeMariginWidth;
                }
                else {
                    maxMeasureLength = this.legendFontSizeMarginValue < SVGLegend.DefaultTextMargin ? SVGLegend.MaxTitleLength :
                        SVGLegend.MaxTitleLength + (SVGLegend.DefaultMaxLegendFactor * this.legendFontSizeMarginDifference);
                }

                let textProperties = SVGLegend.getTextProperties(true, title, this.data.fontSize);
                let text = title;
                width = TextMeasurementService.measureSvgTextWidth(textProperties);

                if (width > maxMeasureLength) {
                    text = TextMeasurementService.getTailoredTextOrDefault(textProperties, maxMeasureLength);
                    textProperties.text = text;
                    
                    // Remeasure the text since its measurement may be different than the max (ex. when the max is negative, the text will be ellipsis, and not have a negative width)
                    width = TextMeasurementService.measureSvgTextWidth(textProperties);
                };

                if (isHorizontal)
                    width += SVGLegend.TitlePadding;
                else
                    text = TextMeasurementService.getTailoredTextOrDefault(textProperties, this.viewport.width);

                return {
                    x: 0,
                    y: 0,
                    text: text,
                    width: width,
                    height: TextMeasurementService.estimateSvgTextHeight(textProperties)
                };
            }
            return null;

        }
        /** Performs layout offline for optimal perfomance */
        private calculateLayout(data: LegendData, autoWidth: boolean): LegendLayout {
            let dataPoints = data.dataPoints;
            if (data.dataPoints.length === 0) {
                return {
                    numberOfItems: 0,
                    title: null,
                    navigationArrows: []
                };
            }

            this.legendFontSizeMarginValue = PixelConverter.fromPointToPixel(this.data && this.data.fontSize !== undefined ? this.data.fontSize : SVGLegend.DefaultFontSizeInPt);
            this.legendFontSizeMarginDifference = (this.legendFontSizeMarginValue - SVGLegend.DefaultTextMargin);

            this.normalizePosition(dataPoints);
            if (this.legendDataStartIndex < dataPoints.length) {
                dataPoints = dataPoints.slice(this.legendDataStartIndex);
            }

            let title = this.calculateTitleLayout(data.title);

            let navArrows: NavigationArrow[];
            let numberOfItems: number;
            if (this.isTopOrBottom(this.orientation)) {
                navArrows = this.isScrollable ? this.calculateHorizontalNavigationArrowsLayout(title) : [];
                numberOfItems = this.calculateHorizontalLayout(dataPoints, title, navArrows);
            }
            else {
                navArrows = this.isScrollable ? this.calculateVerticalNavigationArrowsLayout(title) : [];
                numberOfItems = this.calculateVerticalLayout(dataPoints, title, navArrows, autoWidth);
            }
            return {
                numberOfItems: numberOfItems,
                title: title,
                navigationArrows: navArrows
            };
        }

        private updateNavigationArrowLayout(navigationArrows: NavigationArrow[], remainingDataLength: number, visibleDataLength: number): void {
            if (this.legendDataStartIndex === 0) {
                navigationArrows.shift();
            }

            let lastWindow = this.arrowPosWindow;
            this.arrowPosWindow = visibleDataLength;

            if (navigationArrows && navigationArrows.length > 0 && this.arrowPosWindow === remainingDataLength) {
                this.arrowPosWindow = lastWindow;
                navigationArrows.length = navigationArrows.length - 1;
            }
        }

        private calculateHorizontalNavigationArrowsLayout(title: TitleLayout): NavigationArrow[] {
            let height = SVGLegend.LegendArrowHeight;
            let width = SVGLegend.LegendArrowWidth;
            let translateY = (this.viewport.height / 2) - (height / 2);

            let data: NavigationArrow[] = [];
            let rightShift = title ? title.x + title.width : 0;
            let arrowLeft = SVGUtil.createArrow(width, height, 180 /*angle*/);
            let arrowRight = SVGUtil.createArrow(width, height, 0 /*angle*/);

            data.push({
                x: rightShift,
                y: translateY,
                path: arrowLeft.path,
                rotateTransform: arrowLeft.transform,
                type: NavigationArrowType.Decrease
            });

            data.push({
                x: this.parentViewport.width - width,
                y: translateY,
                path: arrowRight.path,
                rotateTransform: arrowRight.transform,
                type: NavigationArrowType.Increase
            });

            return data;
        }

        private calculateVerticalNavigationArrowsLayout(title: TitleLayout): NavigationArrow[] {
            let height = SVGLegend.LegendArrowHeight;
            let width = SVGLegend.LegendArrowWidth;

            let verticalCenter = this.viewport.height / 2;
            let data: NavigationArrow[] = [];
            let rightShift = verticalCenter + height / 2;
            let arrowTop = SVGUtil.createArrow(width, height, 270 /*angle*/);
            let arrowBottom = SVGUtil.createArrow(width, height, 90 /*angle*/);
            let titleHeight = title ? title.height : 0;

            data.push({
                x: rightShift,
                y: width + titleHeight,
                path: arrowTop.path,
                rotateTransform: arrowTop.transform,
                type: NavigationArrowType.Decrease
            });

            data.push({
                x: rightShift,
                y: this.parentViewport.height - height,
                path: arrowBottom.path,
                rotateTransform: arrowBottom.transform,
                type: NavigationArrowType.Increase
            });

            return data;
        }
        
        /**
         * Calculates the widths for each horizontal legend item.
         */
        private static calculateHorizontalLegendItemsWidths(dataPoints: LegendDataPoint[], availableWidth: number, iconPadding: number, fontSize: number): LegendItem[] {

            let dataPointsLength = dataPoints.length;

            // Set the maximum amount of space available to each item. They can use less, but can't go over this number.
            let maxItemWidth = dataPointsLength > 0 ? availableWidth / dataPointsLength | 0 : 0;
            let maxItemTextWidth = maxItemWidth - iconPadding;

            // Makes sure the amount of space available to each item is at least SVGLegend.MaxTextLength wide.
            // If you had many items and/or a narrow amount of available width, the availableTextWidthPerItem would be small, essentially making everything ellipsis.
            // This prevents that from happening by giving each item at least SVGLegend.MaxTextLength of space.
            if (maxItemTextWidth < SVGLegend.MaxTextLength) {
                maxItemTextWidth = SVGLegend.MaxTextLength;
                maxItemWidth = maxItemTextWidth + iconPadding;
            }

            // Make sure the availableWidthPerItem is less than the availableWidth. This lets the long text properly add ellipsis when we're displaying one item at a time.
            if (maxItemWidth > availableWidth) {
                maxItemWidth = availableWidth;
                maxItemTextWidth = maxItemWidth - iconPadding;
            }

            let occupiedWidth = 0;
            let legendItems: LegendItem[] = [];

            // Add legend items until we can't fit any more (the last one doesn't fit) or we've added all of them
            for (let dataPoint of dataPoints) {

                let textProperties = SVGLegend.getTextProperties(false, dataPoint.label, fontSize);
                let itemTextWidth = TextMeasurementService.measureSvgTextWidth(textProperties);
                let desiredWidth = itemTextWidth + iconPadding;
                let overMaxWidth = desiredWidth > maxItemWidth;
                let actualWidth = overMaxWidth ? maxItemWidth : desiredWidth;
                occupiedWidth += actualWidth;

                if (occupiedWidth >= availableWidth) {
                     
                    // Always add at least 1 element
                    if (legendItems.length === 0) {

                        legendItems.push({
                            dataPoint: dataPoint,
                            textProperties: textProperties,
                            desiredWidth: desiredWidth,
                            desiredOverMaxWidth: true,
                            width: desiredWidth
                        });
                        
                        // Set the width to the amount of space we actually have
                        occupiedWidth = availableWidth;
                    } else {
                        // Subtract the width from what was just added since it won't fit
                        occupiedWidth -= actualWidth;
                    }
                    break;
                }

                legendItems.push({
                    dataPoint: dataPoint,
                    textProperties: textProperties,
                    desiredWidth: desiredWidth,
                    desiredOverMaxWidth: overMaxWidth,
                    width: desiredWidth
                });
            }

            // If there are items at max width, evenly redistribute the extra space to them
            let itemsOverMax = _.filter(legendItems, (li) => li.desiredOverMaxWidth);
            let numItemsOverMax = itemsOverMax.length;

            if (numItemsOverMax > 0) {
                let extraWidth = availableWidth - occupiedWidth;

                for (let item of itemsOverMax) {
                    // Divvy up the extra space and add it to the max
                    // We need to do this calculation in every loop since the remainingWidth may not be changed by the same amount every time
                    let extraWidthPerItem = extraWidth / numItemsOverMax;
                    let newMaxItemWidth = maxItemWidth + extraWidthPerItem;

                    let usedExtraWidth: number;
                    if (item.desiredWidth <= newMaxItemWidth) {
                        // If the item doesn't need all the extra space, it's not at max anymore
                        item.desiredOverMaxWidth = false;
                        usedExtraWidth = item.desiredWidth - maxItemWidth;
                    } else {
                        // Otherwise the item is taking up all the extra space so update the actual width to indicate that
                        item.width = newMaxItemWidth;
                        usedExtraWidth = newMaxItemWidth - maxItemWidth;
                    }
                    
                    extraWidth -= usedExtraWidth;
                    numItemsOverMax--;
                }
            }

            return legendItems;
        }

        private calculateHorizontalLayout(dataPoints: LegendDataPoint[], title: TitleLayout, navigationArrows: NavigationArrow[]): number {
            debug.assertValue(navigationArrows, 'navigationArrows');
            // calculate the text shift
            let HorizontalTextShift = 4 + SVGLegend.LegendIconRadius;
            // check if we need more space for the margin, or use the default text padding
            let fontSizeBiggerThanDefault = this.legendFontSizeMarginDifference > 0;
            let fontSizeMargin = fontSizeBiggerThanDefault ? SVGLegend.TextAndIconPadding + this.legendFontSizeMarginDifference : SVGLegend.TextAndIconPadding;
            let fixedTextShift = (fontSizeMargin / (SVGLegend.LegendIconRadiusFactor / 2)) + HorizontalTextShift;
            let occupiedWidth = 0;
            // calculate the size of the space for both sides of the radius
            let iconTotalItemPadding = SVGLegend.LegendIconRadius * 2 + fontSizeMargin * 1.5;
            let numberOfItems: number = dataPoints.length;
            // get the Y coordinate which is the middle of the container + the middle of the text height - the delta of the text 
            let defaultTextProperties = SVGLegend.getTextProperties(false, '', this.data.fontSize);
            let verticalCenter = this.viewport.height / 2;
            let textYCoordinate = verticalCenter + TextMeasurementService.estimateSvgTextHeight(defaultTextProperties) / 2
                - TextMeasurementService.estimateSvgTextBaselineDelta(defaultTextProperties);

            if (title) {
                occupiedWidth += title.width;
                // get the Y coordinate which is the middle of the container + the middle of the text height - the delta of the text 
                title.y = verticalCenter + title.height / 2 - TextMeasurementService.estimateSvgTextBaselineDelta(SVGLegend.getTextProperties(true, title.text, this.data.fontSize));
            }

            // if an arrow should be added, we add space for it
            if (this.legendDataStartIndex > 0) {
                occupiedWidth += SVGLegend.LegendArrowOffset;
            }

            // Calculate the width for each of the legend items
            let dataPointsLength = dataPoints.length;
            let availableWidth = this.parentViewport.width - occupiedWidth;
            let legendItems = SVGLegend.calculateHorizontalLegendItemsWidths(dataPoints, availableWidth, iconTotalItemPadding, this.data.fontSize);
            numberOfItems = legendItems.length;

            // If we can't show all the legend items, subtract the "next" arrow space from the available space and re-run the width calculations 
            if (numberOfItems !== dataPointsLength) {
                availableWidth -= SVGLegend.LegendArrowOffset;
                legendItems = SVGLegend.calculateHorizontalLegendItemsWidths(dataPoints, availableWidth, iconTotalItemPadding, this.data.fontSize);
                numberOfItems = legendItems.length;
            }

            for (let legendItem of legendItems) {

                let dataPoint = legendItem.dataPoint;

                dataPoint.glyphPosition = {
                    // the space taken so far + the radius + the margin / radiusFactor to prevent huge spaces
                    x: occupiedWidth + SVGLegend.LegendIconRadius + (this.legendFontSizeMarginDifference / SVGLegend.LegendIconRadiusFactor),
                    // The middle of the container but a bit lower due to text not being in the middle (qP for example making middle between q and P)
                    y: (this.viewport.height * SVGLegend.LegendIconYRatio),
                };

                dataPoint.textPosition = {
                    x: occupiedWidth + fixedTextShift,
                    y: textYCoordinate,
                };

                // If we're over the max width, process it so it fits
                if (legendItem.desiredOverMaxWidth) {
                    let textWidth = legendItem.width - iconTotalItemPadding;
                    let text = TextMeasurementService.getTailoredTextOrDefault(legendItem.textProperties, textWidth);
                    dataPoint.label = text;
                }

                occupiedWidth += legendItem.width;
            }

            this.visibleLegendWidth = occupiedWidth;
            this.updateNavigationArrowLayout(navigationArrows, dataPointsLength, numberOfItems);

            return numberOfItems;
        }

        private calculateVerticalLayout(
            dataPoints: LegendDataPoint[],
            title: TitleLayout,
            navigationArrows: NavigationArrow[],
            autoWidth: boolean): number {
            // check if we need more space for the margin, or use the default text padding
            let fontSizeBiggerThenDefault = this.legendFontSizeMarginDifference > 0;
            let fontFactor = fontSizeBiggerThenDefault ? this.legendFontSizeMarginDifference : 0;
            // calculate the size needed after font size change
            let verticalLegendHeight = 20 + fontFactor;
            let spaceNeededByTitle = 15 + fontFactor;
            let extraShiftForTextAlignmentToIcon = 4 + fontFactor;
            let totalSpaceOccupiedThusFar = verticalLegendHeight;
            // the default space for text and icon radius + the margin after the font size change
            let fixedHorizontalIconShift = SVGLegend.TextAndIconPadding + SVGLegend.LegendIconRadius + (this.legendFontSizeMarginDifference / SVGLegend.LegendIconRadiusFactor);
            let fixedHorizontalTextShift = fixedHorizontalIconShift * 2;
            // check how much space is needed
            let maxHorizontalSpaceAvaliable = autoWidth
                ? this.parentViewport.width * SVGLegend.LegendMaxWidthFactor
                - fixedHorizontalTextShift - SVGLegend.LegendEdgeMariginWidth
                : this.lastCalculatedWidth
                - fixedHorizontalTextShift - SVGLegend.LegendEdgeMariginWidth;
            let numberOfItems: number = dataPoints.length;

            let maxHorizontalSpaceUsed = 0;
            let parentHeight = this.parentViewport.height;

            if (title) {
                totalSpaceOccupiedThusFar += spaceNeededByTitle;
                title.x = SVGLegend.TextAndIconPadding;
                title.y = spaceNeededByTitle;
                maxHorizontalSpaceUsed = title.width || 0;
            }
            // if an arrow should be added, we add space for it
            if (this.legendDataStartIndex > 0)
                totalSpaceOccupiedThusFar += SVGLegend.LegendArrowOffset;

            let dataPointsLength = dataPoints.length;
            for (let i = 0; i < dataPointsLength; i++) {
                let dp = dataPoints[i];
                let textProperties = SVGLegend.getTextProperties(false, dp.label, this.data.fontSize);

                dp.glyphPosition = {
                    x: fixedHorizontalIconShift,
                    y: (totalSpaceOccupiedThusFar + extraShiftForTextAlignmentToIcon) - TextMeasurementService.estimateSvgTextBaselineDelta(textProperties)
                };

                dp.textPosition = {
                    x: fixedHorizontalTextShift,
                    y: totalSpaceOccupiedThusFar + extraShiftForTextAlignmentToIcon
                };

                // TODO: [PERF] Get rid of this extra measurement, and modify
                // getTailoredTextToReturnWidth + Text
                let width = TextMeasurementService.measureSvgTextWidth(textProperties);
                if (width > maxHorizontalSpaceUsed) {
                    maxHorizontalSpaceUsed = width;
                }

                if (width > maxHorizontalSpaceAvaliable) {
                    let text = TextMeasurementService.getTailoredTextOrDefault(
                        textProperties,
                        maxHorizontalSpaceAvaliable);
                    dp.label = text;
                }

                totalSpaceOccupiedThusFar += verticalLegendHeight;

                if (totalSpaceOccupiedThusFar > parentHeight) {
                    numberOfItems = i;
                    break;
                }
            }

            if (autoWidth) {
                if (maxHorizontalSpaceUsed < maxHorizontalSpaceAvaliable) {
                    this.lastCalculatedWidth = this.viewport.width = Math.ceil(maxHorizontalSpaceUsed + fixedHorizontalTextShift + SVGLegend.LegendEdgeMariginWidth);
                } else {
                    this.lastCalculatedWidth = this.viewport.width = Math.ceil(this.parentViewport.width * SVGLegend.LegendMaxWidthFactor);
                }
            }
            else {
                this.viewport.width = this.lastCalculatedWidth;
            }

            this.visibleLegendHeight = totalSpaceOccupiedThusFar;

            navigationArrows.forEach(d => d.x = this.lastCalculatedWidth / 2);
            this.updateNavigationArrowLayout(navigationArrows, dataPointsLength, numberOfItems);

            return numberOfItems;
        }

        private drawNavigationArrows(layout: NavigationArrow[]) {
            let arrows = this.group.selectAll(SVGLegend.NavigationArrow.selector)
                .data(layout);

            arrows
                .enter()
                .append('g')
                .on('click', (d: NavigationArrow) => {
                    let pos = this.legendDataStartIndex;
                    this.legendDataStartIndex = d.type === NavigationArrowType.Increase
                        ? pos + this.arrowPosWindow : pos - this.arrowPosWindow;
                    this.drawLegendInternal(this.data, this.parentViewport, false);
                })
                .classed(SVGLegend.NavigationArrow.class, true)
                .append('path');

            arrows
                .attr('transform', (d: NavigationArrow) => SVGUtil.translate(d.x, d.y))
                .select('path')
                .attr({
                    'd': (d: NavigationArrow) => d.path,
                    'transform': (d: NavigationArrow) => d.rotateTransform
                });

            arrows.exit().remove();
        }

        private isTopOrBottom(orientation: LegendPosition) {
            switch (orientation) {
                case LegendPosition.Top:
                case LegendPosition.Bottom:
                case LegendPosition.BottomCenter:
                case LegendPosition.TopCenter:
                    return true;
                default:
                    return false;
            }
        }

        private isCentered(orientation: LegendPosition): boolean {
            switch (orientation) {
                case LegendPosition.BottomCenter:
                case LegendPosition.LeftCenter:
                case LegendPosition.RightCenter:
                case LegendPosition.TopCenter:
                    return true;
                default:
                    return false;
            }
        }

        public reset(): void {
            // Intentionally left blank. 
        }

        private static getTextProperties(isTitle: boolean, text?: string, fontSize?: number): TextProperties {
            return {
                text: text,
                fontFamily: isTitle ? SVGLegend.DefaultTitleFontFamily : SVGLegend.DefaultFontFamily,
                fontSize: PixelConverter.fromPoint(fontSize || SVGLegend.DefaultFontSizeInPt)
            };
        }

        private setTooltipToLegendItems(data: LegendData) {
            //we save the values to tooltip before cut
            for (let dataPoint of data.dataPoints) {
                dataPoint.tooltip = dataPoint.label;
            }
        }
    }

    class CartesianChartInteractiveLegend implements ILegend {
        private static LegendHeight = 70;
        private static LegendContainerClass = 'interactive-legend';
        private static LegendContainerSelector = '.interactive-legend';
        private static LegendTitleClass = 'title';
        private static LegendItem = 'item';
        private static legendPlaceSelector = '\u25CF';
        private static legendIconClass = 'icon';
        private static legendColorCss = 'color';
        private static legendItemNameClass = 'itemName';
        private static legendItemMeasureClass = 'itemMeasure';
        private legendContainerParent: D3.Selection;
        private legendContainerDiv: D3.Selection;

        constructor(element: JQuery) {
            this.legendContainerParent = d3.select(element.get(0));
        }

        public getMargins(): IViewport {
            return {
                height: CartesianChartInteractiveLegend.LegendHeight,
                width: 0
            };
        }

        public drawLegend(legendData: LegendData) {
            debug.assertValue(legendData, 'legendData');
            let data = legendData.dataPoints;
            debug.assertValue(data, 'dataPoints');
            if (data.length < 1) return;

            let legendContainerDiv = this.legendContainerParent.select(CartesianChartInteractiveLegend.LegendContainerSelector);
            if (legendContainerDiv.empty()) {
                if (!data.length) return;
                let divToPrepend = $('<div></div>')
                    .height(this.getMargins().height)
                    .addClass(CartesianChartInteractiveLegend.LegendContainerClass);
                // Prepending, as legend should always be on topmost visual.
                $(this.legendContainerParent[0]).prepend(divToPrepend);
                legendContainerDiv = d3.select(divToPrepend.get(0));
            }
            this.legendContainerDiv = legendContainerDiv;

            // Construct the legend title and items.
            this.drawTitle(data);
            this.drawLegendItems(data);
        }

        public reset(): void {
            if (this.legendContainerDiv) {
                this.legendContainerDiv.remove();
                this.legendContainerDiv = null;
            }
        }

        public isVisible(): boolean {
            return true;
        }

        public changeOrientation(orientation: LegendPosition) {
            // Not supported
        }

        public getOrientation(): LegendPosition {
            return LegendPosition.Top;
        }

        /**
         * Draw the legend title
         */
        private drawTitle(data: LegendDataPoint[]): void {
            debug.assert(data && data.length > 0, 'data is null or empty');
            let titleDiv: D3.Selection = this.legendContainerDiv.selectAll('div.' + CartesianChartInteractiveLegend.LegendTitleClass);
            let item: D3.UpdateSelection = titleDiv.data([data[0]]);

            // Enter
            let itemEnter: D3.EnterSelection = item.enter();
            let titleDivEnter: D3.Selection = itemEnter.append('div').attr('class', CartesianChartInteractiveLegend.LegendTitleClass);
            titleDivEnter
                .filter((d: LegendDataPoint) => d.iconOnlyOnLabel)
                .append('span')
                .attr('class', CartesianChartInteractiveLegend.legendIconClass)
                .html(CartesianChartInteractiveLegend.legendPlaceSelector);
            titleDivEnter.append('span');

            // Update
            item.filter((d: LegendDataPoint) => d.iconOnlyOnLabel)
                .select('span.' + CartesianChartInteractiveLegend.legendIconClass)
                .style(CartesianChartInteractiveLegend.legendColorCss, (d: LegendDataPoint) => d.color);
            item.select('span:last-child').text((d: LegendDataPoint) => d.category);
        }

        /**
         * Draw the legend items
         */
        private drawLegendItems(data: LegendDataPoint[]): void {
            // Add Mesaures - the items of the category in the legend
            this.ensureLegendTableCreated();
                        
            let dataPointsMatrix: LegendDataPoint[][] = [data];
            let legendItemsContainer: D3.UpdateSelection = this.legendContainerDiv.select('tbody').selectAll('tr').data(dataPointsMatrix);

            // Enter
            let legendItemsEnter: D3.EnterSelection = legendItemsContainer.enter();
            let rowEnter: D3.Selection = legendItemsEnter.append('tr');
            let cellEnter: D3.Selection = rowEnter.selectAll('td')
                .data((d: LegendDataPoint[]) => d, (d: LegendDataPoint) => d.label)
                .enter()
                .append('td').attr('class', CartesianChartInteractiveLegend.LegendItem);
            let cellSpanEnter: D3.Selection = cellEnter.append('span');
            cellSpanEnter.filter((d: LegendDataPoint) => !d.iconOnlyOnLabel)
                .append('span')
                .html(CartesianChartInteractiveLegend.legendPlaceSelector)
                .attr('class', CartesianChartInteractiveLegend.legendIconClass)
                .attr('white-space', 'nowrap')
                .style({
                    'font-size': '20px', // this creates a circle of 10px
                    'margin-bottom': '7px'
                });
            cellSpanEnter.append('span').attr('class', CartesianChartInteractiveLegend.legendItemNameClass);
            cellSpanEnter.append('span').attr('class', CartesianChartInteractiveLegend.legendItemMeasureClass);

            // Update
            let legendCells: D3.UpdateSelection = legendItemsContainer.selectAll('td').data((d: LegendDataPoint[]) => d, (d: LegendDataPoint) => d.label);
            legendCells.select('span.' + CartesianChartInteractiveLegend.legendItemNameClass).html((d: LegendDataPoint) => powerbi.visuals.TextUtil.removeBreakingSpaces(d.label));
            legendCells.select('span.' + CartesianChartInteractiveLegend.legendItemMeasureClass).html((d: LegendDataPoint) => '&nbsp;' + d.measure);
            legendCells.select('span.' + CartesianChartInteractiveLegend.legendIconClass).style('color', (d: LegendDataPoint) => d.color);

            // Exit
            legendCells.exit().remove();
        }

        /**
         * Ensure legend table is created and set horizontal pan gestures on it
         */
        private ensureLegendTableCreated(): void {
            if (this.legendContainerDiv.select('div table').empty()) {
                let legendTable: D3.Selection = this.legendContainerDiv.append('div').append('table');
                legendTable.style('table-layout', 'fixed').append('tbody');
                // Setup Pan Gestures of the legend
                this.setPanGestureOnLegend(legendTable);
            }
        }

        /**
         * Set Horizontal Pan gesture for the legend
         */
        private setPanGestureOnLegend(legendTable: D3.Selection): void {
            let viewportWidth: number = $(this.legendContainerParent[0]).width();
            let xscale: D3.Scale.LinearScale = d3.scale.linear().domain([0, viewportWidth]).range([0, viewportWidth]);
            let zoom: D3.Behavior.Zoom = d3.behavior.zoom()
                .scaleExtent([1, 1]) // disable scaling
                .x(xscale)
                .on("zoom", () => {
                    // horizontal pan is valid only in case the legend items width are bigger than the viewport width
                    if ($(legendTable[0]).width() > viewportWidth) {
                        let t: number[] = zoom.translate();
                        let tx: number = t[0];
                        let ty: number = t[1];
                        tx = Math.min(tx, 0);
                        tx = Math.max(tx, viewportWidth - $(legendTable[0]).width());
                        zoom.translate([tx, ty]);
                        legendTable.style("-ms-transform", () => { /* IE 9 */
                            return SVGUtil.translateXWithPixels(tx);
                        });
                        legendTable.style("-webkit-transform", () => { /* Safari */
                            return SVGUtil.translateXWithPixels(tx);
                        });
                        legendTable.style("transform", () => {
                            return SVGUtil.translateXWithPixels(tx);
                        });
                    }
                });
            if (this.legendContainerDiv) {
                this.legendContainerDiv.call(zoom);
            } else {
                legendTable.call(zoom);
            }
        }
    }

    export module LegendData {

        export var DefaultLegendLabelFillColor: string = '#666666';

        export function update(legendData: LegendData, legendObject: DataViewObject): void {
            debug.assertValue(legendData, 'legendData');
            debug.assertValue(legendObject, 'legendObject');

            if (legendObject[legendProps.show] == null) {
                legendObject[legendProps.show] = true;
            }

            if (legendObject[legendProps.show] === false)
                legendData.dataPoints = [];

            if (legendObject[legendProps.show] === true && legendObject[legendProps.position] == null)
                legendObject[legendProps.position] = legendPosition.top;

            if (legendObject[legendProps.fontSize] !== undefined)
                legendData.fontSize = <number>legendObject[legendProps.fontSize];

            if (legendObject[legendProps.labelColor] !== undefined) {

                let fillColor = <Fill>legendObject[legendProps.labelColor];

                if (fillColor != null) {
                    legendData.labelColor = fillColor.solid.color;
                }
            }

            if (legendObject[legendProps.showTitle] === false)
                legendData.title = "";
            else if (legendObject[legendProps.titleText] !== undefined) {
                legendData.title = <string>legendObject[legendProps.titleText];
            }
        }
    }
}