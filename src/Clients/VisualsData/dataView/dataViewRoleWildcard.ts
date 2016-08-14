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
    import ArrayExtensions = jsCommon.ArrayExtensions;
    import Lazy = jsCommon.Lazy;

    export module DataViewRoleWildcard {
        export function fromRoles(roles: string[]): DataViewRoleWildcard {
            return new DataViewRoleWildcardImpl(roles);
        }

        export function equals(firstRoleWildcard: DataViewRoleWildcard, secondRoleWildcard: DataViewRoleWildcard): boolean {
            return firstRoleWildcard.key &&
                secondRoleWildcard.key &&
                firstRoleWildcard.key === secondRoleWildcard.key &&
                ArrayExtensions.sequenceEqual<string>(
                    firstRoleWildcard.roles,
                    secondRoleWildcard.roles,
                    (role1: string, role2: string) => role1 === role2);
        }

        class DataViewRoleWildcardImpl implements DataViewRoleWildcard {
            private _roles: string[];
            private _key: Lazy<string>;

            public constructor(roles: string[]) {
                debug.assertNonEmpty(roles, 'roles');

                this._roles = roles;
                this._key = new Lazy<string>(() => JSON.stringify(this.roles));
            }

            public get roles(): string[] {
                return this._roles;
            }

            public get key(): string {
                return this._key.getValue();
            }
        }
    }
}