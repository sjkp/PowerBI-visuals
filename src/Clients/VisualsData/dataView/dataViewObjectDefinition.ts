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

        /**
         * Removes every property defined in targetDefns from sourceDefns if exists.
         * Properties are matches using ObjectName, Selector, and PropertyName.
         * @param {DataViewObjectDefinition} targetDefns Defenitions to remove properties from
         * @param {DataViewObjectDefinition} sourceDefns Defenitions to match properties against
         */
        export function deleteProperties(targetDefns: DataViewObjectDefinitions, sourceDefns: DataViewObjectDefinitions): void {
            if (!targetDefns || !sourceDefns)
                return;

            for (let objName in sourceDefns) {
                let objDefns = sourceDefns[objName];

                for (let defn of objDefns) {
                    for (let propName in defn.properties) {
                        deleteProperty(targetDefns, objName, defn.selector, propName);
                    }
                }
            }
        }

        /**
         * Fills in missing properties with default ones, mutating the first definitions.
         * Properties are matched agains defaultDefns using ObjectName, Selector, and PropertyName.
         * It just fills missing properties, it doesn't overwrite existing ones.
         * Any property already in targetDefns will not change.
         * Any property in defaultDefns but not in targetDefns will be added by reference.
         * @param {DataViewObjectDefinitions} targetDefns Default definitions. Will be mutated. Expected to be defined
         * @param {DataViewObjectDefinitions} defaultDefns Definitions to fill inside targetDefns
         */
        export function extend(targetDefns: DataViewObjectDefinitions, defaultDefns: DataViewObjectDefinitions): void {
            debug.assertValue(targetDefns, "Trying to cascade into undefined DataViewObjectDefinitions");
            if (!targetDefns) {
                return;
            }

            if (!defaultDefns) {
                // No need to change targetDefns
                return;
            }

            for (let objName in defaultDefns) {
                let defaultObjDefns = defaultDefns[objName];
                if (!defaultObjDefns) {
                    continue;
                }

                let targetObjDefns = targetDefns[objName];
                if (!targetObjDefns) {
                    targetObjDefns = targetDefns[objName] = [];
                }

                extendObjectDefinitions(targetObjDefns, defaultObjDefns);
            }
        }

        function extendObjectDefinitions(targetObjDefns: DataViewObjectDefinition[], defaultObjDefns: DataViewObjectDefinition[]): void {
            let found: boolean;

            for (let defaultObjDefn of defaultObjDefns) {
                found = false;

                for (let targetObjDefn of targetObjDefns) {
                    if (Selector.equals(targetObjDefn.selector, defaultObjDefn.selector)) {
                        extendPropDefns(targetObjDefn.properties, defaultObjDefn.properties);
                        found = true;
                        break; // We are assuming a single match
                    }
                }

                if (!found) {
                    let newObjDefn: DataViewObjectDefinition = {
                        selector: defaultObjDefn.selector,
                        properties: {},
                    };

                    extendPropDefns(newObjDefn.properties, defaultObjDefn.properties);
                    targetObjDefns.push(newObjDefn);
                }
            }
        }

        function extendPropDefns(targetPropDefns: DataViewObjectPropertyDefinitions, defaultPropDefns: DataViewObjectPropertyDefinitions): void {
            for (let propName in defaultPropDefns) {
                let defaultPropDefn = defaultPropDefns[propName];

                // This case handles when a PropertyDefinition is there just to clear existing property
                if (!defaultPropDefn) {
                    continue;
                }

                let targetPropDefn = targetPropDefns[propName];
                if (!targetPropDefn) {
                    // Copy the Property Definition into propDefns1
                    targetPropDefns[propName] = defaultPropDefn;
                }
            }
        }

        /**
         * Delete the first matching property from the Defns if it matches objName + selector + propertyName
         * @param {DataViewObjectDefinitions} defns
         * @param {string} objectName
         * @param {Selector} selector
         * @param {string} propertyName
         */
        export function deleteProperty(
            defns: DataViewObjectDefinitions,
            objectName: string,
            selector: Selector,
            propertyName: string): void {
            debug.assertValue(defns, 'defns');

            let match = getObjectDefinition(defns, objectName, selector);
            if (!match)
                return;

            DataViewObjectDefinition.deleteSingleProperty(match, propertyName);
        }
        
        /**
         * 
         * @param {DataViewObjectDefinitions} defns
         * @param {DataViewObjectPropertyIdentifier} propertyId
         * @param {Selector} selector
         * @param {DataViewObjectPropertyDefinition} value
         */
        export function setValue(
            defns: DataViewObjectDefinitions,
            propertyId: DataViewObjectPropertyIdentifier,
            selector: Selector,
            value: DataViewObjectPropertyDefinition): void {
            debug.assertValue(defns, 'defns');
            debug.assertValue(propertyId, 'propertyId');

            ensure(defns, propertyId.objectName, selector).properties[propertyId.propertyName] = value;
        }

        /**
         * 
         * @param {DataViewObjectDefinitions} defns
         * @param {DataViewObjectPropertyIdentifier} propertyId
         * @param {Selector} selector
         * @returns
         */
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

        /**
         * Get the first DataViewObjectDefinition that match selector and objectName
         * @param {DataViewObjectDefinitions} defns DataViewObjectDefinitions to search
         * @param {string} objectName objectName to match
         * @param {Selector} selector selector to match
         * @returns The first match, if any. If no match, returns undefined
         */
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
            debug.assertAnyValue(value, 'value');
            debug.assertValue(valueTypeDescriptor, 'valueTypeDescriptor');

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
            else if (valueTypeDescriptor.dateTime) {
                if (value) {
                    value = SQExprBuilder.dateTime(<Date>value);
                } else {
                    value = null;
                }
            }
            else if ((<StructuralTypeDescriptor>valueTypeDescriptor).image) {
                if (value) {
                    let imageValue = <ImageValue>value;
                    let imageDefinition: ImageDefinition = {
                        name: SQExprBuilder.text(imageValue.name),
                        url: SQExprBuilder.text(imageValue.url),
                    };

                    if (imageValue.scaling)
                        imageDefinition.scaling = SQExprBuilder.text(imageValue.scaling);

                    return imageDefinition;
                }
            }

            return value;
        }

        export function clone(original: DataViewObjectDefinitions): DataViewObjectDefinitions {
            debug.assertValue(original, 'original');

            let cloned: DataViewObjectDefinitions = {};

            for (let objectName in original) {
                let originalDefns = original[objectName];
                if (_.isEmpty(originalDefns))
                    continue;

                let clonedDefns: DataViewObjectDefinition[] = [];
                for (let originalDefn of originalDefns) {
                    clonedDefns.push({
                        properties: cloneProperties(originalDefn.properties),
                        selector: originalDefn.selector,
                    });
                }
                cloned[objectName] = clonedDefns;
            }

            return cloned;
        }

        function cloneProperties(original: DataViewObjectPropertyDefinitions): DataViewObjectPropertyDefinitions {
            debug.assertValue(original, 'original');

            // NOTE: properties are considered atomic, so a shallow clone is appropriate here.
            return _.clone(original);
        }
    }

    export module DataViewObjectDefinition {

        export function deleteSingleProperty(
            defn: DataViewObjectDefinition,
            propertyName: string): void {

            //note: We decided that delete is acceptable here and that we don't need optimization here
            delete defn.properties[propertyName];
        }
    }
}