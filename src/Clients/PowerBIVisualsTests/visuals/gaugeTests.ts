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
    import DataViewTransform = powerbi.data.DataViewTransform;
    import GaugeVisual = powerbi.visuals.Gauge;
    import gaugeVisualCapabilities = powerbi.visuals.gaugeCapabilities;
    import SVGUtil = powerbi.visuals.SVGUtil;

    let sideNumbersVisibleMinHeight: number = 80; // Matches powerbi.visualHost.MobileVisualPluginService.MinHeightGaugeSideNumbersVisible
    let sideNumbersVisibleGreaterThanMinHeight: number = sideNumbersVisibleMinHeight + 1;
    let sideNumbersVisibleSmallerThanMinHeight: number = sideNumbersVisibleMinHeight - 1;
    let sideNumbersVisibleGreaterThanMinHeightString: string = sideNumbersVisibleGreaterThanMinHeight.toString();
    let sideNumbersVisibleSmallerThanMinHeightString: string = sideNumbersVisibleSmallerThanMinHeight.toString();
    let marginsOnSmallViewPort: number = 10; // Matches powerbi.visualHost.MobileVisualPluginService.GaugeMarginsOnSmallViewPort

    class GaugeDataBuilder {
        private _dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [
                {
                    displayName: "col1",
                    roles: { "Y": true },
                    isMeasure: true,
                    objects: { general: { formatString: "$0" } },
                }, {
                    displayName: "col2",
                    roles: { "MinValue": true },
                    isMeasure: true
                }, {
                    displayName: "col3",
                    roles: { "MaxValue": true },
                    isMeasure: true
                }, {
                    displayName: "col4",
                    roles: { "TargetValue": true },
                    isMeasure: true
                }, {
                    displayName: "tooltip",
                    roles: { "Tooltips": true },
                    isMeasure: true
                }]
        };

        public get dataViewMetadata(): powerbi.DataViewMetadata {
            return this._dataViewMetadata;
        }

        public set dataViewMetadata(value: powerbi.DataViewMetadata) {
            this._dataViewMetadata = value;
        }

        private _visual: powerbi.IVisual;

        public get visual(): powerbi.IVisual {
            return this._visual;
        }

        private _element: JQuery;

        public get element(): JQuery {
            return this._element;
        }

        private _height: string;

        public get height(): string {
            return this._height;
        }

        public set height(value: string) {
            this._height = value;

            this.init();
        }

        private _width: string;

        public get width(): string {
            return this._width;
        }

        public set width(value: string) {
            this._width = value;

            this.init();
        }

        private _pluginName: string;

        public get pluginName(): string {
            return this._pluginName;
        }

        public set pluginName(value: string) {
            this._pluginName = value;
        }

        private _hostServices: powerbi.IVisualHostServices;

        public get hostServices(): powerbi.IVisualHostServices {
            return this._hostServices;
        }

        public set hostServices(value: powerbi.IVisualHostServices) {
            this._hostServices = value;
        }

        private _style: powerbi.IVisualStyle;

        public get style(): powerbi.IVisualStyle {
            return this._style;
        }

        private _singleValue: any;

        public get singleValue(): any {
            return this._singleValue;
        }

        public set singleValue(value: any) {
            this._singleValue = value;
        }

        private _categoricalValues: powerbi.DataViewValueColumns;

        public get categoricalValues(): powerbi.DataViewValueColumns {
            return this._categoricalValues;
        }

        public set categoricalValues(value: powerbi.DataViewValueColumns) {
            this._categoricalValues = value;
        }

        private _values: any[] = [];

        public get values(): any[] {
            return this._values;
        }

        public set values(value: any[]) {
            this._values = value;

            this.buildCategorialValues();
        }

        private _isMobile: boolean = false;

        public get isMobile(): boolean {
            return this._isMobile;
        }

        public set isMobile(value: boolean) {
            this._isMobile = value;

            this.init();
        }

        private _dataView: powerbi.DataView;

        public get dataView(): powerbi.DataView {
            if (!this._dataView) {
                this.buildDataView();
            }

            return this._dataView;
        }

        public get reader(): powerbi.data.IDataViewCategoricalReader {
            return powerbi.data.createIDataViewCategoricalReader(this.dataView);
        }

        constructor(pluginName: string, height: string = "500", width: string = "500", isMobile: boolean = false) {
            this._pluginName = pluginName;
            this._height = height;
            this._width = width;

            this.init();
        }

        private init() {
            this._element = powerbitests.helpers.testDom(this.height, this.width);

            this.buildVisual();

            this._hostServices = powerbitests.mocks.createVisualHostServices();
            this._style = powerbi.visuals.visualStyles.create();

            this.visualInit();
        }

        private buildVisual() {
            if (this.isMobile) {
                this._visual = new powerbi.visuals.Gauge({
                    gaugeSmallViewPortProperties: {
                        hideGaugeSideNumbersOnSmallViewPort: true,
                        smallGaugeMarginsOnSmallViewPort: true,
                        MinHeightGaugeSideNumbersVisible: sideNumbersVisibleMinHeight,
                        GaugeMarginsOnSmallViewPort: marginsOnSmallViewPort,
                    }
                });
            } else {
                this._visual = new powerbi.visuals.Gauge();
            }
        }

        private buildCategorialValues() {
            let categorialValues: any[] = [];

            for (let i = 0; i < this.values.length; i++) {
                let categorialValue = {
                    source: this.dataViewMetadata.columns[i],
                    values: this.values[i]
                };

                categorialValues.push(categorialValue);
            }

            this._categoricalValues = DataViewTransform.createValueColumns(categorialValues);
        }

        public visualInit() {
            this.visual.init({
                element: this.element,
                host: this.hostServices,
                style: this.style,
                viewport: {
                    height: this.element.height(),
                    width: this.element.width()
                },
                animation: { transitionImmediate: true }
            });
        }

        public buildDataView() {
            this._dataView = {
                metadata: this.dataViewMetadata,
                single: { value: this.singleValue },
                categorical: {
                    values: this.categoricalValues
                }
            };
        }

        public onDataChanged() {
            this.visual.onDataChanged({
                dataViews: [this.dataView]
            });
        }
    }

    class GaugeVisualDataBuilder extends GaugeDataBuilder {
        public get gauge() {
            return <GaugeVisual>this.visual;
        }

        private _warningSpy;

        public get warningSpy() {
            return this._warningSpy;
        }

        constructor(pluginName: string) {
            super(pluginName);

            this._warningSpy = jasmine.createSpy("warning");
            this.hostServices.setWarnings = this.warningSpy;

            this.initGaugeSpy();
        }

        private initGaugeSpy() {
            spyOn(this.gauge, "getGaugeVisualProperties").and.callThrough();
            spyOn(this.gauge, "getAnimatedNumberProperties").and.callThrough();
            spyOn(this.gauge, "drawViewPort").and.callThrough();
        }

        public onDataChanged() {
            this.gauge.onDataChanged({
                dataViews: [this.dataView]
            });
        }

        public onResizing(height: number, width: number) {
            this.gauge.onResizing({
                height: height,
                width: width
            });
        }
    }
    
    const DefaultFillColor = '#00B8AA';
    const DefaultTargetColor = '#666666';
    
    describe("Gauge", () => {
        beforeEach(() => {
            powerbitests.mocks.setLocale();
        });

        it("Capabilities should include dataViewMappings", () => {
            expect(gaugeVisualCapabilities.dataViewMappings).toBeDefined();
        });

        it("Capabilities should include dataRoles", () => {
            expect(gaugeVisualCapabilities.dataRoles).toBeDefined();
        });

        it("Capabilities should not suppressDefaultTitle", () => {
            expect(gaugeVisualCapabilities.suppressDefaultTitle).toBeUndefined();
        });

        it("Capabilities should include dataRoles", () => {
            expect(gaugeVisualCapabilities.dataRoles).toBeDefined();
        });

        it("FormatString property should match calculated", () => {
            expect(powerbi.data.DataViewObjectDescriptors.findFormatString(gaugeVisualCapabilities.objects)).toEqual(GaugeVisual.formatStringProp);
        });
    });

    describe("Gauge.getFormatter", () => {
        let gaugeDataBuilder: GaugeDataBuilder;
        let GaugeMock = {
            data: {
                metadataColumn: null
            }
        };

        beforeEach(() => {
            gaugeDataBuilder = new GaugeDataBuilder("gauge");
        });

        let getFormatter: (data: powerbi.visuals.VisualDataLabelsSettings, metadata: powerbi.DataViewMetadataColumn, max?: number)
            => powerbi.visuals.IValueFormatter = (<any>powerbi.visuals.Gauge).prototype.getFormatter.bind(GaugeMock);

        it("Uses the formatter based on metadata parrameter", () => {
            gaugeDataBuilder.singleValue = 200;
            gaugeDataBuilder.values = [[0], [0], [0], [0]];
            let metadata =  gaugeDataBuilder.reader.getValueMetadataColumn(powerbi.visuals.gaugeRoleNames.y);
            let settings = powerbi.visuals.dataLabelUtils.getDefaultGaugeLabelSettings();
            metadata.objects = { general: { formatString: "$0.00" } };

            let formatter = getFormatter(settings, metadata);

            expect(formatter.format(23)).toEqual("$23.00");

        });

        it("Uses default metadata formatter.", () => {
            gaugeDataBuilder.singleValue = 200;
            gaugeDataBuilder.values = [[0], [0], [0], [0]];
            let metadata = gaugeDataBuilder.reader.getValueMetadataColumn(powerbi.visuals.gaugeRoleNames.y);
            let settings = powerbi.visuals.dataLabelUtils.getDefaultGaugeLabelSettings();
            metadata.objects = { general: { formatString: "$0.00" } };
            GaugeMock.data.metadataColumn = metadata;

            let formatter = getFormatter(settings, null);

            expect(formatter.format(23)).toEqual("$23.00");

        });
    });

    describe("Gauge DOM tests", () => {
        let gaugeDataBuilder: GaugeDataBuilder;

        beforeEach(() => {
            gaugeDataBuilder = new GaugeDataBuilder("gauge");
        });

        it("Zero values do not draw draw NaN target lines", (done) => {
            gaugeDataBuilder.singleValue = 0;
            gaugeDataBuilder.values = [[0], [0], [0], [0]];

            gaugeDataBuilder.onDataChanged();

            setTimeout(() => {
                $('.gauge').find('line').map((i: number, element: Element) => helpers.verifyPositionAttributes($(element)));
                helpers.verifyPositionAttributes($('.targetConnector'));
                helpers.verifyPositionAttributes($('.targetText'));

                done();
            }, DefaultWaitForRender);
        });

        it("Ensure min & target dont overlap", (done) => {
            gaugeDataBuilder.singleValue = 10;
            gaugeDataBuilder.values = [[10], [0], [300], [0]];

            gaugeDataBuilder.onDataChanged();

            setTimeout(() => {
                let targetText = $(".targetText");
                let maxLabel = $($(".labelText")[0]);
                expect(targetText.length).toBe(1);

                let xyTarget = { x: targetText.attr("x"), y: targetText.attr("y") };
                let xyMaxlabel = { x: maxLabel.attr("x"), y: maxLabel.attr("y") };

                expect(xyTarget.x).not.toEqual(xyMaxlabel.x);
                expect(xyTarget.y).not.toEqual(xyMaxlabel.y);
                done();

            }, DefaultWaitForRender);
        });

        it("Ensure max & target dont overlap", (done) => {
            gaugeDataBuilder.singleValue = 10;
            gaugeDataBuilder.values = [[10], [0], [300], [300]];

            gaugeDataBuilder.onDataChanged();

            setTimeout(() => {
                let targetText = $(".targetText");
                let maxLabel = $($(".labelText")[1]);
                expect(targetText.length).toBe(1);

                let xyTarget = { x: targetText.attr("x"), y: targetText.attr("y") };
                let xyMaxlabel = { x: maxLabel.attr("x"), y: maxLabel.attr("y") };

                expect(xyTarget.x).not.toEqual(xyMaxlabel.x);
                expect(xyTarget.y).not.toEqual(xyMaxlabel.y);
                done();

            }, DefaultWaitForRender);
        });

        it("Ensure min & max dont overlap", (done) => {
            gaugeDataBuilder.singleValue = 10;
            gaugeDataBuilder.dataViewMetadata.objects = {
                labels: {
                    show: true,
                    labelPrecision: 50,
                    labelDisplayUnits: 1000
                }
            };
            gaugeDataBuilder.values = [[10], [0], [300], [0]];
            gaugeDataBuilder.onDataChanged();

            setTimeout(() => {
                let minLabel = $(".labelText")[0];
                let maxLabel = $(".labelText")[1];

                let positionMinlabel = minLabel.getBoundingClientRect();
                let positionMaxlabel = maxLabel.getBoundingClientRect();

                expect(positionMinlabel.right < positionMaxlabel.left).toBeTruthy();
                expect(positionMinlabel.bottom).toEqual(positionMaxlabel.bottom);
                done();

            }, DefaultWaitForRender);
        });

        it("Check Gauge DOM", (done) => {
            gaugeDataBuilder.singleValue = 10;
            gaugeDataBuilder.values = [[10], [0], [300], [200]];

            gaugeDataBuilder.onDataChanged();

            setTimeout(() => {    
                // Check Arc Drawn
                let backgroundArc = $(".backgroundArc");
                let foregroundArc = $(".foregroundArc");

                expect(backgroundArc.length).toBe(1);
                expect(backgroundArc.attr("d")).toBeDefined();

                expect(foregroundArc.length).toBe(1);
                expect(foregroundArc.attr("d")).toBeDefined();

                expect($(".mainText").length).toBe(1);
                expect($(".mainText").text()).toEqual("$10");

                let translateString = $(".animatedNumber").attr("transform");
                let xy = SVGUtil.parseTranslateTransform(translateString);
                expect(xy.x).toBeGreaterThan(120);
                expect(xy.y).toBeGreaterThan(220);

                done();
            }, DefaultWaitForRender);
        });

        it("If value less than zero, then scale should be 0-1, but number should show negative value", (done) => {
            gaugeDataBuilder.values = [[-25]];

            gaugeDataBuilder.onDataChanged();

            setTimeout(() => {
                let backgroundArc = $(".backgroundArc");
                let foregroundArc = $(".foregroundArc");

                expect(backgroundArc.length).toBe(1);
                expect(backgroundArc.attr("d")).toBeDefined();

                expect(foregroundArc.length).toBe(1);
                expect(foregroundArc.attr("d")).toBeDefined();

                let textLabels: JQuery = $(".labelText");

                expect(textLabels.length).toBe(2);
                expect(helpers.findElementText(textLabels)).toEqual("-$50");
                expect(helpers.findElementText(textLabels.eq(1))).toEqual("$0");

                //check titles
                expect(helpers.findElementTitle(textLabels)).toEqual("-$50");
                expect(helpers.findElementTitle(textLabels.eq(1))).toEqual("$0");

                expect($(".mainText").length).toBe(1);
                expect($(".mainText").text()).toEqual("-$25");
                done();

            }, DefaultWaitForRender);
        });

        it("Formatting: dataLabels=off, calloutValue=off", (done) => {
            gaugeDataBuilder.singleValue = 10;
            gaugeDataBuilder.values = [[10], [0], [300], [0]];
            gaugeDataBuilder.dataViewMetadata.objects = {
                labels: {
                    show: false
                },
                calloutValue: {
                    show: false
                }
            };
            gaugeDataBuilder.buildDataView();
            gaugeDataBuilder.onDataChanged();
            setTimeout(() => {    
                //Callout value
                expect($(".mainText").length).toBe(0);
                
                //Data labels
                expect($(".labelText").length).toBe(0);
                done();
            }, DefaultWaitForRender);
        });

        it("Formatting: dataLabels=on, calloutValue=on, textSize", (done) => {
            gaugeDataBuilder.singleValue = 10;
            gaugeDataBuilder.values = [[10], [0], [300], [0]];
            gaugeDataBuilder.dataViewMetadata.objects = {
                labels: {
                    show: true,
                    fontSize: '15'
                },
                calloutValue: {
                    show: true,
                    fontSize: '15'
                }
            };
            gaugeDataBuilder.buildDataView();
            gaugeDataBuilder.onDataChanged();
            setTimeout(() => {
                //Data labels
                expect($(".labelText").css("font-size")).toBe("20px");
                done();
            }, DefaultWaitForRender);
        });

        it("Formatting: dataLabels=on, calloutValue=on", (done) => {
            gaugeDataBuilder.singleValue = 20;
            gaugeDataBuilder.values = [[20], [0], [400], [0]];
            gaugeDataBuilder.dataViewMetadata.objects = {
                labels: {
                    show: true,
                    color: { solid: { color: '#0000cc' } }
                },
                calloutValue: {
                    show: true,
                    color: { solid: { color: '#000000' } }
                }
            };
            gaugeDataBuilder.buildDataView();
            gaugeDataBuilder.onDataChanged();
            setTimeout(() => {
                //Callout value
                let mainText = $(".mainText");
                expect(mainText.length).toBe(1);

                let color = $(mainText).css("fill");
                helpers.assertColorsMatch(color, "#000000");

                //Data labels
                let labels = $(".labelText");
                expect(labels.length).toBe(2);

                color = $(labels[0]).css("fill");
                helpers.assertColorsMatch(color, "#0000cc");
                done();
            }, DefaultWaitForRender);
        });

        it("Formatting: dataLabels=on,units=auto, calloutValue=on,units=1000", (done) => {
            gaugeDataBuilder.singleValue = 10;
            gaugeDataBuilder.values = [[1000000], [0], [3000], [0]];
            gaugeDataBuilder.dataViewMetadata.objects = {
                labels: {
                    show: true,
                    labelDisplayUnits: 0
                },
                calloutValue: {
                    show: true,
                    labelPrecision: 2,
                    labelDisplayUnits: 1000
                }
            };
            gaugeDataBuilder.buildDataView();
            gaugeDataBuilder.onDataChanged();
            setTimeout(() => {
                //Callout value
                expect($(".mainText").text()).toBe("$1000.00K");
                
                //Data labels
                let textLabels: JQuery = $(".labelText");

                expect(helpers.findElementText(textLabels)).toEqual("$0");
                expect(helpers.findElementText(textLabels.eq(1))).toEqual("$3000");
                //check titles
                expect(helpers.findElementTitle(textLabels)).toEqual("$0");
                expect(helpers.findElementTitle(textLabels.eq(1))).toEqual("$3000");
                done();
            }, DefaultWaitForRender);
        });

        it("Formatting: dataLabels=on, calloutValue=on, scientific number", (done) => {
            gaugeDataBuilder.dataViewMetadata.columns[0].objects = {
                general: { formatString: "0.00" }
            };

            gaugeDataBuilder.values = [[500000000000000], [0], [1000000000000001], [0]];
            gaugeDataBuilder.dataViewMetadata.objects = {
                labels: {
                    show: true,
                    labelPrecision: 0
                },
                calloutValue: {
                    show: true,
                    labelPrecision: 0
                }
            };
            gaugeDataBuilder.buildDataView();
            gaugeDataBuilder.onDataChanged();
            setTimeout(() => {
                //Callout value
                expect($(".mainText").text()).toBe("500T");

                //Data labels
                let textLabels: JQuery = $(".labelText");

                expect(helpers.findElementText(textLabels)).toEqual("0T");
                expect(helpers.findElementText(textLabels.eq(1))).toEqual("1E+15");
                //check titles
                expect(helpers.findElementTitle(textLabels)).toEqual("0T");
                expect(helpers.findElementText(textLabels.eq(1))).toEqual("1E+15");
                done();
            }, DefaultWaitForRender);
        });
        
        it("Formatting: Currency format shows scientific notation", (done) => {
            let dataViewMetadata: powerbi.DataViewMetadata = {
                    columns: [{
                    displayName: "col1",
                    roles: { "Y": true },
                    isMeasure: true,
                    objects: { general: { formatString: '"$"#,##0.00' } }
                }],
            };

            gaugeDataBuilder.dataViewMetadata = dataViewMetadata;
            gaugeDataBuilder.singleValue = 563732228000000;
            gaugeDataBuilder.values = [[563732228000000]];
            gaugeDataBuilder.buildDataView();

            let data = GaugeVisual.converter(gaugeDataBuilder.reader);
            expect(data.targetSettings.min).toEqual(0);
            expect(data.targetSettings.max).toEqual(1127464456000000);
            expect(data.targetSettings.target).toBe(null);

            gaugeDataBuilder.onDataChanged();

            setTimeout(() => {
                //Callout value
                expect($(".mainText").text()).toBe("$563.73T");
                
                //Data labels
                let textLabels: JQuery = $(".labelText");

                expect(helpers.findElementText(textLabels)).toEqual("$0.00T");
                expect(helpers.findElementText(textLabels.eq(1))).toEqual("$1,127.46T");
                //check titles
                expect(helpers.findElementTitle(textLabels)).toEqual("$0.00T");
                expect(helpers.findElementTitle(textLabels.eq(1))).toEqual("$1,127.46T");
                done();
            }, DefaultWaitForRender);
        });
        
        it("Verify correct arc fill color", (done) => {
            
            gaugeDataBuilder.singleValue = 20;
            gaugeDataBuilder.values = [[20], [0], [400], [0]];
            gaugeDataBuilder.dataViewMetadata.objects = {
                dataPoint: {
                    fill: { solid: { color: '#FE9666' } }
                }
            };
            gaugeDataBuilder.buildDataView();
            gaugeDataBuilder.onDataChanged();
            setTimeout(() => {
                let foregroundArc = $(".foregroundArc");
                let foregroundColor = $(foregroundArc).css("fill");
                helpers.assertColorsMatch(foregroundColor, "#FE9666");

                let backgroundArc = $(".backgroundArc");
                let backgroundColor = $(backgroundArc).css("fill");
                helpers.assertColorsMatch(backgroundColor, "#e9e9e9");

                done();
            }, DefaultWaitForRender);
         });
         
          it("Verify correct target color", (done) => {
            
            gaugeDataBuilder.singleValue = 20;
            gaugeDataBuilder.values = [[20], [0], [400], [0]];
            gaugeDataBuilder.dataViewMetadata.objects = {
                dataPoint: {
                    target: { solid: { color: '#FE9666' } }
                }
            };
            gaugeDataBuilder.buildDataView();
            gaugeDataBuilder.onDataChanged();
            setTimeout(() => {
                let targetLine = $("line");
                let targetcolor = $(targetLine).css("stroke");
                helpers.assertColorsMatch(targetcolor, "#FE9666");

                done();
            }, DefaultWaitForRender);
         });
    });

    describe("Gauge Data Tests", () => {
        let gaugeDataBuilder: GaugeDataBuilder;
        let GaugeMock = {
            data: null,
            isValid: (<any>GaugeVisual.prototype).isValid
        };

        let getValueAngle = GaugeVisual.prototype.getValueAngle.bind(GaugeMock);

        beforeEach(() => {
            powerbitests.mocks.setLocale();

            gaugeDataBuilder = new GaugeDataBuilder("gauge");

            gaugeDataBuilder.dataViewMetadata.columns[3].objects = {
                general: { formatString: "$0" }
            };
        });

        it("Gauge registered capabilities", () => {
            expect(powerbi.visuals.plugins.gauge.capabilities).toBe(gaugeVisualCapabilities);
        });

        it("FormatString property should match calculated", () => {
            expect(powerbi.data.DataViewObjectDescriptors.findFormatString(gaugeVisualCapabilities.objects)).toEqual(GaugeVisual.formatStringProp);
        });

        it("Gauge_greaterThanMax", () => {
            gaugeDataBuilder.singleValue = 500;
            gaugeDataBuilder.values = [[500], [0], [300], [200]];

            gaugeDataBuilder.onDataChanged();
            
            GaugeMock.data = GaugeVisual.converter(gaugeDataBuilder.reader);
            expect(getValueAngle()).toBe(1);
        });

        it("Gauge_smallerThanMin", () => {
            gaugeDataBuilder.singleValue = -3;
            gaugeDataBuilder.values = [[-3], [0], [300], [200]];

            gaugeDataBuilder.onDataChanged();
            GaugeMock.data = GaugeVisual.converter(gaugeDataBuilder.reader);
            expect(getValueAngle()).toBe(0);
        });

        it("Gauge_betweenMinMax", () => {
            gaugeDataBuilder.singleValue = 200;
            gaugeDataBuilder.values = [[200], [100], [300], [200]];

            gaugeDataBuilder.onDataChanged();
            GaugeMock.data = GaugeVisual.converter(gaugeDataBuilder.reader);
            expect(getValueAngle()).toBe(0.5);
        });

        it("Gauge_Nulls", () => {
            gaugeDataBuilder.singleValue = null;
            gaugeDataBuilder.values = [[null], [null], [null], [null]];

            gaugeDataBuilder.onDataChanged();

            let data = GaugeVisual.converter(gaugeDataBuilder.reader);
            GaugeMock.data = GaugeVisual.converter(gaugeDataBuilder.reader);
            expect(getValueAngle()).toBe(0);
            expect(data.targetSettings).toEqual({
                min: null,
                max: null,
                target: null,
            });
        });

        it("Gauge_tooltip_work", () => {
            gaugeDataBuilder.singleValue = 500;
            gaugeDataBuilder.values = [[10], [0], [500], [200], [120]];
            gaugeDataBuilder.onDataChanged();

            let data = GaugeVisual.converter(gaugeDataBuilder.reader);
            let expectedValues = {
                total: 10,
                metadataColumn: gaugeDataBuilder.dataViewMetadata.columns[0],
                minColumnMetadata: gaugeDataBuilder.dataViewMetadata.columns[1],
                maxColumnMetadata: gaugeDataBuilder.dataViewMetadata.columns[2],
                targetColumnMetadata: gaugeDataBuilder.dataViewMetadata.columns[3],
                targetSettings: {
                    min: 0,
                    max: 500,
                    target: 200
                },
                tooltipInfo: [{ displayName: "col1", value: "$10" }, { displayName: "col4", value: "$200" }, { displayName: "tooltip", value: "120" }],
                dataLabelsSettings: {
                    show: true,
                    displayUnits: 0,
                    precision: undefined,
                    labelColor: null,
                    position: null,
                    fontSize: 8,
                }, calloutValueLabelsSettings: {
                    show: true,
                    displayUnits: 0,
                    precision: undefined,
                    labelColor: null,
                    position: null,
                    fontSize: 8,
                }, dataPointSettings: {
                    fillColor: DefaultFillColor,
                    targetColor: DefaultTargetColor
                }
            };
            expect(data).toEqual(expectedValues);
        });

        it("Gauge_noValue_tooltip_work", () => {
            gaugeDataBuilder.singleValue = 500;
            gaugeDataBuilder.values = [[null], [0], [500], [200]];
            gaugeDataBuilder.onDataChanged();

            let data = GaugeVisual.converter(gaugeDataBuilder.reader);
            let expectedValues: powerbi.visuals.GaugeData = {
                total: null,
                metadataColumn: gaugeDataBuilder.dataViewMetadata.columns[0],
                minColumnMetadata: gaugeDataBuilder.dataViewMetadata.columns[1],
                maxColumnMetadata: gaugeDataBuilder.dataViewMetadata.columns[2],
                targetColumnMetadata: gaugeDataBuilder.dataViewMetadata.columns[3],
                targetSettings: {
                    min: 0,
                    max: 500,
                    target: 200
                },
                tooltipInfo: [{ displayName: "col1", value: "(Blank)"}, { displayName: "col4", value: "$200" }],
                dataLabelsSettings: {
                    show: true,
                    displayUnits: 0,
                    precision: undefined,
                    labelColor: null,
                    position: null,
                    fontSize: 8,
                }, calloutValueLabelsSettings: {
                    show: true,
                    displayUnits: 0,
                    precision: undefined,
                    labelColor: null,
                    position: null,
                    fontSize: 8,
                }, dataPointSettings: {
                    fillColor: DefaultFillColor,
                    targetColor: DefaultTargetColor
                }
            };
            expect(data).toEqual(expectedValues);
        });

        it("Gauge_noTarget_tooltip_work", () => {
            gaugeDataBuilder.singleValue = 500;
            gaugeDataBuilder.values = [[10], [0], [500], [null]];
            gaugeDataBuilder.onDataChanged();

            let data = GaugeVisual.converter(gaugeDataBuilder.reader);
            let expectedValues = {
                total: 10,
                minColumnMetadata: gaugeDataBuilder.dataViewMetadata.columns[1],
                maxColumnMetadata: gaugeDataBuilder.dataViewMetadata.columns[2],
                targetColumnMetadata: gaugeDataBuilder.dataViewMetadata.columns[3],
                metadataColumn: gaugeDataBuilder.dataViewMetadata.columns[0],
                targetSettings: {
                    min: 0,
                    max: 500,
                    target: null
                },
                tooltipInfo: [{ displayName: "col1", value: "$10" }, { displayName: "col4", value: "(Blank)" }],
                dataLabelsSettings: {
                    show: true,
                    displayUnits: 0,
                    precision: undefined,
                    labelColor: null,
                    position: null,
                    fontSize: 8,
                }, calloutValueLabelsSettings: {
                    show: true,
                    displayUnits: 0,
                    precision: undefined,
                    labelColor: null,
                    position: null,
                    fontSize: 8,
                }, dataPointSettings: {
                    fillColor: DefaultFillColor,
                    targetColor: undefined
                }
            };
            expect(data).toEqual(expectedValues);
        });

        it("Gauge_Nulls_Tooltip_Data", () => {
            gaugeDataBuilder.singleValue = null;
            gaugeDataBuilder.values = [[null], [null], [null], [null], [null]];

            gaugeDataBuilder.onDataChanged();

            let data = GaugeVisual.converter(gaugeDataBuilder.reader);
            let expectedValues = {
                total: null,
                minColumnMetadata: gaugeDataBuilder.dataViewMetadata.columns[1],
                maxColumnMetadata: gaugeDataBuilder.dataViewMetadata.columns[2],
                targetColumnMetadata: gaugeDataBuilder.dataViewMetadata.columns[3],
                metadataColumn: gaugeDataBuilder.dataViewMetadata.columns[0],
                targetSettings: { min: null, max: null, target: null },
                tooltipInfo: [{ displayName: "col1", value: "(Blank)" }, { displayName: "col4", value: "(Blank)" }],
                dataLabelsSettings: {
                    show: true,
                    displayUnits: 0,
                    precision: undefined,
                    labelColor: null,
                    position: null,
                    fontSize: 8,
                }, calloutValueLabelsSettings: {
                    show: true,
                    displayUnits: 0,
                    precision: undefined,
                    labelColor: null,
                    position: null,
                    fontSize: 8,
                }, dataPointSettings: {
                    fillColor: DefaultFillColor,
                    targetColor: undefined
                }
            };
            expect(data).toEqual(expectedValues);
        });

        it("Gauge_onlyMin&Max_Tooltip_Data", () => {
            gaugeDataBuilder.singleValue = null;
            gaugeDataBuilder.values = [[null], [100], [300], [null], [120]];

            gaugeDataBuilder.onDataChanged();

            let data = GaugeVisual.converter(gaugeDataBuilder.reader);
            let expectedValues = {
                minColumnMetadata: gaugeDataBuilder.dataViewMetadata.columns[1],
                maxColumnMetadata: gaugeDataBuilder.dataViewMetadata.columns[2],
                targetColumnMetadata: gaugeDataBuilder.dataViewMetadata.columns[3],
                total: null,
                metadataColumn: gaugeDataBuilder.dataViewMetadata.columns[0],
                targetSettings: { min: 100, max: 300, target: null },
                tooltipInfo: [{ displayName: "col1", value: "(Blank)" }, { displayName: "col4", value: "(Blank)" }, { displayName: "tooltip", value: "120" }],
                dataLabelsSettings: {
                    show: true,
                    displayUnits: 0,
                    precision: undefined,
                    labelColor: null,
                    position: null,
                    fontSize: 8,
                }, calloutValueLabelsSettings: {
                    show: true,
                    displayUnits: 0,
                    precision: undefined,
                    labelColor: null,
                    position: null,
                    fontSize: 8,
                }, dataPointSettings: {
                    fillColor: DefaultFillColor,
                    targetColor: undefined
                }
            };
            expect(data).toEqual(expectedValues);
        });

        it("Gauge_betweenMinMax_Tooltip_Data", () => {
            gaugeDataBuilder.singleValue = 200;
            gaugeDataBuilder.values = [[200], [100], [300], [200]];

            gaugeDataBuilder.onDataChanged();

            let data = GaugeVisual.converter(gaugeDataBuilder.reader);
            let expectedValues = {
                total: 200,
                minColumnMetadata: gaugeDataBuilder.dataViewMetadata.columns[1],
                maxColumnMetadata: gaugeDataBuilder.dataViewMetadata.columns[2],
                targetColumnMetadata: gaugeDataBuilder.dataViewMetadata.columns[3],
                metadataColumn: {
                    displayName: "col1",
                    roles: { Y: true },
                    isMeasure: true,
                    objects: { general: { formatString: "$0" } },
                },
                targetSettings: { min: 100, max: 300, target: 200 },
                tooltipInfo: [{ displayName: "col1", value: "$200" }, { displayName: "col4", value: "$200" }],
                dataLabelsSettings: {
                    show: true,
                    displayUnits: 0,
                    precision: undefined,
                    labelColor: null,
                    position: null,
                    fontSize: 8,
                }, calloutValueLabelsSettings: {
                    show: true,
                    displayUnits: 0,
                    precision: undefined,
                    labelColor: null,
                    position: null,
                    fontSize: 8,
                }, dataPointSettings: {
                    fillColor: DefaultFillColor,
                    targetColor: DefaultTargetColor
                }
            };

            expect(data).toEqual(expectedValues);
        });

        it("Gauge_formatting_min_max_target", () => {    
            // 1
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    {
                        displayName: "col1",
                        roles: { "Y": true },
                        isMeasure: true,
                        objects: { general: { formatString: "$0" } },
                    }, {
                        displayName: "col2",
                        roles: { "MinValue": true },
                        isMeasure: true
                    }, {
                        displayName: "col3",
                        roles: { "MaxValue": true },
                        isMeasure: true
                    }, {
                        displayName: "col4",
                        roles: { "TargetValue": true },
                        isMeasure: true
                    }],
                objects: {
                    axis: {
                        min: 1000,
                        max: 300000,
                        target: 12300
                    }
                }
            };

            gaugeDataBuilder.dataViewMetadata = dataViewMetadata;
            gaugeDataBuilder.singleValue = 500;
            gaugeDataBuilder.values = [[10], [0], [500], [200]];
            gaugeDataBuilder.buildDataView();

            // Values should not be overrided
            let data = GaugeVisual.converter(gaugeDataBuilder.reader);
            expect(data.targetSettings.min).toEqual(0);
            expect(data.targetSettings.max).toEqual(500);
            expect(data.targetSettings.target).toEqual(200);

            // 2
            dataViewMetadata = {
                columns: [
                    {
                        displayName: "col1",
                        roles: { "Y": true },
                        isMeasure: true,
                        objects: { general: { formatString: "$0" } },
                    }],
                objects: {
                    axis: {
                        min: 10,
                        max: 1000,
                        target: 300
                    }
                }
            };

            gaugeDataBuilder.dataViewMetadata = dataViewMetadata;
            gaugeDataBuilder.singleValue = 10;
            gaugeDataBuilder.values = [[10]];
            gaugeDataBuilder.buildDataView();

            // All values should be overrided
            data = GaugeVisual.converter(gaugeDataBuilder.reader);
            expect(data.targetSettings.min).toEqual(10);
            expect(data.targetSettings.max).toEqual(1000);
            expect(data.targetSettings.target).toEqual(300);

            // 3
            dataViewMetadata = {
                columns: [
                    {
                        displayName: "col1",
                        roles: { "Y": true },
                        isMeasure: true,
                        objects: { general: { formatString: "$0" } },
                    }, {
                        displayName: "col2",
                        roles: { "MinValue": true },
                        isMeasure: true
                    },
                ],
                objects: {
                    axis: {
                        min: 10,
                        max: 1000,
                        target: 300
                    }
                }
            };

            gaugeDataBuilder.dataViewMetadata = dataViewMetadata;
            gaugeDataBuilder.singleValue = 10;
            gaugeDataBuilder.values = [[10], [0]];
            gaugeDataBuilder.buildDataView();

            // All except Min value should be overrided
            data = GaugeVisual.converter(gaugeDataBuilder.reader);
            expect(data.targetSettings.min).toEqual(0);
            expect(data.targetSettings.max).toEqual(1000);
            expect(data.targetSettings.target).toEqual(300);

            // 4
            dataViewMetadata = {
                columns: [
                    {
                        displayName: "col1",
                        roles: { "Y": true },
                        isMeasure: true,
                        objects: { general: { formatString: "$0" } },
                    }, {
                        displayName: "col2",
                        roles: { "MinValue": true },
                        isMeasure: true
                    }, {
                        displayName: "col4",
                        roles: { "TargetValue": true },
                        isMeasure: true
                    }],
                objects: {
                    axis: {
                        min: 10,
                        max: 1000,
                        target: 300
                    }
                }
            };

            gaugeDataBuilder.dataViewMetadata = dataViewMetadata;
            gaugeDataBuilder.singleValue = 10;
            gaugeDataBuilder.values = [[10], [0], [100]];
            gaugeDataBuilder.buildDataView();

            // Only Max value should be overrided
            data = GaugeVisual.converter(gaugeDataBuilder.reader);
            expect(data.targetSettings.min).toEqual(0);
            expect(data.targetSettings.max).toEqual(1000);
            expect(data.targetSettings.target).toEqual(100);
        });
         
        describe("Gauge Rendering Tests", () => {
            let gaugeVisualDataBuilder: GaugeVisualDataBuilder;

            beforeEach(() => {
                gaugeDataBuilder = new GaugeDataBuilder("gauge");
                gaugeDataBuilder.singleValue = 10;
                gaugeDataBuilder.values = [[10], [0], [300], [200]];

                gaugeVisualDataBuilder = new GaugeVisualDataBuilder("gauge");

                gaugeVisualDataBuilder.dataViewMetadata.columns[3].objects = {
                    general: { formatString: "$0" }
                };

                gaugeVisualDataBuilder.singleValue = 10;
                gaugeVisualDataBuilder.values = [[10], [0], [300], [200]];
            });

            it("Get_Animated_Number_Properties works", () => {
                let expectedNumberProperty = {
                    transformString: "translate(0.2928932188134524,0.29289321881345254)",
                    viewport: {
                        "height": 0.7071067811865475,
                        "width": 1.4142135623730951
                    }
                };

                let animatedNumberProperty = gaugeVisualDataBuilder.gauge.getAnimatedNumberProperties(1, 1, 1, 1);
                expect(animatedNumberProperty).toEqual(expectedNumberProperty);
            });

            it("Get_Viewport_Properties works", () => {
                let innerRadiusFactor = 0.7;
                let width = parseFloat(gaugeVisualDataBuilder.width);
                let height = parseFloat(gaugeVisualDataBuilder.height);
                let radius = width / 2;
                let left = height / 2;
                let top = radius + (height - radius) / 2; 
                
                let expectedViewPortProperty = {
                    radius: radius,
                    innerRadiusOfArc: radius * innerRadiusFactor,
                    left: left,
                    top: top,
                    height: height,
                    width: width,
                    transformString: "translate(" + left + "," + top + ")",
                    innerRadiusFactor: 0.7,
                    margin: {
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0
                    }
                };

                let viewPortProperty = gaugeVisualDataBuilder.gauge.getGaugeVisualProperties();
                expect(viewPortProperty).toEqual(expectedViewPortProperty);
            });

            it("NaN in values shows a warning", (done) => {
                gaugeVisualDataBuilder.values = [[10], [0], [NaN, 1], [200]];
                gaugeVisualDataBuilder.onDataChanged();

                setTimeout(() => {
                    expect(gaugeVisualDataBuilder.warningSpy).toHaveBeenCalled();
                    expect(gaugeVisualDataBuilder.warningSpy.calls.count()).toBe(1);
                    expect(gaugeVisualDataBuilder.warningSpy.calls.argsFor(0)[0][0].code).toBe("NaNNotSupported");
                    done();

                }, DefaultWaitForRender);
            });

            it("Negative Infinity in values shows a warning", (done) => {
                gaugeVisualDataBuilder.values = [[10], [0], [Number.NEGATIVE_INFINITY], [200]];
                gaugeVisualDataBuilder.onDataChanged();

                setTimeout(() => {
                    expect(gaugeVisualDataBuilder.warningSpy).toHaveBeenCalled();
                    expect(gaugeVisualDataBuilder.warningSpy.calls.count()).toBe(1);
                    expect(gaugeVisualDataBuilder.warningSpy.calls.argsFor(0)[0][0].code).toBe("InfinityValuesNotSupported");
                    done();

                }, DefaultWaitForRender);
            });

            it("Positive Infinity in values shows a warning", (done) => {
                gaugeVisualDataBuilder.values = [[10], [0], [Number.POSITIVE_INFINITY], [200]];
                gaugeVisualDataBuilder.onDataChanged();

                setTimeout(() => {
                    expect(gaugeVisualDataBuilder.warningSpy).toHaveBeenCalled();
                    expect(gaugeVisualDataBuilder.warningSpy.calls.count()).toBe(1);
                    expect(gaugeVisualDataBuilder.warningSpy.calls.argsFor(0)[0][0].code).toBe("InfinityValuesNotSupported");
                    done();

                }, DefaultWaitForRender);
            });

            it("Value out of range in values shows a warning", (done) => {
                gaugeVisualDataBuilder.values = [[10], [0], [1e301], [200]];
                gaugeVisualDataBuilder.onDataChanged();

                setTimeout(() => {
                    expect(gaugeVisualDataBuilder.warningSpy).toHaveBeenCalled();
                    expect(gaugeVisualDataBuilder.warningSpy.calls.count()).toBe(1);
                    expect(gaugeVisualDataBuilder.warningSpy.calls.argsFor(0)[0][0].code).toBe("ValuesOutOfRange");
                    done();

                }, DefaultWaitForRender);
            });

            it("All okay in values does not show warning", (done) => {
                gaugeVisualDataBuilder.values = [[10], [0], [20], [200]];
                gaugeVisualDataBuilder.onDataChanged();

                setTimeout(() => {
                    expect(gaugeVisualDataBuilder.warningSpy).toHaveBeenCalledWith([]);
                    done();
                }, DefaultWaitForRender);
            });

            it("OnDataChange calls expected methods", (done) => {
                gaugeVisualDataBuilder.values = [[10], [0], [300], [200]];
                gaugeVisualDataBuilder.onDataChanged();

                setTimeout(() => {
                    expect(gaugeVisualDataBuilder.gauge.drawViewPort).toHaveBeenCalled();

                    //Changing data should trigger new calls for viewport and animated number properties
                    expect(gaugeVisualDataBuilder.gauge.getGaugeVisualProperties).toHaveBeenCalled();
                    expect(gaugeVisualDataBuilder.gauge.getAnimatedNumberProperties).toHaveBeenCalled();
                    done();

                }, DefaultWaitForRender);
            });

            it("onResizing calls expected methods", (done) => {
                gaugeVisualDataBuilder.values = [[10], [0], [300], [200]];
                gaugeVisualDataBuilder.onDataChanged();
                gaugeVisualDataBuilder.onResizing(200, 300);

                setTimeout(() => {
                    expect(gaugeVisualDataBuilder.gauge.getGaugeVisualProperties).toHaveBeenCalled();
                    expect(gaugeVisualDataBuilder.gauge.getAnimatedNumberProperties).toHaveBeenCalled();
                    expect(gaugeVisualDataBuilder.gauge.drawViewPort).toHaveBeenCalled();

                    done();
                }, DefaultWaitForRender);
            });

            it("check target uses its own format instead of metadata format.", (done) => {
                gaugeVisualDataBuilder.dataViewMetadata.columns[0].objects = {
                    general: { formatString: "0.00" }
                };

                gaugeVisualDataBuilder.values = [[5.5], [0], [10], [6.5]];
                gaugeVisualDataBuilder.onDataChanged();
                gaugeVisualDataBuilder.onResizing(100, 400);

                setTimeout(() => {
                    //Data labels
                    let targetText = $(".targetText");

                    expect(targetText.length).toBe(1);
                    expect(helpers.findElementText(targetText)).toEqual("$7");
                    //check titles
                    expect(helpers.findElementTitle(targetText)).toEqual("$7");
                    done();
                }, DefaultWaitForRender);
            });

            it("Gauge_default_gauge_values", () => {
                let dataView: powerbi.DataView = {
                    metadata: null,
                    single: { value: 500 },
                    categorical: null
                };

                let expectedValues: powerbi.visuals.GaugeData = {
                    total: null,
                    metadataColumn: undefined,
                    targetSettings: {
                        min: 0,
                        max: 1,
                        target: null
                    },
                    maxColumnMetadata: undefined,
                    minColumnMetadata: undefined,
                    targetColumnMetadata: undefined,
                    tooltipInfo: [],
                    dataLabelsSettings: {
                        show: true,
                        displayUnits: 0,
                        precision: undefined,
                        labelColor: null,
                        position: null,
                        fontSize: 8,
                    }, calloutValueLabelsSettings: {
                        show: true,
                        displayUnits: 0,
                        precision: undefined,
                        labelColor: null,
                        position: null,
                        fontSize: 8,
                    }, dataPointSettings: {
                        fillColor: DefaultFillColor,
                        targetColor: undefined
                    }
                };

                expect(GaugeVisual.converter(powerbi.data.createIDataViewCategoricalReader(dataView))).toEqual(expectedValues);
            });
        });
    });

    describe("Gauge margins tests", () => {
        let gaugeVisualDataBuilder: GaugeVisualDataBuilder;

        beforeEach(() => {
            powerbitests.mocks.setLocale();

            gaugeVisualDataBuilder = new GaugeVisualDataBuilder("gauge");
        });

        it("Gauge margin test with view port sideNumbersVisibleGreaterThanMinHeightString", () => {
            gaugeVisualDataBuilder.height = gaugeVisualDataBuilder.width =
                sideNumbersVisibleGreaterThanMinHeightString;

            let expectedViewPortProperty = {
                margin: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                },
            };

            let viewPortProperty = gaugeVisualDataBuilder.gauge.getGaugeVisualProperties();
            expect(viewPortProperty.margin).toEqual(expectedViewPortProperty.margin);
        });

        it("Gauge margin test with view port sideNumbersVisibleSmallerThanMinHeightString", () => {
            gaugeVisualDataBuilder.height = gaugeVisualDataBuilder.width =
                sideNumbersVisibleGreaterThanMinHeightString;

            let expectedViewPortProperty = {
                margin: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                },
            };

            let viewPortProperty = gaugeVisualDataBuilder.gauge.getGaugeVisualProperties();
            expect(viewPortProperty.margin).toEqual(expectedViewPortProperty.margin);
        });

        it("Gauge margin test with view port sideNumbersVisibleGreaterThanMinHeightString mobile", () => {
            gaugeVisualDataBuilder.height = gaugeVisualDataBuilder.width =
                sideNumbersVisibleGreaterThanMinHeightString;
            gaugeVisualDataBuilder.isMobile = true;

            let expectedViewPortProperty = {
                margin: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                },
            };

            let viewPortProperty = gaugeVisualDataBuilder.gauge.getGaugeVisualProperties();
            expect(viewPortProperty.margin).toEqual(expectedViewPortProperty.margin);
        });

        it("Gauge margin test with view port sideNumbersVisibleSmallerThanMinHeightString mobile", () => {
            gaugeVisualDataBuilder.height = gaugeVisualDataBuilder.width = sideNumbersVisibleSmallerThanMinHeightString;
            gaugeVisualDataBuilder.isMobile = true;

            let expectedViewPortProperty = {
                margin: {
                    top: marginsOnSmallViewPort,
                    bottom: marginsOnSmallViewPort,
                    left: marginsOnSmallViewPort,
                    right: marginsOnSmallViewPort
                },
            };

            let viewPortProperty = gaugeVisualDataBuilder.gauge.getGaugeVisualProperties();
            expect(viewPortProperty.margin).toEqual(expectedViewPortProperty.margin);
        });

        it("Gauge margin test with no data labels should have no margins", () => {
            gaugeVisualDataBuilder.height = "200";
            gaugeVisualDataBuilder.width = "199";

            let expectedViewPortProperty = {
                margin: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                },
            };

            let viewPortProperty = gaugeVisualDataBuilder.gauge.getGaugeVisualProperties();
            expect(viewPortProperty.margin).toEqual(expectedViewPortProperty.margin);
        });

        it("Gauge margin test with target on left and height greater than width", () => {
            gaugeVisualDataBuilder.height = "200";
            gaugeVisualDataBuilder.width = "199";

            gaugeVisualDataBuilder.singleValue = 10;
            gaugeVisualDataBuilder.values = [[10], [0], [300], [0]];

            gaugeVisualDataBuilder.onDataChanged();

            let viewPortProperty = gaugeVisualDataBuilder.gauge.getGaugeVisualProperties();
            expect(viewPortProperty.margin.left).toEqual(0);
            expect(viewPortProperty.margin.top).toEqual(20);
        });

        it("Gauge margin test with target on right and height greater than width", () => {
            gaugeVisualDataBuilder.height = "200";
            gaugeVisualDataBuilder.width = "199";

            gaugeVisualDataBuilder.singleValue = 10;
            gaugeVisualDataBuilder.values = [[10], [0], [300], [250]];

            gaugeVisualDataBuilder.onDataChanged();

            let viewPortProperty = gaugeVisualDataBuilder.gauge.getGaugeVisualProperties();
            expect(viewPortProperty.margin.top).toEqual(20);
            expect(viewPortProperty.margin.right).toEqual(0);
        });

        it("Gauge margin test with small width and target", () => {
            gaugeVisualDataBuilder.height = "200";
            gaugeVisualDataBuilder.width = "140";

            gaugeVisualDataBuilder.singleValue = 10;
            gaugeVisualDataBuilder.values = [[10], [0], [300], [250]];

            gaugeVisualDataBuilder.onDataChanged();

            let viewPortProperty = gaugeVisualDataBuilder.gauge.getGaugeVisualProperties();
            expect(viewPortProperty.margin.right).toEqual(0);
            expect(viewPortProperty.margin.top).toEqual(0);
        });

        it("Gauge with very long minTick label and no target put labels on bottom", (done) => {
            gaugeVisualDataBuilder.height = "200";
            gaugeVisualDataBuilder.width = "400";

            gaugeVisualDataBuilder.singleValue = 10;
            gaugeVisualDataBuilder.values = [[-8000000000000000000000000], [-16374372492439823424324234], [0]];

            gaugeVisualDataBuilder.onDataChanged();

            let viewPortProperty = gaugeVisualDataBuilder.gauge.getGaugeVisualProperties();
            expect(viewPortProperty.margin.left).toEqual(0);
            expect(viewPortProperty.margin.right).toEqual(0);

            setTimeout(() => {
                let labels = $(".labelText");
                expect(labels.eq(0).css('text-anchor')).toBe('start');
                expect(labels.eq(1).css('text-anchor')).toBe('end');

                done();
            }, DefaultWaitForRender);
        });

        it("Gauge with very long maxTick label and no target put labels on bottom", (done) => {
            gaugeVisualDataBuilder.height = "200";
            gaugeVisualDataBuilder.width = "400";

            gaugeVisualDataBuilder.singleValue = 10;
            gaugeVisualDataBuilder.values = [[8000000000000000000000000], [0], [16374372492439823424324234]];

            gaugeVisualDataBuilder.onDataChanged();

            let viewPortProperty = gaugeVisualDataBuilder.gauge.getGaugeVisualProperties();
            expect(viewPortProperty.margin.left).toEqual(0);
            expect(viewPortProperty.margin.right).toEqual(0);

            setTimeout(() => {
                let labels = $(".labelText");
                expect(labels.eq(0).css('text-anchor')).toBe('start');
                expect(labels.eq(1).css('text-anchor')).toBe('end');

                done();
            }, DefaultWaitForRender);
        });
    });

    describe("Gauge side number tests", () => {
        let gaugeDataBuilder: GaugeDataBuilder;

        beforeEach(() => {
            powerbitests.mocks.setLocale();

            gaugeDataBuilder = new GaugeDataBuilder("gauge");
        });

        it("Gauge margin test with view port sideNumbersVisibleSmallerThanMinHeightString mobile", (done) => {
            gaugeDataBuilder.height = gaugeDataBuilder.width = sideNumbersVisibleSmallerThanMinHeightString;
            gaugeDataBuilder.values = [[-25]];
            gaugeDataBuilder.isMobile = true;

            gaugeDataBuilder.onDataChanged();

            setTimeout(() => {
                let labels = $(".labelText");

                expect(labels.length).toBe(0);
                expect($(labels[0]).text()).toEqual("");
                expect($(labels[1]).text()).toEqual("");
                done();

            }, DefaultWaitForRender);
        });

        it("Gauge margin test with view port sideNumbersVisibleGreaterThanMinHeightString mobile", (done) => {
            gaugeDataBuilder.height = gaugeDataBuilder.width = sideNumbersVisibleGreaterThanMinHeightString;
            gaugeDataBuilder.values = [[-25]];
            gaugeDataBuilder.isMobile = true;

            gaugeDataBuilder.onDataChanged();

            setTimeout(() => {
                let textLabels: JQuery = $(".labelText");
                expect(textLabels.length).toBe(2);
                expect(helpers.findElementText(textLabels)).toEqual("-$50");
                expect(helpers.findElementText(textLabels.eq(1))).toEqual("$0");
                //check titles
                expect(helpers.findElementTitle(textLabels)).toEqual("-$50");
                expect(helpers.findElementTitle(textLabels.eq(1))).toEqual("$0");
                done();
            }, DefaultWaitForRender);
        });

        it("Gauge margin test with view port sideNumbersVisibleSmallerThanMinHeightString", (done) => {
            gaugeDataBuilder.height = gaugeDataBuilder.width = sideNumbersVisibleSmallerThanMinHeightString;
            gaugeDataBuilder.isMobile = false;
            gaugeDataBuilder.values = [[-25]];

            gaugeDataBuilder.onDataChanged();

            setTimeout(() => {
                let textLabels: JQuery = $(".labelText");
                expect(textLabels.length).toBe(2);
                expect(helpers.findElementText(textLabels)).toEqual("-$50");
                expect(helpers.findElementText(textLabels.eq(1))).toEqual("$0");
                //check titles
                expect(helpers.findElementTitle(textLabels)).toEqual("-$50");
                expect(helpers.findElementTitle(textLabels.eq(1))).toEqual("$0");
                done();
            }, DefaultWaitForRender);
        });

        it("Gauge margin test with view port sideNumbersVisibleGreaterThanMinHeightString", (done) => {
            gaugeDataBuilder.height = gaugeDataBuilder.width = sideNumbersVisibleGreaterThanMinHeightString;
            gaugeDataBuilder.isMobile = false;
            gaugeDataBuilder.values = [[-25]];

            gaugeDataBuilder.onDataChanged();

            setTimeout(() => {
                let textLabels: JQuery = $(".labelText");
                expect(textLabels.length).toBe(2);
                expect(helpers.findElementText(textLabels)).toEqual("-$50");
                expect(helpers.findElementText(textLabels.eq(1))).toEqual("$0");
                //check titles
                expect(helpers.findElementTitle(textLabels)).toEqual("-$50");
                expect(helpers.findElementTitle(textLabels.eq(1))).toEqual("$0");
                done();
            }, DefaultWaitForRender);
        });
    });
}
