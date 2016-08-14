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

module powerbi.visuals.controls {

    /**
     * This class represents the touch region of the column headers (this can also apply to footer/total).
     * This class is reponsible for interpreting gestures in terms of pixels to changes in column position.
     *
     * Unlike the table body, this can only scroll in one direction. 
     */
    export class ColumnTouchDelegate implements TouchUtils.ITouchHandler, TouchUtils.IPixelToItem {

        /** 
         * Used to termine if the touch event is within bounds.
         */
        private dim: TouchUtils.Rectangle;
        /**
         * Average pixel width of columns in table.
         */
        private averageSize: number;
        /**
         * Used for 'firing' a scroll event following a received gesture.
         */
        private tablixControl: TablixControl;
        /**
         * Stores the event handler of TablixControl for scroll events.
         */
        private handlers: any;

        /**
         * @constructor 
         * @param region Location and area of the touch region in respect to its HTML element.
         */
        constructor(region: TouchUtils.Rectangle) {
            this.dim = region;
            this.averageSize = 1; //default
            this.handlers = null;
            this.tablixControl = null;
        }

        get dimension(): TouchUtils.Rectangle {
            return this.dim;
        }

        /** 
         * Sets the amount of columns to be shifted per delta in pixels.
         *
         * @param xRatio Column to pixel ratio (# columns / # pixels).
         */
        public setScrollDensity(xRatio: number): void {
            this.averageSize = xRatio;
        }

        /**
         * Resize element.
         * 
         * @param x X location from upper left of listened HTML element.
         * @param y Y location from upper left of listened HTML element.
         * @param width Width of area to listen for events.
         * @param height Height of area to listen for events.
         */
        public resize(x: number, y: number, width: number, height: number) {
            this.dim.x = x;
            this.dim.y = y;
            this.dim.width = width;
            this.dim.height = height;
        }

        /**
         * @see IPixelToItem.
         */
        public getPixelToItem(x: number, y: number, dx: number, dy: number, down: boolean): TouchUtils.TouchEvent {
            return new TouchUtils.TouchEvent(x * this.averageSize, 0, down, -dx * this.averageSize, 0);
        }

        /**
         * Fires event to Tablix Control to scroll with the event passed from the TouchManager.
         *
         * @param e Event recieved from touch manager.
         */
        public touchEvent(e: TouchUtils.TouchEvent): void {
            let args: any[] = [];

            args[0] = this.tablixControl;
            args[1] = e.dx;
            args[2] = e.dy;

            if (this.handlers) {
                fire([this.handlers], args);
            }
        }

        /**
         * Asigns handler for scrolling when scroll event is fired.
         *
         * @param tablixObj TablixControl that's handling the fired event.
         * @param handlerCall The call to be made (EXAMPLE: handlerCall = object.method;).
         */
        public setHandler(tablixObj: TablixControl, handlerCall: (args: any[]) => void): void {
            this.handlers = handlerCall;
            this.tablixControl = tablixObj;
        }
    }

    /**
     * This class represents the touch region of the row headers (left or right side aligned).
     * This class is reponsible for interpreting gestures in terms of pixels to changes in row position.
     *
     * Unlike the table body, this can only scroll in one direction. 
     */
    export class RowTouchDelegate implements TouchUtils.ITouchHandler, TouchUtils.IPixelToItem {
        /**
         * Used to termine if the touch event is within bounds.
         */
        private dim: TouchUtils.Rectangle;
        
        /**
         * Average pixel height of rows in table.
         */
        private averageSize: number;
        
        /**
         * Used for 'firing' a scroll event following a recieved gesture.
         */
        private tablixControl: TablixControl;
        
        /**
         * Stores the event handler of TablixControl for scroll events.
         */
        private handlers: any;

        /**
         * @constructor
         * @param region Location and area of the touch region in respect to its HTML element.
         */
        constructor(region: TouchUtils.Rectangle) {
            this.dim = region;
            this.averageSize = 30; //default
            this.handlers = null;
            this.tablixControl = null;
        }

        get dimension(): TouchUtils.Rectangle {
            return this.dim;
        }

        /**
         * Sets the amount of rows to be shifted per delta in pixels.
         *
         * @param yRatio Row to pixel ratio (# rows / # pixels).
         */
        public setScrollDensity(yRatio: number): void {
            this.averageSize = yRatio;
        }

        /**
         * Resize element.
         * @param x X location from upper left of listened HTML element.
         * @param y Y location from upper left of listened HTML element.
         * @param width Width of area to listen for events.
         * @param height Height of area to listen for events.
         */
        public resize(x: number, y: number, width: number, height: number) {
            this.dim.x = x;
            this.dim.y = y;
            this.dim.width = width;
            this.dim.height = height;
        }

        /**
         * @see: IPixelToItem
         */
        public getPixelToItem(x: number, y: number, dx: number, dy: number, down: boolean): TouchUtils.TouchEvent {
            let event: TouchUtils.TouchEvent = new TouchUtils.TouchEvent(0, y * this.averageSize, down,
                                                                                   0, -dy * this.averageSize);
            return event;
        }

        /**
         * Fires event to Tablix Control to scroll with the event passed from the TouchManager.
         *
         * @param e Event recieved from touch manager.
         */
        public touchEvent(e: TouchUtils.TouchEvent): void {
            let args: any[] = [];

            args[0] = this.tablixControl;
            args[1] = e.dx;
            args[2] = e.dy;

            if (this.handlers) {
                fire([this.handlers], args);
            }
        }

        /**
         * Asigns handler for scrolling when scroll event is fired.
         *
         * @param tablixObj TablixControl that's handling the fired event.
         * @param handlerCall The call to be made (EXAMPLE: handlerCall = object.method;).
         */
        public setHandler(tablixObj: TablixControl, handlerCall: (args: any[]) => void): void {
            this.handlers = handlerCall;
            this.tablixControl = tablixObj;
        }
    }

    /**
     * This class represents the touch region covering the body of the table.
     * This class is reponsible for interpreting gestures in terms of pixels to
     * changes in row and column position.
     */
    export class BodyTouchDelegate implements TouchUtils.ITouchHandler, TouchUtils.IPixelToItem {
        private static DefaultAverageSizeX = 30;
        private static DefaultAverageSizeY = 30;
        
        /**
         * Used to termine if the touch event is within bounds.
         */
        private dim: TouchUtils.Rectangle;
        
        /**
         * Average pixel width of columns in table.
         */
        private averageSizeX: number;
        
        /**
         * Average pixel height of rows in table.
         */
        private averageSizeY: number;
        
        /**
         * Used for 'firing' a scroll event following a recieved gesture.
         */
        private tablixControl: TablixControl;
        
        /**
         * Stores the event handler of TablixControl for scroll events.
         */
        private handlers: any;

        /**
         * @constructor
         * @param region Location and area of the touch region in respect to its HTML element.
         */
        constructor(region: TouchUtils.Rectangle) {
            this.dim = region;
            this.averageSizeX = BodyTouchDelegate.DefaultAverageSizeX;
            this.averageSizeY = BodyTouchDelegate.DefaultAverageSizeY;
            this.handlers = null;
            this.tablixControl = null;
        }

        /**
         * Returns dimension.
         * 
         * @return The dimentions of the region this delegate listens to.
         */
        get dimension(): TouchUtils.Rectangle {
            return this.dim;
        }

        /**
         * Sets the amount of rows and columns to be shifted per delta in pixels.
         *
         * @param xRatio Column to pixel ratio (# columns / # pixels)
         * @param yRatio Row to pixel ratio (# rows / # pixels)
         */
        public setScrollDensity(xRatio: number, yRatio: number): void {
            this.averageSizeX = xRatio;
            this.averageSizeY = yRatio;
        }

        /**
         * Resize element.
         * 
         * @param x X location from upper left of listened HTML element.
         * @param y Y location from upper left of listened HTML element.
         * @param width Width of area to listen for events.
         * @param height Height of area to listen for events.
         */
        public resize(x: number, y: number, width: number, height: number) {
            let dimension = this.dim;

            dimension.x = x;
            dimension.y = y;
            dimension.width = width;
            dimension.height = height;
        }

        /**
         * @see: IPixelToItem.
         */
        public getPixelToItem(x: number, y: number, dx: number, dy: number, down: boolean): TouchUtils.TouchEvent {
            return new TouchUtils.TouchEvent(x * this.averageSizeX, y * this.averageSizeY, down, -dx * this.averageSizeX, -dy * this.averageSizeY);
        }

        /**
         * Fires event to Tablix Control to scroll with the event passed from the TouchManager.
         *
         * @param e Event recieved from touch manager.
         */
        public touchEvent(e: TouchUtils.TouchEvent): void {
            let args: any[] = [this.tablixControl, e.dx, e.dy];

            if (this.handlers) {
                fire([this.handlers], args);
            }
        }

        /**
         * Asigns handler for scrolling when scroll event is fired.
         *
         * @param tablixObj TablixControl that's handling the fired event.
         * @param handlerCall The call to be made (EXAMPLE: handlerCall = object.method;).
         */
        public setHandler(tablixObj: TablixControl, handlerCall: (args: any[]) => void): void {
            this.handlers = handlerCall;
            this.tablixControl = tablixObj;
        }
    }
}