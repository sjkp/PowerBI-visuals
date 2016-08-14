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
    import Card = powerbi.visuals.Card;
    import cardCapabilities = powerbi.visuals.cardCapabilities;
    import DataViewTransform = powerbi.data.DataViewTransform;
    import ValueType = powerbi.ValueType;
    import SVGUtil = powerbi.visuals.SVGUtil;
    import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;

    const cardSmallViewportWidth: number = 97; // Matches powerbi.visualHost.DashboardVisualPluginService.cardSmallViewportWidth
    const cardSmallViewport: number = cardSmallViewportWidth - 1; 
    const cardSmallViewportString: string = cardSmallViewport.toString(); 

    describe("Card", () => {
        it("Card_registered_capabilities", () => {
            expect(powerbi.visuals.plugins.card.capabilities).toBe(cardCapabilities);
        });

        it("Capabilities should include dataViewMappings", () => {
            expect(cardCapabilities.dataViewMappings).toBeDefined();
            expect(cardCapabilities.dataViewMappings.length).toBe(1);
        });

        it("Capabilities should have condition", () => {
            expect(cardCapabilities.dataViewMappings[0].conditions[0][cardCapabilities.dataRoles[0].name].max).toBe(1);
        });

        it("Capabilities should include dataRoles", () => {
            expect(cardCapabilities.dataRoles).toBeDefined();
            expect(cardCapabilities.dataRoles.length).toBe(1);
        });

        it("Capabilities should suppressDefaultTitle", () => {
            expect(cardCapabilities.suppressDefaultTitle).toBe(true);
        });

        it("FormatString property should match calculated", () => {
            expect(powerbi.data.DataViewObjectDescriptors.findFormatString(cardCapabilities.objects)).toEqual(Card.formatStringProp);
        });

        it("cardChart preferred capabilities requires at most 1 row", () => {
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: "col1" },
                    { displayName: "col2", isMeasure: true }]
            };

            let dataViewWithTwoRows: powerbi.DataView = {
                metadata: dataViewMetadata,
                categorical: {
                    categories: [{
                        source: dataViewMetadata.columns[0],
                        values: ["John Domo", "Delta Force"],
                        identity: [mocks.dataViewScopeIdentity("a"), mocks.dataViewScopeIdentity("b")]
                    }],
                    values: DataViewTransform.createValueColumns([{
                        source: dataViewMetadata.columns[1],
                        values: [100, 200],
                        subtotal: 300
                    }])
                }
            };

            let plugin = powerbi.visuals.plugins.card;
            expect(powerbi.DataViewAnalysis.supports(dataViewWithTwoRows, plugin.capabilities.dataViewMappings[0], true)).toBe(false);
        });

        it("cardChart preferred capabilities requires 1 row", () => {
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: "numeric", type: ValueType.fromDescriptor({ numeric: true }) }
                ],
            };

            let data: powerbi.DataView = {
                metadata: dataViewMetadata,
                single: { value: 123.456 }
            };

            let plugin = powerbi.visuals.plugins.card;
            expect(powerbi.DataViewAnalysis.supports(data, plugin.capabilities.dataViewMappings[0], true)).toBe(true);
        });
    });

    describe("enumerateObjectInstances", () => {
        let cardBuilder: CardBuilder;

        let dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [{ displayName: "col1", isMeasure: true, objects: { "general": { formatString: "#0" } } }],
            objects: {
                labels: {
                    color: { solid: { color: "#222222" } },
                    labelPrecision: 3,
                    labelDisplayUnits: 1000
                },
                categoryLabels: {
                    color: { solid: { color: "#FF0000" } },
                }
            }
        };

        beforeEach(() => {
            cardBuilder = new CardBuilder(undefined, undefined, "500", "500");
        });

        it("verify default values", () => {
            cardBuilder.onDataChanged();

            verifyLabels(cardBuilder.card);
            verifyCategoryLabels(cardBuilder.card);
        });

        it("changed data", () => {
            cardBuilder.metadata = dataViewMetadata;
            cardBuilder.singleValue = 20;
            cardBuilder.onDataChanged();

            verifyLabels(cardBuilder.card, "#222222", 3, 1000);
            verifyCategoryLabels(cardBuilder.card, "#FF0000");
        });

        it("changed title", () => {
            let metadata: powerbi.DataViewMetadata = {
                columns: [{ displayName: "col1", isMeasure: true, objects: { "general": { formatString: "#0" } } }],
                objects: {
                    categoryLabels: {
                        show: false
                    }
                }
            };

            cardBuilder.metadata = metadata;
            cardBuilder.singleValue = 0;
            cardBuilder.onDataChanged();

            let objects = <VisualObjectInstanceEnumerationObject>cardBuilder.card.enumerateObjectInstances({ objectName: "categoryLabels" });
            expect(objects.instances.length).toBe(1);
            expect(objects.instances[0].properties["show"]).toBeDefined();
            expect(objects.instances[0].properties["show"]).toBe(false);
            expect(objects.containers).toBeUndefined();
        });

        function verifyCategoryLabels(card: Card, color?: string) {
            let objects = <VisualObjectInstanceEnumerationObject>card.enumerateObjectInstances({ objectName: "categoryLabels" });
            expect(objects.instances.length).toBe(1);
            expect(objects.instances[0].properties["show"]).toBeDefined();
            expect(objects.instances[0].properties["show"]).toBe(true);

            color = color ? color : Card.DefaultStyle.label.color;

            let properties = objects.instances[0].properties;
            helpers.assertColorsMatch(<string>properties["color"], color);
        }

        function verifyLabels(card: Card, color?: string, precision?: number, displayUnits?: number) {
            let objects = <VisualObjectInstanceEnumerationObject>card.enumerateObjectInstances({ objectName: "labels" });
            let defaultLabelSettings = powerbi.visuals.dataLabelUtils.getDefaultLabelSettings();

            expect(objects.instances.length).toBe(1);
            expect(objects.instances[0].properties).toBeDefined();

            // Default values
            color = color ? color : Card.DefaultStyle.value.color;

            // The default value for precision is undefined but in enumerateObject it is null
            precision = precision !== undefined ? precision : null;
            displayUnits = displayUnits ? displayUnits : defaultLabelSettings.displayUnits;

            let properties = objects.instances[0].properties;
            helpers.assertColorsMatch(<string>properties["color"], color);
            expect(properties["labelPrecision"]).toBe(precision);
            expect(properties["labelDisplayUnits"]).toBe(displayUnits);
        }
    });

    describe("Card DOM tests", () => {
        let cardBuilder: CardBuilder;

        let dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [{ displayName: "col1", isMeasure: true, objects: { "general": { formatString: "#0" } } }],
        };

        let dataViewMetadataDecimalFormatString: powerbi.DataViewMetadata = {
            columns: [{ displayName: "col1", isMeasure: true, objects: { "general": { formatString: "#,0.00" } } }],
        };

        let dataViewmetadataWithLabelProperties: powerbi.DataViewMetadata = {
            columns: [{ displayName: "col1", isMeasure: true, objects: { "general": { formatString: "#0" } } }],
            objects: {
                labels: {
                    color: { solid: { color: "#222222" } },
                    labelPrecision: 3,
                    labelDisplayUnits: 1000
                },
                categoryLabels: {
                    show: true,
                    color: { solid: { color: "#FF0000" } },
                }
            }
        };

        let dataViewMetadaWithCurrency: powerbi.DataViewMetadata = {
            columns: [{ displayName: "col1", isMeasure: true, objects: { "general": { formatString: "\$#,0;(\$#,0);\$#,0" } } }],
            objects: {
                labels: {
                    labelPrecision: 2,
                    labelDisplayUnits: 1,
                    fontSize: 19
                },
                categoryLabels: {
                    show: true
                }
            }
        };

        let cardStyles = Card.DefaultStyle.card;

        beforeEach(() => {
            cardBuilder = new CardBuilder();
        });

        it("Card_getAdjustedFontHeight with seed font size fitting in available width but equal/larger than MaxFontSize", () => {
            cardBuilder.setCurrentViewport(500, 500);

            expect(cardBuilder.card.getAdjustedFontHeight(cardBuilder.card.currentViewport.width, "t", cardStyles.maxFontSize)).toBe(cardStyles.maxFontSize);
            expect(cardBuilder.card.getAdjustedFontHeight(cardBuilder.card.currentViewport.width, "t", cardStyles.maxFontSize + 5)).toBe(cardStyles.maxFontSize);
        });

        it("Card_getAdjustedFontHeight with seed font size not fitting in available width and smaller than MaxFontSize", () => {
            cardBuilder.setCurrentViewport(30, 30);

            expect(cardBuilder.card.getAdjustedFontHeight(cardBuilder.card.currentViewport.width, "t", cardStyles.maxFontSize)).toBeLessThan(cardStyles.maxFontSize);
        });

        it("Card_onDataChanged (single value as text)", () => {
            cardBuilder.metadata = dataViewMetadata;
            cardBuilder.singleValue = "7191394482447.7";

            cardBuilder.onDataChanged();

            cardBuilder.onResizing();

            expect($(".card")).toBeInDOM();
            expect($(".mainText")).toBeInDOM();
            let titleText = $(".card").find("title").text();
            let mainText = $(".card").find(".mainText").text();
            expect(titleText).toBe("7191394482447.7");
            expect(mainText).toBe("7191394482447.7");
        });

        it("Card_onDataChanged (single value)", () => {
            cardBuilder.metadata = dataViewMetadata;
            cardBuilder.singleValue = 7191394482447.7;

            cardBuilder.onDataChanged();

            cardBuilder.onResizing();

            expect($(".card")).toBeInDOM();
            expect($(".mainText")).toBeInDOM();
            let titleText = $(".card").find("title").text();
            let mainText = $(".card").find(".mainText").text();
            expect(titleText).toBe("7191394482447.7");
            expect(mainText).toBe("7T");
        });

        it("Card_onDataChanged (single value) with lots of decimals", () => {
            cardBuilder.metadata = dataViewMetadata;
            cardBuilder.singleValue = 1.742353534535243;

            cardBuilder.onDataChanged();

            cardBuilder.onResizing();

            expect($(".card")).toBeInDOM();
            expect($(".mainText")).toBeInDOM();
            let mainText = $(".card").find(".mainText").text();
            expect(mainText).toBe("2");
        });

        it("Card_onDataChanged (single value) with lots of decimals and format string", () => {
            cardBuilder.metadata = dataViewMetadataDecimalFormatString;
            cardBuilder.singleValue = 1.742353534535243;

            cardBuilder.onDataChanged();

            cardBuilder.onResizing();

            expect($(".card")).toBeInDOM();
            expect($(".mainText")).toBeInDOM();
            let mainText = $(".card").find(".mainText").text();
            expect(mainText).toBe("1.74");
        });

        it("Card_onDataChanged (0)", () => {
            cardBuilder.metadata = dataViewMetadata;
            cardBuilder.singleValue = 0;

            cardBuilder.onDataChanged();

            expect($(".card")).toBeInDOM();
            expect($(".mainText")).toBeInDOM();
            let titleText = $(".card").find("title").text();
            expect(titleText).toBe("0");
        });

        it("Card with null dataview", (done) => {
            cardBuilder.metadata = dataViewMetadata;
            cardBuilder.singleValue = 0;

            cardBuilder.onDataChanged();

            setTimeout(() => {
                expect(helpers.findElementText($(".mainText").first())).toBe("0");
                cardBuilder.singleValue = null;
                cardBuilder.onDataChanged();

                setTimeout(() => {
                    expect(helpers.findElementText($(".mainText").first())).toBe("(Blank)");
                    done();
                }, DefaultWaitForRender);

            }, DefaultWaitForRender);
        });

        it("Card updated with undefined dataview", (done) => {
            cardBuilder.metadata = dataViewMetadata;
            cardBuilder.singleValue = 0;

            cardBuilder.onDataChanged();

            setTimeout(() => {
                expect(helpers.findElementText($(".mainText").first())).toBe("0");
                cardBuilder.singleValue = undefined;
                cardBuilder.onDataChanged();

                setTimeout(() => {
                    expect($(".mainText").first().text()).toBe("");
                    done();
                }, DefaultWaitForRender);

            }, DefaultWaitForRender);
        });

        it("Card_onDataChanged formats number < 10000", (done) => {
            cardBuilder.metadata = dataViewMetadata;
            cardBuilder.singleValue = 85.23498239847123;

            cardBuilder.onDataChanged();

            expect($(".card")).toBeInDOM();
            expect($(".mainText")).toBeInDOM();
            SVGUtil.flushAllD3Transitions();
            setTimeout(() => {
                expect($(".mainText").text()).toEqual("85");
                done();
            }, DefaultWaitForRender);
        });

        it("Card_onDataChanged verbose display units (explore mode)", (done) => {
            cardBuilder = new CardBuilder(powerbi.DisplayUnitSystemType.Verbose);

            let spy = spyOn(powerbi.visuals.valueFormatter, "create");
            spy.and.callThrough();

            cardBuilder.metadata = dataViewMetadata;
            cardBuilder.singleValue = 900000;

            cardBuilder.onDataChanged();

            expect($(".card")).toBeInDOM();
            expect($(".mainText")).toBeInDOM();
            setTimeout(() => {
                expect(spy.calls.count()).toBe(1);

                let args = spy.calls.argsFor(0);
                expect(args).toBeDefined();

                expect(args[0].displayUnitSystemType).toBe(powerbi.DisplayUnitSystemType.Verbose);
                done();
            }, DefaultWaitForRender);
        });

        it("Card_onDataChanged whole display units (dashboard tile mode, default)", (done) => {
            let spy = spyOn(powerbi.visuals.valueFormatter, "create");
            spy.and.callThrough();

            cardBuilder.metadata = dataViewMetadata;
            cardBuilder.singleValue = 900000;

            cardBuilder.onDataChanged();

            expect($(".card")).toBeInDOM();
            expect($(".mainText")).toBeInDOM();
            setTimeout(() => {
                expect(spy.calls.count()).toBe(1);

                let args = spy.calls.argsFor(0);
                expect(args).toBeDefined();

                expect(args[0].displayUnitSystemType).toBe(powerbi.DisplayUnitSystemType.WholeUnits);
                done();
            }, DefaultWaitForRender);
        });

        it("Card with DateTime value on dashboard", (done) => {
            let dateValue = new Date(2015, 5, 20);
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: "date", type: powerbi.ValueType.fromDescriptor({ dateTime: true }), isMeasure: true }
                ],
            };

            cardBuilder.metadata = dataViewMetadata;
            cardBuilder.singleValue = dateValue;

            cardBuilder.onDataChanged();

            setTimeout(() => {
                expect(helpers.findElementText($(".mainText").first())).toBe("6/20/2015");
                let transform = SVGUtil.parseTranslateTransform($(".mainText").first().attr("transform"));
                expect(transform.x).toBe("150");
                expect(transform.y).toBe("130");
                done();
            }, DefaultWaitForRender);
        });

        it("Card text alignment", (done) => {
            cardBuilder.metadata = dataViewMetadata;
            cardBuilder.singleValue = 900000;

            cardBuilder.onDataChanged();

            cardBuilder.onResizing(170, 250);

            setTimeout(() => {
                let transform = SVGUtil.parseTranslateTransform($(".mainText").first().attr("transform"));
                expect(transform.x).toBe("125");
                expect($(".mainText").first().attr("text-anchor")).toBe("middle");
                done();
            }, DefaultWaitForRender);
        });

        it("card label on", (done) => {
            cardBuilder = new CardBuilder(null, true);

            let metadata: powerbi.DataViewMetadata = {
                columns: [{ displayName: "col1", isMeasure: true, objects: { "general": { formatString: "#0" } } }],
                objects: {
                    categoryLabels: {
                        show: true
                    }
                }
            };

            cardBuilder.metadata = metadata;
            cardBuilder.singleValue = "7191394482447.7";

            cardBuilder.onDataChanged();

            setTimeout(() => {
                expect($(".label")[0]).toBeDefined();
                expect(helpers.findElementText($(".label").first())).toBe("col1");
                expect(helpers.findElementTitle($(".label").first())).toBe("col1");
                done();
            }, DefaultWaitForRender);
        });

        it("card label off", (done) => {
            cardBuilder = new CardBuilder(null, true);

            let metadata: powerbi.DataViewMetadata = {
                columns: [{ displayName: "col1", isMeasure: true, objects: { "general": { formatString: "#0" } } }],
                objects: {
                    categoryLabels: {
                        show: false
                    }
                }
            };

            cardBuilder.metadata = metadata;
            cardBuilder.singleValue = "7191394482447.7";

            cardBuilder.onDataChanged();

            setTimeout(() => {
                expect($(".label")[0]).toBeUndefined();
                done();
            }, DefaultWaitForRender);
        });

        it("card caption tooltip ", () => {
            cardBuilder = new CardBuilder(null, true);

            let metadata: powerbi.DataViewMetadata = {
                columns: [{ displayName: "col1", isMeasure: true, objects: { "general": { formatString: "#0" } } }],
                objects: {
                    categoryLabels: {
                        show: true
                    }
                }
            };

            cardBuilder.metadata = metadata;
            cardBuilder.singleValue = "547.7";

            cardBuilder.onDataChanged();
            let cardCaptionTooltip = helpers.findElementTitle($('.value'));

            expect(cardCaptionTooltip).toBe(cardBuilder.singleValue);

        });
        it("card tooltip caption truncated", () => {
            cardBuilder = new CardBuilder(null, true);

            let metadata: powerbi.DataViewMetadata = {
                columns: [{ displayName: "col1", isMeasure: true, objects: { "general": { formatString: "#0" } } }],
                objects: {
                    categoryLabels: {
                        show: true
                    }
                }
            };

            cardBuilder.metadata = metadata;
            cardBuilder.singleValue = "123,547,674,243,545,323,564,112,346,102,135,154.7";

            cardBuilder.onDataChanged();
            let cardCaptionTooltip = helpers.findElementTitle($('.value'));

            expect(cardCaptionTooltip).toBe(cardBuilder.singleValue);

        });

        it("card tooltip label", () => {
            cardBuilder = new CardBuilder(null, true);

            let metadata: powerbi.DataViewMetadata = {
                columns: [{ displayName: "column1", isMeasure: true, objects: { "general": { formatString: "#0" } } }],
                objects: {
                    categoryLabels: {
                        show: true
                    }
                }
            };

            cardBuilder.metadata = metadata;
            cardBuilder.singleValue = "547.7";

            cardBuilder.onDataChanged();
            let cardLabelTooltip = helpers.findElementTitle($('.label'));

            expect(cardLabelTooltip).toBe('column1');

        });
        it("card tooltip label truncated", () => {
            cardBuilder = new CardBuilder(null, true);

            let metadata: powerbi.DataViewMetadata = {
                columns: [{
                    displayName: "This is a very long card label for testing", isMeasure: true, objects: { "general": { formatString: "#" } }
                }],
                objects: {
                    categoryLabels: {
                        show: true
                    }
                }
            };

            cardBuilder.metadata = metadata;
            cardBuilder.singleValue = "547";

            cardBuilder.onDataChanged();
            let cardLabelTooltip = helpers.findElementTitle($('.label'));

            expect(cardLabelTooltip).toBe("This is a very long card label for testing");

        });

        it("change color", (done) => {
            cardBuilder = new CardBuilder(null, true);

            cardBuilder.metadata = dataViewmetadataWithLabelProperties;
            cardBuilder.singleValue = "7191394482447.7";

            cardBuilder.onDataChanged();

            setTimeout(() => {
                helpers.assertColorsMatch($(".card .value").css("fill"), "#222222");
                helpers.assertColorsMatch($(".card .label").css("fill"), "#FF0000");
                done();
            }, DefaultWaitForRender);
        });

        it("change precision", (done) => {
            cardBuilder = new CardBuilder(null, true);

            let metadata: powerbi.DataViewMetadata = {
                columns: [{ displayName: "col1", isMeasure: true, objects: { "general": { formatString: "#0" } } }],
                objects: {
                    labels: {
                        labelPrecision: 3,
                        labelDisplayUnits: 1000
                    },
                    categoryLabels: {
                        show: true
                    }
                }
            };

            cardBuilder.metadata = metadata;
            cardBuilder.singleValue = 7;

            cardBuilder.onDataChanged();

            setTimeout(() => {
                expect(helpers.findElementText($(".card .value").first())).toBe("0.007K");
                expect(helpers.findElementTitle($(".card .value").first())).toBe("0.007K");
                done();
            }, DefaultWaitForRender);
        });
        
        it("change precision (with percent)", (done) => {
            cardBuilder = new CardBuilder(null, true);
            
            // Start with the standard format string (2 decimal places)
            let metadata: powerbi.DataViewMetadata = {
                columns: [{ displayName: "col1", isMeasure: true, objects: { "general": { formatString: "#,0.##%" } } }],
                objects: {
                    labels: {
                        // Set precision to 4 so we expect 4 decimal places
                        labelPrecision: 4,
                    },
                    categoryLabels: {
                        show: true
                    }
                }
            };

            cardBuilder.metadata = metadata;
            cardBuilder.singleValue = .123456789;

            cardBuilder.onDataChanged();

            setTimeout(() => {
                // Verify we have 4 decimal places
                expect(helpers.findElementText($(".card .value").first())).toBe("12.3457%");
                expect(helpers.findElementTitle($(".card .value").first())).toBe("12.3457%");
                done();
            }, DefaultWaitForRender);
        });

        it("change category font size", (done) => {
            cardBuilder = new CardBuilder(null, true);

            let fontSizeMetadata = powerbi.Prototype.inherit(dataViewMetadata);
            fontSizeMetadata.objects = {
                categoryLabels: {
                    fontSize: 16
                },
            };

            cardBuilder.metadata = fontSizeMetadata;
            cardBuilder.singleValue = "7";

            cardBuilder.onDataChanged();

            setTimeout(() => {
                expect($(".card .label").first().css('font-size')).toBe('21px');
                done();
            }, DefaultWaitForRender);
        });

        it("change value font size", (done) => {
            cardBuilder = new CardBuilder(null, true);

            let fontSizeMetadata = powerbi.Prototype.inherit(dataViewMetadata);
            fontSizeMetadata.objects = {
                labels: {
                    fontSize: 14
                },
            };

            cardBuilder.metadata = fontSizeMetadata;
            cardBuilder.singleValue = "7";

            cardBuilder.onDataChanged();

            setTimeout(() => {
                expect($(".card .value").first().css('font-size')).toBe('19px');
                done();
            }, DefaultWaitForRender);
        });

        it("change display unit", (done) => {
            cardBuilder = new CardBuilder(null, true);

            let metadataWithDisplayUnits: powerbi.DataViewMetadata = {
                columns: [{ displayName: "col1", isMeasure: true, objects: { "general": { formatString: "#0" } } }],
                objects: {
                    labels: {
                        labelDisplayUnits: 1000
                    },
                    categoryLabels: {
                        show: true
                    }
                }
            };

            cardBuilder.metadata = metadataWithDisplayUnits;
            cardBuilder.singleValue = 9999;

            cardBuilder.onDataChanged();

            setTimeout(() => {
                expect(helpers.findElementText($(".card .value").first())).toBe("10K");
                expect(helpers.findElementTitle($(".card .value").first())).toBe("10K");

                //display unit auto
                cardBuilder.metadata = dataViewMetadata;

                cardBuilder.onDataChanged();

                expect(helpers.findElementText($(".card .value").first())).toBe("9999");
                expect(helpers.findElementTitle($(".card .value").first())).toBe("9999");
                done();
            }, DefaultWaitForRender);
        });

        it('change word wrapping', (done) => {
            cardBuilder = new CardBuilder(null, true);

            let metadata: powerbi.DataViewMetadata = {
                columns: [{
                    displayName: 'very very very very long category label',
                    isMeasure: true,
                    objects: { 'general': { formatString: '#0' } }
                }],
                objects: {
                    labels: {
                        show: true
                    },
                    wordWrap: {
                        show: false
                    },
                }
            };

            cardBuilder.metadata = metadata;
            cardBuilder.singleValue = "7";
            cardBuilder.onDataChanged();

            cardBuilder.onResizing(1000, 200);

            setTimeout(() => {
                // No word wrapping, category label should be cut
                expect($('.card .label')[0].textContent).toContain('…');
                expect($('.card .label tspan').length).toBe(0);

                metadata.objects = {
                    labels: {
                        show: true
                    },
                    wordWrap: {
                        show: true
                    },
                };

                cardBuilder.metadata = metadata;
                cardBuilder.onDataChanged();

                // Word wrapping is on, category label should be visible is several lines
                let tspans = $('.card .label tspan');

                // To prevent this test from being fragile, we will only assert that there is more than 1
                // tspan being created so the category label is split across several lines.
                expect(tspans.length).toBeGreaterThan(1);
                done();
            }, DefaultWaitForRender);
        });

        describe('wordBreak tests', () => {
            let metadata: powerbi.DataViewMetadata;
            let wordBreakSpy: jasmine.Spy;

            beforeEach(() => {
                metadata = {
                    columns: [{
                        displayName: 'very very very very long category label',
                        isMeasure: true,
                        objects: { 'general': { formatString: '#0' } }
                    }],
                    objects: {
                        labels: {
                            show: true
                        }
                    }
                };

                cardBuilder = new CardBuilder(null, true);
                cardBuilder.metadata = metadata;
                cardBuilder.singleValue = "7";

                wordBreakSpy = spyOn(powerbi.TextMeasurementService, 'wordBreak');
                wordBreakSpy.and.callThrough();
            });

            describe('with wordBreak on', () => {
                beforeEach(() => {
                    metadata.objects['wordWrap'] = { show: true };
                });

                it('with the category label should call wordBreak for the value and category label', () => {
                    cardBuilder.onDataChanged();
                    expect(wordBreakSpy.calls.count()).toBe(2); // Once for the value and once for the category label
                });

                it('without the category label should call wordBreak for the only the value', () => {
                    metadata.objects['categoryLabels'] = {
                        show: false
                    };
                    cardBuilder.onDataChanged();
                    expect(wordBreakSpy.calls.count()).toBe(1); // Once for the value only
                });
            });
            
            it('with wordBreak off should not call wordBreak', () => {
                cardBuilder.onDataChanged();
                expect(wordBreakSpy).not.toHaveBeenCalled();
            });
        });

        it("does not change string values", (done) => {
            cardBuilder = new CardBuilder(null, true);

            let metadataWithDisplayUnits: powerbi.DataViewMetadata = {
                columns: [{ displayName: "col1", isMeasure: true }],
                objects: {
                    labels: {
                        labelDisplayUnits: 1000
                    },
                    categoryLabels: {
                        show: true
                    }
                }
            };

            cardBuilder.metadata = metadataWithDisplayUnits;
            cardBuilder.singleValue = "$9,999";

            cardBuilder.onDataChanged();

            setTimeout(() => {
                expect(helpers.findElementText($(".card .value").first())).toBe("$9,999");
                expect(helpers.findElementTitle($(".card .value").first())).toBe("$9,999");

                //display unit auto
                cardBuilder.metadata = dataViewMetadata;

                cardBuilder.onDataChanged();

                expect(helpers.findElementText($(".card .value").first())).toBe("$9,999");
                expect(helpers.findElementTitle($(".card .value").first())).toBe("$9,999");
                done();
            }, DefaultWaitForRender);
        });

        it("in small viewport state -  the labelPrecision,labelDisplayUnits are default", (done) => {
            cardBuilder = new CardBuilder(null, true, cardSmallViewportString, cardSmallViewportString, false, true);
            cardBuilder.metadata = dataViewMetadaWithCurrency;

            cardBuilder.singleValue = 23132601.339999925;
            cardBuilder.onDataChanged();

            setTimeout(() => {
                expect(helpers.findElementText($(".card .value").first())).toBe("$23M");
                done();
            }, DefaultWaitForRender);
        });

        it("not in small viewport state -  the labelPrecision,labelDisplayUnits are as defined by the user", (done) => {
            cardBuilder = new CardBuilder(null, true);
            cardBuilder.metadata = dataViewMetadaWithCurrency;

            cardBuilder.singleValue = 23132601.339999925;
            cardBuilder.setCurrentViewport(500, 500);
            cardBuilder.onDataChanged();

            setTimeout(() => {
                expect(helpers.findElementText($(".card .value").first())).toBe("$23,132,601.34");
                done();
            }, DefaultWaitForRender);
        });
    });

    describe("Card tests on Minerva", () => {
        let cardBuilder: CardBuilder;

        let dataViewMetadata: powerbi.DataViewMetadata = {
            columns: [{ displayName: "col1", isMeasure: true, objects: { "general": { formatString: "#0" } } }],
        };

        let labelStyles = Card.DefaultStyle.label;
        let valueStyles = Card.DefaultStyle.value;

        beforeEach(() => {
            cardBuilder = new CardBuilder(undefined, undefined, "200", "200", true);

            cardBuilder.metadata = dataViewMetadata;
        });

        it("Card on Canvas DOM validation", (done) => {
            cardBuilder.metadata = dataViewMetadata;
            cardBuilder.singleValue = 90;

            cardBuilder.onDataChanged();

            setTimeout(() => {
                expect($(".card")).toBeInDOM();
                expect($(".label")).toBeInDOM();
                expect($(".value")).toBeInDOM();
                expect($(".label").length).toBe(1);
                expect($(".value").length).toBe(1);

                expect(helpers.findElementText($(".label").first())).toBe("col1");
                expect(helpers.findElementTitle($(".label").first())).toBe("col1");

                expect(helpers.findElementText($(".value").first())).toBe("90");
                expect(helpers.findElementTitle($(".value").first())).toBe("90");

                done();
            }, DefaultWaitForRender);
        });

        it("Card on Canvas Style validation", (done) => {
            cardBuilder.singleValue = 900000;

            cardBuilder.onDataChanged();

            setTimeout(() => {
                expect($(".label")).toBeInDOM();
                expect($(".value")).toBeInDOM();
                expect(parseInt($(".label")[0].style.fontSize, 10)).toBe(labelStyles.textSize * 4 / 3);
                expect(parseInt($(".value")[0].style.fontSize, 10)).toBe(valueStyles.textSize * 4 / 3);
                expect($(".label")[0].style.fill).toBe(labelStyles.color);
                expect($(".value")[0].style.fill).toBe(valueStyles.color);
                expect($(".value")[0].style.fontFamily).toBe(valueStyles.fontFamily);
                done();
            }, DefaultWaitForRender);
        });

        it("Card with DateTime value on canvas", (done) => {
            let dateValue = new Date(2015, 5, 20);
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: "date", type: powerbi.ValueType.fromDescriptor({ dateTime: true }), isMeasure: true }
                ],
            };

            cardBuilder.metadata = dataViewMetadata;
            cardBuilder.singleValue = dateValue;

            cardBuilder.onDataChanged();

            setTimeout(() => {

                expect(helpers.findElementText($(".label").first())).toBe("date");
                expect(helpers.findElementText($(".value").first())).toBe("6/20/2015");

                expect(helpers.findElementTitle($(".label").first())).toBe("date");
                expect(helpers.findElementTitle($(".value").first())).toBe("6/20/2015");

                done();
            }, DefaultWaitForRender);
        });

        it("Card with KPI value on canvas", (done) => {
            cardBuilder.metadata = {
                columns: [
                    {
                        displayName: 'kpi name',
                        format: 'g',
                        kpi: {
                            graphic: 'Five Bars Colored'
                        },
                        isMeasure: true
                    }
                ]
            };
            cardBuilder.singleValue = 2;

            cardBuilder.onDataChanged();

            setTimeout(() => {
                expect($(".g text").length).toBe(0);
                let kpi = $(".caption .powervisuals-glyph");
                expect(kpi.length).toBe(1);
                expect(kpi.get(0).classList).toContain('big-kpi');
                done();
            }, DefaultWaitForRender);
        });

        it("Card with KPI value on canvas change font size", (done) => {
            cardBuilder.metadata = {
                columns: [
                    {
                        displayName: 'kpi name',
                        format: 'g',
                        kpi: {
                            graphic: 'Five Bars Colored'
                        },
                        isMeasure: true
                    }
                ],
                objects: {
                    labels: {
                        fontSize: 14
                    },
                }
            };

            cardBuilder.singleValue = 2;

            cardBuilder.onDataChanged();

            setTimeout(() => {
                expect($(".g text").length).toBe(0);
                let kpi = $(".caption .powervisuals-glyph");
                expect(kpi.length).toBe(1);
                expect(kpi.get(0).classList).toContain('big-kpi');
                expect(kpi.css('font-size')).toBe('19px');
                done();
            }, DefaultWaitForRender);
        });

        it("Card with zero currency value", (done) => {
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [
                    { displayName: "price", type: powerbi.ValueType.fromDescriptor({ numeric: true }), isMeasure: true, objects: { "general": { formatString: "$0" } } }
                ],
            };

            cardBuilder.metadata = dataViewMetadata;
            cardBuilder.singleValue = 0;

            cardBuilder.onDataChanged();

            setTimeout(() => {

                expect(helpers.findElementText($(".label").first())).toBe("price");
                expect(helpers.findElementText($(".value").first())).toBe("$0");

                expect(helpers.findElementTitle($(".label").first())).toBe("price");
                expect(helpers.findElementTitle($(".value").first())).toBe("$0");

                done();
            }, DefaultWaitForRender);
        });

        it("Card with null dataview", (done) => {
            cardBuilder.singleValue = 900;

            cardBuilder.onDataChanged();

            setTimeout(() => {
                expect(helpers.findElementText($(".value").first())).toBe("900");
                expect(helpers.findElementText($(".label").first())).toBe("col1");

                expect(helpers.findElementTitle($(".value").first())).toBe("900");
                expect(helpers.findElementTitle($(".label").first())).toBe("col1");

                cardBuilder.singleValue = null;
                cardBuilder.onDataChanged();

                setTimeout(() => {
                    expect(helpers.findElementText($(".value").first())).toBe("(Blank)");
                    expect(helpers.findElementText($(".label").first())).toBe("col1");

                    expect(helpers.findElementTitle($(".value").first())).toBe("(Blank)");
                    expect(helpers.findElementTitle($(".label").first())).toBe("col1");
                    done();
                }, DefaultWaitForRender);

            }, DefaultWaitForRender);
        });

        it("Card updated with undefined dataview", (done) => {
            cardBuilder.singleValue = 0;

            cardBuilder.onDataChanged();

            setTimeout(() => {
                expect(helpers.findElementText($(".value").first())).toBe("0");
                expect(helpers.findElementText($(".label").first())).toBe("col1");

                expect(helpers.findElementTitle($(".value").first())).toBe("0");
                expect(helpers.findElementTitle($(".label").first())).toBe("col1");

                cardBuilder.singleValue = undefined;
                cardBuilder.onDataChanged();

                setTimeout(() => {
                    expect($(".value").first().text()).toBe("");
                    expect($(".label").first().text()).toBe("");
                    done();
                }, DefaultWaitForRender);

            }, DefaultWaitForRender);
        });

        it("card with longer label and value", (done) => {
            let dataViewMetadata: powerbi.DataViewMetadata = {
                columns: [{ displayName: "this is the value that never ends, it just goes on and on my friends. Some axis started rendering it not knowing what it was, and now it keeps on rendering forever just because this the label that never ends", isMeasure: true, format: "#0" }],
            };

            cardBuilder.metadata = dataViewMetadata;
            cardBuilder.singleValue = "99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999";

            cardBuilder.onDataChanged();

            setTimeout(() => {

                // Note: the exact text will be different depending on the environment in which the test is run, so we can"t do an exact match.
                // Just check that the text is truncated with ellipses.
                let labelText = helpers.findElementText($(".label").first());
                let valueText = helpers.findElementText($(".value").first());

                let labelTitle = helpers.findElementTitle($(".label").first());
                let valueTitle = helpers.findElementTitle($(".value").first());

                expect(labelText.length).toBeLessThan(60);
                expect(valueText.length).toBeLessThan(30);
                expect(valueText.substr(valueText.length - 1)).toBe('…');
                expect(labelText.substr(labelText.length - 1)).toBe('…');
                expect(labelTitle).toBe(dataViewMetadata.columns[0].displayName);
                expect(valueTitle).toBe(cardBuilder.singleValue);

                done();
            }, DefaultWaitForRender);
        });

    });

    class CardBuilder {
        private element: JQuery;

        private isScrollable: boolean = false;

        private displayUnitSystemType: powerbi.DisplayUnitSystemType;

        private host: powerbi.IVisualHostServices;

        private style: powerbi.IVisualStyle;

        private isMinervaVisualPlugin: boolean = false;

        private isSmallViewport: boolean = false;

        private cardVisual: Card;

        public get card(): Card {
            return this.cardVisual;
        }

        public metadata: powerbi.DataViewMetadata;

        public singleValue: any;

        constructor(
            displayUnitSystemType?: powerbi.DisplayUnitSystemType,
            isScrollable?: boolean,
            height: string = "200",
            width: string = "300",
            isMinervaVisualPlugin: boolean = false,
            isSmallViewport: boolean = false) {

            this.isScrollable = isScrollable;
            this.displayUnitSystemType = displayUnitSystemType;
            this.isMinervaVisualPlugin = isMinervaVisualPlugin;
            this.isSmallViewport = isSmallViewport;

            this.element = powerbitests.helpers.testDom(height, width);
            this.host = mocks.createVisualHostServices();
            this.style = powerbi.visuals.visualStyles.create();

            this.buildCard();

            this.cardInit();
        }

        private buildCard(): void {
            if (this.isMinervaVisualPlugin) {
                this.buildMinervaCard();
            } else {
                if (this.isSmallViewport) {
                    this.buildSmallViewportCard();
                } else {
                    this.buildPlainCard();
                }
            }
        }

        private buildMinervaCard(): void {
            this.cardVisual = new Card({
                isScrollable: true,
                animator: new powerbi.visuals.BaseAnimator()
            });
        }

        private buildPlainCard(): void {
            this.cardVisual = <Card>new Card({
                displayUnitSystemType: this.displayUnitSystemType,
                isScrollable: this.isScrollable
            });
        }

        private buildSmallViewportCard(): void {
            this.cardVisual = <Card>new Card({
                displayUnitSystemType: this.displayUnitSystemType,
                isScrollable: this.isScrollable,
                cardSmallViewportProperties: { cardSmallViewportWidth: cardSmallViewportWidth }
            });
        }

        private cardInit(): void {
            this.card.init({
                element: this.element,
                host: this.host,
                style: this.style,
                viewport: {
                    height: this.element.height(),
                    width: this.element.width()
                },
                animation: { transitionImmediate: true }
            });
        }

        public setCurrentViewport(height: number, width: number): void {
            this.card.currentViewport = {
                height: height,
                width: width
            };
        }

        public onDataChanged(): void {
            this.card.onDataChanged({
                dataViews: [{
                    metadata: this.metadata,
                    single: {
                        value: this.singleValue
                    }
                }]
            });
        }

        public onResizing(
            height: number = this.element.height(),
            width: number = this.element.width()): void {
            this.card.onResizing({
                height: height,
                width: width
            });
        }
    }
}
