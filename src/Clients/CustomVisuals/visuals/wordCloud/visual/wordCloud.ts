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

// Word cloud layout by Jason Davies, https://www.jasondavies.com/wordcloud/ https://github.com/jasondavies/d3-cloud
// Algorithm due to Jonathan Feinberg, http://static.mrfeinberg.com/bv_ch03.pdf

/// <reference path="../../../_references.ts"/>

module powerbi.visuals.samples {
    import ValueFormatter = powerbi.visuals.valueFormatter;
    import getAnimationDuration = AnimatorCommon.GetAnimationDuration;
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;

    type D3Element =
        D3.UpdateSelection
        | D3.Selection
        | D3.Selectors
        | D3.Transition.Transition;

    export enum WordCloudScaleType {
        logn,
        sqrt,
        value
    };

    export interface WordCloudText {
        text: string;
        textGroup: string;
        count: number;
        index: number;
        selectionId: SelectionId;
        color: string;
    }

    export interface WordCloudDataPoint extends IPoint {
        text: string;
        xOff: number;
        yOff: number;
        rotate?: number;
        size?: number;
        padding: number;
        width: number;
        height: number;
        sprite?: number[];
        x0: number;
        y0: number;
        x1: number;
        y1: number;
        color: string;
        selectionIds: SelectionId[];
        wordIndex: number;
        widthOfWord?: number;
        count: number;
    }

    export interface WordCloudData {
        dataView: DataView;
        settings: WordCloudSettings;
        texts: WordCloudText[];
        dataPoints: WordCloudDataPoint[];
    }

    export interface WordCloudDataView {
        data: WordCloudDataPoint[];
        leftBorder: IPoint;
        rightBorder: IPoint;
    }

    export interface WordCloudConstructorOptions {
        svg?: D3.Selection;
        animator?: IGenericAnimator;
        margin?: IMargin;
    }

    class CustomSelectionManager {
        private selectionIdsValue: SelectionId[] = [];
        private hostServices: IVisualHostServices;

        public constructor(hostServices: IVisualHostServices) {
            this.hostServices = hostServices;
        }

        public get selectionIds(): SelectionId[] {
            return this.selectionIdsValue;
        }

        public get hasSelection(): boolean {
            return this.selectionIds.length > 0;
        }

        public selectAndSendSelection(selectionId: SelectionId[] | SelectionId, multiSelect: boolean = false): JQueryDeferred<SelectionId[]> {
            var selectionIds = <SelectionId[]>(_.isArray(selectionId) ? selectionId : [selectionId]);
            if (this.hostServices.shouldRetainSelection()) {
                return this.sendSelectionToHost(selectionIds);
            } else {
                this.selectInternal(selectionIds, multiSelect);
                return this.sendSelection();
            }
        }

        public select(selectionId: SelectionId[] | SelectionId, multiSelect: boolean = false) {
            var selectionIds = <SelectionId[]>(_.isArray(selectionId) ? selectionId : [selectionId]);
            this.selectInternal(selectionIds, multiSelect);
        }

        public isSelected(selectionId: SelectionId[] | SelectionId): boolean {
            var selectionIds = <SelectionId[]>(_.isArray(selectionId) ? selectionId : [selectionId]);
            return selectionIds.every(x => utility.SelectionManager.containsSelection(this.selectionIds, x));
        }

        public sendSelection(): JQueryDeferred<SelectionId[]> {
            return this.sendSelectionToHost(this.selectionIds);
        }

        public clear(sendToHost: boolean = true): JQueryDeferred<{}> {
            this.selectionIds.length = 0;

            if(sendToHost) {
                return this.sendSelection();
            }

            return $.Deferred().resolve();
        }

        private selectInternal(selectionIds: SelectionId[] , multiSelect: boolean) {
            var resultSelectionIds = [];

            if (selectionIds.every(x => this.isSelected(x))) {
                resultSelectionIds = multiSelect
                    ? this.selectionIds.filter(x => !utility.SelectionManager.containsSelection(selectionIds, x))
                    : this.selectionIds.length === selectionIds.length ? [] : selectionIds;
            } else {
                resultSelectionIds = multiSelect
                    ? selectionIds.filter(x => !this.isSelected(x)).concat(this.selectionIds)
                    : selectionIds;
            }

            this.selectionIds.length = 0;
            resultSelectionIds.forEach(x => this.selectionIds.push(x));
        }

        private sendSelectionToHost(ids: SelectionId[]): JQueryDeferred<SelectionId[]> {
            var deferred: JQueryDeferred<data.Selector[]> = $.Deferred();

            var selectArgs: SelectEventArgs = {
                visualObjects: _.chain(ids)
                    .filter((value: SelectionId) => value.hasIdentity())
                    .map((value: SelectionId) => {
                        return <VisualObject>{
                            objectName: undefined,
                            selectorsByColumn: value.getSelectorsByColumn(),
                        };
                    })
                    .value(),
            };

            this.hostServices.onSelect(selectArgs);

            deferred.resolve(this.selectionIds);
            return deferred;
        }
    }

    class VisualLayout {
        private marginValue: IMargin;
        private viewportValue: IViewport;
        private viewportInValue: IViewport;
        private minViewportValue: IViewport;
        private originalViewportValue: IViewport;
        private previousOriginalViewportValue: IViewport;

        public defaultMargin: IMargin;
        public defaultViewport: IViewport;

        constructor(defaultViewport?: IViewport, defaultMargin?: IMargin) {
            this.defaultViewport = defaultViewport || { width: 0, height: 0 };
            this.defaultMargin = defaultMargin || { top: 0, bottom: 0, right: 0, left: 0 };
        }

        public get viewport(): IViewport {
            return this.viewportValue || (this.viewportValue = this.defaultViewport);
        }

        public get viewportCopy(): IViewport {
            return _.clone(this.viewport);
        }

        //Returns viewport minus margin
        public get viewportIn(): IViewport {
            return this.viewportInValue || this.viewport;
        }

        public get minViewport(): IViewport {
            return this.minViewportValue || { width: 0, height: 0 };
        }

        public get margin(): IMargin {
            return this.marginValue || (this.marginValue = this.defaultMargin);
        }

        public set minViewport(value: IViewport) {
            this.setUpdateObject(value, v => this.minViewportValue = v, VisualLayout.restrictToMinMax);
        }

        public set viewport(value: IViewport) {
            this.previousOriginalViewportValue = _.clone(this.originalViewportValue);
            this.originalViewportValue = _.clone(value);
            this.setUpdateObject(value,
                v => this.viewportValue = v,
                o => VisualLayout.restrictToMinMax(o, this.minViewport));
        }

        public set margin(value: IMargin) {
            this.setUpdateObject(value, v => this.marginValue = v, VisualLayout.restrictToMinMax);
        }

        //Returns true if viewport has updated after last change.
        public get viewportChanged(): boolean {
            return !!this.originalViewportValue && (!this.previousOriginalViewportValue
                || this.previousOriginalViewportValue.height !== this.originalViewportValue.height
                || this.previousOriginalViewportValue.width !== this.originalViewportValue.width);
        }

        public get viewportInIsZero(): boolean {
            return this.viewportIn.width === 0 || this.viewportIn.height === 0;
        }

        public resetMargin(): void {
            this.margin = this.defaultMargin;
        }

        private update(): void {
            this.viewportInValue = VisualLayout.restrictToMinMax({
                width: this.viewport.width - (this.margin.left + this.margin.right),
                height: this.viewport.height - (this.margin.top + this.margin.bottom)
            }, this.minViewportValue);
        }

        private setUpdateObject<T>(object: T, setObjectFn: (T) => void, beforeUpdateFn?: (T) => void): void {
            object = _.clone(object);
            setObjectFn(VisualLayout.createNotifyChangedObject(object, o => {
                if(beforeUpdateFn) beforeUpdateFn(object);
                this.update();
            }));

            if(beforeUpdateFn) beforeUpdateFn(object);
            this.update();
        }

        private static createNotifyChangedObject<T>(object: T, objectChanged: (o?: T, key?: string) => void): T {
            var result: T = <any>{};
            _.keys(object).forEach(key => Object.defineProperty(result, key, {
                    get: () => object[key],
                    set: (value) => { object[key] = value; objectChanged(object, key); },
                    enumerable: true,
                    configurable: true
                }));
            return result;
        }

        private static restrictToMinMax<T>(value: T, minValue?: T): T {
            _.keys(value).forEach(x => value[x] = Math.max(minValue && minValue[x] || 0, value[x]));
            return value;
        }
    }

    export class WordCloudSettings {
        public static get Default() { 
            return new this();
        }

        public static parse(dataView: DataView, capabilities: VisualCapabilities) {
            var settings = new this();
            if(!dataView || !dataView.metadata || !dataView.metadata.objects) {
                return settings;
            }

            var properties = this.getProperties(capabilities);
            for(var objectKey in capabilities.objects) {
                for(var propKey in capabilities.objects[objectKey].properties) {
                    if(!settings[objectKey] || !_.has(settings[objectKey], propKey)) {
                        continue;
                    }

                    var type = capabilities.objects[objectKey].properties[propKey].type;
                    var getValueFn = this.getValueFnByType(type);
                    settings[objectKey][propKey] = getValueFn(
                        dataView.metadata.objects,
                        properties[objectKey][propKey],
                        settings[objectKey][propKey]);
                }
            }

            return settings;
        }

        public static getProperties(capabilities: VisualCapabilities)
            : { [i: string]: { [i: string]: DataViewObjectPropertyIdentifier } } & { 
                general: { formatString: DataViewObjectPropertyIdentifier },
                dataPoint: { fill: DataViewObjectPropertyIdentifier } } {
            var objects  = _.merge({ 
                general: { properties: { formatString: {} } } 
            }, capabilities.objects);
            var properties = <any>{};
            for(var objectKey in objects) {
                properties[objectKey] = {};
                for(var propKey in objects[objectKey].properties) {
                    properties[objectKey][propKey] = <DataViewObjectPropertyIdentifier> {
                        objectName: objectKey,
                        propertyName: propKey
                    };
                }
            }

            return properties;
        }

        public static createEnumTypeFromEnum(type: any): IEnumType {
            var even: any = false;
            return createEnumType(Object.keys(type)
                .filter((key,i) => ((!!(i % 2)) === even && type[key] === key
                    && !void(even = !even)) || (!!(i % 2)) !== even)
                .map(x => <IEnumMember>{ value: x, displayName: x }));
        }

        private static getValueFnByType(type: powerbi.data.DataViewObjectPropertyTypeDescriptor) {
            switch(_.keys(type)[0]) {
                case "fill": 
                    return DataViewObjects.getFillColor;
                default:
                    return DataViewObjects.getValue;
            }
        }

        public static enumerateObjectInstances(
            settings = new this(),
            options: EnumerateVisualObjectInstancesOptions,
            capabilities: VisualCapabilities): ObjectEnumerationBuilder {

            var enumeration = new ObjectEnumerationBuilder();
            var object = settings && settings[options.objectName];
            if(!object) {
                return enumeration;
            }

            var instance = <VisualObjectInstance>{
                objectName: options.objectName,
                selector: null,
                properties: {}
            };

            for(var key in object) {
                if(_.has(object,key)) {
                    instance.properties[key] = object[key];
                }
            }

            enumeration.pushInstance(instance);
            return enumeration;
        }

        public originalSettings: WordCloudSettings;
        public createOriginalSettings(): void {
            this.originalSettings = _.cloneDeep(this);
        }

        //Default Settings
        public general = {
            maxNumberOfWords: 200,
            minFontSize: 20 / WordCloud.FontSizePercentageCoefficent,
            maxFontSize: 100 / WordCloud.FontSizePercentageCoefficent,
            isBrokenText: true
        };
        public stopWords = {
            show: true,
            isDefaultStopWords: false,
            words: null  
        };
        public rotateText = {
            show: true,
            minAngle: -60,
            maxAngle: 90,
            maxNumberOfOrientations: 2
        };
    }

    export class WordCloudColumns<T> {
        public static Roles = Object.freeze(
            _.mapValues(new WordCloudColumns<string>(), (x, i) => i));

        public static getColumnSources(dataView: DataView) {
            return this.getColumnSourcesT<DataViewMetadataColumn>(dataView);
        }

        public static getTableValues(dataView: DataView) {
            var table = dataView && dataView.table;
            var columns = this.getColumnSourcesT<any[]>(dataView);
            return columns && table && _.mapValues(
                columns, (n: DataViewMetadataColumn, i) => n && table.rows.map(row => row[n.index]));
        }

        public static getTableRows(dataView: DataView) {
            var table = dataView && dataView.table;
            var columns = this.getColumnSourcesT<any[]>(dataView);
            return columns && table && table.rows.map(row =>
                _.mapValues(columns, (n: DataViewMetadataColumn, i) => n && row[n.index]));
        }

        public static getCategoricalValues(dataView: DataView) {
            var categorical = dataView && dataView.categorical;
            var categories = categorical && categorical.categories || [];
            var values = categorical && categorical.values || <DataViewValueColumns>[];
            var series: string[] = categorical && values.source && this.getSeriesValues(dataView);
            return categorical && _.mapValues(new this<any[]>(), (n, i) =>
                (<DataViewCategoricalColumn[]>_.toArray(categories)).concat(_.toArray(values))
                    .filter(x => x.source.roles && x.source.roles[i]).map(x => x.values)[0]
                || values.source && values.source.roles && values.source.roles[i] && series);
        }

        public static getSeriesValues(dataView: DataView) {
            return dataView && dataView.categorical && dataView.categorical.values
                && dataView.categorical.values.map(x => converterHelper.getSeriesName(x.source));
        }

        public static getCategoricalColumns(dataView: DataView) {
            var categorical = dataView && dataView.categorical;
            var categories = categorical && categorical.categories || [];
            var values = categorical && categorical.values || <DataViewValueColumns>[];
            return categorical && _.mapValues(
                new this<DataViewCategoryColumn & DataViewValueColumn[] & DataViewValueColumns>(),
                (n, i) => categories.filter(x => x.source.roles && x.source.roles[i])[0]
                    || values.source && values.source.roles && values.source.roles[i]
                    || values.filter(x => x.source.roles && x.source.roles[i]));
        }

        private static getColumnSourcesT<T>(dataView: DataView) {
            var columns = dataView && dataView.metadata && dataView.metadata.columns;
            return columns && _.mapValues(
                new this<T>(), (n, i) => columns.filter(x => x.roles && x.roles[i])[0]);
        }

        //Data Roles
        public Category: T = null;
        public Values: T = null;
    }

    export class WordCloud implements IVisual {
        private static ClassName: string = "wordCloud";

        private static Words: ClassAndSelector = {
            "class": "words",
            selector: ".words"
        };

        private static WordGroup: ClassAndSelector = {
            "class": "word",
            selector: ".word"
        };

        private static Size: string = "px";
        private static StopWordsDelemiter: string = " ";

        private static Radians: number = Math.PI / 180;

        private static MinAngle: number = -180;
        private static MaxAngle: number = 180;

        private static MaxNumberOfWords: number = 2500;

        private static MinOpacity: number = 0.2;
        private static MaxOpacity: number = 1;

        public static FontSizePercentageCoefficent = 1;

        public static capabilities: VisualCapabilities = {
            dataRoles: [{
                name: WordCloudColumns.Roles.Category,
                kind: VisualDataRoleKind.Grouping,
                displayName: "Category"
            }, {
                    name: WordCloudColumns.Roles.Values,
                    kind: VisualDataRoleKind.Measure,
                    displayName: "Values"
                }],
            dataViewMappings: [{
                conditions: [{
                    "Category": {
                        min: 1,
                        max: 1
                    },
                    "Values": {
                        min: 0,
                        max: 1
                    }
                }],
                categorical: {
                    categories: {
                        for: { in: "Category" },
                        dataReductionAlgorithm: { top: { count: WordCloud.MaxNumberOfWords } }
                    },
                    values: {
                        for: { in: "Values" }
                    }
                }
            }],
            sorting: {
                implicit: {
                    clauses: [{
                        role: "Values",
                        direction: 2 /*SortDirection.Descending*/ //Constant SortDirection.Descending currently is not supported on the msit
                    }]
                }
            },
            objects: {
                general: {
                    displayName: "General",
                    properties: {
                        formatString: {
                            type: {
                                formatting: {
                                    formatString: true
                                }
                            }
                        },
                        maxNumberOfWords: {
                            displayName: "Max number of words",
                            type: { numeric: true }
                        },
                        minFontSize: {
                            displayName: "Min Font",
                            type: { formatting: { fontSize: true } }
                        },
                        maxFontSize: {
                            displayName: "Max Font",
                            type: { formatting: { fontSize: true } }
                        },
                        isBrokenText: {
                            displayName: "Word-breaking",
                            type: { bool: true }
                        },
                    }
                },
                dataPoint: {
                    displayName: "Data colors",
                    properties: {
                        fill: {
                            displayName: "Fill",
                            type: { fill: { solid: { color: true } } }
                        }
                    }
                },
                stopWords: {
                    displayName: "Stop Words",
                    properties: {
                        show: {
                            displayName: "Show",
                            type: { bool: true }
                        },
                        isDefaultStopWords: {
                            displayName: "Default Stop Words",
                            type: { bool: true }
                        },
                        words: {
                            displayName: "Words",
                            type: { text: true }
                        }
                    }
                },
                rotateText: {
                    displayName: "Rotate Text",
                    properties: {
                        show: {
                            displayName: "Show",
                            type: { bool: true }
                        },
                        minAngle: {
                            displayName: "Min Angle",
                            type: { numeric: true }
                        },
                        maxAngle: {
                            displayName: "Max Angle",
                            type: { numeric: true }
                        },
                        maxNumberOfOrientations: {
                            displayName: "Max number of orientations",
                            type: { numeric: true }
                        }
                    }
                }
            }
        };

        private static Punctuation: string[] = [
            "!", ".", ":", "'", ";", ",", "!",
            "@", "#", "$", "%", "^", "&", "*",
            "(", ")", "[", "]", "\"", "\\", "/",
            "-", "_", "+", "="
        ];

        private static StopWords: string[] = [
            "a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an",
            "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot",
            "could", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get",
            "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i",
            "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may",
            "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often",
            "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should",
            "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these",
            "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what",
            "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet",
            "you", "your"
        ];

        private static DefaultMargin: IMargin = {
            top: 10,
            right: 10,
            bottom: 10,
            left: 10
        };

        public static converter(dataView: DataView, colors: IDataColorPalette, previousData: WordCloudData): WordCloudData {
            var categorical = WordCloudColumns.getCategoricalColumns(dataView);
            if(!categorical || !categorical.Category || _.isEmpty(categorical.Category.values)) {
                return null;
            }

            var catValues = WordCloudColumns.getCategoricalValues(dataView);
            var properties = WordCloudSettings.getProperties(WordCloud.capabilities);
            var settings: WordCloudSettings = WordCloud.parseSettings(dataView, previousData && previousData.settings);

            var wordValueFormatter = ValueFormatter.create({
                format: ValueFormatter.getFormatString(categorical.Category.source, properties.general.formatString),
                value: catValues.Category[0]
            });

            var stopWords = _.isString(settings.stopWords.words) ? settings.stopWords.words.split(WordCloud.StopWordsDelemiter) : [];
            stopWords = settings.stopWords.isDefaultStopWords ? stopWords.concat(WordCloud.StopWords) : stopWords;

            var colorHelper = new ColorHelper(colors, properties.dataPoint.fill, explore.util.getRandomColor());
            var texts = catValues.Category.map((item: string, index: number) => {
                var color;
                if (categorical.Category.objects && categorical.Category.objects[index]) {
                    color = explore.util.hexToRgb(colorHelper.getColorForMeasure(categorical.Category.objects[index], ""));
                } else {
                    color = previousData && previousData.texts && previousData.texts[index]
                        ? previousData.texts[index].color
                        : explore.util.getRandomColor();
                }

                let selectionId = new SelectionIdBuilder()
                    .withCategory(dataView.categorical.categories[0], index)
                    .createSelectionId();

                return <WordCloudText>{
                    text: item,
                    count: (catValues.Values && catValues.Values[index] && !isNaN(catValues.Values[index])) ? catValues.Values[index] : 1,
                    index: index,
                    selectionId: selectionId,
                    color: color,
                    textGroup: item
                };
            });

            var reducedTexts = WordCloud.getReducedText(texts, stopWords, settings);
            var dataPoints = WordCloud.getDataPoints(reducedTexts, settings, wordValueFormatter);
            return <WordCloudData>{
                dataView: dataView,
                settings: settings,
                texts: texts,
                dataPoints: dataPoints
            };
        }

        private static parseSettings(dataView: DataView, previousSettings: WordCloudSettings): WordCloudSettings {
            var settings = WordCloudSettings.parse(dataView, WordCloud.capabilities);
            settings.general.minFontSize = Math.max(settings.general.minFontSize, 1);
            settings.general.maxFontSize = Math.max(settings.general.maxFontSize, 1);
            settings.general.maxFontSize = Math.max(settings.general.maxFontSize, settings.general.minFontSize);

            settings.rotateText.minAngle = Math.max(Math.min(settings.rotateText.minAngle, WordCloud.MaxAngle), WordCloud.MinAngle);
            settings.rotateText.maxAngle = Math.max(Math.min(settings.rotateText.maxAngle, WordCloud.MaxAngle), WordCloud.MinAngle);
            settings.rotateText.maxAngle = Math.max(settings.rotateText.maxAngle, settings.rotateText.minAngle);

            settings.general.maxNumberOfWords = Math.max(
                Math.min(settings.general.maxNumberOfWords, WordCloud.MaxNumberOfWords), 1);
            settings.rotateText.maxNumberOfOrientations = Math.max(
                Math.min(settings.rotateText.maxNumberOfOrientations, WordCloud.MaxNumberOfWords), 1);

            settings.createOriginalSettings();
            return settings;
        }

        private static getReducedText(texts: WordCloudText[], stopWords: string[], settings: WordCloudSettings): WordCloudText[][] {
            var brokenStrings: WordCloudText[] = WordCloud.getBrokenWords(texts, stopWords, settings);
            var result = <WordCloudText[][]>_.values(_.groupBy(brokenStrings, x => x.text));
            result = result.map(texts => _.sortBy(texts, x => x.textGroup.length));
            return result;
        }

        private static getBrokenWords(words: WordCloudText[], stopWords: string[], settings: WordCloudSettings): WordCloudText[] {
            var brokenStrings: WordCloudText[] = [];
            var whiteSpaceRegExp: RegExp = /\s/;
            var punctuatuinRegExp: RegExp = new RegExp(`[${WordCloud.Punctuation.join("\\")}]`, "gim");

            if (!settings.general.isBrokenText) {
                return words;
            }

            words.forEach((item: WordCloudText) => {
                if (typeof item.text === "string") {
                    var words = item.text.replace(punctuatuinRegExp, " ").split(whiteSpaceRegExp);

                    if (settings.stopWords.show) {
                        words = words.filter((value: string) =>
                            value.length > 0 && !stopWords.some((removeWord: string) =>
                                value.toLocaleLowerCase() === removeWord.toLocaleLowerCase()));
                    }

                    words.forEach((element: string) => {
                        if (element.length > 0 && !whiteSpaceRegExp.test(element)) {
                            brokenStrings.push({
                                text: element,
                                textGroup: item.textGroup,
                                count: item.count,
                                index: item.index,
                                selectionId: item.selectionId,
                                color: item.color
                            });
                        }
                    });
                } else {
                    brokenStrings.push(item);
                }
            });

            return brokenStrings; 
        }

        private static getDataPoints(
            textGroups: WordCloudText[][],
            settings: WordCloudSettings,
            wordValueFormatter: IValueFormatter): WordCloudDataPoint[] {

            if (_.isEmpty(textGroups)) {
                return [];
            }

            var returnValues = textGroups.map((values: WordCloudText[]) => {
                return <WordCloudDataPoint>{
                    text: wordValueFormatter.format(values[0].text),
                    x: 0,
                    y: 0,
                    rotate: WordCloud.getAngle(settings),
                    padding: 1,
                    width: 0,
                    height: 0,
                    xOff: 0,
                    yOff: 0,
                    x0: 0,
                    y0: 0,
                    x1: 0,
                    y1: 0,
                    color: values[0].color,
                    selectionIds: values.map(x => x.selectionId),
                    wordIndex: values[0].index,
                    count: _.sum(values, x => x.count)
                };
            });

            var minValue = _.min(returnValues, x => x.count).count;
            var maxValue = _.max(returnValues, x => x.count).count;
            var texts = textGroups.map(x => x[0]);
            returnValues.forEach(x => x.size = WordCloud.getWordFontSize(texts, settings, x.count, minValue, maxValue));

            return returnValues.sort((a,b) => b.count - a.count);
        }

        private static getWordFontSize(
            texts: WordCloudText[],
            settings: WordCloudSettings,
            value: number,
            minValue: number,
            maxValue: number,
            scaleType: WordCloudScaleType = WordCloudScaleType.value) {

            var weight: number, fontSize: number;
            var minFontSize = settings.general.minFontSize * WordCloud.FontSizePercentageCoefficent;
            var maxFontSize = settings.general.maxFontSize * WordCloud.FontSizePercentageCoefficent;

            if (texts.length < 2) {
                return maxFontSize;
            }

            switch (scaleType) {
                case WordCloudScaleType.logn: {
                    weight = Math.log(value);
                }
                case WordCloudScaleType.sqrt: {
                    weight = Math.sqrt(value);
                }
                case WordCloudScaleType.value: {
                    weight = value;
                }
            }

            if (weight > minValue) {
                fontSize = (maxValue - minValue) !== 0
                    ? (maxFontSize * (weight - minValue)) / (maxValue - minValue)
                    : 0;
            } else {
                fontSize = 0;
            }

            fontSize = (fontSize * 100) / maxFontSize;

            fontSize = (fontSize * (maxFontSize - minFontSize)) / 100 + minFontSize;

            return fontSize;
        }

        private static getAngle(settings: WordCloudSettings): number {
            if (!settings.rotateText.show) {
                return 0;
            }

            var angle = ((settings.rotateText.maxAngle - settings.rotateText.minAngle)
                / settings.rotateText.maxNumberOfOrientations)
                * Math.floor(Math.random() * settings.rotateText.maxNumberOfOrientations);

            return settings.rotateText.minAngle + angle;
        }

        private get settings(): WordCloudSettings {
            return this.data && this.data.settings;
        }

        private data: WordCloudData;
        private durationAnimations: number = 500;
        private specialViewport: IViewport;

        private fakeViewport: IViewport = {
            width: 1500,
            height: 1000
        };

        private canvasViewport: IViewport = {
            width: 128,
            height: 2048
        };

        private colors: IDataColorPalette;
        private root: D3.Selection;
        private svg: D3.Selection;
        private main: D3.Selection;
        private wordsContainerSelection: D3.Selection;
        private wordsGroupUpdateSelection: D3.UpdateSelection;
        private wordsTextUpdateSelection: D3.UpdateSelection;

        private canvas: HTMLCanvasElement;

        private fontFamily: string;

        private animator: IGenericAnimator;

        private layout: VisualLayout;

        private hostService: IVisualHostServices;
        private selectionManager: CustomSelectionManager;

        private visualUpdateOptions: VisualUpdateOptions;

        private isUpdating: boolean;
        private incomingUpdateOptions: VisualUpdateOptions;

        constructor(options?: WordCloudConstructorOptions) {
            if (options) {
                this.svg = options.svg || this.svg;
                this.layout = new VisualLayout(null, options.margin || WordCloud.DefaultMargin);

                if (options.animator)
                    this.animator = options.animator;
            }
            this.isUpdating = false;
        }

        public init(options: VisualInitOptions): void {
            if (this.svg) {
                this.root = this.svg;
            } else {
                this.root = d3.select(options.element.get(0)).append("svg");
            }

            this.colors = options.style.colorPalette.dataColors;
            this.hostService = options.host;
            this.selectionManager = new CustomSelectionManager(this.hostService);

            this.layout = new VisualLayout(null, WordCloud.DefaultMargin);

            this.root.classed(WordCloud.ClassName, true);

            this.root.on("click", () => {
                this.setSelection(null);
            });

            this.fontFamily = this.root.style("font-family");

            this.main = this.root.append("g");

            this.wordsContainerSelection = this.main
                .append("g")
                .classed(WordCloud.Words["class"], true);

            this.canvas = document.createElement("canvas");
        }

        public update(visualUpdateOptions: VisualUpdateOptions): void {
            if (!visualUpdateOptions ||
                !visualUpdateOptions.viewport ||
                !visualUpdateOptions.dataViews ||
                !visualUpdateOptions.dataViews[0] ||
                !visualUpdateOptions.viewport ||
                !(visualUpdateOptions.viewport.height >= 0) ||
                !(visualUpdateOptions.viewport.width >= 0))
                return;

            if (visualUpdateOptions !== this.visualUpdateOptions) {
                this.incomingUpdateOptions = visualUpdateOptions;
            }

            if (!this.isUpdating && (this.incomingUpdateOptions !== this.visualUpdateOptions)) {
                this.visualUpdateOptions = this.incomingUpdateOptions;
                this.layout.viewport = this.visualUpdateOptions.viewport;
                var dataView: DataView = visualUpdateOptions.dataViews[0];

                if (this.layout.viewportInIsZero) {
                    return;
                }

                this.durationAnimations = getAnimationDuration(this.animator, visualUpdateOptions.suppressAnimations);
                this.UpdateSize();

                var data = WordCloud.converter(dataView, this.colors, this.data);
                if (!data) {
                    //ClearVisual?
                    return;
                }

                this.data = data;

                this.computePositions((wordCloudDataView: WordCloudDataView) => this.render(wordCloudDataView));
            }
        }

        private computePositions(onPositionsComputed: (WordCloudDataView) => void): void {
            var words = this.data.dataPoints;

            if (_.isEmpty(words)) {
                return null;
            }

            requestAnimationFrame(() => {
                var surface: number[] = _.range(0, (this.specialViewport.width >> 5) * this.specialViewport.height, 0);
                if (words.length > this.settings.general.maxNumberOfWords) {
                    words = words.slice(0, this.settings.general.maxNumberOfWords);
                }

                words.forEach(data => {
                    data.widthOfWord = TextMeasurementService.measureSvgTextWidth(<TextProperties>{ 
                        fontFamily: this.fontFamily,
                        fontSize: (data.size + 1) +  WordCloud.Size,
                        //fontWeight: "normal",
                        //fontStyle: "normal",
                        text: data.text
                    }) + 2;
                });

                this.computeCycle(words, this.getCanvasContext(), surface, null, onPositionsComputed, [], 0);
            });
        }

        private computeCycle(
            words: WordCloudDataPoint[],
            context: CanvasRenderingContext2D,
            surface: number[],
            borders: IPoint[],
            onPositionsComputed: (WordCloudDataView) => void,
            wordsForDraw: WordCloudDataPoint[] = [],
            index: number = 0): void {
            var word: WordCloudDataPoint = words[index],
                ratio: number = 1;

            if (words.length <= 10)
                ratio = 5;
            else if (words.length <= 25)
                ratio = 3;
            else if (words.length <= 75)
                ratio = 1.5;
            else if (words.length <= 100)
                ratio = 1.25;

            word.x = (this.specialViewport.width / ratio * (Math.random() + 0.5)) >> 1;
            word.y = (this.specialViewport.height / ratio * (Math.random() + 0.5)) >> 1;

            if(!word.sprite) {
                this.generateSprites(context, words, index);
            }

            if (word.sprite && this.findPosition(surface, word, borders)) {
                wordsForDraw.push(word);

                borders = this.updateBorders(word, borders);
                word.x -= this.specialViewport.width >> 1;
                word.y -= this.specialViewport.height >> 1;
            }

            if (++index < words.length && this.root) {
                this.computeCycle(words, context, surface, borders, onPositionsComputed, wordsForDraw, index);
            } else {
                onPositionsComputed({
                    data: wordsForDraw,
                    leftBorder: borders && borders[0],
                    rightBorder: borders && borders[1]
                });
            }
        }

        private updateBorders(word: WordCloudDataPoint, borders: IPoint[]): IPoint[] {
            if (borders && borders.length === 2) {
                var leftBorder: IPoint = borders[0],
                    rightBorder: IPoint = borders[1];

                if (word.x + word.x0 < leftBorder.x)
                    leftBorder.x = word.x + word.x0;

                if (word.y + word.y0 < leftBorder.y)
                    leftBorder.y = word.y + word.y0;

                if (word.x + word.x1 > rightBorder.x)
                    rightBorder.x = word.x + word.x1;

                if (word.y + word.y1 > rightBorder.y)
                    rightBorder.y = word.y + word.y1;
            } else {
                borders = [
                    {
                        x: word.x + word.x0,
                        y: word.y + word.y0
                    }, {
                        x: word.x + word.x1,
                        y: word.y + word.y1
                    }
                ];
            }

            return borders;
        }

        private generateSprites(
            context: CanvasRenderingContext2D,
            words: WordCloudDataPoint[],
            startIndex: number): void {

            context.clearRect(0, 0, this.canvasViewport.width << 5, this.canvasViewport.height);

            var x: number = 0,
                y: number = 0,
                maxHeight: number = 0;

            for (var i: number = startIndex, length = words.length; i < length; i++) {
                var currentWordData: WordCloudDataPoint = words[i];
                var widthOfWord: number = currentWordData.widthOfWord;
                var heightOfWord: number = currentWordData.size << 1;

                if (currentWordData.rotate) {
                    var sr: number = Math.sin(currentWordData.rotate * WordCloud.Radians),
                        cr: number = Math.cos(currentWordData.rotate * WordCloud.Radians),
                        widthCr: number = widthOfWord * cr,
                        widthSr: number = widthOfWord * sr,
                        heightCr: number = heightOfWord * cr,
                        heightSr: number = heightOfWord * sr;

                    widthOfWord = (Math.max(Math.abs(widthCr + heightSr), Math.abs(widthCr - heightSr)) + 31) >> 5 << 5;
                    heightOfWord = Math.floor(Math.max(Math.abs(widthSr + heightCr), Math.abs(widthSr - heightCr)));
                } else {
                    widthOfWord = (widthOfWord + 31) >> 5 << 5;
                }

                if (heightOfWord > maxHeight) {
                    maxHeight = heightOfWord;
                }

                if (x + widthOfWord >= (this.canvasViewport.width << 5)) {
                    x = 0;
                    y += maxHeight;
                    maxHeight = 0;
                }

                context.save();
                context.font = "normal normal " + (currentWordData.size + 1) + WordCloud.Size + " " + this.fontFamily;
                context.translate((x + (widthOfWord >> 1)), (y + (heightOfWord >> 1)));

                if (currentWordData.rotate) {
                    context.rotate(currentWordData.rotate * WordCloud.Radians);
                }

                context.fillText(currentWordData.text, 0, 0);

                if (currentWordData.padding) {
                    context.lineWidth = 2 * currentWordData.padding;
                    context.strokeText(currentWordData.text, 0, 0);
                }

                context.restore();

                currentWordData.width = widthOfWord;
                currentWordData.height = heightOfWord;
                currentWordData.xOff = x;
                currentWordData.yOff = y;
                currentWordData.x1 = widthOfWord >> 1;
                currentWordData.y1 = heightOfWord >> 1;
                currentWordData.x0 = -currentWordData.x1;
                currentWordData.y0 = -currentWordData.y1;

                x += widthOfWord;
            }

            this.setSprites(context, words);
        }

        private setSprites(context: CanvasRenderingContext2D, words: WordCloudDataPoint[]) {
            var pixels = context.getImageData(0, 0, this.canvasViewport.width << 5, this.canvasViewport.height).data;

            var sprites: number[] = [];

            for (var i = words.length - 1; i >= 0; i--) {
                var currentWordData: WordCloudDataPoint = words[i],
                    width: number = currentWordData.width,
                    width32: number = width >> 5,
                    height: number = currentWordData.y1 - currentWordData.y0,
                    x: number = 0,
                    y: number = 0,
                    seen: number = 0,
                    seenRow: number = 0;

                if (currentWordData.xOff + width >= (this.canvasViewport.width << 5) ||
                    currentWordData.yOff + height >= this.canvasViewport.height) {
                    currentWordData.sprite = null;

                    continue;
                }

                for (var j = 0; j < height * width32; j++) {
                    sprites[j] = 0;
                }

                if (currentWordData.xOff !== null) {
                    x = currentWordData.xOff;
                } else {
                    return;
                }

                y = currentWordData.yOff;

                seen = 0;
                seenRow = -1;

                for (var j = 0; j < height; j++) {
                    for (var k = 0; k < width; k++) {
                        var l: number = width32 * j + (k >> 5);
                        var index: number = ((y + j) * (this.canvasViewport.width << 5) + (x + k)) << 2;
                        var m: number = pixels[index]
                                ? 1 << (31 - (k % 32))
                                : 0;

                        sprites[l] |= m;
                        seen |= m;
                    }

                    if (seen) {
                        seenRow = j;
                    } else {
                        currentWordData.y0++;
                        height--;
                        j--;
                        y++;
                    }
                }

                currentWordData.y1 = currentWordData.y0 + seenRow;
                currentWordData.sprite = sprites.slice(0, (currentWordData.y1 - currentWordData.y0) * width32);
            }
        }

        private findPosition(surface: number[], word: WordCloudDataPoint, borders: IPoint[]): boolean {
            var startPoint: IPoint = { x: word.x, y: word.y },
                delta = Math.sqrt(this.specialViewport.width * this.specialViewport.width + this.specialViewport.height * this.specialViewport.height),
                point: IPoint,
                dt: number = Math.random() < 0.5 ? 1 : -1,
                shift: number = -dt,
                dx: number,
                dy: number;

            while (true) {
                shift += dt;

                point = this.archimedeanSpiral(shift);

                dx = Math.floor(point.x);
                dy = Math.floor(point.y);

                if (Math.min(Math.abs(dx), Math.abs(dy)) >= delta) {
                    break;
                }

                word.x = startPoint.x + dx;
                word.y = startPoint.y + dy;

                if (word.x + word.x0 < 0 ||
                    word.y + word.y0 < 0 ||
                    word.x + word.x1 > this.specialViewport.width ||
                    word.y + word.y1 > this.specialViewport.height)
                    continue;

                if (!borders || !this.checkIntersect(word, surface)) {
                    if (!borders || this.checkIntersectOfRectangles(word, borders[0], borders[1])) {
                        var sprite: number[] = word.sprite,
                            width: number = word.width >> 5,
                            shiftWidth: number = this.specialViewport.width >> 5,
                            lx: number = word.x - (width << 4),
                            sx: number = lx & 127,
                            msx: number = 32 - sx,
                            height: number = word.y1 - word.y0,
                            x: number = (word.y + word.y0) * shiftWidth + (lx >> 5);

                        for (var i: number = 0; i < height; i++) {
                            var lastSprite: number = 0;

                            for (var j: number = 0; j <= width; j++) {
                                var leftMask: number = lastSprite << msx,
                                    rightMask: number;

                                if (j < width)
                                    lastSprite = sprite[i * width + j];

                                rightMask = j < width
                                    ? lastSprite >>> sx
                                    : 0;

                                surface[x + j] |= leftMask | rightMask;
                            }

                            x += shiftWidth;
                        }

                        word.sprite = null;

                        return true;
                    }
                }
            }

            return false;
        }

        private archimedeanSpiral(value: number): IPoint {
            var ratio: number = this.specialViewport.width / this.specialViewport.height;

            value = value * 0.1;

            return {
                x: ratio * value * Math.cos(value),
                y: value * Math.sin(value)
            };
        }

        private checkIntersect(word: WordCloudDataPoint, surface: number[]): boolean {
            var shiftWidth: number = this.specialViewport.width >> 5,
                sprite: number[] = word.sprite,
                widthOfWord = word.width >> 5,
                lx: number = word.x - (widthOfWord << 4),
                sx: number = lx & 127,
                msx: number = 32 - sx,
                heightOfWord = word.y1 - word.y0,
                x: number = (word.y + word.y0) * shiftWidth + (lx >> 5);

            for (var i = 0; i < heightOfWord; i++) {
                var lastSprite: number = 0;

                for (var j = 0; j <= widthOfWord; j++) {
                    var mask: number = 0,
                        leftMask: number,
                        intersectMask: number = 0;

                    leftMask = lastSprite << msx;

                    if (j < widthOfWord)
                        lastSprite = sprite[i * widthOfWord + j];

                    mask = j < widthOfWord
                        ? lastSprite >>> sx
                        : 0;

                    intersectMask = (leftMask | mask) & surface[x + j];

                    if (intersectMask)
                        return true;
                }

                x += shiftWidth;
            }

            return false;
        }

        private checkIntersectOfRectangles(word: WordCloudDataPoint, leftBorder: IPoint, rightBorder: IPoint): boolean {
            return (word.x + word.x1) > leftBorder.x &&
                (word.x + word.x0) < rightBorder.x &&
                (word.y + word.y1) > leftBorder.y &&
                (word.y + word.y0) < rightBorder.y;
        }

        private getCanvasContext(): CanvasRenderingContext2D {
            if (!this.canvasViewport)
                return null;

            this.canvas.width = 1;
            this.canvas.height = 1;

            var context: CanvasRenderingContext2D = this.canvas.getContext("2d");

            this.canvas.width = this.canvasViewport.width << 5;
            this.canvas.height = this.canvasViewport.height;

            context = this.canvas.getContext("2d");
            context.fillStyle = context.strokeStyle = "red";
            context.textAlign = "center";

            return context;
        }

        private UpdateSize(): void {
            var fakeWidth: number,
                fakeHeight: number,
                ratio: number;

            ratio = Math.sqrt((this.fakeViewport.width * this.fakeViewport.height)
                / (this.layout.viewportIn.width * this.layout.viewportIn.height));

            if (isNaN(ratio)) {
                fakeHeight = fakeWidth = 1;
            } else {
                fakeHeight = this.layout.viewportIn.height * ratio;
                fakeWidth = this.layout.viewportIn.width * ratio;
            }

            this.specialViewport = {
                height: fakeHeight,
                width: fakeWidth
            };

            this.root.attr({
                "height": this.layout.viewport.height,
                "width": this.layout.viewport.width
            });
        }

        private render(wordCloudDataView: WordCloudDataView): void {
            if (!wordCloudDataView || !wordCloudDataView.data) {
                return;
            }

            this.scaleMainView(wordCloudDataView);

            this.wordsGroupUpdateSelection = this.main
                .select(WordCloud.Words.selector)
                .selectAll("g")
                .data(wordCloudDataView.data);

            var wordGroupEnterSelection = this.wordsGroupUpdateSelection
                .enter()
                .append("svg:g")
                .classed(WordCloud.WordGroup.class, true);

            wordGroupEnterSelection
                .append("svg:text")
                .style("font-size", "1px")
                .attr('pointer-events', "none");
            wordGroupEnterSelection
                .append("svg:rect");

            this.wordsGroupUpdateSelection.exit().remove();

            this.wordsGroupUpdateSelection
                .attr('transform', (d: WordCloudDataPoint) => `${SVGUtil.translate(d.x, d.y)} rotate(${d.rotate})`)
                .sort((a: WordCloudDataPoint, b: WordCloudDataPoint) => b.height * b.width - a.height * a.width);

            this.wordsTextUpdateSelection = this.wordsGroupUpdateSelection.selectAll("text").data(d => [d]);
            this.wordsTextUpdateSelection.text((d: WordCloudDataPoint) => d.text);

            this.animation(this.wordsTextUpdateSelection, this.durationAnimations)
                .style({
                    "font-size": ((item: WordCloudDataPoint): string => `${item.size}${WordCloud.Size}`),
                    "fill": ((item: WordCloudDataPoint): string => item.color),
                });

            this.wordsGroupUpdateSelection.selectAll("rect").data(d => [d])
                .attr({
                    x: (d: WordCloudDataPoint) => -d.widthOfWord * 0.5,
                    width: (d: WordCloudDataPoint) => d.widthOfWord,
                    y: (d: WordCloudDataPoint) => -d.size * 0.75,
                    height: (d: WordCloudDataPoint) => d.size * 0.85,
                    fill: (d: WordCloudDataPoint) => "rgba(63, 191, 191, 0.0)",
                })
                .on("click", d => { this.setSelection(d); d3.event.stopPropagation(); });

            this.renderSelection();

            this.isUpdating = false;
            if (this.incomingUpdateOptions !== this.visualUpdateOptions) {
                this.update(this.incomingUpdateOptions);
            }
        }

        private setSelection(dataPoint: WordCloudDataPoint) {
            if(!dataPoint) {
                this.selectionManager.clear().then(() => this.renderSelection());
                return;
            }

            var selectionIds = dataPoint.selectionIds;

            if(this.selectionManager.isSelected(selectionIds) && d3.event.ctrlKey) {
                var dataPoints: WordCloudDataPoint[] = this.wordsGroupUpdateSelection.data()
                    .filter((d: WordCloudDataPoint) => d.text !== dataPoint.text);
                selectionIds = selectionIds.filter(x => !dataPoints.some(d => 
                        this.selectionManager.isSelected(d.selectionIds)
                        && utility.SelectionManager.containsSelection(d.selectionIds, x)));
            }

            this.selectionManager.selectAndSendSelection(selectionIds, d3.event.ctrlKey);

            this.renderSelection();
        }

        private scaleMainView(wordCloudDataView: WordCloudDataView) {
            var rectangles = wordCloudDataView.data.map(d => {
                var hw = d.width/2;
                var hh = d.height/2;
                return <ClientRect>{ left: d.x - hw, top: d.y - hh, right: d.x + hw, bottom: d.y + hh };
            });
            var rectangle = <ClientRect>{
                left: _.min(rectangles, x => x.left).left,
                top: _.min(rectangles, x => x.top).top,
                right: _.max(rectangles, x => x.right).right,
                bottom: _.max(rectangles, x => x.bottom).bottom
            };

            rectangle.width = rectangle.right - rectangle.left;
            rectangle.height = rectangle.bottom - rectangle.top;

            var scaleByX = this.layout.viewportIn.width / (rectangle.width);
            var scaleByY = this.layout.viewportIn.height / (rectangle.height);

            var scale = Math.min(scaleByX, scaleByY);

            var x = -rectangle.left * scale + 5;
            var y = -rectangle.top * scale + 5;

            this.main
                .style("line-height", "5px");//TODO: This construction fixes bug #6343.
            this.main
                .attr("transform", `${SVGUtil.translate(x, y)} scale(${scale})`)
                .style("line-height", "10px");//TODO: This construction fixes bug #6343.
        }

        private renderSelection(): void {
            if (this.selectionManager.selectionIds.some(x =>
                !this.wordsGroupUpdateSelection.data().some((y: WordCloudDataPoint) =>
                    y.selectionIds.some(z => z.getKey() === x.getKey())))) {
                this.selectionManager.clear(false);
            }

            if (!this.selectionManager.hasSelection) {
                this.setOpacity(this.wordsTextUpdateSelection, WordCloud.MaxOpacity);
                return;
            }

            var selectedColumns = this.wordsTextUpdateSelection.filter((x: WordCloudDataPoint) =>
                this.selectionManager.isSelected(x.selectionIds[0]));

            this.setOpacity(this.wordsTextUpdateSelection, WordCloud.MinOpacity);
            this.setOpacity(selectedColumns, WordCloud.MaxOpacity);
        }

        private setOpacity(element: D3.Selection, opacityValue: number): void {
            element.style("fill-opacity", opacityValue);

            if (this.main) {//TODO: This construction fixes bug #6343.
                this.main.style("line-height", "14px");

                this.animation(this.main, 0, this.durationAnimations)
                    .style("line-height", "15px");
            }
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions) {
            var instances = WordCloudSettings.enumerateObjectInstances(
                this.settings && this.settings.originalSettings,
                options,
                WordCloud.capabilities);

            switch (options.objectName) {
                case "dataPoint": if (this.data && this.data.dataPoints) {
                    var wordCategoriesIndex: number[] = [];
                    _.unique(this.data.dataPoints, x => x.wordIndex).forEach((item: WordCloudDataPoint) => {
                        if (wordCategoriesIndex.indexOf(item.wordIndex) === -1) {
                            wordCategoriesIndex.push(item.wordIndex);
                            instances.pushInstance({
                                objectName: options.objectName,
                                displayName: this.data.texts[item.wordIndex].text,
                                selector: ColorHelper.normalizeSelector(item.selectionIds[0].getSelector(), false),
                                properties: { fill: { solid: { color: item.color } } }
                            });
                        }
                    });
                }

                break;
            }

            return instances.complete();
        }

        private animation<T extends D3.Selection>(
            element: T,
            duration: number = 0,
            delay: number = 0,
            callback?: (data: any, index: number) => void): D3.Transition.Transition {
            return element
                .transition()
                .delay(delay)
                .duration(duration)
                .each("end", callback);
        }

        public destroy(): void {
            this.root = null;
            this.canvas = null;
        }
    }

    module explore.util {
        export function hexToRgb(hex): string {
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function(m, r, g, b) {
                return r + r + g + g + b + b;
            });

            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? `rgb(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)})` : null;
        }

        export function getRandomColor(): string {
            var red: number = Math.floor(Math.random() * 255),
                green: number = Math.floor(Math.random() * 255),
                blue: number = Math.floor(Math.random() * 255);

            return `rgb(${red},${green},${blue})`;
        }
    }
}