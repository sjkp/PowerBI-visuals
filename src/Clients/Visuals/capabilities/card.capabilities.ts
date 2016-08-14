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
    export const cardCapabilities: VisualCapabilities = {
        dataRoles: [
            {
                name: 'Values',
                kind: VisualDataRoleKind.Measure,
                displayName: data.createDisplayNameGetter('Role_DisplayName_Fields'),
                description: data.createDisplayNameGetter('Role_DisplayName_FieldsDescription'),
            }
        ],
        objects: {
            general: {
                properties: {
                    formatString: StandardObjectProperties.formatString,
                },
            },
            labels: {
                displayName: data.createDisplayNameGetter('Visual_DataPointLabel'),
                properties: {
                    color: StandardObjectProperties.dataColor,
                    labelDisplayUnits: StandardObjectProperties.labelDisplayUnits,
                    labelPrecision: StandardObjectProperties.labelPrecision,
                    // NOTE: Consider adding a ValueType for fontSize.
                    fontSize: StandardObjectProperties.fontSize,
                },
            },
            categoryLabels: {
                displayName: data.createDisplayNameGetter('Visual_CategoryLabel'),
                properties: {
                    show: StandardObjectProperties.show,
                    color: StandardObjectProperties.dataColor,
                    // NOTE: Consider adding a ValueType for fontSize.
                    fontSize: StandardObjectProperties.fontSize,
                },
            },
            wordWrap: {
                displayName: data.createDisplayNameGetter('Visual_WordWrap'),
                properties: {
                    show: StandardObjectProperties.show,
                },
            },
        },
        dataViewMappings: [{
            conditions: [
                { 'Values': { max: 1 } }
            ],
            single: { role: "Values" }
        }],
        suppressDefaultTitle: true,
        supportsSelection: false,
    };

    export var cardProps = {
        categoryLabels: {
            show: <DataViewObjectPropertyIdentifier>{ objectName: 'categoryLabels', propertyName: 'show' },
            color: <DataViewObjectPropertyIdentifier>{ objectName: 'categoryLabels', propertyName: 'color' },
            fontSize: <DataViewObjectPropertyIdentifier>{ objectName: 'categoryLabels', propertyName: 'fontSize' },
        },
        labels: {
            color: <DataViewObjectPropertyIdentifier>{ objectName: 'labels', propertyName: 'color' },
            labelPrecision: <DataViewObjectPropertyIdentifier>{ objectName: 'labels', propertyName: 'labelPrecision' },
            labelDisplayUnits: <DataViewObjectPropertyIdentifier>{ objectName: 'labels', propertyName: 'labelDisplayUnits' },
            fontSize: <DataViewObjectPropertyIdentifier>{ objectName: 'labels', propertyName: 'fontSize' },
        },
        wordWrap: {
            show: <DataViewObjectPropertyIdentifier>{ objectName: 'wordWrap', propertyName: 'show' },
        },
    };

} 