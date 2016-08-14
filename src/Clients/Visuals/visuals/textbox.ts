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

module powerbi.visuals {
    import createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;
    import KeyUtils = jsCommon.KeyUtils;
    import StringExtensions = jsCommon.StringExtensions;
    import UrlUtils = jsCommon.UrlUtils;

    export interface TextboxDataViewObjects extends DataViewObjects {
        general: TextboxDataViewObject;
    }

    export interface TextboxDataViewObject extends DataViewObject {
        paragraphs: Paragraphs;
    }
    
    /** Represents a rich text box that supports view & edit mode. */
    export class Textbox implements IVisual {
        private static ClassName = 'textbox';
        private editor: RichText.QuillWrapper;
        private element: JQuery;
        private host: IVisualHostServices;
        private viewport: IViewport;
        private readOnly: boolean;
        private paragraphs: Paragraphs;

        public init(options: VisualInitOptions) {
            this.element = options.element;
            this.host = options.host;
            this.viewport = options.viewport;

            this.readOnly = (this.host.getViewMode() === ViewMode.View);
            this.paragraphs = [];
            this.refreshView();
        }

        public onResizing(viewport: IViewport): void {
            this.viewport = viewport;
            this.updateSize();
        }

        public onDataChanged(options: VisualDataChangedOptions): void {
            debug.assertValue(options, 'options');
            let dataViews = options.dataViews;

            this.paragraphs = [];
            if (dataViews && dataViews.length > 0) {
                let objects = <TextboxDataViewObjects>dataViews[0].metadata.objects;

                if (objects && objects.general)
                    this.paragraphs = objects.general.paragraphs;
            }

            this.refreshView();
        }

        public destroy(): void {
        }

        public focus(): boolean {
            if (!this.editor)
                return;

            this.editor.focus();
            return true;
        }

        public onViewModeChanged(viewMode: ViewMode): void {
            this.readOnly = (viewMode === ViewMode.View);
            this.refreshView();
        }

        public setSelection(start: number, end: number): void {
            debug.assertValue(this.editor, 'editor');

            if (this.editor)
                this.editor.setSelection(start, end);
        }

        private refreshView() {
            if (this.readOnly) {
                // Showing just HTML, no editor.
                // If we are in view-mode and we have an editor, we can remove it (after saving).
                if (this.editor) {
                    this.saveContents();
                    this.editor.destroy();
                    this.editor = null;
                }

                this.element.empty();
                let htmlContent = RichTextConversion.convertParagraphsToHtml(this.paragraphs);
                htmlContent.addClass(Textbox.ClassName);
                htmlContent.css({
                    'font-family': RichText.defaultFont,
                    'font-size': RichText.defaultFontSize,
                });
                this.element.append(htmlContent);
            }
            else {
                // Showing the Quill editor.
                // If we are in edit-mode and we don't have an editor we need to create it.
                if (!this.editor) {
                    this.editor = new RichText.QuillWrapper(this.readOnly, this.host);
                    this.editor.textChanged = (delta, source) => this.saveContents();

                    this.element.empty();
                    let editorElement = this.editor.getElement();
                    editorElement.addClass(Textbox.ClassName);
                    editorElement.css({
                        'font-family': RichText.defaultFont,
                        'font-size': RichText.defaultFontSize,
                    });
                    this.element.append(editorElement);
                }

                this.editor.setContents(RichTextConversion.convertParagraphsToOps(this.paragraphs));
            }

            this.updateSize();
        }

        private saveContents(): void {
            // It's possible to get here via a throttled text-changed event after a view-mode change has occured and
            // we are now in view mode. Since we save changes on view-mode change it is safe to ignore this call.
            if (!this.editor)
                return;

            let contents: quill.Delta = this.editor.getContents();
            this.paragraphs = RichTextConversion.convertDeltaToParagraphs(contents);

            let changes: VisualObjectInstance[] = [{
                objectName: 'general',
                properties: {
                    paragraphs: this.paragraphs
                },
                selector: null,  // TODO: need something here?
            }];

            this.host.persistProperties(changes);
        }

        private updateSize(): void {
            if (this.editor)
                this.editor.resize(this.viewport);
        }
    }

    module RichTextConversion {
        export function convertDeltaToParagraphs(contents: quill.Delta): Paragraphs {
            let paragraphs: Paragraphs = [];
            let paragraph: Paragraph = { textRuns: [] };

            for (let i = 0, len = contents.ops.length; i < len; i++) {
                let insertOp = <quill.InsertOp>contents.ops[i];
                debug.assertValue(insertOp, "operation should be an insert");

                if (typeof insertOp.insert === "string") {
                    // string insert values represent text.
                    let text = <string>insertOp.insert;
                    let attributes: quill.FormatAttributes = insertOp.attributes;

                    if (attributes && attributes.align) {
                        // Sometimes horizontal alignment is set after the first "insert" of the paragraph, which is likely a bug
                        // in Quill. In any case we should never see different horizontal alignments in a single paragraph.
                        debug.assert(
                            paragraph.horizontalTextAlignment === undefined || paragraph.horizontalTextAlignment === attributes.align,
                            'paragraph should not have more than one horizontal alignment');
                        paragraph.horizontalTextAlignment = attributes.align;
                    }

                    // Quill gives us back text runs that may have \n's in them. We want to create a new paragraph for each \n we see.
                    let start = 0;
                    let end = 0;
                    let newParagraph: boolean;
                    do {
                        end = text.indexOf('\n', start);
                        if (end < 0) {
                            newParagraph = false;
                            end = text.length;
                        }
                        else {
                            newParagraph = true;
                        }

                        if (end - start > 0) {
                            let span = text.substring(start, end);
                            let textRun: TextRun = { value: span };
                            if (attributes) {
                                if (attributes.link !== undefined && UrlUtils.isValidUrl(attributes.link))
                                    textRun.url = attributes.link;

                                let textStyle = convertFormatAttributesToTextStyle(attributes);
                                if (textStyle)
                                    textRun.textStyle = textStyle;
                            }

                            paragraph.textRuns.push(textRun);
                        }

                        // If we actually saw a '\n' then create a new paragraph
                        if (newParagraph) {
                            if (paragraph.textRuns.length === 0)
                                paragraph.textRuns.push({ value: '' });

                            paragraphs.push(paragraph);
                            paragraph = { textRuns: [] };
                        }

                        start = end + 1;
                    } while (start < text.length);
                }
                else {
                    // numeric insert values represent embeds.
                    debug.assertFail("embeds not supported");
                }
            }

            if (paragraph.textRuns.length > 0) {
                // Quill appears to always insert an extra '\n' at the end of the text, skip it
                if (paragraph.textRuns[0].value.length > 0)
                    paragraphs.push(paragraph);
            }

            return paragraphs;
        }

        export function convertParagraphsToHtml(paragraphs: Paragraphs): JQuery {
            let $paragraphs: JQuery = $();

            for (let paragraphIndex = 0, len = paragraphs.length; paragraphIndex < len; ++paragraphIndex) {
                let paragraphDef = paragraphs[paragraphIndex];
                let isParagraphEmpty = true;

                let $paragraph = $('<div>');

                if (paragraphDef.horizontalTextAlignment)
                    $paragraph.css('text-align', paragraphDef.horizontalTextAlignment);

                for (let textRunIndex = 0, jlen = paragraphDef.textRuns.length; textRunIndex < jlen; ++textRunIndex) {
                    let textRunDef = paragraphDef.textRuns[textRunIndex];

                    let $textRun = $('<span>');

                    let styleDef = textRunDef.textStyle;
                    if (styleDef) {
                        let css = {};
                        if (styleDef.fontFamily) {
                            css['font-family'] = RichText.getCssFontFamily(removeQuotes(styleDef.fontFamily));
                        }

                        if (styleDef.fontSize) {
                            css['font-size'] = styleDef.fontSize;
                        }

                        if (styleDef.fontStyle) {
                            css['font-style'] = styleDef.fontStyle;
                        }

                        if (styleDef.fontWeight) {
                            css['font-weight'] = styleDef.fontWeight;
                        }

                        if (styleDef.textDecoration) {
                            css['text-decoration'] = styleDef.textDecoration;
                        }

                        $textRun.css(css);
                    }

                    let text = textRunDef.value;
                    if (!_.isEmpty(text))
                        isParagraphEmpty = false;

                    if (textRunDef.url !== undefined) {
                        let $link: JQuery;
                        if (UrlUtils.isValidUrl(textRunDef.url)) {
                            $link = $('<a>')
                                .attr('href', textRunDef.url)
                                .attr('target', '_blank')
                                .text(text);
                        }
                        else {
                            $link = $('<span>').text(text);
                        }

                        $textRun.append($link);
                    }
                    else {
                        $textRun.text(text);
                    }

                    $paragraph.append($textRun);
                }

                // If the entire paragraph is empty we need to make sure we enforce a line-break.
                if (isParagraphEmpty)
                    $paragraph.append($('<br>'));

                $paragraphs = $paragraphs.add($paragraph);
            }

            return $paragraphs;
        }

        export function convertParagraphsToOps(paragraphs: Paragraphs): quill.Op[] {
            let ops: quill.InsertOp[] = [];

            for (let paragraphIndex = 0, len = paragraphs.length; paragraphIndex < len; ++paragraphIndex) {
                let paragraphDef = paragraphs[paragraphIndex];

                for (let textRunIndex = 0, jlen = paragraphDef.textRuns.length; textRunIndex < jlen; ++textRunIndex) {
                    let textRunDef = paragraphDef.textRuns[textRunIndex];
                    let formats: quill.FormatAttributes = {};

                    if (paragraphDef.horizontalTextAlignment)
                        formats.align = paragraphDef.horizontalTextAlignment;

                    let styleDef = textRunDef.textStyle;
                    if (styleDef) {
                        if (styleDef.fontFamily) {
                            formats.font = RichText.getCssFontFamily(removeQuotes(styleDef.fontFamily));
                        }

                        if (styleDef.fontSize) {
                            formats.size = styleDef.fontSize;
                        }

                        formats.italic = (styleDef.fontStyle === 'italic');
                        formats.bold = (styleDef.fontWeight === 'bold');
                        formats.underline = (styleDef.textDecoration === 'underline');
                    }

                    let text = textRunDef.value;

                    if (textRunDef.url && UrlUtils.isValidUrl(textRunDef.url))
                        formats.link = textRunDef.url;

                    let op: quill.InsertOp = {
                        insert: text,
                        attributes: formats,
                    };

                    ops.push(op);

                    // The last text run of the paragraph needs to end with '\n' to get Quill to handle the text alignment correctly.
                    if (textRunIndex === (jlen - 1) && !StringExtensions.endsWith(text, '\n')) {
                        ops.push({
                            insert: '\n',
                            attributes: formats,
                        });
                    }
                }
            }

            return ops;
        }

        function convertFormatAttributesToTextStyle(attributes: quill.FormatAttributes): TextRunStyle {
            let style: TextRunStyle = {};

            // NOTE: Align is taken care of when converting to paragraphs.
            if (attributes.bold) {
                style.fontWeight = 'bold';
            }
            if (attributes.font) {
                // We should always save font names without any quotes.
                let font = removeQuotes(attributes.font);

                // Convert built-in font families back into their proper font families (e.g. wf_segoe-ui_normal -> Segoe UI)
                font = RichText.getFontFamilyForBuiltInFont(font);

                style.fontFamily = font;
            }
            if (attributes.italic) {
                style.fontStyle = 'italic';
            }
            if (attributes.size) {
                style.fontSize = attributes.size;
            }
            if (attributes.underline) {
                style.textDecoration = 'underline';
            }
            /*
            TODO:
            if (attributes.background) {
            }
            if (attributes.color) {
            }
            */

            return style;
        }

        function removeQuotes(text: string): string {
            // If it doesn't start with a quote or contains a comma (multiple fonts), don't remove quotes.
            if (!StringExtensions.startsWith(text, "'") || StringExtensions.containsIgnoreCase(text, ","))
                return text;

            debug.assert(StringExtensions.endsWith(text, "'"), "mismatched quotes");

            return text.slice(1, text.length - 1);
        }
    }

    export module RichText {
        interface ListValueOption {
            label: string;
            value: string;
        }
        
        /**
         * These fonts are embedded using CSS, or are aliases to other fonts.
         */
        const fontMap = {
            'Segoe (Bold)': Font.Family.bold.css,
            'Segoe UI': Font.Family.regular.css,
            'Segoe UI Light': Font.Family.light.css,
            'Heading': Font.Family.light.css,
            'Body': Font.Family.regular.css
        };

        const fonts: ListValueOption[] = [
            'Arial',
            'Arial Black',
            'Arial Unicode MS',
            'Calibri',
            'Cambria',
            'Cambria Math',
            'Candara',
            'Comic Sans MS',
            'Consolas',
            'Constantia',
            'Corbel',
            'Courier New',
            'Georgia',
            'Lucida Sans Unicode',
            'Segoe (Bold)',
            'Segoe UI',
            'Segoe UI Light',
            'Symbol',
            'Tahoma',
            'Times New Roman',
            'Trebuchet MS',
            'Verdana',
            'Wingdings',

            // Fonts with numbers in the name do not work properly on Chrome. We'd need to quote the font names which causes problems with QuillJS.
            // TFS6832899
            //'Wingdings 2',
            //'Wingdings 3',

        ].map((font) => <ListValueOption>{ label: font, value: getCssFontFamily(font) });
        export let defaultFont = getCssFontFamily('Segoe UI Light');

        const fontSizes: ListValueOption[] = [
            '8', '9', '10', '10.5', '11', '12', '14', '16', '18', '20', '24', '28', '32', '36', '40', '42', '44', '54', '60', '66', '72', '80', '88', '96'
        ].map((size) => <ListValueOption> { label: size, value: size + 'px' });
        export const defaultFontSize = '14px';

        const textAlignments: ListValueOption[] = [
            'Left',
            'Center',
            'Right',
        ].map((alignment) => <ListValueOption>{ label: alignment, value: alignment.toLowerCase() });

        /**
         * Given a font family returns the value we should use for the font-family css property.
         */
        export function getCssFontFamily(font: string): string {
            let family: string = fontMap[font];
            if (family == null)
                family = font;

            return family;
        }

        /**
         * Convert built-in font families back into their proper font families (e.g. wf_segoe-ui_normal -> Segoe UI)
         */
        export function getFontFamilyForBuiltInFont(font: string): string {
            let fontFamily = _.findKey(fontMap, (value) => value === font || value.indexOf(font) > 0);
            return fontFamily || font;
        }

        export class QuillWrapper {
            private editor: quill.Quill;
            private $editorDiv: JQuery;
            private $toolbarDiv: JQuery;
            private $container: JQuery;
            private dependenciesLoaded: JQueryDeferred<void>;
            private localizationProvider: jsCommon.IStringResourceProvider;
            private host: IVisualHostServices;
            private static textChangeThrottle = 200; // ms

            public static loadQuillResources: boolean = true;

            // TODO: How to choose between minified/unminified?
            // TODO: Consider loading this from the CDN.
            private static quillJsFiles = [powerbi.build + '/externals/quill.min.js'];
            private static quillCssFiles = [powerbi.build + '/externals/quill.base.css'];
            private QuillPackage: jsCommon.IDependency = {
                javaScriptFiles: QuillWrapper.quillJsFiles,
                cssFiles: QuillWrapper.quillCssFiles,
            };

            public initialized: boolean;
            public readOnly: boolean;
            public textChanged: (delta, source) => void = (d, s) => { };
            
            /**
             * JavaScript and CSS resources are typically resolved asynchronously.
             * This means we potentially defer certain events which typically occur
             * synchronously until resources are loaded.
             * Setting the global loadQuillResources flag to true will override
             * this behavior and cause the wrapper to assume these resources are already loaded
             * and not try to load them asynchronously (e.g. for use in unit tests).
             */ 
            constructor(readOnly: boolean, host: IVisualHostServices) {
                this.host = host;
                this.$container = $('<div>');

                this.readOnly = readOnly;

                this.localizationProvider = {
                    get: (stringId: string) => this.host.getLocalizedString(stringId),
                    getOptional: (stringId: string) => this.host.getLocalizedString(stringId)
                };

                this.dependenciesLoaded = $.Deferred<void>();
                if (QuillWrapper.loadQuillResources) {
                    // Defer creation of the editor until after resources are loaded.
                    this.initialized = false;

                    // Note that these are called in the order registered so this will always be called before other callbacks.
                    this.dependenciesLoaded.done(() => {
                        this.rebuildQuillEditor();
                        this.initialized = true;
                    });

                    jsCommon.requires(this.QuillPackage, () => this.dependenciesLoaded.resolve());
                }
                else {
                    this.rebuildQuillEditor();
                    this.initialized = true;
                    this.dependenciesLoaded.resolve();
                }
            }

            public addModule(name: any, options: any): any {
                if (this.editor)
                    return this.editor.addModule(name, options);
            }

            public getElement(): JQuery {
                return this.$container;
            }

            public getContents(): quill.Delta {
                if (this.initialized)
                    return this.editor.getContents();
            }

            public setContents(contents: quill.Delta | quill.Op[]): void {
                // If we haven't loaded the editor yet, defer this call until we do
                // TODO: prevent these from stacking up?
                if (!this.initialized) {
                    this.dependenciesLoaded.done(() => this.setContents(contents));
                    return;
                }

                this.editor.setHTML('', 'api');  // Clear contents
                if (contents)
                    this.editor.setContents(contents, 'api');
            }

            public resize(viewport: IViewport): void {
                this.$container.width(viewport.width);
                this.$container.height(viewport.height);
            }

            public setReadOnly(readOnly: boolean): void {
                let readOnlyChanged = readOnly !== this.readOnly;
                this.readOnly = readOnly;

                if (this.initialized && readOnlyChanged) {
                    this.rebuildQuillEditor();
                }
            }

            public setSelection(start: number, end: number): void {
                if (this.editor)
                    this.editor.setSelection(start, end, 'api');
            }

            public getSelection(): quill.Range {
                if (this.editor)
                    return this.editor.getSelection();
            }

            public focus(): void {
                if (!this.editor)
                    return;

                if ($(document.activeElement).closest(this.$container).length === 0)
                    this.editor.focus();
            }

            public destroy(): void {
                this.host.setToolbar(null);
                this.$container.remove();
                this.$container = null;
                this.$toolbarDiv = null;
                this.$editorDiv = null;
                this.editor = null;
            }

            public getSelectionAtCursor(): quill.Range {
                let text = this.getTextWithoutTrailingBreak();

                // Ensure editor has focus before selection interactions
                this.editor.focus();
                
                let selection = this.getSelection();
                if (selection && selection.start === selection.end) {
                    return jsCommon.WordBreaker.find(selection.start, text);
                }

                return selection;
            }

            public getWord() {
                let selection = this.getSelectionAtCursor();
                return this.getTextWithoutTrailingBreak().slice(selection.start, selection.end);
            }

            public insertLinkAtCursor(link: string, index: number): number {
                let endIndex = index + link.length;
                
                this.editor.insertText(index, link, 'api');
                this.editor.formatText(index, endIndex, 'link', link, 'api');
                this.setSelection(index, endIndex);

                this.onTextChanged(null, null);

                return endIndex;
            }

            public getEditorContainer(): JQuery {
                if (this.editor)
                    return $(this.editor.container);
            };

            private getTextWithoutTrailingBreak(): string {
                return this.editor.getText().slice(0, -1);
            }

            private rebuildQuillEditor(): void {
                // Preserve contents if we already have an editor.
                let contents: quill.Delta = null;
                if (this.editor) {
                    this.editor.removeAllListeners();
                    contents = this.editor.getContents();
                }

                this.$container.empty();

                // Prevent parent elements from handling keyboard shortcuts (e.g. ctrl+a) that have special meaning for textboxes.
                // Quill will also capture and prevent bubbling of some keyboard shortcuts, such as ctrl+c, ctrl+b, etc.
                this.$container.keydown((e) => {
                    let which = e.which;

                    if (e.ctrlKey && KeyUtils.isCtrlDefaultKey(which))
                        e.stopPropagation();

                    if (KeyUtils.isArrowKey(which) || KeyUtils.isNudgeModifierKey(which))
                        e.stopPropagation();
                });

                let $editorDiv = this.$editorDiv = $('<div>');

                // HACK: Quill does not apply the correct default styling if you clear all the content and add new content.
                $editorDiv.css('font-family', defaultFont);
                $editorDiv.css('font-size', defaultFontSize);

                let configs = {
                    readOnly: this.readOnly,
                    formats: ['bold', 'italic', 'underline', 'font', 'size', 'link', 'align', /* TODO: 'color', 'background' */],
                    styles: false,
                };
                this.editor = new Quill($editorDiv.get(0), configs);

                // If not readonly we add a toolbar and disable drag/resize
                if (!this.readOnly) {
                    let $toolbarDiv = this.$toolbarDiv;
                    if (!$toolbarDiv) {
                        this.$toolbarDiv = $toolbarDiv = Toolbar.buildToolbar(this, this.localizationProvider);
                    }

                    $toolbarDiv.addClass('unselectable');
                    this.host.setToolbar($toolbarDiv);
                    this.editor.addModule('toolbar', { container: $toolbarDiv.get(0) });

                    // Disable this so we can select text in the editor.
                    $editorDiv.attr('drag-resize-disabled', 'true');
                }

                this.$container.append($editorDiv);

                if (contents)
                    this.setContents(contents);

                // Throttle text-changed events to not more frequent than once per 200ms
                let textChangeThrottler = new jsCommon.ThrottleUtility(QuillWrapper.textChangeThrottle);
                this.editor.on('text-change', (delta, source) => {
                    if (source !== 'api')
                        textChangeThrottler.run(() => this.onTextChanged(delta, source));
                });

                /*
                    Webkit browsers have a bug with regard to focus on div elements
                    with the contenteditable attribute:

                    https://bugs.webkit.org/show_bug.cgi?id=38696

                    When we blur our rich text box editor the focus remains with the selection
                    instead of the focused element. This allows the user to continue typing as
                    if focus remains within the RichTextbox.

                    To fix this issue we add an event listener to the contenteditable div
                    which listens for the 'blur' event and will properly blur our quill
                    editor as well.

                    http://quilljs.com/docs/api/#quillprototypesetselection

                    Verified in Chrome 43.0.2357.130 m

                    In IE10+ the setSelection method explicitly sets focus to the body which
                    causes a bug where the user must click twice when attempting to interact
                    with a <select> element. To prevent this issue we explicitly do not call
                    setSelection to blur if the user is changing focus to a <select> element.
                    This issue is also present for link tooltips from the Quill module which
                    will cause a blur onto the tooltip.
                */
                this.editor.root.addEventListener('blur', (event) => {
                    let target: HTMLElement = <HTMLElement>(event.relatedTarget || document.activeElement);

                    // The browser will handle moving the cursor and setting focus properly for these types of elements.
                    if (target &&
                        target.tagName === 'SELECT' || target.tagName === 'INPUT' || target.getAttribute('contentEditable')) {
                        return;
                    }

                    this.setSelection(null, null);
                }, false);
            }

            private onTextChanged(delta, source): void {
                this.textChanged(delta, source);
            }
        }

        module Toolbar {
            const DefaultLinkInputValue = 'http://';

            export const selectors = {
                linkTooltip: createClassAndSelector('ql-link-tooltip'),
                toolbarUrlInput: createClassAndSelector('toolbar-url-input'),
            };

            export function buildToolbar(quillWrapper: QuillWrapper, localizationProvider: jsCommon.IStringResourceProvider) {
                // Module for adding custom hyperlinks
                let linkTooltipTemplate = buildToolbarLinkInputTemplate(localizationProvider);
                quillWrapper.addModule('link-tooltip', { template: linkTooltipTemplate });

                let toolbarLinkInput: JQuery = buildToolbarLinkInput(quillWrapper, getTooltip('Link', localizationProvider), localizationProvider.get('RichTextbox_Link_DefaultText'));

                let fontPicker = picker(getTooltip('Font', localizationProvider), fonts, 'font', defaultFont,
                    // Show the fonts in their own font face.
                    ($option, option) => { $option.css('font-family', option.value); return $option; }
                );

                let $container = div()
                    .addClass('toolbar ql-toolbar')
                    .append(
                        formatGroup()
                            .append(label(localizationProvider.get('RichTextbox_Font_Label')))
                            .append(fontPicker)
                            .append(picker(getTooltip('Size', localizationProvider), fontSizes, 'size', defaultFontSize))
                        )
                    .append(
                        formatGroup()
                            .append(formatButton(getTooltip('Bold', localizationProvider), 'bold'))
                            .append(formatButton(getTooltip('Italic', localizationProvider), 'italic'))
                            .append(formatButton(getTooltip('Underline', localizationProvider), 'underline'))
                        )
                    .append(
                        formatGroup()
                            .append(toggleGroup('Text Alignment', textAlignments, 'align', 'Left', localizationProvider))
                        )
                    .append(toolbarLinkInput);

                // Prevent mousedown from triggering subsequent blur on editor
                $container.on('mousedown', (event) => {
                    let target = <HTMLElement>(event.target || document.activeElement);
                    if (target.tagName !== 'INPUT' && target.tagName !== 'SELECT')
                        event.preventDefault();
                });

                return $container;
            }

            export function setSelectValue($select: JQuery, value: any): void {
                $select.val(value);
                // NOTE: The 'change' event is not raised when the value of the SELECT element is changed programatically,
                // and Quill uses it's own, non-JQuery, method to hook up to the 'change' event, therefore, we need to dispatch
                // this event manually on the SELECT element.
                let evt = document.createEvent('UIEvent');
                evt.initUIEvent('change', false, false, null, 0);
                $select.get(0).dispatchEvent(evt);
            }

            function linkTooltipTemplateGenerator(removeText: string, doneText: string): JQuery {
                return $(`
                        <a href="#" class="url" target="_blank"></a>
                        <input class="input" type="text">
                        <span class="bar">&nbsp;|&nbsp;</span>
                        <a class="change"></a>
                        <a class="remove">${removeText}</a>
                        <a class="done">${doneText}</a>
                    `);
            };

            function buildToolbarLinkInputTemplate(localizationProvider: jsCommon.IStringResourceProvider): string {
                let template: JQuery = div();
                let doneText = localizationProvider.get('RichTextbox_Link_Done');
                let removeText = localizationProvider.get('RichTextbox_Link_Remove');

                template.append(linkTooltipTemplateGenerator(removeText, doneText));

                return template.html();
            }

            function formatGroup(): JQuery {
                return span()
                    .addClass('ql-format-group')
                    .attr('drag-resize-disabled', 'true');
            }

            function label(text: string): JQuery {
                return $('<label>').text(text);
            }

            function div(): JQuery {
                return $('<div>');
            }

            function span(): JQuery {
                return $('<span>');
            }

            function toggleGroup(title: string, list: ListValueOption[], format: string, defaultValue: string, localizationProvider: jsCommon.IStringResourceProvider): JQuery {
                let tooltip = getTooltip(title, localizationProvider);
                let $group = span()
                    .attr('title', tooltip)
                    .addClass('ql-toggle-group');

                // Hidden selector that Quill will use to hook up change listeners.
                let $select = selector(tooltip, list, defaultValue)
                    .addClass('ql-picker ql-' + format)
                    .css('display', 'none');

                let $buttons = list.map((option) => {
                    let $button = formatButton(getTooltip(option.label, localizationProvider), 'align' + option.value)
                        .attr('data-value', option.value)
                        .click((e) => setSelectValue($select, option.value));
                    return $button;
                });

                // Quill will change the value of the selector when the text selection changes, so we need to set the state of the buttons to match.
                $select.change((e) => {
                    let newValue = $select.val();
                    for (let i = 0; i < $buttons.length; i++) {
                        $buttons[i].toggleClass('ql-active', $buttons[i].attr('data-value') === newValue);
                    }
                });

                $group.append($select);
                $group.append($buttons);

                return $group;
            }

            function picker(tooltip: string, list: ListValueOption[], format: string, defaultValue: string, optionModifier?: (JQuery, ListValueOption) => JQuery): JQuery {
                let $selector = selector(tooltip, list, defaultValue, optionModifier)
                    .addClass('ql-picker ql-' + format);

                return $selector;
            }

            function selector(tooltip: string, list: ListValueOption[], defaultValue?: string, optionModifier?: (JQuery, ListValueOption) => JQuery): JQuery {
                let $selector = $('<select>')
                    .attr('title', tooltip);

                for (let i = 0; i < list.length; i++) {
                    let option = list[i];
                    let $option = $('<option>')
                        .attr('value', option.value)
                        .text(option.label);

                    if (option.value === defaultValue)
                        $option.attr('selected', 'selected');

                    if (optionModifier !== undefined)
                        $option = optionModifier($option, option);

                    $selector.append($option);
                }

                return $selector;
            }

            function formatButton(tooltip?: string, format?: string) {
                let $button = span()
                    .addClass('ql-format-button');

                if (tooltip != null)
                    $button.attr('title', tooltip);

                if (format != null) {
                    $button.addClass('ql-' + format);
                    $button.addClass('powervisuals-glyph ' + format);
                }

                return $button;
            }

            function getTooltip(name: string, localizationProvider: jsCommon.IStringResourceProvider): string {
                return localizationProvider.get('RichTextbox_' + name + '_ToolTip');
            }

            function clearLinkInput(linkTooltip: JQuery): void {
                linkTooltip.removeClass('editing');
                linkTooltip.removeClass('blank-editing');
                linkTooltip.find('.input').val(DefaultLinkInputValue);
            }

            function buildToolbarLinkInput(quillWrapper: QuillWrapper, buttonTooltip: string, defaultLinkText: string): JQuery {
                // Pull out link tooltip
                let linkTooltip = quillWrapper.getEditorContainer().find(Toolbar.selectors.linkTooltip.selector);

                // Append link tooltip to a new toolbar format group
                let toolbarLinkInput: JQuery = formatGroup()
                    .addClass(Toolbar.selectors.toolbarUrlInput.class)
                    .append(formatButton(buttonTooltip, 'link').append('<div>'))
                    .append(linkTooltip);

                // Special case for blank selection (no text near cursor) when enter key or done button clicked
                toolbarLinkInput.on('keydown mousedown', (event: JQueryEventObject) => {
                    if (event.keyCode === jsCommon.DOMConstants.enterKeyCode || (<HTMLElement>event.target).classList.contains('done')) {
                        if (!linkTooltip.hasClass('blank-editing'))
                            return true;

                        // Only perform these steps if tooltip was not in editing mode (special case for blank)
                        let link = toolbarLinkInput.find('.input').val();
                        let selection = quillWrapper.getSelectionAtCursor();
                        let word = quillWrapper.getWord();
                        if (!word) {
                            // Insert the input text as a link
                            let endCursor = quillWrapper.insertLinkAtCursor(link, selection.start);
                            clearLinkInput(linkTooltip);
                            quillWrapper.setSelection(endCursor, endCursor);
                            return false;
                        }
                    }
                });

                toolbarLinkInput.find('.input').blur((event: JQueryEventObject) => {
                    let blurTarget = event.relatedTarget;
                    // Remove editing class from insert link tooltip (to hide via CSS)
                    // only when we are not blurring to the 'done' button (tab from input field)
                    if (blurTarget === null || blurTarget && !blurTarget.classList.contains('done'))
                        clearLinkInput(linkTooltip);
                });

                toolbarLinkInput.find('.ql-link div')
                    .click((event: JQueryEventObject) => {
                        // Handle click on button before Quill removes link (default behavior)
                        let target = (<HTMLElement>event.target).parentElement;
                        if (target && target.classList.contains('ql-active')) {
                            toolbarLinkInput.find('.change')[0].click();
                            return false;
                        }

                        // If blank selection (no text near cursor), special case for link button
                        let word = quillWrapper.getWord();
                        if (!word) {
                            linkTooltip.addClass('editing blank-editing');
                            let inputElem = (<HTMLInputElement>toolbarLinkInput.find('.input').get(0));
                            inputElem.value = DefaultLinkInputValue;
                            inputElem.selectionStart = inputElem.selectionEnd = DefaultLinkInputValue.length;
                            inputElem.focus();
                            return false;
                        }
                    })
                    .mousedown((event: JQueryEventObject) => {
                        // Properly set selection before we handle the click
                        let linkButton = (<HTMLElement>event.target).parentElement;
                        if (linkButton && !linkButton.classList.contains('ql-active')) {
                            let selection = quillWrapper.getSelectionAtCursor();
                            quillWrapper.setSelection(selection.start, selection.end);
                        }
                    });

                return toolbarLinkInput;
            }
        }
    }
}