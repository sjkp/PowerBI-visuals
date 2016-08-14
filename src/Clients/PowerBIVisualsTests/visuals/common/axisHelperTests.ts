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
    import AxisHelper = powerbi.visuals.AxisHelper;
    import ValueType = powerbi.ValueType;
    import axisScale = powerbi.visuals.axisScale;
    import PrimitiveType = powerbi.PrimitiveType;
    import valueFormatter = powerbi.visuals.valueFormatter;
    import AxisPropertiesBuilder = powerbitests.helpers.AxisPropertiesBuilder;
    
    it("powerOf10 test", ()=> {
        let powersOf10: number[] = [-10000, 1000000000, 10, 100000000000];
        let length: number = powersOf10.length;
        let numbers: number[] = [2, 5, 2345, 12445067, 122334551, 90, 50, -50, 200, -1223333212, -122333442111];
        let powers = _.filter(powersOf10, (value) => { return AxisHelper.powerOfTen(value); });
        let notPowers = _.filter(numbers, (value) => { return AxisHelper.powerOfTen(value); });
        
        expect(powers.length).toBe(length);
        expect(notPowers.length).toBe(0);
    });

    describe("AxisHelper invertOrdinalScale tests", () => {
        var domain: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        var pixelSpan: number = 100;

        it("invertOrdinalScale in middle", () => {
            var ordinalScale: D3.Scale.OrdinalScale = AxisHelper.createOrdinalScale(pixelSpan, domain, 0.4);
            var invertedValue = AxisHelper.invertOrdinalScale(ordinalScale, 49);
            expect(invertedValue).toBe(4);
            var invertedValue = AxisHelper.invertOrdinalScale(ordinalScale, 51);
            expect(invertedValue).toBe(5);
            ////
            ordinalScale = AxisHelper.createOrdinalScale(pixelSpan, domain, 0); //zero
            var invertedValue = AxisHelper.invertOrdinalScale(ordinalScale, 49);
            expect(invertedValue).toBe(4);
            var invertedValue = AxisHelper.invertOrdinalScale(ordinalScale, 51);
            expect(invertedValue).toBe(5);
        });

        it("invertOrdinalScale at start", () => {
            var ordinalScale: D3.Scale.OrdinalScale = AxisHelper.createOrdinalScale(pixelSpan, domain, 0.4);
            var invertedValue = AxisHelper.invertOrdinalScale(ordinalScale, 0);
            expect(invertedValue).toBe(0);
        });

        it("invertOrdinalScale at end", () => {
            var ordinalScale: D3.Scale.OrdinalScale = AxisHelper.createOrdinalScale(pixelSpan, domain, 0.4);
            var invertedValue = AxisHelper.invertOrdinalScale(ordinalScale, 99);
            expect(invertedValue).toBe(9);
        });

        it("invertOrdinalScale at before start", () => {
            var ordinalScale: D3.Scale.OrdinalScale = AxisHelper.createOrdinalScale(pixelSpan, domain, 0.4);
            var invertedValue = AxisHelper.invertOrdinalScale(ordinalScale, -45);
            expect(invertedValue).toBe(0);
        });

        it("invertOrdinalScale at after end", () => {
            var ordinalScale: D3.Scale.OrdinalScale = AxisHelper.createOrdinalScale(pixelSpan, domain, 0.4);
            var invertedValue = AxisHelper.invertOrdinalScale(ordinalScale, 1222);
            expect(invertedValue).toBe(9);
        });
    });

    describe("AxisHelper createDomain tests", () => {
        var cartesianSeries = [
            {
                data: [
                    {
                        categoryValue: 7,
                        value: 11,
                        categoryIndex: 0,
                        seriesIndex: 0,
                    }, {
                        categoryValue: 9,
                        value: 9,
                        categoryIndex: 1,
                        seriesIndex: 0,
                    }, {
                        categoryValue: 15,
                        value: 6,
                        categoryIndex: 2,
                        seriesIndex: 0,
                    }, {
                        categoryValue: 22,
                        value: 7,
                        categoryIndex: 3,
                        seriesIndex: 0,
                    }
                ]
            },
        ];
        var cartesianSeriesWithHighlights = [
            {
                data: [
                    {
                        categoryValue: 7,
                        value: 3,
                        categoryIndex: 0,
                        seriesIndex: 0,
                    }, {
                        categoryValue: 7,
                        value: 11,
                        categoryIndex: 0,
                        seriesIndex: 0,
                        highlight: true,
                    }, {
                        categoryValue: 7,
                        value: 11,
                        categoryIndex: 1,
                        seriesIndex: 0,
                    }, {
                        categoryValue: 7,
                        value: 11,
                        categoryIndex: 1,
                        seriesIndex: 0,
                        highlight: true,
                    }, {
                        categoryValue: 7,
                        value: 11,
                        categoryIndex: 2,
                        seriesIndex: 0,
                    },  {
                        categoryValue: 9,
                        value: 9,
                        categoryIndex: 2,
                        seriesIndex: 0,
                        highlight: true,
                    }, {
                        categoryValue: 15,
                        value: 6,
                        categoryIndex: 3,
                        seriesIndex: 0,
                    }, {
                        categoryValue: 22,
                        value: 7,
                        categoryIndex: 3,
                        seriesIndex: 0,
                        highlight: true,
                    }
                ]
            },
        ];

        it("ordinal - text",() => {
            var domain = AxisHelper.createDomain(cartesianSeries, ValueType.fromDescriptor({ text: true }), false, []);
            expect(domain).toEqual([0, 1, 2, 3]);
        });

        it("ordinal - with highlights", () => {
            var domain = AxisHelper.createDomain(cartesianSeriesWithHighlights, ValueType.fromDescriptor({ text: true }), false, []);
            expect(domain).toEqual([0, 1, 2, 3]);
        });

        it("scalar - two values",() => {
            var domain = AxisHelper.createDomain(cartesianSeries, ValueType.fromDescriptor({ numeric: true }), true, [5, 20]);
            expect(domain).toEqual([5,20]);
        });

        it("scalar - undefined, val",() => {
            var domain = AxisHelper.createDomain(cartesianSeries, ValueType.fromDescriptor({ numeric: true }), true, [undefined, 20]);
            expect(domain).toEqual([7, 20]);
        });

        it("scalar - val, undefined",() => {
            var domain = AxisHelper.createDomain(cartesianSeries, ValueType.fromDescriptor({ numeric: true }), true, [5, undefined]);
            expect(domain).toEqual([5, 22]);
        });

        it("scalar - undefined, undefined",() => {
            var domain = AxisHelper.createDomain(cartesianSeries, ValueType.fromDescriptor({ numeric: true }), true, [undefined, undefined]);
            expect(domain).toEqual([7, 22]);
        });

        it("scalar - null",() => {
            var domain = AxisHelper.createDomain(cartesianSeries, ValueType.fromDescriptor({ numeric: true }), true, null);
            expect(domain).toEqual([7, 22]);
        });

        // invalid case with min > max, take actual domain
        it("scalar - min > max",() => {
            var domain = AxisHelper.createDomain(cartesianSeries, ValueType.fromDescriptor({ numeric: true }), true, [15, 10]);
            expect(domain).toEqual([7, 22]);
        });
    });

    describe("AxisHelper createAxis tests", () => {
        var dataPercent = [0.0, 0.33, 0.49];

        var formatStringProp: powerbi.DataViewObjectPropertyIdentifier = {
            objectName: 'general',
            propertyName: 'formatString',
        };

        // TODO: add a getValueFn mock to provide to createAxis so we can test tickValue generation

        it("create ordinal scale - without categoryThickness", () => {
            var axisProperties = AxisPropertiesBuilder.buildAxisPropertiesString();

            var scale = <any>axisProperties.scale;
            expect(scale).toBeDefined();
            
            // Proves scale is ordinal
            expect(scale.invert).toBeUndefined();

            var values = <any>axisProperties.values;
            expect(values).toBeDefined();
            expect(values.length).toEqual(3);
            expect(values[0]).toBe("Sun");

            // Proves category thickness is not set when not defined
            var categoryThickness = <any>axisProperties.categoryThickness;
            expect(categoryThickness).toBeUndefined();

            // x label max width is derived from the scale interval
            var xLabelMaxWidth = <any>axisProperties.xLabelMaxWidth;
            expect(xLabelMaxWidth).toBeDefined();
            expect(xLabelMaxWidth).toBeCloseTo(29.7, 1);
        });

        it("create ordinal scale with linear values", () => {
            var axisProperties = AxisPropertiesBuilder.buildAxisPropertiesNumber();

            var scale = <any>axisProperties.scale;
            expect(scale).toBeDefined();

            var values = <any>axisProperties.values;
            expect(values).toBeDefined();
            expect(values.length).toEqual(3);
            expect(values[0]).toBe("47.50");

            // Proves scale is ordinal
            expect(scale.invert).toBeUndefined();
        });

        it("create ordinal scale with no categories", () => {
            var axisProperties = AxisPropertiesBuilder.buildAxisPropertiesText(undefined);

            var values = <any>axisProperties.values;
            expect(values).toBeDefined();
            expect(values.length).toEqual(0);
        });

        it("create ordinal scale with boolean values", () => {
            var axisProperties = AxisPropertiesBuilder.buildAxisPropertiesBool();

            var scale = <any>axisProperties.scale;
            expect(scale).toBeDefined();

            // Proves scale is ordinal
            expect(scale.invert).toBeUndefined();

            // check tick labels values
            expect(axisProperties.values[0]).toBe("True");
            expect(axisProperties.values[1]).toBe("False");
        });

        it("create ordinal scale with category thickness", () => {
            var axisProperties = AxisPropertiesBuilder.buildAxisPropertiesStringWithCategoryThickness(14);

            var values = <any>axisProperties.values;
            expect(values).toBeDefined();
            expect(values.length).toEqual(3);
            expect(values[0]).toBe("Sun");

            // Provides category thickness set when defined
            var categoryThickness = <any>axisProperties.categoryThickness;
            expect(categoryThickness).toBeDefined();
            expect(categoryThickness).toEqual(14);

            // Provides category thickness used as xLabelMaxWidth when not is scalar
            var xLabelMaxWidth = <any>axisProperties.xLabelMaxWidth;
            expect(xLabelMaxWidth).toBeDefined();
            expect(xLabelMaxWidth).toEqual(10);
        });

        it("create linear scale", () => {
            var axisProperties = AxisPropertiesBuilder.buildAxisPropertiesNumbers();

            var scale = <any>axisProperties.scale;
            expect(scale).toBeDefined();
            
            // Proves scale is linear
            expect(scale.invert).toBeDefined();

            // Provides category thickness is not set when not defined
            var categoryThickness = <any>axisProperties.categoryThickness;
            expect(categoryThickness).toBeUndefined();

            var values = <any>axisProperties.values;
            expect(values).toBeDefined();
            expect(values.length).toEqual(2);
            expect(values[1]).toBe("100.00");

            // Proves label max width is pixelSpan/tickValues when is scalar and category thickness not defined
            var xLabelMaxWidth = <any>axisProperties.xLabelMaxWidth;
            expect(xLabelMaxWidth).toBeDefined();
            expect(xLabelMaxWidth).toBeGreaterThan(42);
            expect(xLabelMaxWidth).toBeLessThan(45);
        });

        it("create linear scale with NaN domain", () => {
            var axisProperties = AxisPropertiesBuilder.buildAxisPropertiesNan();

            var scale = <any>axisProperties.scale;
            expect(scale).toBeDefined();
            
            // Proves scale is linear
            expect(scale.invert).toBeDefined();

            // check that we fall back to the empty domain
            var values = <any>axisProperties.values;
            expect(values).toEqual([]);
        });

        it("create value scale - near zero min check", () => {
            var axisProperties = AxisPropertiesBuilder.buildAxisPropertiesNumeric([-0.000001725, 15]);

            var scale = <any>axisProperties.scale;
            expect(scale).toBeDefined();
            
            // Proves scale is linear
            expect(scale.invert).toBeDefined();

            var values = <any>axisProperties.values;
            expect(values).toBeDefined();
            expect(values.length).toEqual(2);
            expect(values[0]).toBe("0.00");
        });

        it("create linear scale with category thickness", () => {
            var axisProperties = AxisPropertiesBuilder.buildAxisPropertiesNumeric([40, 60], 20, 100, false);

            var scale = <any>axisProperties.scale;
            expect(scale).toBeDefined();
            
            // Proves scale is linear
            expect(scale.invert).toBeDefined();

            // Proves category thickness set when defined
            var categoryThickness = <any>axisProperties.categoryThickness;
            expect(categoryThickness).toBeDefined();
            expect(categoryThickness).toEqual(20);

            // Proves category thickness not considered for label max width when is scalar
            var xLabelMaxWidth = <any>axisProperties.xLabelMaxWidth;
            expect(xLabelMaxWidth).toBeDefined();
            expect(xLabelMaxWidth).toBeGreaterThan(42);
            expect(xLabelMaxWidth).toBeLessThan(45);
        });

        it("create linear scale with category thickness that needs to change", () => {
            var axisProperties = AxisPropertiesBuilder.buildAxisPropertiesNumeric([2007, 2011], 50, 200, false);

            var scale = <any>axisProperties.scale;
            expect(scale).toBeDefined();
            
            // Proves scale is linear
            expect(scale.invert).toBeDefined();

            // category thickness was altered
            var categoryThickness = <any>axisProperties.categoryThickness;
            expect(categoryThickness).toBeDefined();
            expect(categoryThickness).toBeCloseTo(33.3, 1);
        });

        it("create linear scale with category thickness and zero range (single value)", () => {
            var axisProperties = AxisPropertiesBuilder.buildAxisPropertiesNumeric([9, 9], 50, 200, false);

            var scale = <any>axisProperties.scale;
            expect(scale).toBeDefined();
            
            // Proves scale is linear
            expect(scale.invert).toBeDefined();

            // category thickness was altered
            var categoryThickness = <any>axisProperties.categoryThickness;
            expect(categoryThickness).toBeDefined();
            expect(categoryThickness).toBe(50);
        });
       
        it("create scalar time scale", () => {
            var axisProperties = AxisPropertiesBuilder.buildAxisPropertiesTime([
                AxisPropertiesBuilder.dataTime[0].getTime(),
                AxisPropertiesBuilder.dataTime[2].getTime()]);

            var scale = <any>axisProperties.scale;
            expect(scale).toBeDefined();
            
            // Proves scale is linear
            expect(scale.invert).toBeDefined();

            var values = <any>axisProperties.values;
            expect(values).toBeDefined();
            expect(values.length).toEqual(2);
            expect(values[0]).toBe("2015");
        });

        it("create scalar time scale - single day", () => {
            var dateTime = AxisPropertiesBuilder.dataTime[0].getTime();

            var axisProperties = AxisPropertiesBuilder.buildAxisPropertiesTime([
                dateTime,
                dateTime]);

            var scale = <any>axisProperties.scale;
            expect(scale).toBeDefined();
            
            // Proves scale is linear
            expect(scale.invert).toBeDefined();

            var values = <any>axisProperties.values;
            expect(values).toBeDefined();
            expect(values.length).toEqual(1);
            expect(values[0]).toBe("Oct 15");
        });

        it("create scalar time scale with max ticks number", () => {

            var dateTime0 = AxisPropertiesBuilder.dataTime[0].getTime();
            var dateTime1 = AxisPropertiesBuilder.dataTime[1].getTime();

            var axisProperties = AxisPropertiesBuilder.buildAxisPropertiesTime([
                dateTime0,
                dateTime1],
                /* isScalar */true,
                /* maxTicks */1);

            var scale = <any>axisProperties.scale;
            expect(scale).toBeDefined();

            var values = <any>axisProperties.values;
            expect(values).toBeDefined();
            expect(values.length).toEqual(1);
        });

        it("create scalar time scale with invalid domains", () => {
            var axisProperties: powerbi.visuals.IAxisProperties[] = [];

            axisProperties[0] = AxisPropertiesBuilder.buildAxisPropertiesTime([]);
            axisProperties[1] = AxisPropertiesBuilder.buildAxisPropertiesTime(null);
            axisProperties[2] = AxisPropertiesBuilder.buildAxisPropertiesTime([undefined, undefined]);

            for (var i = 0, ilen = axisProperties.length; i < ilen; i++) {
                var props = axisProperties[i];
                var scale = <any>props.scale;
                expect(scale).toBeDefined();
            
                // Proves scale is linear
                expect(scale.invert).toBeDefined();

                // check that we fall back to the empty domain
                var values = <any>props.values;
                expect(values).toEqual([]);
                expect(props.usingDefaultDomain).toBe(true);
            }
        });

        it("create ordinal time scale", () => {
            var axisProperties = AxisPropertiesBuilder.buildAxisPropertiesTimeIndex();

            var scale = <any>axisProperties.scale;
            expect(scale).toBeDefined();
            
            // Proves scale is ordinal
            expect(scale.invert).toBeUndefined();

            var values = <any>axisProperties.values;
            expect(values).toBeDefined();
            expect(values.length).toEqual(3);
            expect(values[0]).toBe("2014/10/15");
        });

        it('huge currency values', () => {
            var axisProperties = AxisPropertiesBuilder.buildAxisProperties(
                [0, 600000000000000],
                AxisPropertiesBuilder.metaDataColumnCurrency
            );

            var scale = <any>axisProperties.scale;
            expect(scale).toBeDefined();

            var values = <any>axisProperties.values;
            expect(values).toBeDefined();
            expect(values.length).toEqual(2);
            expect(values[0]).toBe('$0T');
            expect(values[1]).toBe('$500T');
        });

        it('create linear percent value scale', () => {    
            // Overriding format and leaving only positive format
            let metaDataColumnPercent: powerbi.DataViewMetadataColumn = {
                displayName: 'Column',
                type: ValueType.fromDescriptor({ numeric: true }),
                objects: {
                    general: {
                        formatString: '0 %',
                    }
                }
            };
            
            var os = AxisHelper.createAxis({
                pixelSpan: 100,
                dataDomain: [dataPercent[0], dataPercent[2]],
                metaDataColumn: metaDataColumnPercent,
                formatString: valueFormatter.getFormatString(metaDataColumnPercent, formatStringProp),
                outerPadding: 0.5,
                isScalar: true,
                isVertical: true,
            });
            var scale = <any>os.scale;
            expect(scale).toBeDefined();
            
            // Proves scale is linear
            expect(scale.invert).toBeDefined();

            var values = <any>os.values;
            expect(values).toBeDefined();
            expect(values.length).toEqual(2);
            expect(values[1]).toBe('50 %');
        });

        it('create log scale',() => {
            var os = AxisHelper.createAxis({
                pixelSpan: 100,
                dataDomain: [AxisPropertiesBuilder.dataNumbers[0], AxisPropertiesBuilder.dataNumbers[2]],
                metaDataColumn: AxisPropertiesBuilder.metaDataColumnNumeric,
                formatString: valueFormatter.getFormatString(AxisPropertiesBuilder.metaDataColumnNumeric, formatStringProp),
                outerPadding: 0.5,
                isScalar: true,
                isVertical: false,
                scaleType: axisScale.log
            });
            var scale = <any>os.scale;
            expect(scale).toBeDefined();
            
            // Proves scale is log
            expect(scale.invert).toBeDefined();

            // Provides category thickness is not set when not defined
            var categoryThickness = <any>os.categoryThickness;
            expect(categoryThickness).toBeUndefined();

            var values = <any>os.values;
            expect(values).toBeDefined();
            // TODO: need to verify updated value here because of changed wrong axis prop from axisScale to scaleType 
            expect(values.length).toEqual(3);
            expect(values[1]).toBe('100.00'); 
        }); 

        it('create log scale with NaN domain',() => {
            var os = AxisHelper.createAxis({
                pixelSpan: 100,
                dataDomain: AxisPropertiesBuilder.domainNaN,
                metaDataColumn: AxisPropertiesBuilder.metaDataColumnNumeric,
                formatString: valueFormatter.getFormatString(AxisPropertiesBuilder.metaDataColumnNumeric, formatStringProp),
                outerPadding: 0.5,
                isScalar: true,
                isVertical: true,
                scaleType: axisScale.log
            });
            var scale = <any>os.scale;
            expect(scale).toBeDefined();
            
            // Proves scale is log
            expect(scale.invert).toBeDefined();

            // check that we fall back to the empty domain
            var values = <any>os.values;
            expect(values).toEqual([]);
        });

        it('create log scale with zero domain',() => {
            var domain = [0, 100, 150];
            expect(domain[0]).toBe(0);
            var os = AxisHelper.createAxis({
                pixelSpan: 100,
                dataDomain: [domain[0], domain[2]],
                metaDataColumn: AxisPropertiesBuilder.metaDataColumnNumeric,
                formatString: valueFormatter.getFormatString(AxisPropertiesBuilder.metaDataColumnNumeric, formatStringProp),
                outerPadding: 0.5,
                isScalar: true,
                isVertical: false,
                scaleType: axisScale.log
            });
            var scale = <any>os.scale;
            expect(scale).toBeDefined();
            
            // Proves scale is log
            expect(scale.invert).toBeDefined();

            // Provides category thickness is not set when not defined
            var categoryThickness = <any>os.categoryThickness;
            expect(categoryThickness).toBeUndefined();

            var values = <any>os.values;
            expect(values).toBeDefined();
            // TODO: need to verify updated values here because of changed wrong axis prop from axisScale to scaleType 
            expect(values.length).toEqual(2);
            expect(values[1]).toEqual('100.00');
        });

        it('create log scale - near zero min check',() => {
            var domain = [0.000001725, 5, 15];
            expect(domain[0]).toBeGreaterThan(0);
            var os = AxisHelper.createAxis({
                pixelSpan: 100,
                dataDomain: [domain[0], domain[2]],
                metaDataColumn: AxisPropertiesBuilder.metaDataColumnNumeric,
                formatString: valueFormatter.getFormatString(AxisPropertiesBuilder.metaDataColumnNumeric, formatStringProp),
                outerPadding: 0.5,
                isScalar: true,
                isVertical: true,
                scaleType: axisScale.log
            });
            var scale = <any>os.scale;
            expect(scale).toBeDefined();
            
            // Proves scale is log
            expect(scale.invert).toBeDefined();

            var values = <any>os.values;
            expect(values).toBeDefined();
            expect(values.length).toEqual(1);
            expect(values[0]).toEqual('10.00');
        });
    });

    describe("AxisHelper column type tests", () => {
        it("createOrdinalType", () => {
            var ordinalType = AxisHelper.createOrdinalType();
            expect(AxisHelper.isOrdinal(ordinalType)).toBe(true);
            expect(AxisHelper.isDateTime(ordinalType)).toBe(false);
        });

        it("isOrdinal not valid for DateTime", () => {
            expect(AxisHelper.isOrdinal(ValueType.fromDescriptor({ dateTime: true }))).toBe(false);
        });

        it("isOrdinal valid for bool", () => {
            expect(AxisHelper.isOrdinal(ValueType.fromDescriptor({ bool: true }))).toBe(true);
        });

        it("isOrdinal not valid for numeric", () => {
            expect(AxisHelper.isOrdinal(ValueType.fromDescriptor({ numeric: true }))).toBe(false);
        });

        it("isOrdinal valid for text", () => {
            expect(AxisHelper.isOrdinal(ValueType.fromDescriptor({ text: true }))).toBe(true);
        });

        it("isOrdinal valid for bar code", () => {
            let valueType = ValueType.fromDescriptor({ misc: { barcode: true } });
            expect(AxisHelper.isOrdinal(valueType)).toBe(true);
        });

        it("isOrdinal valid for postal code", () => {
            let valueType = ValueType.fromDescriptor({ geography: { postalCode: true } });
            expect(AxisHelper.isOrdinal(valueType)).toBe(true);
        });

        it("isDateTime valid for DateTime", () => {
            expect(AxisHelper.isDateTime(ValueType.fromDescriptor({ dateTime: true }))).toBe(true);
        });

        it("isDateTime not valid for non-DateTIme", () => {
            expect(AxisHelper.isDateTime(ValueType.fromDescriptor({ numeric: true }))).toBe(false);

            expect(AxisHelper.isDateTime(ValueType.fromDescriptor({ text: true }))).toBe(false);

            expect(AxisHelper.isDateTime(ValueType.fromDescriptor({ bool: true }))).toBe(false);
        });

        it("isDateTime null", () => {
            expect(AxisHelper.isDateTime(null)).toBe(false);
        });

        it("isDateTime undefined", () => {
            expect(AxisHelper.isDateTime(undefined)).toBe(false);
        });
    });

    describe("AxisHelper get Recommended tick values tests", () => {
        var labels = ["VRooom", "FROM", "1984", "OR", "YEAR", "3000", "?", "?"];

        it("max is half the ticks", () => {
            var expected = ["VRooom", "1984", "YEAR", "?"];
            var actual = AxisHelper.getRecommendedTickValuesForAnOrdinalRange(4, labels);
            expect(actual).toEqual(expected);
        });

        it("max is zero ticks", () => {
            var expected = [];
            var actual = AxisHelper.getRecommendedTickValuesForAnOrdinalRange(0, labels);
            expect(actual).toEqual(expected);
        });

        it("max is negative ticks", () => {
            var expected = [];
            var actual = AxisHelper.getRecommendedTickValuesForAnOrdinalRange(-1, labels);
            expect(actual).toEqual(expected);
        });

        it("max is equal to ticks", () => {
            var expected = labels;
            var actual = AxisHelper.getRecommendedTickValuesForAnOrdinalRange(8, labels);
            expect(actual).toEqual(expected);
        });

        it("max is more than ticks", () => {
            var expected = labels;
            var actual = AxisHelper.getRecommendedTickValuesForAnOrdinalRange(10, labels);
            expect(actual).toEqual(expected);
        });

        it("getRecommendedTickValues: ordinal index", () => {
            var expected = [0, 2, 4, 6, 8];
            var scale = AxisHelper.createOrdinalScale(400, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 0.4);
            var actual = AxisHelper.getRecommendedTickValues(5, scale, ValueType.fromDescriptor({ text: true }), false);
            expect(actual).toEqual(expected);
        });

        it("getRecommendedTickValues: ordinal index - zero maxTicks", () => {
            var vals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            var scale = AxisHelper.createOrdinalScale(400, vals, 0.4);
            var actual = AxisHelper.getRecommendedTickValues(0, scale, ValueType.fromDescriptor({ text: true }), false);
            expect(actual).toEqual([]);
        });

        it("getRecommendedTickValues: ordinal index - maxTicks greater than len", () => {
            var vals = [0, 1, 2, 3, 4];
            var scale = AxisHelper.createOrdinalScale(400, vals, 0.4);
            var actual = AxisHelper.getRecommendedTickValues(6, scale, ValueType.fromDescriptor({ text: true }), false);
            expect(actual).toEqual(vals);
        });

        // linear domains are always [min,max], only two values, and are already D3.nice()
        it("getRecommendedTickValues: scalar numeric - easy", () => {
            var expected = [0, 20, 40, 60, 80, 100];
            var scale = AxisHelper.createLinearScale(400, [0, 100]);
            var actual = AxisHelper.getRecommendedTickValues(6, scale, ValueType.fromDescriptor({ numeric: true }), true);
            expect(actual).toEqual(expected);
        });

        it("getRecommendedTickValues: 0 tick count", () => {
            var expected = [];
            var scale = AxisHelper.createLinearScale(400, [0, 100]);
            var actual = AxisHelper.getRecommendedTickValues(0, scale, ValueType.fromDescriptor({ numeric: true }), true);
            expect(actual).toEqual(expected);
        });

        it("getRecommendedTickValues: single value domain returns 0 ticks", () => {
            var expected = [];
            var scale = AxisHelper.createLinearScale(400, [1, 1]);
            var actual = AxisHelper.getRecommendedTickValues(5, scale, ValueType.fromDescriptor({ numeric: true }), true);
            expect(actual).toEqual(expected);
        });

        it("getRecommendedTickValues: positive range", () => {
            var expected = [60, 80, 100];
            var scale = AxisHelper.createLinearScale(400, [60, 100]);
            var actual = AxisHelper.getRecommendedTickValues(3, scale, ValueType.fromDescriptor({ numeric: true }), true);
            expect(actual).toEqual(expected);
        });

        it("getRecommendedTickValues: negative range", () => {
            var expected = [-200, -180, -160, -140, -120, -100];
            var scale = AxisHelper.createLinearScale(400, [-200, -100]);
            var actual = AxisHelper.getRecommendedTickValues(6, scale, ValueType.fromDescriptor({ numeric: true }), true);
            expect(actual).toEqual(expected);
        });

        it("getRecommendedTickValues: 0 between min and max", () => {
            var expected = [0, 50, 100];
            var scale = AxisHelper.createLinearScale(400, [-20, 100]);
            var actual = AxisHelper.getRecommendedTickValues(4, scale, ValueType.fromDescriptor({ numeric: true }), true);
            expect(actual).toEqual(expected);
        });

        it("getRecommendedTickValues: very precise decimal values and funny d3 zero tick values", () => {    
            // Zero value originally returned from d3 ticks() call is "-1.7763568394002505e-17" (i.e. -1e-33)
            var expected = [-0.15000000000000002, -0.10000000000000002, -0.05000000000000002, 0, 0.04999999999999998, 0.09999999999999998];
            var scale = AxisHelper.createLinearScale(400, [-0.150000000000002, .10000000008000006]);
            var actual = AxisHelper.getRecommendedTickValues(6, scale, ValueType.fromDescriptor({ numeric: true }), true);
            expect(actual).toEqual(expected);
        });

        it("getRecommendedTickValues: integer type should not return fractional tick values", () => {
            var expected = [0, 1];
            var scale = AxisHelper.createLinearScale(500, [0, 1]);
            var actual = AxisHelper.getRecommendedTickValues(8, scale, ValueType.fromDescriptor({ integer: true }), true, 1);
            expect(actual).toEqual(expected);
        });

        it("getRecommendedTickValues: remove ticks that are more precise than the formatString", () => {
            var expected = [0, 0.1, 0.2, 0.3, 0.4, 0.5];
            var scale = AxisHelper.createLinearScale(500, [0, 0.5]);
            var actual = AxisHelper.getRecommendedTickValues(11, scale, ValueType.fromDescriptor({ numeric: true }), true, 0.1);
            expect(actual).toEqual(expected);
        });

        it("ensureValuesInRange: unsorted tick values", () => {
            var values = [1, 2, 3, 4, 5];
            var actual = AxisHelper.ensureValuesInRange(values, 2.2, 5.5);
            expect(actual).toEqual([3, 4, 5]);
        });

        it("ensureValuesInRange: only one value in range", () => {
            var values = [1, 2, 3, 4, 5];
            var actual = AxisHelper.ensureValuesInRange(values, 1.5, 2.5);
            expect(actual).toEqual([1.5, 2.5]);
        });

        it("ensureValuesInRange: no value in range", () => {
            var values = [1, 2];
            var actual = AxisHelper.ensureValuesInRange(values, 1.25, 1.75);
            expect(actual).toEqual([1.25, 1.75]);
        });
    });

    describe("AxisHelper get best number of ticks tests", () => {
        var dataViewMetadataColumnWithIntegersOnly: powerbi.DataViewMetadataColumn[] = [
            {
                displayName: "col1",
                isMeasure: true,
                type: ValueType.fromDescriptor({ integer: true })
            },
            {
                displayName: "col2",
                isMeasure: true,
                type: ValueType.fromDescriptor({ integer: true })
            }
        ];

        var dataViewMetadataColumnWithNonInteger: powerbi.DataViewMetadataColumn[] = [
            {
                displayName: "col1",
                isMeasure: true,
                type: ValueType.fromDescriptor({ integer: true })
            },
            {
                displayName: "col2",
                isMeasure: true,
                type: ValueType.fromDescriptor({ numeric: true })
            }
        ];

        it("dataViewMetadataColumn with only integers small range", () => {
            var actual = AxisHelper.getBestNumberOfTicks(0, 3, dataViewMetadataColumnWithIntegersOnly, 6);
            expect(actual).toBe(4); // [0,1,2,3]
        });

        it("dataViewMetadataColumn with only integers large range", () => {
            var actual = AxisHelper.getBestNumberOfTicks(0, 10, dataViewMetadataColumnWithIntegersOnly, 6);
            expect(actual).toBe(6);
        });

        it("hundred percent dataViewMetadataColumn with only integers", () => {
            var actual = AxisHelper.getBestNumberOfTicks(0, 1, dataViewMetadataColumnWithIntegersOnly, 6);
            expect(actual).toBe(6);
        });

        it("dataViewMetadataColumn with non integers", () => {
            var actual = AxisHelper.getBestNumberOfTicks(0, 3, dataViewMetadataColumnWithNonInteger, 6);
            expect(actual).toBe(6);
        });

        it("dataViewMetadataColumn with NaN min/max", () => {
            var actual = AxisHelper.getBestNumberOfTicks(NaN, 3, dataViewMetadataColumnWithNonInteger, 6);
            expect(actual).toBe(3);
            actual = AxisHelper.getBestNumberOfTicks(1, NaN, dataViewMetadataColumnWithNonInteger, 6);
            expect(actual).toBe(3);
            actual = AxisHelper.getBestNumberOfTicks(NaN, NaN, dataViewMetadataColumnWithNonInteger, 6);
            expect(actual).toBe(3);
        });
    });

    describe("AxisHelper createFormatter", () => {
        let measureColumn: powerbi.DataViewMetadataColumn = {
            displayName: 'sales', queryName: 'selectSales', isMeasure: true, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Integer),
            format: '$0',
        };
        let dateColumn: powerbi.DataViewMetadataColumn = {
            displayName: 'date', queryName: 'selectDate', isMeasure: false, type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.DateTime),
            format: 'MM/dd/yyyy',
        };

        it('createFormatter: value (hundreds)', () => {
            let min = 0,
                max = 200,
                value = 100,
                tickValues = [0,50,100,150,200];

            expect(AxisHelper.createFormatter([min, max], [min, max], measureColumn.type, true, measureColumn.format, 6, tickValues, 'getValueFn', true)
                .format(value))
                .toBe('$100');
        });

        it('createFormatter: value (millions)', () => {
            let min = 0,
                max = 2e6,
                tickValues = [0, 0.5e6, 1e6, 1.5e6, 2e6];

            let formatter = AxisHelper.createFormatter([min, max], [min, max], measureColumn.type, true, measureColumn.format, 6, tickValues, 'getValueFn', true);
            expect(formatter.format(tickValues[0])).toBe('$0.0M');
            expect(formatter.format(tickValues[2])).toBe('$1.0M');
            expect(formatter.format(tickValues[3])).toBe('$1.5M');
        });

        it('createFormatter: value (huge)', () => {
            let min = 0,
                max = 600000000000000,
                value = 563732000000000,
                tickValues = [0, 1e14, 2e14, 2e14, 4e14, 5e14, 6e14];

            // Used to return '5.63732E+14', not the correct currency value
            let expectedValue = '$564T';
            expect(AxisHelper.createFormatter([min, max], [min, max], measureColumn.type, true, measureColumn.format, 6, tickValues, 'getValueFn', true)
                .format(value))
                .toBe(expectedValue);
        });

        it('createFormatter: 100% stacked', () => {
            let min = 0,
                max = 1,
                value = 0.5,
                tickValues =  [0,0.25,0.5,0.75,1];

            expect(AxisHelper.createFormatter([min, max], [min, max], measureColumn.type, true, '0%', 6, tickValues, 'getValueFn', true)
                .format(value))
                .toBe('50%');
        });

        it('createFormatter: dateTime scalar', () => {
            let min = new Date(2014, 6, 14).getTime(),
                max = new Date(2014, 11, 14).getTime(),
                value = new Date(2014, 9, 13).getTime();

            expect(AxisHelper.createFormatter([min, max], [min, max], dateColumn.type, true, dateColumn.format, 6, [/*not used by datetime*/], 'getValueFn', true)
                .format(new Date(value)))
                .toBe('Oct 2014');
        });

        it('createFormatter: dateTime ordinal', () => {
            let min = new Date(2014, 6, 14).getTime(),
                max = new Date(2014, 11, 14).getTime(),
                value = new Date(2014, 9, 13).getTime();

            expect(AxisHelper.createFormatter([min, max], [min, max], dateColumn.type, false, dateColumn.format, 6, [/*not used by datetime*/], 'getValueFn', true)
                .format(new Date(value)))
                .toBe('10/13/2014');
        });

        it('createFormatter: dateTime scalar - filtered to single value', () => {
            let min = new Date(2014, 6, 14).getTime();

            expect(AxisHelper.createFormatter([min, min], [min, min], dateColumn.type, true, dateColumn.format, 6, [/*not used by datetime*/], 'getValueFn', true)
                .format(new Date(min)))
                .toBe('Jul 14');
        });

        describe('createFormatter: value (detected precision)', () => {
            it('precision(1)', () => {
                let min = 0,
                    max = 200,
                    value = 1,
                    tickValues = [0, 0.5, 1, 1.5, 2];

                expect(AxisHelper.createFormatter([min, max], [min, max], measureColumn.type, true, measureColumn.format, 6, tickValues, 'getValueFn', true)
                    .format(value))
                    .toBe('$1.0');
            });

            it('precision(0)', () => {
                let min = 0,
                    max = 200,
                    value = 1,
                    tickValues = [0, 1, 2, 3, 4];

                expect(AxisHelper.createFormatter([min, max], [min, max], measureColumn.type, true, measureColumn.format, 6, tickValues, 'getValueFn', true)
                    .format(value))
                    .toBe('$1');
            });
        });

        describe('createFormatter: value (specified precision)', () => {
            it('precision(2)', () => {
                let min = 0,
                    max = 200,
                    value = 1,
                    tickValues = [0, 0.5, 1, 1.5, 2];

                let specifiedPrecision = 2;
                expect(AxisHelper.createFormatter([min, max], [min, max], measureColumn.type, true, measureColumn.format, 6, tickValues, 'getValueFn', true, undefined, specifiedPrecision)
                    .format(value))
                    .toBe('$1.00');
            });
        });
    });

    describe("AxisHelper diffScaled", () => {
        var scale: D3.Scale.GenericQuantitativeScale<any>;

        beforeEach(() => {
            var range = [0, 999];
            var domain = [0, 1, 2, 3, 4, 5, 6, 7, 8, 999];
            scale = d3.scale.linear()
                .range(range)
                .domain(domain);
        });

        it("diffScaled: zero", () => {
            expect(AxisHelper.diffScaled(scale, 0, 0)).toBe(0);
        });

        it("diffScaled: small nonzero +ve", () => {
            expect(AxisHelper.diffScaled(scale, 0.00000001, 0)).toBe(1);
        });

        it("diffScaled: small nonzero -ve", () => {
            expect(AxisHelper.diffScaled(scale, -0.00000001, 0)).toBe(-1);
        });
    });

    describe("AxisHelper getRecommendedNumberOfTicks tests", () => {
        it("getRecommendedNumberOfTicksForXAxis small tile", () => {
            var tickCount = AxisHelper.getRecommendedNumberOfTicksForXAxis(220);
            expect(tickCount).toBe(3);
        });

        it("getRecommendedNumberOfTicksForXAxis median tile", () => {
            var tickCount = AxisHelper.getRecommendedNumberOfTicksForXAxis(480);
            expect(tickCount).toBe(5);
        });

        it("getRecommendedNumberOfTicksForXAxis large tile", () => {
            var tickCount = AxisHelper.getRecommendedNumberOfTicksForXAxis(730);
            expect(tickCount).toBe(8);
        });

        it("getRecommendedNumberOfTicksForYAxis small tile", () => {
            var tickCount = AxisHelper.getRecommendedNumberOfTicksForYAxis(80);
            expect(tickCount).toBe(3);
        });

        it("getRecommendedNumberOfTicksForYAxis median tile", () => {
            var tickCount = AxisHelper.getRecommendedNumberOfTicksForYAxis(230);
            expect(tickCount).toBe(5);
        });

        it("getRecommendedNumberOfTicksForYAxis large tile", () => {
            var tickCount = AxisHelper.getRecommendedNumberOfTicksForYAxis(350);
            expect(tickCount).toBe(8);
        });
    });

    class AxisHelperTickLabelBuilder {
        private xAxisProperties: powerbi.visuals.IAxisProperties;
        private y1AxisProperties: powerbi.visuals.IAxisProperties;
        private y2AxisProperties: powerbi.visuals.IAxisProperties;
        private axes: powerbi.visuals.CartesianAxisProperties;

        private viewPort: powerbi.IViewport = {
            width: 200,
            height: 125
        };

        private textProperties: powerbi.TextProperties = {
            fontFamily: "",
            fontSize: "16px"
        };

        constructor(viewport?: powerbi.IViewport, xValues?: any[]) {
            this.xAxisProperties = this.buildAxisOptions(xValues || ['Oregon','Washington','California','Mississippi']);
            this.y1AxisProperties = this.buildAxisOptions([20, 30, 50]);
            this.y2AxisProperties = this.buildAxisOptions([2000, 3000, 5000]);
            this.axes = {
                x: this.xAxisProperties,
                y1: this.y1AxisProperties,
                y2: this.y2AxisProperties,
            };
            if (viewport)
                this.viewPort = viewport;
        }

        public getFontSize(): number {
            return parseInt(this.textProperties.fontSize, 10);
        }

        public buildAxisOptions(values: any[]): powerbi.visuals.IAxisProperties {
            var axisProperties: powerbi.visuals.IAxisProperties = {
                scale: undefined,
                axis: undefined,
                values: values,
                axisType: undefined,
                formatter: undefined,
                axisLabel: "",
                isCategoryAxis: true,
                xLabelMaxWidth: 20,
                outerPadding: 10,
                categoryThickness: 25,
            };

            return axisProperties;
        }

        public buildTickLabelMargins(
            rotateX: boolean = false,
            wordBreak: boolean = false,
            showOnRight: boolean = false,
            renderXAxis: boolean = false,
            renderYAxes: boolean = false,
            renderY2Axis: boolean = false,
            categoryThickness: number = undefined,
            outerPadding: number = undefined,
            isScalar: boolean = false) {

            this.xAxisProperties.willLabelsFit = !rotateX;
            this.xAxisProperties.willLabelsWordBreak = wordBreak;
            let dataDomain = [0, 10];
            this.xAxisProperties.dataDomain = dataDomain;
            this.xAxisProperties.scale = isScalar ? AxisHelper.createLinearScale(this.viewPort.width, dataDomain) : AxisHelper.createOrdinalScale(this.viewPort.width, dataDomain);

            if (categoryThickness != null) {
                this.xAxisProperties.categoryThickness = categoryThickness;
                this.xAxisProperties.xLabelMaxWidth = categoryThickness * 0.9;
                this.xAxisProperties.outerPadding = categoryThickness * 0.5;
            }
            
            // scalar line chart sets outer padding to zero since it isn't drawing rectangles
            if (outerPadding != null)
                this.xAxisProperties.outerPadding = outerPadding;

            var margins = AxisHelper.getTickLabelMargins(
                this.viewPort,
                this.viewPort.width * 0.3,
                powerbi.TextMeasurementService.measureSvgTextWidth,
                powerbi.TextMeasurementService.estimateSvgTextHeight,
                this.axes,
                this.viewPort.height * 0.2,
                this.textProperties,
                undefined,
                showOnRight,
                renderXAxis,
                renderYAxes,
                renderY2Axis);

            return margins;
        }
    }

    describe("AxisHelper margins", () => {
        var axisHelperTickLabelBuilder: AxisHelperTickLabelBuilder =
            new AxisHelperTickLabelBuilder();

        beforeEach(() => {
            powerbi.TextMeasurementService.removeSpanElement();
        });

        it("Dual y-axes", () => {
            var margins = axisHelperTickLabelBuilder.buildTickLabelMargins(false, false, false, true, true, true);

            expect(margins.xMax).toBe(10);
            expect(powerbitests.helpers.isInRange(margins.yLeft, 15, 16)).toBe(true);
            expect(powerbitests.helpers.isInRange(margins.yRight, 30, 32)).toBe(true);
        });

        it("Hide all axes", () => {
            var margins = axisHelperTickLabelBuilder.buildTickLabelMargins(false, false);

            expect(margins.xMax).toBe(0);
            expect(margins.yLeft).toBe(0);
            expect(margins.yRight).toBe(0);
        });

        it("Disable the secondary axis", () => {
            var margins = axisHelperTickLabelBuilder.buildTickLabelMargins(false, false, false, true, true, false);

            expect(margins.xMax).toBe(10);
            expect(powerbitests.helpers.isInRange(margins.yLeft, 15, 16)).toBe(true);
            expect(powerbitests.helpers.isInRange(margins.yRight, 11, 14)).toBe(true);
        });

        it("Switch the y-axes", () => {
            var margins = axisHelperTickLabelBuilder.buildTickLabelMargins(false, false, true, true, true, true);

            expect(margins.xMax).toBe(10);
            expect(margins.yLeft).toBe(32);
            expect(margins.yRight).toBe(16);
        });

        it("Switch the y-axes, and disable the secondary axis", () => {
            var margins = axisHelperTickLabelBuilder.buildTickLabelMargins(true, false, true, true, true, false);

            expect(margins.xMax).toBe(25);
            
            // 16 for phantomjs(2.1.1) and 17 for phantomjs(2.0.0)
            expect(powerbitests.helpers.isInRange(margins.yLeft, 16, 17)).toBe(true);
            
            // 11 for Mac OS and 12 for Windows
            expect(powerbitests.helpers.isInRange(margins.yRight, 15, 16)).toBe(true);
        });

        it("xOverflowLeft", () => {
            var localTickLabelBuilder = new AxisHelperTickLabelBuilder(undefined, ['CrazyOutdoorDuneBuggiesWithFluxCapacitors', 'Cars', 'Trucks', 'Boats', 'RVs']);
            var margins = localTickLabelBuilder.buildTickLabelMargins(false, false, false, true, true, false);

            expect(margins.xMax).toBe(10);
            expect(margins.yLeft).toBe(35);
            expect(margins.yRight).toBe(0);
        });

        it("xOverflowLeft, with rotate", () => {
            var localTickLabelBuilder = new AxisHelperTickLabelBuilder(undefined, ['CrazyOutdoorDuneBuggiesWithFluxCapacitors', 'Cars', 'Trucks', 'Boats', 'RVs']);
            var margins = localTickLabelBuilder.buildTickLabelMargins(true, false, false, true, true, false);

            expect(margins.xMax).toBe(25);
            expect(margins.yLeft).toBe(35);
            expect(margins.yRight).toBe(0);
        });

        it("xOverflowLeft, with rotate, disable both Y axes", () => {
            var localTickLabelBuilder = new AxisHelperTickLabelBuilder(undefined, ['CrazyOutdoorDuneBuggiesWithFluxCapacitors', 'Cars', 'Trucks', 'Boats', 'RVs']);
            var margins = localTickLabelBuilder.buildTickLabelMargins(true, false, false, true, false, false);

            expect(margins.xMax).toBe(25);
            expect(margins.yLeft).toBe(35);
            expect(margins.yRight).toBe(0);
        });

        it("xOverflowRight, disable the secondary axis", () => {
            var localTickLabelBuilder = new AxisHelperTickLabelBuilder(undefined, ['Cars', 'Trucks', 'Boats', 'RVs', 'CrazyOutdoorDuneBuggies']);
            var margins = localTickLabelBuilder.buildTickLabelMargins(false, false, false, true, true, false);

            expect(margins.xMax).toBe(10);
            expect(margins.yLeft).toBe(16);
            expect(powerbitests.helpers.isInRange(margins.yRight, 33, 37)).toBe(true);
        });

        it("xOverflowRight, line chart, small overhang, disable the secondary axis", () => {
            var localTickLabelBuilder = new AxisHelperTickLabelBuilder(undefined, ['Cars', 'Trucks', 'Boats']);
            var margins = localTickLabelBuilder.buildTickLabelMargins(false, false, false, true, true, false, null, 10, true);

            expect(margins.xMax).toBe(10);
            expect(margins.yLeft).toBe(16);
            expect(powerbitests.helpers.isInRange(margins.yRight, 17, 19)).toBe(true);
        });

        it("xOverflowRight, disable both Y axes", () => {
            var localTickLabelBuilder = new AxisHelperTickLabelBuilder(undefined, ['Cars', 'Trucks', 'Boats', 'RVs', 'CrazyOutdoorDuneBuggies']);
            var margins = localTickLabelBuilder.buildTickLabelMargins(false, false, false, true, false, false);

            expect(margins.xMax).toBe(10);
            expect(margins.yLeft).toBe(0);
            expect(powerbitests.helpers.isInRange(margins.yRight, 33, 37)).toBe(true);
        });

        it("xOverflowRight, with rotate, disable both Y axes", () => {
            var localTickLabelBuilder = new AxisHelperTickLabelBuilder(undefined, ['Cars', 'Trucks', 'Boats', 'RVs', 'CrazyOutdoorDuneBuggies']);
            var margins = localTickLabelBuilder.buildTickLabelMargins(true, false, false, true, false, false);

            expect(margins.xMax).toBe(25);
            expect(powerbitests.helpers.isInRange(margins.yLeft, 2, 3)).toBe(true);
            expect(margins.yRight).toBe(0);
        });

        it('Check bottom margin for word breaking is based on number of text lines shown', () => {
            var localTickLabelBuilder = new AxisHelperTickLabelBuilder({height: 300, width: 150}, ['Stardust-IPA', '83742123123123 (Jun-14-2011) Robotics', 'Q4-was-the-best-ever']);
            let margins = localTickLabelBuilder.buildTickLabelMargins(false, true, false, true, true, false);
            expect(margins.xMax).toBeGreaterThan(3 * localTickLabelBuilder.getFontSize() - 1);
        });

        it('Scalar axis, overflow right', () => {
            var localTickLabelBuilder = new AxisHelperTickLabelBuilder({ height: 200, width: 200 }, ['Jan 2015','Feb 2015','Mar 2015','April 2015']);
            var margins = localTickLabelBuilder.buildTickLabelMargins(false, false, false, true, true, false, undefined, undefined, true);
            expect(margins.yRight).toBeGreaterThan(0);
        });
    });

    describe("AxisHelper apply new domain", () => {
        it("Check that customized domain is set on existing domain", () => {
            var customizedDomain = [undefined, 20];
            var existingDomain = [0, 10];
            var newDomain = AxisHelper.applyCustomizedDomain(customizedDomain, existingDomain);
            expect(newDomain[0]).toBe(0);
            expect(newDomain[1]).toBe(20);

            customizedDomain = [undefined, undefined];
            existingDomain = [0, 10];
            newDomain = AxisHelper.applyCustomizedDomain(customizedDomain, existingDomain);
            expect(newDomain[0]).toBe(0);
            expect(newDomain[1]).toBe(10);

            customizedDomain = [5, undefined];
            existingDomain = [0, 10];
            newDomain = AxisHelper.applyCustomizedDomain(customizedDomain, existingDomain);
            expect(newDomain[0]).toBe(5);
            expect(newDomain[1]).toBe(10);

            customizedDomain = [5, 20];
            existingDomain = [0, 10];
            newDomain = AxisHelper.applyCustomizedDomain(customizedDomain, existingDomain);
            expect(newDomain[0]).toBe(5);
            expect(newDomain[1]).toBe(20);

        });

        it("Check that customized domain is set on null domain", () => {
            var customizedDomain = [undefined, undefined];
            var existingDomain;
            var newDomain = AxisHelper.applyCustomizedDomain(customizedDomain, existingDomain);
            expect(newDomain).toBeUndefined();

            customizedDomain = [10, 20];
            var existingDomain;
            var newDomain = AxisHelper.applyCustomizedDomain(customizedDomain, existingDomain);
            expect(newDomain[0]).toBe(10);
            expect(newDomain[1]).toBe(20);

            customizedDomain = [undefined, 20];
            var existingDomain;
            var newDomain = AxisHelper.applyCustomizedDomain(customizedDomain, existingDomain);
            expect(newDomain[0]).toBe(undefined);
            expect(newDomain[1]).toBe(20);

            customizedDomain = [10, undefined];
            var existingDomain;
            var newDomain = AxisHelper.applyCustomizedDomain(customizedDomain, existingDomain);
            expect(newDomain[0]).toBe(10);
            expect(newDomain[1]).toBe(undefined);
        });
    });
}
