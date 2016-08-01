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

module powerbitests {
    import lineStyle = powerbi.visuals.lineStyle;
    import referenceLinePosition = powerbi.visuals.referenceLinePosition;
    import referenceLineDataLabelHorizontalPosition = powerbi.visuals.referenceLineDataLabelHorizontalPosition;
    import referenceLineDataLabelVerticalPosition = powerbi.visuals.referenceLineDataLabelVerticalPosition;
    import ObjectEnumerationBuilder = powerbi.visuals.ObjectEnumerationBuilder;
    import ReferenceLineHelper = powerbi.visuals.ReferenceLineHelper;
    import DataViewObject = powerbi.DataViewObject;
    import DataViewObjectMap = powerbi.DataViewObjectMap;

    describe('ReferenceLineHelper', () => {
        describe('enumerateObjectInstances', () => {
            // TODO: Remove this when we have support for user-defined objects in the format pane
            it('with no reference lines generates a single reference line object', () => {
                let enumerationBuilder = new ObjectEnumerationBuilder();
                ReferenceLineHelper.enumerateObjectInstances(enumerationBuilder, [], 'red', 'xAxisReferenceLine');
                let instances = enumerationBuilder.complete().instances;

                expect(instances.length).toBe(1);
                expect(instances[0]).toEqual({
                    selector: {
                        id: '0'
                    },
                    properties: {
                        show: false,
                        value: '',
                        lineColor: { solid: { color: 'red' } },
                        transparency: 50,
                        style: lineStyle.dashed,
                        position: referenceLinePosition.back,
                        dataLabelShow: false,
                    },
                    objectName: 'xAxisReferenceLine',
                });
            });

            it('enumerates all reference lines', () => {
                let enumerationBuilder = new ObjectEnumerationBuilder();
                let objects: DataViewObjectMap = [
                    {
                        id: '0',
                        object: referenceLineObjects.redLine,
                    }, {
                        id: '1',
                        object: referenceLineObjects.blueLine,
                    }
                ];
                ReferenceLineHelper.enumerateObjectInstances(enumerationBuilder, objects, 'black', 'xAxisReferenceLine');
                let instances = enumerationBuilder.complete().instances;

                expect(instances.length).toBe(2);
                expect(instances[0]).toEqual({
                    selector: {
                        id: '0'
                    },
                    properties: objects[0].object,
                    objectName: 'xAxisReferenceLine',
                });
                expect(instances[1]).toEqual({
                    selector: {
                        id: '1'
                    },
                    properties: objects[1].object,
                    objectName: 'xAxisReferenceLine',
                });
            });

            it('default color is used if none is present', () => {
                let enumerationBuilder = new ObjectEnumerationBuilder();

                let object: DataViewObject = $.extend({}, referenceLineObjects.redLine);
                object[ReferenceLineHelper.referenceLineProps.lineColor] = undefined;
                object[ReferenceLineHelper.referenceLineProps.dataLabelColor] = undefined;

                let objects: DataViewObjectMap = [
                    {
                        id: '0',
                        object: object,
                    }
                ];

                ReferenceLineHelper.enumerateObjectInstances(enumerationBuilder, objects, 'red', 'xAxisReferenceLine');
                let instances = enumerationBuilder.complete().instances;

                expect(instances[0].properties[ReferenceLineHelper.referenceLineProps.lineColor]).toEqual({ solid: { color: 'red' } });
                expect(instances[0].properties[ReferenceLineHelper.referenceLineProps.dataLabelColor]).toEqual({ solid: { color: 'red' } });
            });
        });
    });

    module referenceLineObjects {
        export const redLine: DataViewObject = {
            show: true,
            displayName: 'red',
            value: '1',
            lineColor: { solid: { color: 'red' } },
            transparency: 10,
            style: lineStyle.dashed,
            position: referenceLinePosition.back,
            dataLabelShow: true,
            dataLabelColor: { solid: { color: 'green' } },
            dataLabelDecimalPoints: 3,
            dataLabelHorizontalPosition: referenceLineDataLabelHorizontalPosition.left,
            dataLabelVerticalPosition: referenceLineDataLabelVerticalPosition.above,
            dataLabelDisplayUnits: 100000,
        };

        export const blueLine: DataViewObject = {
            show: true,
            displayName: 'blue',
            value: '2',
            lineColor: { solid: { color: 'blue' } },
            transparency: 20,
            style: lineStyle.dotted,
            position: referenceLinePosition.front,
            dataLabelShow: true,
            dataLabelColor: { solid: { color: 'purple' } },
            dataLabelDecimalPoints: 2,
            dataLabelHorizontalPosition: referenceLineDataLabelHorizontalPosition.right,
            dataLabelVerticalPosition: referenceLineDataLabelVerticalPosition.under,
            dataLabelDisplayUnits: 0,
        };
    }
}
