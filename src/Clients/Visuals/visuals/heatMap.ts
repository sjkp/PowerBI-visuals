﻿/*
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

/* Please make sure that this path is correct */
/// <reference path="../_references.ts"/>

module powerbi.visuals {
  
    export class SimpleHeatMap
    {        
        /*
         (c) 2014, Vladimir Agafonkin
         simpleheat, a tiny JavaScript library for drawing heatmaps with Canvas
         https://github.com/mourner/simpleheat

        Copyright (c) 2014, Vladimir Agafonkin
        All rights reserved.

        Redistribution and use in source and binary forms, with or without modification, are
        permitted provided that the following conditions are met:

           1. Redistributions of source code must retain the above copyright notice, this list of
              conditions and the following disclaimer.

           2. Redistributions in binary form must reproduce the above copyright notice, this list
              of conditions and the following disclaimer in the documentation and/or other materials
              provided with the distribution.

        THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
        EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
        MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
        COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
        EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
        SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
        HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
        TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
        SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
        */
        private ctx: any;
        private canvas: HTMLCanvasElement;
        private circle: HTMLCanvasElement;
        private width: number;
        private height: number;
        private maxValue: number;
        private dataPoints: any;
        private r: number;
        private grad: number[];

        public defaultRadius = 5;
        public defaultGradient = {
            0.4: 'blue',
            0.6: 'cyan',
            0.7: 'lime',
            0.8: 'yellow',
            1.0: 'red'
        };

        constructor(canvas)
        {
            // jshint newcap: false, validthis: true
            //if (!(this instanceof SimpleHeatMap)) { return new SimpleHeatMap(canvas); }

            this.canvas = canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas;

            this.ctx = canvas.getContext('2d');
            this.width = canvas.width;
            this.height = canvas.height;

            this.maxValue = 1;
            this.dataPoints = [];
        }

        public data(data) {
            this.dataPoints = data;
            return this;
        }

        public max(max) {
            this.maxValue = max;
            return this;
        }

        public add(point) {
            this.dataPoints.push(point);
            return this;
        }

        public clear() {
            this.dataPoints = [];
            return this;
        }

        public radius(r: number, blur?: number) {
            blur = blur === undefined ? 15 : blur;

            // create a grayscale blurred circle image that we'll use for drawing points
            var circle = this.circle = document.createElement('canvas'),
                ctx = circle.getContext('2d'),
                r2 = this.r = r + blur;

            circle.width = circle.height = r2 * 2;

            ctx.shadowOffsetX = ctx.shadowOffsetY = 200;
            ctx.shadowBlur = blur;
            ctx.shadowColor = 'black';

            ctx.beginPath();
            ctx.arc(r2 - 200, r2 - 200, r, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();

            return this;
        }

        public gradient(grad) {
            // create a 256x1 gradient that we'll use to turn a grayscale heatmap into a colored one
            var canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d'),
                gradient = ctx.createLinearGradient(0, 0, 0, 256);

            canvas.width = 1;
            canvas.height = 256;

            for (var i in grad) {
                gradient.addColorStop(i, grad[i]);
            }

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 1, 256);

            this.grad = ctx.getImageData(0, 0, 1, 256).data;

            return this;
        }

        public draw(minOpacity?: number) {
            if (!this.circle) {
                this.radius(this.defaultRadius);
            }
            if (!this.grad) {
                this.gradient(this.defaultGradient);
            }

            var ctx = this.ctx;

            ctx.clearRect(0, 0, this.width, this.height);

            // draw a grayscale heatmap by putting a blurred circle at each data point
            for (var i = 0, len = this.dataPoints.length, p; i < len; i++) {
                p = this.dataPoints[i];

                ctx.globalAlpha = Math.max(p[2] / this.maxValue, minOpacity === undefined ? 0.05 : minOpacity);
                ctx.drawImage(this.circle, p[0] - this.r, p[1] - this.r);
            }

            // colorize the heatmap, using opacity value of each pixel to get the right color from our gradient
            var colored = ctx.getImageData(0, 0, this.width, this.height);
            this._colorize(colored.data, this.grad);
            ctx.putImageData(colored, 0, 0);

            return this;
        }
        private _colorize(pixels, gradient) {
            for (var i = 3, len = pixels.length, j; i < len; i += 4) {
                j = pixels[i] * 4; // get gradient color from opacity value

                if (j) {
                    pixels[i - 3] = gradient[j];
                    pixels[i - 2] = gradient[j + 1];
                    pixels[i - 1] = gradient[j + 2];
                }
            }
        }
    }

    export interface HeatMapData {
        x: number;
        y: number;
        i: number;
    }

    export interface HeatMapDataModel {
        dataArray: HeatMapData[];
    };

    export class HeatMapChart implements IVisual {
		/**
		  * Informs the System what it can do
		  * Fields, Formatting options, data reduction & QnA hints
		  */
        public static capabilities: VisualCapabilities = {
            dataRoles: [
                {
                    name: "Category",
                    kind: VisualDataRoleKind.Grouping
                },
                {
                    name: "X",
                    kind: VisualDataRoleKind.Measure,
                    displayName: "X values"
                },
                {
                    name: "Y",
                    kind: VisualDataRoleKind.Measure,
                    displayName: "Y values"
                },
                {
                    name: "I",
                    kind: VisualDataRoleKind.Measure,
                    displayName: "Intensity"
                }
            ],
            objects: {
                general: {
                    displayName: data.createDisplayNameGetter('Visual_General'),
                    properties: {
                        formatString: {
                            type: { formatting: { formatString: true } },
                        },
                        backgroundUrl: {
                            displayName: 'Background Url',
                            type: { text: true }
                        },
                        radius: {
                            displayName: 'Radius',
                            type: { numeric: true }
                        },
                        blur: {
                            displayName: 'Blur',
                            type: { numeric: true }
                        },
                        maxValue: {
                            displayName: 'Max Intensity',
                            type: { numeric: true }
                        },
                        maxWidth: {
                            displayName: 'Canvas Width',
                            type: { numeric: true }
                        },
                        maxHeight: {
                            displayName: 'Canvas Height',
                            type: { numeric: true }
                        },
                    }
                }
            },            
            dataViewMappings: [{
                categorical: {
                    categories: {
                        for: { in: "Category" }
                    },
                    values: {
                        group: {
                            by: "Series",
                            select: [
                                { bind: { to: 'X' } },
                                { bind: { to: 'Y' } },
                                { bind: { to: 'I' } }
                            ]
                        }
                    },
                }
            }]
        };
        public heatMapProps = {
            general: {
                backgroundUrl: <DataViewObjectPropertyIdentifier>{ objectName: 'general', propertyName: 'backgroundUrl' },
            }
        };

        public currentViewport: IViewport;
        private legend: ILegend;
        private element: JQuery;
        private canvas: JQuery;
        private colors: IDataColorPalette;
        private heatMap: SimpleHeatMap;
        private dataView: DataView;
        private backgroundUrl: string;
        private defaultBackgroundUrl = "";
        private canvasWidth: number = 680;
        private canvasHeight: number = 480;
        private maxValue = 1;

        // Convert a DataView into a view model
        public static converter(dataView: DataView, colors: IDataColorPalette): HeatMapDataModel {
            console.log('converter', dataView);
            var xCol, yCol, iCol;
            xCol = yCol = iCol = -1;
            var index = 0;
            if (typeof (dataView.metadata.columns[0].roles) !== 'undefined') {
                for (var i = 0; i < dataView.metadata.columns.length; i++) {
                    var colRole = Object.keys(dataView.metadata.columns[i].roles)[0];
                    switch (colRole) {
                        case "X":
                            xCol = index;
                            break;
                        case "Y":
                            yCol = index;
                            break;
                        case "I":
                            iCol = index;
                            break;
                        case "Category":
                            index--;
                            break;
                    }
                    index++;
                }
            } else {
                //For sandbox mode
                xCol = 0;
                yCol = 1;
                iCol = 2;
            }
            var catDv: DataViewCategorical = dataView.categorical;
            var values = catDv.values;
            var dataPoints: HeatMapData[] = [];

            for (var k = 0, kLen = values[0].values.length; k < kLen; k++) {

                dataPoints.push({
                    x: values[xCol].values[k],
                    y: values[yCol].values[k],
                    i: iCol !== -1 ? values[iCol].values[k] : 1
                });
            }

            //console.log(dataPoints);
            return {
                dataArray: dataPoints
            };
        }

        /* One time setup*/
        public init(options: VisualInitOptions): void {
            this.element = options.element;
            this.currentViewport = options.viewport;
            this.colors = options.style.colorPalette.dataColors;
            this.legend = powerbi.visuals.createLegend(options.element, options.interactivity && options.interactivity.isInteractiveLegend, null);            
            this.intialize(this.element[0]);
            this.heatMap = new SimpleHeatMap(this.canvas[0]);            
        }     

        /* Called for data, size, formatting changes*/ 
        public update(options: VisualUpdateOptions) {
            this.dataView = options.dataViews[0];            
            this.updateBackgroundUrl();
            this.updateCanvasSize();
            this.currentViewport = options.viewport;
            this.updateInternal(false);
            this.heatMap.max(HeatMapChart.getFieldNumber(this.dataView, 'general', 'maxValue', this.maxValue));
            this.heatMap.radius(HeatMapChart.getFieldNumber(this.dataView, 'general', 'radius', 5), HeatMapChart.getFieldNumber(this.dataView, 'general', 'blur', 5));
            var data = HeatMapChart.converter(this.dataView, this.colors);
            this.heatMap.clear();
            this.heatMap.data(data.dataArray.map(s => {
                return [s.x, s.y, s.i];
            }));
            this.heatMap.draw();
            
        }       

        /*About to remove your visual, do clean up here */ 
        public destroy() {

        }

        /* Called when the view port resizes */
        public onResizing(viewport: IViewport): void {
            if (this.currentViewport.width !== viewport.width || this.currentViewport.height !== viewport.height) {
                this.currentViewport = viewport;
                this.updateInternal(false /* dataChanged */);
            }
        }

        //Make visual properties available in the property pane in Power BI
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
            var instances: VisualObjectInstance[] = [];
            var dataView = this.dataView;
            switch (options.objectName) {
                case 'general':
                    var general: VisualObjectInstance = {
                        objectName: 'general',
                        displayName: 'General',
                        selector: null,
                        properties: {
                            backgroundUrl: HeatMapChart.getFieldText(dataView, 'general', 'backgroundUrl', ''),
                            radius: HeatMapChart.getFieldNumber(dataView, 'general', 'radius'),
                            blur: HeatMapChart.getFieldNumber(dataView, 'general', 'blur'),
                            maxWidth: HeatMapChart.getFieldNumber(dataView, 'general', 'maxWidth', 600),
                            maxHeight: HeatMapChart.getFieldNumber(dataView, 'general', 'maxHeight', 480),
                            maxValue: HeatMapChart.getFieldNumber(dataView, 'general', 'maxValue', 1)
                        }
                    };
                    instances.push(general);
                    break;               
            }

            return instances;
        }

        public canResizeTo(viewport: IViewport): boolean {
            return true;
        }        

        private getViewPort(): IViewport {
            var currentViewport = this.currentViewport;
            var legendMargins = this.legend.getMargins();

            var mapViewport = {
                width: currentViewport.width - legendMargins.width,
                height: currentViewport.height - legendMargins.height,
            };

            return mapViewport;
        }

        private intialize(container: HTMLElement): void {            
            this.canvas = $('<canvas class="myclass" width="' + this.canvasWidth+'" height="'+this.canvasHeight+'">');
            this.updateBackgroundUrl();
            $(container).append(this.canvas);
            this.updateInternal(false);
        }

        private updateBackgroundUrl() {
            var newBackgroundUrl = HeatMapChart.getFieldText(this.dataView, 'general', 'backgroundUrl', this.defaultBackgroundUrl);
            if (this.backgroundUrl !== newBackgroundUrl) {
                this.canvas.css('background', 'url("' + newBackgroundUrl + '")');
                this.canvas.css('background-size', '100% 100%');
                this.backgroundUrl = newBackgroundUrl;
            }
        }           

        private updateCanvasSize()
        {
            var updated = false;
            var newWidth = HeatMapChart.getFieldNumber(this.dataView, 'general', 'maxWidth', this.canvasWidth);
            if (this.canvasWidth !== newWidth) {
                this.canvasWidth = newWidth;
                (<HTMLCanvasElement>this.canvas[0]).width = newWidth;
                updated = true;
            }

            var newHeight = HeatMapChart.getFieldNumber(this.dataView, 'general', 'maxHeight', this.canvasHeight);
            if (this.canvasHeight !== newHeight ) {
                this.canvasHeight = newHeight;
                (<HTMLCanvasElement>this.canvas[0]).height = newHeight;
                updated = true;
            }
            if (updated) {
                this.heatMap = new SimpleHeatMap(this.canvas[0]);
            }
        }

        private updateInternal(redraw: boolean): void {

            var mapViewport = this.getViewPort();
            this.canvas.css('height',mapViewport.height +'px');
            this.canvas.css('width',mapViewport.width+'px');
        }

        private static getFieldText(dataView: DataView, field: string, property: string = 'text', defaultValue: string = ''): string {
            if (dataView) {
                var objects = dataView.metadata.objects;
                if (objects) {
                    var f = objects[field];
                    if (f) {
                        var text = <string>f[property];
                        if (text)
                            return text;
                    }
                }
            }
            return defaultValue;
        }

        private static getFieldNumber(dataView: DataView, field: string, property: string = 'text', defaultValue: number = 100): number {
            if (dataView) {
                var objects = dataView.metadata.objects;
                if (objects) {
                    var f = objects[field];
                    if (f) {
                        var num = <number>f[property];
                        if (num)
                            return num;
                    }
                }
            }
            return defaultValue;
        }
    }
}
