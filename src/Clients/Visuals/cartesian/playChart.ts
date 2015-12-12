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

    export interface PlayableVisual {
        renderAtFrameIndex(frameIndex: number): void;
    }

    // TODO: use templating for the base visual datapoint class (allViewModels: T[][])
    //      export interface PlayChartData<T> {
    // TODO: consider organizing better with logical grouping, like playData.state = {isPlaying,currentFrameIndex,etc}, and .elements = {playContainer,playButton,slider,callout,etc}
    export interface PlayChartData {
        host?: IVisualHostServices;
        frameKeys: any[];
        allViewModels?: PlayableChartData[];
        currentViewModel?: PlayableChartData;
        currentFrameIndex?: number;
        lastRenderedTraceFrameIndex?: number;
        currentViewport?: IViewport;
        lastRenderedViewport?: IViewport;
        frameCount?: number;
        isPlaying?: boolean;

        element?: JQuery;
        svg?: JQuery;

        playAxisContainer?: JQuery; //contains the playButton and slider
        playButton?: JQuery;
        playButtonCircle?: JQuery;
        slider?: JQuery;
        callout?: JQuery;
        
        // do not call converter() when we call persistProperties and a new update() happens
        // NOTE: calling persistProperties will still cause a render() call to come from cartesianChart
        // TODO: make persist properties only optionally trigger a new onDataChagned, as most charts don't want this (only slicer needs it)
        ridiculousFlagForPersistProperties?: boolean;

        renderAtFrameIndexFn?(frameIndex: number): void;
    }

    // TODO: consider a template for the datapoint type <T> instead of any[]
    export interface PlayableChartData {
        dataPoints: any[];
    }

    export interface PlayableConverterOptions {
        viewport: IViewport;
    }

    //interface PlayDataState {
    //}

    //interface PlayDataElements {
    //}
    
    interface PlayObjectProperties {
        currentFrameIndex?: number;
    }

    interface PlayLabelInfo {
        label: string;
        labelWidth: number;
    }

    interface PlayLabelData {
        labelInfo: PlayLabelInfo[];
        anyWordBreaks: boolean;
    }

    export module PlayChart {
        // TODO: add speed control to property pane
        // NOTE: current noUiSlider speed is a CSS property of the class .noUi-state-tap, and also is hard-coded in noUiSlider.js. We'll need to add a new create param for transition time.
        // 800ms matches Silverlight frame speed
        const FrameStepDuration = 800;
        export const FrameAnimationDuration = 750; //leave 50ms for the traceline animation - to avoid being cancelled. TODO: add a proper wait impl.
        const SliderMarginLeft = 15 + 24 + 10*2; //left margin + playButton width + playButton margin
        const SliderMarginRight = 20;
        const SliderMaxMargin = 100;
        export const ClassName = 'playChart';

        export function init(options: CartesianVisualInitOptions, playData: PlayChartData) {
            playData.element = options.element;
            playData.svg = options.svg ? $(options.svg.node()) : null;
            playData.currentViewport = {
                height: options.viewport.height,
                width: options.viewport.width
            };
            playData.host = options.host;
        }

        export function convertMatrixToCategorical(matrix: DataViewMatrix, frame: number): DataViewCategorical {

            let categorical: DataViewCategorical = {
                categories: [],
                values: powerbi.data.DataViewTransform.createValueColumns()
            };

            // If we only have a Play field, we don't have series or categories, then just return early
            if (matrix.rows.levels.length < 2 && matrix.columns.levels.length === 0)
                return categorical;

            let category: DataViewCategoryColumn = {
                source: matrix.rows.levels.length > 1 ? matrix.rows.levels[1].sources[0] : matrix.columns.levels[0].sources[0],
                values: [],
                objects: undefined,
                identity: []
            };

            // Matrix shape for Play:
            //
            //                   Series1 | Series2 | ...
            //                  --------- --------  
            // Play1 | Category1 | values  | values
            //       | Category2 | values  | values
            //       | ...
            // Play2 | Category1 | values  | values
            //       | Category2 | values  | values
            // ...

            // we are guaranteed at least one row (it will be the Play field)
            let hasRowChildren = matrix.rows.root.children;
            let hasColChildren = matrix.columns.root.children;
            let hasSeries = matrix.columns.levels.length > 1 && hasColChildren;
            let hasPlayAndCategory = matrix.rows.levels.length > 1 && hasRowChildren;

            if (hasSeries && !hasPlayAndCategory) {
                // special case - series but no categories - use series as categories
                
                // set categories to undefined
                categorical.categories = undefined;

                let node = matrix.columns.root;
                categorical.values.source = matrix.columns.levels[0].sources[0];
                let columnLength = matrix.valueSources.length;
                for (let i = 0, len = node.children.length; i < len; i++) {
                    // add all the value sources for each series
                    let columnNode = node.children[i];
                    for (let j = 0; j < columnLength; j++) {
                        let source = <any>_.create(matrix.valueSources[j], { groupName: columnNode.value });
                        let dataViewColumn: DataViewValueColumn = {
                            identity: columnNode.identity,
                            values: [],
                            source: source
                        };
                        categorical.values.push(dataViewColumn);
                    }
                }

                let innerValueNode = matrix.rows.root.children[frame];
                for (let i = 0, len = node.children.length; i < len; i++) {
                    for (let j = 0; j < columnLength; j++) {
                        categorical.values[i * columnLength + j].values.push(innerValueNode.values[i * columnLength + j].value);
                    }
                }
            }
            else if (hasSeries && hasRowChildren) {
                // series and categories
                let node = matrix.rows.root.children[frame];
                
                // create the categories first
                for (let i = 0, len = node.children.length; i < len; i++) {
                    let innerNode = node.children[i];
                    category.identity.push(innerNode.identity);
                    category.values.push(innerNode.value);
                }

                // now add the series info
                categorical.values.source = matrix.columns.levels[0].sources[0];
                let nodeQueue = [];
                let columnNode = matrix.columns.root;
                let seriesIndex = -1;
                while (columnNode) {
                    if (columnNode.children && columnNode.children[0].children) {
                        for (let j = 0, jlen = columnNode.children.length; j < jlen; j++) {
                            // each of these is a "series"
                            nodeQueue.push(columnNode.children[j]);
                        }
                    } else if (columnNode.children && node.children) {
                        // Processing a single series under here, push all the value sources for every series.
                        let columnLength = columnNode.children.length;
                        for (let j = 0; j < columnLength; j++) {
                            let source = <any>_.create(matrix.valueSources[j], { groupName: columnNode.value });
                            let dataViewColumn: DataViewValueColumn = {
                                identity: columnNode.identity,
                                values: [],
                                source: source,
                            };
                            categorical.values.push(dataViewColumn);
                        }
                        for (let i = 0, len = node.children.length; i < len; i++) {
                            let innerNode = node.children[i];
                            for (let j = 0; j < columnLength; j++) {
                                categorical.values[seriesIndex * columnLength + j].values.push(innerNode.values[seriesIndex * columnLength + j].value);
                            }
                        }
                    }

                    if (nodeQueue.length > 0) {
                        columnNode = nodeQueue[0];
                        nodeQueue = nodeQueue.splice(1);
                        seriesIndex++;
                    } else
                        columnNode = undefined;
                }
            }
            else if (hasPlayAndCategory) {
                // no series, just play and category
                let node = matrix.rows.root.children[frame];
                let measureLength = matrix.valueSources.length;
                for (let j = 0; j < measureLength; j++) {
                    let dataViewColumn: DataViewValueColumn = {
                        identity: undefined,
                        values: [],
                        source: matrix.valueSources[j]
                    };
                    categorical.values.push(dataViewColumn);
                }

                for (let i = 0, len = node.children.length; i < len; i++) {
                    let innerNode = node.children[i];
                    category.identity.push(innerNode.identity);
                    category.values.push(innerNode.value);

                    for (let j = 0; j < measureLength; j++) {
                        categorical.values[j].values.push(innerNode.values[j].value);
                    }
                }
            }

            if (categorical.categories)
                categorical.categories.push(category);

            return categorical;
        }

        function getObjectProperties(dataViewMetadata: DataViewMetadata, dataLabelsSettings?: PointDataLabelsSettings): PlayObjectProperties {
            let objectProperties: PlayObjectProperties = {};

            if (dataViewMetadata && dataViewMetadata.objects) {
                let objects = dataViewMetadata.objects;
                objectProperties.currentFrameIndex = DataViewObjects.getValue(objects, scatterChartProps.currentFrameIndex.index, null);
            }
            return objectProperties;
        }

        export function converter(
            dataView: DataView,
            visualConverter: (dataView: DataView, options: any) => any,
            visualConverterOptions: any): PlayChartData {

            let dataViewMetadata: DataViewMetadata = dataView.metadata;

            let dataLabelsSettings = dataLabelUtils.getDefaultPointLabelSettings();
            let objectProperties = getObjectProperties(dataViewMetadata, dataLabelsSettings);

            let allViewModels = [];
            let frameKeys = [];
            let currentViewModel = undefined;
            let matrixRows = dataView.matrix.rows;
            let rowChildrenLength = matrixRows.root.children ? matrixRows.root.children.length : 0;
            if (dataView.matrix && rowChildrenLength > 0) {
                let keySourceColumn = matrixRows.levels[0].sources[0];
                let keyFormatter = valueFormatter.create({
                    format: valueFormatter.getFormatString(keySourceColumn, scatterChartProps.general.formatString),
                    value: matrixRows.root.children[0],
                    value2: matrixRows.root.children[rowChildrenLength - 1],
                });
                for (let i = 0, len = rowChildrenLength; i < len; i++) {
                    let key = matrixRows.root.children[i];
                    frameKeys.push(keyFormatter.format(key.value));
                    let dataViewCategorical = PlayChart.convertMatrixToCategorical(dataView.matrix, i);

                    // call child converter
                    currentViewModel = visualConverter({ metadata: dataView.metadata, categorical: dataViewCategorical }, visualConverterOptions);
                    allViewModels.push(currentViewModel);
                }
            }
            else {
                // call child converter
                let dataViewCategorical = PlayChart.convertMatrixToCategorical(dataView.matrix, 0);
                currentViewModel = visualConverter({ metadata: dataView.metadata, categorical: dataViewCategorical }, visualConverterOptions);
                allViewModels.push(currentViewModel);
            }

            // use the saved frame index, or default to the last frame
            // FEATURE CHANGE: always default to go to the last frame.
            //if (objectProperties.currentFrameIndex == null) {
                objectProperties.currentFrameIndex = frameKeys.length - 1; //default
                // currentViewModel is already set to the last frame
            //}
            //else if (objectProperties.currentFrameIndex < frameKeys.length) {
                //currentViewModel = allViewModels[objectProperties.currentFrameIndex];
            //}

            return {
                isPlaying: false,
                allViewModels: allViewModels,
                currentViewModel: currentViewModel,
                frameKeys: frameKeys,
                currentFrameIndex: objectProperties.currentFrameIndex,
                lastRenderedViewport: { width: 0, height: 0 }
            };
        }

        export function getDefaultPlayData(): PlayChartData {
            let defaultData: PlayChartData = {
                frameKeys: [],
            };
            return defaultData;
        }

        export function setData(playData: PlayChartData,
            dataView: DataView,
            visualConverter: (dataView: DataView, options: any) => any,
            visualConverterOptions: PlayableConverterOptions,
            resized?: boolean): PlayChartData {

            if (playData && visualConverterOptions.viewport) {
                playData.currentViewport = {
                    height: visualConverterOptions.viewport.height,
                    width: visualConverterOptions.viewport.width
                };
            }

            if (dataView) {
                if (playData && playData.ridiculousFlagForPersistProperties && dataView.metadata) {
                    // BUG FIX: customer feedback has been strong that we should always default to show the last frame.
                    // This is essential for dashboard tiles to refresh properly.

                    //  Only copy frameIndex since it is the only property using persistProperties
                    //let objectProps = getObjectProperties(dataView.metadata);
                    //playData.currentFrameIndex = objectProps.currentFrameIndex;
                    
                    //  Turn off the flag that was set by our persistProperties call
                    playData.ridiculousFlagForPersistProperties = false;
                    return playData;
                }
                else if (dataView.matrix || dataView.categorical) {
                    if (resized)
                        return playData;

                    let data = PlayChart.converter(dataView, visualConverter, visualConverterOptions);

                    if (data && playData) {
                        // TODO: we shouldn't have to do this, fix
                        // copy state properties over
                        data.element = playData.element;
                        data.svg = playData.svg;
                        data.host = playData.host;
                        data.callout = playData.callout;
                        data.playAxisContainer = playData.playAxisContainer;
                        data.playButton = playData.playButton;
                        data.slider = playData.slider;
                        data.playButtonCircle = playData.playButtonCircle;
                        data.ridiculousFlagForPersistProperties = playData.ridiculousFlagForPersistProperties;
                        data.renderAtFrameIndexFn = playData.renderAtFrameIndexFn;

                        return data;
                    }
                }
            }

            return getDefaultPlayData();
        }

        // TODO: specific to ScatterChartDataPoint right now (.x and .y), update to handle .value and .categoryValue also (CartesianDataPoint)
        export function getMinMaxForAllFrames(playData: PlayChartData): { xRange: NumberRange, yRange: NumberRange } {
            let minY = 0,
                maxY = 10,
                minX = 0,
                maxX = 10;

            if (playData.allViewModels && playData.allViewModels.length > 0) {
                minY = minX = Number.MAX_VALUE;
                maxY = maxX = Number.MIN_VALUE;
                for (let i = 0, len = playData.allViewModels.length; i < len; i++) {
                    let dps = playData.allViewModels[i].dataPoints;
                    minY = Math.min(d3.min<ScatterChartDataPoint, number>(dps, d => d.y), minY);
                    maxY = Math.max(d3.max<ScatterChartDataPoint, number>(dps, d => d.y), maxY);
                    minX = Math.min(d3.min<ScatterChartDataPoint, number>(dps, d => d.x), minX);
                    maxX = Math.max(d3.max<ScatterChartDataPoint, number>(dps, d => d.x), maxX);
                }
            }

            return {
                xRange: { min: minX, max: maxX },
                yRange: { min: minY, max: maxY }
            };
        }

        export function clearPlayDOM(playData: PlayChartData): void {
            if (!playData)
                return;
            if (playData.playAxisContainer)
                playData.playAxisContainer.remove();
            if (playData.callout)
                playData.callout.remove();
        }

        function createSliderDOM(playData: PlayChartData, behaviorOptions: PlayBehaviorOptions, interactivityService: IInteractivityService): void {
            // a container to position the button and the slider together
            playData.playAxisContainer = $('<div class="play-axis-container"></div>')
                .appendTo(playData.element);

            playData.playButtonCircle = $('<div class="button-container"></div>')
                .appendTo(playData.playAxisContainer);
            playData.playButton = $('<div class="play"></div>')
                .appendTo(playData.playButtonCircle);

            // the noUiSlider
            playData.slider = $('<div class="sliders"></div>')
                .appendTo(playData.playAxisContainer);
        }

        function createSliderControl(playData: PlayChartData, slider: JQuery, sliderWidth: number, labelData: PlayLabelData): void {
            // re-create the slider
            if ((<any>slider[0]).noUiSlider)
                (<any>slider[0]).noUiSlider.destroy();

            let numFrames = playData.frameKeys.length;
            if (numFrames > 0) {
                let filterPipLabels = createPipsFilterFn(playData, sliderWidth, labelData);
                let lastIndex = numFrames - 1;
                noUiSlider.create(
                    slider[0],
                    {
                        step: 1,
                        start: [playData.currentFrameIndex],
                        range: {
                            min: [0],
                            max: [lastIndex],
                        },
                        pips: {
                            mode: 'steps',
                            density: Math.round(100 / numFrames), //only draw ticks where we have labels
                            format: {
                                to: (index) => playData.frameKeys[index],
                                from: (value) => playData.frameKeys.indexOf(value),
                            },
                            filter: filterPipLabels,
                        },
                    });

                (<any>slider[0]).noUiSlider.on('slide', () => {
                    playData.isPlaying = false; //stop the play sequence
                    let indexToShow = Math.round((<any>slider[0]).noUiSlider.get());
                    if (indexToShow >= 0 && indexToShow !== playData.currentFrameIndex && indexToShow < playData.allViewModels.length) {
                        playData.currentFrameIndex = indexToShow;
                        let data = playData.allViewModels[indexToShow];
                        playData.currentViewModel = data;
                        //persistFrameIndex(playData, indexToShow); //this will cause a render call
                        playData.renderAtFrameIndexFn(indexToShow);
                    }
                });
            }
            else {
                noUiSlider.create(
                    slider[0],
                    {
                        step: 1,
                        start: [0],
                        range: {
                            min: [0],
                            max: [0],
                        },
                    });
            }

            // update the width and margin-left to center up each label
            $('.noUi-value', slider).each((idx, elem) => {
                let actualWidth = labelData.labelInfo.filter(l => l.label === $(elem).text())[0].labelWidth;
                $(elem).width(actualWidth);
                $(elem).css('margin-left', -actualWidth / 2 + 'px');
            });
        }

        function getLabelData(playData: PlayChartData): PlayLabelData {
            let textProperties: TextProperties = {
                fontFamily: 'wf_segoe-ui_normal',
                fontSize: jsCommon.PixelConverter.toString(14),
            };
            let labelInfo: PlayLabelInfo[] = [];
            let anyWordBreaks = false;
            for (let key of playData.frameKeys) {
                let labelWidth = jsCommon.WordBreaker.getMaxWordWidth(key + "", TextMeasurementService.measureSvgTextWidth, textProperties);
                anyWordBreaks = anyWordBreaks || jsCommon.WordBreaker.hasBreakers(key) || (<string>key).indexOf('-') > -1;
                labelInfo.push({ label: key, labelWidth });
            }
            return {
                labelInfo: labelInfo,
                anyWordBreaks: anyWordBreaks,
            };
        }

        function createPipsFilterFn(playData: PlayChartData, sliderWidth: number, labelData: PlayLabelData): (index: any, type: any) => number {
            let maxLabelWidth = _.max<PlayLabelInfo>(labelData.labelInfo,'labelWidth').labelWidth;

            let pipSize = 1; //0=hide, 1=large, 2=small
            let skipMod = 1;
            let maxAllowedLabelWidth = playData.frameCount > 1 ? sliderWidth / (playData.frameCount - 1) : sliderWidth;
            let widthRatio = maxLabelWidth / maxAllowedLabelWidth;

            if (widthRatio > 1.25) {
                skipMod = Math.ceil(widthRatio);
                pipSize = 2;
            }
            else if (widthRatio > 1.0 || labelData.anyWordBreaks) {
                // wordbreak line wrapping is automatic, and we don't reserve enough space to show two lines of text with the larger font
                pipSize = 2;
            }

            let filterPipLabels = (index: any, type: any) => {
                // noUiSlider will word break / wrap to new lines, so max width is the max word length
                if (index % skipMod === 0) {
                    return pipSize;
                }
                return 0; //hide
            };

            return filterPipLabels;
        }

        function adjustForLegend(playData: PlayChartData): void {
            let legend = $(".legend", playData.element);
            let sliderLeftOffset = 0, sliderBottomOffset = 0;

            if (playData.playAxisContainer) {
                // Reset
                playData.playAxisContainer.css("left", "");
                playData.playAxisContainer.css("bottom", "");
            }

            if (legend.length > 0) {
                // TODO: we should NOT be interrogating legend CSS properties for this, move the Callout to be SVGText and position inside the svg container
                const padding = 16; //callout padding
                
                // Reset to inherit css class top/right
                playData.callout.css("right", "");
                playData.callout.css("top", "");

                let floatVal = legend.css("float");
                let bottomVal = legend.css("bottom");

                if (floatVal === "right")
                    playData.callout.css("right", legend.width() + padding);
                else if (floatVal === "left")
                    sliderLeftOffset = legend.width();
                else if (floatVal === "none" || floatVal === "") {
                    if (bottomVal === "" || bottomVal === "inherit" || bottomVal === "auto") {
                        playData.callout.css("top", legend.height() + padding);
                    }
                    else {
                        sliderBottomOffset = legend.height() + 35;
                    }
                }

                if (playData.playAxisContainer) {
                    if (sliderLeftOffset)
                        playData.playAxisContainer.css("left", sliderLeftOffset);
                    if (sliderBottomOffset)
                        playData.playAxisContainer.css("bottom", sliderBottomOffset);
                }
            }
        }

        export function render(playData: PlayChartData, behaviorOptions: PlayBehaviorOptions, interactivityService: IInteractivityService, suppressAnimations: boolean): CartesianVisualRenderResult {
            if (!playData) {
                return { dataPoints: [], behaviorOptions: null, labelDataPoints: null, labelsAreNumeric: false };
            }

            let hasSelection = false;
            if (interactivityService) {
                interactivityService.applySelectionStateToData(playData.currentViewModel.dataPoints);
                hasSelection = interactivityService.hasSelection();
            }

            let frameKeys = playData.frameKeys;
            let currentFrameIndex = playData.currentFrameIndex;
            let height = playData.currentViewport.height;
            let width = playData.currentViewport.width;
            
            if (!playData.playAxisContainer && interactivityService) {
                createSliderDOM(playData, behaviorOptions, interactivityService);
            }
            if (playData.playAxisContainer) {
                // always update the event handler with the latest state (capture the three params)
                playData.playButtonCircle.off('click');
                playData.playButtonCircle.on('click', () => {
                    PlayChart.play(playData, behaviorOptions, interactivityService);
                });
            }

            // callout / currentFrameIndex label - keep separate from other Play DOM creation as we need this even without interactivity.
            if (!playData.callout) {
                playData.callout = $('<span class="callout"></span>').appendTo(playData.element);
            }

            // update callout position due to legend
            adjustForLegend(playData);

            // dynamic left/right margin for the slider bar
            let labelData = getLabelData(playData);
            let labelWidthLen = labelData.labelInfo.length;
            let sliderLeftMargin = SliderMarginLeft, sliderRightMargin = SliderMarginRight;
            if (labelWidthLen > 0) {
                sliderLeftMargin = Math.max(labelData.labelInfo[0].labelWidth / 2, sliderLeftMargin);
                sliderRightMargin = Math.max(labelData.labelInfo[labelWidthLen - 1].labelWidth / 2, sliderRightMargin);
                // stop the margins at some reasonable point
                sliderLeftMargin = Math.min(SliderMaxMargin, sliderLeftMargin);
                sliderRightMargin = Math.min(SliderMaxMargin, sliderRightMargin);
            }

            let slider = playData.slider;
            let sliderWidth = (width - sliderLeftMargin - sliderRightMargin);
            if (sliderWidth < 1) sliderWidth = 1;
            if (slider)
                slider.css('width', sliderWidth + 'px');

            // TODO: make this smarter
            let resized = playData.currentViewport.width !== playData.lastRenderedViewport.width
                || playData.currentViewport.height !== playData.lastRenderedViewport.height;
            let changed = !playData.playAxisContainer
                || frameKeys.length !== playData.frameCount
                || resized;

            // default to last frame if frameKeys have changed and it's not the first time we are rendering
            if (playData.frameCount && (frameKeys.length !== playData.frameCount || currentFrameIndex >= frameKeys.length))
                currentFrameIndex = frameKeys.length - 1;

            if (changed && slider) {
                playData.frameCount = frameKeys.length;
                createSliderControl(playData, slider, sliderWidth, labelData);
            }

            // update callout to current frame index
            let calloutDimension = Math.min(height, width * 1.3); //1.3 to compensate for tall, narrow-width viewport
            let fontSize = Math.max(12, Math.round(calloutDimension / 7));
            fontSize = Math.min(fontSize, 70);
            if (currentFrameIndex < frameKeys.length && currentFrameIndex >= 0) {
                // clear these for auto-measurement
                playData.callout.width('auto');
                playData.callout.height('auto');

                playData.callout
                    .text(frameKeys[currentFrameIndex])
                    .css('font-size', fontSize + 'px');

                let compStyle = getComputedStyle(playData.callout[0]);
                let actualWidth = Math.ceil(parseFloat(compStyle.width));
                let actualHeight = Math.ceil(parseFloat(compStyle.height));
                playData.callout.width(Math.min(actualWidth, sliderWidth));
                playData.callout.height(actualHeight);
            }
            else {
                playData.callout.text('');
            }
                
            if (slider) {
                // ensure slider position
                (<any>slider[0]).noUiSlider.set([currentFrameIndex]);
            }

            playData.lastRenderedViewport = {
                height: playData.currentViewport.height,
                width: playData.currentViewport.width
            };

            let allDataPoints = playData.allViewModels.map((vm) => vm.dataPoints);
            let flatAllDataPoints = _.flatten<SelectableDataPoint>(allDataPoints);
            if (interactivityService) {
                if (hasSelection && behaviorOptions) {
                    let uniqueDataPoints = _.uniq(flatAllDataPoints, (d: SelectableDataPoint) => d.identity.getKey());
                    behaviorOptions.renderTraceLine(behaviorOptions, _.filter(uniqueDataPoints, 'selected'), !suppressAnimations);
                }
            }
            
            // pass all data points to keep track of current selected bubble even if it drops out for a few frames
            return { dataPoints: flatAllDataPoints, behaviorOptions: behaviorOptions, labelDataPoints: null, labelsAreNumeric: false };
        }

        // Scatter specific traceline
        export function renderScatterTraceLine(options: PlayBehaviorOptions, selectedPoints: SelectableDataPoint[], shouldAnimate: boolean): void {
            let seriesPoints: ScatterChartDataPoint[][] = [];

            if (selectedPoints && selectedPoints.length > 0) {
                let currentFrameIndex = options.data.currentFrameIndex;
                let lastRenderedTraceFrameIndex = options.data.lastRenderedTraceFrameIndex;

                // filter to the selected identity, only up to and including the current frame. Add frames during play.
                let hasBubbleAtCurrentFrame = [];
                for (var selectedIndex = 0, selectedLen = selectedPoints.length; selectedIndex < selectedLen; selectedIndex++) {
                    seriesPoints[selectedIndex] = [];
                    hasBubbleAtCurrentFrame[selectedIndex] = false;
                    for (let frameIndex = 0, frameLen = options.data.allViewModels.length; frameIndex < frameLen && frameIndex <= currentFrameIndex; frameIndex++) {
                        let values = options.data.allViewModels[frameIndex].dataPoints.filter((value, index) => {
                            return value.identity.getKey() === selectedPoints[selectedIndex].identity.getKey();
                        });
                        if (values && values.length > 0) {
                            let value = values[0];
                            value['frameIndex'] = frameIndex;
                            seriesPoints[selectedIndex].push(value);
                            if (frameIndex === currentFrameIndex)
                                hasBubbleAtCurrentFrame[selectedIndex] = true;
                        }
                    }
                }
                if (seriesPoints.length > 0) {
                    let xScale = options.xScale;
                    let yScale = options.yScale;

                    let line = d3.svg.line()
                        .x((d: ScatterChartDataPoint) => {
                            return xScale(d.x);
                        })
                        .y((d: ScatterChartDataPoint) => {
                            return yScale(d.y);
                        })
                        .defined((d: ScatterChartDataPoint) => {
                            return d.x !== null && d.y !== null;
                        });

                    // Render Lines
                    let traceLines = options.svg.selectAll('.traceLine').data(selectedPoints, (sp: ScatterChartDataPoint) => sp.identity.getKey());
                    traceLines.enter()
                        .append('path')
                        .classed('traceLine', true);
                    // prepare array of new/previous lengths
                    // NOTE: can't use lambda because we need the "this" context to be the DOM Element associated with the .each()
                    let previousLengths = [], newLengths = [];
                    traceLines.each(function (d, i) {
                        let existingPath = (<SVGPathElement>this);
                        let previousLength = existingPath.hasAttribute('d') ? existingPath.getTotalLength() : 0;
                        previousLengths.push(previousLength);
                        // create offline SVG for new path measurement
                        let tempSvgPath = $('<svg><path></path></svg>');
                        let tempPath = $('path', tempSvgPath);
                        tempPath.attr('d', line(seriesPoints[i]));
                        let newLength = seriesPoints[i].length > 0 ? (<SVGPathElement>tempPath.get()[0]).getTotalLength() : 0;
                        newLengths.push(newLength);
                    });
                    // animate using stroke-dash* trick
                    if (lastRenderedTraceFrameIndex == null || currentFrameIndex >= lastRenderedTraceFrameIndex) {
                        // growing line
                        traceLines
                            .style('stroke', (d: ScatterChartDataPoint) => ScatterChart.getStrokeFill(d, true))
                            .attr({
                                'd': (d, i: number) => {
                                    return line(seriesPoints[i]);
                                },
                                'stroke-dasharray': (d, i) => newLengths[i] + " " + newLengths[i],
                                'stroke-dashoffset': (d, i) => newLengths[i] - previousLengths[i],
                            });
                        if (shouldAnimate) {
                            traceLines
                                .transition()
                                .ease('linear')
                                .duration(FrameAnimationDuration)
                                .attr('stroke-dashoffset', 0);
                        }
                        else {
                            traceLines.attr('stroke-dashoffset', 0);
                        }
                    }
                    else {
                        // shrinking line
                        if (shouldAnimate) {
                            traceLines
                                .transition()
                                .ease('linear')
                                .duration(FrameAnimationDuration)
                                .attr('stroke-dashoffset', (d, i) => previousLengths[i] - newLengths[i])
                                .transition()
                                .ease('linear')
                                .duration(1) // animate the shrink first, then update with new line properties
                                .delay(FrameAnimationDuration)
                                .style('stroke', (d: ScatterChartDataPoint) => ScatterChart.getStrokeFill(d, true))
                                .attr({
                                    'd': (d, i) => {
                                        return line(seriesPoints[i]);
                                    },
                                    'stroke-dasharray': (d, i) => newLengths[i] + " " + newLengths[i],
                                    'stroke-dashoffset': 0,
                                });
                        }
                        else {
                            traceLines
                                .style('stroke', (d: ScatterChartDataPoint) => ScatterChart.getStrokeFill(d, true))
                                .attr({
                                    'd': (d, i) => {
                                        return line(seriesPoints[i]);
                                    },
                                    'stroke-dasharray': (d, i) => newLengths[i] + " " + newLengths[i],
                                    'stroke-dashoffset': 0,
                                });
                        }
                    }
                    traceLines.exit()
                        .remove();

                    // Render circles
                    // slice to length-1 because we draw lines to the current bubble but we don't need to draw the current frame's bubble
                    let circlePoints: ScatterChartDataPoint[] = [];
                    for (let selectedIndex = 0; selectedIndex < seriesPoints.length; selectedIndex++) {
                        let points = seriesPoints[selectedIndex];
                        let newPoints = hasBubbleAtCurrentFrame[selectedIndex] ? points.slice(0, points.length - 1) : points;
                        circlePoints = circlePoints.concat(newPoints);
                    }
                    let circles = options.svg.selectAll('.traceBubble').data(circlePoints, (d: ScatterChartDataPoint) => d.identity.getKey() + d.x + d.y + d.size);
                    circles.enter()
                        .append('circle')
                        .style('opacity', 0) //fade new bubbles into visibility
                        .classed('traceBubble', true);
                    circles
                        .attr('cx', (d: ScatterChartDataPoint) => xScale(d.x))
                        .attr('cy', (d: ScatterChartDataPoint) => yScale(d.y))
                        .attr('r', (d: ScatterChartDataPoint) => ScatterChart.getBubbleRadius(d.radius, (<ScatterChartData>options.data.currentViewModel).sizeRange, options.data.currentViewport))
                        .style({
                            'stroke-opacity': (d: ScatterChartDataPoint) => ScatterChart.getBubbleOpacity(d, true),
                            'stroke-width': '1px',
                            'stroke': (d: ScatterChartDataPoint) => ScatterChart.getStrokeFill(d, options.colorBorder),
                            'fill': (d: ScatterChartDataPoint) => d.fill,
                            // vary the opacity along the traceline from 0.20 to 0.80, with 0.85 left for the circle already drawn by scatterChart
                            'fill-opacity': (d: ScatterChartDataPoint) => d.size != null ? 0.20 + (d['frameIndex'] / currentFrameIndex) * 0.60 : 0,
                        })
                        .transition()
                        .ease('linear')
                        .duration(FrameAnimationDuration)
                        .style('opacity',1);
                    circles.exit()
                        .transition()
                        .ease('linear')
                        .duration(FrameAnimationDuration)
                        .style('opacity', 0) //fade exiting bubbles out
                        .remove();

                    TooltipManager.addTooltip(circles, (tooltipEvent: TooltipEvent) => tooltipEvent.data.tooltipInfo);

                    // sort the z-order, smallest size on top
                    circles.sort((d1: ScatterChartDataPoint, d2: ScatterChartDataPoint) => { return d2.size - d1.size; });

                    options.data.lastRenderedTraceFrameIndex = options.data.currentFrameIndex;
                }
                else {
                    options.svg.selectAll('.traceLine').remove();
                    options.svg.selectAll('.traceBubble').remove();
                    options.data.lastRenderedTraceFrameIndex = null;
                }
            }
            else {
                options.svg.selectAll('.traceLine').remove();
                options.svg.selectAll('.traceBubble').remove();
                options.data.lastRenderedTraceFrameIndex = null;
            }
        }

        export function play(playData: PlayChartData, behaviorOptions: PlayBehaviorOptions, interactivityService: IInteractivityService): void {
            if (playData.isPlaying) {
                // Toggle the flag and allow the animation logic to kill it
                playData.isPlaying = false;
            }
            else if ((<any>playData.slider[0]).noUiSlider != null) {
                playData.isPlaying = true;
                playData.playButton.removeClass('play').addClass('pause');

                let indexToShow = Math.round((<any>playData.slider[0]).noUiSlider.get());
                if (indexToShow >= playData.allViewModels.length - 1) {
                    playData.currentFrameIndex = -1;
                } else {
                    playData.currentFrameIndex = indexToShow - 1;
                }

                playNextFrame(playData, behaviorOptions, interactivityService);
            }
        }

        /*function persistFrameIndex(playData: PlayChartData, frameIndex: number): void {
            playData.ridiculousFlagForPersistProperties = true;

            playData.host.persistProperties([{
                selector: null,
                properties: {
                    index: frameIndex
                },
                objectName: 'currentFrameIndex'
            }]);
        }*/

        function playNextFrame(playData: PlayChartData, behaviorOptions: PlayBehaviorOptions, interactivityService: IInteractivityService, startFrame?: number, endFrame?: number): void {
            if (!playData.isPlaying) {
                playComplete(playData, behaviorOptions, interactivityService);
                return;
            }

            let nextFrame = playData.currentFrameIndex + 1;
            if (startFrame != null && endFrame != null) {
                nextFrame = Math.abs(endFrame - startFrame + 1);
                startFrame = nextFrame;
            }

            if (nextFrame < playData.allViewModels.length && nextFrame > -1) {
                playData.currentFrameIndex = nextFrame;
                playData.currentViewModel = playData.allViewModels[nextFrame];
                //persistFrameIndex(playData, nextFrame); //this will cause a render call
                playData.renderAtFrameIndexFn(nextFrame);
                (<any>playData.slider[0]).noUiSlider.set([nextFrame]);

                if (nextFrame < playData.allViewModels.length) {
                    let timePerFrame = FrameStepDuration;
                    window.setTimeout(() => {
                        // Update the rangeSlider to show the correct offset
                        (<any>playData.slider[0]).noUiSlider.set([nextFrame]);
                        // Play next frame
                        playNextFrame(playData, behaviorOptions, interactivityService, startFrame, endFrame);
                    }, timePerFrame);
                }
            } else {
                playComplete(playData, behaviorOptions, interactivityService);
            }
        }

        function playComplete(playData: PlayChartData, behaviorOptions: PlayBehaviorOptions, interactivityService: IInteractivityService): void {
            playData.playButton.removeClass('pause').addClass('play');
            playData.isPlaying = false;
        }
    }
}
