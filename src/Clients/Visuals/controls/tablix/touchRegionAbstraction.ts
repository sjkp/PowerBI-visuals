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

/// <reference path="../../_references.ts"/>

module powerbi.visuals.controls.TouchUtils {

    export class Point {
        public x: number;
        public y: number;

        constructor(x?: number, y?: number) {
            this.x = x || 0;
            this.y = y || 0;
        }

        public offset(offsetX: number, offsetY: number) {
            this.x += offsetX;
            this.y += offsetY;
        }
    }

    export class Rectangle extends Point {
        public width: number;
        public height: number;

        constructor(x?: number, y?: number, width?: number, height?: number) {
            super(x, y);
            this.width = width || 0;
            this.height = height || 0;
        }

        get point(): Point {
            return new Point(this.x, this.y);
        }

        public contains(p: Point): boolean {
            return Rectangle.contains(this, p);
        }

        public static contains(rect: Rectangle, p: Point): boolean {
            if (p && !Rectangle.isEmpty(rect)) {
                return rect.x <= p.x && p.x < rect.x + rect.width && rect.y <= p.y && p.y < rect.y + rect.height;
            }
            return false;
        }

        public static isEmpty(rect: Rectangle): boolean {
            return !(rect !== undefined && rect.width >= 0 && rect.height >= 0);
        }
    }

    export const enum SwipeDirection {
        /**
         * Swipe gesture moves along the y-axis at an angle within an established threshold.
         */
        Vertical,
        
        /**
         * Swipe gesture moves along the x-axis at an angle within an established threshold.
         */
        Horizontal,
        
        /**
         * Swipe gesture does not stay within the thresholds of either x or y-axis.
         */
        FreeForm
    }

    export enum MouseButton {
        NoClick = 0,
        LeftClick = 1,
        RightClick = 2,
        CenterClick = 3
    }

    /** 
     * Interface serves as a way to convert pixel point to any needed unit of
     * positioning over two axises such as row/column positioning.
     */
    export interface IPixelToItem {

        getPixelToItem(x: number, y: number, dx: number, dy: number, down: boolean): TouchEvent;
    }

    /**
     * Interface for listening to a simple touch event that's abstracted away
     * from any platform specific traits.
     */
    export interface ITouchHandler {
        touchEvent(e: TouchEvent): void;
    }

    /** 
     * A simple touch event class that's abstracted away from any platform specific traits.
     */
    export class TouchEvent {
        /* tslint:disable:no-underscore-prefix-for-variables*/
        /**
         * X-axis (not neccessarily in pixels (see IPixelToItem)).
         */
        private _x: number;
        
        /**
         * Y-axis (not neccessarily in pixels (see IPixelToItem)).
         */
        private _y: number;
        
        /**
         * Delta of x-axis (not neccessarily in pixels (see IPixelToItem)).
         */
        private _dx: number;
        
        /**
         * Delta of y-axis (not neccessarily in pixels (see IPixelToItem)).
         */
        private _dy: number;
        /* tslint:enable:no-underscore-prefix-for-variables*/
        /**
         * Determines if the mouse button is pressed.
         */
        private isMouseButtonDown: boolean;

        /**
         * @constructor
         * @param x X Location of mouse.
         * @param y Y Location of mouse.
         * @param isMouseDown Indicates if the mouse button is held down or a finger press on screen.
         * @param dx (optional) The change in x of the gesture.
         * @param dy (optional) The change in y of the gesture.
         */
        constructor(x: number, y: number, isMouseDown: boolean, dx?: number, dy?: number) {
            this._x = x;
            this._y = y;
            this.isMouseButtonDown = isMouseDown;
            this._dx = dx || 0;
            this._dy = dy || 0;
        }

        public get x(): number {
            return this._x;
        }

        public get y(): number {
            return this._y;
        }

        public get dx(): number {
            return this._dx;
        }

        public get dy(): number {
            return this._dy;
        }

        /**
         * Returns a boolean indicating if the mouse button is held down.
         * 
         * @return: True if the the mouse button is held down,
         * otherwise false.
         */
        public get isMouseDown(): boolean {
            return this.isMouseButtonDown;
        }
    }

    /**
     * This interface defines the datamembers stored for each touch region.
     */
    export interface ITouchHandlerSet {
        handler: ITouchHandler;
        region: Rectangle;

        lastPoint: TouchEvent;
        converter: IPixelToItem;
    }

    /** 
     * This class "listens" to the TouchEventInterpreter  to recieve touch events and sends it to all 
     * "Touch Delegates" with  TouchRegions that contain the mouse event. Prior to sending off the
     * event, its position is put in respect to the delegate's TouchRegion and converted to the appropriate
     * unit (see IPixelToItem).
     */
    export class TouchManager {
        /**
         * List of touch regions and their correlating data memebers.
         */
        private touchList: ITouchHandlerSet[];
        
        /**
         * Boolean to enable thresholds for fixing to an axis when scrolling.
         */
        private scrollThreshold: boolean;
        
        /**
         * Boolean to enable locking to an axis when gesture is fixed to an axis.
         */
        private lockThreshold: boolean;
        
        /**
         * The current direction of the swipe.
         */
        private swipeDirection: SwipeDirection;
        
        /**
         * The count of consecutive events match the current swipe direction.
         */
        private matchingDirectionCount: number;
        
        /**
         * The last recieved mouse event.
         */
        private lastTouchEvent: TouchEvent;

        /**
         * Default constructor.
         * 
         * The default behavior is to enable thresholds and lock to axis.
         */
        constructor() {
            this.touchList = [];
            this.swipeDirection = SwipeDirection.FreeForm;
            this.matchingDirectionCount = 0;

            this.lockThreshold = true;
            this.scrollThreshold = true;
            this.lastTouchEvent = new TouchEvent(0, 0, false);
        }

        public get lastEvent(): TouchEvent {
            return this.lastTouchEvent;
        }

        /**
         * @param region Rectangle indicating the locations of the touch region.
         * @param handler Handler for recieved touch events.
         * @param converter Converts from pixels to the wanted item of measure (rows, columns, etc).
         *                   
         * EXAMPLE: dx -> from # of pixels to the right to # of columns moved to the right.
         */
        public addTouchRegion(region: Rectangle, handler: ITouchHandler, converter: IPixelToItem): void {
            let item: ITouchHandlerSet = <ITouchHandlerSet> {
                lastPoint: new TouchEvent(0, 0, false),
                handler: handler,
                region: region,
                converter: converter
            };

            this.touchList = this.touchList.concat([item]);
        }

        /**
         * Sends a mouse up event to all regions with their last event as a mouse down event.
         */
        public upAllTouches(): void {
            let eventPoint: TouchEvent;
            let length: number;

            length = this.touchList.length;
            for (let i = 0; i < length; i++) {
                if (this.touchList[i].lastPoint.isMouseDown) {
                    eventPoint = this.touchList[i].converter.getPixelToItem(this.touchList[i].lastPoint.x,
                        this.touchList[i].lastPoint.y,
                        0, 0, false);
                    this.touchList[i].handler.touchEvent(eventPoint);
                }

                this.touchList[i].lastPoint = new TouchEvent(this.touchList[i].lastPoint.x,
                    this.touchList[i].lastPoint.y, false);
            }

            this.lastTouchEvent = new TouchEvent(0, 0, false);
        }

        public touchEvent(e: TouchEvent): void {
            let list: ITouchHandlerSet[];
            let length: number;

            let x: number = 0;
            let y: number = 0;
            let dx: number = 0;
            let dy: number = 0;
            let angle: number = 0;

            let eventPoint: TouchEvent = null;

            //assume there are already regions in the middle of a drag event and get those regions
            list = this._getActive();

            //if this is the start of a mouse drag event, repopulate the list with touched regions
            if (!this.lastTouchEvent.isMouseDown && e.isMouseDown) {
                list = this._findRegions(e);
            }

            //determine the delta values and update last event (delta ignored on first mouse down event)
            dx = this.lastTouchEvent.x - e.x;
            dy = this.lastTouchEvent.y - e.y;
            this.lastTouchEvent = new TouchEvent(e.x, e.y, e.isMouseDown, dx, dy);

            //go through the list
            length = list.length;
            for (let i = 0; i < length; i++) {
                x = e.x - list[i].region.point.x;
                y = e.y - list[i].region.point.y;

                //is this in the middle of a drag?
                if (list[i].lastPoint.isMouseDown && e.isMouseDown) {
                    dx = x - list[i].lastPoint.x;
                    dy = y - list[i].lastPoint.y;

                    //calculate the absolute angle from the horizontal axis
                    angle = Math.abs(180 / Math.PI * Math.atan(dy / dx));

                    if (this.scrollThreshold) {
                        //is the gesture already locked? (6 prior events within the threshold)
                        if (this.lockThreshold && (this.matchingDirectionCount > 5)) {
                            if (this.swipeDirection === SwipeDirection.Horizontal) {
                                dy = 0;
                            }
                            else if (this.swipeDirection === SwipeDirection.Vertical) {
                                dx = 0;
                            }
                        }
                        else {
                            //is it within the horizontal threshold?
                            if (angle < 20) {
                                dy = 0;
                                if (this.swipeDirection === SwipeDirection.Horizontal) {
                                    this.matchingDirectionCount++;
                                }
                                else {
                                    this.matchingDirectionCount = 1;
                                    this.swipeDirection = SwipeDirection.Horizontal;
                                }
                            }
                            else {
                                //calculate the absolute angle from the vertical axis
                                angle = Math.abs(180 / Math.PI * Math.atan(dx / dy));

                                //is it within the horizontal threshold?
                                if (angle < 20) {
                                    dx = 0;

                                    if (this.swipeDirection === SwipeDirection.Vertical) {
                                        this.matchingDirectionCount++;
                                    }
                                    else {
                                        this.matchingDirectionCount = 1;
                                        this.swipeDirection = SwipeDirection.Vertical;
                                    }
                                }
                                else {
                                    if (this.swipeDirection === SwipeDirection.FreeForm) {
                                        this.matchingDirectionCount++;
                                    }
                                    else {
                                        this.swipeDirection = SwipeDirection.FreeForm;
                                        this.matchingDirectionCount = 1;
                                    }
                                }
                            }
                        }
                    }
                }

                else {
                    dx = 0;
                    dy = 0;
                    this.swipeDirection = SwipeDirection.FreeForm;
                    this.matchingDirectionCount = 0;
                }

                list[i].lastPoint = new TouchEvent(x, y, e.isMouseDown, dx, dy);

                eventPoint = list[i].converter.getPixelToItem(x, y, dx, dy, e.isMouseDown);
                list[i].handler.touchEvent(eventPoint);
            }
        }

        /**
         * @param e Position of event used to find touched regions
         * @return Array of regions that contain the event point.
         */
        private _findRegions(e: TouchEvent): ITouchHandlerSet[] {
            let list: ITouchHandlerSet[] = [];
            let length: number;

            length = this.touchList.length;
            for (let i = 0; i < length; i++) {
                if (this.touchList[i].region.contains(new Point(e.x, e.y))) {
                    list = list.concat([this.touchList[i]]);
                }
            }

            return list;
        }

        /**
         * @return Array of regions that contain a mouse down event. (see ITouchHandlerSet.lastPoint).
         */
        private _getActive(): ITouchHandlerSet[] {
            let list: ITouchHandlerSet[] = [];
            let length: number;

            length = this.touchList.length;
            for (let i = 0; i < length; i++) {
                if (this.touchList[i].lastPoint.isMouseDown) {
                    list = list.concat([this.touchList[i]]);
                }
            }

            return list;
        }
    }

    /**
    * This interface defines the swipe data.
    */
    interface ISwipeInfo {
        direction: number;
        distance: number;
        endTime: number;
        time: number;
    }

    const MinDistanceForSwipe = 80;
    const MaxTimeForSwipe = 600;

    /**
     * This class is responsible for establishing connections to handle touch events
     * and to interpret those events so they're compatible with the touch abstractions.
     *
     * Touch events with platform specific handles should be done here.
     */
    export class TouchEventInterpreter {
        /**
         * HTML element that touch events are drawn from.
         */
        private touchPanel: HTMLElement;
        
        /**
         * Boolean enabling mouse drag.
         */
        private allowMouseDrag: boolean;
        
        /**
         * Touch events are interpreted and passed on this manager.
         */
        private manager: TouchManager;
        
        /**
         * @see TablixLayoutManager. 
         */
        private scale: number;
        
        /**
         * Used for mouse location when a secondary div is used along side the primary with this one being the primary.
         */
        private touchReferencePoint: HTMLElement;
        
        /** 
         * Rectangle containing the targeted Div.
         */
        private rect: ClientRect;

        private documentMouseMoveWrapper: any;
        private documentMouseUpWrapper: any;

        /**
         * Those setting related to swipe detection  
         * touchStartTime - the time that the user touched down the screen.
         */
        private touchStartTime: number;
        /**
         * The page y value of the touch event when the user touched down.
         */
        private touchStartPageY: number;
        /**
         * The last page y value befoer the user raised up his finger.
         */
        private touchLastPageY: number;
        /**
         * The last page x value befoer the user raised up his finger.
         */
        private touchLastPageX: number;
        /**
         * An indicator whether we are now running the slide affect.
         */
        private sliding: boolean;

        constructor(manager: TouchManager) {
            this.manager = manager;
            this.allowMouseDrag = true;
            this.touchPanel = null;
            this.scale = 1;
            this.documentMouseMoveWrapper = null;
            this.documentMouseUpWrapper = null;
            this.sliding = false;
        }

        public initTouch(panel: HTMLElement, touchReferencePoint?: HTMLElement, allowMouseDrag?: boolean): void {
            panel.style.setProperty("-ms-touch-action", "pinch-zoom");

            this.touchReferencePoint = touchReferencePoint;

            this.touchPanel = panel;
            this.allowMouseDrag = allowMouseDrag === undefined ? true : allowMouseDrag;
            if ("ontouchmove" in panel) {
                panel.addEventListener("touchstart", e => this.onTouchStart(e));
                panel.addEventListener("touchend", e => this.onTouchEnd(e));
            }
            else {
                panel.addEventListener("mousedown", e => this.onTouchMouseDown(<MouseEvent>e));
                panel.addEventListener("mouseup", e => this.onTouchMouseUp(<MouseEvent>e));
            }
        }

        private getXYByClient(pageX: number, pageY: number, rect: ClientRect): Point {
            let x: number = rect.left;
            let y: number = rect.top;

            // Fix for Safari
            if (window["scrollX"] !== undefined) {
                x += window["scrollX"];
                y += window["scrollY"];
            }

            let point: Point = new Point(0, 0);
            point.offset(pageX - x, pageY - y);

            return point;
        }

        public onTouchStart(e: any): void {
            if (e.touches.length === 1) {
                e.cancelBubble = true;

                let mouchEvent: MouseEvent = e.touches[0];
                this.touchStartTime = new Date().getTime();
                this.touchStartPageY = mouchEvent.pageY;

                this.onTouchMouseDown(mouchEvent);
            }
        }

        public onTouchMove(e: any): void {
            if (e.touches.length === 1) {
                if (e.preventDefault) {
                    e.preventDefault();
                }

                let mouchEvent: MouseEvent = e.touches[0];
                this.touchLastPageY = mouchEvent.pageY;
                this.touchLastPageX = mouchEvent.pageX;
                // while sliding ignore the touch move event 
                if (!this.sliding) {
                    this.onTouchMouseMove(mouchEvent);
                }
            }
        }

        public onTouchEnd(e: any): void {
            this.clearTouchEvents();

            let swipeInfo = this.getSwipeInfo();
            if (this.didUserSwipe(swipeInfo)) {
                this.startSlideAffect(swipeInfo);
            }
            // in case this is not a swipe - we need to reset the rect and the touches 
            else if (!this.sliding) {
                this.upAllTouches();
            }
        }

        public onTouchMouseDown(e: MouseEvent): void {
            this.scale = HTMLElementUtils.getAccumulatedScale(this.touchPanel);

            //any prior touch scrolling that produced a selection outside Tablix will prevent the next touch scroll (1262519)
            document.getSelection().removeAllRanges();

            this.rect = (this.touchReferencePoint ? this.touchReferencePoint : this.touchPanel).getBoundingClientRect();

            if ("ontouchmove" in this.touchPanel) {
                this.documentMouseMoveWrapper = e => this.onTouchMove(e);
                document.addEventListener("touchmove", this.documentMouseMoveWrapper);
                this.documentMouseUpWrapper = e => this.onTouchEnd(e);
                document.addEventListener("touchend", this.documentMouseUpWrapper);
            }
            else {
                this.documentMouseMoveWrapper = e => this.onTouchMouseMove(e);
                document.addEventListener("mousemove", this.documentMouseMoveWrapper);
                this.documentMouseUpWrapper = e => this.onTouchMouseUp(e);
                document.addEventListener("mouseup", this.documentMouseUpWrapper);
            }

            if ("setCapture" in this.touchPanel) {
                this.touchPanel.setCapture();
            }
        }

        public onTouchMouseMove(e: MouseEvent): void {
            let event: TouchEvent;
            let point: Point;

            let rect = this.rect;
            let validMouseDragEvent: boolean = (rect !== null) && (e.which !== MouseButton.NoClick);

            // Ignore events that are not part of a drag event
            if (!validMouseDragEvent || this.sliding)
                return;

            point = this.getXYByClient(e.pageX, e.pageY, rect);
            event = new TouchEvent(point.x / this.scale, point.y / this.scale, validMouseDragEvent);

            this.manager.touchEvent(event);

            if (e.preventDefault)
                e.preventDefault();
            else if ("returnValue" in e) //some browsers missing preventDefault() may still use this instead
                e["returnValue"] = false;
        }

        public onTouchMouseUp(e: MouseEvent, bubble?: boolean): void {
            this.upAllTouches();
            this.clearTouchEvents();
        }

        private getSwipeInfo(): ISwipeInfo {
            let touchEndTime = new Date().getTime();
            let touchTime = touchEndTime - this.touchStartTime;
            let touchDist = this.touchLastPageY - this.touchStartPageY;
            let touchDirection = touchDist < 0 ? -1 : 1;

            return {
                direction: touchDirection,
                distance: touchDist,
                endTime: touchEndTime,
                time: touchTime,
            };
        }

        private didUserSwipe(swipeInfo: ISwipeInfo): boolean {
            return swipeInfo.time < MaxTimeForSwipe && swipeInfo.distance * swipeInfo.direction > MinDistanceForSwipe;
        }

        /**
         * In case of swipe - auto advance to the swipe direction in 2 steps.
         */
        private startSlideAffect(swipeInfo: ISwipeInfo): void {
            if (this.sliding) {
                return;
            }

            this.sliding = true;
            let point = this.getXYByClient(this.touchLastPageX, this.touchLastPageY, this.rect);
            this.slide(point, 300, swipeInfo);

            // second step
            requestAnimationFrame(() => {
                // in case the user is now scrolling in the opposite direction stop the slide
                if (!this.didUserChangeDirection(swipeInfo)) {
                    this.slide(point, 200, swipeInfo);
                }
                this.clearSlide();
            });
        }

        private didUserChangeDirection(swipeInfo: ISwipeInfo): boolean {
            if (this.touchStartTime <= swipeInfo.endTime) {
                return false;
            }

            let updatedDist = this.touchLastPageY - this.touchStartPageY;
            let updatedDirection = updatedDist < 0 ? -1 : 1;
            return updatedDirection !== swipeInfo.direction;
        }

        private slide(point: Point, slideDist: number, swipeInfo: ISwipeInfo): void {
            let updatedDist = this.touchStartTime > swipeInfo.endTime ? this.touchLastPageY - this.touchStartPageY : 0;

            point.y += slideDist * swipeInfo.direction + updatedDist;
            let event = new TouchEvent(point.x / this.scale, point.y / this.scale, true);

            this.manager.touchEvent(event);
        }

        private clearSlide(): void {
            this.sliding = false;
            this.upAllTouches();
        }

        private upAllTouches(): void {
            if (this.documentMouseMoveWrapper !== null)
                return;

            this.rect = null;
            this.manager.upAllTouches();
        }

        private clearTouchEvents(): void {
            if ("releaseCapture" in this.touchPanel) {
                this.touchPanel.releaseCapture();
            }

            if (this.documentMouseMoveWrapper === null)
                return;

            if ("ontouchmove" in this.touchPanel) {
                document.removeEventListener("touchmove", this.documentMouseMoveWrapper);
                document.removeEventListener("touchend", this.documentMouseUpWrapper);
            }
            else {
                document.removeEventListener("mousemove", this.documentMouseMoveWrapper);
                document.removeEventListener("mouseup", this.documentMouseUpWrapper);
            }

            this.documentMouseMoveWrapper = null;
            this.documentMouseUpWrapper = null;
        }
    }
}