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

    export type SQFromSource = SQFromEntitySource | SQFromSubquerySource;

    /** Represents an entity reference in SemanticQuery from. */
    export class SQFromEntitySource {

        constructor(public schema: string, public entity: string) { }

        public accept<T, TArg>(visitor: ISQFromSourceVisitor<T, TArg>, arg: TArg): T {
            return visitor.visitEntity(this, arg);
        }

        public equals(source: SQFromEntitySource): boolean {
            return source && this.entity === source.entity && this.schema === source.schema;
        }
    }

    /** Represents a subquery reference in SemanticQuery from.
        for subquery use SQExpr instead of SemanticQuery when we have one for QuerySubqueryExpression
     */
    export class SQFromSubquerySource {

        constructor(public subquery: SemanticQuery) { }

        public accept<T, TArg>(visitor: ISQFromSourceVisitor<T, TArg>, arg: TArg): T {
            return visitor.visitSubquery(this, arg);
        }

        public equals(source: SQFromSubquerySource): boolean {
            return source && SemanticQuery.equals(this.subquery, source.subquery);
        }
    }

    /** Represents a SemanticQuery/SemanticFilter from clause. */
    export class SQFrom {
        private items: { [name: string]: SQFromSource };

        constructor(items?: { [name: string]: SQFromSource }) {
            this.items = items || {};
        }

        public keys(): string[] {
            return Object.keys(this.items);
        }

        public source(key: string): SQFromSource {
            return this.items[key];
        }

        public sources(): { [name: string]: SQFromSource } {
            return this.items;
        }

        public ensureSource(source: SQFromSource, desiredVariableName?: string): QueryFromEnsureEntityResult {
            debug.assertValue(source, 'source');

            // 1) Reuse a reference to the entity among the already referenced
            let key = this.getSourceKeyFromItems(source);
            if (key)
                return { name: key };

            // 2) Add a reference to the entity
            let uniqueName = this.addSource(source, desiredVariableName);
            return { name: uniqueName, new: true };
        }

        public remove(key: string): void {
            delete this.items[key];
        }

        private getSourceKeyFromItems(source: SQFromSource): string {
            let keys = this.keys();
            for (let i in keys) {
                let key = keys[i],
                    item = this.items[key];
                if (isSQFromEntitySource(item) &&
                    isSQFromEntitySource(source) &&
                    item.equals(source))
                    return key;
                else if (isSQFromSubquerySource(item) &&
                    isSQFromSubquerySource(source) &&
                    item.equals(source))
                    return key;
            }
        }

        private addSource(source: SQFromSource, desiredVariableName: string): string {
            let candidateName = desiredVariableName || source.accept(new SQFromSourceCandidateNameVisitor(), /*arg*/null),
                uniqueName = candidateName,
                usedNames: { [name: string]: boolean } = {};

            for (let key of this.keys())
                usedNames[key] = true;
            uniqueName = jsCommon.StringExtensions.findUniqueName(usedNames, uniqueName);

            this.items[uniqueName] = source;
            return uniqueName;
        }

        public clone(): SQFrom {
            // NOTE: consider deprecating this method and instead making QueryFrom be CopyOnWrite (currently we proactively clone).
            let cloned = new SQFrom();

            // NOTE: we use extend rather than prototypical inheritance on items because we use Object.keys.            
            $.extend(cloned.items, this.items);

            return cloned;
        }

        public equals(comparand: SQFrom): boolean {
            if (!comparand)
                return false;

            let localKeys = this.keys(),
                comparandKeys = comparand.keys();
            if (localKeys.length !== comparandKeys.length)
                return false;

            return ArrayExtensions.sequenceEqual(localKeys, comparandKeys, (localKey: string, comparandKey: string) => equals(this.source(localKey), comparand.source(comparandKey)));
        }
    }

    export function equals(left: SQFromSource, right: SQFromSource): boolean {
        if (left && right) {
            if (isSQFromEntitySource(left) && isSQFromEntitySource(right))
                return left.equals(right);
            else if (isSQFromSubquerySource(left) && isSQFromSubquerySource(right))
                return left.equals(right);
        }

        if (left === right)
            return true;

        return false;
    }

    export function isSQFromEntitySource(source: SQFromSource): source is SQFromEntitySource {
        debug.assertValue(source, 'source');
        return (<SQFromEntitySource>source).entity != null;
    }

    export function isSQFromSubquerySource(source: SQFromSource): source is SQFromSubquerySource {
        debug.assertValue(source, 'source');
        return (<SQFromSubquerySource>source).subquery != null;
    }

    export interface ISQFromSourceVisitor<T, Targ> {
        visitEntity(source: SQFromEntitySource, arg: Targ): T;
        visitSubquery(source: SQFromSubquerySource, arg: Targ): T;
    }

    export class SQFromSourceCandidateNameVisitor implements ISQFromSourceVisitor<string, void> {

        /** Converts the entity name into a short reference name.  Follows the Semantic Query convention of a short name. */
        visitEntity(source: SQFromEntitySource): string {
            let ref = source.entity,
                idx = ref.lastIndexOf('.');
            if (idx >= 0 && (idx !== ref.length - 1))
                ref = ref.substr(idx + 1);

            return ref.substring(0, 1).toLowerCase();
        }

        visitSubquery(source: SQFromSubquerySource): string {
            return 'q';
        }
    }

    export class SQFromEntitiesVisitor implements ISQFromSourceVisitor<void, string> {
        public entities: SQEntityExpr[];

        constructor() {
            this.entities = [];
        }

        visitEntity(source: SQFromEntitySource, key: string): void {
            this.entities.push(new SQEntityExpr(source.schema, source.entity, key));
        }

        visitSubquery(source: SQFromSubquerySource, key: string): void {
            // does nothing
        }
    }
}