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

module powerbitests {
    import ColorHelper = powerbi.visuals.ColorHelper;
    import SQExprShortSerializer = powerbi.data.SQExprShortSerializer;

    describe("Color Helper", () => {
        let palette: powerbi.IDataColorPalette;

        let columnIdentity = powerbi.data.SQExprBuilder.fieldDef({ schema: "s", entity: "e", column: "sales" });
        let columnIdentity2 = powerbi.data.SQExprBuilder.fieldDef({ schema: "s", entity: "e", column: "profit" });
        let fillProp = <powerbi.DataViewObjectPropertyIdentifier>{ objectName: "dataPoint", propertyName: "fill" };

        const colors = [
            { value: "#000000" },
            { value: "#000001" },
            { value: "#000002" },
            { value: "#000003" }
        ];

        beforeEach(() => {
            palette = new powerbi.visuals.DataColorPalette(colors);
        });

        describe("getColorForSeriesValue", () => {

            it("should return fill property value if it exists", () => {
                let colorHelper = new ColorHelper(palette, fillProp, "defaultColor");

                let objects: powerbi.DataViewObjects = {
                    dataPoint: {
                        fill: { solid: { color: "red" } }
                    }
                };

                let color = colorHelper.getColorForSeriesValue(objects, [columnIdentity], "value");

                expect(color).toEqual("red");
            });

            it("should return default color if no fill property is defined", () => {
                let colorHelper = new ColorHelper(palette, fillProp, "defaultColor");

                let color = colorHelper.getColorForSeriesValue(/* no objects */ undefined, [columnIdentity], "value");

                expect(color).toEqual("defaultColor");
            });

            it("should return scale color if neither fill property nor default color is defined", () => {
                let colorHelper = new ColorHelper(palette, fillProp, /* no default color */ undefined);

                let color = colorHelper.getColorForSeriesValue(/* no objects */ undefined, [columnIdentity], "value");

                let expectedColor = palette.getColorScaleByKey(SQExprShortSerializer.serializeArray([columnIdentity])).getColor("value").value;
                expect(color).toEqual(expectedColor);
            });

            it("should handle undefined identity array", () => {
                let colorHelper = new ColorHelper(palette, fillProp);

                let color = colorHelper.getColorForSeriesValue(undefined, undefined, "value");

                let expectedColor = palette.getColorScaleByKey(SQExprShortSerializer.serializeArray([])).getColor("value").value;
                expect(color).toEqual(expectedColor);
            });

            it("should return the same color for the same series and value", () => {
                let colorHelper = new ColorHelper(palette, fillProp);

                let color1 = colorHelper.getColorForSeriesValue(null, [columnIdentity], "value");
                let color2 = colorHelper.getColorForSeriesValue(null, [columnIdentity], "value");

                expect(color1).toEqual(color2);
            });
        });

        describe("getColorScaleForSeries", () => {
            it("same series identity returns the same scale", () => {
                let colorHelper = new ColorHelper(palette, fillProp);

                let scale1 = colorHelper.getColorScaleForSeries([columnIdentity]);

                scale1.getColor('value1');
                let color2 = scale1.getColor('value2');

                let scale2 = colorHelper.getColorScaleForSeries([columnIdentity]);

                expect(scale2.getColor('value2')).toEqual(color2);
            });

            it("different series identities return different scales", () => {
                let colorHelper = new ColorHelper(palette, fillProp);

                let scale1 = colorHelper.getColorScaleForSeries([columnIdentity]);
                let scale2 = colorHelper.getColorScaleForSeries([columnIdentity2]);

                scale1.getColor('value1');
                let color2 = scale1.getColor('value2');

                expect(scale2.getColor('value2')).not.toEqual(color2);
            });
        });

        describe("getColorForMeasure", () => {
            it("should return fill property value if it exists", () => {
                let colorHelper = new ColorHelper(palette, fillProp, "defaultColor");

                let objects: powerbi.DataViewObjects = {
                    dataPoint: {
                        fill: { solid: { color: "red" } }
                    }
                };

                let color = colorHelper.getColorForMeasure(objects, 0);

                expect(color).toEqual("red");
            });

            it("should return default color if no fill property is defined", () => {
                let colorHelper = new ColorHelper(palette, fillProp, "defaultColor");

                let color = colorHelper.getColorForMeasure(/* no objects */ undefined, 0);

                expect(color).toEqual("defaultColor");
            });

            it("should return scale color if neither fill property nor default color is defined", () => {
                let colorHelper = new ColorHelper(palette, fillProp, /* no default color */ undefined);

                let color = colorHelper.getColorForMeasure(undefined, 0);

                expect(color).toEqual(colors[0].value);
            });

            it("should return the nth color for the nth measure even if colors are explicitly set", () => {
                let colorHelper = new ColorHelper(palette, fillProp);

                let objects: powerbi.DataViewObjects = {
                    dataPoint: { fill: { solid: { color: "red" } } }
                };

                let color1 = colorHelper.getColorForMeasure(null, 0);
                let color2 = colorHelper.getColorForMeasure(objects, 1);
                let color3 = colorHelper.getColorForMeasure(null, 2);

                expect(color1).toEqual(colors[0].value);
                expect(color2).toEqual("red");
                expect(color3).toEqual(colors[2].value);
            });
        });
    });
} 