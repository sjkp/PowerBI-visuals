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

/// <reference path="../../_references.ts"/>

module powerbi.data {
    export interface IColorAllocatorCache {
        get(key: SQFillRuleExpr): IColorAllocator;
        register(key: SQFillRuleExpr, colorAllocator: IColorAllocator): this;
    }

    export function createColorAllocatorCache(): IColorAllocatorCache {
        return new ColorAllocatorProvider();
    }

    interface ColorAllocatorCacheEntry {
        key: SQFillRuleExpr;
        allocator: IColorAllocator;
    }

    class ColorAllocatorProvider implements IColorAllocatorCache {
        private cache: ColorAllocatorCacheEntry[];

        constructor() {
            this.cache = [];
        }

        public get(key: SQFillRuleExpr): IColorAllocator {
            debug.assertValue(key, 'key');

            for (let entry of this.cache) {
                if (entry.key === key)
                    return entry.allocator;
            }
        }

        public register(key: SQFillRuleExpr, colorAllocator: IColorAllocator): this {
            debug.assertValue(key, 'key');
            debug.assertValue(colorAllocator, 'colorAllocator');
            debug.assert(this.get(key) == null, 'Trying to re-register for same key expr.');

            this.cache.push({
                key: key,
                allocator: colorAllocator,
            });

            return this;
        }
    }
}