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
    export interface BasicShapeDataViewObjects extends DataViewObjects {
        general: BasicShapeDataViewObject;
        line: LineObject;
        fill: FillObject;
        rotation: RotationObject;
    }

    export interface LineObject extends DataViewObject {
        lineColor: Fill;
        roundEdge: number;
        weight: number;
        transparency: number;
    }

    export interface FillObject extends DataViewObject {
        transparency: number;
        fillColor: Fill;
        show: boolean;
    }

    export interface RotationObject extends DataViewObject {
        angle: number;
    }

    export interface BasicShapeDataViewObject extends DataViewObject {
        shapeType: string;
        shapeSvg: string;
    }

    export interface BasicShapeData {
        shapeType: string;
        lineColor: string;
        lineTransparency: number;
        lineWeight: number;
        showFill: boolean;
        fillColor: string;
        shapeTransparency: number;
        roundEdge: number;
        angle: number;
    }

    export class BasicShapeVisual implements IVisual {
        private currentViewport: IViewport;
        private element: JQuery;
        private data: BasicShapeData;
        private selection: D3.Selection;

        public static DefaultShape: string = basicShapeType.rectangle;
        public static DefaultStrokeColor: string = '#00B8AA';
        public static DefaultFillColor: string = '#E6E6E6';
        public static DefaultFillShowValue: boolean = true; 
        public static DefaultFillTransValue: number = 100;
        public static DefaultWeightValue: number = 3;
        public static DefaultLineTransValue: number = 100;
        public static DefaultRoundEdgeValue: number = 0;
        public static DefaultAngle: number = 0;

        /**property for the shape line color */
        get shapeType(): string {
            return this.data ? this.data.shapeType : BasicShapeVisual.DefaultShape;
        }
        set shapeType(shapeType: string) {
            this.data.shapeType = shapeType;
        }

        /**property for the shape line color */
        get lineColor(): string {
            return this.data ? this.data.lineColor : BasicShapeVisual.DefaultStrokeColor;
        }
        set lineColor(color: string) {
            this.data.lineColor = color;
        }
        /**property for the shape line transparency */
        get lineTransparency(): number {
            return this.data ? this.data.lineTransparency : BasicShapeVisual.DefaultLineTransValue;
        }
        set lineTransparency(trans: number) {
            this.data.lineTransparency = trans;
        }
        /**property for the shape line weight */
        get lineWeight(): number {
            return this.data ? this.data.lineWeight : BasicShapeVisual.DefaultWeightValue;
        }
        set lineWeight(weight: number) {
            this.data.lineWeight = weight;
        }
        /**property for the shape round edge */
        get roundEdge(): number {
            return this.data ? this.data.roundEdge : BasicShapeVisual.DefaultRoundEdgeValue;
        }
        set roundEdge(roundEdge: number) {
            this.data.roundEdge = roundEdge;
        }
        /**property for showing the fill properties */
        get showFill(): boolean {
            return this.data ? this.data.showFill : BasicShapeVisual.DefaultFillShowValue;
        }
        set showFill(show: boolean) {
            this.data.showFill = show;
        }
        /**property for the shape line color */
        get fillColor(): string {
            return this.data ? this.data.fillColor : BasicShapeVisual.DefaultFillColor;
        }
        set fillColor(color: string) {
            this.data.fillColor = color;
        }
        /**property for the shape fill transparency */
        get shapeTransparency(): number {
            return this.data ? this.data.shapeTransparency : BasicShapeVisual.DefaultFillTransValue;
        }
        set shapeTransparency(trans: number) {
            this.data.shapeTransparency = trans;
        }
        /**property for the shape angle */
        get angle(): number {
            return this.data ? this.data.angle : BasicShapeVisual.DefaultAngle;
        }
        set angle(angle: number) {
            this.data.angle = this.scaleTo360Deg(angle);
        }

        public init(options: VisualInitOptions) {
            this.element = options.element;
            this.selection = d3.select(this.element.context);
            this.currentViewport = options.viewport;
        }

        public constructor(options?: VisualInitOptions) {
        }

        public update(options: VisualUpdateOptions): void {
            debug.assertValue(options, 'options');

            this.currentViewport = options.viewport;

            let dataViews = options.dataViews;
            if (!_.isEmpty(dataViews)) {
                let dataView = options.dataViews[0];
                if (dataView.metadata && dataView.metadata.objects) {
                    let dataViewObject = <BasicShapeDataViewObjects>options.dataViews[0].metadata.objects;
                    this.data = this.getDataFromDataView(dataViewObject);
                }
            }

            this.render();
        }

        private getDataFromDataView(dataViewObject: BasicShapeDataViewObjects): BasicShapeData {
            if (dataViewObject) {
                return {
                    shapeType: DataViewObjects.getValue(dataViewObject, basicShapeProps.general.shapeType, BasicShapeVisual.DefaultShape),
                    lineColor: this.getValueFromColor(DataViewObjects.getValue(dataViewObject, basicShapeProps.line.lineColor, BasicShapeVisual.DefaultStrokeColor)),
                    lineTransparency: DataViewObjects.getValue(dataViewObject, basicShapeProps.line.transparency, BasicShapeVisual.DefaultLineTransValue),
                    lineWeight: DataViewObjects.getValue(dataViewObject, basicShapeProps.line.weight, BasicShapeVisual.DefaultWeightValue),
                    roundEdge: DataViewObjects.getValue(dataViewObject, basicShapeProps.line.roundEdge, BasicShapeVisual.DefaultRoundEdgeValue),
                    shapeTransparency: DataViewObjects.getValue(dataViewObject, basicShapeProps.fill.transparency, BasicShapeVisual.DefaultFillTransValue),
                    fillColor: this.getValueFromColor(DataViewObjects.getValue(dataViewObject, basicShapeProps.fill.fillColor, BasicShapeVisual.DefaultFillColor)),
                    showFill: DataViewObjects.getValue(dataViewObject, basicShapeProps.fill.show, BasicShapeVisual.DefaultFillShowValue),
                    angle: this.scaleTo360Deg(DataViewObjects.getValue(dataViewObject, basicShapeProps.rotation.angle, BasicShapeVisual.DefaultAngle))
                };
            }

            return null;
        }

        private scaleTo360Deg(angle: number): number {
            if (angle !== 0 && (Math.abs(angle) % 360) === 0) return angle;

            angle = angle % 360;
            angle = (angle + 360) % 360;

            return angle;
        }

        private getValueFromColor(color: any): string {
            return color.solid ? color.solid.color : color;
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
            let objectInstances: VisualObjectInstance[] = [];

            switch (options.objectName) {
                case 'line':
                    let instance: VisualObjectInstance = {
                        selector: null,
                        properties: {
                            lineColor: this.lineColor,
                            transparency: this.lineTransparency,
                            weight: this.lineWeight
                        },
                        objectName: options.objectName
                    };
                    if (this.data.shapeType === basicShapeType.rectangle) {
                        instance.properties['roundEdge'] = this.roundEdge;
                    }

                    objectInstances.push(instance);
                    return objectInstances;
                case 'fill':
                    if (this.shapeType !== basicShapeType.line) {
                    objectInstances.push({
                        selector: null,
                        properties: {
                            show: this.showFill,
                            fillColor: this.fillColor,
                            transparency: this.shapeTransparency
                        },
                        objectName: options.objectName
                    });
                    }
                    return objectInstances;
                case 'rotation':
                    objectInstances.push({
                        selector: null,
                        properties: {
                            angle: this.angle
                        },
                        objectName: options.objectName
                    });

                    return objectInstances;
            }

            return null;

        }

        public render(): void {
            this.selection.html('');
            
            switch (this.shapeType) {
                case basicShapeType.rectangle:
                    ShapeFactory.createRectangle(
                        this.data, this.currentViewport.height, this.currentViewport.width, this.selection, this.angle);
                    break;
                case basicShapeType.oval:
                    ShapeFactory.createOval(
                        this.data, this.currentViewport.height, this.currentViewport.width, this.selection, this.angle);
                    break;
                case basicShapeType.line:
                    ShapeFactory.createLine(
                        this.data, this.currentViewport.height, this.currentViewport.width, this.selection, this.angle);
                    break;
                case basicShapeType.arrow:
                    ShapeFactory.createUpArrow(
                        this.data, this.currentViewport.height, this.currentViewport.width, this.selection, this.angle);
                    break;
                case basicShapeType.triangle:
                    ShapeFactory.createTriangle(
                        this.data, this.currentViewport.height, this.currentViewport.width, this.selection, this.angle);
                    break;
                default:
                    break;
            }
        }
    }
}
