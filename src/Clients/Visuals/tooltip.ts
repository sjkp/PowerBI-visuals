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

    import TouchUtils = powerbi.visuals.controls.TouchUtils;
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    import createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;

    export interface TooltipDataItem {
        displayName: string;
        value: string;
        color?: string;
        header?: string;
        opacity?: string;
    }

    export interface TooltipOptions {
        opacity: number;
        animationDuration: number;
        offsetX: number;
        offsetY: number;
    }

    export interface TooltipEnabledDataPoint {
        tooltipInfo?: TooltipDataItem[];
    }

    export interface TooltipCategoryDataItem {
        value?: any;
        metadata: DataViewMetadataColumn[];
    }

    export interface TooltipSeriesDataItem {
        value?: any;
        highlightedValue?: any;
        metadata: DataViewValueColumn;
    }

    export interface TooltipLocalizationOptions {
        highlightedValueDisplayName: string;
    }

    export interface TooltipEvent {
        data: any;
        coordinates: number[];
        elementCoordinates: number[];
        context: HTMLElement;
        isTouchEvent: boolean;
    }

    const enum ScreenArea {
        TopLeft,
        TopRight,
        BottomRight,
        BottomLeft
    };

    const ContainerClassName: ClassAndSelector = createClassAndSelector("tooltip-container");
    const ContentContainerClassName: ClassAndSelector = createClassAndSelector("tooltip-content-container");
    const ArrowClassName: ClassAndSelector = createClassAndSelector("arrow");
    const TooltipHeaderClassName: ClassAndSelector = createClassAndSelector("tooltip-header");
    const TooltipRowClassName: ClassAndSelector = createClassAndSelector("tooltip-row");
    const TooltipColorCellClassName: ClassAndSelector = createClassAndSelector("tooltip-color-cell");
    const TooltipTitleCellClassName: ClassAndSelector = createClassAndSelector("tooltip-title-cell");
    const TooltipValueCellClassName: ClassAndSelector = createClassAndSelector("tooltip-value-cell");

    export class ToolTipComponent {

        private static DefaultTooltipOptions: TooltipOptions = {
            opacity: 1,
            animationDuration: 250,
            offsetX: 10,
            offsetY: 10
        };

        private tooltipContainer: D3.Selection;
        private isTooltipVisible: boolean = false;
        private currentTooltipData: TooltipDataItem[];

        private customScreenWidth: number;
        private customScreenHeight: number;

        public static parentContainerSelector: string = "body";
        public static highlightedValueDisplayNameResorceKey: string = "Tooltip_HighlightedValueDisplayName";
        public static localizationOptions: TooltipLocalizationOptions;

        constructor(public tooltipOptions?: TooltipOptions) {
            if (!tooltipOptions) {
                this.tooltipOptions = ToolTipComponent.DefaultTooltipOptions;
            }
        }

        public isTooltipComponentVisible(): boolean {
            return this.isTooltipVisible;
        }

        /** Note: For tests only */
        public setTestScreenSize(width: number, height: number) {
            this.customScreenWidth = width;
            this.customScreenHeight = height;
        }

        public show(tooltipData: TooltipDataItem[], clickedArea: TouchUtils.Rectangle) {
            this.isTooltipVisible = true;

            if (!this.tooltipContainer) {
                this.tooltipContainer = this.createTooltipContainer();
            }

            this.setTooltipContent(tooltipData);

            this.tooltipContainer
                .style("visibility", "visible")
                .transition()
                .duration(0) // Cancel previous transitions
                .style("opacity", this.tooltipOptions.opacity);

            this.setPosition(clickedArea);
        }

        public move(tooltipData: TooltipDataItem[], clickedArea: TouchUtils.Rectangle) {
            if (this.isTooltipVisible) {
                if (tooltipData) {
                    this.setTooltipContent(tooltipData);
                }

                this.setPosition(clickedArea);
            }
        }

        public hide() {
            if (this.isTooltipVisible) {
                this.isTooltipVisible = false;
                this.tooltipContainer
                    .transition()
                    .duration(this.tooltipOptions.animationDuration)
                    .style("opacity", 0)
                    .each('end', function () { this.style.visibility = "hidden"; });
            }
        }

        private createTooltipContainer(): D3.Selection {
            let container: D3.Selection = d3.select(ToolTipComponent.parentContainerSelector)
                .append("div")
                .attr("class", ContainerClassName.class);

            container.append("div").attr("class", ArrowClassName.class);
            container.append("div").attr("class", ContentContainerClassName.class);

            return container;
        }

        private setTooltipContent(tooltipData: TooltipDataItem[]): void {
            if (_.isEqual(tooltipData, this.currentTooltipData))
                return;
            this.currentTooltipData = tooltipData;

            let rowsSelector: string = TooltipRowClassName.selector;
            let contentContainer = this.tooltipContainer.select(ContentContainerClassName.selector);

            // Clear existing content
            contentContainer.selectAll(TooltipHeaderClassName.selector).remove();
            contentContainer.selectAll(TooltipRowClassName.selector).remove();

            if (tooltipData.length === 0) return;

            if (tooltipData[0].header) {
                contentContainer.append("div").attr("class", TooltipHeaderClassName.class).text(tooltipData[0].header);
            }
            let tooltipRow: D3.UpdateSelection = contentContainer.selectAll(rowsSelector).data(tooltipData);
            let newRow: D3.Selection = tooltipRow.enter().append("div").attr("class", TooltipRowClassName.class);
            if (_.any(tooltipData, (tooltipItem) => tooltipItem.color)) {
                let newColorCell: D3.Selection = newRow.filter((d) => d.color).append("div").attr("class", TooltipColorCellClassName.class);

                newColorCell
                    .append('svg')
                    .attr({
                        'width': '100%',
                        'height': '15px'
                    })
                    .append('circle')
                    .attr({
                        'cx': '5',
                        'cy': '8',
                        'r': '5'
                    })
                    .style({
                        'fill': (d: TooltipDataItem) => d.color,
                        'fill-opacity': (d: TooltipDataItem) => d.opacity != null ? d.opacity : 1,
                    });
            }
            let newTitleCell: D3.Selection = newRow.append("div").attr("class", TooltipTitleCellClassName.class);
            let newValueCell: D3.Selection = newRow.append("div").attr("class", TooltipValueCellClassName.class);

            newTitleCell.text(function (d: TooltipDataItem) { return d.displayName; });
            newValueCell.text(function (d: TooltipDataItem) { return d.value; });
        }

        private getTooltipPosition(clickedArea: TouchUtils.Rectangle, clickedScreenArea: ScreenArea): TouchUtils.Point {
            let tooltipContainerBounds: ClientRect = this.tooltipContainer.node().getBoundingClientRect();
            let centerPointOffset: number = Math.floor(clickedArea.width / 2);
            let offsetX: number = 0;
            let offsetY: number = 0;
            let centerPoint: TouchUtils.Point = new TouchUtils.Point(clickedArea.x + centerPointOffset, clickedArea.y + centerPointOffset);
            let arrowOffset: number = 7;

            if (clickedScreenArea === ScreenArea.TopLeft) {
                offsetX += 3 * arrowOffset + centerPointOffset;
                offsetY -= 2 * arrowOffset + centerPointOffset;
            }
            else if (clickedScreenArea === ScreenArea.TopRight) {
                offsetX -= (2 * arrowOffset + tooltipContainerBounds.width + centerPointOffset);
                offsetY -= 2 * arrowOffset + centerPointOffset;
            }
            else if (clickedScreenArea === ScreenArea.BottomLeft) {
                offsetX += 3 * arrowOffset + centerPointOffset;
                offsetY -= (tooltipContainerBounds.height - 2 * arrowOffset + centerPointOffset);
            }
            else if (clickedScreenArea === ScreenArea.BottomRight) {
                offsetX -= (2 * arrowOffset + tooltipContainerBounds.width + centerPointOffset);
                offsetY -= (tooltipContainerBounds.height - 2 * arrowOffset + centerPointOffset);
            }

            centerPoint.offset(offsetX, offsetY);

            return centerPoint;
        }

        private setPosition(clickedArea: TouchUtils.Rectangle): void {
            let clickedScreenArea: ScreenArea = this.getClickedScreenArea(clickedArea);

            let tooltipPosition: TouchUtils.Point = this.getTooltipPosition(clickedArea, clickedScreenArea);
            this.setTooltipContainerClass(clickedScreenArea);
            this.tooltipContainer.style({ "left": tooltipPosition.x + "px", "top": tooltipPosition.y + "px" });

            this.setArrowPosition(clickedScreenArea);
        }

        private setTooltipContainerClass(clickedScreenArea: ScreenArea): void {
            let tooltipContainerClassName: string;
            switch (clickedScreenArea) {
                case ScreenArea.TopLeft:
                case ScreenArea.BottomLeft:
                    tooltipContainerClassName = 'left';
                    break;
                case ScreenArea.TopRight:
                case ScreenArea.BottomRight:
                    tooltipContainerClassName = 'right';
                    break;
            }
            this.tooltipContainer
                .attr('class', ContainerClassName.class) // Reset all classes
                .classed(tooltipContainerClassName, true);
        }

        private setArrowPosition(clickedScreenArea: ScreenArea): void {
            let arrow: D3.Selection = this.getArrowElement();
            let arrowClassName: string;

            if (clickedScreenArea === ScreenArea.TopLeft) {
                arrowClassName = "top left";
            }
            else if (clickedScreenArea === ScreenArea.TopRight) {
                arrowClassName = "top right";
            }
            else if (clickedScreenArea === ScreenArea.BottomLeft) {
                arrowClassName = "bottom left";
            }
            else {
                arrowClassName = "bottom right";
            }

            arrow
                .attr('class', 'arrow') // Reset all classes
                .classed(arrowClassName, true);
        }

        private getArrowElement(): D3.Selection {
            return this.tooltipContainer.select(ArrowClassName.selector);
        }

        private getClickedScreenArea(clickedArea: TouchUtils.Rectangle): ScreenArea {
            let screenWidth: number = this.customScreenWidth || window.innerWidth;
            let screenHeight: number = this.customScreenHeight || window.innerHeight;
            let centerPointOffset: number = clickedArea.width / 2;
            let centerPoint: TouchUtils.Point = new TouchUtils.Point(clickedArea.x + centerPointOffset, clickedArea.y + centerPointOffset);
            let halfWidth: number = screenWidth / 2;
            let halfHeight: number = screenHeight / 2;

            if (centerPoint.x < halfWidth && centerPoint.y < halfHeight) {
                return ScreenArea.TopLeft;
            }
            else if (centerPoint.x >= halfWidth && centerPoint.y < halfHeight) {
                return ScreenArea.TopRight;
            }
            else if (centerPoint.x < halfWidth && centerPoint.y >= halfHeight) {
                return ScreenArea.BottomLeft;
            }
            else if (centerPoint.x >= halfWidth && centerPoint.y >= halfHeight) {
                return ScreenArea.BottomRight;
            }
        }
    }

    export module TooltipManager {

        export let ShowTooltips: boolean = true;
        export let ToolTipInstance: ToolTipComponent = new ToolTipComponent();
        let GlobalTooltipEventsAttached: boolean = false;
        const tooltipMouseOverDelay: number = 350;
        const tooltipMouseOutDelay: number = 500;
        const tooltipTouchDelay: number = 350;
        let tooltipTimeoutId: number;
        const handleTouchDelay: number = 1000;
        let handleTouchTimeoutId: number = 0;
        let mouseCoordinates: number[];
        let tooltipData: TooltipDataItem[];

        export function addTooltip(
            selection: D3.Selection,
            getTooltipInfoDelegate: (tooltipEvent: TooltipEvent) => TooltipDataItem[],
            reloadTooltipDataOnMouseMove?: boolean,
            onMouseOutDelegate?: () => void): void {

            if (!ShowTooltips) {
                return;
            }

            debug.assertValue(selection, "selection");

            let rootNode = d3.select(ToolTipComponent.parentContainerSelector).node();

            // Mouse events
            selection.on("mouseover", () => {
                let target = <HTMLElement>d3.event.target;
                let data = d3.select(target).datum();
                
                // Ignore mouseover while handling touch events
                if (handleTouchTimeoutId || !canDisplayTooltip(d3.event))
                    return;

                mouseCoordinates = getCoordinates(rootNode, true);
                let elementCoordinates: number[] = getCoordinates(target, true);
                let tooltipEvent: TooltipEvent = {
                    data: data,
                    coordinates: mouseCoordinates,
                    elementCoordinates: elementCoordinates,
                    context: target,
                    isTouchEvent: false
                };

                clearTooltipTimeout();
                
                // if it is already visible, change contents immediately (use 16ms minimum perceivable frame rate to prevent thrashing)
                let delay = ToolTipInstance.isTooltipComponentVisible() ? 16 : tooltipMouseOverDelay;
                tooltipTimeoutId = showDelayedTooltip(tooltipEvent, getTooltipInfoDelegate, delay);
            });

            selection.on("mouseout", () => {
                if (!handleTouchTimeoutId) {
                    clearTooltipTimeout();
                    tooltipTimeoutId = hideDelayedTooltip();
                }

                if (onMouseOutDelegate) {
                    onMouseOutDelegate();
                }
            });

            selection.on("mousemove", () => {
                let target = <HTMLElement>d3.event.target;
                let data = d3.select(target).datum();
                
                // Ignore mousemove while handling touch events
                if (handleTouchTimeoutId || !canDisplayTooltip(d3.event))
                    return;

                mouseCoordinates = getCoordinates(rootNode, true);
                let elementCoordinates: number[] = getCoordinates(target, true);
                let tooltipEvent: TooltipEvent = {
                    data: data,
                    coordinates: mouseCoordinates,
                    elementCoordinates: elementCoordinates,
                    context: target,
                    isTouchEvent: false
                };

                moveTooltipEventHandler(tooltipEvent, getTooltipInfoDelegate, reloadTooltipDataOnMouseMove);
            });
            
            // --- Touch events ---
            
            // TODO: static?
            let touchStartEventName: string = getTouchStartEventName();
            let touchEndEventName: string = getTouchEndEventName();
            let isPointerEvent: boolean = touchStartEventName === "pointerdown" || touchStartEventName === "MSPointerDown";

            if (!GlobalTooltipEventsAttached) {
                // Add root container hide tooltip event
                attachGlobalEvents(touchStartEventName);
                GlobalTooltipEventsAttached = true;
            }

            selection.on(touchStartEventName, () => {
                let target = <HTMLElement>d3.event.target;
                let data = d3.select(target).datum();

                hideTooltipEventHandler();
                let coordinates: number[] = getCoordinates(rootNode, isPointerEvent);
                let elementCoordinates: number[] = getCoordinates(target, isPointerEvent);
                let tooltipEvent: TooltipEvent = {
                    data: data,
                    coordinates: coordinates,
                    elementCoordinates: elementCoordinates,
                    context: target,
                    isTouchEvent: true
                };
                clearTooltipTimeout();
                tooltipTimeoutId = showDelayedTooltip(tooltipEvent, getTooltipInfoDelegate, tooltipTouchDelay);
            });

            selection.on(touchEndEventName, () => {

                clearTooltipTimeout();
                if (handleTouchTimeoutId)
                    clearTimeout(handleTouchTimeoutId);

                // At the end of touch action, set a timeout that will let us ignore the incoming mouse events for a small amount of time
                handleTouchTimeoutId = setTimeout(() => {
                    handleTouchTimeoutId = 0;
                }, handleTouchDelay);
            });
        }

        export function showDelayedTooltip(tooltipEvent: TooltipEvent, getTooltipInfoDelegate: (tooltipEvent: TooltipEvent) => TooltipDataItem[], delayInMs: number): number {
            return setTimeout(() => showTooltipEventHandler(tooltipEvent, getTooltipInfoDelegate), delayInMs);
        }

        export function hideDelayedTooltip(): number {
            return setTimeout(() => hideTooltipEventHandler(), tooltipMouseOutDelay);
        }

        export function setLocalizedStrings(localizationOptions: TooltipLocalizationOptions): void {
            ToolTipComponent.localizationOptions = localizationOptions;
        }

        function showTooltipEventHandler(tooltipEvent: TooltipEvent, getTooltipInfoDelegate: (tooltipEvent: TooltipEvent) => TooltipDataItem[]) {
            let tooltipInfo: TooltipDataItem[] = tooltipData || getTooltipInfoDelegate(tooltipEvent);
            if (!_.isEmpty(tooltipInfo)) {
                let coordinates: number[] = mouseCoordinates || tooltipEvent.coordinates;
                let clickedArea: TouchUtils.Rectangle = getClickedArea(coordinates[0], coordinates[1], tooltipEvent.isTouchEvent);
                ToolTipInstance.show(tooltipInfo, clickedArea);
            }
        }

        function moveTooltipEventHandler(tooltipEvent: TooltipEvent, getTooltipInfoDelegate: (tooltipEvent: TooltipEvent) => TooltipDataItem[], reloadTooltipDataOnMouseMove: boolean) {
            tooltipData = undefined;
            if (reloadTooltipDataOnMouseMove) {
                tooltipData = getTooltipInfoDelegate(tooltipEvent);
            }
            let clickedArea: TouchUtils.Rectangle = getClickedArea(tooltipEvent.coordinates[0], tooltipEvent.coordinates[1], tooltipEvent.isTouchEvent);
            ToolTipInstance.move(tooltipData, clickedArea);
        };

        function hideTooltipEventHandler() {
            ToolTipInstance.hide();
        };

        function clearTooltipTimeout() {
            if (tooltipTimeoutId) {
                clearTimeout(tooltipTimeoutId);
            }
        }

        function canDisplayTooltip(d3Event: any): boolean {
            let cadDisplay: boolean = true;
            let mouseEvent: MouseEvent = <MouseEvent>d3Event;
            if (mouseEvent.buttons !== undefined) {
                // Check mouse buttons state
                let hasMouseButtonPressed = mouseEvent.buttons !== 0;
                cadDisplay = !hasMouseButtonPressed;
            }
            return cadDisplay;
        }

        function getTouchStartEventName(): string {
            let eventName: string = "touchstart";

            if (window["PointerEvent"]) {
                // IE11
                eventName = "pointerdown";
            } else if (window["MSPointerEvent"]) {
                // IE10
                eventName = "MSPointerDown";
            }

            return eventName;
        }

        function getTouchEndEventName(): string {
            let eventName: string = "touchend";

            if (window["PointerEvent"]) {
                // IE11
                eventName = "pointerup";
            } else if (window["MSPointerEvent"]) {
                // IE10
                eventName = "MSPointerUp";
            }

            return eventName;
        }

        function getCoordinates(rootNode: Element, isPointerEvent: boolean): number[] {
            let coordinates: number[];

            if (isPointerEvent) {
                // DO NOT USE - WebKit bug in getScreenCTM with nested SVG results in slight negative coordinate shift
                // Also, IE will incorporate transform scale but WebKit does not, forcing us to detect browser and adjust appropriately.
                // Just use non-scaled coordinates for all browsers, and adjust for the transform scale later (see lineChart.findIndex)
                //coordinates = d3.mouse(rootNode);

                // copied from d3_eventSource (which is not exposed)
                let e = d3.event, s;
                while (s = e.sourceEvent) e = s;
                let rect = rootNode.getBoundingClientRect();
                coordinates = [e.clientX - rect.left - rootNode.clientLeft, e.clientY - rect.top - rootNode.clientTop];
            }
            else {
                let touchCoordinates = d3.touches(rootNode);
                if (touchCoordinates && touchCoordinates.length > 0) {
                    coordinates = touchCoordinates[0];
                }
            }

            return coordinates;
        }

        function attachGlobalEvents(touchStartEventName: string): void {
            d3.select(ToolTipComponent.parentContainerSelector).on(touchStartEventName, function (d, i) {
                ToolTipInstance.hide();
            });
        }

        function getClickedArea(x: number, y: number, isTouchEvent: boolean): TouchUtils.Rectangle {
            let width: number = 0;
            let pointX: number = x;
            let pointY: number = y;

            if (isTouchEvent) {
                width = 12;
                let offset: number = width / 2;
                pointX = Math.max(x - offset, 0);
                pointY = Math.max(y - offset, 0);
            }

            return new TouchUtils.Rectangle(pointX, pointY, width, width);
        }
    }

    export module TooltipBuilder {

        // TODO: implement options bag as input parameter
        export function createTooltipInfo(
            formatStringProp: DataViewObjectPropertyIdentifier,
            dataViewCat: DataViewCategorical,
            categoryValue: any,
            value?: any,
            categories?: DataViewCategoryColumn[],
            seriesData?: TooltipSeriesDataItem[],
            seriesIndex?: number,
            categoryIndex?: number,
            highlightedValue?: any,
            gradientValueColumn?: DataViewValueColumn): TooltipDataItem[] {
            let categorySource: TooltipCategoryDataItem;
            let seriesSource: TooltipSeriesDataItem[] = [];
            let valuesSource: DataViewMetadataColumn = undefined;
            seriesIndex = seriesIndex | 0;

            let categoriesData = dataViewCat ? dataViewCat.categories : categories;
            if (categoriesData && categoriesData.length > 0) {
                if (categoriesData.length > 1) {
                    let compositeCategoriesData = [];
                    for (let i = 0, ilen = categoriesData.length; i < ilen; i++) {
                        compositeCategoriesData.push(categoriesData[i].source);
                    }
                    categorySource = { value: categoryValue, metadata: compositeCategoriesData };
                }
                else {
                    categorySource = { value: categoryValue, metadata: [categoriesData[0].source] };
                }
            }
            if (dataViewCat && dataViewCat.values) {
                if (categorySource && categorySource.metadata[0] === dataViewCat.values.source) {
                    // Category/series on the same column -- don't repeat its value in the tooltip.
                }
                else {
                    valuesSource = dataViewCat.values.source;
                }
                if (dataViewCat.values.length > 0) {
                    let valueColumn: DataViewValueColumn = dataViewCat.values[seriesIndex];
                    let isAutoGeneratedColumn: boolean = !!(valueColumn && valueColumn.source && (<DataViewMetadataAutoGeneratedColumn>valueColumn.source).isAutoGeneratedColumn);

                    if (!isAutoGeneratedColumn) {
                        seriesSource.push({ value: value, highlightedValue: highlightedValue, metadata: valueColumn });
                    }
                }

                //Create Gradient tooltip value
                let gradientToolTipData = createGradientToolTipData(gradientValueColumn, categoryIndex);
                if (gradientToolTipData != null)
                    seriesSource.push(gradientToolTipData);
            }
            if (seriesData) {
                for (let i: number = 0, len: number = seriesData.length; i < len; i++) {
                    let singleSeriesData: TooltipSeriesDataItem = seriesData[i];
                    if (categorySource && categorySource.metadata[0] === singleSeriesData.metadata.source)
                        continue;

                    seriesSource.push({ value: singleSeriesData.value, metadata: singleSeriesData.metadata });
                }
            }

            let tooltipInfo: TooltipDataItem[] = createTooltipData(formatStringProp, categorySource, valuesSource, seriesSource);

            return tooltipInfo;
        }

        export function createGradientToolTipData(gradientValueColumn: DataViewValueColumn, categoryIndex: number): TooltipSeriesDataItem {
            if (gradientValueColumn) {
                // Saturation color
                return { value: gradientValueColumn.values[categoryIndex], metadata: { source: gradientValueColumn.source, values: [] } };
            }
            return null;
        }

        function createTooltipData(
            formatStringProp: DataViewObjectPropertyIdentifier,
            categoryValue: TooltipCategoryDataItem,
            valuesSource: DataViewMetadataColumn,
            seriesValues: TooltipSeriesDataItem[]): TooltipDataItem[] {

            debug.assertValue(seriesValues, "seriesSource");
            debug.assertValue(ToolTipComponent.localizationOptions, "ToolTipComponent.localizationOptions");
            debug.assertAnyValue(formatStringProp, 'formatStringProp');

            let items: TooltipDataItem[] = [];

            if (categoryValue) {
                if (categoryValue.metadata.length > 1) {
                    let displayName = '';
                    // This is being done simply for lat/long for now, as that's the only composite category we use.  If we ever have tooltips
                    //   involving other composite categories, we need to do a more thorough design and be more careful here.
                    for (let i = 0, ilen = categoryValue.metadata.length; i < ilen; i++) {
                        if (i !== 0)
                            displayName += '/';
                        displayName += categoryValue.metadata[i].displayName;
                    }
                    let categoryFormattedValue: string = getFormattedValue(categoryValue.metadata[0], formatStringProp, categoryValue.value);
                    items.push({ displayName: displayName, value: categoryFormattedValue });
                }
                else {
                    let categoryFormattedValue: string = getFormattedValue(categoryValue.metadata[0], formatStringProp, categoryValue.value);
                    items.push({ displayName: categoryValue.metadata[0].displayName, value: categoryFormattedValue });
                }
            }

            if (valuesSource) {
                // Dynamic series value
                let dynamicValue: string;
                if (seriesValues.length > 0) {
                    let dynamicValueMetadata: DataViewMetadataColumn = seriesValues[0].metadata.source;
                    dynamicValue = getFormattedValue(valuesSource, formatStringProp, dynamicValueMetadata.groupName);
                }
                items.push({ displayName: valuesSource.displayName, value: dynamicValue });
            }

            for (let i = 0; i < seriesValues.length; i++) {
                let seriesData = seriesValues[i];

                if (seriesData && seriesData.metadata) {
                    let seriesMetadataColumn = seriesData.metadata.source;
                    let value = seriesData.value;
                    let highlightedValue = seriesData.highlightedValue;

                    if (value || value === 0) {
                        let formattedValue: string = getFormattedValue(seriesMetadataColumn, formatStringProp, value);
                        items.push({ displayName: seriesMetadataColumn.displayName, value: formattedValue });
                    }

                    if (highlightedValue || highlightedValue === 0) {
                        let formattedHighlightedValue: string = getFormattedValue(seriesMetadataColumn, formatStringProp, highlightedValue);
                        let displayName = ToolTipComponent.localizationOptions.highlightedValueDisplayName;
                        items.push({ displayName: displayName, value: formattedHighlightedValue });
                    }
                }
            }

            return items;
        }

        export function addTooltipBucketItem(reader: data.IDataViewCategoricalReader, tooltipInfo: TooltipDataItem[], categoryIndex: number, seriesIndex?: number): void{
            let tooltipValues = reader.getAllValuesForRole("Tooltips", categoryIndex, seriesIndex);
            let tooltipMetadataColumns = reader.getAllValueMetadataColumnsForRole("Tooltips", seriesIndex);

            if (tooltipValues && tooltipMetadataColumns) {
                for (let j = 0; j < tooltipValues.length; j++) {
                    if (tooltipValues[j] != null && tooltipMetadataColumns[j]) {
                        tooltipInfo.push({
                            displayName: tooltipMetadataColumns[j].displayName,
                            value: converterHelper.formatFromMetadataColumn(tooltipValues[j], tooltipMetadataColumns[j], Gauge.formatStringProp),
                        });
                    }
                }
            }
        }
        
        function getFormattedValue(column: DataViewMetadataColumn, formatStringProp: DataViewObjectPropertyIdentifier, value: any) {
            let formatString: string = getFormatStringFromColumn(column, formatStringProp);
            return valueFormatter.format(value, formatString);
        }

        function getFormatStringFromColumn(column: DataViewMetadataColumn, formatStringProp: DataViewObjectPropertyIdentifier): string {
            if (column) {
                let formatString: string = valueFormatter.getFormatString(column, formatStringProp, true);
                return formatString || column.format;
            }
            return null;
        }
    }
}