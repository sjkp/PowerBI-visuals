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

module powerbi {
    import ArrayExtensions = jsCommon.ArrayExtensions;

    export module DataViewMapping {
        /**
         * Returns dataViewMapping.usage.regression if defined.  Else, returns undefined.
         */
        export function getRegressionUsage(dataViewMapping: DataViewMapping): _.Dictionary<DataViewObjectPropertyIdentifier> {
            let regressionUsage = dataViewMapping &&
                dataViewMapping.usage &&
                dataViewMapping.usage.regression;

            // normalize falsy value to undefined
            return regressionUsage || undefined; 
        }

        /**
         * Returns the role names returned by the specified rolesGetter if they are the same for all specified roleMappings.
         * Else, returns undefined.
         * 
         * @rolesGetter returns all the roles in one of the grouping hierarchy axes (categories or series) or in the measures.
         */
        export function getRolesIfSameInAllCategoricalMappings(
            categoricalRoleMappings: DataViewCategoricalMapping[],
            rolesGetter: (DataViewCategoricalMapping) => string[]): string[] {

            debug.assertValue(categoricalRoleMappings, 'categoricalRoleMappings');
            debug.assertValue(rolesGetter, 'rolesGetter');

            if (_.size(categoricalRoleMappings) === 0)
                return;

            let rolesOfEachMapping: string[][] = _.map(
                categoricalRoleMappings,
                (roleMapping) => rolesGetter(roleMapping));

            let rolesOfFirstMapping = rolesOfEachMapping[0];
            if (rolesOfEachMapping.length >= 2 &&
                !_.every(rolesOfEachMapping, (roles) => ArrayExtensions.sequenceEqual(roles, rolesOfFirstMapping, (role1, role2) => role1 === role2))) {
                // cannot narrow down to a single projection order...
                return;
            }

            return rolesOfFirstMapping;
        }

        /**
         * Returns the array of role names that are mapped to categorical categories.
         * Returns an empty array if none exists.
         */
        export function getAllRolesInCategories(categoricalRoleMapping: DataViewCategoricalMapping): string[] {
            debug.assertValue(categoricalRoleMapping, 'categoricalRoleMapping');

            // DataViewCategoricalMapping.categories is an optional property.  If undefined, it means no role for categories. 
            if (!categoricalRoleMapping.categories)
                return [];

            let roleNames: string[] = [];
            DataViewMapping.visitCategoricalCategories(
                categoricalRoleMapping.categories,
                {
                    visitRole: (roleName: string) => {
                        roleNames.push(roleName);
                    }
                });

            return roleNames;
        }
    }
}