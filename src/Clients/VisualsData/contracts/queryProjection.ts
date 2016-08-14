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

    /** Represents a projection from a query result. */
    export interface QueryProjection {
        /** Name of item in the semantic query Select clause. */
        queryRef: string;

        /** Optional format string. */
        format?: string; // TODO: Deprecate this, and populate format string through objects instead.
    }

    /** A set of QueryProjections, grouped by visualization property, and ordered within that property. */
    export interface QueryProjectionsByRole {
        [roleName: string]: QueryProjectionCollection;
    }

    export class QueryProjectionCollection {
        private items: QueryProjection[];

        /* The activeProjectionReference is an array that contains all the items that we are grouping on in case of a drillable
           role. For example, if you have a drill role with [Country, State, City] and the user drilled to state, the active items
           will include [Country and State]. This means that the query will group on both country and state and the state "last item"
           is the item that the user drilled to.
        */
        private _activeProjectionRefs: string[];
        private _showAll: boolean;

        public constructor(items: QueryProjection[], activeProjectionRefs?: string[], showAll?: boolean) {
            debug.assertValue(items, 'items');

            this.items = items;
            this._activeProjectionRefs = activeProjectionRefs;
            this._showAll = showAll;
        }

        /** Returns all projections in a mutable array. */
        public all(): QueryProjection[] {
            return this.items;
        }

        public get activeProjectionRefs(): string[] {
            return this._activeProjectionRefs;
        }

        public set activeProjectionRefs(queryReferences: string[]) {
            if (!_.isEmpty(queryReferences)) {
                let queryRefs = this.items.map(val => val.queryRef);

                for (let queryReference of queryReferences) {
                    if (!_.contains(queryRefs, queryReference))
                        return;
                }

                this._activeProjectionRefs = queryReferences;
            }
        }

        public get showAll(): boolean {
            return this._showAll;
        }

        public set showAll(value: boolean) {
            this._showAll = value;
        }

        public addActiveQueryReference(queryRef: string): void {
            if (!this._activeProjectionRefs)
                this._activeProjectionRefs = [queryRef];
            else
                this._activeProjectionRefs.push(queryRef);
        }

        public getLastActiveQueryReference(): string {
            if (!_.isEmpty(this._activeProjectionRefs)) {
                return this._activeProjectionRefs[this._activeProjectionRefs.length - 1];
            }
        }

        /** Replaces the given oldQueryRef with newQueryRef in this QueryProjectionCollection. */
        public replaceQueryRef(oldQueryRef: string, newQueryRef: string): void {
            debug.assertValue(oldQueryRef, 'oldQueryRef');
            debug.assertValue(newQueryRef, 'newQueryRef');
            debug.assert(oldQueryRef !== newQueryRef, 'oldQueryRef !== newQueryRef');
            debug.assert(_.isEmpty(this._activeProjectionRefs), 'replaceQueryRef(...) is not supported on the QueryProjectionCollection of a drillable role');

            // Note: the same queryRef can get projected multiple times
            for (let item of this.items) {
                if (item.queryRef === oldQueryRef) {
                    item.queryRef = newQueryRef;
                }
            }
        }

        public clone(): QueryProjectionCollection {
            return new QueryProjectionCollection(_.cloneDeep(this.items), _.clone(this._activeProjectionRefs), this._showAll);
        }
    }

    export module QueryProjectionsByRole {
        /** Clones the QueryProjectionsByRole. */
        export function clone(roles: QueryProjectionsByRole): QueryProjectionsByRole {
            if (!roles)
                return roles;

            let clonedRoles: QueryProjectionsByRole = {};

            for (let roleName in roles)
                clonedRoles[roleName] = roles[roleName].clone();

            return clonedRoles;
        }

        /** Returns the QueryProjectionCollection for that role.  Even returns empty collections so that 'drillable' and 'activeProjection' fields are preserved. */
        export function getRole(roles: QueryProjectionsByRole, name: string): QueryProjectionCollection {
            debug.assertAnyValue(roles, 'roles');
            debug.assertValue(name, 'name');

            if (!roles)
                return;

            return roles[name];
        }
    }
}