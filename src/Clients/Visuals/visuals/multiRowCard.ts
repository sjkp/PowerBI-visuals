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
    import getKpiImageMetadata = powerbi.visuals.KpiUtil.getKpiImageMetadata;
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    import createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;
    import PixelConverter = jsCommon.PixelConverter;
    import UrlUtils = jsCommon.UrlUtils;
    import Surround = powerbi.visuals.controls.internal.TablixUtils.Surround;
    import EdgeSettings = powerbi.visuals.controls.internal.TablixUtils.EdgeSettings;

    const TitleFontFamily = Font.Family.semibold.css;
    const DefaultFontFamily = Font.Family.regular.css;
    const DefaultCaptionFontSizeInPt = 10;
    const DefaultTitleFontSizeInPt = 13;
    const DefaultDetailFontSizeInPt = 9;
    
    const DefaultTitleColor = '#767676';
    const DefaultTextColor = '#333333';
    const DefaultCategoryColor = '#ACACAC';
    const DefaultOutline = outline.none;
    const DefaultOutlineColor = '#E8E8E8';
    const DefaultOutlineWeight = 1;
    const DefaultBarShow = true;
    const DefaultBarColor = '#A6A6A6';
    const DefaultBarOutline = outline.leftOnly;
    const DefaultBarWeight = 3;

    export interface CardItemData {
        caption: string;
        details: string;
        showURL: boolean;
        showImage: boolean;
        showKPI: boolean;
        columnIndex: number;
    }
    
    export interface CardSettings {
        outlineSettings: OutlineSettings;
        barSettings: OutlineSettings;
        cardPadding: number;
        cardBackground: string;
    }
    
    export interface OutlineSettings{
        outline: string;
        color: string;
        weight: number;
    }
    
    export interface MultiRowCardData {
        dataModel: CardData[];
        dataColumnCount: number;
        cardTitleSettings: VisualDataLabelsSettings;
        dataLabelsSettings: VisualDataLabelsSettings;
        categoryLabelsSettings: VisualDataLabelsSettings;
        cardSettings: CardSettings;
    }

    export interface CardData {
        title?: string;
        showTitleAsURL?: boolean;
        showTitleAsImage?: boolean;
        showTitleAsKPI?: boolean;
        cardItemsData: CardItemData[];
    }

    interface ImageStyle {
        maxWidth?: number;
        maxHeight?: number;
    }

    interface MediaQuery {
        maxWidth?: number;
        style?: MultiRowCardStyle;
    }

    interface MultiRowCardStyle {
        row?: {
            border?: Surround<EdgeSettings>;
            padding?: Surround<number>;
            marginBottom?: number;
            background?: string
        };
        card?: {
            border?: Surround<EdgeSettings>;
            padding?: Surround<number>;
        };
        cardItemContainer?: {
            paddingRight?: number;
            minWidth?: number;
            padding?: Surround<number>;
        };
        details?: {
            fontSize?: number;
            color?: string,
            isVisible?: boolean;
        };
        caption?: {
            fontSize?: number;
            color?: string,
        };
        title?: {
            fontSize?: number;
            color?: string,
        };
        imageCaption?: ImageStyle;
        imageTitle?: ImageStyle;
    }

    export class MultiRowCard implements IVisual {
        private currentViewport: IViewport;
        private options: VisualInitOptions;
        private dataView: DataView;
        private style: IVisualStyle;
        private element: JQuery;
        private listView: IListView;
        /**
         * This includes card height with margin that will be passed to list view.
         */
        private interactivity: InteractivityOptions;
        private isInteractivityOverflowHidden: boolean = false;
        private waitingForData: boolean;
        private cardHasTitle: boolean;
        private isSingleRowCard: boolean;
        private maxColPerRow: number;
        private data: MultiRowCardData;

        /**
         * Note: Public for testability.
         */
        public static formatStringProp: DataViewObjectPropertyIdentifier = {
            objectName: 'general',
            propertyName: 'formatString',
        };

        private static MultiRowCardRoot = createClassAndSelector('multiRowCard');
        private static Card: ClassAndSelector = createClassAndSelector('card');
        private static Title: ClassAndSelector = createClassAndSelector('title');
        private static CardItemContainer: ClassAndSelector = createClassAndSelector('cardItemContainer');
        private static Caption: ClassAndSelector = createClassAndSelector('caption');
        private static Details: ClassAndSelector = createClassAndSelector('details');
        private static TitleUrlSelector: string = MultiRowCard.Title.selector + ' a';
        private static CaptionUrlSelector: string = MultiRowCard.Caption.selector + ' a';
        private static TitleImageSelector: string = MultiRowCard.Title.selector + ' img';
        private static CaptionImageSelector: string = MultiRowCard.Caption.selector + ' img';
        private static KPITitle: ClassAndSelector = createClassAndSelector('kpiTitle');
        private static ValuesRole: string = 'Values';

        /**
         * Cards have specific styling so defined inline styles and also to support theming and improve performance.
         */
        private static DefaultStyle: MultiRowCardStyle = {
            row: {
                border: null,
                marginBottom: 20,
                background: undefined,
                padding: {
                    top: 5,
                    right: 5,
                    bottom: 5,
                    left: 5
                }
            },
            card: {
                border: null,
                padding: {
                    top: 10,
                    right: 10,
                    bottom: 10,
                    left: 10
                }
            },
            cardItemContainer: {
                paddingRight: 20,
                minWidth: 120,
                padding: {
                    top: 7
                }
            },
            imageCaption: {
                maxHeight: 75,
                maxWidth: 100,
            },
            imageTitle: {
                maxHeight: 75,
                maxWidth: 100,
            }
        };

        // queries should be ordered by maxWidth in ascending order
        private static tileMediaQueries: MediaQuery[] = [
            {
                maxWidth: 250,
                style: {
                    cardItemContainer: {
                        minWidth: 110,
                    },
                    imageCaption: {
                        maxHeight: 45,
                    }
                }
            },
            {
                maxWidth: 490,
                style: {
                    cardItemContainer: {
                        minWidth: 130,
                    },
                    imageCaption: {
                        maxHeight: 52,
                    }
                }
            },
            {
                maxWidth: 750,
                style: {
                    cardItemContainer: {
                        minWidth: 120,
                    },
                    imageCaption: {
                        maxHeight: 53,
                    }
                }
            },
            {
                maxWidth: Number.MAX_VALUE,
                style: {
                    cardItemContainer: {
                        padding: {
                            top: 5
                        }
                    }
                }
            }
        ];

        public init(options: VisualInitOptions) {
            debug.assertValue(options, 'options');
            this.options = options;
            this.style = options.style;
            let viewport = this.currentViewport = options.viewport;
            let interactivity = this.interactivity = options.interactivity;

            if (interactivity && interactivity.overflow === 'hidden')
                this.isInteractivityOverflowHidden = true;

            let multiRowCardDiv = this.element = $('<div/>')
                .addClass(MultiRowCard.MultiRowCardRoot.class)
                .css({
                    'height': getPixelString(viewport.height),
                });
            options.element.append(multiRowCardDiv);
            this.initializeCardRowSelection();
        }

        public onDataChanged(options: VisualDataChangedOptions): void {
            debug.assertValue(options, 'options');

            let dataViews = options.dataViews;
            if (dataViews && dataViews.length > 0) {
                let dataView = this.dataView = dataViews[0];
                let columnMetadata: DataViewMetadataColumn[] = dataView.table.columns;
                let tableRows: any[][] = dataView.table.rows;
                let resetScrollbarPosition = options.operationKind !== VisualDataChangeOperationKind.Append;
                let data = this.data = MultiRowCard.converter(dataView, columnMetadata.length, tableRows.length, this.isInteractivityOverflowHidden);
                this.setCardDimensions();
                this.listView.data(data.dataModel, (d: CardData) => data.dataModel.indexOf(d), resetScrollbarPosition);
            }
            else {
                this.data = {
                    dataModel: [],
                    dataColumnCount: 0,
                    cardTitleSettings: dataLabelUtils.getDefaultLabelSettings(true, DefaultTitleColor, DefaultTitleFontSizeInPt),
                    categoryLabelsSettings: dataLabelUtils.getDefaultLabelSettings(true, DefaultCategoryColor, DefaultDetailFontSizeInPt),
                    dataLabelsSettings: dataLabelUtils.getDefaultLabelSettings(true, DefaultTextColor, DefaultCaptionFontSizeInPt),
                    cardSettings: MultiRowCard.getCardSettings(null)
                };
            }

            this.waitingForData = false;
        }
        
        private static getCardSettings(dataView: DataView): CardSettings {

            let objects = dataView && dataView.metadata && dataView.metadata.objects ? dataView.metadata.objects : null;

            let outlineSettings: OutlineSettings = {
                outline: DataViewObjects.getValue(objects, multiRowCardProps.card.outline, DefaultOutline),
                color: DataViewObjects.getFillColor(objects, multiRowCardProps.card.outlineColor, DefaultOutlineColor),
                weight: DataViewObjects.getValue(objects, multiRowCardProps.card.outlineWeight, DefaultOutlineWeight),
            };

            let barShow = DataViewObjects.getValue(objects, multiRowCardProps.card.barShow, DefaultBarShow);

            let barSettings: OutlineSettings = {
                // If the bar is hidden, set the outline to none
                outline: barShow ? DefaultBarOutline : outline.none,
                color: DataViewObjects.getFillColor(objects, multiRowCardProps.card.barColor, DefaultBarColor),
                weight: DataViewObjects.getValue(objects, multiRowCardProps.card.barWeight, DefaultBarWeight),
            };

            let cardPadding = DataViewObjects.getValue(objects, multiRowCardProps.card.cardPadding, MultiRowCard.DefaultStyle.row.marginBottom);
            let cardBackground = DataViewObjects.getFillColor(objects, multiRowCardProps.card.cardBackground, MultiRowCard.DefaultStyle.row.background);

            return {
                outlineSettings: outlineSettings,
                barSettings: barSettings,
                cardPadding: cardPadding,
                cardBackground: cardBackground
            };
        }

        public onResizing(viewport: IViewport): void {
            let heightNotChanged = (this.currentViewport.height === viewport.height);
            this.currentViewport = viewport;
            this.element.css('height', getPixelString(viewport.height));
            if (!this.dataView)
                return;

            let previousMaxColPerRow = this.maxColPerRow;
            this.maxColPerRow = this.getMaxColPerRow();
            let widthNotChanged = (previousMaxColPerRow === this.maxColPerRow);
            if (heightNotChanged && widthNotChanged)
                return;

            this.listView.viewport(viewport);
        }
        
        public static converter(dataView: DataView, columnCount: number, maxCards: number, isDashboardVisual: boolean = false): MultiRowCardData {
            let details: CardData[] = [];
            let tableDataRows = dataView.table.rows;
            let columnMetadata: DataViewMetadataColumn[] = dataView.table.columns;
            let cardTitleSettings: VisualDataLabelsSettings ,
                dataLabelsSettings: VisualDataLabelsSettings,
                categoryLabelsSettings: VisualDataLabelsSettings;

            cardTitleSettings = dataLabelUtils.getDefaultLabelSettings(true, DefaultTitleColor, DefaultTitleFontSizeInPt);
            dataLabelsSettings = dataLabelUtils.getDefaultLabelSettings(true, DefaultTextColor, DefaultCaptionFontSizeInPt);
            categoryLabelsSettings = dataLabelUtils.getDefaultLabelSettings(true, DefaultCategoryColor, DefaultDetailFontSizeInPt);

            if (dataView.metadata && dataView.metadata.objects) {
                let cardTitleLabelObjects = <DataLabelObject>DataViewObjects.getObject(dataView.metadata.objects, 'cardTitle');
                dataLabelUtils.updateLabelSettingsFromLabelsObject(cardTitleLabelObjects, cardTitleSettings);

                let dataLabelObject = <DataLabelObject>DataViewObjects.getObject(dataView.metadata.objects, 'dataLabels');
                dataLabelUtils.updateLabelSettingsFromLabelsObject(dataLabelObject, dataLabelsSettings);

                let categoryLabelObject = <DataLabelObject>DataViewObjects.getObject(dataView.metadata.objects, 'categoryLabels');
                dataLabelUtils.updateLabelSettingsFromLabelsObject(categoryLabelObject, categoryLabelsSettings);
            }

            for (let i = 0, len = maxCards; i < len; i++) {
                let row = tableDataRows[i];
                let isValuePromoted: boolean = undefined;
                var title: string = undefined;
                let showTitleAsURL: boolean = false;
                let showTitleAsImage: boolean = false;
                let showTitleAsKPI: boolean = false;
                let cardData: CardItemData[] = [];
                for (let j = 0; j < columnCount; j++) {
                    let column = columnMetadata[j];

                    let statusGraphicInfo = getKpiImageMetadata(column, row[j]);
                    let columnCaption: string;
                    let statusGraphic: string;

                    if (statusGraphicInfo) {
                        columnCaption = statusGraphicInfo.class;
                        statusGraphic = statusGraphicInfo.statusGraphic;
                    }

                    //TODO: seems we are duplicating this logic in many places. Consider putting it in KPIUtil
                    if (!columnCaption)
                        columnCaption = valueFormatter.format(row[j], valueFormatter.getFormatString(column, MultiRowCard.formatStringProp));

                    let showKPI = statusGraphicInfo !== undefined && statusGraphicInfo.caption !== undefined;

                    // The columnDetail represents column name. In card the column name is shown as details
                    let columnDetail: string = columnMetadata[j].displayName;

                    //Title is shown only on Canvas and only if there is one Category field.
                    if (!isDashboardVisual && !column.type.numeric) {
                        if (isValuePromoted === undefined) {
                            isValuePromoted = true;
                            title = columnCaption;
                            showTitleAsURL = converterHelper.isWebUrlColumn(column) && UrlUtils.isValidUrl(title);
                            showTitleAsImage = converterHelper.isImageUrlColumn(column) && UrlUtils.isValidImageUrl(columnCaption);
                            showTitleAsKPI = showKPI;
                        }
                        else if (isValuePromoted) {
                            isValuePromoted = false;
                        }
                    }
                    cardData.push({
                        caption: columnCaption,
                        details: columnDetail,
                        showURL: converterHelper.isWebUrlColumn(column) && UrlUtils.isValidUrl(columnCaption),
                        showImage: converterHelper.isImageUrlColumn(column) && UrlUtils.isValidImageUrl(columnCaption),
                        showKPI: showKPI,
                        columnIndex: j
                    });
                }
                details.push({
                    title: isValuePromoted ? title : undefined,
                    showTitleAsURL: showTitleAsURL,
                    showTitleAsImage: showTitleAsImage,
                    showTitleAsKPI: showTitleAsKPI,
                    cardItemsData: isValuePromoted ? cardData.filter((d: CardItemData) => d.caption !== title) : cardData
                });
            }
            return {
                dataModel: details,
                dataColumnCount: details[0] ? details[0].cardItemsData.length : 0,
                cardTitleSettings: cardTitleSettings,
                categoryLabelsSettings: categoryLabelsSettings,
                dataLabelsSettings: dataLabelsSettings,
                cardSettings: MultiRowCard.getCardSettings(dataView)
            };
        }
        
        public static getSortableRoles(options: VisualSortableOptions): string[] {
            
            if (!options || !options.dataViewMappings || _.isEmpty(options.dataViewMappings)) {
                return;
            }

            for (let dataViewMapping of options.dataViewMappings) {
                if (dataViewMapping.table) {

                    let rows = <powerbi.data.CompiledDataViewRoleForMappingWithReduction>dataViewMapping.table.rows;

                    if (rows && rows.for && rows.for.in && rows.for.in.items) {
                        return [MultiRowCard.ValuesRole];
                    }
                }
            }

            return;
        }

        private initializeCardRowSelection() {
            let isDashboardVisual = this.isInteractivityOverflowHidden;

            let rowEnter = (rowSelection: D3.Selection) => {
                let cardRow = rowSelection
                    .append("div")
                    .classed(MultiRowCard.Card.class, true);

                // The card top padding is not needed when card items are wrapped as top padding is added to each carditemcontainer when wrapped
                if (isDashboardVisual) {
                    cardRow.classed('mrtile', true);
                }
                else {
                    if (this.cardHasTitle) {
                        cardRow.append("div").classed(MultiRowCard.Title.class, true)
                            .each(function (d: CardData) {
                                if (d.showTitleAsImage)
                                    appendImage(d3.select(this));
                                else if (d.showTitleAsURL)
                                    d3.select(this).append('a');
                                else if (d.showTitleAsKPI)
                                    d3.select(this).append('div')
                                        .classed(MultiRowCard.KPITitle.class, true)
                                        .classed(d.title, true)
                                        .style({
                                            display: 'inline-block',
                                            verticalAlign: 'sub'
                                        });
                            });
                    }
                }

                let cardItem = cardRow
                    .selectAll(MultiRowCard.CardItemContainer.selector)
                    .data((d: CardData) => d.cardItemsData)
                    .enter()
                    .append('div')
                    .classed(MultiRowCard.CardItemContainer.class, true);

                cardItem
                    .append('div')
                    .classed(MultiRowCard.Caption.class, true)
                    .each(function (d: CardItemData) {
                        if (d.showURL) {
                            d3.select(this).append('a');
                        }
                        else if (d.showImage) {
                            appendImage(d3.select(this));
                        }
                        else if (d.showKPI) {
                            d3.select(this).append('div')
                                .classed(d.caption, true)
                                .style({
                                    display: 'inline-block',
                                    verticalAlign: 'sub'
                                });
                        }
                    });

                cardItem
                    .append('div')
                    .classed(MultiRowCard.Details.class, true);
            };

            /**
            * Row update should:
            * 1. bind Data
            * 2. Manipulate DOM (likely just updating CSS properties) affected by data
            */
            let rowUpdate = (rowSelection: D3.Selection) => {
                let style = this.getStyle();
                let dataLabelHeight = TextMeasurementService.estimateSvgTextHeight(MultiRowCard.getTextProperties(false, style.caption.fontSize));
                let categoryLabelHeight = TextMeasurementService.estimateSvgTextHeight(MultiRowCard.getTextProperties(false, style.details.fontSize));
                let titleLabelHeight = TextMeasurementService.estimateSvgTextHeight(MultiRowCard.getTextProperties(true, style.title.fontSize));
                let rowBorderStyle = this.getBorderStyles(style.row.border, style.row.padding);
                
                rowSelection
                    .style(rowBorderStyle)
                    .style({
                        'margin-bottom': isDashboardVisual ? '0px' : (this.isSingleRowCard ? '0px' : getPixelString(style.row.marginBottom)),
                        'background': style.row.background
                    });

                if (!isDashboardVisual && this.cardHasTitle) {
                    rowSelection.selectAll(MultiRowCard.Title.selector)
                        .filter((d: CardData) => !d.showTitleAsImage && !d.showTitleAsKPI)
                        .style({
                            'font-size': PixelConverter.fromPoint(style.title.fontSize),
                            'line-height': PixelConverter.toString(titleLabelHeight),
                            'color': style.title.color,
                        });

                    rowSelection.selectAll(MultiRowCard.Title.selector)
                        .filter((d: CardData) => !d.showTitleAsURL && !d.showTitleAsImage && !d.showTitleAsKPI)
                        .text((d: CardData) => d.title)
                        .attr('title', (d: CardData) => d.title);

                    rowSelection
                        .selectAll(MultiRowCard.TitleUrlSelector)
                        .text((d: CardData) => d.title)
                        .attr({
                            'href': (d: CardData) => d.title,
                            'target': '_blank',
                        });

                    rowSelection
                        .selectAll(MultiRowCard.TitleImageSelector)
                        .attr('src', (d: CardData) => d.title);
                    setImageStyle(rowSelection.selectAll(MultiRowCard.Title.selector), style.imageTitle);

                    rowSelection
                        .selectAll(MultiRowCard.KPITitle.selector)
                        .each(function (d: CardData) {
                            let element = d3.select(this);
                            element.classed(d.title);
                        });
                }
   
                let cardSelection = rowSelection.selectAll(MultiRowCard.Card.selector);
                let cardBorderStyle = this.getBorderStyles(style.card.border, style.card.padding);
                cardSelection.style(cardBorderStyle);

                cardSelection
                    .selectAll(MultiRowCard.Caption.selector)
                    .filter((d: CardItemData) => !d.showImage)
                    .style({
                        'line-height': PixelConverter.toString(dataLabelHeight),
                        'font-size': PixelConverter.fromPoint(style.caption.fontSize),
                    })
                    .filter((d: CardItemData) => !d.showKPI)
                    .style({
                        'color': style.caption.color,
                    })
                    .filter((d: CardItemData) => !d.showURL)
                    .text((d: CardItemData) => d.caption)
                    .attr('title', (d: CardItemData) => d.caption);

                cardSelection
                    .selectAll(MultiRowCard.CaptionImageSelector)
                    .attr('src', (d: CardItemData) => d.caption)
                    .style(style.imageCaption);
                    
                let cardPaddingTop = getPixelString(style.cardItemContainer.padding.top);

                cardSelection
                    .selectAll(MultiRowCard.CardItemContainer.selector)
                    .style({
                        'padding-top': (d: CardItemData) => {
                            return this.isInFirstRow(d.columnIndex) ? '':  cardPaddingTop;
                        },
                        'padding-right': (d: CardItemData) => {
                            return this.isLastRowItem(d.columnIndex, this.dataView.metadata.columns.length) ? '0px' : getPixelString(style.cardItemContainer.paddingRight);
                        },
                        'width': (d: CardItemData) => {
                            return this.getColumnWidth(d.columnIndex, this.data.dataColumnCount);
                        }
                    });

                setImageStyle(cardSelection.selectAll(MultiRowCard.Caption.selector), style.imageCaption);

                cardSelection
                    .selectAll(MultiRowCard.CaptionUrlSelector)
                    .attr({
                        'href': (d: CardItemData) => d.caption,
                        'target': '_blank',
                    })
                    .text((d: CardItemData) => d.caption);

                if (style.details.isVisible) {
                    cardSelection
                        .selectAll(MultiRowCard.Details.selector)
                        .text((d: CardItemData) => d.details)
                        .style({
                            'font-size': PixelConverter.fromPoint(style.details.fontSize),
                            'line-height': PixelConverter.toString(categoryLabelHeight),
                            'color': style.details.color
                        })
                        .attr('title', (d: CardItemData) => d.details);
                }
            };

            let rowExit = (rowSelection: D3.Selection) => {
                rowSelection.remove();
            };

            let listViewOptions: ListViewOptions = {
                rowHeight: undefined,
                enter: rowEnter,
                exit: rowExit,
                update: rowUpdate,
                loadMoreData: () => this.onLoadMoreData(),
                viewport: this.currentViewport,
                baseContainer: d3.select(this.element.get(0)),
                scrollEnabled: !this.isInteractivityOverflowHidden,
                isReadMode: () => {
                    return (this.options.host.getViewMode() !== ViewMode.Edit);
                }
            };

            this.listView = ListViewFactory.createListView(listViewOptions);
        }
        
        private getBorderStyles(border: Surround<EdgeSettings>, padding?: Surround<number>): { [property: string]: string } {
            
            let hasBorder: Surround<boolean> = {
                top: border != null && border.top != null,
                right: border != null && border.right != null,
                bottom: border != null && border.bottom != null,
                left: border != null && border.left != null
            };
            
            let hasPadding: Surround<boolean> = {
                top: padding != null && padding.top != null,
                right: padding != null && padding.right != null,
                bottom: padding != null && padding.bottom != null,
                left: padding != null && padding.left != null
            };

            return {
                'border-top': hasBorder.top ? border.top.getCSS() : '',
                'border-right': hasBorder.right ? border.right.getCSS() : '',
                'border-bottom': hasBorder.bottom ? border.bottom.getCSS() : '',
                'border-left': hasBorder.left ? border.left.getCSS() : '',
                'padding-top': hasBorder.top && hasPadding.top ? getPixelString(padding.top) : '',
                'padding-right': hasBorder.right && hasPadding.right ? getPixelString(padding.right) : '',
                'padding-bottom': hasBorder.bottom && hasPadding.bottom ? getPixelString(padding.bottom) : '',
                'padding-left': hasBorder.left && hasPadding.left ? getPixelString(padding.left) : '',
            };
        } 

        private getMaxColPerRow(): number {
            let rowWidth = this.currentViewport.width;
            let minColumnWidth = this.getStyle().cardItemContainer.minWidth;
            let columnCount = this.data.dataColumnCount;
            //atleast one column fits in a row
            let maxColumnPerRow = Math.floor(rowWidth / minColumnWidth) || 1;
            return Math.min(columnCount, maxColumnPerRow);
        }

        private getRowIndex(fieldIndex: number): number {
            return Math.floor((fieldIndex * 1.0) / this.getMaxColPerRow());
        }

        private getStyle(): MultiRowCardStyle {
            let defaultStyles = MultiRowCard.DefaultStyle;
            let customStyles = this.getCustomStyles();
            
            if (!this.isInteractivityOverflowHidden)
                return $.extend(true, {}, defaultStyles, customStyles);

            let viewportWidth = this.currentViewport.width;
            let overrideStyle: MultiRowCardStyle = {};
            for (let currentQuery of MultiRowCard.tileMediaQueries)
                if (viewportWidth <= currentQuery.maxWidth) {
                    overrideStyle = currentQuery.style;
                    break;
                }
                
            return $.extend(true, {}, defaultStyles, customStyles, overrideStyle);
        }
        
        private getSurroundSettings(outlineSettings: OutlineSettings): Surround<EdgeSettings>{
            
            let edge = new EdgeSettings(outlineSettings.weight, outlineSettings.color);
            let outlineProp = outlineSettings.outline;
                
            return {
                top: outline.showTop(outlineProp) ? edge : null,
                right: outline.showRight(outlineProp) ? edge : null,
                bottom: outline.showBottom(outlineProp) ? edge : null,
                left: outline.showLeft(outlineProp) ? edge : null,
            };
        }

        private getCustomStyles(): MultiRowCardStyle {
            let dataLabelsSettings = this.data.dataLabelsSettings;
            let categoryLabelSettings = this.data.categoryLabelsSettings;
            let titleLabelSettings = this.data.cardTitleSettings;
            let cardSettings = this.data.cardSettings;
            
            let customStyle: MultiRowCardStyle = {
                row: {
                    border: this.getSurroundSettings(cardSettings.outlineSettings),
                    marginBottom: cardSettings.cardPadding,
                    background: cardSettings.cardBackground
                },
                card: {
                    border: this.getSurroundSettings(cardSettings.barSettings)
                },
                details: {
                    fontSize: categoryLabelSettings.fontSize,
                    color: categoryLabelSettings.labelColor,
                    isVisible: categoryLabelSettings.show,
                },
                caption: {
                    fontSize: dataLabelsSettings.fontSize,
                    color: dataLabelsSettings.labelColor,
                },
                title: {
                    fontSize: titleLabelSettings.fontSize,
                    color: titleLabelSettings.labelColor,
                }
            };

            return customStyle;
        }

        private static getTextProperties(isTitle: boolean, fontSizeInPt: number): TextProperties {
            return {
                fontFamily: isTitle ? TitleFontFamily : DefaultFontFamily,
                fontSize: PixelConverter.fromPoint(fontSizeInPt),
            };
        }

        private getColumnWidth(fieldIndex: number, columnCount: number): string {
            //atleast one column fits in a row
            let maxColumnPerRow = this.getMaxColPerRow();
            if (maxColumnPerRow >= columnCount)
                //all columns fit in the same row, divide the space equaly
                return (100.0 / columnCount) + '%';

            //calculate the number of items apearing in the same row as the columnIndex
            let rowIndex = this.getRowIndex(fieldIndex);

            let totalRows = Math.ceil((columnCount * 1.0) / maxColumnPerRow);
            let lastRowCount = columnCount % maxColumnPerRow;
            if (rowIndex < totalRows || lastRowCount === 0)
                // items is not on the last row or last row contains max columns allowed per row
                return (100.0 / maxColumnPerRow) + '%';

            // items is on the last row
            return (100.0 / lastRowCount) + '%';
        }

        private isLastRowItem(fieldIndex: number, columnCount: number): boolean {
            if (fieldIndex + 1 === columnCount)
                return true;
            let maxColumnPerRow = this.getMaxColPerRow();
            if (maxColumnPerRow - (fieldIndex % maxColumnPerRow) === 1)
                return true;

            return false;
        }

        private isInFirstRow(fieldIndex: number): boolean {
            return fieldIndex < this.getMaxColPerRow();
        }

        /**
         * This contains the card column wrapping logic.
         * Determines how many columns can be shown per each row inside a Card.
         * To place the fields evenly along the card,
         * the width of each card item is calculated based on the available viewport width.
         */
        private setCardDimensions(): void {
            this.cardHasTitle = false;

            let dataModel = this.data.dataModel;

            if (!this.isInteractivityOverflowHidden && dataModel && dataModel.length > 0) {
                this.cardHasTitle = dataModel[0].title !== undefined;
                this.isSingleRowCard = dataModel.length === 1 ? true : false;
            }
        }

        private onLoadMoreData(): void {
            if (!this.waitingForData && this.dataView.metadata && this.dataView.metadata.segment) {
                this.options.host.loadMoreData();
                this.waitingForData = true;
            }
        }

        private static getDataLabelSettingsOptions(enumeration: ObjectEnumerationBuilder, labelSettings: VisualDataLabelsSettings, show: boolean = false): VisualDataLabelsSettingsOptions {
            return {
                enumeration: enumeration,
                dataLabelsSettings: labelSettings,
                show: show,
                fontSize: true,
            };
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            let enumeration = new ObjectEnumerationBuilder();

            let cardTitleSettings = this.data.cardTitleSettings;
            let dataLabelsSettings = this.data.dataLabelsSettings;
            let categoryLabelsSettings = this.data.categoryLabelsSettings;

            switch (options.objectName) {
                case 'cardTitle':
                    //display title options only if title visible
                    if (!this.isInteractivityOverflowHidden && this.cardHasTitle)
                        dataLabelUtils.enumerateDataLabels(MultiRowCard.getDataLabelSettingsOptions(enumeration, cardTitleSettings));
                    break;
                case 'dataLabels':
                    dataLabelUtils.enumerateDataLabels(MultiRowCard.getDataLabelSettingsOptions(enumeration, dataLabelsSettings));
                    break;
                case 'categoryLabels':
                    dataLabelUtils.enumerateDataLabels(MultiRowCard.getDataLabelSettingsOptions(enumeration, categoryLabelsSettings, true));
                    break;
                case multiRowCardProps.card.outline.objectName:
                    this.enumerateCard(enumeration);
                    break;
            }

            return enumeration.complete();
        }
        
        private enumerateCard(enumeration: ObjectEnumerationBuilder): void {

            let cardSettings = this.data.cardSettings;
            let propNames = multiRowCardProps.card;

            let properties: any = {};

            let outlineSettings = cardSettings.outlineSettings;
            properties[propNames.outline.propertyName] = outlineSettings.outline;

            if (outlineSettings.outline !== outline.none) {
                properties[propNames.outlineColor.propertyName] = outlineSettings.color;
                properties[propNames.outlineWeight.propertyName] = outlineSettings.weight;
            }

            let barSettings = cardSettings.barSettings;

            // The bar is shown if the outline value is not none
            let barShow = barSettings.outline !== outline.none;
            properties[propNames.barShow.propertyName] = barShow;

            if (barShow) {
                properties[propNames.barColor.propertyName] = barSettings.color;
                properties[propNames.barWeight.propertyName] = barSettings.weight;
            }

            properties[propNames.cardPadding.propertyName] = cardSettings.cardPadding;
            properties[propNames.cardBackground.propertyName] = cardSettings.cardBackground;

            enumeration.pushInstance({
                selector: null,
                objectName: propNames.outline.objectName,
                properties: properties
            });
        }
    }

    function appendImage(selection: D3.Selection): void {
        selection
            .append('div')
            .classed('imgCon', true)
            .append('img');
    }

    function setImageStyle(selection: D3.Selection, imageStyle: ImageStyle): void {
        selection
            .selectAll('.imgCon')
            .style({
                'height': getPixelString(imageStyle.maxHeight),
            })
            .selectAll('img')
            .style({
                'max-height': getPixelString(imageStyle.maxHeight),
                'max-width': getPixelString(imageStyle.maxWidth),
            });
    }

    function getPixelString(value: number): string {
        return value + "px";
    }
}