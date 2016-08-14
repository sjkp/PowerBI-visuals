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
    export module DataViewPivotMatrix {
        /** Pivots row hierarchy members in a matrix DataView into column hierarchy. */
        export function apply(dataViewMatrix: DataViewMatrix, context: MatrixTransformationContext): void {
            debug.assertValue(dataViewMatrix, 'dataViewMatrix');

            if (!context.columnHierarchyRewritten)
                dataViewMatrix.columns = Prototype.inherit(dataViewMatrix.columns);
            let columns = dataViewMatrix.columns;

            if (!context.rowHierarchyRewritten)
                dataViewMatrix.rows = Prototype.inherit(dataViewMatrix.rows);
            let rows = dataViewMatrix.rows;

            if (columns.levels.length > 1)
                return;

            let pivotedRowNode: DataViewMatrixNode = {
                level: 0
            };

            let columnLeafNodes: DataViewMatrixNode[] = columns.root.children;
            let measureCount = columnLeafNodes.length;

            // Notes related to VSTS 6999369: The level value of Measure Header nodes is not necessarily its parent node's level + 1.
            // In particular, the Measure Header column nodes directly under the Grand Total node at level 0 (i.e. _.last(pivotResultMatrix.columns.root.children))
            // will have level === (pivotResultMatrix.columns.levels.length - 1), which will be greater than the Grand Total node's 'level + 1' 
            // in a matrix with 2+ column fields and 2+ measure fields.
            // In this code, all row levels will get pivoted over to the columns hierarchy, hence the level of any Measure Header nodes in the pivot result
            // is just (1 + the level of the deepest row node's level), which === rows.levels.length.
            let pivotResultMeasureHeaderLevel = rows.levels.length;

            if (measureCount > 0) {
                let index = 0;
                let callback = function (node: DataViewMatrixNode) {
                    // Collect values and remove them from row leaves
                    if (node.values) {
                        if (!pivotedRowNode.values)
                            pivotedRowNode.values = {};

                        for (let i = 0; i < measureCount; i++)
                            pivotedRowNode.values[index++] = node.values[i];

                        node.values = undefined;
                    }

                    // Create measure headers if there are more than one measures
                    if (measureCount > 1) {
                        if (!node.children)
                            node.children = [];

                        for (let j = 0; j < measureCount; j++) {
                            let measureHeaderLeaf: DataViewMatrixNode = { level: pivotResultMeasureHeaderLevel };

                            // Copy levelSourceIndex from columnLeafNodes (as they might have been reordered)
                            let columnLeafNode = columnLeafNodes[j];
                            measureHeaderLeaf.levelSourceIndex = columnLeafNode.levelSourceIndex;

                            if (node.isSubtotal)
                                measureHeaderLeaf.isSubtotal = true;

                            node.children.push(measureHeaderLeaf);
                        }
                    }
                };

                if (context.hierarchyTreesRewritten) {
                    forEachLeaf(rows.root, callback);
                }
                else {
                    dataViewMatrix.columns.root = cloneTreeExecuteOnLeaf(rows.root, callback);
                }
            }
            else {
                if (!context.hierarchyTreesRewritten) {
                    dataViewMatrix.columns.root = cloneTree(rows.root);
                }
            }

            if (measureCount > 1) {
                // Keep measure headers, but move them to the innermost level
                let level: DataViewHierarchyLevel = { sources: columns.levels[0].sources };
                rows.levels.push(level);

                columns.levels.length = 0;
            }

            if (context.hierarchyTreesRewritten) {
                dataViewMatrix.columns.root = rows.root;
                dataViewMatrix.rows.root = {
                    children: [pivotedRowNode]
                };
            }
            else {
                let updatedRowRoot = Prototype.inherit(dataViewMatrix.rows.root);
                updatedRowRoot.children = [pivotedRowNode];
                dataViewMatrix.rows.root = updatedRowRoot;
            }

            dataViewMatrix.columns.levels = rows.levels;
            dataViewMatrix.rows.levels = [];
        }

        function forEachLeaf(root: DataViewMatrixNode, callback: (node: DataViewMatrixNode) => void): void {
            let children = root.children;
            if (children && children.length > 0) {
                for (let i = 0, ilen = children.length; i < ilen; i++)
                    forEachLeaf(children[i], callback);

                return;
            }

            callback(root);
        }

        export function cloneTree(node: DataViewMatrixNode): DataViewMatrixNode {
            return cloneTreeExecuteOnLeaf(node);
        }

        export function cloneTreeExecuteOnLeaf(node: DataViewMatrixNode, callback?: (node: DataViewMatrixNode) => void): DataViewMatrixNode {
            let updatedNode = Prototype.inherit(node);

            let children = node.children;
            if (children && children.length > 0) {
                let newChildren: DataViewTreeNode[] = [];

                for (let i = 0, ilen = children.length; i < ilen; i++) {
                    let updatedChild = cloneTreeExecuteOnLeaf(children[i], callback);
                    newChildren.push(updatedChild);
                }
                updatedNode.children = newChildren;
            }
            else {
                if (callback)
                    callback(updatedNode);
            }

            return updatedNode;
        }
    }
} 