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
    import PixelConverter = jsCommon.PixelConverter;
    import SQExpr = powerbi.data.SQExpr;
    import SQExprBuilder = powerbi.data.SQExprBuilder;
    import SemanticFilter = powerbi.data.SemanticFilter;

    /** Utility class for slicer*/
    export module SlicerUtil {
        /** CSS selectors for slicer elements. */
        export module Selectors {
            import createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;

            export const HeaderContainer = createClassAndSelector('headerContainer');
            export const Header = createClassAndSelector('slicerHeader');
            export const TitleHeader = createClassAndSelector('titleHeader');
            export const HeaderText = createClassAndSelector('headerText');
            export const Body = createClassAndSelector('slicerBody');
            export const Label = createClassAndSelector('slicerLabel');
            export const LabelText = createClassAndSelector('slicerText');
            export const LabelImage = createClassAndSelector('slicerImage');
            export const CountText = createClassAndSelector('slicerCountText');
            export const Clear = createClassAndSelector('clear');
            export const SearchHeader = createClassAndSelector('searchHeader');
            export const SearchInput = createClassAndSelector('searchInput');
            export const SearchHeaderCollapsed = createClassAndSelector('collapsed');
            export const SearchHeaderShow = createClassAndSelector('show');
            export const MultiSelectEnabled = createClassAndSelector('isMultiSelectEnabled');
        }

        /** Const declarations*/
        export module DisplayNameKeys {
            export const Clear = 'Slicer_Clear';
            export const SelectAll = 'Slicer_SelectAll';
            export const Search = 'SearchBox_Text';
        }

        /** Helper class for slicer settings  */
        export module SettingsHelper {
            export function areSettingsDefined(data: SlicerData): boolean {
                return data != null && data.slicerSettings != null;
            }
        }

        /** Helper class for handling slicer default value  */
        export module DefaultValueHandler {
            export function getIdentityFields(dataView: DataView): SQExpr[] {
                if (!dataView)
                    return;

                let dataViewCategorical = dataView.categorical;
                if (!dataViewCategorical || _.isEmpty(dataViewCategorical.categories))
                    return;

                return <SQExpr[]>dataViewCategorical.categories[0].identityFields;
            }
        }

        export function getContainsFilter(expr: SQExpr, containsText: string): SemanticFilter {
            let containsTextExpr = SQExprBuilder.text(containsText);
            let filterExpr = SQExprBuilder.contains(expr, containsTextExpr);
            return SemanticFilter.fromSQExpr(filterExpr);
        }

        // Compare the sqExpr of the scopeId with sqExprs of the retained values. 
        // If match found, remove the item from the retainedValues list, and return true, 
        // otherwise return false.
        export function tryRemoveValueFromRetainedList(value: DataViewScopeIdentity, selectedScopeIds: DataViewScopeIdentity[], caseInsensitive?: boolean): boolean {
            if (!value || _.isEmpty(selectedScopeIds))
                return false;

            for (let i = 0, len = selectedScopeIds.length; i < len; i++) {
                let retainedValueScopeId = selectedScopeIds[i];
                if (DataViewScopeIdentity.equals(value, retainedValueScopeId, caseInsensitive)) {
                    selectedScopeIds.splice(i, 1);
                    return true;
                }
            }

            return false;
        }

        export function getUpdatedSelfFilter(searchKey: string, metaData: DataViewMetadata): data.SemanticFilter {
            if (!metaData || _.isEmpty(searchKey))
                return;

            debug.assert(_.size(metaData.columns) === 1, 'slicer should not have more than one column based on the capability');
            let column = _.first(metaData.columns);
            if (column && column.expr)
                return SlicerUtil.getContainsFilter(<SQExpr>column.expr, searchKey);
        }

        /** Helper class for creating and measuring slicer DOM elements  */
        export class DOMHelper {
            private static SearchInputHeight = 20;

            public createSlicerHeader(hostServices: IVisualHostServices): HTMLElement {
                let slicerHeaderDiv = document.createElement('div');
                slicerHeaderDiv.className = Selectors.Header.class;

                let slicerHeader: D3.Selection = d3.select(slicerHeaderDiv);
                let slicerTitle = slicerHeader.append('h2')
                    .classed(Selectors.TitleHeader.class, true);
                slicerTitle.append('span')
                    .classed(Selectors.Clear.class, true)
                    .attr('title', hostServices.getLocalizedString(DisplayNameKeys.Clear));
                slicerTitle.append('div').classed(Selectors.HeaderText.class, true);
                let slicerSearch = slicerHeader.append('div')
                    .classed(Selectors.SearchHeader.class, true)
                    .classed(Selectors.SearchHeaderCollapsed.class, true);
                slicerSearch.append('span')
                    .classed('powervisuals-glyph search', true)
                    .attr('title', hostServices.getLocalizedString(DisplayNameKeys.Search));

                slicerSearch.append('input')
                    .attr('type', 'text')
                    .classed(Selectors.SearchInput.class, true)
                    .attr('drag-resize-disabled', 'true');
                
                return slicerHeaderDiv;
            }

            public getHeaderTextProperties(settings: SlicerSettings): TextProperties {
                let headerTextProperties: TextProperties = {
                    fontFamily: Font.Family.regular.css,
                    fontSize: '10px'
                };
                if (settings.header.show) {
                    headerTextProperties.fontSize = PixelConverter.fromPoint(settings.header.textSize);
                }
                return headerTextProperties;
            }

            public getSlicerBodyViewport(currentViewport: IViewport, settings: SlicerSettings, headerTextProperties: TextProperties): IViewport {
                let headerHeight = (settings.header.show) ? this.getHeaderHeight(settings, headerTextProperties) : 0;
                let searchHeaderHight = settings.search.enabled ? DOMHelper.SearchInputHeight : 0;
                let slicerBodyHeight = currentViewport.height - (headerHeight + settings.header.borderBottomWidth + searchHeaderHight);
                return {
                    height: slicerBodyHeight,
                    width: currentViewport.width
                };
            }

            // TODO: Slicer body height and width update should be done through less file
            public updateSlicerBodyDimensions(currentViewport: IViewport, slicerBody: D3.Selection, settings: SlicerSettings): void {
                let slicerViewport = this.getSlicerBodyViewport(currentViewport, settings, this.getHeaderTextProperties(settings));
                slicerBody.style({
                    'height': PixelConverter.toString(slicerViewport.height),
                    'width': PixelConverter.toString(slicerViewport.width),
                });
            }

            public getHeaderHeight(settings: SlicerSettings, textProperties: TextProperties): number {
                return TextMeasurementService.estimateSvgTextHeight(this.getTextProperties(settings.header.textSize, textProperties)) + settings.general.outlineWeight;
            }

            public getRowHeight(settings: SlicerSettings, textProperties: TextProperties): number {
                return TextMeasurementService.estimateSvgTextHeight(this.getTextProperties(settings.slicerText.textSize, textProperties)) + this.getRowsOutlineWidth(settings.slicerText.outline, settings.general.outlineWeight);
            }

            public styleSlicerHeader(slicerHeader: D3.Selection, settings: SlicerSettings, headerText: string): void {
                let titleHeader = slicerHeader.select(SlicerUtil.Selectors.TitleHeader.selector);
                let searchHeader = slicerHeader.select(SlicerUtil.Selectors.SearchHeader.selector);
                if (settings.header.show) {
                    titleHeader.style('display', 'block');
                    let headerTextElement = slicerHeader.select(Selectors.HeaderText.selector)
                        .text(headerText);
                    this.setSlicerHeaderTextStyle(titleHeader, headerTextElement, settings, settings.search.enabled);
                } else {
                    titleHeader.style('display', 'none');
                }

                if (settings.search.enabled) {
                    searchHeader.classed(Selectors.SearchHeaderShow.class, true);
                    searchHeader.classed(Selectors.SearchHeaderCollapsed.class, false);
                } else {
                    searchHeader.classed(Selectors.SearchHeaderShow.class, false);
                    searchHeader.classed(Selectors.SearchHeaderCollapsed.class, true);
                }
            }

            public setSlicerTextStyle(slicerText: D3.Selection, settings: SlicerSettings): void {
                slicerText
                    .style({
                        'color': settings.slicerText.color,
                        'background-color': settings.slicerText.background,
                        'border-style': 'solid',
                        'border-color': settings.general.outlineColor,
                        'border-width': VisualBorderUtil.getBorderWidth(settings.slicerText.outline, settings.general.outlineWeight),
                        'font-size': PixelConverter.fromPoint(settings.slicerText.textSize),
                         // Makes height consistent between browsers. 1.79 was found by aproximating current chrome line-height: normal calculation.
                        "line-height": Math.floor(1.79 * settings.slicerText.textSize) + "px"
                    });
            }

            public getRowsOutlineWidth(outlineElement: string, outlineWeight: number): number {
                switch (outlineElement) {
                    case outline.none:
                    case outline.leftRight:
                        return 0;
                    case outline.bottomOnly:
                    case outline.topOnly:
                        return outlineWeight;
                    case outline.topBottom:
                    case outline.frame:
                        return outlineWeight * 2;
                    default:
                        return 0;
                }
            }

            private setSlicerHeaderTextStyle(slicerHeader: D3.Selection, headerTextElement: D3.Selection, settings: SlicerSettings, searchEnabled: boolean): void {
                let hideOutline = false;

                // When search is enabled, we will hide the default outline if the outline properties haven't been customized by user.
                if (searchEnabled) {
                    let defaultSetting = Slicer.DefaultStyleProperties();
                    hideOutline = (settings.header.outline === defaultSetting.header.outline
                        && settings.general.outlineWeight === defaultSetting.general.outlineWeight
                        && settings.general.outlineColor === defaultSetting.general.outlineColor);
                }

                slicerHeader
                    .style({
                        'border-style': hideOutline ? 'none': 'solid',
                        'border-color': settings.general.outlineColor,
                        'border-width': VisualBorderUtil.getBorderWidth(settings.header.outline, settings.general.outlineWeight),
                    });

                headerTextElement
                    .style({
                        'color': settings.header.fontColor,
                        'background-color': settings.header.background,
                        'font-size': PixelConverter.fromPoint(settings.header.textSize),
                    });
            }

            private getTextProperties(textSize: number, textProperties: TextProperties): TextProperties {
                textProperties.fontSize = PixelConverter.fromPoint(textSize);
                return textProperties;
            }
        }
    }
}