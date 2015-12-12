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
    import Utility = jsCommon.Utility;

    export interface ScriptVisualDataViewObjects extends DataViewObjects {
        lastSavedImage: ScriptVisualDataViewObject;
        script: ScriptObject;
    }

    export interface ScriptVisualDataViewObject extends DataViewObject {
        imageUrl: string;
        viewportHeight: number;
        viewportWidth: number;
    }

    export interface ScriptObject extends DataViewObject {
        provider: string;
        source: string;
        imageFormat: string;
    }
    
    export class ScriptVisual implements IVisual {
        private element: JQuery;
        private imageBackgroundElement: JQuery;
        private hostServices: IVisualHostServices;

        public init(options: VisualInitOptions): void {
            this.element = options.element;
            this.hostServices = options.host;
        }

        public update(options: VisualUpdateOptions): void {
            debug.assertValue(options, 'options');
            
            let dataViews = options.dataViews;
            if (!dataViews || dataViews.length === 0)
                return;

            let dataView = dataViews[0];
            if (!dataView || !dataView.metadata)
                return;

            let imageUrl;
            let saveScriptResult = true;
            if (!dataView.scriptResult || !dataView.scriptResult.imageBase64) {
                imageUrl = this.getLastSavedImage(dataView);
                saveScriptResult = false;
            }
            else {
                imageUrl = "data:image/svg+xml;base64," + dataView.scriptResult.imageBase64;
            }

            let div: JQuery = this.imageBackgroundElement;
            if (!div) {
                div = $("<div class='imageBackground' />");
                this.imageBackgroundElement = div;
                this.imageBackgroundElement.appendTo(this.element);
            }

            if (imageUrl && Utility.isValidImageDataUrl(imageUrl)) {
                let viewport = options.viewport;
                div.css({ height: viewport.height, width: viewport.width, 'background-image': 'url(' + imageUrl + ')' });

                if (saveScriptResult)
                    this.updateLastSavedImage(dataView, imageUrl, options.viewport);
            }
            else {
                div.css({ 'background-image': 'none' });
            }
        }

        private getLastSavedImage(dataView: DataView): string {
            debug.assertValue(dataView, 'dataView');

            let defaultImageUrl = null;
            if (!dataView || !dataView.metadata)
                return defaultImageUrl;

            let objects = <ScriptVisualDataViewObjects>dataView.metadata.objects;
            if (!objects || !objects.lastSavedImage)
                return defaultImageUrl;

            let imageUrl = objects.lastSavedImage.imageUrl;
            if (!Utility.isValidImageDataUrl(imageUrl))
                return defaultImageUrl;

            return imageUrl;
        }

        private updateLastSavedImage(dataView: DataView, imageUrl: string, viewport: IViewport): void {
            debug.assertValue(imageUrl, 'dataView');
            debug.assertValue(imageUrl, 'imageUrl');

            if (!Utility.isValidImageDataUrl(imageUrl))
                return;

            if (!dataView || !dataView.metadata)
                return;

            let changes: VisualObjectInstance[] = [{
                objectName: 'lastSavedImage',
                properties: {
                    imageUrl: imageUrl,
                    viewportHeight: viewport.height,
                    viewportWidth: viewport.width,
                },
                selector: null,
            }];

            this.hostServices.persistProperties(changes);
        }
    }
} 