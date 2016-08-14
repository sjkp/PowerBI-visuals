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
    import Color = jsCommon.Color;
    import DataRoleHelper = powerbi.data.DataRoleHelper;

    export interface TrendLine {
        points: IPoint[];
        show: boolean;
        displayName: string;
        lineColor: Fill;
        transparency: number;
        style: string;
        combineSeries: boolean;
        useHighlightValues: boolean;
        y2Axis: boolean;
    }

    export module TrendLineHelper {
        module TrendLinePropertyNames {
            export const show: string = 'show';
            export const displayName: string = 'displayName';
            export const lineColor: string = 'lineColor';
            export const transparency: string = 'transparency';
            export const style: string = 'style';
            export const combineSeries: string = 'combineSeries';
            export const useHighlightValues: string = 'useHighlightValues';
        }

        const trendObjectName = 'trend';

        export const defaults = {
            lineColor: <Fill>{ solid: { color: '#000' } },
            lineStyle: lineStyle.dashed,
            transparency: 0,
            combineSeries: true,
            useHighlightValues: true,
        };
        const TrendLineClassSelector: jsCommon.CssConstants.ClassAndSelector = jsCommon.CssConstants.createClassAndSelector('trend-line');
        const TrendLineLayerClassSelector: jsCommon.CssConstants.ClassAndSelector = jsCommon.CssConstants.createClassAndSelector('trend-line-layer');

        export function enumerateObjectInstances(enumeration: ObjectEnumerationBuilder, trendLines: TrendLine[]): void {
            debug.assertValue(enumeration, 'enumeration');

            if (_.isEmpty(trendLines)) {
                enumeration.pushInstance({
                    selector: null,
                    properties: {
                        show: false,
                        lineColor: defaults.lineColor,
                        transparency: defaults.transparency,
                        style: defaults.lineStyle,
                        combineSeries: defaults.combineSeries,
                    },
                    objectName: trendObjectName,
                });

                return;
            }

            let trendLine = trendLines[0];
            let properties: { [propertyName: string]: DataViewPropertyValue } = {};
            properties['show'] = trendLine.show;
            properties['displayName'] = trendLine.displayName;

            if (trendLine.combineSeries)
                properties['lineColor'] = trendLine.lineColor;

            properties['transparency'] = trendLine.transparency;
            properties['style'] = trendLine.style;
            properties['combineSeries'] = trendLine.combineSeries;
            properties['useHighlightValues'] = trendLine.useHighlightValues;

            enumeration.pushInstance({
                selector: null,
                properties: properties,
                objectName: trendObjectName,
            });
        }

        export function isDataViewForRegression(dataView: DataView): boolean {
            return DataRoleHelper.hasRoleInDataView(dataView, 'regression.X');
        }

        export function readDataView(dataView: DataView, sourceDataView: DataView, y2: boolean, colors: IDataColorPalette): TrendLine[] {
            if (!dataView || !dataView.categorical)
                return;

            let categorical = dataView.categorical;
            if (_.isEmpty(categorical.categories) || _.isEmpty(categorical.values))
                return;

            let categories = categorical.categories[0].values;
            let groups = categorical.values.grouped();
            if (!categories || !groups)
                return;

            let trendProperties = DataViewObjects.getObject(dataView.metadata.objects, trendObjectName, {});
            let show = DataViewObject.getValue<boolean>(trendProperties, TrendLinePropertyNames.show, false);
            let displayName = DataViewObject.getValue<string>(trendProperties, TrendLinePropertyNames.displayName);
            let lineColor = DataViewObject.getValue<Fill>(trendProperties, TrendLinePropertyNames.lineColor);
            let transparency = DataViewObject.getValue<number>(trendProperties, TrendLinePropertyNames.transparency, defaults.transparency);
            let style = DataViewObject.getValue<string>(trendProperties, TrendLinePropertyNames.style, defaults.lineStyle);
            let combineSeries = DataViewObject.getValue<boolean>(trendProperties, TrendLinePropertyNames.combineSeries, defaults.combineSeries);
            let useHighlightValues = DataViewObject.getValue<boolean>(trendProperties, TrendLinePropertyNames.useHighlightValues, defaults.useHighlightValues);

            // Trend lines generated by Insights will be putting line color here, we should convert the Insights code to create
            // "trend" objects like above and write the upgrade code to handle pinned tiles with trend lines before removing any feature switch.
            let legacyColor = DataViewObjects.getValue<Fill>(categorical.values[0].source.objects, lineChartProps.dataPoint.fill);
            if (legacyColor)
                lineColor = legacyColor;

            let objects = sourceDataView.metadata.objects;
            let defaultColor = DataViewObjects.getFillColor(objects, { objectName: 'dataPoint', propertyName: 'defaultColor' });
            let colorHelper = new ColorHelper(colors, { objectName: 'dataPoint', propertyName: 'fill' }, defaultColor);

            let trendLines: TrendLine[] = [];
            for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
                let group = groups[groupIndex];

                let points: IPoint[] = [];
                for (let i = 0; i < categories.length; i++) {
                    let x = AxisHelper.normalizeNonFiniteNumber(categories[i]);

                    // There is a assumption here that the group only has 1 set of values in it. Once we add more things like confidence bands,
                    // this assumption will not be true. This assumption comes from the way dataViewRegresion generates the dataView
                    let valueColumn = group.values[0];

                    let values: any[];
                    if (useHighlightValues && valueColumn.highlights) {
                        values = valueColumn.highlights;
                    }
                    else {
                        values = valueColumn.values;
                    }
                    let y = AxisHelper.normalizeNonFiniteNumber(values[i]);

                    if (x != null && y != null) {
                        points.push({
                            x: x,
                            y: y,
                        });
                    }
                }

                let seriesLineColor: Fill;
                if (combineSeries) {
                    seriesLineColor = lineColor || defaults.lineColor;
                }
                else {
                    // TODO: This should likely be delegated to the layer which knows how to choose the correct color for any given situation.
                    if (sourceDataView.categorical.values.source) {
                        // Dynamic series
                        let sourceGroups = sourceDataView.categorical.values.grouped();
                        let color = colorHelper.getColorForSeriesValue(sourceGroups[groupIndex].objects, sourceDataView.categorical.values.identityFields, group.name);
                        color = darkenTrendLineColor(color);
                        seriesLineColor = { solid: { color: color } };
                    }
                    else {
                        // Static series
                        let matchingMeasure = sourceDataView.categorical.values[groupIndex];
                        let color = colorHelper.getColorForMeasure(matchingMeasure.source.objects, group.name);
                        color = darkenTrendLineColor(color);
                        seriesLineColor = { solid: { color: color } };
                    }
                }

                trendLines.push({
                    points: points,
                    show: show,
                    displayName: displayName,
                    lineColor: seriesLineColor,
                    transparency: transparency,
                    style: style,
                    combineSeries: combineSeries,
                    useHighlightValues: useHighlightValues,
                    y2Axis: y2,
                });
            }
            return trendLines;
        }

        export function darkenTrendLineColor(color: string): string {
            let rgb = Color.parseColorString(color);
            rgb = Color.darken(rgb, 20);
            return Color.rgbString(rgb);
        }

        export function render(trendLines: TrendLine[], graphicsContext: D3.Selection, axes: CartesianAxisProperties, viewport: IViewport): void {
            let layer = graphicsContext.select(TrendLineLayerClassSelector.selector);
            if (layer.empty()) {
                layer = graphicsContext.append('svg').classed(TrendLineLayerClassSelector.class, true);
            }

            layer.attr({
                height: viewport.height,
                width: viewport.width
            });

            let lines = layer.selectAll(TrendLineClassSelector.selector).data(trendLines || []);
            lines.enter().append('path').classed(TrendLineClassSelector.class, true);

            lines
                .attr('d', (d: TrendLine) => {
                    let xScale = axes.x.scale;
                    let yScale = (d.y2Axis && axes.y2) ? axes.y2.scale : axes.y1.scale;

                    let pathGen = d3.svg.line()
                        .x((point: IPoint) => xScale(point.x))
                        .y((point: IPoint) => yScale(point.y));

                    return pathGen(_.filter(d.points, (point) => point.x != null && point.y != null));
                });

            lines.each(function (d: TrendLine) {
                let line = d3.select(this);
                let style: any = {};

                style.stroke = d.lineColor.solid.color;

                if (d.transparency != null) {
                    style['stroke-opacity'] = (100 - d.transparency) / 100;
                }

                if (d.style === lineStyle.dashed) {
                    style['stroke-dasharray'] = "5, 5";
                }
                else if (d.style === lineStyle.dotted) {
                    style['stroke-dasharray'] = "1, 5";
                    style['stroke-linecap'] = "round";
                }
                else if (d.style === lineStyle.solid) {
                    style['stroke-dasharray'] = null;
                    style['stroke-linecap'] = null;
                }

                line.style(style);
            });

            lines.exit().remove();
        }
    }
}
