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

/* tslint:disable */
const powerBIAccessToken = "fooBarBaz";
const powerBIAccessTokenExpiry = "2115-01-01 00:00:00Z";
/* tslint:enable */

declare interface JQuery {
    d3Click(x: number, y: number, eventType?: powerbitests.helpers.ClickEventType): void;
    d3TouchStart(): void;
    d3ContextMenu(x: number, y: number): void;
    d3MouseDown(x: number, y: number): void;
    d3KeyEvent(typeArg: string, keyArg: string, keyCode: number): void;
}

module powerbitests.helpers {
    import AxisHelper = powerbi.visuals.AxisHelper;
    import ValueType = powerbi.ValueType;
    import valueFormatter = powerbi.visuals.valueFormatter;

    debug.assertFailFunction = (message: string) => {
        expect(message).toBe('DEBUG asserts should never happen.  There is a product or test bug.');
    };

    export let dataSets = {
        singleMeasureDataViewSource: '{"descriptor": {"Select": [{"Kind": 2, "Value": "M0"}]}, "dsr": {"DataShapes":[{"Id":"DS0","PrimaryHierarchy":[{"Id":"DM0","Instances":[{"Calculations":[{"Id":"M0","Value":"21852688.46698004D"}]}]}],"IsComplete":true}]}}',
        dataViewSourceWithErrors: '{"descriptor":{"Select":[{"Kind":1,"Depth":0,"Value":"G0"},{"Kind":2,"Value":"M0","Subtotal":["A0"],"Min":["A2"],"Max":["A1"]}],"Expressions":{"Primary":{"Groupings":[{"Keys":[{"Source":{"Entity":"DimDate","Property":"Month Name"},"Select":0},{"Source":{"Entity":"DimDate","Property":"Month Number"},"Calc":"K0"}]}]}}},"dsr":{"DataShapes":[{"Id":"DS0","odata.error":{"code":"rsDataShapeQueryTranslationError","message":{"lang":"da-DK","value":"Data Shape Query translation failed with error code: \'InvalidExpression\'. Check the report server logs for more information."},"azure:values":[{"timestamp":"2015-01-15T07:44:45.8135124Z"},{"details":"Microsoft.ReportingServices.DataShapeQueryTranslation.DataShapeQueryTranslationException: Data Shape Query translation failed with error code: \'InvalidExpression\'. Check the report server logs for more information."},{"helpLink":"http://go.microsoft.com/fwlink/?LinkId=20476&EvtSrc=Microsoft.ReportingServ…Error&ProdName=Microsoft%20SQL%20Server%20Reporting%20Services&ProdVer=1.0"},{"productInfo":{"productName":"change this","productVersion":"1.0","productLocaleId":127,"operatingSystem":"OsIndependent","countryLocaleId":1033}},{"moreInformation":{"odata.error":{"code":"System.Exception","message":{"lang":"da-DK","value":"For more information about this error navigate to the report server on the local server machine, or enable remote errors"},"azure:values":[{"details":"System.Exception: For more information about this error navigate to the report server on the local server machine, or enable remote errors"}]}}}]}}]}}',
    };

    export function fireOnDataChanged(visual: powerbi.IVisual, dataOptions: powerbi.VisualDataChangedOptions): void {
        visual.onDataChanged(dataOptions);

        jasmine.clock().tick(0);
    }

    export function testDom(height: string, width: string): JQuery {
        let element = $('<div></div>')
            .attr('id', 'item')
            .css('width', width)
            .css('height', height)
            .css("position", "relative")
            .addClass('visual');
        setFixtures(element[0].outerHTML);

        return $('#item');
    }

    /**
     * Waits for some time and then Executes a function asynchronously
     * @param {function} fn Function to be executed
     * @param {number} delay Time to wait in milliseconds
     */
    export function executeWithDelay(fn: Function, delay: number): void {
        // Uninstalling jasmine.clock() to enable using the following timer
        jasmine.clock().uninstall();
        
        // Waiting until scroll takes effect
        setTimeout(() => {
            // Calling the assert function
            fn();
        }, delay);
        
        // installing the clock again
        jasmine.clock().install();
    }

    export function isTranslateCloseTo(actualTranslate: string, expectedX: number, expectedY: number): boolean {
        let splitChar = actualTranslate.indexOf(",") > 0 ? ',' : ' ';
        let translateValues = actualTranslate.substr(10, actualTranslate.lastIndexOf(')') - 10).split(splitChar);
        let actualX = parseInt(translateValues[0], 10);
        let actualY = parseInt(translateValues[1], 10);

        return isCloseTo(actualX, expectedX, /*tolerance*/ 1)
            && isCloseTo(actualY, expectedY, /*tolerance*/ 1);
    }

    export function isCloseTo(actual: number, expected: number, tolerance: number = 1): boolean {
        let delta = Math.abs(expected - actual);
        return delta <= tolerance;
    }

    export function buildSelectorForColumn(queryName: string, data: powerbi.data.DataRepetitionSelector, selector?: powerbi.SelectorForColumn): powerbi.SelectorForColumn {
        let newSelector: powerbi.SelectorForColumn = selector ? selector : {};
        newSelector[queryName] = data;

        return newSelector;
    }

    /** Returns a function that can be called to trigger a dragstart. */
    export function getDragStartTriggerFunctionForD3(element: HTMLElement): (arg) => {} {
        let elem: any = element;
        if (elem.__ondragstart)
            return arg => elem.__ondragstart(arg);
    }

    /** Execute a dummy expect to avoid Jasmine warnings, since some tests only perform validation directly on the httpService via expectPOST etc. */
    export function suppressJasmineMissingExpectWarning(): void {
        expect(true).toBe(true);
    }

    export enum ClickEventType {
        Default = 0,
        CtrlKey = 1,
        AltKey = 2,
        ShiftKey = 4,
        MetaKey = 8,
    }

    export enum MouseEventType {
        click,
        mousedown
    }

    jQuery.fn.d3Click = function (x: number, y: number, eventType?: ClickEventType): void {
        mouseEvent.call(this, MouseEventType.click, x, y, eventType);
    };

    jQuery.fn.d3MouseDown = function (x: number, y: number, eventType?: ClickEventType): void {
        mouseEvent.call(this, MouseEventType.mousedown, x, y, eventType);
    };

    jQuery.fn.d3KeyEvent = function (typeArg: string, keyArg: string, keyCode: number): void {
        keyEvent.call(this, typeArg, keyArg, keyCode);
    };

    jQuery.fn.d3TouchStart = function (): void {
        this.each(function (i, e) {
            let evt = createTouchStartEvent();
            e.dispatchEvent(evt);
        });
    };

    jQuery.fn.d3ContextMenu = function (x: number, y: number): void {
        this.each(function (i, e) {
            let evt = createContextMenuEvent(x, y);
            e.dispatchEvent(evt);
        });
    };

    // Defining a simulated click event (see http://stackoverflow.com/questions/9063383/how-to-invoke-click-event-programmaticaly-in-d3)
    function mouseEvent (mouseEventType: MouseEventType, x: number, y: number, eventType?: ClickEventType): void {
        let type = eventType || ClickEventType.Default;
        this.each(function (i, e) {
            let evt = createMouseEvent(mouseEventType, type, x, y);
            e.dispatchEvent(evt);
        });
    };

    function keyEvent(typeArg: string, keyArg: string, keyCode: number): void {
        this.each(function (i, e) {
            let evt = document.createEvent("KeyboardEvent");
            evt.initKeyboardEvent(typeArg, true, true, window, keyArg, KeyboardEvent.DOM_KEY_LOCATION_STANDARD, null, false, null);
            e.dispatchEvent(evt);
        });
    }

    export function clickElement(element: JQuery, ctrlKey: boolean = false): void {
        let coords = element.offset();
        let width = element.outerWidth();
        let height = element.outerHeight();
        let eventType = ctrlKey ? helpers.ClickEventType.CtrlKey : helpers.ClickEventType.Default;
        element.d3Click(coords.left + (width / 2), coords.top + (height / 2), eventType);
    }

    export function runWithImmediateAnimationFrames(func: () => void): void {
        let requestAnimationFrame = window.requestAnimationFrame;
        try {
            window.requestAnimationFrame = (f) => setTimeout(f, 0);
            func();
        }
        finally {
            window.requestAnimationFrame = requestAnimationFrame;
        }
    }

    export function runWithExpectedAssertFailures(func: () => void): void {
        let assertFail = debug.assertFail;
        try {
            let assertFailSpy = spyOn(debug, 'assertFail');
            func();
            expect(assertFailSpy).toHaveBeenCalled();
        }
        finally {
            debug.assertFail = assertFail;
        }
    }

    export function deepCopy(object: any): any {
        return JSON.parse(JSON.stringify(object));
    }

    export function getLocalTimeFromUTCBase(utcYear: number, utcMonth: number, utcDay: number, utcHours: number, utcMinutes: number, utcSeconds: number): Date {
        // IMPORTANT: We need to dynamically calculate the UTC offset to use for our test date instead of hard-coding the offset so that:
        // i) It doesn't break when daylight savings changes the UTC offset
        // ii) The test works even if your machine is not in the US Pacific Time zone :)
        let baseDate = new Date(utcYear, utcMonth, utcDay, utcHours, utcMinutes, utcSeconds);
        let offsetMinutes = baseDate.getTimezoneOffset();
        let date = new Date();
        date.setTime(baseDate.getTime() - offsetMinutes * 60000);
        return date;
    }

    export function isUndefined(value) { return typeof value === 'undefined'; }

    export enum ContextMenuEntityButtonPosition {
        NewMeasure = 0,
        NewColumn = 1,
        Rename = 3,
        Delete = 4,
        Hide = 5,
        ViewHidden = 7,
        UnhideAll = 8,
    }
    export enum ContextMenuPropertyButtonPosition {
        AddFilter = 0,
        NewMeasure = 2,
        NewColumn = 3,
        Rename = 5,
        Delete = 6,
        Hide = 7,
        ViewHidden = 9,
        UnhideAll = 10,
    }

    export interface Point {
        x: number;
        y: number;
    }

    export function parseDateString(dateString: string): Date {
        let date,
            timezoneOffset;

        date = new Date(dateString);

        if (date.toString() === 'Invalid Date') {
            return null;
        }

        timezoneOffset = date.getTimezoneOffset();

        date.setMinutes(date.getMinutes() + timezoneOffset);

        return date;
    }

    export function createMouseWheelEvent(eventName: string, deltaX: number, deltaY: number, detail: number): MouseWheelEvent {
        let evt = document.createEvent("MouseEvents");
        evt.initMouseEvent(
            eventName,
            true,  // boolean canBubbleArg,
            true,  // boolean cancelableArg,
            null,  // views::AbstractView viewArg,
            120,   // long detailArg,
            0,     // long screenXArg,
            0,     // long screenYArg,
            0,     // long clientXArg,
            0,     // long clientYArg,
            false, // boolean ctrlKeyArg,
            false, // boolean altKeyArg,
            false, // boolean shiftKeyArg,
            false, // boolean metaKeyArg,
            0,     // unsigned short buttonArg,
            null   // EventTarget relatedTargetArg
        );
        let mouseEvt = <MouseWheelEvent>evt;
        mouseEvt.wheelDelta = deltaY == null ? deltaX : deltaY;
        mouseEvt.wheelDeltaX = deltaX;
        mouseEvt.wheelDeltaY = deltaY;
        mouseEvt.detail = detail;

        return mouseEvt;
    }

    /**
     * Creates mouse event 
     * @param eventType {ClickEventType}.
     * @param x clientX.
     * @param y clientY.
     * @param eventName {string} Event name e.g click, mousedown ... 
     */
    export function createMouseEvent(mouseEventType: MouseEventType, eventType: ClickEventType, x: number, y: number): MouseEvent {
        let type = eventType || ClickEventType.Default;
        let evt = document.createEvent("MouseEvents");
        evt.initMouseEvent(
            MouseEventType[mouseEventType], // type
            true,   // canBubble
            true,   // cancelable
            window, // view
            0,      // detail
            x,      // screenX
            y,      // screenY
            x,      // clientX
            y,      // clientY
            !!(type & ClickEventType.CtrlKey),  // ctrlKey
            !!(type & ClickEventType.AltKey),  // altKey
            !!(type & ClickEventType.ShiftKey),  // shiftKey
            !!(type & ClickEventType.MetaKey),  // metaKey
            0,      // button
            null);  // relatedTarget

        return evt;
    }

    export function createTouchStartEvent(): UIEvent {
        let evt = document.createEvent("UIEvent");
        evt.initUIEvent("touchstart", true, true, window, 1);
         
        return evt;
    }

    export function createContextMenuEvent(x: number, y: number): MouseEvent {
        let evt = document.createEvent("MouseEvents");
        evt.initMouseEvent(
            "contextmenu", // type
            true,   // canBubble
            true,   // cancelable
            window, // view
            0,      // detail
            x,      // screenX
            y,      // screenY
            x,      // clientX
            y,      // clientY
            false,  // ctrlKey
            false,  // altKey
            false,  // shiftKey
            false,  // metaKey
            0,      // button
            null);  // relatedTarget
        return evt;
    }

    /**
    * The original string, which ended with '...' was always placed in the DOM
    * CSS text-overflow property with value ellipsis was truncating the text visually
    * This function verifies the width and visual truncation are working appropriately
    */
    export function verifyEllipsisActive($element: JQuery): void {
        let element = $element.get(0);
        expect($element.css('textOverflow')).toBe('ellipsis');
        expect(element.offsetWidth).toBeLessThan(element.scrollWidth);
    }

    /** 
    Checks if value is in the given range 
    @val Value to check
    @min Min value of range
    @max Max value of range
    @returns True, if value falls in range. False, otherwise
    **/
    export function isInRange(val: number, min: number, max: number): Boolean {
        return min <= val && val <= max;
    }

    export function assertColorsMatch(actual: string, expected: string, invert: boolean = false): boolean {
        let rgbActual = jsCommon.Color.parseColorString(actual);
        let rgbExpected = jsCommon.Color.parseColorString(expected);

        if (invert)
            return expect(rgbActual).not.toEqual(rgbExpected);
        else
            return expect(rgbActual).toEqual(rgbExpected);
    }

    export function assertOpacitiesMatch(actual: string, expected: number): boolean {
        let actualOpacity = parseFloat(actual);
        return expect(actualOpacity).toBeCloseTo(expected, 0);
    }

    export function assertFontSizeMatch(actual: string, expectedInPt: number): boolean {
        let actualInPx = parseFloat(actual);
        let actualInPt = jsCommon.PixelConverter.toPoint(actualInPx);

        return expect(actualInPt).toBeCloseTo(expectedInPt, 0);
    }

    export function verifyPositionAttributes(element: JQuery): void {
        let checkAttrs = ['x', 'y', 'x1', 'x2', 'y1', 'y2'];
        for (let attr of checkAttrs) {
            let value = element.attr(attr);
            if (!value)
                continue;
            let numericValue = parseInt(element.attr(attr), 10);
            expect(isNaN(numericValue)).toBe(false);
        }
    }

    export function findElementText(element: JQuery): string {
        debug.assert(element.length > 0, 'expected parent element');
        let nodes = element[0].childNodes;

        if (nodes) {
            for (let i = 0; i < nodes.length; i++) {
                if (nodes[i].nodeType === Node.TEXT_NODE) {
                    return nodes[i].textContent;
                }
            }
        }
    }

    export function findElementTitle(element: JQuery): string {
        debug.assert(element.length > 0, 'expected parent element');
        let nodes = element[0].childNodes;

        if (nodes) {
            for (let i = 0; i < nodes.length; i++) {
                if (nodes[i].nodeType === Node.ELEMENT_NODE && nodes[i].localName === "title") {
                    return nodes[i].textContent;
                }
            }
        }

        return null;
    }

    /**
     * Get the ticks for a cartesian axis.
     * @param axis Class name for the axis, should be either x or y.
     */
    export function getAxisTicks(axis: string): JQuery {
        return $('.cartesianChart .' + axis + '.axis .tick');
    }

    /**
     * Get the label for a cartesian axis.
     * @param axis Class name for the axis, should be either x or y.
     */
    export function getAxisLabel(axis: string): JQuery {
        return $('.cartesianChart .axisGraphicsContext .' + axis + 'AxisLabel');
    }

    export function createTouchesList(touches: Touch[]): TouchList {

        var touchesList: TouchList = <any>touches;
        (<any>touches).item = (index: number): any => {
            return this.arr[index];
        };

        return touchesList;
    }

    export function touchStartSimulator(d3Element: any) {
        let evt: any = document.createEvent("TouchEvent");
        evt.initEvent("touchstart", true, true);
        evt.eventName = "touchstart";
        d3Element.node().dispatchEvent(evt);
    }

    export function touchMoveSimulator(d3Element: any) {
        let evt1: any = document.createEvent("TouchEvent");
        evt1.initEvent("touchmove", true, true);
        evt1.eventName = "touchmove";
        d3Element.node().dispatchEvent(evt1);
    }

    export class DataViewBuilder {
        private dataView: powerbi.DataView = { metadata: null };

        public setMetadata(metadata: powerbi.DataViewMetadata): DataViewBuilder {
            this.dataView.metadata = metadata;
            return this;
        }

        public getMetadata(): powerbi.DataViewMetadata {
            return this.dataView.metadata;
        }

        public setCategorical(categorical: powerbi.DataViewCategorical) {
            this.dataView.categorical = categorical;
            return this;
        }

        public setCategories(categories: powerbi.DataViewCategoryColumn[]) {
            this.initCategorical();
            this.dataView.categorical.categories = categories;

            return this;
        }

        public addCategory(category: powerbi.DataViewCategoryColumn) {
            this.initCategories();
            this.dataView.categorical.categories.push(category);
            return this;
        }

        public categoryBuilder(category: powerbi.DataViewCategoryColumn = { source: null, values: null }) {
            let self = this;

            return {
                setIdentity(identity: powerbi.DataViewScopeIdentity[]) {
                    category.identity = identity;
                    return this;
                },
                setIdentityFields(identityFields: powerbi.data.SQExpr[]) {
                    category.identityFields = identityFields;
                    return this;
                },
                setSource(source: powerbi.DataViewMetadataColumn) {
                    category.source = source;
                    return this;
                },
                setValues(values: any[]) {
                    category.values = values;
                    return this;
                },
                setObjects(objects: powerbi.DataViewObjects[]) {
                    category.objects = objects;
                    return this;
                },
                buildCategory() {
                    return self.addCategory(category);
                }
            };
        }

        public valueColumnsBuilder() {
            let self = this;

            this.initCategorical();

            let tempValues: powerbi.DataViewValueColumn[] = [];
            let valueIdentityFields: powerbi.data.SQExpr[];
            let source: powerbi.DataViewMetadataColumn;
            return {
                newValueBuilder(value: powerbi.DataViewValueColumn = <powerbi.DataViewValueColumn>{}) {
                    let self = this;
                    return {
                        setSubtotal(subtotal: any) {
                            value.subtotal = subtotal;
                            return this;
                        },
                        setMax(max: any) {
                            value.max = max;
                            return this;
                        },
                        setMin(min: any) {
                            value.min = min;
                            return this;
                        },
                        setHighlights(highlights: any[]) {
                            value.highlights = highlights;
                            return this;
                        },
                        setIdentity(identity: powerbi.DataViewScopeIdentity) {
                            value.identity = identity;
                            return this;
                        },
                        setMaxLocal(maxLocal: any) {
                            value.maxLocal = maxLocal;
                            return this;
                        },
                        setMinLocal(minLocal: any) {
                            value.minLocal = minLocal;
                            return this;
                        },
                        setSource(source: powerbi.DataViewMetadataColumn) {
                            value.source = source;
                            return this;
                        },
                        setValues(values: any[]) {
                            value.values = values;
                            return this;
                        },
                        setObjects(objects: powerbi.DataViewObjects[]) {
                            value.objects = objects;
                            return this;
                        },
                        buildNewValue() {
                            tempValues.push(value);
                            return self;
                        }
                    };
                },
                setValueIdentityFields(identityFields: powerbi.data.SQExpr[]) {
                    valueIdentityFields = identityFields;
                    return self;
                },
                setSource(src: powerbi.DataViewMetadataColumn) {
                    source = src;
                    return self;
                },
                buildValueColumns() {
                    self.setValues(powerbi.data.DataViewTransform.createValueColumns(tempValues, valueIdentityFields, source));
                    return self;
                }
            };
        }

        public setValues(values: powerbi.DataViewValueColumns) {
            this.initCategorical();
            this.dataView.categorical.values = values;

            return this;
        }

        public build(): powerbi.DataView {
            return this.dataView;
        }

        private initCategorical() {
            if (!this.dataView.categorical) {
                this.setCategorical({});
            }
        }

        private initCategories() {
            this.initCategorical();
            if (!this.dataView.categorical.categories) {
                this.setCategories([]);
            }
        }
    }

    export class VisualBuilder {
        private visualHostService: powerbi.IVisualHostServices;

        public get host(): powerbi.IVisualHostServices {
            return this.visualHostService;
        }

        private visualStyle: powerbi.IVisualStyle;

        private jQueryElement: JQuery;

        public get element(): JQuery {
            return this.jQueryElement;
        }

        private visualPlugin: powerbi.IVisual;

        public get visual(): powerbi.IVisual {
            return this.visualPlugin;
        }

        public transitionImmediate: boolean = true;

        public interactivitySelection: boolean = false;

        constructor(
            private visualCreateFn: () => powerbi.IVisual,
            private height: number = 500,
            private width: number = 500
        ) { }

        private init(): void {
            this.createElement();
            this.createHost();
            this.createStyle();
            this.createVisual();

            this.initVisual();
        }

        private createElement(): void {
            this.jQueryElement = powerbitests.helpers.testDom(
                this.height.toString(),
                this.width.toString());
        }

        private createHost(): void {
            this.visualHostService = powerbitests.mocks.createVisualHostServices();
        }

        private createStyle(): void {
            this.visualStyle = powerbi.visuals.visualStyles.create();
        }

        private createVisual(): void {
            if (this.visualCreateFn) {
                this.visualPlugin = this.visualCreateFn();
            }
        }

        private initVisual(): void {
            if (!this.visualPlugin)
                return;

            this.visualPlugin.init({
                element: this.jQueryElement,
                host: this.visualHostService,
                style: this.visualStyle,
                viewport: {
                    height: this.height,
                    width: this.width
                },
                animation: {
                    transitionImmediate: this.transitionImmediate
                },
                interactivity: {
                    selection: this.interactivitySelection
                }
            });
        }

        public setSize(height: number, width: number): void {
            this.height = height;
            this.width = width;

            this.init();
        }

        public build(): powerbi.IVisual {
            this.init();

            return this.visualPlugin;
        }
    }

    export module AxisPropertiesBuilder {
        var dataStrings = ["Sun", "Mon", "Holiday"];

        export var dataNumbers = [47.5, 98.22, 127.3];

        var domainOrdinal3 = [0, 1, 2];

        var domainBoolIndex = [0, 1];

        export var domainNaN = [NaN, NaN];

        var displayName: string = "Column";

        var pixelSpan: number = 100;

        export var dataTime = [
            new Date("10/15/2014"),
            new Date("10/15/2015"),
            new Date("10/15/2016")
        ];

        var metaDataColumnText: powerbi.DataViewMetadataColumn = {
            displayName: displayName,
            type: ValueType.fromDescriptor({ text: true })
        };

        export var metaDataColumnNumeric: powerbi.DataViewMetadataColumn = {
            displayName: displayName,
            type: ValueType.fromDescriptor({ numeric: true })
        };

        export var metaDataColumnCurrency: powerbi.DataViewMetadataColumn = {
            displayName: displayName,
            type: ValueType.fromDescriptor({ numeric: true }),
            objects: { general: { formatString: '$0' } },
        };

        var metaDataColumnBool: powerbi.DataViewMetadataColumn = {
            displayName: displayName,
            type: ValueType.fromDescriptor({ bool: true })
        };

        var metaDataColumnTime: powerbi.DataViewMetadataColumn = {
            displayName: displayName,
            type: ValueType.fromDescriptor({ dateTime: true }),
            format: 'yyyy/MM/dd',
            objects: { general: { formatString: 'yyyy/MM/dd' } },
        };

        var formatStringProp: powerbi.DataViewObjectPropertyIdentifier = {
            objectName: "general",
            propertyName: "formatString"
        };

        function getValueFnStrings(index): string {
            return dataStrings[index];
        }

        function getValueFnNumbers(index): number {
            return dataNumbers[index];
        }

        function getValueFnBool(d): boolean {
            return d === 0;
        }

        function getValueFnTime(index): Date {
            return new Date(index);
        }

        function getValueFnTimeIndex(index): Date {
            return dataTime[index];
        }

        function createAxisOptions(
            metaDataColumn: powerbi.DataViewMetadataColumn,
            dataDomain: any[],
            getValueFn?): powerbi.visuals.CreateAxisOptions {
            var axisOptions: powerbi.visuals.CreateAxisOptions = {
                pixelSpan: pixelSpan,
                dataDomain: dataDomain,
                metaDataColumn: metaDataColumn,
                formatString: valueFormatter.getFormatString(metaDataColumn, formatStringProp),
                outerPadding: 0.5,
                isScalar: false,
                isVertical: false,
                getValueFn: getValueFn,
            };

            return axisOptions;
        }

        function getAxisOptions(
            metaDataColumn: powerbi.DataViewMetadataColumn): powerbi.visuals.CreateAxisOptions {
            var axisOptions = createAxisOptions(
                metaDataColumn,
                metaDataColumn ? domainOrdinal3 : [],
                getValueFnStrings);

            return axisOptions;
        }

        export function buildAxisProperties(dataDomain: any[], metadataColumn?: powerbi.DataViewMetadataColumn): powerbi.visuals.IAxisProperties {
            var axisOptions = createAxisOptions(metadataColumn ? metadataColumn : metaDataColumnNumeric, dataDomain);
            axisOptions.isScalar = true;
            axisOptions.useTickIntervalForDisplayUnits = true;

            return AxisHelper.createAxis(axisOptions);
        }

        export function buildAxisPropertiesString(): powerbi.visuals.IAxisProperties {
            var axisOptions = getAxisOptions(metaDataColumnText);

            return AxisHelper.createAxis(axisOptions);
        }

        export function buildAxisPropertiesText(
            metaDataColumn: powerbi.DataViewMetadataColumn): powerbi.visuals.IAxisProperties {
            var axisOptions = getAxisOptions(metaDataColumn);

            return AxisHelper.createAxis(axisOptions);
        }

        export function buildAxisPropertiesNumber(): powerbi.visuals.IAxisProperties {
            var os = AxisHelper.createAxis(
                createAxisOptions(
                    metaDataColumnNumeric,
                    domainOrdinal3,
                    getValueFnNumbers));

            return os;
        }

        export function buildAxisPropertiesBool(): powerbi.visuals.IAxisProperties {
            var os = AxisHelper.createAxis(
                createAxisOptions(
                    metaDataColumnBool,
                    domainBoolIndex,
                    getValueFnBool));

            return os;
        }

        export function buildAxisPropertiesStringWithCategoryThickness(
            categoryThickness: number = 5): powerbi.visuals.IAxisProperties {
            var axisOptions = createAxisOptions(
                metaDataColumnText,
                domainOrdinal3,
                getValueFnStrings);

            axisOptions.categoryThickness = categoryThickness;

            return AxisHelper.createAxis(axisOptions);
        }

        export function buildAxisPropertiesNumbers(): powerbi.visuals.IAxisProperties {
            var axisOptions = createAxisOptions(
                metaDataColumnNumeric,
                [
                    dataNumbers[0],
                    dataNumbers[2]
                ]);

            axisOptions.isScalar = true;

            return AxisHelper.createAxis(axisOptions);
        }

        export function buildAxisPropertiesNan(): powerbi.visuals.IAxisProperties {
            var axisOptions = createAxisOptions(
                metaDataColumnNumeric,
                domainNaN);

            axisOptions.isVertical = true;
            axisOptions.isScalar = true;

            return AxisHelper.createAxis(axisOptions);
        }

        export function buildAxisPropertiesNumeric(
            dataDomain: any[],
            categoryThickness?: number,
            pixelSpan?: number,
            isVertical: boolean = true,
            isScalar: boolean = true): powerbi.visuals.IAxisProperties {
            var axisOptions = createAxisOptions(
                metaDataColumnNumeric,
                dataDomain);

            if (categoryThickness) {
                axisOptions.categoryThickness = categoryThickness;
            }

            if (pixelSpan) {
                axisOptions.pixelSpan = pixelSpan;
            }

            axisOptions.isVertical = isVertical;
            axisOptions.isScalar = isScalar;

            return AxisHelper.createAxis(axisOptions);
        }

        export function buildAxisPropertiesTime(
            dataDomain: any[],
            isScalar: boolean = true,
            maxTicks?: number): powerbi.visuals.IAxisProperties {
            var axisOptions = createAxisOptions(
                metaDataColumnTime,
                dataDomain,
                getValueFnTime);

            axisOptions.isScalar = isScalar;

            if (maxTicks)
                axisOptions.maxTickCount = maxTicks;

            return AxisHelper.createAxis(axisOptions);
        }

        export function buildAxisPropertiesTimeIndex(): powerbi.visuals.IAxisProperties {
            var axisOptions = createAxisOptions(
                metaDataColumnTime,
                domainOrdinal3,
                getValueFnTimeIndex);

            return AxisHelper.createAxis(axisOptions);
        }
    }
}
