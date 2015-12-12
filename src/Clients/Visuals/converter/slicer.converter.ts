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

    /** Helper module for converting a DataView into SlicerData. */
    export module DataConversion {
        export function convert(dataView: DataView, localizedSelectAllText: string, interactivityService: IInteractivityService, hostServices?: IVisualHostServices): SlicerData {
            let slicerData: SlicerData;
            if (!dataView) {
                return;
            }

            let dataViewCategorical = dataView.categorical;
            if (dataViewCategorical == null || dataViewCategorical.categories == null || dataViewCategorical.categories.length === 0)
                return;

            let isInvertedSelectionMode = undefined;
            let objects = dataView.metadata ? <any> dataView.metadata.objects : undefined;
            let categories = dataViewCategorical.categories[0];

            let numberOfScopeIds: number;
            let filter: data.SemanticFilter;
            if (objects && objects.general && objects.general.filter) {
                let identityFields = categories.identityFields;
                if (!identityFields)
                    return;
                filter = <data.SemanticFilter>objects.general.filter;
                let scopeIds = powerbi.data.SQExprConverter.asScopeIdsContainer(filter, identityFields);
                if (scopeIds) {
                    isInvertedSelectionMode = scopeIds.isNot;
                    numberOfScopeIds = scopeIds.scopeIds ? scopeIds.scopeIds.length : 0;
                }
                else {
                    isInvertedSelectionMode = false;
                }
            }

            let defaultValueScopeIdentity = getDefaultValueScopeIdentityAndUpdateFilter(dataView, filter, interactivityService, categories.identityFields, hostServices);

            if (interactivityService) {
                if (isInvertedSelectionMode === undefined) {
                    // The selection state is read from the Interactivity service in case of SelectAll or Clear when query doesn't update the visual
                    isInvertedSelectionMode = interactivityService.isSelectionModeInverted();
                }
                else {
                    interactivityService.setSelectionModeInverted(isInvertedSelectionMode);
                }
            }

            let categoryValuesLen = categories && categories.values ? categories.values.length : 0;
            let slicerDataPoints: SlicerDataPoint[] = [];                
                                     
            // Pass over the values to see if there's a positive or negative selection
            let hasSelection: boolean = undefined;

            let formatString = valueFormatter.getFormatString(categories.source, slicerProps.formatString);

            for (let idx = 0; idx < categoryValuesLen; idx++) {
                let selected = isCategoryColumnSelected(slicerProps.selectedPropertyIdentifier, categories, idx);
                if (selected != null) {
                    hasSelection = selected;
                    break;
                }
            }

            let numberOfCategoriesSelectedInData = 0;
            for (let idx = 0; idx < categoryValuesLen; idx++) {
                let categoryIdentity = categories.identity ? categories.identity[idx] : null;
                let categoryIsSelected = isCategoryColumnSelected(slicerProps.selectedPropertyIdentifier, categories, idx);
                if (defaultValueScopeIdentity && DataViewScopeIdentity.equals(categoryIdentity, defaultValueScopeIdentity))
                    categoryIsSelected = true;

                if (hasSelection != null) {
                    // If the visual is in InvertedSelectionMode, all the categories should be selected by default unless they are not selected
                    // If the visual is not in InvertedSelectionMode, we set all the categories to be false except the selected category                         
                    if (isInvertedSelectionMode) {
                        if (categories.objects == null)
                            categoryIsSelected = undefined;

                        if (categoryIsSelected != null) {
                            categoryIsSelected = hasSelection;
                        }
                        else if (categoryIsSelected == null)
                            categoryIsSelected = !hasSelection;
                    }
                    else {
                        if (categoryIsSelected == null) {
                            categoryIsSelected = !hasSelection;
                        }
                    }
                }

                if (categoryIsSelected)
                    numberOfCategoriesSelectedInData++;

                let categoryValue = valueFormatter.format(categories.values[idx], formatString);
                slicerDataPoints.push({
                    value: categoryValue,
                    tooltip: categoryValue,
                    identity: SelectionId.createWithId(categoryIdentity),
                    selected: categoryIsSelected
                });
            }

            let defaultSettings = createDefaultSettings(dataView);

            if (defaultSettings.selection.selectAllCheckboxEnabled) {
                slicerDataPoints.unshift({
                    value: localizedSelectAllText,
                    tooltip: localizedSelectAllText,
                    identity: SelectionId.createWithMeasure(localizedSelectAllText),
                    selected: !!isInvertedSelectionMode,
                    isSelectAllDataPoint: true
                });
            }

            slicerData = {
                categorySourceName: categories.source.displayName,
                slicerSettings: defaultSettings,
                slicerDataPoints: slicerDataPoints,
            };

            // Override hasSelection if a objects contained more scopeIds than selections we found in the data
            if (numberOfScopeIds && numberOfScopeIds > numberOfCategoriesSelectedInData) {
                slicerData.hasSelectionOverride = true;
            }

            return slicerData;
        }

        function createDefaultSettings(dataView: DataView): SlicerSettings {
            let defaultSettings = Slicer.DefaultStyleProperties();
            let objects = dataView.metadata.objects;

            if (objects) {
                defaultSettings.general.outlineColor = DataViewObjects.getFillColor(objects, slicerProps.general.outlineColor, defaultSettings.general.outlineColor);
                defaultSettings.general.outlineWeight = DataViewObjects.getValue<number>(objects, slicerProps.general.outlineWeight, defaultSettings.general.outlineWeight);
                defaultSettings.general.orientation = DataViewObjects.getValue<slicerOrientation.Orientation>(objects, slicerProps.general.orientation, defaultSettings.general.orientation);

                defaultSettings.header.show = DataViewObjects.getValue<boolean>(objects, slicerProps.header.show, defaultSettings.header.show);
                defaultSettings.header.fontColor = DataViewObjects.getFillColor(objects, slicerProps.header.fontColor, defaultSettings.header.fontColor);
                let headerBackground = DataViewObjects.getFillColor(objects, slicerProps.header.background);
                if (headerBackground)
                    defaultSettings.header.background = headerBackground;
                defaultSettings.header.outline = DataViewObjects.getValue<string>(objects, slicerProps.header.outline, defaultSettings.header.outline);
                defaultSettings.header.textSize = DataViewObjects.getValue<number>(objects, slicerProps.header.textSize, defaultSettings.header.textSize);

                defaultSettings.slicerText.color = DataViewObjects.getFillColor(objects, slicerProps.items.fontColor, defaultSettings.slicerText.color);
                let textBackground = DataViewObjects.getFillColor(objects, slicerProps.items.background);
                if (textBackground)
                    defaultSettings.slicerText.background = textBackground;

                defaultSettings.slicerText.outline = DataViewObjects.getValue<string>(objects, slicerProps.items.outline, defaultSettings.slicerText.outline);
                defaultSettings.slicerText.textSize = DataViewObjects.getValue<number>(objects, slicerProps.items.textSize, defaultSettings.slicerText.textSize);

                defaultSettings.selection.selectAllCheckboxEnabled = DataViewObjects.getValue<boolean>(objects, slicerProps.selection.selectAllCheckboxEnabled, defaultSettings.selection.selectAllCheckboxEnabled);
                defaultSettings.selection.singleSelect = DataViewObjects.getValue<boolean>(objects, slicerProps.selection.singleSelect, defaultSettings.selection.singleSelect);
            }

            return defaultSettings;
        }

        function createPropertiesWithDefaultFilter(fieldsExpr: data.SQExpr[]): VisualObjectInstancesToPersist {
            debug.assertValue(fieldsExpr, 'fieldsExpr');

            let filterPropertyIdentifier = slicerProps.filterPropertyIdentifier;
            let properties: { [propertyName: string]: DataViewPropertyValue } = {};

            let filter = powerbi.data.SemanticFilter.getDefaultValueFilter(fieldsExpr);
            properties[filterPropertyIdentifier.propertyName] = filter;
            let instance = {
                objectName: filterPropertyIdentifier.objectName,
                selector: undefined,
                properties: properties
            };

            return <VisualObjectInstancesToPersist> {
                merge: [instance]
            };
        }

        function getDefaultValueScopeIdentityAndUpdateFilter(
            dataView: DataView,
            filter: data.SemanticFilter,
            interactivityService: IInteractivityService | ISelectionHandler,
            identityFields: data.SQExpr[],
            hostServices: IVisualHostServices): DataViewScopeIdentity {
            let defaultValueScopeIdentity: DataViewScopeIdentity;
            let defaultValues = getDataViewDefaultValue(dataView);
            if (defaultValues && defaultValues.value && interactivityService && !_.isEmpty(identityFields)) {
                if (!filter || data.SemanticFilter.isDefaultFilter(filter)) {
                    defaultValueScopeIdentity = data.createDataViewScopeIdentity(data.SQExprUtils.getDataViewScopeIdentityComparisonExpr(identityFields, defaultValues.identityFieldsValues));

                    // update filter if this is the first time loaded slicer
                    if ((<IInteractivityService>interactivityService).isDefaultValueEnabled() === undefined) {
                        (<IInteractivityService>interactivityService).setDefaultValueMode(true);
                        if (hostServices) {
                            (<ISelectionHandler>interactivityService).handleClearSelection();
                            hostServices.persistProperties(createPropertiesWithDefaultFilter(identityFields));
                        }
                    }
                }
            }
            return defaultValueScopeIdentity;
        }

        export function getDataViewDefaultValue(dataView: DataView): DefaultValueDefinition {
            if (dataView && dataView.metadata && !_.isEmpty(dataView.metadata.columns)) {
                return DataViewObjects.getValue<DefaultValueDefinition>(dataView.metadata.columns[0].objects, slicerProps.defaultValue);
            }
        }
    }

}