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
    import createDataViewScopeIdentity = powerbi.data.createDataViewScopeIdentity;
    import DataViewConcatenateCategoricalColumns = powerbi.data.DataViewConcatenateCategoricalColumns;
    import DataViewMatrixUtils = powerbi.data.DataViewMatrixUtils;
    import SQExpr = powerbi.data.SQExpr;
    import SQExprBuilder = powerbi.data.SQExprBuilder;

    export interface PlayConstructorOptions extends CartesianVisualConstructorOptions {
    }

    export interface PlayInitOptions extends CartesianVisualInitOptions {
    }
    
    export interface PlayChartDataPoint {
        frameIndex?: number;
    };

    export interface PlayChartData<T extends PlayableChartData> {
        frameData: PlayChartFrameData[];
        allViewModels: T[];
        currentViewModel: T;
        currentFrameIndex: number;
        labelData: PlayAxisTickLabelData;
    }
    
    export interface PlayChartFrameData {
        escapedText: string;
        text: string;
    } 

    export interface PlayChartViewModel<TData extends PlayableChartData, TViewModel> {
        data: PlayChartData<TData>;
        viewModel: TViewModel;
        viewport: IViewport;
    }

    // TODO: consider a template for the datapoint type <T> instead of any[]
    // I tried this an it is quite hard to express correctly with TypeScript.
    export interface PlayableChartData {
        dataPoints: any[];
    }

    interface PlayObjectProperties {
        currentFrameIndex?: number;
    }

    export interface PlayAxisTickLabelInfo {
        label: string;
        labelWidth: number;
    }

    export interface PlayAxisTickLabelData {
        labelInfo: PlayAxisTickLabelInfo[];
        anyWordBreaks: boolean;
        labelFieldName?: string;
    }

    export interface PlayChartRenderResult<TData extends PlayableChartData, TViewModel> {
        allDataPoints: SelectableDataPoint[];
        viewModel: PlayChartViewModel<TData, TViewModel>;
    }

    export interface PlayChartRenderFrameDelegate<T> {
        (data: T): void;
    }

    export interface PlayFrameInfo {
        label: string;
        column: DataViewMetadataColumn;
    }

    export interface VisualDataConverterDelegate<T> {
        (dataView: DataView, playFrameInfo?: PlayFrameInfo): T;
    }

    export interface ITraceLineRenderer {
        render(selectedPoints: SelectableDataPoint[], shouldAnimate: boolean): void;
        remove(): void;
    }
    
    interface SliderSize {
        width: number;
        marginLeft: number;       
    };
    
    interface SliderPipFilter {
        skipStep: number;
        filter: (index: any, type: any) => number;
    }

    export class PlayAxis<T extends PlayableChartData> {
        private element: JQuery;
        private svg: D3.Selection;

        private playData: PlayChartData<T>;
        private renderDelegate: PlayChartRenderFrameDelegate<T>;
        private isPlaying: boolean;
        private lastViewport: IViewport;

        // do not call converter() when we call persistProperties and a new update() happens
        // NOTE: calling persistProperties will still cause a render() call to come from cartesianChart
        // TODO: make persist properties only optionally trigger a new onDataChagned, as most charts don't want this (only slicer needs it)
        private ridiculousFlagForPersistProperties: boolean;

        private playControl: PlayControl;

        private host: IVisualHostServices;
        private interactivityService: IInteractivityService;
        private isMobileChart: boolean;

        private static PlayCallout = createClassAndSelector('play-callout');
        private static calloutOffsetMultiplier = 0.3;

        constructor(options: PlayConstructorOptions) {
            if (options) {
                this.interactivityService = options.interactivityService;
            }
        }

        public init(options: PlayInitOptions) {
            debug.assertValue(options, 'options');

            this.element = options.element;
            this.svg = options.svg;
            this.host = options.host;

            this.isMobileChart = options.interactivity && options.interactivity.isInteractiveLegend;

            if (this.interactivityService) {
                this.playControl = new PlayControl(this.element, (frameIndex: number) => this.moveToFrameAndRender(frameIndex), this.isMobileChart);
                this.playControl.onPlay(() => this.play());
            }
        }

        public setData(dataView: DataView, visualConverter: VisualDataConverterDelegate<T>): PlayChartData<T> {
            if (dataView) {
                if (this.ridiculousFlagForPersistProperties && dataView.metadata) {
                    // BUG FIX: customer feedback has been strong that we should always default to show the last frame.
                    // This is essential for dashboard tiles to refresh properly.

                    //  Only copy frameIndex since it is the only property using persistProperties
                    //let objectProps = getObjectProperties(dataView.metadata);
                    //playData.currentFrameIndex = objectProps.currentFrameIndex;
                    
                    //  Turn off the flag that was set by our persistProperties call
                    this.ridiculousFlagForPersistProperties = false;
                    return this.playData;
                }
                else if (dataView.matrix || dataView.categorical) {
                    this.playData = PlayChart.converter<T>(dataView, visualConverter);
                }
                else {
                    this.playData = PlayChart.getDefaultPlayData<T>();
                }
            }
            else {
                this.playData = PlayChart.getDefaultPlayData<T>();
            }

            // Next render should be a full one.
            this.lastViewport = undefined;

            return this.playData;
        }

        public render<TViewModel>(suppressAnimations: boolean, viewModel: TViewModel, viewport: IViewport, margin: IMargin): PlayChartRenderResult<T, TViewModel> {
            let playData = this.playData;

            let resized = !this.lastViewport || (this.lastViewport.height !== viewport.height || this.lastViewport.width !== viewport.width);
            this.lastViewport = viewport;

            if (resized)
                this.stop();

            if (!playData)
                return;

            let playViewModel: PlayChartViewModel<T, TViewModel> = {
                data: this.playData,
                viewModel: viewModel,
                viewport: viewport,
            };

            let hasSelection = false;
            if (this.interactivityService) {
                let data = <PlayableChartData>playData.currentViewModel;
                this.interactivityService.applySelectionStateToData(data.dataPoints);
                hasSelection = this.interactivityService.hasSelection();
            }

            this.updateCallout(viewport, margin);

            if (this.playControl && resized) {
                this.playControl.rebuild(playData, viewport);
            }

            let allDataPoints = playData.allViewModels.map((vm) => vm.dataPoints);
            let flatAllDataPoints = _.flatten<SelectableDataPoint>(allDataPoints);
            
            // NOTE: Return data points to keep track of current selected bubble even if it drops out for a few frames
            return {
                allDataPoints: flatAllDataPoints,
                viewModel: playViewModel,
            };
        }

        private updateCallout(viewport: IViewport, margin: IMargin): void {
            let playData = this.playData;
            let frameData = playData.frameData;
            let currentFrameIndex = playData.currentFrameIndex;
            let height = viewport.height;
            let plotAreaHeight = height - margin.top - margin.bottom;
            let width = viewport.width;
            let plotAreaWidth = width - margin.left - margin.right;

            let calloutDimension = Math.min(height, width * 1.3); //1.3 to compensate for tall, narrow-width viewport
            let fontSize = Math.max(12, Math.round(calloutDimension / 7));
            fontSize = Math.min(fontSize, 70);
            let textProperties = {
                fontSize: jsCommon.PixelConverter.toString(fontSize),
                text: frameData[currentFrameIndex].text || "",
                fontFamily: Font.Family.regular.css,
            };
            let textHeight = TextMeasurementService.estimateSvgTextHeight(textProperties) - TextMeasurementService.estimateSvgTextBaselineDelta(textProperties);

            let calloutData: string[] = [];
            if (currentFrameIndex < frameData.length && currentFrameIndex >= 0 && textHeight < plotAreaHeight) {
                let maxTextWidth = plotAreaWidth - (2 * PlayAxis.calloutOffsetMultiplier * textHeight);
                let calloutText = TextMeasurementService.getTailoredTextOrDefault(textProperties, maxTextWidth);
                calloutData = [calloutText];
            }

            let callout = this.svg.selectAll(PlayAxis.PlayCallout.selector).data(calloutData);

            callout.enter()
                .append('text')
                .classed(PlayAxis.PlayCallout.class, true);

            callout
                .text((d: string) => d)
                .attr({
                    x: plotAreaWidth - PlayAxis.calloutOffsetMultiplier * textHeight,
                    y: () => textHeight,
                })
                .style({
                    'font-size': fontSize + 'px',
                    'text-anchor': 'end',
                });

            callout.exit().remove();
        }

        public play(): void {
            let playData = this.playData;

            if (this.isPlaying) {
                this.stop();
            }
            else if (this.playControl) {
                this.isPlaying = true;
                this.playControl.play();

                let indexToShow = Math.round(this.playControl.getCurrentIndex());
                if (indexToShow >= playData.allViewModels.length - 1) {
                    playData.currentFrameIndex = -1;
                } else {
                    playData.currentFrameIndex = indexToShow - 1;
                }

                this.playNextFrame(playData);
            }
        }

        private playNextFrame(playData: PlayChartData<T>, startFrame?: number, endFrame?: number): void {
            if (!this.isPlaying) {
                this.stop();
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

                this.renderDelegate(playData.currentViewModel);
                this.playControl.setFrame(nextFrame);

                if (nextFrame < playData.allViewModels.length) {
                    window.setTimeout(() => {
                        this.playNextFrame(playData, startFrame, endFrame);
                    }, PlayChart.FrameStepDuration);
                }
            } else {
                this.stop();
            }
        }

        public stop(): void {
            if (this.playControl)
                this.playControl.pause();
            this.isPlaying = false;
        }

        public remove(): void {
            if (this.playControl)
                this.playControl.remove();
            d3.selectAll(PlayAxis.PlayCallout.selector).remove();

            // TODO: remove any tracelines
        }

        public setRenderFunction(fn: PlayChartRenderFrameDelegate<T>): void {
            this.renderDelegate = fn;
        }

        public getCartesianExtents(existingExtents: CartesianExtents, getExtents: (T) => CartesianExtents): CartesianExtents {
            if (this.playData && this.playData.allViewModels && this.playData.allViewModels.length > 0) {
                return PlayChart.getMinMaxForAllFrames(this.playData, getExtents);
            }

            return existingExtents;
        }

        public setPlayControlPosition(playControlLayout: IRect): void {
            if (this.playControl) {
                let container = this.playControl.getContainer();
                container.css('left', playControlLayout.left ? playControlLayout.left + 'px' : '');
                container.css('top', playControlLayout.top ? playControlLayout.top + 'px' : '');
                // width is set elsewhere (calculateSliderWidth), where we check for playaxis tick label overflow.
                // height is constant
            }
        }

        private moveToFrameAndRender(frameIndex: number): void {
            let playData = this.playData;

            this.isPlaying = true;

            if (playData && frameIndex >= 0 && frameIndex < playData.allViewModels.length && frameIndex !== playData.currentFrameIndex) {
                playData.currentFrameIndex = frameIndex;
                let data = playData.allViewModels[frameIndex];
                playData.currentViewModel = data;
                this.renderDelegate(data);
            }

            this.isPlaying = false;
        }

        public isCurrentlyPlaying(): boolean {
            return this.isPlaying;
        }
    }

    class PlayControl {
        private playAxisContainer: JQuery;
        private playButton: JQuery;
        private playButtonCircle: JQuery;
        private slider: JQuery;
        private noUiSlider: noUiSlider.noUiSlider;
        private renderDelegate: (index: number) => void;
        private isMobileChart: boolean;

        private static SliderMarginLeft = 24 + 10 * 2; // playButton width + playButton margin * 2
        private static SliderMarginRight = 20;
        private static SliderMaxMargin = 100;
        private static PlayControlHeight = 80; //tuned for two rows of label text to be perfectly clipped before the third row. Dependent on current font sizes in noui-pips.css
        
        constructor(element: JQuery, renderDelegate: (index: number) => void, isMobileChart: boolean) {
            this.isMobileChart = isMobileChart;
            this.createSliderDOM(element);
            this.renderDelegate = renderDelegate;
        }

        public getContainer(): JQuery {
            return this.playAxisContainer;
        }

        public remove(): void {
            if (this.playAxisContainer)
                this.playAxisContainer.remove();
        }

        public pause(): void {
            this.playButton.removeClass('pause').addClass('play');
        }

        public play(): void {
            this.playButton.removeClass('play').addClass('pause');
        }

        public getCurrentIndex(): number {
            // TODO: round() necessary?
            return Math.round(<number>this.noUiSlider.get());
        }

        public onPlay(handler: (eventObject: JQueryEventObject) => void): void {
            this.playButtonCircle.off('click');
            this.playButtonCircle.on('click', handler);
        }

        public setFrame(frameIndex: number): void {
            this.noUiSlider.set([frameIndex]);
        };

        public rebuild<T extends PlayableChartData>(playData: PlayChartData<T>, viewport: IViewport): void {
            let slider = this.slider;

            // re-create the slider
            if (this.noUiSlider)
                this.noUiSlider.destroy();

            let labelData = playData.labelData;
            let sliderSize: SliderSize = PlayControl.calucalateSliderSize(labelData, viewport.width);
            var container = this.getContainer();
            if(sliderSize.marginLeft > PlayControl.SliderMarginLeft) {
                container.css("padding-left", sliderSize.marginLeft - PlayControl.SliderMarginLeft + "px");
                container.css("box-sizing", "border-box");    
            }
            let skipStep: number = this.updateSliderControl(playData, sliderSize.width);
            let width: number = PlayControl.adjustWidthRegardingLastItem(labelData, skipStep, sliderSize.width);
            this.slider.css('width', width + 'px');

            this.noUiSlider.on('slide', () => {
                let indexToShow = this.getCurrentIndex();
                this.renderDelegate(indexToShow);
            });
             
             let nextLabelIndex = 0;
             // update the width and margin-left to center up each label
            $('.noUi-value', slider).each((idx, elem) => {
                let actualWidth = labelData.labelInfo[nextLabelIndex].labelWidth;
                $(elem).width(actualWidth);
                $(elem).css('margin-left', -actualWidth / 2 + 'px');
                nextLabelIndex += skipStep;
            });
        }

        /**
         * Updates slider control regarding new data.
         * @param playData {PlayChartData<T>} Data for the slider.
         * @param sliderWidth {number} Slider width. 
         * @returns {number} skip mode for the slider.
         */
        private updateSliderControl<T extends PlayableChartData>(playData: PlayChartData<T>, sliderWidth: number): number {
            let labelData = playData.labelData;
            let sliderElement: HTMLElement = this.slider.get(0);
            let numFrames = playData.frameData.length;
            let options: noUiSlider.Options = {
                start: numFrames === 0 ? 0 : playData.currentFrameIndex,
                step: 1,
                range: {
                    min: 0,
                    max: numFrames === 0 ? 0 : numFrames - 1
                }
            };
            let pipOptions: noUiSlider.PipsOptions = null;
            let skipMode: number = 0;
            
            if (numFrames > 0) {
                let filterPipLabels = PlayControl.createPipsFilterFn(playData, sliderWidth, labelData);
                skipMode = filterPipLabels.skipStep;
                pipOptions = {
                    mode: 'steps',
                    density: Math.ceil(100 / numFrames), //only draw ticks where we have labels
                    format: {
                        to: (index) => playData.frameData[index].escapedText,
                        from: (value) => playData.frameData.indexOf(value),
                    },
                    filter: filterPipLabels.filter,
                };
            }
            options.pips = pipOptions;
            noUiSlider.create(sliderElement, options);
            this.noUiSlider = (<noUiSlider.Instance>sliderElement).noUiSlider;

            return skipMode;
        }
        
        private static createPipsFilterFn<T extends PlayableChartData>(playData: PlayChartData<T>, sliderWidth: number, labelData: PlayAxisTickLabelData):  SliderPipFilter  {
            let maxLabelWidth = _.max(_.map(labelData.labelInfo, (l) => l.labelWidth));

            let pipSize = 1; //0=hide, 1=large, 2=small
            let skipMode = 1;
            let maxAllowedLabelWidth = playData.frameData.length > 1 ? sliderWidth / (playData.frameData.length - 1) : sliderWidth;
            let widthRatio = maxLabelWidth / maxAllowedLabelWidth;

            if (widthRatio > 1.25) {
                skipMode = Math.ceil(widthRatio);
                pipSize = 2;
            }
            else if (widthRatio > 1.0 || labelData.anyWordBreaks) {
                // wordbreak line wrapping is automatic, and we don't reserve enough space to show two lines of text with the larger font
                pipSize = 2;
            }

            let filterPipLabels = (index: any, type: any) => {
                // noUiSlider will word break / wrap to new lines, so max width is the max word length
                if (index % skipMode === 0) {
                    return pipSize;
                }
                return 0; //hide
            };
            

            return { filter: filterPipLabels, skipStep: skipMode };
        }

        /**
         * Adjusts width regarding the last visible label size.
         * @param labelData label data for chart.
         * @param skipMode skip factor.
         * @param sliderWidth current width of slider.
         */
        private static adjustWidthRegardingLastItem(labelData: PlayAxisTickLabelData, skipMode: number, sliderWidth): number {
            let labelLenth: number = labelData.labelInfo.length;
            let lastVisibleItemIndex: number = Math.floor((labelLenth - 1) / skipMode) * skipMode;
            let distanceToEnd = sliderWidth + PlayControl.SliderMarginRight - (sliderWidth / labelLenth * (lastVisibleItemIndex + 1));
            let lastItemWidth = labelData.labelInfo[lastVisibleItemIndex].labelWidth;
            let requiredWidth = lastItemWidth / 2 - distanceToEnd;
            if (requiredWidth > 0) {
                let maxMargin = PlayControl.SliderMaxMargin - PlayControl.SliderMarginRight;
                requiredWidth = requiredWidth > maxMargin ? maxMargin : requiredWidth;
                return sliderWidth - requiredWidth;
            }

            return sliderWidth;
        }

        private createSliderDOM(element: JQuery): void {
            this.playAxisContainer = $('<div class="play-axis-container"></div>')
                .appendTo(element)
                .css('height', PlayControl.PlayControlHeight + 'px');

            this.playButtonCircle = $('<div class="button-container"></div>')
                .appendTo(this.playAxisContainer);

            if (this.isMobileChart) {
                this.playButtonCircle.addClass('mobile-button-container');
            }

            this.playButton = $('<div class="play"></div>')
                .appendTo(this.playButtonCircle);

            this.slider = $('<div class="sliders"></div>')
                .appendTo(this.playAxisContainer);
        }

        private static calucalateSliderSize(labelData: PlayAxisTickLabelData, viewportWidth: number): SliderSize {
            let leftMargin = 0;
            if (!_.isEmpty(labelData.labelInfo)) {
                leftMargin = _.first(labelData.labelInfo).labelWidth / 2;
            }

            let sliderLeftMargin = Math.max(leftMargin, PlayControl.SliderMarginLeft);
            sliderLeftMargin = Math.min(PlayControl.SliderMaxMargin, sliderLeftMargin);
            let sliderWidth = Math.max((viewportWidth - sliderLeftMargin - PlayControl.SliderMarginRight), 1);

            return { width: sliderWidth, marginLeft: sliderLeftMargin };
        }
    }

    export module PlayChart {
        // TODO: add speed control to property pane
        // NOTE: current noUiSlider speed is a CSS property of the class .noUi-state-tap, and also is hard-coded in noUiSlider.js. We'll need to add a new create param for transition time.
        // 800ms matches Silverlight frame speed
        export const FrameStepDuration = 800;
        export const FrameAnimationDuration = 750; //leave 50ms for the traceline animation - to avoid being cancelled. TODO: add a proper wait impl.

        export const ClassName = 'playChart';

        export function convertMatrixToCategorical(sourceDataView: DataView, frame: number): DataView {
            debug.assert(sourceDataView && sourceDataView.metadata && !!sourceDataView.matrix, 'sourceDataView && sourceDataView.metadata && !!sourceDataView.matrix');

            let matrix: DataViewMatrix = sourceDataView.matrix;

            let categorical: DataViewCategorical = {
                categories: [],
                values: powerbi.data.DataViewTransform.createValueColumns()
            };

            // If we don't have enough fields, just return early. We need at least:
            // 2 rows and 1 column:  (play->category, measures)
            // or:
            // 1 row and 2 columns:  (play, series->measures)
            if ((_.isEmpty(matrix.columns.levels)) || (matrix.rows.levels.length < 2 && matrix.columns.levels.length < 2)) {
                return { metadata: sourceDataView.metadata, categorical: categorical };
            }

            const CategoryRowLevelsStartingIndex = 1;

            let categories: DataViewCategoryColumn[] = [];
            // Ignore the play field (first row level); the Category field(s) starts from the second row group (play->category) or we don't use this variable (categories)
            // Note related to VSTS 6986788 and 6885783: there are multiple levels for category during drilldown and expand.
            for (let i = CategoryRowLevelsStartingIndex, ilen = matrix.rows.levels.length; i < ilen; i++) {
                // Consider: Change the following debug.assert() to retail.assert() when the infrastructure is ready.
                debug.assert(matrix.rows.levels[i].sources.length > 0, 'The sources is always expected to contain at least one metadata column.');

                let sourceColumn: DataViewMetadataColumn = matrix.rows.levels[i].sources[0];
                categories.push({
                    source: sourceColumn,
                    values: [],
                    identity: [],
                    objects: undefined,
                });
            }

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
            // Or, with drilldown / expand on Category (e.g. expand Country -> Region):
            //                             Series1 | Series2 | ...
            //                           --------- --------  
            // Play1 | Country1 | Region1 | values  | values
            //       |          | Region2 | values  | values
            //       | Country2 | Region3 | values  | values
            //       |          | Region4 | values  | values
            //       | ...
            // Play2 | Country1 | Region1 | values  | values
            //       |          | Region2 | values  | values
            //       | Country2 | Region3 | values  | values
            //       |          | Region4 | values  | values

            // we are guaranteed at least one row (it will be the Play field)
            let hasRowChildren = !_.isEmpty(matrix.rows.root.children);
            let hasColChildren = !_.isEmpty(matrix.columns.root.children);
            let hasSeries = matrix.columns.levels.length > 1 && hasColChildren;
            let hasPlayAndCategory = matrix.rows.levels.length > 1 && hasRowChildren;

            if (hasSeries && !hasPlayAndCategory) {
                // set categories to undefined
                categorical.categories = undefined;

                let node = matrix.columns.root;
                categorical.values.source = matrix.columns.levels[0].sources[0];
                let columnLength = matrix.valueSources.length;
                for (let i = 0, len = node.children.length; i < len; i++) {
                    // add all the value sources for each series
                    let columnNode = node.children[i];
                    for (let j = 0; j < columnLength; j++) {
                        // DEFECT 6547170: groupName must be null to turn into (Blank), undefined will use the field name
                        let source = <any>_.create(matrix.valueSources[j], { groupName: columnNode.value === undefined ? null : columnNode.value });
                        let dataViewColumn: DataViewValueColumn = {
                            identity: columnNode.identity,
                            values: [],
                            source: source
                        };
                        categorical.values.push(dataViewColumn);
                    }
                }

                // Copying the values from matrix intersection to the categorical values columns...
                // Given that this is the case without category levels, the matrix intersection values are stored in playFrameNode.values
                let playFrameNode = matrix.rows.root.children[frame];
                let matrixIntersectionValues = playFrameNode.values;
                for (var i = 0, len = node.children.length; i < len; i++) {
                    for (let j = 0; j < columnLength; j++) {
                        categorical.values[i * columnLength + j].values.push(matrixIntersectionValues[i * columnLength + j].value);
                    }
                }
            }
            else if (hasSeries && hasRowChildren) {
                // series and categories
                let playFrameNode = matrix.rows.root.children[frame];
                
                // create the categories first
                DataViewMatrixUtils.forEachLeafNode(playFrameNode.children, (categoryGroupLeafNode, index, categoryHierarchicalGroupNodes) => {
                    addMatrixHierarchicalGroupToCategories(categoryHierarchicalGroupNodes, categories);
                });
                categorical.categories = categories;

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
                    } else if (columnNode.children && playFrameNode.children) {
                        // Processing a single series under here, push all the value sources for every series.
                        var columnLength = columnNode.children.length;
                        for (let j = 0; j < columnLength; j++) {
                            let source = <any>_.create(matrix.valueSources[j], { groupName: columnNode.value });
                            let dataViewColumn: DataViewValueColumn = {
                                identity: columnNode.identity,
                                values: [],
                                source: source,
                            };
                            categorical.values.push(dataViewColumn);
                        }

                        // Copying the values from matrix intersection to the categorical values columns...
                        DataViewMatrixUtils.forEachLeafNode(playFrameNode.children, leafNode => {
                            for (let j = 0; j < columnLength; j++) {
                                categorical.values[seriesIndex * columnLength + j].values.push(leafNode.values[seriesIndex * columnLength + j].value);
                            }
                        });
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
                let playFrameNode = matrix.rows.root.children[frame];
                let measureLength = matrix.valueSources.length;
                for (let j = 0; j < measureLength; j++) {
                    let dataViewColumn: DataViewValueColumn = {
                        identity: undefined,
                        values: [],
                        source: matrix.valueSources[j]
                    };
                    categorical.values.push(dataViewColumn);
                }

                DataViewMatrixUtils.forEachLeafNode(playFrameNode.children, (categoryGroupLeafNode, index, categoryHierarchicalGroupNodes) => {
                    addMatrixHierarchicalGroupToCategories(categoryHierarchicalGroupNodes, categories);

                    // Copying the values from matrix intersection to the categorical values columns...
                    for (let j = 0; j < measureLength; j++) {
                        categorical.values[j].values.push(categoryGroupLeafNode.values[j].value);
                    }
                });

                categorical.categories = categories;
            }

            // the visual code today expects only 1 category column, hence apply DataViewConcatenateCategoricalColumns
            return DataViewConcatenateCategoricalColumns.applyToPlayChartCategorical(sourceDataView.metadata, scatterChartCapabilities.objects, 'Category', categorical);
        }

        function addMatrixHierarchicalGroupToCategories(sourceCategoryHierarchicalGroupNodes: DataViewMatrixNode[], destinationCategories: DataViewCategoryColumn[]): void {
            debug.assertNonEmpty(sourceCategoryHierarchicalGroupNodes, 'sourceCategoryHierarchicalGroupNodes');
            debug.assertNonEmpty(destinationCategories, 'destinationCategories');
            debug.assert(sourceCategoryHierarchicalGroupNodes.length === destinationCategories.length, 'pre-condition: there should be one category column per matrix row level for Category.');

            // Note: Before the Categorical concatenation logic got added to this playChart logic, the code did NOT populate
            // the ***DataViewCategoryColumn.identityFields*** property, and the playChart visual code does not seem to need it.
            // If we do want to populate that property, we might want to do reuse data.ISQExpr[] across nodes as much as possible 
            // because all the child nodes under a given parent will have the exact same identityFields value, and a lot of 
            // DataViewCategory objects can get created for a given playChart.

            let identity: DataViewScopeIdentity = sourceCategoryHierarchicalGroupNodes[0].identity;

            if (sourceCategoryHierarchicalGroupNodes.length > 1) {
                // if the hierarchical group has more than 1 level, create a composite identity from the nodes
                let identityExpr = <SQExpr>identity.expr;
                for (let i = 1, ilen = sourceCategoryHierarchicalGroupNodes.length; i < ilen; i++) {
                    let identityExprToAdd = <SQExpr>sourceCategoryHierarchicalGroupNodes[i].identity.expr;
                    identityExpr = SQExprBuilder.and(identityExpr, identityExprToAdd);
                }
                identity = createDataViewScopeIdentity(identityExpr);
            }

            // add the Category value of each matrix node into its respective category column
            for (let j = 0, jlen = destinationCategories.length; j < jlen; j++) {
                destinationCategories[j].identity.push(identity);

                let node = sourceCategoryHierarchicalGroupNodes[j];
                destinationCategories[j].values.push(node.value);
            }
        }

        function getObjectProperties(dataViewMetadata: DataViewMetadata, dataLabelsSettings?: PointDataLabelsSettings): PlayObjectProperties {
            let objectProperties: PlayObjectProperties = {};

            if (dataViewMetadata && dataViewMetadata.objects) {
                let objects = dataViewMetadata.objects;
                // TODO: remove?
                objectProperties.currentFrameIndex = DataViewObjects.getValue(objects, scatterChartProps.currentFrameIndex.index, null);
            }
            return objectProperties;
        }

        export function converter<T extends PlayableChartData>(dataView: DataView, visualConverter: VisualDataConverterDelegate<T>): PlayChartData<T> {
            let dataViewMetadata: DataViewMetadata = dataView.metadata;
            let dataLabelsSettings = dataLabelUtils.getDefaultPointLabelSettings();
            let objectProperties = getObjectProperties(dataViewMetadata, dataLabelsSettings);

            let allViewModels: T[] = [];
            let frameKeys: PlayChartFrameData[] = [];
            let convertedData: T = undefined;
            let matrixRows = dataView.matrix.rows;
            let rowChildrenLength = matrixRows.root.children ? matrixRows.root.children.length : 0;
            let keySourceColumn: DataViewMetadataColumn;
            if (dataView.matrix && rowChildrenLength > 0 && !_.isEmpty(matrixRows.levels) && !_.isEmpty(matrixRows.levels[0].sources) ) {
                keySourceColumn = matrixRows.levels[0].sources[0];

                // TODO: this should probably defer to the visual which knows how to format the categories.
                let formatString = valueFormatter.getFormatString(keySourceColumn, scatterChartProps.general.formatString);
                let keyFormatter: IValueFormatter;
                if (keySourceColumn.type.numeric) {
                    // use value range, not actual values
                    let valueRange = Math.abs(<number>matrixRows.root.children[rowChildrenLength - 1].value - <number>matrixRows.root.children[0].value);
                    keyFormatter = valueFormatter.create({
                        format: formatString,
                        value: valueRange,
                        value2: 0,
                    });
                } else {
                    keyFormatter = valueFormatter.createDefaultFormatter(formatString, true);
                }

                for (let i = 0, len = rowChildrenLength; i < len; i++) {
                    let key = matrixRows.root.children[i];
                    let frameLabelText = keyFormatter.format(key.value);
                    // escaped html
                    let frameLabelHtml = $("<div/>").text(frameLabelText).html();
                    frameKeys.push({ escapedText: frameLabelHtml, text: frameLabelText });
                    
                    let dataViewCategorical = convertMatrixToCategorical(dataView, i);
                    let frameInfo = { label: frameLabelHtml, column: keySourceColumn };
                    convertedData = visualConverter(dataViewCategorical, frameInfo);
                    allViewModels.push(convertedData);
                }
            }
            else {
                let dataViewCategorical = convertMatrixToCategorical(dataView, 0);
                convertedData = visualConverter(dataViewCategorical);
                allViewModels.push(convertedData);
            }
            
            // NOTE: currentViewModel is already set to the last frame
            objectProperties.currentFrameIndex = frameKeys.length - 1;

            return {
                allViewModels: allViewModels,
                currentViewModel: convertedData,
                frameData: frameKeys,
                currentFrameIndex: objectProperties.currentFrameIndex,
                labelData: getLabelData(frameKeys, keySourceColumn),
            };
        }

        export function getDefaultPlayData<T extends PlayableChartData>(): PlayChartData<T> {
            let defaultData: PlayChartData<T> = {
                frameData: [],
                allViewModels: [],
                currentFrameIndex: 0,
                currentViewModel: undefined,
                labelData: {
                    anyWordBreaks: false,
                    labelInfo: [],
                },
            };
            return defaultData;
        }

        export function getMinMaxForAllFrames<T extends PlayableChartData>(playData: PlayChartData<T>, getExtents: (T) => CartesianExtents): CartesianExtents {
            let extents: CartesianExtents = {
                minY: 0,
                maxY: 10,
                minX: 0,
                maxX: 10,
            };

            if (playData.allViewModels && playData.allViewModels.length > 0) {
                extents.minY = extents.minX = Number.MAX_VALUE;
                extents.maxY = extents.maxX = Number.MIN_VALUE;
                for (let i = 0, len = playData.allViewModels.length; i < len; i++) {
                    let data = playData.allViewModels[i];
                    let e = getExtents(data);

                    // NOTE: D3.min/max handle undefined and NaN nicely, as opposed to Math.min/max
                    extents = {
                        minY: d3.min([e.minY, extents.minY]),
                        maxY: d3.max([e.maxY, extents.maxY]),
                        minX: d3.min([e.minX, extents.minX]),
                        maxX: d3.max([e.maxX, extents.maxX]),
                    };
                }
            }

            return extents;
        }

        function getLabelData(keys: PlayChartFrameData[], keyColumn?: DataViewMetadataColumn): PlayAxisTickLabelData {
            let textProperties: TextProperties = {
                fontFamily: Font.Family.regular.css,
                fontSize: jsCommon.PixelConverter.toString(14),
            };

            let labelInfo: PlayAxisTickLabelInfo[] = [];
            let anyWordBreaks = false;
            for (let key of keys) {
                let labelWidth = jsCommon.WordBreaker.getMaxWordWidth(key.escapedText, TextMeasurementService.measureSvgTextWidth, textProperties);
                // TODO: Why isn't this last part included in hasBreakers()?
                anyWordBreaks = anyWordBreaks || jsCommon.WordBreaker.hasBreakers(key.escapedText) || (key.escapedText).indexOf('-') > -1;  
                labelInfo.push({ label: key.escapedText, labelWidth });
            }

            return {
                labelInfo: labelInfo,
                anyWordBreaks: anyWordBreaks,
                labelFieldName: keyColumn && keyColumn.displayName,
            };
        }

        export function isDataViewPlayable(dataView: DataView, playRole: string = 'Play'): boolean {
            debug.assertValue(dataView, 'dataView');

            let firstRowSourceRoles = dataView.matrix &&
                dataView.matrix.rows &&
                dataView.matrix.rows.levels &&
                dataView.matrix.rows.levels[0] &&
                dataView.matrix.rows.levels[0].sources &&
                dataView.matrix.rows.levels[0].sources[0] &&
                dataView.matrix.rows.levels[0].sources[0].roles;

            return firstRowSourceRoles && firstRowSourceRoles[playRole];
        }

        /** Render trace-lines for selected data points. */
        export function renderTraceLines(allDataPoints: SelectableDataPoint[], traceLineRenderer: ITraceLineRenderer, shouldAnimate: boolean): void {
            let selectedDataPoints = _.filter(allDataPoints, (d: SelectableDataPoint) => d.selected);
            selectedDataPoints = _.uniq(selectedDataPoints, (d: SelectableDataPoint) => d.identity.getKey());
            traceLineRenderer.render(selectedDataPoints, shouldAnimate);
        }
    }
}