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
    powerbitests.mocks.setLocale();
    import VisualClass = powerbi.visuals.samples.WordCloud;
    import colorAssert = powerbitests.helpers.assertColorsMatch;
    import CountriesData = powerbitests.customVisuals.sampleDataViews.CountriesData;
    import VisualSettings = powerbi.visuals.samples.WordCloudSettings;

    describe("WordCloud", () => {
        let visualBuilder: WordCloudBuilder;
        let defaultDataViewBuilder: CountriesData;
        let dataView: powerbi.DataView;
        let settings:VisualSettings;

        beforeEach(() => {
            visualBuilder = new WordCloudBuilder(1000,500);
            defaultDataViewBuilder = new CountriesData();
            dataView = defaultDataViewBuilder.getDataView();
            settings = dataView.metadata.objects = <any>new VisualSettings();
        });

        describe('capabilities', () => {
            it("registered capabilities", () => expect(VisualClass.capabilities).toBeDefined());
        });

        // function that returns afghanistan from an array
        const func = e => e.innerHTML === "Afghanistan" || e.textContent === "Afghanistan";

        // function that uses grep to filter
        const grep = (val) => {
            return $.grep(val, func);
        };

        describe("DOM tests", () => {
            it("svg element created", () => expect(visualBuilder.mainElement[0]).toBeInDOM());

            it("basic update", (done) => {
                visualBuilder.updateRenderTimeout(dataView, () => {
                    expect(visualBuilder.wordsText.length)
                        .toBeGreaterThan(0);
                    done();
                });
            });

            it("Word stop property change", (done) => {
                visualBuilder.updateRenderTimeout(dataView, () => {
                    expect(grep(visualBuilder.wordsText.toArray()).length)
                        .toBeGreaterThan(0);

                    settings.stopWords.show = true;
                    settings.stopWords.words = "Afghanistan";

                    visualBuilder.updateRenderTimeout(dataView, () => {
                        expect(grep(visualBuilder.wordsText.toArray()).length)
                            .toBe(0);
                        done();
                    });
                }, 300);
            });

            it("Word returns after word stop property is changed back", (done) => {
                visualBuilder.updateRenderTimeout(dataView, () => {
                    expect(grep(visualBuilder.wordsText.toArray()).length)
                        .toBeGreaterThan(0);

                    settings.stopWords.show = true;
                    settings.stopWords.words = "Afghanistan";

                    visualBuilder.updateRenderTimeout(dataView, () => {
                        expect(grep(visualBuilder.wordsText.toArray()).length)
                            .toBe(0);

                        settings.stopWords.show = false;

                        visualBuilder.updateRenderTimeout(dataView, () => {
                            expect(grep(visualBuilder.wordsText.toArray()).length)
                                .toBeGreaterThan(0);
                            done();
                        });
                    }, 300);
                }, 300);
            });

            xit("change color for first country (Afghanistan)", (done) => {
                visualBuilder.updateRenderTimeout(dataView, () => {
                    let baseWordColor = $(grep(visualBuilder.wordsText.toArray())).css('fill');

                    dataView.categorical.categories[0].objects = [{ dataPoint: { fill: { solid: { color: "#00B8AA" } } } }];

                    visualBuilder.updateRenderTimeout(dataView, () => {
                        colorAssert($(grep(visualBuilder.wordsText.toArray())).css('fill'), baseWordColor);
                        done();
                    });
                }, 100);
            });

            it("click on first visual, then click on the second visual doesn't remove items", (done) => {
                let secondVisualBuilder = new WordCloudBuilder(500, 1000);

                visualBuilder.update(dataView);

                secondVisualBuilder.updateRenderTimeout(dataView, () => {
                    let firstWord = visualBuilder.wordsText.first();
                    firstWord.d3Click(parseInt(firstWord.attr("x"), 10), parseInt(firstWord.attr("y"), 10));
                    setTimeout(() => {
                        let secondWord = secondVisualBuilder.wordsText.first();
                        secondWord.d3Click(parseInt(secondWord.attr("x"), 10), parseInt(secondWord.attr("y"), 10));
                        setTimeout(() => {
                            expect(secondVisualBuilder.wordsText.length).toBe(
                                visualBuilder.wordsText.length);
                            done();
                        });
                    });
                }, 100);
            });

            it("click on first visual, then click on the second visual doesn't remove items", (done) => {
                defaultDataViewBuilder.valuesCategory = [
                    "car collision hallway fall crash hallway",
                    "car collision hallway hallway",
                    "car collision person person car injure"
                ];

                dataView = defaultDataViewBuilder.getDataView();

                visualBuilder.updateflushAllD3TransitionsRenderTimeout(dataView, () => {
                    var texts = visualBuilder.wordsText.toArray().map((e) => $(e).text());
                    expect(texts.length).toEqual(_.difference(texts).length);
                    done();
                }, 100);
            });

            it("multiple selection test", (done) => {
                visualBuilder.updateflushAllD3TransitionsRenderTimeout(dataView, () => {
                    visualBuilder.wordClick("Afghanistan");
                    helpers.renderTimeout(() => {
                        expect(visualBuilder.selectedWords.length).toBe(1);

                        visualBuilder.wordClick("Albania", true);
                        helpers.renderTimeout(() => {
                            expect(visualBuilder.selectedWords.length).toBe(2);

                            done();
                        });
                    });

                }, 300);
            });
        });
    });

    class WordCloudBuilder extends VisualBuilderBase<VisualClass> {
        constructor(width: number, height: number, isMinervaVisualPlugin: boolean = false) {
            super(width, height, isMinervaVisualPlugin);
        }

        protected build() {
            return new VisualClass();
        }

        public get mainElement() {
            return this.element.children("svg.wordCloud");
        }

        public get words() {
            return this.mainElement.children("g").children("g.words").children("g.word");
        }

        public get wordsText() {
            return this.words.children("text");
        }

        public get wordsRects() {
            return this.words.children("rect");
        }

        public wordClick(text: string, ctrl = false) {
            var elements = this.words.toArray().filter(e => $(e).children("text").text() === text);
            if(_.isEmpty(elements)) {
                return;
            }

            var element = $(elements[0]).children("rect");

            element.d3Click(
                parseFloat(element.attr("x")),
                parseFloat(element.attr("y")),
                ctrl ? powerbitests.helpers.ClickEventType.CtrlKey : undefined);
        }

        public get selectedWords() {
            return this.wordsText.filter((i, e) => parseFloat($(e).css('fill-opacity')) === 1);
        }
    }
}
