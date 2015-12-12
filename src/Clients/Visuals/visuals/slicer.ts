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
    import DisplayNameKeys = SlicerUtil.DisplayNameKeys;
    import DOMHelper = SlicerUtil.DOMHelper;
    import SettingsHelper = SlicerUtil.SettingsHelper;
    import PixelConverter = jsCommon.PixelConverter;
    import SlicerOrientation = slicerOrientation.Orientation;

    export interface SlicerDefaultValueHandler {
        getDefaultValue(): data.SQConstantExpr;
        getIdentityFields(): data.SQExpr[];
    }

    export interface SlicerConstructorOptions {
        behavior?: IInteractiveBehavior;
    }

    export interface ISlicerVisual {
        init(options: VisualInitOptions): IInteractivityService;
        render(options: SlicerRenderOptions): void;
    }

    export interface SlicerRenderOptions {
        dataView: DataView;
        data: SlicerData;
        viewport: IViewport;
    }

    export interface SlicerData {
        categorySourceName: string;
        slicerDataPoints: SlicerDataPoint[];
        slicerSettings: SlicerSettings;
        hasSelectionOverride?: boolean;
    }

    export interface SlicerDataPoint extends SelectableDataPoint {
        value: string;
        tooltip: string;
        isSelectAllDataPoint?: boolean;
    }

    export interface SlicerSettings {
        general: {
            outlineColor: string;
            outlineWeight: number;
            orientation: SlicerOrientation;
        };
        header: {
            borderBottomWidth: number;
            show: boolean;
            outline: string;
            fontColor: string;
            background?: string;
            textSize: number;
        };
        slicerText: {
            color: string;
            outline: string;
            background?: string;
            textSize: number;
        };
        selection: {
            selectAllCheckboxEnabled: boolean;
            singleSelect: boolean;
        };
    }

    export interface CheckboxStyle {
        transform: string;
        'transform-origin': string;
        'font-size': string;
    }

    export class Slicer implements IVisual, SlicerDefaultValueHandler {
        private element: JQuery;
        private currentViewport: IViewport;
        private dataView: DataView;
        private options: VisualInitOptions;
        private slicerHeader: D3.Selection;
        private slicerBody: D3.Selection;
        private slicerContainer: D3.Selection;
        private listView: IListView;
        private slicerData: SlicerData;
        private settings: SlicerSettings;
        private interactivityService: IInteractivityService;
        private behavior: IInteractiveBehavior;
        private hostServices: IVisualHostServices;
        private slicerVisual: ISlicerVisual;
        private slicerOrientation: SlicerOrientation;
        private waitingForData: boolean;
        private renderAsImage: (url: string) => boolean;
        private textProperties: TextProperties = {
            'fontFamily': 'wf_segoe-ui_normal, helvetica, arial, sans-serif',
            'fontSize': '14px',
        };

        public static DefaultStyleProperties(): SlicerSettings {
            return {
                general: {
                    outlineColor: '#808080',
                    outlineWeight: 1,
                    orientation: SlicerOrientation.Vertical,
                },
                header: {
                    borderBottomWidth: 1,
                    show: true,
                    outline: 'BottomOnly',
                    fontColor: '#000000',
                    textSize: 10,
                },
                slicerText: {
                    color: '#666666',
                    outline: 'None',
                    textSize: 10,
                },
                selection: {
                    selectAllCheckboxEnabled: false,
                    singleSelect: true
                },
            };
        }

        constructor(options?: SlicerConstructorOptions) {
            if (options) {
                this.behavior = options.behavior;
            }
            this.renderAsImage = $.noop;
        }

        public static converter(dataView: DataView, localizedSelectAllText: string, interactivityService: IInteractivityService, hostServices?: IVisualHostServices): SlicerData {
            return DataConversion.convert(dataView, localizedSelectAllText, interactivityService, hostServices);
        }

        public init(options: VisualInitOptions): void {
            this.options = options;
            this.element = options.element;
            this.currentViewport = options.viewport;
            this.hostServices = options.host;
            let settings = this.settings = Slicer.DefaultStyleProperties();
            this.slicerOrientation = settings.general.orientation;
            this.interactivityService = this.initVerticalSlicer(options);
        }

        public onDataChanged(options: VisualDataChangedOptions): void {
            let dataViews = options.dataViews;
            debug.assertValue(dataViews, 'dataViews');

            let existingDataView = this.dataView;
            if (_.isEmpty(dataViews)) {
                this.listView.empty();
                return;
            }

            this.dataView = dataViews[0];
            let metadata = this.dataView.metadata;
            this.renderAsImage = metadata &&
                !_.isEmpty(metadata.columns) &&
                metadata.columns[0].type &&
                metadata.columns[0].type.misc &&
                metadata.columns[0].type.misc.imageUrl ? jsCommon.Utility.isValidUrl : $.noop;

            // Reset scrollbar by default, unless it's an Append operation or Selecting an item
            let resetScrollbarPosition = options.operationKind !== VisualDataChangeOperationKind.Append
                && !DataViewAnalysis.hasSameCategoryIdentity(existingDataView, this.dataView);

            this.updateInternal(resetScrollbarPosition);
            this.waitingForData = false;
        }

        public onResizing(finalViewport: IViewport): void {
            this.currentViewport = finalViewport;
            this.updateInternal(false /* resetScrollbarPosition */);
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
            return ObjectEnumerator.enumerateObjectInstances(options, this.slicerData, this.settings);
        }

        // SlicerDefaultValueHandler
        public getDefaultValue(): data.SQConstantExpr {
            let dataViewDefaultValue = DataConversion.getDataViewDefaultValue(this.dataView);
            if (dataViewDefaultValue)
                return dataViewDefaultValue.value;
        }

        public getIdentityFields(): data.SQExpr[] {
            if (!this.dataView) {
                return;
            }

            let dataViewCategorical = this.dataView.categorical;
            if (dataViewCategorical == null || _.isEmpty(dataViewCategorical.categories))
                return;

            return dataViewCategorical.categories[0].identityFields;
        }

        private updateInternal(resetScrollbarPosition: boolean) {
            let localizedSelectAllText = this.hostServices.getLocalizedString(DisplayNameKeys.SelectAll);
            let dataView = this.dataView;
            let data = Slicer.converter(dataView, localizedSelectAllText, this.interactivityService, this.hostServices);
            if (!data) {
                this.listView.empty();
                DOMHelper.updateSlicerBodyDimensions(this.currentViewport, this.slicerBody, this.settings);
                return;
            }

            data.slicerSettings.general.outlineWeight = data.slicerSettings.general.outlineWeight < 0 ? 0 : data.slicerSettings.general.outlineWeight;
            this.settings = data.slicerSettings;
            this.slicerData = data;

            let slicerOrientation = SettingsHelper.areSettingsDefined(data) && data.slicerSettings.general && data.slicerSettings.general.orientation ?
                data.slicerSettings.general.orientation : Slicer.DefaultStyleProperties().general.orientation;

            let orientationHasChanged = this.orientationHasChanged(slicerOrientation);
            if (orientationHasChanged) {
                this.slicerOrientation = slicerOrientation;
                // Clear the previous slicer type when rendering the new slicer type
                this.element.empty();
            }

            switch (slicerOrientation) {
                case SlicerOrientation.Horizontal:
                    let horizontalSlicer = this.slicerVisual;
                    if (orientationHasChanged) {
                        horizontalSlicer = this.slicerVisual = new HorizontalSlicer({ behavior: this.behavior });
                        this.interactivityService = horizontalSlicer.init(this.options);
                    }
                    horizontalSlicer.render({ dataView: dataView, data: data, viewport: this.currentViewport });
                    break;

                case SlicerOrientation.Vertical:
                default:
                    if (orientationHasChanged) {
                        this.interactivityService = this.initVerticalSlicer(this.options);
                    }
                    this.render(data, resetScrollbarPosition);
                    break;
            }
        }

        private orientationHasChanged(slicerOrientation: SlicerOrientation): boolean {
            return this.slicerOrientation !== slicerOrientation;
        }

        private render(data: SlicerData, resetScrollbarPosition: boolean): void {
            DOMHelper.updateSlicerBodyDimensions(this.currentViewport, this.slicerBody, this.settings);
            this.updateSelectionStyle();
            this.listView
                .viewport(DOMHelper.getSlicerBodyViewport(this.currentViewport, this.settings, this.textProperties))
                .rowHeight(DOMHelper.getRowHeight(this.settings, this.textProperties))
                .data(
                    data.slicerDataPoints,
                    (d: SlicerDataPoint) => $.inArray(d, data.slicerDataPoints),
                    resetScrollbarPosition
                    );

        }

        private updateSelectionStyle(): void {
            this.slicerContainer.classed('isMultiSelectEnabled', !this.settings.selection.singleSelect);
        }

        private initVerticalSlicer(options: VisualInitOptions): IInteractivityService {
            let settings = this.settings;
            let slicerBodyViewport = DOMHelper.getSlicerBodyViewport(this.currentViewport, settings, this.textProperties);
            let interactivityService: IInteractivityService;

            if (this.behavior)
                interactivityService = createInteractivityService(options.host);

            let slicerContainerDiv = document.createElement('div');
            slicerContainerDiv.className = Selectors.Container.class;
            let slicerContainer = this.slicerContainer = d3.select(slicerContainerDiv);

            let slicerHeader = DOMHelper.createSlicerHeader(this.hostServices);
            slicerContainerDiv.appendChild(slicerHeader);
            this.slicerHeader = d3.select(slicerHeader);

            this.slicerBody = slicerContainer.append('div').classed(SlicerUtil.Selectors.Body.class, true)
                .style({
                    'height': PixelConverter.toString(slicerBodyViewport.height),
                    'width': PixelConverter.toString(slicerBodyViewport.width),
                });

            let rowEnter = (rowSelection: D3.Selection) => {
                let settings = this.settings;
                let listItemElement = rowSelection.append('li')
                    .classed(Selectors.ItemContainer.class, true);

                let labelElement = listItemElement.append('div')
                    .classed(Selectors.Input.class, true);

                labelElement.append('input')
                    .attr('type', 'checkbox');

                labelElement.append('span')
                    .classed(Selectors.Checkbox.class, true)
                    .style(Styles.buildCheckboxStyle(settings));

                listItemElement.append('span')
                    .classed(SlicerUtil.Selectors.LabelText.class, true)
                    .style('font-size', PixelConverter.fromPoint(settings.slicerText.textSize));
            };

            let rowUpdate = (rowSelection: D3.Selection) => {
                let settings = this.settings;
                let data = this.slicerData;
                if (data && settings) {
                    // Style Slicer Header
                    DOMHelper.styleSlicerHeader(this.slicerHeader, settings, data.categorySourceName);

                    let slicerText = rowSelection.selectAll(SlicerUtil.Selectors.LabelText.selector);

                    slicerText.html((d: SlicerDataPoint) => {
                        if (!this.renderAsImage(d.value))
                            return d.value;
                        else
                            return `<img src="${d.value}" />`;
                    });
                    DOMHelper.setSlicerTextStyle(slicerText, settings);
                    
                    let slicerCheckbox = rowSelection.selectAll(Selectors.Input.selector).selectAll('span');
                    slicerCheckbox.style(Styles.buildCheckboxStyle(settings));

                    if (interactivityService && this.slicerBody) {
                        let slicerBody = this.slicerBody.attr('width', this.currentViewport.width);
                        let slicerItemContainers = slicerBody.selectAll(Selectors.ItemContainer.selector);
                        let slicerItemLabels = slicerBody.selectAll(SlicerUtil.Selectors.LabelText.selector);
                        let slicerItemInputs = slicerBody.selectAll(Selectors.Input.selector);
                        let slicerClear = this.slicerHeader.select(SlicerUtil.Selectors.Clear.selector);

                        let behaviorOptions: VerticalSlicerBehaviorOptions = {
                            dataPoints: data.slicerDataPoints,
                            slicerContainer: this.slicerContainer,
                            itemContainers: slicerItemContainers,
                            itemLabels: slicerItemLabels,
                            itemInputs: slicerItemInputs,
                            clear: slicerClear,
                            interactivityService: interactivityService,
                            settings: data.slicerSettings,
                        };

                        let slicerOrientationBehaviorOptions: SlicerOrientationBehaviorOptions = {
                            behaviorOptions: behaviorOptions,
                            orientation: SlicerOrientation.Vertical,
                        };

                        interactivityService.bind(
                            data.slicerDataPoints,
                            this.behavior,
                            slicerOrientationBehaviorOptions,
                            { overrideSelectionFromData: true, hasSelectionOverride: data.hasSelectionOverride, slicerDefaultValueHandler: this });
                        SlicerWebBehavior.styleSlicerItems(rowSelection.select(Selectors.Input.selector), interactivityService.hasSelection());
                    }
                    else {
                        SlicerWebBehavior.styleSlicerItems(rowSelection.select(Selectors.Input.selector), false);
                    }
                }
            };

            let rowExit = (rowSelection: D3.Selection) => {
                rowSelection.remove();
            };

            let listViewOptions: ListViewOptions = {
                rowHeight: DOMHelper.getRowHeight(settings, this.textProperties),
                enter: rowEnter,
                exit: rowExit,
                update: rowUpdate,
                loadMoreData: () => this.onLoadMoreData(),
                scrollEnabled: true,
                viewport: DOMHelper.getSlicerBodyViewport(this.currentViewport, settings, this.textProperties),
                baseContainer: this.slicerBody,
            };

            this.listView = ListViewFactory.createListView(listViewOptions);

            // Append container to DOM
            this.element.get(0).appendChild(slicerContainerDiv);

            return interactivityService;
        }

        private onLoadMoreData(): void {
            if (!this.waitingForData && this.dataView.metadata && this.dataView.metadata.segment) {
                this.hostServices.loadMoreData();
                this.waitingForData = true;
            }
        }
    }

    /** Helper class for calculating the current slicer settings. */
    module ObjectEnumerator {
        export function enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions, data: SlicerData, settings: SlicerSettings): VisualObjectInstance[] {
            if (!data)
                return;

            switch (options.objectName) {
                case 'items':
                    return enumerateItems(data, settings);
                case 'header':
                    return enumerateHeader(data, settings);
                case 'general':
                    return enumerateGeneral(data, settings);
                case 'selection':
                    return enumerateSelection(data, settings);
            }
        }

        function enumerateSelection(data: SlicerData, settings: SlicerSettings): VisualObjectInstance[] {
            let slicerSettings = settings;
            let areSelectionSettingsDefined = SettingsHelper.areSettingsDefined(data) && data.slicerSettings.selection;
            let selectAllCheckboxEnabled = areSelectionSettingsDefined && data.slicerSettings.selection.selectAllCheckboxEnabled ?
                data.slicerSettings.selection.selectAllCheckboxEnabled : slicerSettings.selection.selectAllCheckboxEnabled;
            let singleSelect = data && data.slicerSettings && data.slicerSettings.selection && data.slicerSettings.selection.singleSelect !== undefined ?
                data.slicerSettings.selection.singleSelect : slicerSettings.selection.singleSelect;

            return [{
                selector: null,
                objectName: 'selection',
                properties: {
                    selectAllCheckboxEnabled: selectAllCheckboxEnabled,
                    singleSelect: singleSelect
                }
            }];
        }

        function enumerateHeader(data: SlicerData, settings: SlicerSettings): VisualObjectInstance[] {
            let slicerSettings = settings;
            let areHeaderSettingsDefined = SettingsHelper.areSettingsDefined(data) && data.slicerSettings.header;
            let fontColor = areHeaderSettingsDefined && data.slicerSettings.header.fontColor ?
                data.slicerSettings.header.fontColor : slicerSettings.header.fontColor;
            let background = areHeaderSettingsDefined && data.slicerSettings.header.background ?
                data.slicerSettings.header.background : slicerSettings.header.background;
            return [{
                selector: null,
                objectName: 'header',
                properties: {
                    show: slicerSettings.header.show,
                    fontColor: fontColor,
                    background: background,
                    outline: slicerSettings.header.outline,
                    textSize: slicerSettings.header.textSize,
                }
            }];
        }

        function enumerateItems(data: SlicerData, settings: SlicerSettings): VisualObjectInstance[] {
            let slicerSettings = settings;
            let areTextSettingsDefined = SettingsHelper.areSettingsDefined(data) && data.slicerSettings.slicerText;
            let fontColor = areTextSettingsDefined && data.slicerSettings.slicerText.color ?
                data.slicerSettings.slicerText.color : slicerSettings.slicerText.color;
            let background = areTextSettingsDefined && data.slicerSettings.slicerText.background ?
                data.slicerSettings.slicerText.background : slicerSettings.slicerText.background;
            return [{
                selector: null,
                objectName: 'items',
                properties: {
                    fontColor: fontColor,
                    background: background,
                    outline: slicerSettings.slicerText.outline,
                    textSize: slicerSettings.slicerText.textSize,
                }
            }];
        }

        function enumerateGeneral(data: SlicerData, settings: SlicerSettings): VisualObjectInstance[] {
            let slicerSettings = settings;
            let areGeneralSettingsDefined = SettingsHelper.areSettingsDefined(data) && data.slicerSettings.general != null;
            let outlineColor = areGeneralSettingsDefined && data.slicerSettings.general.outlineColor ?
                data.slicerSettings.general.outlineColor : slicerSettings.general.outlineColor;
            let outlineWeight = areGeneralSettingsDefined && data.slicerSettings.general.outlineWeight ?
                data.slicerSettings.general.outlineWeight : slicerSettings.general.outlineWeight;
            let orientation = areGeneralSettingsDefined && data.slicerSettings.general.orientation != null ?
                data.slicerSettings.general.orientation : slicerSettings.general.orientation;

            return [{
                selector: null,
                objectName: 'general',
                properties: {
                    outlineColor: outlineColor,
                    outlineWeight: outlineWeight,
                    orientation: orientation,
                }
            }];
        }
    }

    module Selectors {
        import createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;

        export const Container = createClassAndSelector('slicerContainer');
        export const ItemContainer = createClassAndSelector('slicerItemContainer');
        export const Input = createClassAndSelector('slicerCheckbox');
        export const Checkbox = createClassAndSelector('checkbox');
    }

    module CheckboxSprite {
        export const MinimumSize = 8;
        export const Size = 13;
        export const SizeRange = Size - MinimumSize;
    }

    /** Helper class for managing slicer styles. */
    module Styles {
        export function buildCheckboxStyle(settings: SlicerSettings): CheckboxStyle {
            let checkboxScale = getCheckboxScale(settings);
            let checkboxTransformOrigin = SVGUtil.transformOrigin('left', 'center');
            return {
                'transform': checkboxScale,
                'transform-origin': checkboxTransformOrigin,
                'font-size': PixelConverter.fromPoint(settings.slicerText.textSize),
            };
        }

        function getCheckboxScale(settings: SlicerSettings): string {
            let scale = jsCommon.TextSizeDefaults.getScale(settings.slicerText.textSize);
            let size = (CheckboxSprite.MinimumSize + (CheckboxSprite.SizeRange * scale));
            let relativeZoom = size / CheckboxSprite.Size;

            let rounded = powerbi.Double.toIncrement(relativeZoom, 0.05);

            return SVGUtil.scale(rounded);
        }

    }
}