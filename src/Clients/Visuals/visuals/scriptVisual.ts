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
    export interface ScriptVisualDataViewObjects extends DataViewObjects {
        script: ScriptObject;
    }

    export interface ScriptObject extends DataViewObject {
        provider: string;
        source: string;
    }

    export interface ScriptVisualOptions {
        canRefresh: boolean;
    }

    export class ScriptVisual implements IVisual {
        private element: JQuery;
        private imageBackgroundElement: JQuery;
        private imageElement: JQuery;
        private hostServices: IVisualHostServices;
        private canRefresh: boolean;

        public constructor(options: ScriptVisualOptions) {
            this.canRefresh = options.canRefresh;
        }

        public init(options: VisualInitOptions): void {
            this.element = options.element;
            this.hostServices = options.host;

            if (!this.canRefresh) {
                this.hostServices.setWarnings([new ScriptVisualRefreshWarning()]);
            }
        }

        public update(options: VisualUpdateOptions): void {
            debug.assertValue(options, 'options');

            let dataViews: DataView[] = options.dataViews;
            if (!dataViews || dataViews.length === 0)
                return;

            let dataView: DataView = dataViews[0];
            if (!dataView || !dataView.metadata)
                return;

            let imageUrl: string = null;
            if (dataView.scriptResult && dataView.scriptResult.imageBase64) {
                imageUrl = "data:image/png;base64," + dataView.scriptResult.imageBase64;
            }

            this.ensureHtmlElement();
            let img = this.ensureImageElement();

            if (imageUrl) {
                img.attr("src", imageUrl);
            } else {
                img.removeAttr("src");
            }

            this.onResizing(options.viewport, options.resizeMode || ResizeMode.Resized);
        }

        public onResizing(finalViewport: IViewport, resizeMode?: ResizeMode): void {
            let div = this.ensureHtmlElement();
            div.css({ height: finalViewport.height, width: finalViewport.width });
        }

        private ensureHtmlElement(): JQuery {
            let div: JQuery = this.imageBackgroundElement;
            if (!div) {
                div = $("<div class='autoScaleImageContainer'/>");
                this.imageBackgroundElement = div;
                this.imageBackgroundElement.appendTo(this.element);
            }

            return div;
        }

        private ensureImageElement(): JQuery {
            let img: JQuery = this.imageElement;
            if (!img) {
                img = $("<img class='autoScaleImage'/>");
                this.imageElement = img;
                this.imageElement.appendTo(this.imageBackgroundElement);
            }

            return img;
        }
    }
}
