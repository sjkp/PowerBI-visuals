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

module powerbi.data {

    export module DataViewObjectDescriptors {
        /** Attempts to find the format string property.  This can be useful for upgrade and conversion. */
        export function findFormatString(descriptors: DataViewObjectDescriptors): DataViewObjectPropertyIdentifier {
            return findProperty(
                descriptors,
                (propDesc: DataViewObjectPropertyDescriptor) => {
                    let formattingTypeDesc = ValueType.fromDescriptor(propDesc.type).formatting;
                    return formattingTypeDesc && formattingTypeDesc.formatString;
                });
        }

        /** Attempts to find the filter property.  This can be useful for propagating filters from one visual to others. */
        export function findFilterOutput(descriptors: DataViewObjectDescriptors): DataViewObjectPropertyIdentifier {
            return findProperty(
                descriptors,
                (propDesc: DataViewObjectPropertyDescriptor) => {
                    let propType: StructuralTypeDescriptor = propDesc.type;
                    return propType && propType.filter && !propType.filter.selfFilter;
                });
        }

        /** Attempts to find the self filter property. */
        export function findSelfFilter(descriptors: DataViewObjectDescriptors): DataViewObjectPropertyIdentifier {
            return findProperty(descriptors, isSelfFilter);
        }

        export function isSelfFilter(descriptor: DataViewObjectPropertyDescriptor): boolean {
            let propType: StructuralTypeDescriptor = descriptor && descriptor.type;
            return propType && propType.filter && propType.filter.selfFilter;
        }

        /** Attempts to find the self filter enabled property. */
        export function findSelfFilterEnabled(descriptors: DataViewObjectDescriptors): DataViewObjectPropertyIdentifier {
            return findProperty(
                descriptors,
                (propDesc: DataViewObjectPropertyDescriptor) => {
                    let propType: ValueTypeDescriptor = propDesc.type;
                    return propType && propType.operations && propType.operations.searchEnabled;
                });
        }

        /** Attempts to find the default value property.  This can be useful for propagating schema default value. */
        export function findDefaultValue(descriptors: DataViewObjectDescriptors): DataViewObjectPropertyIdentifier {
            return findProperty(
                descriptors,
                (propDesc: DataViewObjectPropertyDescriptor) => {
                    let propType: StructuralTypeDescriptor = propDesc.type;
                    return propType && !!propType.expression && propType.expression.defaultValue;
                });
        }

        function findProperty(descriptors: DataViewObjectDescriptors, propPredicate: (propDesc: DataViewObjectPropertyDescriptor) => boolean): DataViewObjectPropertyIdentifier {
            debug.assertAnyValue(descriptors, 'descriptors');
            debug.assertAnyValue(propPredicate, 'propPredicate');

            if (!descriptors)
                return;

            for (let objectName in descriptors) {
                let objPropDescs = descriptors[objectName].properties;

                for (let propertyName in objPropDescs) {
                    if (propPredicate(objPropDescs[propertyName])) {
                        return {
                            objectName: objectName,
                            propertyName: propertyName,
                        };
                    }
                }
            }
        }
    }
}