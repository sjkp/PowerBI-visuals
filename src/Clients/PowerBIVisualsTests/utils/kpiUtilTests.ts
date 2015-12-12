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

module powerbitests {
    import KpiUtil = powerbi.visuals.KpiUtil;

    describe("kpiUnitTests", () => {

        describe('get class', () => {
            it("undefined for unknown kpi graphic status name", () => {
                let kpi: powerbi.DataViewKpiColumnMetadata = {
                    graphic: 'Bad KPI Name'
                };
                let css = KpiUtil.getClassForKpi(kpi, '1', KpiUtil.KpiImageSize.Big);
                expect(css).toBeUndefined();
            });

            it("ThreeLights 1", () => {
                verifyGetClassForKpi('Traffic Light - Single', '-1', 'circle kpi-red');
                verifyGetClassForKpi('THREE CIRCLES COLORED', '-1', 'circle kpi-red');
            });

            it("ThreeLights 2", () => {
                verifyGetClassForKpi('Traffic Light - Single', '0', 'circle kpi-yellow');
                verifyGetClassForKpi('THREE CIRCLES COLORED', '0', 'circle kpi-yellow');
            });

            it("ThreeLights 3", () => {
                verifyGetClassForKpi('Traffic Light - Single', '1', 'circle kpi-green');
                verifyGetClassForKpi('THREE CIRCLES COLORED', '1', 'circle kpi-green');
            });

            it("Three Flags Colored bad", () => {
                verifyGetClassForKpi('Three Flags Colored', '-1', 'flag kpi-red');
            });

            it("Three Flags Colored warning", () => {
                verifyGetClassForKpi('Three Flags Colored', '0', 'flag kpi-yellow');
            });

            it("Three Flags Colored good", () => {
                verifyGetClassForKpi('Three Flags Colored', '1', 'flag kpi-green');
            });

            it("Road Signs bad", () => {
                verifyGetClassForKpi('Road Signs', '-1', 'circle-x kpi-red');
                verifyGetClassForKpi('THREE SYMBOLS CIRCLED COLORED', '-1', 'circle-x kpi-red');
            });

            it("Road Signs warning", () => {
                verifyGetClassForKpi('Road Signs', '0', 'circle-exclamation kpi-yellow');
                verifyGetClassForKpi('THREE SYMBOLS CIRCLED COLORED', '0', 'circle-exclamation kpi-yellow');
            });

            it("Road Signs good", () => {
                verifyGetClassForKpi('Road Signs', '1', 'circle-checkmark kpi-green');
                verifyGetClassForKpi('THREE SYMBOLS CIRCLED COLORED', '1', 'circle-checkmark kpi-green');
            });

            it("Traffic light bad", () => {
                verifyGetClassForKpi('Traffic Light', '-1', 'traffic-light kpi-red');
                verifyGetClassForKpi('THREE TRAFFIC LIGHTS RIMMED COLORED', '-1', 'traffic-light kpi-red');
            });

            it("Traffic light warning", () => {
                verifyGetClassForKpi('Traffic Light', '0', 'traffic-light kpi-yellow');
                verifyGetClassForKpi('THREE TRAFFIC LIGHTS RIMMED COLORED', '0', 'traffic-light kpi-yellow');
            });

            it("Traffic light good", () => {
                verifyGetClassForKpi('Traffic Light', '1', 'traffic-light kpi-green');
                verifyGetClassForKpi('THREE TRAFFIC LIGHTS RIMMED COLORED', '1', 'traffic-light kpi-green');
            });

            it("Three Symbols UnCircled Colored bad", () => {
                verifyGetClassForKpi('Three Symbols UnCircled Colored', '-1', 'x kpi-red');
            });

            it("Three Symbols UnCircled Colored warning", () => {
                verifyGetClassForKpi('Three Symbols UnCircled Colored', '0', 'exclamation kpi-yellow');
            });

            it("Three Symbols UnCircled Colored good", () => {
                verifyGetClassForKpi('Three Symbols UnCircled Colored', '1', 'checkmark kpi-green');
            });

            it("Shapes bad", () => {
                verifyGetClassForKpi('Shapes', '-1', 'rhombus kpi-red');
                verifyGetClassForKpi('SMILEY FACE', '-1', 'rhombus kpi-red');
                verifyGetClassForKpi('THERMOMETER', '-1', 'rhombus kpi-red');
                verifyGetClassForKpi('CYLINDER', '-1', 'rhombus kpi-red');
                verifyGetClassForKpi('THREE SIGNS COLORED', '-1', 'rhombus kpi-red');
            });

            it("Shapes warning", () => {
                verifyGetClassForKpi('Shapes', '0', 'triangle kpi-yellow');
                verifyGetClassForKpi('SMILEY FACE', '0', 'triangle kpi-yellow');
                verifyGetClassForKpi('THERMOMETER', '0', 'triangle kpi-yellow');
                verifyGetClassForKpi('CYLINDER', '0', 'triangle kpi-yellow');
                verifyGetClassForKpi('THREE SIGNS COLORED', '0', 'triangle kpi-yellow');
            });

            it("Shapes good", () => {
                verifyGetClassForKpi('Shapes', '1', 'circle kpi-green');
                verifyGetClassForKpi('SMILEY FACE', '1', 'circle kpi-green');
                verifyGetClassForKpi('THERMOMETER', '1', 'circle kpi-green');
                verifyGetClassForKpi('CYLINDER', '1', 'circle kpi-green');
                verifyGetClassForKpi('THREE SIGNS COLORED', '1', 'circle kpi-green');
            });

            it("Three Stars Colored bad", () => {
                verifyGetClassForKpi('Three Stars Colored', '-1', 'star-stacked star-empty');
            });

            it("Three Stars Colored warning", () => {
                verifyGetClassForKpi('Three Stars Colored', '0', 'star-stacked star-half-full');
            });

            it("Three Stars Colored good", () => {
                verifyGetClassForKpi('Three Stars Colored', '1', 'star-stacked star-full');
            });

            it("Five Bars Colored 0", () => {
                verifyGetClassForKpi('Five Bars Colored', '-2', 'bars-stacked bars-zero');
            });

            it("Five Bars Colored 1", () => {
                verifyGetClassForKpi('Five Bars Colored', '-1', 'bars-stacked bars-one');
            });

            it("Five Bars Colored 2", () => {
                verifyGetClassForKpi('Five Bars Colored', '0', 'bars-stacked bars-two');
            });

            it("Five Bars Colored 3", () => {
                verifyGetClassForKpi('Five Bars Colored', '1', 'bars-stacked bars-three');
            });

            it("Five Bars Colored 4", () => {
                verifyGetClassForKpi('Five Bars Colored', '2', 'bars-stacked bars-four');
            });

            it("Five Boxes Colored 0", () => {
                verifyGetClassForKpi('Five Boxes Colored', '-2', 'boxes-stacked boxes-zero');
            });

            it("Five Boxes Colored 1", () => {
                verifyGetClassForKpi('Five Boxes Colored', '-1', 'boxes-stacked boxes-one');
            });

            it("Five Boxes Colored 2", () => {
                verifyGetClassForKpi('Five Boxes Colored', '0', 'boxes-stacked boxes-two');
            });

            it("Five Boxes Colored 3", () => {
                verifyGetClassForKpi('Five Boxes Colored', '1', 'boxes-stacked boxes-three');
            });

            it("Five Boxes Colored 4", () => {
                verifyGetClassForKpi('Five Boxes Colored', '2', 'boxes-stacked boxes-four');
            });

            it("Gauge - Ascending 0", () => {
                verifyGetClassForKpi('Gauge - Ascending', '-2', 'circle-empty');
                verifyGetClassForKpi('FIVE QUARTERS COLORED', '-2', 'circle-empty');
            });

            it("Gauge - Ascending 1", () => {
                verifyGetClassForKpi('Gauge - Ascending', '-1', 'circle-one-quarter');
                verifyGetClassForKpi('FIVE QUARTERS COLORED', '-1', 'circle-one-quarter');
            });

            it("Gauge - Ascending 2", () => {
                verifyGetClassForKpi('Gauge - Ascending', '0', 'circle-half');
                verifyGetClassForKpi('FIVE QUARTERS COLORED', '0', 'circle-half');
            });

            it("Gauge - Ascending 3", () => {
                verifyGetClassForKpi('Gauge - Ascending', '1', 'circle-three-quarters');
                verifyGetClassForKpi('FIVE QUARTERS COLORED', '1', 'circle-three-quarters');
            });

            it("Gauge - Ascending 4", () => {
                verifyGetClassForKpi('Gauge - Ascending', '2', 'circle-full');
                verifyGetClassForKpi('FIVE QUARTERS COLORED', '2', 'circle-full');
            });

            it("Gauge - Descending 0", () => {
                verifyGetClassForKpi('GAUGE - DESCENDING', '-2', 'circle-full');
            });

            it("Gauge - Descending 1", () => {
                verifyGetClassForKpi('GAUGE - DESCENDING', '-1', 'circle-three-quarters');
            });

            it("Gauge - Descending 2", () => {
                verifyGetClassForKpi('GAUGE - DESCENDING', '0', 'circle-half');
            });

            it("Gauge - Descending 3", () => {
                verifyGetClassForKpi('GAUGE - DESCENDING', '1', 'circle-one-quarter');
            });

            it("Gauge - Descending 4", () => {
                verifyGetClassForKpi('GAUGE - DESCENDING', '2', 'circle-empty');
            });

            it("Standard Arrow 0", () => {
                verifyGetClassForKpi('Standard ARROW', '-2', 'arrow-down');
            });

            it("Standard Arrow 1", () => {
                verifyGetClassForKpi('Standard ARROW', '-1', 'arrow-right-down');
            });

            it("Standard Arrow 2", () => {
                verifyGetClassForKpi('Standard ARROW', '0', 'arrow-right');
            });

            it("Standard Arrow 3", () => {
                verifyGetClassForKpi('Standard ARROW', '1', 'arrow-right-up');
            });

            it("Standard Arrow 4", () => {
                verifyGetClassForKpi('Standard ARROW', '2', 'arrow-up');
            });

            it("Variance Arrow decrease", () => {
                verifyGetClassForKpi('Variance Arrow', '-1', 'arrow-down kpi-red');
            });

            it("Variance Arrow no change", () => {
                verifyGetClassForKpi('Variance Arrow', '0', 'arrow-right kpi-yellow');
            });

            it("Variance Arrow increase", () => {
                verifyGetClassForKpi('Variance Arrow', '1', 'arrow-up kpi-green');
            });

            it("Status Arrow (ascending) Colored 0", () => {
                verifyGetClassForKpi('STATUS ARROW - ASCENDING', '-2', 'arrow-down kpi-red');
            });

            it("Status Arrow (ascending) Colored 1", () => {
                verifyGetClassForKpi('STATUS ARROW - ASCENDING', '-1', 'arrow-right-down kpi-yellow');
            });

            it("Status Arrow (ascending) Colored 2", () => {
                verifyGetClassForKpi('STATUS ARROW - ASCENDING', '0', 'arrow-right kpi-yellow');
            });

            it("Status Arrow (ascending) Colored 3", () => {
                verifyGetClassForKpi('STATUS ARROW - ASCENDING', '1', 'arrow-right-up kpi-yellow');
            });

            it("Status Arrow (ascending) Colored 4", () => {
                verifyGetClassForKpi('STATUS ARROW - ASCENDING', '2', 'arrow-up kpi-green');
            });

            it("Status Arrow (descending) Colored 0", () => {
                verifyGetClassForKpi('STATUS ARROW - DESCENDING', '-2', 'arrow-up kpi-green');
            });

            it("Status Arrow (descending) Colored 1", () => {
                verifyGetClassForKpi('STATUS ARROW - DESCENDING', '-1', 'arrow-right-up kpi-yellow');
            });

            it("Status Arrow (descending) Colored 2", () => {
                verifyGetClassForKpi('STATUS ARROW - DESCENDING', '0', 'arrow-right kpi-yellow');
            });

            it("Status Arrow (descending) Colored 3", () => {
                verifyGetClassForKpi('STATUS ARROW - DESCENDING', '1', 'arrow-right-down kpi-yellow');
            });

            it("Status Arrow (descending) Colored 4", () => {
                verifyGetClassForKpi('STATUS ARROW - DESCENDING', '2', 'arrow-down kpi-red');
            });
        });

        describe('get metadata', () => {
            it("undefined for unknown kpi graphic status name", () => {
                let column = {
                    kpi: {
                        graphic: 'Bad KPI Name'
                    },
                    displayName: 'test',
                };
                let metadata = KpiUtil.getKpiImageMetadata(column, '1', KpiUtil.KpiImageSize.Big);
                expect(metadata).toBeUndefined();
            });

            it("three values - 0", () => {
                verifyGetMetadata('Shapes', '-1', 'rhombus kpi-red');
            });

            it("three values small - 1", () => {
                verifyGetMetadata('Shapes', '0', 'triangle kpi-yellow');
            });

            it("five values - 1", () => {
                verifyGetMetadata('Gauge - Ascending', '-1', 'circle-one-quarter');
            });

            it("five values - 3", () => {
                verifyGetMetadata('Gauge - Ascending', '1', 'circle-three-quarters');
            });
        });

        describe('normalized kpi values', () => {
            it("Normalized 0", () => {
                verifyGetClassForKpi('Gauge - Ascending', '-1', 'circle-empty', true);
                verifyGetClassForKpi('FIVE QUARTERS COLORED', '-1', 'circle-empty', true);
            });

            it("Normalized 1", () => {
                verifyGetClassForKpi('Gauge - Ascending', '-0.5', 'circle-one-quarter', true);
                verifyGetClassForKpi('FIVE QUARTERS COLORED', '-0.5', 'circle-one-quarter', true);
            });

            it("Normalized 2", () => {
                verifyGetClassForKpi('Gauge - Ascending', '0', 'circle-half', true);
                verifyGetClassForKpi('FIVE QUARTERS COLORED', '0', 'circle-half', true);
            });

            it("Normalized 3", () => {
                verifyGetClassForKpi('Gauge - Ascending', '0.5', 'circle-three-quarters', true);
                verifyGetClassForKpi('FIVE QUARTERS COLORED', '0.5', 'circle-three-quarters', true);
            });

            it("Normalized 4", () => {
                verifyGetClassForKpi('Gauge - Ascending', '1', 'circle-full', true);
                verifyGetClassForKpi('FIVE QUARTERS COLORED', '1', 'circle-full', true);
            });

            it("Don't normalize 3 states", () => {
                verifyGetClassForKpi('ROAD SIGNS', '1', 'circle-checkmark kpi-green', true);
                verifyGetClassForKpi('ROAD SIGNS', '0', 'circle-exclamation kpi-yellow', true);
                verifyGetClassForKpi('ROAD SIGNS', '-1', 'circle-x kpi-red', true);
            });
        });

        function verifyClassCss(actual: string, expected: string, size: KpiUtil.KpiImageSize): void {
            expect(actual).toContain(expected);
            expect(actual).toContain('powervisuals-glyph');

            if (size === KpiUtil.KpiImageSize.Big)
                expect(actual).toContain('big-kpi');
        }

        function verifyGetClassForKpi(kpiName: string, value: string, expectedCss: string, normalized = false): void {
            for (let size of [KpiUtil.KpiImageSize.Small, KpiUtil.KpiImageSize.Big]) {
                let kpi: powerbi.DataViewKpiColumnMetadata = {
                    graphic: kpiName,
                    normalizedFiveStateKpiRange: normalized
                };
                let css = KpiUtil.getClassForKpi(kpi, value, size);
                verifyClassCss(css, expectedCss, size);
            }
        }

        function verifyGetMetadata(kpiName: string, value: string, expectedIcon?: string): void {
            for (let size of [KpiUtil.KpiImageSize.Small, KpiUtil.KpiImageSize.Big]) {
                let column = {
                    kpi: {
                        graphic: kpiName
                    },
                    displayName: 'test',
                };
                let metadata = KpiUtil.getKpiImageMetadata(column, value, size);

                expect(metadata.caption).toBe(expectedIcon);
                expect(metadata.statusGraphic).toBe(kpiName);
                verifyClassCss(metadata.class, expectedIcon, size);
            }
        }
    });
}