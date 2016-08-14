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

module powerbi.data.segmentation {

    export interface DataViewTableSegment extends DataViewTable {
        /**
         * Index of the last item that had a merge flag in the underlying data.
         * We assume merge flags are not random but adjacent to each other.
         */
        lastMergeIndex?: number;
    }

    export interface DataViewTreeSegmentNode extends DataViewTreeNode {
        /** Indicates whether the node is a duplicate of a node from a previous segment. */
        isMerge?: boolean;
    }

    export interface DataViewCategoricalSegment extends DataViewCategorical {
        /**
         * Index of the last item that had a merge flag in the underlying data.
         * We assume merge flags are not random but adjacent to each other.
         */
        lastMergeIndex?: number;
    }

    export interface DataViewMatrixSegmentNode extends DataViewMatrixNode {
        /**
         * Index of the last item that had a merge flag in the underlying data.
         * We assume merge flags are not random but adjacent to each other.
         */
        isMerge?: boolean;
    }

    export module DataViewMerger {

        export function mergeDataViews(source: DataView, segment: DataView): void {

            if (!DataViewAnalysis.isMetadataEquivalent(source.metadata, segment.metadata)) {
                debug.assertFail("Cannot merge data views with different metadata columns");
            }

            // The last segment is complete. We mark the source as complete.
            if (!segment.metadata.segment)
                delete source.metadata.segment;

            if (source.table && segment.table)
                mergeTables(source.table, <DataViewTableSegment>segment.table);

            if (source.categorical && segment.categorical)
                mergeCategorical(source.categorical, <DataViewCategoricalSegment>segment.categorical);

            // Tree cannot support subtotals hence we can get into situations
            // where a node has no children in one segment and more than 1 child
            // in another segment.
            if (source.tree && segment.tree)
                mergeTreeNodes(source.tree.root, segment.tree.root, true /*allowDifferentStructure*/);

            if (source.matrix && segment.matrix)
                mergeTreeNodes(source.matrix.rows.root, segment.matrix.rows.root, false /*allowDifferentStructure*/);
        }

        /** Note: Public for testability */
        export function mergeTables(source: DataViewTable, segment: DataViewTableSegment): void {
            debug.assertValue(source, 'source');
            debug.assertValue(segment, 'segment');

            if (_.isEmpty(segment.rows))
                return;

            let mergeIndex = segment.lastMergeIndex + 1;
            merge(source.rows, segment.rows, mergeIndex);

            debug.assert(!source.identity === !segment.identity, 'The existence of identity in the new segment is different than the source');
            if (segment.identity)
                merge(source.identity, segment.identity, mergeIndex);
        }

        /**
         * Merge categories values and identities
         *
         * Note: Public for testability
         */
        export function mergeCategorical(source: DataViewCategorical, segment: DataViewCategoricalSegment): void {
            debug.assertValue(source, 'source');
            debug.assertValue(segment, 'segment');

            // Merge categories values and identities
            if (source.categories && segment.categories) {
                let segmentCategoriesLength = segment.categories.length;
                debug.assert(source.categories.length === segmentCategoriesLength, "Source and segment categories have different lengths.");

                for (let categoryIndex: number = 0; categoryIndex < segmentCategoriesLength; categoryIndex++) {
                    let segmentCategory = segment.categories[categoryIndex];
                    let sourceCategory = source.categories[categoryIndex];

                    debug.assert(DataViewAnalysis.areMetadataColumnsEquivalent(sourceCategory.source, segmentCategory.source), "Source and segment category have different sources.");
                    debug.assert(sourceCategory.values === undefined ? sourceCategory.identity === undefined : true, 'Source category is missing values but has identities.');

                    let mergeIndex = segment.lastMergeIndex + 1;
                    if (segmentCategory.values) {
                        merge(sourceCategory.values, segmentCategory.values, mergeIndex);
                    }

                    if (segmentCategory.identity) {
                        merge(sourceCategory.identity, segmentCategory.identity, mergeIndex);
                    }
                }
            }

            // Merge values for each value column
            if (source.values && segment.values) {
                let segmentValuesLength = segment.values.length;
                debug.assert(source.values.length === segmentValuesLength, "Source and segment values have different lengths.");

                for (let valueIndex: number = 0; valueIndex < segmentValuesLength; valueIndex++) {
                    let segmentValue = segment.values[valueIndex];
                    let sourceValue = source.values[valueIndex];

                    debug.assert(DataViewAnalysis.areMetadataColumnsEquivalent(sourceValue.source, segmentValue.source), "Source and segment value have different sources.");

                    if (!sourceValue.values && segmentValue.values) {
                        sourceValue.values = [];
                    }

                    let mergeIndex = segment.lastMergeIndex + 1;
                    if (segmentValue.values) {
                        merge(sourceValue.values, segmentValue.values, mergeIndex);
                    }

                    if (segmentValue.highlights) {
                        merge(sourceValue.highlights, segmentValue.highlights, mergeIndex);
                    }
                }
            }
        }

        /**
         * Merges the segment array starting at the specified index into the source array
         * and returns the segment slice that wasn't merged.
         * The segment array is spliced up to specified index in the process.
         */
        function merge(source: any[], segment: any[], index?: number): any[] {
            if (index >= segment.length)
                return segment;

            let result: any[] = [];
            if (index !== undefined)
                result = segment.splice(0, index);

            Array.prototype.push.apply(source, segment);

            return result;
        }

        /** Note: Public for testability */
        export function mergeTreeNodes(sourceRoot: DataViewTreeNode, segmentRoot: DataViewTreeNode, allowDifferentStructure: boolean): void {
            debug.assertValue(sourceRoot, 'sourceRoot');
            debug.assertValue(segmentRoot, 'segmentRoot');

            if (!segmentRoot.children || segmentRoot.children.length === 0)
                return;

            if (allowDifferentStructure && (!sourceRoot.children || sourceRoot.children.length === 0)) {
                sourceRoot.children = segmentRoot.children;
                return;
            }

            debug.assert(sourceRoot.children && sourceRoot.children.length >= 0,
                "Source tree has different structure than segment.");

            let firstAppendIndex = findFirstAppendIndex(segmentRoot.children);
            let lastSourceChild = sourceRoot.children[sourceRoot.children.length - 1];
            let mergedChildren = merge(sourceRoot.children, segmentRoot.children, firstAppendIndex);

            if (mergedChildren.length > 0)
                mergeTreeNodes(lastSourceChild, mergedChildren[mergedChildren.length - 1], allowDifferentStructure);
        }

        function findFirstAppendIndex(children: DataViewTreeNode[]): number {
            if (children.length === 0)
                return 0;

            let i: number = 0;
            for (; i < children.length; i++) {
                let childSegment: DataViewTreeSegmentNode = <DataViewTreeSegmentNode>children[i];
                if (!childSegment.isMerge)
                    break;
            }

            return i;
        }
    }
}