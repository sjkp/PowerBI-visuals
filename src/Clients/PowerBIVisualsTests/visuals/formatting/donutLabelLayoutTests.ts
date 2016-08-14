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
    
    import dataLabelUtils = powerbi.visuals.dataLabelUtils;
    import labelStyle = powerbi.visuals.labelStyle;
    import DonutLabelLayout = powerbi.DonutLabelLayout;
    import DonutLabelUtils = powerbi.visuals.DonutLabelUtils;
    import ISize = powerbi.visuals.shapes.ISize;
    import LabelDataPointParentType = powerbi.LabelDataPointParentType;
    import LabelParentPoint = powerbi.LabelParentPoint;
    import NewDataLabelUtils = powerbi.visuals.NewDataLabelUtils;
    import PointLabelPosition = powerbi.NewPointLabelPosition;

    describe("DonutLabelLayout tests", () => {
        const outerArcRadiusRatio = 0.9;
        const innerArcRadiusRatio = 0.8;
        const pi = Math.PI;

        let viewport: powerbi.IViewport = { width: 500, height: 500 };
        let radius = createRadius(viewport);
        let donutProperties: powerbi.DonutChartProperties = {
            viewport: viewport,
            radius: radius,
            arc: d3.svg.arc().innerRadius(0).outerRadius(radius * innerArcRadiusRatio),
            outerArc: d3.svg.arc()
                .innerRadius(radius * outerArcRadiusRatio)
                .outerRadius(radius * outerArcRadiusRatio),
            innerArcRadiusRatio: innerArcRadiusRatio,
            outerArcRadiusRatio: outerArcRadiusRatio,
            dataLabelsSettings: dataLabelUtils.getDefaultDonutLabelSettings(),
        };
        describe("DonutLabelLayout tests", () => {
            let donutLabelLayout: DonutLabelLayout;
            const testFillColor = "#777777";
            beforeEach(() => {
                donutLabelLayout = new DonutLabelLayout({
                    startingOffset: NewDataLabelUtils.startingLabelOffset,
                    maximumOffset: NewDataLabelUtils.maxLabelOffset,
                }, donutProperties);
            });

            it("Label is correctly laid out", () => {
                let labelDataPoints = [createDonutLabelDataPoint("right", 100, 0, false, 0, pi), createDonutLabelDataPoint("left", 100, 1, false, pi, pi * 2)];
                let labels = donutLabelLayout.layout(labelDataPoints);
                expect(labels.length).toBe(2);

                // verify first label is on the right
                let right = labels[0];
                expect(right.boundingBox.left).toBeGreaterThan(0);
                expect(right.textAnchor).toBe("start");

                // verify second label is on the left
                let left = labels[1];
                expect(left.boundingBox.left).toBeLessThan(0);
                expect(left.textAnchor).toBe("end");
            });

            it("Label has correct text", () => {
                let labelDataPoints = [
                    createDonutLabelDataPoint("abc", 100, 0, false, 0, pi),
                    createDonutLabelDataPoint("abcdef", 100, 1, false, pi, 2 * pi),
                    createDonutLabelDataPoint("abcdefghi", 100, 2, false, 2 * pi, 3 * pi),
                    createDonutLabelDataPoint("abcdefghijkl", 100, 3, false, 3 * pi, 4 * pi),
                    createDonutLabelDataPoint("abcdefghijklmnopqrstuvwxyz", 100, 4, false, 4 * pi, 5 * pi),
                ];
                let labels = donutLabelLayout.layout(labelDataPoints);
                expect(labels[0].text).toBe("abc");
                expect(labels[1].text).toBe("abcdef");
                expect(labels[2].text).toBe("abcdefghi");
                expect(labels[3].text).toBe("abcdefghijkl");
                expect(labels[4].text).toContain("…");
            });

            it("Label uses fill color", () => {
                let labelDataPoints = [
                    createDonutLabelDataPoint("abc", 100, 0, false, 0, pi),
                    createDonutLabelDataPoint("abcdef", 100, 1, false, pi, 2 * pi),
                ];
                let labels = donutLabelLayout.layout(labelDataPoints);
                expect(labels[0].fill).toBe(testFillColor);
                expect(labels[1].fill).toBe(testFillColor);
            });

            it("Label has leader lines", () => {
                let labelDataPoints = [
                    createDonutLabelDataPoint("abc", 100, 0, false, 0, pi),
                    createDonutLabelDataPoint("abcdef", 100, 1, false, pi, 2 * pi),
                ];
                let labels = donutLabelLayout.layout(labelDataPoints);
                expect(labels[0].leaderLinePoints).toEqual([[164, 0], [180, 0], [192, 0]] );
                expect(labels[1].leaderLinePoints).toEqual([[-164, 2.0084207506016593e-14], [-180, 2.2043642384652358e-14], [-192, 2.2043642384652358e-14]] );

            });

            it("DonutLabelLayout changes truncated labels position ", () => {
                let propertiesWithCustomSetttings = dataLabelUtils.getDefaultDonutLabelSettings();
                propertiesWithCustomSetttings.labelStyle = labelStyle.both;

                let donutLabelLayoutWithCustomLabelSetting: DonutLabelLayout = createDonutLabelLayoutWithLabelSettingsStyle(propertiesWithCustomSetttings);
                let dataLabelDataPoints = [
                    createDonutLabelDataPoint("abc", 100, 0, false, 0, pi, labelStyle.both),
                    createDonutLabelDataPoint("abcdef", 200, 1, false, pi, 2 * pi, labelStyle.both),
                    createDonutLabelDataPoint("abcdefghi", 300, 2, false, 2 * pi, 3 * pi, labelStyle.both),
                    createDonutLabelDataPoint("abcdefghijkl", 400, 3, false, 3 * pi, 4 * pi, labelStyle.both),
                    createDonutLabelDataPoint("abcdefghijklmno", 500, 4, false, 4 * pi, +5 * pi, labelStyle.both),
                ];
                let dataLabels = donutLabelLayoutWithCustomLabelSetting.layout(dataLabelDataPoints);

                let labelDataPoints = [
                    createDonutLabelDataPoint("abc", 100, 0, false, 0, pi),
                    createDonutLabelDataPoint("abcdef", 200, 1, false, pi, 2 * pi),
                    createDonutLabelDataPoint("abcdefghi", 300, 2, false, 2 * pi, 3 * pi),
                    createDonutLabelDataPoint("abcdefghijkl", 400, 3, false, 3 * pi, 4 * pi),
                    createDonutLabelDataPoint("abcdefghijklmno", 500, 4, false, 4 * pi, 5 * pi),
                ];
                let categoryLabels = donutLabelLayout.layout(labelDataPoints);

                expect(dataLabels.length).toBe(categoryLabels.length);
                expect(dataLabels[0].boundingBox.top).toBeGreaterThan(categoryLabels[0].boundingBox.top);
                expect(dataLabels[1].boundingBox.top).toBeGreaterThan(categoryLabels[1].boundingBox.top);
                expect(dataLabels[2].boundingBox.top).toBeLessThan(categoryLabels[2].boundingBox.top);
            });
        });
        describe("DonutLabelLayout tests with different labelStyle", () => {

            it("Label is data label", () => {
                let propertiesWithCustomSetttings = dataLabelUtils.getDefaultDonutLabelSettings();
                propertiesWithCustomSetttings.labelStyle = labelStyle.data;
                let donutLabelLayoutWithCustomLabelSetting: DonutLabelLayout = createDonutLabelLayoutWithLabelSettingsStyle(propertiesWithCustomSetttings);

                let labelDataPoints = [
                    createDonutLabelDataPoint("abc", 100, 0, false, 0, pi, labelStyle.data),
                    createDonutLabelDataPoint("abcdef", 200, 1, false, pi, 2 * pi, labelStyle.data),
                    createDonutLabelDataPoint("abcdefghi", 300, 2, false, 2 * pi, 3 * pi, labelStyle.data),
                    createDonutLabelDataPoint("abcdefghijkl", 400, 3, false, 3 * pi, 4 * pi, labelStyle.data),
                    createDonutLabelDataPoint("abcdefghijklmno", 500, 4, false, 4 * pi, 5 * pi, labelStyle.data),
                ];
                let labels = donutLabelLayoutWithCustomLabelSetting.layout(labelDataPoints);
                expect(labels[0].text).toBe("$100");
                expect(labels[1].text).toBe("$200");
                expect(labels[2].text).toBe("$300");
                expect(labels[3].text).toBe("$400");
                expect(labels[4].text).toBe("$500");
            });

            it("Label has second row text", () => {
                let propertiesWithCustomSetttings = dataLabelUtils.getDefaultDonutLabelSettings();
                propertiesWithCustomSetttings.labelStyle = labelStyle.both;

                let donutLabelLayoutWithCustomLabelSetting: DonutLabelLayout = createDonutLabelLayoutWithLabelSettingsStyle(propertiesWithCustomSetttings);
                let labelDataPoints = [
                    createDonutLabelDataPoint("abc", 100, 0, false, 0, pi, labelStyle.both),
                    createDonutLabelDataPoint("abcdef", 200, 1, false, pi, 2 * pi, labelStyle.both),
                    createDonutLabelDataPoint("abcdefghi", 300, 2, false, 2 * pi, 3 * pi, labelStyle.both),
                    createDonutLabelDataPoint("abcdefghijkl", 400, 3, false, 3 * pi, 4 * pi, labelStyle.both),
                    createDonutLabelDataPoint("abcdefghijklmno", 500, 4, false, 4 * pi, 5 * pi, labelStyle.both),
                ];
                let labels = donutLabelLayoutWithCustomLabelSetting.layout(labelDataPoints);
                expect(labels.length).toBe(5);
                expect(labels[0].text).toBe("abc ($100)");
                expect(labels[1].text).toBe("abcdef ($200)");
                expect(labels[2].text).toContain("$300");
                expect(labels[3].text).toBe("$400");
                expect(labels[4].text).toBe("$500");
                expect(labels[3].secondRowText).toContain("abcdef");
                expect(labels[4].secondRowText).toContain("abcdef");
            });

            it("DonutLabelLayout changes position of overlapping labels ", () => {
                let propertiesWithCustomSetttings = dataLabelUtils.getDefaultDonutLabelSettings();
                propertiesWithCustomSetttings.labelStyle = labelStyle.data;

                let donutLabelLayoutDataLabels: DonutLabelLayout = createDonutLabelLayoutWithLabelSettingsStyle(propertiesWithCustomSetttings);
                let labelDataPoints = [
                    createDonutLabelDataPoint("abc", 1000, 0, false, 0, pi, labelStyle.both),
                    createDonutLabelDataPoint("abcdef", 5000, 1, false, pi, 2 * pi, labelStyle.both),
                    createDonutLabelDataPoint("abcdefghi", 2000, 2, false, 2 * pi, 3 * pi, labelStyle.both),
                    createDonutLabelDataPoint("abcdefghijkl", 1000, 3, false, 3 * pi, 4 * pi, labelStyle.both),
                    createDonutLabelDataPoint("abcdefghijklmno", 5000, 4, false, 4 * pi, 5 * pi, labelStyle.both),
                ];
                let dataLabels = donutLabelLayoutDataLabels.layout(labelDataPoints);

                propertiesWithCustomSetttings.labelStyle = labelStyle.data;
                let overlappingLabelDataPoints = [
                    createDonutLabelDataPoint("abc", 1000, 0, false, 0, pi, labelStyle.data),
                    createDonutLabelDataPoint("abcdef", 5, 1, false, pi, 2 * pi, labelStyle.data),
                    createDonutLabelDataPoint("abcdefghi", 2, 2, false, 2 * pi, 3 * pi, labelStyle.data),
                    createDonutLabelDataPoint("abcdefghijkl", 1, 3, false, 3 * pi, 4 * pi, labelStyle.data),
                    createDonutLabelDataPoint("abcdefghijklmno", 5000, 4, false, 4 * pi, 5 * pi, labelStyle.data),
                ];
                let categoryLabels = donutLabelLayoutDataLabels.layout(overlappingLabelDataPoints);

                expect(dataLabels.length).toBe(categoryLabels.length);
                expect(dataLabels[0].boundingBox.top).toBe(categoryLabels[0].boundingBox.top);
                expect(dataLabels[1].boundingBox.top).toBeGreaterThan(categoryLabels[1].boundingBox.top);
                expect(dataLabels[2].boundingBox.top).toBe(categoryLabels[2].boundingBox.top);
                expect(dataLabels[3].boundingBox.top).toBeGreaterThan(categoryLabels[3].boundingBox.top);
                expect(dataLabels[4].boundingBox.top).toBe(categoryLabels[4].boundingBox.top);
            });

            it("DonutLabelLayout culls labels when offset gets too large", () => {
                let propertiesWithCustomSetttings = dataLabelUtils.getDefaultDonutLabelSettings();
                propertiesWithCustomSetttings.labelStyle = labelStyle.both;

                let donutLabelLayout: DonutLabelLayout = createDonutLabelLayoutWithLabelSettingsStyle(propertiesWithCustomSetttings);
                let labelDataPoints = [
                    createDonutLabelDataPoint("abc", 1000000, 0, false, 0, pi, labelStyle.both),
                    createDonutLabelDataPoint("abcdef", 200000, 1, false, pi, 2 * pi, labelStyle.both),
                    createDonutLabelDataPoint("abcdefghi", 10, 2, false, 2 * pi, 3 * pi, labelStyle.both),
                    createDonutLabelDataPoint("abcdefghijkl", 0.002, 3, false, 3 * pi, 4 * pi, labelStyle.both),
                    createDonutLabelDataPoint("abcdefghijklmno", 0.001, 4, false, 4 * pi, 5 * pi, labelStyle.both),
                    createDonutLabelDataPoint("abcdefghijklmnopqr", 0.002, 5, false, 5 * pi, 6 * pi, labelStyle.both),
                    createDonutLabelDataPoint("abcdefghijklmnopqrstu", 0.0002, 6, false, 6 * pi, 7 * pi, labelStyle.both),
                    createDonutLabelDataPoint("abcdefghijklmnopqrstuvwxyzABCDEFG", 7000000, 7, false, 7 * pi, 8 * pi, labelStyle.both),
                    createDonutLabelDataPoint("abcdefghijklmnopqrstuvwxyzABCDEFGHIK", 9000000, 8, false, 8 * pi, 9 * pi, labelStyle.both),
                ];
                let dataLabels = donutLabelLayout.layout(labelDataPoints);
                expect(dataLabels.length).toBeLessThan(labelDataPoints.length);
            });
        });

        /**
        * Creating a donut label data point.
        * When creating a label make sure that the start and end angles are in radians
        */
        function createDonutLabelDataPoint(text: string, value: number, index: number, isPreferred: boolean = false, startAngle: number = 1, endAngle: number = 10, customLabelSetting: any = null): powerbi.DonutLabelDataPoint {
            let data: powerbi.visuals.DonutDataPoint = {
                measure: value,
                originalMeasure: undefined,
                percentage: undefined,
                highlightRatio: undefined,
                label: undefined,
                index: undefined,
                color: undefined,
                strokeWidth: undefined,
                labelFormatString: undefined,
                identity: undefined,
                selected: false,
                tooltipInfo: undefined,
            };
            let donutArcDescriptor: powerbi.visuals.DonutArcDescriptor = {
                data: data,
                value: value,
                startAngle: startAngle,
                endAngle: endAngle,
                index: index,
            };
            let labelPoint = donutProperties.outerArc.centroid(donutArcDescriptor);
            let labelX = DonutLabelUtils.getXPositionForDonutLabel(labelPoint[0]);
            let labelY = labelPoint[1];
            let labelSettings = donutProperties.dataLabelsSettings;
            let position = labelX < 0 ? PointLabelPosition.Left : PointLabelPosition.Right;
            let pointPosition: LabelParentPoint = {
                point: {
                    x: labelX,
                    y: labelY,
                },
                validPositions: [position],
                radius: 0,
            };
            let dataLabel: string;
            let dataLabelSize: ISize;
            let categoryLabel: string;
            let categoryLabelSize: ISize;
            let textSize: ISize;
            let labelSettingsStyle = customLabelSetting ? customLabelSetting : labelSettings.labelStyle;
            let fontSize = labelSettings.fontSize;

            if (labelSettingsStyle === labelStyle.both || labelSettingsStyle === labelStyle.data) {
                let measureFormatter = dataLabelUtils.createColumnFormatterCacheManager().getOrCreate('$0', labelSettings, value);
                dataLabel = measureFormatter.format(value);
                dataLabelSize = NewDataLabelUtils.getTextSize(dataLabel, fontSize);
            }

            if (labelSettingsStyle === labelStyle.both || labelSettingsStyle === labelStyle.category) {
                categoryLabel = text;
                categoryLabelSize = NewDataLabelUtils.getTextSize(categoryLabel, fontSize);
            }

            switch (labelSettingsStyle) {
                case labelStyle.both:
                    let text = categoryLabel + " (" + dataLabel + ")";
                    textSize = NewDataLabelUtils.getTextSize(text, fontSize);
                    break;
                case labelStyle.category:
                    textSize = _.clone(categoryLabelSize);
                    break;
                case labelStyle.data:
                    textSize = _.clone(dataLabelSize);
                    break;
            }

            let leaderLinePoints = DonutLabelUtils.getLabelLeaderLineForDonutChart(donutArcDescriptor, donutProperties, pointPosition.point);
            let leaderLinesSize = DonutLabelUtils.getLabelLeaderLinesSizeForDonutChart(leaderLinePoints);

            return {
                textSize: textSize,
                isPreferred: isPreferred,
                parentType: LabelDataPointParentType.Point,
                parentShape: pointPosition,
                text: "",
                insideFill: NewDataLabelUtils.defaultInsideLabelColor,
                outsideFill: NewDataLabelUtils.defaultLabelColor,
                identity: undefined,
                dataLabel: dataLabel,
                dataLabelSize: dataLabelSize,
                categoryLabel: categoryLabel,
                categoryLabelSize: categoryLabelSize,
                donutArcDescriptor: donutArcDescriptor,
                alternativeScale: undefined,
                angle: (startAngle + endAngle) / 2 - (Math.PI / 2),
                linesSize: leaderLinesSize,
                leaderLinePoints: leaderLinePoints,
            };
        }

        // function createRect(left: number, top: number, width: number, height: number): IRect {
            // return {
                // left: left,
                // top: top,
                // width: width,
                // height: height,
            // };
        // }

        function createDonutLabelLayoutWithLabelSettingsStyle(customLabelSettings: powerbi.visuals.VisualDataLabelsSettings): powerbi.DonutLabelLayout {
            let donutPropertiesWithCustomLabelSettingsStyle: powerbi.DonutChartProperties = {
                viewport: viewport,
                radius: radius,
                arc: d3.svg.arc().innerRadius(0).outerRadius(radius * innerArcRadiusRatio),
                outerArc: d3.svg.arc()
                    .innerRadius(radius * outerArcRadiusRatio)
                    .outerRadius(radius * outerArcRadiusRatio),
                innerArcRadiusRatio: innerArcRadiusRatio,
                outerArcRadiusRatio: outerArcRadiusRatio,
                dataLabelsSettings: customLabelSettings,
            };

            let donutLabelLayout: DonutLabelLayout = new DonutLabelLayout({
                startingOffset: NewDataLabelUtils.startingLabelOffset,
                maximumOffset: NewDataLabelUtils.maxLabelOffset,
            },
                donutPropertiesWithCustomLabelSettingsStyle);
            return donutLabelLayout;

        }

        function createRadius(viewport: powerbi.IViewport): number {
            if (!viewport || !viewport.width || !viewport.height) return 0;
            let hw = viewport.height / viewport.width;
            let denom = 2 + (1 / (1 + Math.exp(-5 * (hw - 1))));
            return Math.min(viewport.height, viewport.width) / denom;
        }
    });
}
