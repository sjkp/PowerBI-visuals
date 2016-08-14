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

module powerbi.extensibility {

    /**
     * Translates visual plugin produced by pbiviz cli tools
     * The function mutates the plugin
     * 
     * TODO: add separate capabilities interfaces and versioning support
     */
    export function translateVisualPlugin(plugin: IVisualPlugin): void {
        translateCapabilities(plugin.capabilities);
    }

    function translateCapabilities(capabilities: VisualCapabilities): void {
        if (!capabilities) return;

        translateObjects(capabilities.objects);

        translateDataRoles(capabilities.dataRoles);
    }

    /**
     * Translates objects
     * - allows passing EnumMembers in json (converted to EnumType)
     */
    function translateObjects(objects: data.DataViewObjectDescriptors): void {
        for (let key in objects) {
            let object = objects[key];
            if (!object) continue;
            let properties = object.properties;
            if (properties) {
                for (let pKey in properties) {
                    let property = properties[pKey];
                    if (!property) continue;
                    let propertyType = (<ValueTypeDescriptor>property.type);
                    if (propertyType && propertyType.enumeration) {
                        propertyType.enumeration = createEnumType(<IEnumMember[]>(<any>propertyType.enumeration));
                    }
                }
            }
        }
    }

    /**
     * Translates data roles
     * - allows using strings for kind in json
     */
    function translateDataRoles(dataRoles: VisualDataRole[]): void {
        for (let key in dataRoles) {
            let dataRole = dataRoles[key];
            if (dataRole && dataRole.kind) {
                switch (dataRole.kind.toString().toLowerCase()) {
                    case 'grouping':
                        dataRole.kind = VisualDataRoleKind.Grouping;
                        break;
                    case 'measure':
                        dataRole.kind = VisualDataRoleKind.Measure;
                        break;
                    case 'groupingormeasure':
                        dataRole.kind = VisualDataRoleKind.GroupingOrMeasure;
                        break;
                }
            }
        }
    }
}