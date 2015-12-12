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

    /** Utility class for slicer*/
    export module SlicerUtil {
        /** CSS selectors for slicer elements. */
        export module Selectors {
            import createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;

            export const HeaderContainer = createClassAndSelector('headerContainer');
            export const Header = createClassAndSelector('slicerHeader');
            export const HeaderText = createClassAndSelector('headerText');
            export const Body = createClassAndSelector('slicerBody');
            export const LabelText = createClassAndSelector('slicerText');
            export const Clear = createClassAndSelector('clear');
            export const MultiSelectEnabled = createClassAndSelector('isMultiSelectEnabled');
        }

        /** Const declarations*/
        export module DisplayNameKeys {
            export const Clear = 'Slicer_Clear';
            export const SelectAll = 'Slicer_SelectAll';
        }

        /** Helper class for creating and measuring slicer DOM elements  */
        export module DOMHelper {
            export function createSlicerHeader(hostServices: IVisualHostServices): HTMLElement {
                let slicerHeaderDiv = document.createElement('div');
                slicerHeaderDiv.className = Selectors.Header.class;

                let slicerHeader: D3.Selection = d3.select(slicerHeaderDiv);
                slicerHeader.append('span')
                    .classed(Selectors.Clear.class, true)
                    .attr('title', hostServices.getLocalizedString(DisplayNameKeys.Clear));
                slicerHeader.append('div').classed(Selectors.HeaderText.class, true);

                return slicerHeaderDiv;
            }

            export function getHeaderTextProperties(settings: SlicerSettings): TextProperties {
                let headerTextProperties: TextProperties = {
                    fontFamily: 'wf_segoe-ui_normal',
                    fontSize: '10px'
                };
                if (settings.header.show) {
                    headerTextProperties.fontSize = PixelConverter.fromPoint(settings.header.textSize);
                }
                return headerTextProperties;
            }

            export function getSlicerBodyViewport(currentViewport: IViewport, settings: SlicerSettings, headerTextProperties: TextProperties): IViewport {
                let headerHeight = (settings.header.show) ? getHeaderHeight(settings, headerTextProperties) : 0;
                let slicerBodyHeight = currentViewport.height - (headerHeight + settings.header.borderBottomWidth);
                return {
                    height: slicerBodyHeight,
                    width: currentViewport.width
                };
            }

            export function updateSlicerBodyDimensions(currentViewport: IViewport, slicerBody: D3.Selection, settings: SlicerSettings): void {
                let slicerViewport = getSlicerBodyViewport(currentViewport, settings, getHeaderTextProperties(settings));
                slicerBody.style({
                    'height': PixelConverter.toString(slicerViewport.height),
                    'width': PixelConverter.toString(slicerViewport.width),
                });
            }

            export function getHeaderHeight(settings: SlicerSettings, textProperties: TextProperties): number {
                return TextMeasurementService.estimateSvgTextHeight(getTextProperties(settings.header.textSize, textProperties)) + settings.general.outlineWeight;
            }

            export function getRowHeight(settings: SlicerSettings, textProperties: TextProperties): number {
                return TextMeasurementService.estimateSvgTextHeight(getTextProperties(settings.slicerText.textSize, textProperties)) + getRowsOutlineWidth(settings.slicerText.outline, settings.general.outlineWeight);
            }

            export function styleSlicerHeader(slicerHeader: D3.Selection, settings: SlicerSettings, headerText: string): void {
                if (settings.header.show) {
                    slicerHeader.style('display', 'block');
                    let headerTextElement = slicerHeader.select(Selectors.HeaderText.selector)
                        .text(headerText);
                    setSlicerHeaderTextStyle(headerTextElement, settings);
                }
                else {
                    slicerHeader.style('display', 'none');
                }
            }

            export function setSlicerTextStyle(slicerText: D3.Selection, settings: SlicerSettings): void {
                slicerText
                    .style({
                        'color': settings.slicerText.color,
                        'background-color': settings.slicerText.background,
                        'border-style': getBorderStyle(settings.slicerText.outline),
                        'border-color': settings.general.outlineColor,
                        'border-width': getBorderWidth(settings.slicerText.outline, settings.general.outlineWeight),
                        'font-size': PixelConverter.fromPoint(settings.slicerText.textSize),
                    });
            }

            export function getBorderStyle(outlineElement: string): string {
                return outlineElement === '0px' ? 'none' : 'solid';
            }

            export function getBorderWidth(outlineElement: string, outlineWeight: number): string {
                switch (outlineElement) {
                    case 'None':
                        return '0px';
                    case 'BottomOnly':
                        return '0px 0px ' + outlineWeight + 'px 0px';
                    case 'TopOnly':
                        return outlineWeight + 'px 0px 0px 0px';
                    case 'TopBottom':
                        return outlineWeight + 'px 0px ' + outlineWeight + 'px 0px';
                    case 'LeftRight':
                        return '0px ' + outlineWeight + 'px 0px ' + outlineWeight + 'px';
                    case 'Frame':
                        return outlineWeight + 'px';
                    default:
                        return outlineElement.replace("1", outlineWeight.toString());
                }
            }

            export function getRowsOutlineWidth(outlineElement: string, outlineWeight: number): number {
                switch (outlineElement) {
                    case 'None':
                    case 'LeftRight':
                        return 0;
                    case 'BottomOnly':
                    case 'TopOnly':
                        return outlineWeight;
                    case 'TopBottom':
                    case 'Frame':
                        return outlineWeight * 2;
                    default:
                        return 0;
                }
            }

            function setSlicerHeaderTextStyle(slicerHeader: D3.Selection, settings: SlicerSettings): void {
                slicerHeader
                    .style({
                        'border-style': getBorderStyle(settings.header.outline),
                        'border-color': settings.general.outlineColor,
                        'border-width': getBorderWidth(settings.header.outline, settings.general.outlineWeight),
                        'color': settings.header.fontColor,
                        'background-color': settings.header.background,
                        'font-size': PixelConverter.fromPoint(settings.header.textSize),
                    });
            }

            function getTextProperties(textSize: number, textProperties: TextProperties): TextProperties {
                textProperties.fontSize = PixelConverter.fromPoint(textSize);
                return textProperties;
            }
        }

        /** Helper class for slicer settings  */
        export module SettingsHelper {
            export function areSettingsDefined(data: SlicerData): boolean {
                return data != null && data.slicerSettings != null;
            }
        }
    }
}
