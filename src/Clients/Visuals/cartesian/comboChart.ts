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
    export interface ComboChartDataViewObjects extends DataViewObjects {
        general: ComboChartDataViewObject;
    }

    export interface ComboChartDataViewObject extends DataViewObject {
        visualType1: string;
        visualType2: string;
    }

    /**
     * This module only supplies the capabilities for comboCharts.
     * Implementation is in cartesianChart and the various ICartesianVisual implementations.
     */
    export module ComboChart {
        export const capabilities = comboChartCapabilities;

        /**
         * Handles the case of a column layer in a combo chart. In this case, the column layer is enumearated last.
         */
        export function enumerateDataPoints(enumeration: ObjectEnumerationBuilder, options: EnumerateVisualObjectInstancesOptions, layers: ICartesianVisual[]): void {
            if (!layers)
                return;

            let columnChartLayerIndex: number;
            let layersLength: number = layers.length;

            for (let layerIndex = 0; layerIndex < layersLength; layerIndex++) {
                let layer = layers[layerIndex];

                if (layer.enumerateObjectInstances) {
                    if (layer instanceof ColumnChart) {
                        columnChartLayerIndex = layerIndex;
                        continue;
                    }

                    layer.enumerateObjectInstances(enumeration, options);
                }
            }

            if (columnChartLayerIndex !== undefined)
                layers[columnChartLayerIndex].enumerateObjectInstances(enumeration, options);
        }

        export function customizeQuery(options: CustomizeQueryOptions): void {
            // If there is a dynamic series but no values on the column data view mapping, remove the dynamic series
            let columnMapping = !_.isEmpty(options.dataViewMappings) && options.dataViewMappings[0];
            if (columnMapping) {
                let columnValuesMapping: data.CompiledDataViewGroupedRoleMapping = columnMapping.categorical && <data.CompiledDataViewGroupedRoleMapping>columnMapping.categorical.values;
                let seriesSelect = columnValuesMapping.group && !_.isEmpty(columnValuesMapping.group.select) && <data.CompiledDataViewRoleForMapping>columnValuesMapping.group.select[0];
                if (_.isEmpty(seriesSelect.for.in.items))
                    columnValuesMapping.group.by.items = undefined;
            }
            
            let isScalar = CartesianChart.detectScalarMapping(columnMapping);

            if (columnMapping && columnMapping.categorical) {
                columnMapping.categorical.dataVolume = 4;
                if (isScalar) {
                    let dataViewCategories = <data.CompiledDataViewRoleForMappingWithReduction>columnMapping.categorical.categories;
                    dataViewCategories.dataReductionAlgorithm = { sample: {} };
                    let values = <data.CompiledDataViewGroupedRoleMapping>columnMapping.categorical.values;

                    if(values && values.group){
                        values.group.dataReductionAlgorithm = { top: {} };
                    }
                }
            }

            let lineMapping = options.dataViewMappings.length > 1 && options.dataViewMappings[1];
            if (lineMapping && lineMapping.categorical) {
                lineMapping.categorical.dataVolume = 4;
                if (isScalar) {
                    let dataViewCategories = <data.CompiledDataViewRoleForMappingWithReduction>lineMapping.categorical.categories;
                    dataViewCategories.dataReductionAlgorithm = { sample: {} };
                    let values = <data.CompiledDataViewGroupedRoleMapping>lineMapping.categorical.values;

                    if(values && values.group){
                        values.group.dataReductionAlgorithm = { top: {} };
                    }
                }
            }

            if(!isScalar){
                CartesianChart.expandCategoryWindow(options.dataViewMappings);
            }
        }

        export function getSortableRoles(options: VisualSortableOptions): string[] {
            if (options && options.dataViewMappings.length > 0) {
                let dataViewMapping = options.dataViewMappings[0];
                //TODO: column chart should be sortable by X if it has scalar axis
                // But currenly it doesn't support this. Return 'category' once
                // it is supported.
                if (!CartesianChart.detectScalarMapping(dataViewMapping))
                    return ['Category', 'Y', 'Y2'];
            }

            return null;
        }

        export function isComboChart(chartType: CartesianChartType): boolean {
            return chartType === CartesianChartType.ComboChart
                || chartType === CartesianChartType.LineClusteredColumnCombo
                || chartType === CartesianChartType.LineStackedColumnCombo
                || chartType === CartesianChartType.DataDotClusteredColumnCombo
                || chartType === CartesianChartType.DataDotStackedColumnCombo;
        }
    }
}