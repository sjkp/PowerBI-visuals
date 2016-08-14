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

module powerbi.visuals {
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    import createClassAndSelector = jsCommon.CssConstants.createClassAndSelector;
    import DataRoleHelper = powerbi.data.DataRoleHelper;

    export interface PointWithError {
        point: IPoint;
        upperBound: IPoint;
        lowerBound: IPoint;
    }

    export interface Forecast {
        id: string;
        points: PointWithError[];
        show: boolean;
        lineColor: Fill;
        confidenceBandStyle: string;
        transparency: number;
        style: string;
    }

    export module ForecastHelper {
        module ForecastPropertyNames {
            export const show: string = 'show';
            export const lineColor: string = 'lineColor';
            export const confidenceBandStyle: string = 'confidenceBandStyle';
            export const transparency: string = 'transparency';
            export const style: string = 'style';
        }

        const forecastObjectName = 'forecast';
        const forecastValueRole = 'forecast.ForecastValue';
        const forecastConfidenceHighBoundRole = 'forecast.ConfidenceHighBound';
        const forecastConfidenceLowBoundRole = 'forecast.ConfidenceLowBound';

        export const defaults = {
            lineColor: <Fill>{ solid: { color: '#000' } },
            confidenceBandStyle: confidenceBandStyle.fill,
            transparency: 80,
            style: lineStyle.solid
        };

        const ForecastClassSelector: ClassAndSelector = createClassAndSelector('forecast-line');
        const ForecastErrorRangeClassSelector: ClassAndSelector = createClassAndSelector('forecast-error-range');
        const ForecastLayerClassSelector: ClassAndSelector = createClassAndSelector('forecast-line-layer');

        export function enumerateObjectInstances(enumeration: ObjectEnumerationBuilder, forecast: Forecast): void {
            debug.assertValue(enumeration, 'enumeration');

            if (!forecast) {
                enumeration.pushInstance({
                    selector: {
                        id: '0'
                    },
                    properties: {
                        show: false,
                        lineColor: defaults.lineColor,
                        confidenceBandStyle: defaults.confidenceBandStyle,
                        transparency: defaults.transparency,
                        style: defaults.style
                    },
                    objectName: forecastObjectName,
                });

                return;
            }

            let properties: _.Dictionary<DataViewPropertyValue> = {
                [ForecastPropertyNames.show]: forecast.show,
                [ForecastPropertyNames.lineColor]: forecast.lineColor,
                [ForecastPropertyNames.confidenceBandStyle]: forecast.confidenceBandStyle,
                [ForecastPropertyNames.transparency]: forecast.transparency,
                [ForecastPropertyNames.style]: forecast.style,
            };

            enumeration.pushInstance({
                selector: {
                    id: forecast.id
                },
                properties: properties,
                objectName: forecastObjectName,
            });
        }

        export function isDataViewForForecast(dataView: DataView): boolean {
            if (!dataView || !dataView.categorical || !dataView.categorical.values)
                return false;

            let grouped = dataView.categorical.values.grouped();
            for (let group of grouped) {
                let hasRole = _.any(group.values, (value) => DataRoleHelper.hasRoleInValueColumn(value, 'forecast.ForecastValue'));
                if (hasRole)
                    return true;
            }

            return false;
        }

        export function readDataView(dataView: DataView, sourceDataView: DataView, colors: IDataColorPalette): Forecast {
            if (!dataView || !dataView.categorical || !sourceDataView || !sourceDataView.categorical)
                return;

            let categorical = dataView.categorical;
            if (_.isEmpty(categorical.categories) || _.isEmpty(categorical.values))
                return;

            let categories = categorical.categories[0].values;
            let groups = categorical.values.grouped();
            if (!categories || !groups)
                return;

            let valueColumnIndex = DataRoleHelper.getMeasureIndexOfRole(groups, forecastValueRole);
            let upperBoundColumnIndex = DataRoleHelper.getMeasureIndexOfRole(groups, forecastConfidenceHighBoundRole);
            let lowerBoundColumnIndex = DataRoleHelper.getMeasureIndexOfRole(groups, forecastConfidenceLowBoundRole);

            let forecastLines: Forecast[] = [];
            let forecastProperties = DataViewObjects.getUserDefinedObjects(dataView.metadata.objects, forecastObjectName);
            let groupIndex = 0;
            for (let forecastProperty of forecastProperties) {
                let forecastObjects = forecastProperty.object;
                let show = DataViewObject.getValue<boolean>(forecastObjects, ForecastPropertyNames.show, false);
                let lineColor = DataViewObject.getValue<Fill>(forecastObjects, ForecastPropertyNames.lineColor, defaults.lineColor);
                let confidenceBandStyle = DataViewObject.getValue<string>(forecastObjects, ForecastPropertyNames.confidenceBandStyle, defaults.confidenceBandStyle);
                let transparency = DataViewObject.getValue<number>(forecastObjects, ForecastPropertyNames.transparency, defaults.transparency);
                let style = DataViewObject.getValue<string>(forecastObjects, ForecastPropertyNames.style, defaults.style);
                let colorHelper = new ColorHelper(colors, { objectName: 'dataPoint', propertyName: 'fill' }, defaults.lineColor.solid.color);

                let group = groups[groupIndex];

                let points: PointWithError[] = [];
                let values = group.values[valueColumnIndex].highlights ? group.values[valueColumnIndex].highlights : group.values[valueColumnIndex].values;
                let upperBoundValues = group.values[upperBoundColumnIndex].highlights ? group.values[upperBoundColumnIndex].highlights : group.values[upperBoundColumnIndex].values;
                let lowerBoundValues = group.values[lowerBoundColumnIndex].highlights ? group.values[lowerBoundColumnIndex].highlights : group.values[lowerBoundColumnIndex].values;
                for (let i = 0; i < categories.length; i++) {
                    let x = AxisHelper.normalizeNonFiniteNumber(categories[i]);
                    let y = AxisHelper.normalizeNonFiniteNumber(values[i]);

                    if (x != null && y != null) {
                        let upperBoundY = AxisHelper.normalizeNonFiniteNumber(upperBoundValues[i]);
                        let lowerBoundY = AxisHelper.normalizeNonFiniteNumber(lowerBoundValues[i]);

                        points.push({
                            point: { x: x, y: y },
                            upperBound: { x: x, y: upperBoundY },
                            lowerBound: { x: x, y: lowerBoundY },
                        });
                    }
                }

                let seriesLineColor: Fill;
                if (lineColor) {
                    seriesLineColor = lineColor;
                }
                else {
                    if (sourceDataView.categorical.values.source) {
                        // Dynamic series
                        let sourceGroups = sourceDataView.categorical.values.grouped();
                        let color = colorHelper.getColorForSeriesValue(sourceGroups[groupIndex].objects, sourceDataView.categorical.values.identityFields, group.name);
                        seriesLineColor = { solid: { color: color } };
                    }
                    else {
                        // Static series
                        let matchingMeasure = sourceDataView.categorical.values[groupIndex];
                        let color = colorHelper.getColorForMeasure(matchingMeasure.source.objects, group.name);
                        seriesLineColor = { solid: { color: color } };
                    }
                }

                forecastLines.push({
                    id: forecastProperty.id,
                    points: points,
                    show: show,
                    lineColor: seriesLineColor,
                    confidenceBandStyle: confidenceBandStyle,
                    transparency: transparency,
                    style: style
                });

                groupIndex++;
            }
            
            return forecastLines[0];
        }

        export function render(forecastLine: Forecast, graphicsContext: D3.Selection, axes: CartesianAxisProperties, viewport: IViewport, animator: IGenericAnimator, suppressAnimations: boolean): void {
            let duration = AnimatorCommon.GetAnimationDuration(animator, suppressAnimations);
            let layer = graphicsContext.select(ForecastLayerClassSelector.selector);
            if (layer.empty()) {
                layer = graphicsContext.insert('svg', ':first-child').classed(ForecastLayerClassSelector.class, true);
            }

            layer.attr({
                height: viewport.height,
                width: viewport.width
            });

            let errorRange = layer.selectAll(ForecastErrorRangeClassSelector.selector).data(forecastLine ? [forecastLine] : []);
            errorRange.enter().insert('path', ':first-child').classed(ForecastErrorRangeClassSelector.class, true);

            errorRange
                .transition()
                .ease('linear')
                .duration(duration)
                .attr('d', (d: Forecast) => {
                    let xScale = axes.x.scale;
                    let yScale = axes.y1.scale;

                    let pathGen = d3.svg.area()
                        .x((point: PointWithError) => xScale(point.upperBound.x))
                        .y0((point: PointWithError) => yScale(point.upperBound.y))
                        .y1((point: PointWithError) => yScale(point.lowerBound.y));

                    return pathGen(d.points);
                });

            errorRange.each(function (d: Forecast) {
                let errorRangeArea = d3.select(this);
                let style: any = {};

                let opacity = (100 - d.transparency) / 100;
                style['fill-opacity'] = opacity;
                style['stroke-opacity'] = opacity;

                if (d.confidenceBandStyle === confidenceBandStyle.fill) {
                    style['stroke'] = 'transparent';
                    style['fill'] = d.lineColor.solid.color;
                }
                else if (d.confidenceBandStyle === confidenceBandStyle.line) {
                    style['stroke'] = d.lineColor.solid.color;
                    style['fill'] = 'transparent';
                }
                else if (d.confidenceBandStyle === confidenceBandStyle.none) {
                    style['stroke'] = 'transparent';
                    style['fill'] = 'transparent';
                }

                errorRangeArea.style(style);
            });

            errorRange.exit().remove();

            let lines = layer.selectAll(ForecastClassSelector.selector).data(forecastLine ? [forecastLine] : []);
            lines.enter().append('path').classed(ForecastClassSelector.class, true);

            lines
                .transition()
                .ease('linear')
                .duration(duration)
                .attr('d', (d: Forecast) => {
                    let xScale = axes.x.scale;
                    let yScale = axes.y1.scale;

                    let pathGen = d3.svg.line()
                        .x((point: PointWithError) => xScale(point.point.x))
                        .y((point: PointWithError) => yScale(point.point.y));

                    return pathGen(_.filter(d.points, (point) => point.point.x != null && point.point.y != null));
                });

            lines.each(function (d: Forecast) {
                let line = d3.select(this);
                let style: any = {};

                style['stroke'] = d.lineColor.solid.color;
                style['fill'] = 'transparent';

                if (d.style === lineStyle.dashed) {
                    style['stroke-dasharray'] = '5, 5';
                }
                else if (d.style === lineStyle.dotted) {
                    style['stroke-dasharray'] = '1, 5';
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
