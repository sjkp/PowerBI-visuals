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
    import KPIStatusWithHistory = powerbi.visuals.KPIStatusWithHistory;
    import kpiCapabilities = powerbi.visuals.KPIStatusWithHistoryCapabilities;
    import IVisualHostServices = powerbi.IVisualHostServices;

    describe("Kpi", () => {
        const viewport: powerbi.IViewport = {
            height: 500,
            width: 500
        };
        let style = powerbi.visuals.visualStyles.create();

        describe("capabilities", () => {

            it("should register capabilities", () => {
                let plugin = powerbi.visuals.plugins.kpi;

                expect(plugin).toBeDefined();
                expect(plugin.capabilities).toBe(kpiCapabilities);
            });
        });

        // ---- Sample data ----

        function buildUpdateOptions(viewport: powerbi.IViewport, object: powerbi.DataView): powerbi.VisualUpdateOptions {
            return {
                viewport: viewport,
                dataViews: [object],
            };
        };

        function getGoalFromGoalText(goal: string) {
            let startIndex = goal.indexOf(": ") + 2;
            let endIndex = goal.indexOf(" (");
            return goal.slice(startIndex, endIndex); 
        }

        describe("", () => {
            let host: IVisualHostServices;
            let $element: JQuery;
            let initOptions: powerbi.VisualInitOptions;
            let kpi: KPIStatusWithHistory;

            beforeEach(() => {
                host = mocks.createVisualHostServices();
                $element = helpers.testDom("500", "500");

                initOptions = {
                    element: $element,
                    host: host,
                    viewport: viewport,
                    style: style
                };

                kpi = new KPIStatusWithHistory();
                kpi.init(initOptions);
            });

            describe("update", () => {
                it("show green trend", () => {
                    let visualUpdateOptions = buildUpdateOptions(viewport, kpiHelper.buildDataViewForGreenTrend());
                    kpi.update(visualUpdateOptions);

                    let area = $element.find('path');
                    helpers.assertColorsMatch(area.css('fill'), "#3bb44a");

                    let text = $element.find('#indicatorText');

                    helpers.assertColorsMatch(text.css('color'), "#3bb44a");
                    expect(text.text()).toBe("25.00");
                });

                it("show red trend", () => {
                    let visualUpdateOptions = buildUpdateOptions(viewport, kpiHelper.buildDataViewForRedTrend());
                    kpi.update(visualUpdateOptions);

                    let area = $element.find('path');
                    helpers.assertColorsMatch(area.css('fill'), "#E81123");

                    let text = $element.find('#indicatorText');

                    helpers.assertColorsMatch(text.css('color'), "#E81123");
                });

                it("show gray trend when no goal defined", () => {
                    let visualUpdateOptions = buildUpdateOptions(viewport, kpiHelper.buildDataViewForNoGoalTrend());
                    kpi.update(visualUpdateOptions);

                    let area = $element.find('path');
                    helpers.assertColorsMatch(area.css('fill'), "#5F6B6D");

                    let text = $element.find('#indicatorText');
                    helpers.assertColorsMatch(text.css('color'), "#212121");
                });

                it("show gray trend when no goal defined after mix of changes", () => {
                    let visualUpdateOptions = buildUpdateOptions(viewport, kpiHelper.buildDataViewForGreenTrend());
                    kpi.update(visualUpdateOptions);

                    visualUpdateOptions = buildUpdateOptions(viewport, kpiHelper.buildDataViewForRedTrend());
                    kpi.update(visualUpdateOptions);

                    visualUpdateOptions = buildUpdateOptions(viewport, kpiHelper.buildDataViewForNoGoalTrend());
                    kpi.update(visualUpdateOptions);

                    let area = $element.find('path');
                    helpers.assertColorsMatch(area.css('fill'), "#5F6B6D");

                    let text = $element.find('#indicatorText');
                    helpers.assertColorsMatch(text.css('color'), "#212121");
                    expect(text.text()).toBe("12.00");
                });

                it("show green trend after mix of changes", () => {
                    let visualUpdateOptions = buildUpdateOptions(viewport, kpiHelper.buildDataViewForRedNoTrend());
                    kpi.update(visualUpdateOptions);

                    visualUpdateOptions = buildUpdateOptions(viewport, kpiHelper.buildDataViewForNoGoalTrend());
                    kpi.update(visualUpdateOptions);

                    visualUpdateOptions = buildUpdateOptions(viewport, kpiHelper.buildDataViewForGreenTrend());
                    kpi.update(visualUpdateOptions);

                    let area = $element.find('path');
                    helpers.assertColorsMatch(area.css('fill'), "#3bb44a");

                    let text = $element.find('#indicatorText');
                    helpers.assertColorsMatch(text.css('color'), "#3bb44a");
                    expect(text.text()).toBe("25.00");
                });

                it("Visual is empty if indicator is missing", () => {
                    let visualUpdateOptions = buildUpdateOptions(viewport, kpiHelper.buildDataViewWithMissingIndicator());
                    kpi.update(visualUpdateOptions);

                    let area = $element.find('path');
                    expect(area.css('visibility')).toBe("hidden");

                    let svg = $element.find('svg');
                    expect(svg.css('visibility')).toBe("hidden");
                });

                it("Visual is empty if indicator is missing WITH GOAL", () => {
                    let visualUpdateOptions = buildUpdateOptions(viewport, kpiHelper.buildDataViewWithMissingIndicatorWITHGoal());
                    kpi.update(visualUpdateOptions);

                    let area = $element.find('path');
                    expect(area.css('visibility')).toBe("hidden");

                    let svg = $element.find('svg');
                    expect(svg.css('visibility')).toBe("hidden");
                });

                it("Visual is empty if trendline is missing", () => {
                    let visualUpdateOptions = buildUpdateOptions(viewport, kpiHelper.buildDataViewWithMissingTrendline());
                    kpi.update(visualUpdateOptions);

                    let area = $element.find('path');
                    expect(area.css('visibility')).toBe("hidden");

                    let svg = $element.find('svg');
                    expect(svg.css('visibility')).toBe("hidden");
                });

                it("Visual is empty if trendline is missing WITH GOAL", () => {
                    let visualUpdateOptions = buildUpdateOptions(viewport, kpiHelper.buildDataViewWithMissingTrendlineWITHGoal());
                    kpi.update(visualUpdateOptions);

                    let area = $element.find('path');
                    expect(area.css('visibility')).toBe("hidden");

                    let svg = $element.find('svg');
                    expect(svg.css('visibility')).toBe("hidden");
                });

                it("Visual is empty if trendline and indicator are missing", () => {
                    let visualUpdateOptions = buildUpdateOptions(viewport, kpiHelper.buildDataViewWithMissingTrendlineAndIndicator());
                    kpi.update(visualUpdateOptions);

                    let area = $element.find('path');
                    expect(area.css('visibility')).toBe("hidden");

                    let svg = $element.find('svg');
                    expect(svg.css('visibility')).toBe("hidden");
                });

                it("Visual is empty if trendline and indicator are missing BUT there are goals", () => {
                    let visualUpdateOptions = buildUpdateOptions(viewport, kpiHelper.buildDataViewWithMissingTrendlineAndIndicatorBUTWithGoals());
                    kpi.update(visualUpdateOptions);

                    let area = $element.find('path');
                    expect(area.css('visibility')).toBe("hidden");

                    let svg = $element.find('svg');
                    expect(svg.css('visibility')).toBe("hidden");
                });

                it("Visual shows yellow trend if between 2 goals", () => {
                    let visualUpdateOptions = buildUpdateOptions(viewport, kpiHelper.buildDataViewForYellowTrend());
                    kpi.update(visualUpdateOptions);

                    let area = $element.find('path');
                    helpers.assertColorsMatch(area.css('fill'), "#F2C811");

                    let text = $element.find('#indicatorText');

                    helpers.assertColorsMatch(text.css('color'), "#F2C811");
                    expect(text.text()).toBe("12.00");
                });

                it("Show indicator percentage with selected precision (decimal places)", () => {
                    let visualUpdateOptions = buildUpdateOptions(viewport, kpiHelper.buildDataViewForGreenTrendWithPercentages());
                    kpi.update(visualUpdateOptions);

                    let indicatorText = $element.find('#indicatorText').text();
                    expect(indicatorText).toBe("78.12346%");
                });

                it("Show goal percentage not influenced by selected precision (decimal places) for indicator", () => {
                    let visualUpdateOptions = buildUpdateOptions(viewport, kpiHelper.buildDataViewForGreenTrendWithPercentages());
                    kpi.update(visualUpdateOptions);

                    let goalText = $element.find('.goalText').text();
                    let decimalPlacesFound = goalText.lastIndexOf('%') - goalText.lastIndexOf('.') - 1;
                    expect(decimalPlacesFound).toBe(2);
                });

                it("Formats indicator as percentage but goal as decimal", () => {
                    let visualUpdateOptions = buildUpdateOptions(viewport, kpiHelper.buildDataViewForPercentagesIndicator());
                    kpi.update(visualUpdateOptions);

                    let indicatorText = $element.find('#indicatorText').text();
                    expect(indicatorText).toBe("78.12%");

                    let goalText = $element.find('.goalText').text();
                    goalText = getGoalFromGoalText(goalText);
                    expect(goalText).toBe("20.00");
                });

                it("Formats indicator as decimal but goal as percentage", () => {
                    let visualUpdateOptions = buildUpdateOptions(viewport, kpiHelper.buildDataViewForPercentagesGoal());
                    kpi.update(visualUpdateOptions);

                    let indicatorText = $element.find('#indicatorText').text();
                    expect(indicatorText).toBe("12.00");

                    let goalText = $element.find('.goalText').text();
                    goalText = getGoalFromGoalText(goalText);
                    expect(goalText).toBe("72.12%");
                });

                it("Show only indicator vs goal when trend axis contains single value", () => {
                    let visualUpdateOptions = buildUpdateOptions(viewport, kpiHelper.buildDataViewForRedTrendWithSingleCategory());
                    kpi.update(visualUpdateOptions);

                    let textContainer = $element.find('.textContainer');
                    let trendLine = $element.find('.kpiVisual path');
                    expect(textContainer.css('display')).toBe('block');
                    expect(trendLine.css('visibility')).toBe('hidden');
                });
            });
        });
    });
}