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
    import DOMConstants = jsCommon.DOMConstants;
    import Textbox = powerbi.visuals.Textbox;
    import textboxCapabilities = powerbi.visuals.textboxCapabilities;
    import RichText = powerbi.visuals.RichText;
    import IVisualHostServices = powerbi.IVisualHostServices;
    import Paragraph = powerbi.Paragraph;

    describe("Textbox", () => {
        const viewport: powerbi.IViewport = {
            height: 500,
            width: 500
        };
        let style = powerbi.visuals.visualStyles.create();

        describe("capabilities", () => {
            it("should suppress title", () => {
                expect(textboxCapabilities.suppressDefaultTitle).toBe(true);
            });

            it("should register capabilities", () => {
                let plugin = powerbi.visuals.plugins.textbox;

                expect(plugin).toBeDefined();
                expect(plugin.capabilities).toBe(textboxCapabilities);
            });

            it("should not support format painter copy", () => {
                expect(textboxCapabilities.objects.general.properties["paragraphs"].suppressFormatPainterCopy).toBe(true);
            });
        });

        // Chutzpah is configured to load the quill resources for these tests.
        powerbi.visuals.RichText.QuillWrapper.loadQuillResources = false;

        // ---- Sample data ----
        // 2 paragraphs, no formatting.
        let paragraphs1: Paragraph[] = [
            {
                textRuns: [
                    { value: "foo" },
                    { value: "bar" }
                ]
            },
            {
                textRuns: [
                    { value: "baz" }
                ]
            }
        ];

        // 2 paragraphs, with formatting
        let paragraphs2: Paragraph[] = [
            {
                textRuns: [
                    { value: "foo", textStyle: { fontWeight: "bold" } },
                    { value: "bar", textStyle: { fontStyle: "italic" } },
                    { value: "baz", textStyle: { textDecoration: "underline" } }
                ]
            },
            {
                textRuns: [
                    { value: "Power BI", url: "http://www.powerbi.com" }
                ],
                horizontalTextAlignment: "center"
            }
        ];

        // 1 paragraph with an unformatted url.
        let paragraphs3: Paragraph[] = [
            {
                textRuns: [
                    { value: "http://www.powerbi.com" }
                ]
            }
        ];

        // 2 paragraphs, with spacing for testing cursor inside text
        let paragraphs4: Paragraph[] = [
            {
                textRuns: [
                    { value: "foo" },
                    { value: " " },
                    { value: "bar" }
                ]
            }
        ];

        // text with space surroudned by space for testing special empty word break
        let paragraphs5: Paragraph[] = [
            {
                textRuns: [
                    { value: "foo    bar" }
                ]
            }
        ];

        // 1 paragraph, with invalid url
        let paragraphs6: Paragraph[] = [
            {
                textRuns: [
                    { value: "Power BI", url: "javascript:document.write('hack');" }
                ],
            }
        ];

        describe("", () => {
            let host: IVisualHostServices;
            let $element: JQuery;
            let $toolbar: JQuery;
            let initOptions: powerbi.VisualInitOptions;

            let textbox: Textbox;
            let getViewModeSpy: jasmine.Spy;
            let setToolbarSpy: jasmine.Spy;

            beforeEach(() => {
                host = mocks.createVisualHostServices();
                $element = helpers.testDom("500", "500");

                initOptions = {
                    element: $element,
                    host: host,
                    viewport: viewport,
                    style: style
                };

                getViewModeSpy = spyOn(host, "getViewMode");
                setToolbarSpy = spyOn(host, "setToolbar");
                setToolbarSpy.and.callFake((t) => $toolbar = t);
            });

            describe("init in view mode", () => {
                beforeEach(() => {
                    getViewModeSpy.and.returnValue(powerbi.ViewMode.View);

                    textbox = new Textbox();
                    textbox.init(initOptions);
                });

                it("should not show editor", () => verifyEditor($element, false));

                it("change to edit-mode should show editor", () => {
                    switchToViewMode(powerbi.ViewMode.Edit);
                    verifyEditor($element, true);
                });

                describe("on data changed", () => {
                    it("with non-empty dataview should set content", () => {
                        textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs1) });

                        let $divs = getViewModeParagraphDivs($element);

                        expect($divs.length).toBe(2);

                        let $paragraph1 = $divs.eq(0);
                        expect($paragraph1.text()).toEqual("foobar");

                        let $paragraph2 = $divs.eq(1);
                        expect($paragraph2.text()).toEqual("baz");
                    });

                    it("with empty dataview should clear content", () => {
                        textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs1) });

                        // Clear the content.
                        textbox.onDataChanged({ dataViews: [] });

                        expect(getViewModeParagraphDivs($element).text()).toEqual("");
                    });

                    it("with formatted text should render correctly", () => {
                        textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs2) });

                        let $divs = getViewModeParagraphDivs($element);

                        expect($divs.length).toBe(2);

                        let $paragraph1 = $divs.eq(0);
                        let $paragraph1Spans = $paragraph1.children();
                        expect($paragraph1Spans.length).toBe(3);

                        let $fooRun = $paragraph1Spans.eq(0);
                        expect(hasBold($fooRun)).toBeTruthy();

                        let $barRun = $paragraph1Spans.eq(1);
                        expect(hasItalic($barRun)).toBeTruthy();

                        let $bazRun = $paragraph1Spans.eq(2);
                        expect(hasUnderline($bazRun)).toBeTruthy();

                        let $paragraph2 = $divs.eq(1);
                        let $paragraph2Spans = $paragraph2.children();
                        expect($paragraph2Spans.length).toBe(1);

                        let $urlRun = $paragraph2Spans.eq(0);
                        expect($urlRun.text()).toEqual("Power BI");
                        expect(getUrl($urlRun)).toEqual("http://www.powerbi.com");
                    });

                    it('should not diplay invalid urls', () => {
                        textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs6) });

                        let $divs = getViewModeParagraphDivs($element);

                        let $paragraph1 = $divs.eq(0);
                        let $urlRun = $paragraph1.children().eq(0);
                        expect($urlRun.text()).toEqual("Power BI");
                        expect(getUrl($urlRun)).toBeUndefined();
                    });

                    describe("theme font", () => {
                        it("\"Heading\" should render correctly", () => {
                            let paragraphsWithHeading: Paragraph[] = [
                                {
                                    textRuns: [
                                        { value: "Some text", textStyle: { fontFamily: "Heading" } }
                                    ]
                                }
                            ];

                            textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphsWithHeading) });

                            let $divs = getViewModeParagraphDivs($element);
                            let $span = $divs.children("span").eq(0);

                            expect(getFont($span)).toEqual(powerbi.visuals.Font.Family.light.css);
                        });

                        it("\"Body\" should render correctly", () => {
                            let paragraphsWithBody: Paragraph[] = [
                                {
                                    textRuns: [
                                        { value: "Some text", textStyle: { fontFamily: "Body" } }
                                    ]
                                }
                            ];

                            textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphsWithBody) });

                            let $divs = getViewModeParagraphDivs($element);
                            let $span = $divs.children("span").eq(0);

                            expect(getFont($span)).toEqual(powerbi.visuals.Font.Family.regular.css);
                        });
                    });
                });
            });

            describe("init in edit mode", () => {
                beforeEach(() => {
                    getViewModeSpy.and.returnValue(powerbi.ViewMode.Edit);

                    textbox = new Textbox();
                    textbox.init(initOptions);
                });

                it("should show editor", () => verifyEditor($element, true));

                it("should register the toolbar", () => expect($toolbar).toBeDefined());

                it("change to view-mode should unregister the toolbar", () => {
                    switchToViewMode(powerbi.ViewMode.View);
                    expect($toolbar).toBeNull();
                });

                it("calling focus() should put focus in the editor", () => {
                    let editor = getEditor($element).get(0);
                    expect(document.activeElement).not.toBe(editor);
                    textbox.focus();
                    expect(document.activeElement).toBe(editor);
                });

                it("editor should be full size", () => {
                    let container = $element.find(".ql-container").parent();
                    expect(container.outerWidth()).toBe(500);
                    expect(container.outerHeight()).toBe(500);
                });

                it("change to view-mode should not show editor", () => {
                    switchToViewMode(powerbi.ViewMode.View);
                    verifyEditor($element, false);
                });

                xit("change to view-mode should format any urls", () => {
                    textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs3) });

                    switchToViewMode(powerbi.ViewMode.View);

                    let $divs = getViewModeParagraphDivs($element);
                    let $urlRun = $divs.children("span").eq(0);
                    expect(getUrl($urlRun)).toEqual("http://www.powerbi.com");
                });

                it("change to view-mode should save content", () => {
                    let changes: powerbi.VisualObjectInstance[] = [];
                    spyOn(host, "persistProperties").and.callFake((c) => changes = c);

                    textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs2) });

                    switchToViewMode(powerbi.ViewMode.View);

                    expect(changes).toHaveLength(1);
                });

                it("change to view-mode should preserve empty lines", () => {
                    let paragraphs: Paragraph[] = [
                        {
                            textRuns: [
                                { value: "line 1" }
                            ]
                        }, {
                            textRuns: [
                                { value: "" }
                            ]
                        }, {
                            textRuns: [
                                { value: "line 2" }
                            ]
                        }
                    ];

                    textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs) });

                    switchToViewMode(powerbi.ViewMode.View);

                    let $divs = getViewModeParagraphDivs($element);

                    expect($divs.length).toBe(3);

                    expect($divs.eq(0).text()).toEqual("line 1");
                    expect($divs.eq(1).text()).toEqual("");
                    expect($divs.eq(2).text()).toEqual("line 2");
                });

                it("keyboard shortcuts are prevented from bubbling", () => {
                    let $editor = getEditor($element);

                    let keydown = false;
                    $element.on("keydown", () => {
                        keydown = true;
                    });

                    // verify that some keys do bubble.
                    let event = $.Event("keydown");
                    event.ctrlKey = true;
                    event.which = 83;  // S

                    $editor.trigger(event);
                    expect(keydown).toBeTruthy();

                    // verify that prevented keys do not bubble.
                    keydown = false;

                    let keys: number[] = [
                        DOMConstants.aKeyCode,
                        DOMConstants.cKeyCode,
                        DOMConstants.xKeyCode,
                        DOMConstants.vKeyCode
                    ];
                    for (let key of keys) {
                        let event = $.Event("keydown");
                        event.ctrlKey = true;
                        event.which = key;

                        $editor.trigger(event);

                        expect(keydown).toBeFalsy();
                    }
                });

                it("arrow keys and shift are prevented from bubbling", () => {
                    let $editor = getEditor($element);

                    let keydown = false;
                    $element.on("keydown", () => {
                        keydown = true;
                    });

                    // verify that prevented keys do not bubble.
                    keydown = false;
                    let arrowKeys = [
                        DOMConstants.upArrowKeyCode,
                        DOMConstants.downArrowKeyCode,
                        DOMConstants.rightArrowKeyCode,
                        DOMConstants.leftArrowKeyCode,
                        DOMConstants.shiftKeyCode
                    ];

                    for (let key of arrowKeys) {
                        let event = $.Event("keydown");
                        event.which = key;

                        $editor.trigger(event);

                        expect(keydown).toBe(false);
                    }
                });

                describe("on data changed", () => {
                    it("with non-empty dataview should set content", () => {
                        textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs1) });

                        let $divs = getEditModeParagraphDivs($element);

                        expect($divs.eq(0).text()).toEqual("foobar");
                        expect($divs.eq(1).text()).toBe("baz");
                    });

                    it("with empty dataview should clear content", () => {
                        textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs1) });

                        // Clear the content.
                        textbox.onDataChanged({ dataViews: [] });

                        expect(getEditModeParagraphDivs($element).text()).toEqual("");
                    });

                    it("with formatted text should render correctly", () => {
                        textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs2) });

                        let $divs = getEditModeParagraphDivs($element);

                        expect($divs.length).toBe(2);

                        let $paragraph1 = $divs.eq(0);
                        let $paragraph1Spans = $paragraph1.children();
                        expect($paragraph1Spans.length).toBe(3);

                        let $fooRun = $paragraph1Spans.eq(0);
                        expect(hasBold($fooRun)).toBeTruthy();

                        let $barRun = $paragraph1Spans.eq(1);
                        expect(hasItalic($barRun)).toBeTruthy();

                        let $bazRun = $paragraph1Spans.eq(2);
                        expect(hasUnderline($bazRun)).toBeTruthy();

                        let $paragraph2 = $divs.eq(1);
                        let $urlRun = $paragraph2;
                        expect($urlRun.text()).toEqual("Power BI");
                        expect(getUrl($urlRun)).toEqual("http://www.powerbi.com");
                    });

                    it('should not diplay invalid urls', () => {
                        textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs6) });

                        let $divs = getEditModeParagraphDivs($element);

                        let $urlRun = $divs.eq(0);
                        expect($urlRun.text()).toEqual("Power BI");
                        expect(getUrl($urlRun)).toBeUndefined();
                    });
                });
            });

            describe('saving paragraphs', () => {
                beforeEach(() => {
                    // We save contents by starting in Edit mode and switching to View mode
                    getViewModeSpy.and.returnValue(powerbi.ViewMode.Edit);

                    textbox = new Textbox();
                    textbox.init(initOptions);
                });

                it("change to view-mode should save content", () => {
                    let changes = saveContents(paragraphs2);

                    expect(changes).toHaveLength(1);

                    let change = changes[0];
                    expect(change.objectName).toEqual("general");

                    let paragraphs: Paragraph[] = (<any>change.properties).paragraphs;
                    expect(paragraphs.length).toBe(2);
                    expect(paragraphs[0].horizontalTextAlignment).toBeFalsy();
                    expect(paragraphs[0].textRuns.length).toBe(3);

                    expect(paragraphs[0].textRuns[0].value).toBe("foo");
                    expect(paragraphs[0].textRuns[0].textStyle).toEqual({ fontWeight: "bold" });
                    expect(paragraphs[0].textRuns[0].url).toBeFalsy();

                    expect(paragraphs[0].textRuns[1].value).toBe("bar");
                    expect(paragraphs[0].textRuns[1].textStyle).toEqual({ fontStyle: "italic" });
                    expect(paragraphs[0].textRuns[1].url).toBeFalsy();

                    expect(paragraphs[0].textRuns[2].value).toBe("baz");
                    expect(paragraphs[0].textRuns[2].textStyle).toEqual({ textDecoration: "underline" });
                    expect(paragraphs[0].textRuns[2].url).toBeFalsy();

                    expect(paragraphs[1].horizontalTextAlignment).toEqual("center");
                    expect(paragraphs[1].textRuns[0].value).toBe("Power BI");
                    expect(paragraphs[1].textRuns[0].textStyle).toEqual({});
                    expect(paragraphs[1].textRuns[0].url).toEqual("http://www.powerbi.com");
                });

                it("font names should be saved without quotes", () => {
                    let changes = saveContents([{
                        textRuns: [
                            { value: "foo", textStyle: { fontFamily: "'Comic Sans'" } },
                        ]
                    }]);

                    expect(changes).toHaveLength(1);

                    let change = changes[0];
                    expect(change.objectName).toEqual("general");

                    let paragraphs: Paragraph[] = (<any>change.properties).paragraphs;
                    expect(paragraphs.length).toBe(1);
                    expect(paragraphs[0].textRuns.length).toBe(1);

                    expect(paragraphs[0].textRuns[0].value).toBe("foo");
                    expect(paragraphs[0].textRuns[0].textStyle).toEqual({ fontFamily: "Comic Sans" });  // No quotes
                });

                it("built-in font names should be translated", () => {
                    let changes = saveContents([{
                        textRuns: [
                            { value: "foo", textStyle: { fontFamily: powerbi.visuals.Font.Family.regular.css } },
                        ]
                    }]);

                    expect(changes).toHaveLength(1);

                    let change = changes[0];
                    expect(change.objectName).toEqual("general");

                    let paragraphs: Paragraph[] = (<any>change.properties).paragraphs;
                    expect(paragraphs.length).toBe(1);
                    expect(paragraphs[0].textRuns.length).toBe(1);
                    expect(paragraphs[0].textRuns[0].textStyle).toEqual({ fontFamily: "Segoe UI" });
                });

                function saveContents(paragraphs: Paragraph[]): powerbi.VisualObjectInstance[] {
                    textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs) });

                    let changes: powerbi.VisualObjectInstance[];
                    let persistPropertiesSpy = spyOn(host, "persistProperties");
                    persistPropertiesSpy.and.callFake((c) => changes = c);

                    switchToViewMode(powerbi.ViewMode.View);
                    expect(persistPropertiesSpy).toHaveBeenCalled();

                    return changes;
                }
            });

            describe("toolbar", () => {
                beforeEach(() => {
                    getViewModeSpy.and.returnValue(powerbi.ViewMode.Edit);

                    textbox = new Textbox();
                    textbox.init(initOptions);
                });

                it("should exist with formatting options", () => {
                    let $toolbar = getToolbar();
                    expect($toolbar).toBeDefined();

                    expect(boldButton($toolbar)).toBeDefined();
                    expect(italicButton($toolbar)).toBeDefined();
                    expect(underlineButton($toolbar)).toBeDefined();

                    expect(fontSelect($toolbar)).toBeDefined();
                    expect(fontSizeSelect($toolbar)).toBeDefined();

                    expect(textAlignmentSelect($toolbar)).toBeDefined();
                });

                it("mousedown on insert link should set focus to editor", () => {
                    let toolbar = getToolbar();

                    // Set focus to document body
                    (<HTMLElement>document.activeElement).blur();
                    expect(document.activeElement).toBe(document.body);

                    mousedownLinkButton(toolbar);
                    expect(document.activeElement).toBe(getEditor($element).get(0));
                });

                describe('with empty textbox', () => {
                    let toolbar;
                    let tooltip;
                    let done;
                    let linkButton;
                    let linkInput;
                    let $divs;

                    beforeEach(() => {
                        toolbar = getToolbar();
                        toolbar = toolbar.appendTo($element.parent());

                        tooltip = getToolbarLinkTooltip(toolbar);
                        done = getLinkDoneButton(toolbar);
                        linkButton = getLinkButton(toolbar);
                        linkInput = getLinkInput(toolbar);
                        $divs = getEditModeParagraphDivs($element);

                        expect($divs.text()).toBe("");
                        expect(tooltip.hasClass("editing")).toBeFalsy();
                    });

                    describe('with focus outside editor', () => {
                        beforeEach(() => {    
                            // Set focus to document body
                            (<HTMLElement>document.activeElement).blur();
                            expect(document.activeElement).toBe(document.body);
                        });

                        it("mousedown on insert link should focus editor", () => {

                            mousedownLinkButton(toolbar);
                            expect(document.activeElement).toBe(getEditor($element).get(0));
                        });

                        it("click on insert link should begin default url input", () => {
                            linkButton.find("div").click();

                            expect(tooltip.hasClass("editing")).toBeTruthy();
                            expect(document.activeElement).toBe(linkInput.get(0));
                        });
                    });

                    describe('clicking insert link', () => {
                        beforeEach(() => {
                            linkButton.find("div").click();
                        });

                        it('should begin editing in url input field', () => {
                            expect(tooltip.hasClass("editing")).toBeTruthy();
                        });

                        it('should focus url input field', () => {
                            expect(document.activeElement).toBe(linkInput.get(0));
                        });

                        it('should start with default url input value', () => {
                            expect(linkInput.eq(0).val()).toBe('http://');
                        });

                        it('blur should exit the link input', () => {
                            let microsoft = 'http://www.microsoft.com';
                            linkInput.val(microsoft);

                            linkInput.blur();

                            expect(tooltip.hasClass("editing")).toBeFalsy();
                            expect(document.activeElement).toBe(document.body);

                            $divs = getEditModeParagraphDivs($element);
                            let anchors = $divs.find("a");
                            expect(anchors.length).toBe(0);
                            expect($divs.text()).toBe('');
                        });

                        it('mousedown on done should insert input value into editor', () => {
                            let microsoft = 'http://www.microsoft.com';
                            linkInput.val(microsoft);

                            done.mousedown();

                            $divs = getEditModeParagraphDivs($element);
                            let anchors = $divs.find("a");
                            expect(anchors.length).toBe(1);
                            expect(anchors.eq(0).attr("href")).toBe(microsoft);
                            expect(anchors.eq(0).html()).toBe(microsoft);
                        });

                        it('inserting link should save', () => {
                            let microsoft = 'http://www.microsoft.com';
                            linkInput.val(microsoft);

                            let persistPropertiesSpy = spyOn(host, "persistProperties");

                            done.mousedown();

                            expect(persistPropertiesSpy).toHaveBeenCalled();
                        });

                        it('enter key should insert input value into editor', () => {
                            let microsoft = 'http://www.microsoft.com';
                            linkInput.val(microsoft);

                            // Fire enter key
                            let event = $.Event("keydown");
                            event.which = event.keyCode = 13;  // Enter key
                            linkInput.trigger(event);

                            $divs = getEditModeParagraphDivs($element);
                            let anchors = $divs.find("a");
                            expect(anchors.length).toBe(1);
                            expect(anchors.eq(0).attr("href")).toBe(microsoft);
                            expect(anchors.eq(0).html()).toBe(microsoft);
                        });
                    });
                });

                describe("with cursor in blank space surrounded by blank space", () => {
                    beforeEach(() => {
                        textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs5) });
                        textbox.setSelection(4, 4);
                    });

                    describe("clicking insert link", () => {
                        beforeEach(() => {
                            clickLinkButton(getToolbar());
                        });

                        it("should enter link insert with no text", () => {
                            let input = getLinkInput(getToolbar());
                            let content = getEditModeParagraphDivs($element).eq(0);
                            let anchors = content.find("a");

                            expect(input.val()).toBe("http://");
                            expect(content.text()).toEqual("foo    bar");
                            expect(anchors.length).toBe(0);
                        });

                        it("and mousedown on done should insert link", () => {
                            let input = getLinkInput(getToolbar());
                            input.val('http://another-url.com');

                            getLinkDoneButton(getToolbar()).mousedown();

                            let content = getEditModeParagraphDivs($element).eq(0);
                            let anchors = content.find("a");

                            expect(content.get(0).innerText).toEqual("foo http://another-url.com   bar");
                            expect(anchors.length).toBe(1);
                            expect(anchors.eq(0).text()).toBe("http://another-url.com");
                            expect(anchors.eq(0).attr("href")).toBe("http://another-url.com");
                        });
                    });
                });

                describe("with cursor inside text", () => {
                    beforeEach(() => {
                        textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs4) });
                        textbox.setSelection(2, 2);
                    });

                    describe("clicking insert link", () => {
                        beforeEach(() => {
                            clickLinkButton(getToolbar());
                        });

                        it("should enter link insert with text nearest cursor", () => {
                            let input = getLinkInput(getToolbar());
                            let content = getEditModeParagraphDivs($element).eq(0);
                            let anchors = content.find("a");

                            expect(input.val()).toBe("http://foo");
                            expect(content.text()).toEqual("foo bar");
                            expect(anchors.length).toBe(0);
                        });

                        it("and clicking done should set link", () => {
                            getLinkDoneButton(getToolbar())[0].click();

                            let content = getEditModeParagraphDivs($element).eq(0);
                            let anchors = content.find("a");

                            expect(content.text()).toEqual("foo bar");
                            expect(anchors.length).toBe(1);
                            expect(anchors.eq(0).text()).toBe("foo");
                            expect(anchors.eq(0).attr("href")).toBe("http://foo");
                        });
                    });
                });

                describe("with selected text", () => {
                    beforeEach(() => {
                        textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs1) });
                        textbox.setSelection(0, 5);
                    });

                    describe("clicking bold", () => {
                        beforeEach(() => {
                            boldButton(getToolbar()).click();
                        });

                        it("should bold selection in editor", () => {
                            let $paragraph1 = getEditModeParagraphDivs($element).eq(0);
                            expect($paragraph1.text()).toBe("foobar");

                            let $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual("fooba");
                            expect(hasBold($spans.eq(0))).toBeTruthy();
                        });

                        it("should bold text in view-mode", () => {
                            switchToViewMode(powerbi.ViewMode.View);

                            let $paragraph1 = getViewModeParagraphDivs($element).eq(0);
                            expect($paragraph1.text()).toBe("foobar");

                            let $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual("fooba");
                            expect(hasBold($spans.eq(0))).toBeTruthy();
                        });
                    });

                    describe("clicking italic", () => {
                        beforeEach(() => {
                            italicButton(getToolbar()).click();
                        });

                        it("should italicize selection in editor", () => {
                            let $paragraph1 = getEditModeParagraphDivs($element).eq(0);
                            expect($paragraph1.text()).toBe("foobar");

                            let $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual("fooba");
                            expect(hasItalic($spans.eq(0))).toBeTruthy();
                        });

                        it("should italicize text in view-mode", () => {
                            switchToViewMode(powerbi.ViewMode.View);

                            let $paragraph1 = getViewModeParagraphDivs($element).eq(0);
                            expect($paragraph1.text()).toBe("foobar");

                            let $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual("fooba");
                            expect(hasItalic($spans.eq(0))).toBeTruthy();
                        });
                    });

                    describe("clicking underline", () => {
                        beforeEach(() => {
                            underlineButton(getToolbar()).click();
                        });

                        it("should underline selection in editor", () => {
                            let $paragraph1 = getEditModeParagraphDivs($element).eq(0);
                            expect($paragraph1.text()).toBe("foobar");

                            let $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual("fooba");
                            expect(hasUnderline($spans.eq(0))).toBeTruthy();
                        });

                        it("should underline text in view-mode", () => {
                            switchToViewMode(powerbi.ViewMode.View);

                            let $paragraph1 = getViewModeParagraphDivs($element).eq(0);
                            expect($paragraph1.text()).toBe("foobar");

                            let $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual("fooba");
                            expect(hasUnderline($spans.eq(0))).toBeTruthy();
                        });
                    });

                    describe("changing font", () => {
                        let fontFace = "Symbol";

                        beforeEach(() => {
                            setSelectValue(fontSelect(getToolbar()), fontFace);
                        });

                        it("should change font in editor", () => {
                            let $paragraph1 = getEditModeParagraphDivs($element).eq(0);
                            expect($paragraph1.text()).toBe("foobar");

                            let $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual("fooba");
                            expect(getFont($spans.eq(0))).toEqual(fontFace);

                            expect(getSelectText(fontSelect(getToolbar()))).toEqual(fontFace);
                        });

                        it("should change font in view-mode", () => {
                            switchToViewMode(powerbi.ViewMode.View);

                            let $paragraph1 = getViewModeParagraphDivs($element).eq(0);
                            expect($paragraph1.text()).toBe("foobar");

                            let $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual("fooba");
                            expect(getFont($spans.eq(0))).toEqual(fontFace);
                        });
                    });

                    describe("changing font (embedded)", () => {
                        let fontFace = powerbi.visuals.Font.Family.regular.css;

                        beforeEach(() => {
                            setSelectValue(fontSelect(getToolbar()), fontFace);
                        });

                        it("should change font in editor", () => {
                            let $paragraph1 = getEditModeParagraphDivs($element).eq(0);
                            expect($paragraph1.text()).toBe("foobar");

                            let $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual("fooba");
                            expect(getFont($spans.eq(0))).toEqual(fontFace);

                            expect(getSelectText(fontSelect(getToolbar()))).toEqual("Segoe UI");
                        });

                        it("should change font in view-mode", () => {
                            switchToViewMode(powerbi.ViewMode.View);

                            let $paragraph1 = getViewModeParagraphDivs($element).eq(0);
                            expect($paragraph1.text()).toBe("foobar");

                            let $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual("fooba");
                            expect(getFont($spans.eq(0))).toEqual(fontFace);
                        });
                    });

                    describe("changing font size", () => {
                        let fontSize = "24px";

                        beforeEach(() => {
                            setSelectValue(fontSizeSelect(getToolbar()), fontSize);
                        });

                        it("should change font size in editor", () => {
                            let $paragraph1 = getEditModeParagraphDivs($element).eq(0);
                            expect($paragraph1.text()).toBe("foobar");

                            let $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual("fooba");
                            expect(getFontSize($spans.eq(0))).toEqual(fontSize);

                            expect(getSelectText(fontSizeSelect(getToolbar()))).toEqual("24");
                        });

                        it("should change font size in view-mode", () => {
                            switchToViewMode(powerbi.ViewMode.View);

                            let $paragraph1 = getViewModeParagraphDivs($element).eq(0);
                            expect($paragraph1.text()).toBe("foobar");

                            let $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual("fooba");
                            expect(getFontSize($spans.eq(0))).toEqual(fontSize);
                        });
                    });

                    describe("changing text alignment", () => {
                        let alignment = "center";

                        beforeEach(() => {
                            setSelectValue(textAlignmentSelect(getToolbar()), alignment);
                        });

                        it("should change text alignment in editor", () => {
                            let $paragraph1 = getEditModeParagraphDivs($element).eq(0);

                            // NOTE: Changes alignment for the entire paragraph.
                            expect($paragraph1.text()).toEqual("foobar");
                            expect(getTextAlignment($paragraph1)).toEqual(alignment);

                            expect(getSelectText(textAlignmentSelect(getToolbar()))).toEqual("Center");
                        });

                        it("should change text alignment in view-mode", () => {
                            switchToViewMode(powerbi.ViewMode.View);

                            let $paragraph1 = getViewModeParagraphDivs($element).eq(0);
                            
                            // NOTE: Changes alignment for the entire paragraph.
                            expect($paragraph1.text()).toEqual("foobar");
                            expect(getTextAlignment($paragraph1)).toEqual(alignment);
                        });
                    });

                    describe("clicking insert link", () => {
                        beforeEach(() => {
                            getLinkButton(getToolbar()).click();
                        });

                        it("and blurring input field should cancel insert link", () => {
                            let $divs = getEditModeParagraphDivs($element);
                            let $paragraph1 = $divs.eq(0);
                            expect($paragraph1.text()).toBe("foobar");

                            let blurEvent = createMouseEvent("blur", document.body);
                            getLinkInput(getToolbar())[0].dispatchEvent(blurEvent);

                            let $spans = $paragraph1.children();
                            expect($spans.length).toBe(0);
                            expect($paragraph1.text()).toBe("foobar");
                            expect($paragraph1.find("a").length).toBe(0);
                        });

                        it("and clicking done should set link", () => {
                            let $divs = getEditModeParagraphDivs($element);
                            let $paragraph1 = $divs.eq(0);
                            expect($paragraph1.text()).toBe("foobar");

                            getLinkDoneButton(getToolbar())[0].click();

                            let $spans = $paragraph1.children();
                            expect($spans.length).toBeGreaterThan(0);
                            expect($spans.eq(0).text()).toEqual("fooba");
                            expect(getUrl($spans.eq(0))).toBe("http://fooba");
                        });
                    });
                });

                describe("with cursor inside link", () => {
                    let linkButton: JQuery;

                    beforeEach(() => {
                        linkButton = getLinkButton(getToolbar());
                        textbox.onDataChanged({ dataViews: buildParagraphsDataView(paragraphs2) });
                        textbox.setSelection(12, 12);
                    });

                    it("link button should be active", () => {
                        expect(linkButton.hasClass("ql-active")).toBeTruthy();
                    });

                    it("clicking remove should remove link", () => {
                        let $divs = getEditModeParagraphDivs($element);
                        let removeButton = getLinkRemoveButton(getToolbar());

                        expect($divs.find("a").length).toBe(1);

                        removeButton[0].click();

                        expect($divs.find("a").length).toBe(0);
                    });

                    describe("clicking insert link", () => {
                        beforeEach(() => {
                            linkButton.find("div")[0].click();
                        });

                        it("should allow editing link", () => {
                            let toolbar = getToolbar();
                            let tooltip = getToolbarLinkTooltip(toolbar);
                            let input = getLinkInput(toolbar);
                            expect(tooltip.hasClass("editing")).toBeTruthy();

                            input.val("http://foo/bar.baz");
                            getLinkDoneButton(toolbar)[0].click();

                            let $divs = getEditModeParagraphDivs($element);
                            let anchors = $divs.find("a");
                            expect(anchors.length).toBe(1);
                            expect(anchors.eq(0).attr("href")).toBe("http://foo/bar.baz");
                        });
                    });
                });

                function getToolbar(): JQuery {
                    return $toolbar;
                }

                function boldButton($toolbar: JQuery): JQuery {
                    return $toolbar.find(".ql-bold");
                }

                function italicButton($toolbar: JQuery): JQuery {
                    return $toolbar.find(".ql-italic");
                }

                function underlineButton($toolbar: JQuery): JQuery {
                    return $toolbar.find(".ql-underline");
                }

                function fontSelect($toolbar: JQuery): JQuery {
                    return $toolbar.find(".ql-font");
                }

                function fontSizeSelect($toolbar: JQuery): JQuery {
                    return $toolbar.find(".ql-size");
                }

                function textAlignmentSelect($toolbar: JQuery): JQuery {
                    return $toolbar.find(".ql-align");
                }

                function getToolbarLinkTooltip($toolbar: JQuery): JQuery {
                    return $toolbar.find(".toolbar-url-input .ql-link-tooltip");
                }

                function getLinkButton($toolbar: JQuery): JQuery {
                    return $toolbar.find(".toolbar-url-input .ql-link");
                }

                function getLinkInput($toolbar: JQuery): JQuery {
                    return $toolbar.find(".toolbar-url-input .input");
                }

                function getLinkDoneButton($toolbar: JQuery): JQuery {
                    return $toolbar.find(".toolbar-url-input .done");
                }

                function getLinkRemoveButton($toolbar: JQuery): JQuery {
                    return $toolbar.find(".toolbar-url-input .remove");
                }

                function clickLinkButton($toolbar: JQuery) {
                    let linkButton = getLinkButton($toolbar);

                    linkButton.find("div").mousedown();
                    linkButton.find("div").click();
                    linkButton.click();
                }

                function mousedownLinkButton($toolbar: JQuery) {
                    let linkButton = getLinkButton($toolbar);

                    linkButton.find("div").mousedown();
                }

                function setSelectValue($select: JQuery, value: any): void {    
                    // See powerbi.visuals.RichText.Toolbar.setSelectValue() for description.
                    // NOTE: For unit tests case we have to use document.createEvent() because PhantomJS does
                    // not appear to support new UIEvent (https://github.com/ariya/phantomjs/issues/11289).
                    $select.val(value);
                    let evt = document.createEvent("UIEvent");
                    evt.initUIEvent("change", false, false, null, 0);
                    $select.get(0).dispatchEvent(evt);
                }

                function getSelectText($select: JQuery): string {
                    return $select.children("option:selected").text();
                }
            });

            describe('RichText module', () => {
                describe('getFontFamily', () => {
                    it('uses font map if possible', () => {
                        expect(RichText.getCssFontFamily('Body')).toEqual(powerbi.visuals.Font.Family.regular.css);
                        expect(RichText.getCssFontFamily('Arial')).toEqual("Arial");  // Not in font map
                    });
                });
            });

            function switchToViewMode(viewMode: powerbi.ViewMode): void {
                getViewModeSpy.and.returnValue(viewMode);
                textbox.onViewModeChanged(viewMode);
            }

            function getEditor($element: JQuery): JQuery {
                return $element.find(".ql-editor");
            }

            function verifyEditor($element: JQuery, present: boolean): void {
                if (present) {
                    let $container = $element.children("div").eq(0);
                    expect($container).toBeDefined();
                    
                    // Note: If this class is changed, the corresponding focus handler must be updated
                    // for PowerBI Desktop in its branch (DataExplorer)
                    expect($container).toHaveClass("textbox");

                    expect(setToolbarSpy).toHaveBeenCalled();
                    expect($toolbar).toBeDefined();
                    expect($toolbar.hasClass("ql-toolbar")).toBeTruthy();

                    let $editorContainer = $container.find(".ql-container");
                    expect($editorContainer.length).toBe(1);

                    let $editor = getEditor($editorContainer);
                    expect($editor.length).toBe(1);
                }
                else {
                    expect(getEditor($element).length).toBe(0);
                }
            }
        });

        function getTagName($element: JQuery): string {
            return $element.get(0).tagName.toLowerCase();
        }

        function hasBold($element: JQuery): boolean {
            return getTagName($element) === "b" || $element.css("font-weight") === "bold";
        }

        function hasItalic($element: JQuery): boolean {
            return getTagName($element) === "i" || $element.css("font-style") === "italic";
        }

        function hasUnderline($element: JQuery): boolean {
            return getTagName($element) === "u" || $element.css("text-decoration") === "underline";
        }

        function getUrl($element: JQuery): string {
            let $anchor = (getTagName($element) === "a") ? $element : $element.find("a");
            return $anchor.attr("href");
        }

        function getFont($element: JQuery): string {
            return $element.css("font-family");
        }

        function getFontSize($element: JQuery): string {
            return $element.css("font-size");
        }

        function getTextAlignment($element: JQuery): string {
            return $element.css("text-align");
        }

        function buildParagraphsDataView(paragraphs: Paragraph[]): powerbi.DataView[] {
            return [{ metadata: { columns: [], objects: { general: { paragraphs: paragraphs } } } }];
        }

        function getViewModeParagraphDivs($element: JQuery): JQuery {
            return $element.children("div");
        }

        function getEditModeParagraphDivs($element: JQuery): JQuery {
            let $editor = $element.find(".ql-editor");
            expect($editor.length).toBe(1);

            return $editor.children("div");
        }

        function createMouseEvent(eventName: string, relatedTarget: HTMLElement): MouseEvent {
            let event = document.createEvent("MouseEvent");
            event.initMouseEvent(
                eventName,
                true /* bubble */, true /* cancelable */,
                window, null,
                0, 0, 0, 0, /* coordinates */
                false, false, false, false, /* modifier keys */
                0 /*left*/, relatedTarget /* relatedTarget */);

            return event;
        }
    });
}
