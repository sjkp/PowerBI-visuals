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

    export module KpiUtil {

        export const enum KpiImageSize {
            Small,
            Big,
        }

        export interface KpiImageMetadata {
            statusGraphic: string;
            caption: string;
            class: string;
        }

        export interface KPIGraphicClass {
            kpiIconClass: string;
            statusValues: string[];
        }

        const KPIImageClassName = 'powervisuals-glyph';
        const BigImageClassName = 'big-kpi';
        const RYGStatusIconClassNames = ['kpi-red', 'kpi-yellow', 'kpi-green'];

        const threeLights = {
                kpiIconClass: 'circle',
                statusValues: RYGStatusIconClassNames,
        };

        const roadSigns = {
                kpiIconClass: '',
                statusValues: ['circle-x kpi-red', 'circle-exclamation kpi-yellow', 'circle-checkmark kpi-green'],
        };

        const trafficLight = {
                kpiIconClass: 'traffic-light',
                statusValues: RYGStatusIconClassNames,
        };

        const shapes = {
            kpiIconClass: '',
            statusValues: ['rhombus kpi-red', 'triangle kpi-yellow', 'circle kpi-green'],
        };

        const gauge = {
            kpiIconClass: '',
            statusValues: ['circle-empty', 'circle-one-quarter', 'circle-half', 'circle-three-quarters', 'circle-full'],
        };

        const statusGraphicFormatStrings = {
            'THREE CIRCLES COLORED': threeLights,
            'TRAFFIC LIGHT - SINGLE': threeLights,

            'THREE FLAGS COLORED': {
                kpiIconClass: 'flag',
                statusValues: RYGStatusIconClassNames,
            },

            'ROAD SIGNS': roadSigns,
            'THREE SYMBOLS CIRCLED COLORED': roadSigns,

            'TRAFFIC LIGHT': trafficLight,
            'THREE TRAFFIC LIGHTS RIMMED COLORED': trafficLight,

            'THREE SYMBOLS UNCIRCLED COLORED': {
                kpiIconClass: '',
                statusValues: ['x kpi-red', 'exclamation kpi-yellow', 'checkmark kpi-green'],
            },

            'SHAPES': shapes,
            'SMILEY FACE': shapes,
            'THERMOMETER': shapes,
            'CYLINDER': shapes,
            'THREE SIGNS COLORED': shapes,

            'THREE STARS COLORED': {
                kpiIconClass: 'star-stacked',
                statusValues: ['star-empty', 'star-half-full', 'star-full'],
            },
            'FIVE BARS COLORED': {
                kpiIconClass: 'bars-stacked',
                statusValues: ['bars-zero', 'bars-one', 'bars-two', 'bars-three', 'bars-four'],
            },
            'FIVE BOXES COLORED': {
                kpiIconClass: 'boxes-stacked',
                statusValues: ['boxes-zero', 'boxes-one', 'boxes-two', 'boxes-three', 'boxes-four'],
            },

            'FIVE QUARTERS COLORED': gauge,
            'GAUGE - ASCENDING': gauge,
            'GAUGE - DESCENDING': {
                kpiIconClass: '',
                statusValues: ['circle-full', 'circle-three-quarters', 'circle-half', 'circle-one-quarter', 'circle-empty'],
            },

            'STANDARD ARROW': {
                kpiIconClass: '',
                statusValues: ['arrow-down', 'arrow-right-down', 'arrow-right', 'arrow-right-up', 'arrow-up'],
            },

            'VARIANCE ARROW': {
                kpiIconClass: '',
                statusValues: ['arrow-down kpi-red', 'arrow-right kpi-yellow', 'arrow-up kpi-green'],
            },

            'STATUS ARROW - ASCENDING': {
                kpiIconClass: '',
                statusValues: ['arrow-down kpi-red', 'arrow-right-down kpi-yellow', 'arrow-right kpi-yellow', 'arrow-right-up kpi-yellow', 'arrow-up kpi-green'],
            },
            'STATUS ARROW - DESCENDING': {
                kpiIconClass: '',
                statusValues: ['arrow-up kpi-green', 'arrow-right-up kpi-yellow', 'arrow-right kpi-yellow', 'arrow-right-down kpi-yellow', 'arrow-down kpi-red'],
            },
        };

        function getKpiIcon(kpi: DataViewKpiColumnMetadata, value: string): string {
            let numValue = parseFloat(value);

            if (!kpi)
                return;

            let statusGraphicFormat = statusGraphicFormatStrings[kpi.graphic.toUpperCase()];

            if (!statusGraphicFormat || isNaN(numValue))
                return undefined;

            let statusValues = statusGraphicFormat.statusValues;

            // Normalize range of (-1, -0.5, 0, 0.5, 1) to (-2, -1, 0, 1, 2)
            if (kpi.normalizedFiveStateKpiRange && statusValues.length === 5)
                numValue = numValue * 2;

            // Convert values from the range of (-n/2, ..., 0, ..., n/2) to (0, 1, ..., n-1)
            let num = numValue + Math.floor(statusValues.length / 2);

            return [statusGraphicFormat.kpiIconClass, statusValues[num]].join(' ').trim();
        }

        function getKpiIconClassName(kpiIcon: string, kpiImageSize?: KpiImageSize): string {
            if (!kpiIcon)
                return undefined;

            if (kpiImageSize === KpiImageSize.Big)
                return [KPIImageClassName, BigImageClassName, kpiIcon].join(' ');
            else
                return [KPIImageClassName, kpiIcon].join(' ');
        }

        export function getClassForKpi(kpi: DataViewKpiColumnMetadata, value: string, kpiImageSize?: KpiImageSize): string {
            debug.assertValue(kpi, 'kpi');
            debug.assertValue(value, 'value');

            let kpiIcon: string = getKpiIcon(kpi, value);
            return getKpiIconClassName(kpiIcon, kpiImageSize);
        }

        export function getKpiImageMetadata(metaDataColumn: DataViewMetadataColumn, value: string, kpiImageSize?: KpiImageSize): KpiImageMetadata {
            let kpi: DataViewKpiColumnMetadata = metaDataColumn && metaDataColumn.kpi;

            if (kpi) {
                let kpiIcon = getKpiIcon(kpi, value);
                if (kpiIcon) {
                    return {
                        caption: kpiIcon,
                        statusGraphic: kpi.graphic,
                        class: getKpiIconClassName(kpiIcon, kpiImageSize),
                    };
                }
            }
        }
    }
}