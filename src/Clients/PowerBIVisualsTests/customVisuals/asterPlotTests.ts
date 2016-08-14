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

module powerbitests.customVisuals {
    import DataView = powerbi.DataView;
    import IDataColorPalette = powerbi.IDataColorPalette;
    import LegendData = powerbi.visuals.LegendData;
    import VisualClass = powerbi.visuals.samples.AsterPlot;
    import AsterPlotVisualData = powerbi.visuals.samples.AsterPlotData;
    import PixelConverter = jsCommon.PixelConverter;
    import Helpers = powerbitests.helpers;
    import AsterPlotData = powerbitests.customVisuals.sampleDataViews.AsterPlotData;
    import VisualSettings = powerbi.visuals.samples.AsterPlotSettings;

    powerbitests.mocks.setLocale();

    describe("AsterPlot", () => {
        let visualBuilder: AsterPlotBuilder;
        let defaultDataViewBuilder: AsterPlotData;
        let dataView: DataView;
        let settings: VisualSettings;

        beforeEach(() => {
            visualBuilder = new AsterPlotBuilder(1000,500);
            defaultDataViewBuilder = new AsterPlotData();
            dataView = defaultDataViewBuilder.getDataView();
            settings = dataView.metadata.objects = <any>new VisualSettings();
        });

        describe("capabilities", () => {
            let asterPlotCapabilities = VisualClass.capabilities;

            it("Should register capabilities", () => expect(asterPlotCapabilities).toBeDefined());

            it("Should include dataRoles", () => expect(asterPlotCapabilities.dataRoles).toBeDefined());

            it("Should include dataViewMappings", () => expect(asterPlotCapabilities.dataViewMappings).toBeDefined());

            it("Should include objects", () => expect(asterPlotCapabilities.objects).toBeDefined());

        });

        describe("DOM tests", () => {
            it("Should create svg element", () => expect(visualBuilder.mainElement[0]).toBeInDOM());

            it("Should draw right amount of slices", () => {
                visualBuilder.updateflushAllD3Transitions(dataView);
                expect(visualBuilder.mainElement.find(".asterSlice").length)
                    .toBe(dataView.categorical.categories[0].values.length);
            });

            it("Should add center label", () => {
                visualBuilder.updateflushAllD3Transitions(dataView);

                let centerText: JQuery = $(".asterPlot .centerLabel");
                expect(centerText).toBeInDOM();
            });

            it("Should not add center label to DOM when there is no data", () => {
                visualBuilder.updateflushAllD3Transitions([]);

                let centerText: JQuery = $(".asterPlot .centerLabel");
                expect(centerText.length).toBe(0);
            });

            describe("Data Labels", () => {
                beforeEach(() => {
                    settings.labels.show = true;
                });

                it("Default Data Labels", () => {
                    visualBuilder.updateflushAllD3Transitions(dataView);

                    let numOfLabels = dataView.categorical.values[0].values.length;
                    let labels: JQuery = $(".asterPlot .labels .data-labels");
                    expect(labels.length).toBe(numOfLabels);
                    let lines: JQuery = $(".asterPlot .lines .line-label");
                    expect(lines.length).toBe(numOfLabels);
                    let slices: JQuery = $(".asterPlot .asterSlice");
                    expect(slices.length).toBe(numOfLabels);
                });

                it("Data Labels have conflict with viewport", () => {
                    visualBuilder.updateflushAllD3Transitions(dataView);

                    let numOfLabels = dataView.categorical.values[0].values.length;
                    let labels: JQuery = $(".asterPlot .labels .data-labels");
                    let lines: JQuery = $(".asterPlot .lines .line-label");
                    expect(lines.length).toBe(numOfLabels);
                    expect(labels.length).toBe(numOfLabels);
                    //The viewport is reduced
                    visualBuilder.viewport = { height: 200, width: 350 };
                    visualBuilder.update(dataView);
                    let labelsAfterResize: JQuery = $(".asterPlot .labels .data-labels");
                    let linesAfterResize: JQuery = $(".asterPlot .lines .line-label");
                    expect(labelsAfterResize.length).toBe(numOfLabels);
                    expect(linesAfterResize.length).toBe(numOfLabels);

                    let firsrtLabelX = $(labels).first().attr("x");
                    let firsrtLabelY = $(labels).first().attr("y");
                    //let lastLabelX = $(labels).last().attr("x");
                    let lastLabelY = $(labels).last().attr("y");
                    let firsrtResizeLabelX = $(labelsAfterResize).first().attr("x");
                    let firsrtResizeLabelY = $(labelsAfterResize).first().attr("y");
                    //let lastResizeLabelX = $(labelsAfterResize).last().attr("x");
                    let lastResizeLabelY = $(labelsAfterResize).last().attr("y");

                    expect(firsrtLabelX).toBeGreaterThan(parseFloat(firsrtResizeLabelX));
                    expect(firsrtLabelY).toBeLessThan(parseFloat(firsrtResizeLabelY));

                    // TODO: uncomment and fix
                    //expect(lastLabelX).toBeGreaterThan(parseFloat(lastResizeLabelX));
                    expect(lastLabelY).toBeLessThan(parseFloat(lastResizeLabelY));
                });

                it("Data Labels - Decimal value for Labels should have a limit to 17", () => {
                    settings.labels.show = true;
                    settings.labels.precision = 5666;

                    visualBuilder.updateflushAllD3Transitions(dataView);

                    let labels: JQuery = $(".asterPlot .labels .data-labels");
                    let dataLabels = $(labels).first().text();
                    let maxPrecision: number = 17;
                    expect(dataLabels).toBe("0.86618686000000000M");
                    expect(dataLabels.length - 3).toBe(maxPrecision);
                });

                it("Data Labels - Change font size", () => {
                    settings.labels.show = true;
                    settings.labels.fontSize = 15;

                    visualBuilder.updateflushAllD3Transitions(dataView);

                    let labels: JQuery = $(".asterPlot .labels .data-labels");
                    expect(labels.first().css("font-size")).toBe(settings.labels.fontSize * 4 / 3 + "px");
                });

                it("Data Labels should be clear when removing data", () => {
                    settings.labels.show = true;

                    visualBuilder.updateflushAllD3Transitions(dataView);

                    let labels: JQuery = $(".asterPlot .labels .data-labels");
                    expect(labels.length).toBeGreaterThan(0);

                    // Manually remove categories
                    dataView.categorical.categories = undefined;

                    visualBuilder.updateflushAllD3Transitions(dataView);

                    // Check that the labels were removed
                    labels = $(".asterPlot .labels .data-labels");
                    expect(labels.length).toBe(0);
                });

                it("Data Labels should be displayed correctly when using dates as category values", () => {
                    settings.labels.show = true;

                    // Manually change the category format to be a date format
                    dataView.categorical.categories[0].source.format = "dddd\, MMMM %d\, yyyy";

                    visualBuilder.updateflushAllD3Transitions(dataView);

                    let labels: JQuery = $(".asterPlot .labels .data-labels");
                    expect(labels.length).toBeGreaterThan(0);

                    // Verify label text is formatted correctly
                    expect($(labels[0]).text()).toBe("0.87M");
                    expect($(labels[3]).text()).toBe("0.31M");
                    expect($(labels[5]).text()).toBe("1.26M");
                });

                it("Data Labels should not display lines for null and zero labels", () => {
                    settings.labels.show = true;

                    visualBuilder.updateflushAllD3Transitions(dataView);

                    let originalLines: number = $(".asterPlot .lines .line-label").length;

                    // Manually set a label to null and zero
                    dataView.categorical.values[0].values[0] = null;
                    dataView.categorical.values[1].values[0] = null;
                    dataView.categorical.values[0].values[3] = 0;
                    dataView.categorical.values[1].values[3] = 0;

                    visualBuilder.updateflushAllD3Transitions(dataView);

                    let newLines: number = $(".asterPlot .lines .line-label").length;

                    // Verify label lines are not generated for null and zero
                    expect(newLines).toBeLessThan(originalLines);
                });

                it("Data labels shouldn't be displayed for non highlighted values", () => {
                    settings.labels.show = true;
                    var length = Math.round(dataView.categorical.values[0].values.length / 2);
                    dataView.categorical.values.forEach(x =>
                        x.highlights = x.values.map((v,i) => i >= length ? null : v));
                    visualBuilder.updateflushAllD3Transitions(dataView);
                    expect(visualBuilder.lineLabel.length).toEqual(length);
                });
            });

            describe("Default Legend", () => {
                let defaultLegendLabelFontSize = 8;

                beforeEach(() => {
                    settings.legend.show = true;
                    visualBuilder.update(dataView);
                });

                it("Should add legend", () => {
                    expect(visualBuilder.legendGroup).toBeInDOM();
                });

                it("Should color legend title & items with default color", () => {
                    let legendTitle: JQuery = visualBuilder.legendGroup.children(".legendTitle");
                    Helpers.assertColorsMatch(legendTitle.css("fill"), LegendData.DefaultLegendLabelFillColor);
                    Helpers.assertColorsMatch(visualBuilder.firstLegendText.css("fill"), LegendData.DefaultLegendLabelFillColor);
                });

                it("Should set legend title & tooltip to text from dataview", () => {
                    let legendTitle: JQuery = visualBuilder.legendGroup.children(".legendTitle");
                    expect(legendTitle.length).toEqual(1);

                    let legendTitleText: string = Helpers.findElementText(legendTitle);
                    let legendTitleTitle: string = Helpers.findElementTitle(legendTitle);
                    let expectedDefaultTitleAndToolTipText: string = dataView.categorical.categories[0].source.displayName;
                    expect(legendTitleText).toEqual(expectedDefaultTitleAndToolTipText);
                    expect(legendTitleTitle).toEqual(expectedDefaultTitleAndToolTipText);
                });

                it("Should set legend title and legend items with default font size", () => {
                    let defaultLabelFontSizeInPixels: number = Math.round(PixelConverter.fromPointToPixel(defaultLegendLabelFontSize));
                    let legendTitle: JQuery = visualBuilder.legendGroup.find(".legendTitle");
                    let legendTitleFontSize: number = Math.round(parseFloat(legendTitle.css("font-size")));
                    let firstLegendItemTextFontSize: number = Math.round(parseFloat(visualBuilder.firstLegendText.css("font-size")));

                    expect(legendTitleFontSize).toBe(defaultLabelFontSizeInPixels);
                    expect(firstLegendItemTextFontSize).toBe(defaultLabelFontSizeInPixels);
                });
            });

            describe("Custom Legend", () => {
                let labelColor: string = powerbi.visuals.dataLabelUtils.defaultLabelColor;
                let labelFontSizeInPoints = 10;  // 10 (in points) ==> 13.333333 (in pixels)
                let labelFonSizeInPixels: number = Math.round(PixelConverter.fromPointToPixel(labelFontSizeInPoints));
                let customLegendTitle = "My title";

                beforeEach(() => {
                    settings.legend = {
                            titleText: customLegendTitle,
                            show: true,
                            showTitle: true,
                            labelColor: <any>{ solid: { color: labelColor } },
                            fontSize: labelFontSizeInPoints,
                            position: "LeftCenter",
                        };
                });

                it("Should add right amount of legend items", () => {
                    visualBuilder.update(dataView);

                    let legendItems: JQuery = $("#legendGroup .legendItem");
                    expect(legendItems.length).toEqual(dataView.categorical.categories[0].values.length);
                });

                it("Should set legend title & tooltip to user configured text", () => {
                    visualBuilder.update(dataView);

                    let legendTitle: JQuery = visualBuilder.legendGroup.children(".legendTitle");
                    expect(legendTitle.length).toEqual(1);

                    let legendTitleText: string = Helpers.findElementText(legendTitle);
                    let legendTitleTitle: string = Helpers.findElementTitle(legendTitle);
                    expect(legendTitleText).toEqual(customLegendTitle);
                    expect(legendTitleTitle).toEqual(customLegendTitle);
                });

                it("Should color legend title & items with user configured color", () => {
                    visualBuilder.update(dataView);
                    let legendTitle: JQuery = visualBuilder.legendGroup.children(".legendTitle");
                    Helpers.assertColorsMatch(legendTitle.css("fill"), labelColor);
                    Helpers.assertColorsMatch(visualBuilder.firstLegendText.css("fill"), labelColor);
                });

                it("Should set legend title and legend items with user configured font size", () => {
                    visualBuilder.update(dataView);

                    let legendTitle: JQuery = visualBuilder.legendGroup.find(".legendTitle");
                    let legendTitleFontSize = Math.round(parseFloat(legendTitle.css("font-size")));
                    let firstLegendItemTextFontSize = Math.round(parseFloat(visualBuilder.firstLegendText.css("font-size")));

                    expect(legendTitleFontSize).toBe(labelFonSizeInPixels);
                    expect(firstLegendItemTextFontSize).toBe(labelFonSizeInPixels);
                });

                it("Should set legend title and legend items with user configured font size", () => {
                    visualBuilder.update(dataView);

                    let legendTitle: JQuery = visualBuilder.legendGroup.find(".legendTitle");
                    let legendTitleFontSize = Math.round(parseFloat(legendTitle.css("font-size")));
                    let firstLegendItemTextFontSize = Math.round(parseFloat(visualBuilder.firstLegendText.css("font-size")));

                    expect(legendTitleFontSize).toBe(labelFonSizeInPixels);
                    expect(firstLegendItemTextFontSize).toBe(labelFonSizeInPixels);
                });

                it("if required fields are missing then visual shouldn't be rendered", () => {
                    dataView = defaultDataViewBuilder.getDataView([AsterPlotData.ColumnCategory]);
                    visualBuilder.update(dataView);
                    expect(visualBuilder.lineLabel[0]).not.toBeInDOM();
                    expect(visualBuilder.dataLabels[0]).not.toBeInDOM();

                    dataView = defaultDataViewBuilder.getDataView([AsterPlotData.ColumnY1]);
                    visualBuilder.update(dataView);
                    expect(visualBuilder.lineLabel[0]).not.toBeInDOM();
                    expect(visualBuilder.dataLabels[0]).not.toBeInDOM();
                });
            });

            describe("Converter", () => {
                let asterData: AsterPlotVisualData;

                it("Should convert all data when there is a limit to colors", () => {

                    // Manually create a small amount of colors
                    let palette: IDataColorPalette = new powerbi.visuals.DataColorPalette([
                        { value: "#000000" },
                        { value: "#000001" },
                        { value: "#000002" },
                        { value: "#000003" }
                    ]);
                    let colors: IDataColorPalette = powerbi.visuals.visualStyles.create(palette).colorPalette.dataColors;
                    asterData = visualBuilder.converter(dataView, colors);

                    // Verify that all data was created even with the color limitation
                    expect(asterData.dataPoints.length).toBe(dataView.categorical.categories[0].values.length);
                });
            });
        });
    });

    class AsterPlotBuilder extends VisualBuilderBase<VisualClass> {
        constructor(width: number, height: number, isMinervaVisualPlugin: boolean = false) {
            super(width, height, isMinervaVisualPlugin);
        }

        public get mainElement() {
            return this.element.children("svg");
        }

        public get legendGroup(): JQuery {
            return this.element.children(".legend").children("#legendGroup");
        }

        public get firstLegendText(): JQuery {
            return this.legendGroup.children(".legendItem").first().children(".legendText");
        }

        public get dataLabels(): JQuery {
            return this.mainElement
                .children("g")
                .children("g.labels")
                .children("text.data-labels");
        }

        public get lineLabel(): JQuery {
            return this.mainElement
                .children("g")
                .children("g.lines")
                .children("polyline.line-label");
        }

        protected build() {
            if (this.isMinervaVisualPlugin) {
                return <any>powerbi.visuals.plugins.asterPlot;
            } else {
                return new VisualClass();
            }
        }

        public converter(dataView: DataView, colors: IDataColorPalette): AsterPlotVisualData {
            return VisualClass.converter(dataView, colors);
        }
    }
}
