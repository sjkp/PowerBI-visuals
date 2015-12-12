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
    import JsonComparer = jsCommon.JsonComparer;

    /** Defines the values for particular objects. */
    export interface DataViewObjectDefinitions {
        [objectName: string]: DataViewObjectDefinition[];
    }

    export interface DataViewObjectDefinition {
        selector?: Selector;
        properties: DataViewObjectPropertyDefinitions;
    }

    export interface DataViewObjectPropertyDefinitions {
        [name: string]: DataViewObjectPropertyDefinition;
    }

    export type DataViewObjectPropertyDefinition = SQExpr | StructuralObjectDefinition;

    export module DataViewObjectDefinitions {

        /** Creates or reuses a DataViewObjectDefinition for matching the given objectName and selector within the defns. */
        export function ensure(
            defns: DataViewObjectDefinitions,
            objectName: string,
            selector: Selector): DataViewObjectDefinition {
            debug.assertValue(defns, 'defns');

            let defnsForObject = defns[objectName];
            if (!defnsForObject)
                defns[objectName] = defnsForObject = [];

            for (let i = 0, len = defnsForObject.length; i < len; i++) {
                let defn = defnsForObject[i];
                if (Selector.equals(defn.selector, selector))
                    return defn;
            }

            let newDefn: DataViewObjectDefinition = {
                selector: selector,
                properties: {},
            };
            defnsForObject.push(newDefn);

            return newDefn;
        }

        export function deleteProperty(
            defns: DataViewObjectDefinitions,
            objectName: string,
            selector: Selector,
            propertyName: string): void {
            debug.assertValue(defns, 'defns');

            let defn = getObjectDefinition(defns, objectName, selector);
            if (!defn)
                return;

            //note: We decided that delete is acceptable here and that we don't need optimization here
            delete defn.properties[propertyName];
        }

        export function getValue(
            defns: DataViewObjectDefinitions,
            propertyId: DataViewObjectPropertyIdentifier,
            selector: Selector): DataViewObjectPropertyDefinition {

            let properties = getPropertyContainer(defns, propertyId, selector);
            if (!properties)
                return;

            return properties[propertyId.propertyName];
        }

        export function getPropertyContainer(
            defns: DataViewObjectDefinitions,
            propertyId: DataViewObjectPropertyIdentifier,
            selector: Selector): DataViewObjectPropertyDefinitions {

            let defn = getObjectDefinition(defns, propertyId.objectName, selector);
            if (!defn)
                return;

            return defn.properties;
        }

        export function getObjectDefinition(
            defns: DataViewObjectDefinitions,
            objectName: string,
            selector: Selector): DataViewObjectDefinition {
            debug.assertAnyValue(defns, 'defns');
            debug.assertValue(objectName, 'objectName');
            debug.assertAnyValue(selector, 'selector');

            if (!defns)
                return;

            let defnsForObject = defns[objectName];
            if (!defnsForObject)
                return;

            for (let i = 0, len = defnsForObject.length; i < len; i++) {
                let defn = defnsForObject[i];
                if (Selector.equals(defn.selector, selector))
                    return defn;
            }
        }

        export function propertiesAreEqual(a: DataViewObjectPropertyDefinition, b: DataViewObjectPropertyDefinition): boolean {
            if (a instanceof SemanticFilter && b instanceof SemanticFilter) {
                return SemanticFilter.isSameFilter(<SemanticFilter>a, <SemanticFilter>b);
            }

            return JsonComparer.equals(a, b);
        }

        export function allPropertiesAreEqual(a: DataViewObjectPropertyDefinitions, b: DataViewObjectPropertyDefinitions): boolean {
            debug.assertValue(a, 'a');
            debug.assertValue(b, 'b');

            if (Object.keys(a).length !== Object.keys(b).length)
                return false;

            for (let property in a) {
                if (!propertiesAreEqual(a[property], b[property]))
                    return false;
            }

            return true;
        }

        export function encodePropertyValue(value: DataViewPropertyValue, valueTypeDescriptor: ValueTypeDescriptor): DataViewObjectPropertyDefinition {
            if (valueTypeDescriptor.bool) {
                if (typeof (value) !== 'boolean')
                    value = false; // This is fallback, which doesn't really belong here.

                return SQExprBuilder.boolean(<boolean>value);
            }
            else if (valueTypeDescriptor.text || (valueTypeDescriptor.scripting && valueTypeDescriptor.scripting.source)) {
                return SQExprBuilder.text(<string>value);
            }
            else if (valueTypeDescriptor.numeric) {
                if ($.isNumeric(value))
                    return SQExprBuilder.double(+value);
            }
            else if ((<StructuralTypeDescriptor>valueTypeDescriptor).fill) {
                if (value) {
                    return {
                        solid: { color: SQExprBuilder.text(<string>value) }
                    };
                }
            }
            else if (valueTypeDescriptor.formatting) {
                if (valueTypeDescriptor.formatting.labelDisplayUnits) {
                    return SQExprBuilder.double(+value);
                }
                else {
                    return SQExprBuilder.text(<string>value);
                }
            }
            else if (valueTypeDescriptor.enumeration) {
                if ($.isNumeric(value))
                    return SQExprBuilder.double(+value);
                else
                    return SQExprBuilder.text(<string>value);
            }
            else if (valueTypeDescriptor.misc) {
                if (value) {
                    value = SQExprBuilder.text(<string>value);
                } else {
                    value = null;
                }
            }

            return value;
        }
    }
}