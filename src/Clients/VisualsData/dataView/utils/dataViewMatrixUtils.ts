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
    import inherit = Prototype.inherit;
    import inheritSingle = Prototype.inheritSingle;
    import ArrayExtensions = jsCommon.ArrayExtensions;

    export module DataViewMatrixUtils {
        export const enum DepthFirstTraversalCallbackResult
        {
            stop = 0, // stop the traversal; default behavior if callback returns undefined or null.
            continueToChildNodes = 1, // follow the normal course of DFS 
            skipDescendantNodes = 2, // skip the child nodes of the current visiting node in the callback, and continue onto sibling nodes
        }

        export function isLeafNode(node: DataViewMatrixNode): boolean {
            debug.assertValue(node, 'node');

            return _.isEmpty(node.children);
        }

        /**
         * Invokes the specified callback once per node in the node tree starting from the specified rootNodes in depth-first order.
         *
         * If rootNodes is null or undefined or empty, the specified callback will not get invoked.
         *
         * The traversalPath parameter in the callback is an ordered set of nodes that form the path from the specified 
         * rootNodes down to the callback node argument itself.  If callback node is one of the specified rootNodes,
         * then traversalPath will be an array of length 1 containing that very node.
         *
         * IMPORTANT: The traversalPath array passed to the callback will be modified after the callback function returns!
         * If your callback needs to retain a copy of the traversalPath, please clone the array before returning.
         */
        export function forEachNodeDepthFirst(
            rootNodes: DataViewMatrixNode | DataViewMatrixNode[],
            callback: (node: DataViewMatrixNode, traversalPath?: DataViewMatrixNode[]) => DepthFirstTraversalCallbackResult): void {
            debug.assertAnyValue(rootNodes, 'rootNodes');
            debug.assertValue(callback, 'callback');

            // Note: Don't do "if (!_.isEmpty(rootNodes))" for checking whether rootNodes is an empty array DataViewMatrixNode[],
            // because rootNodes can also be an non-array DataViewMatrixNode, and an empty object can be a valid root node DataViewMatrixNode, 
            // for the fact that all the properties on DataViewMatrixNode are optional...
            if (rootNodes) {
                if (isNodeArray(rootNodes)) {
                    for (let rootNode of rootNodes) {
                        if (rootNode) {
                            forEachNodeDepthFirstRecursive(rootNode, [], callback);
                        }
                    }
                }
                else {
                    forEachNodeDepthFirstRecursive(rootNodes, [], callback);
                }
            }
        }

        /**
         * @traversalPath an array that contains the path from the specified rootNodes in forEachLeafNode() down to the parent of the argument matrixNode (i.e. treePath does not contain the matrixNode argument yet).
         */
        function forEachNodeDepthFirstRecursive(
            matrixNode: DataViewMatrixNode,
            traversalPath: DataViewMatrixNode[],
            callback: (node: DataViewMatrixNode, traversalPath?: DataViewMatrixNode[]) => DepthFirstTraversalCallbackResult): boolean {
            debug.assertValue(matrixNode, 'matrixNode');
            debug.assertValue(traversalPath, 'traversalPath');
            debug.assertValue(callback, 'callback');

            // If traversalPath already contains matrixNode, then either one of the following errors has happened:
            // 1. the caller code mistakenly added matrixNode to traversalPath, or
            // 2. the callback modified traversalPath by adding a node to it, or
            // 3. the matrix hierarchy contains a cyclical node reference.
            debug.assert(!_.contains(traversalPath, matrixNode),
                'pre-condition: traversalPath must not already contain matrixNode');

            traversalPath.push(matrixNode);

            let traversalResult = callback(matrixNode, traversalPath);
            let shouldContinue = !!traversalResult &&
                traversalResult !== DepthFirstTraversalCallbackResult.stop;

            if (traversalResult === DepthFirstTraversalCallbackResult.continueToChildNodes) {
                let childNodes = matrixNode.children;
                if (!_.isEmpty(childNodes)) {
                    for (let nextChild of childNodes) {
                        if (nextChild) {
                            shouldContinue = forEachNodeDepthFirstRecursive(nextChild, traversalPath, callback);
                            if (!shouldContinue) {
                                break;
                            }
                        }
                    }
                }
            }

            debug.assert(_.last(traversalPath) === matrixNode, 'pre-condition: the callback given to forEachNodeDepthFirst() is not supposed to modify the traversalPath argument array.');
            traversalPath.pop();

            return shouldContinue;
        }

        /**
         * Invokes the specified callback once per leaf node (including root-level leaves and descendent leaves) of the 
         * specified rootNodes, with an optional index parameter in the callback that is the 0-based index of the 
         * particular leaf node in the context of this forEachLeafNode(...) invocation.
         *
         * If rootNodes is null or undefined or empty, the specified callback will not get invoked.
         *
         * The traversalPath parameter in the callback is an ordered set of nodes that form the path from the specified 
         * rootNodes down to the leafNode argument itself.  If callback leafNode is one of the specified rootNodes,
         * then traversalPath will be an array of length 1 containing that very node.
         *
         * IMPORTANT: The traversalPath array passed to the callback will be modified after the callback function returns!
         * If your callback needs to retain a copy of the traversalPath, please clone the array before returning.
         */
        export function forEachLeafNode(
            rootNodes: DataViewMatrixNode | DataViewMatrixNode[],
            callback: (leafNode: DataViewMatrixNode, index?: number, traversalPath?: DataViewMatrixNode[]) => void): void {
            debug.assertAnyValue(rootNodes, 'rootNodes');
            debug.assertValue(callback, 'callback');

            let nextLeafNodeIndex = 0;
            forEachNodeDepthFirst(rootNodes, (node, traversalPath) => {
                if (isLeafNode(node)) {
                    callback(node, nextLeafNodeIndex, traversalPath);
                    nextLeafNodeIndex++;
                }
                return DepthFirstTraversalCallbackResult.continueToChildNodes;
            });
        }

        function isNodeArray(nodeOrNodeArray: DataViewMatrixNode | DataViewMatrixNode[]): nodeOrNodeArray is DataViewMatrixNode[] {
            return ArrayExtensions.isArrayOrInheritedArray(nodeOrNodeArray);
        }

        /**
         * Invokes the specified callback once for each node at the specified targetLevel in the node tree.
         * 
         * Note: Be aware that in a matrix with multiple column grouping fields and multiple value fields, the DataViewMatrixNode
         * for the Grand Total column in the column hierarchy can have children nodes where level > (parent.level + 1):
         *  {
         *      "level": 0,
         *      "isSubtotal": true,
         *      "children": [
         *          { "level": 2, "isSubtotal": true },
         *          { "level": 2, "levelSourceIndex": 1, "isSubtotal": true }
         *      ]
         *  }
         */
        export function forEachNodeAtLevel(node: DataViewMatrixNode, targetLevel: number, callback: (node: DataViewMatrixNode) => void): void {
            debug.assertValue(node, 'node');
            debug.assert(targetLevel >= 0, 'targetLevel >= 0');
            debug.assertValue(callback, 'callback');

            if (node.level === targetLevel) {
                callback(node);
                return;
            }

            let children = node.children;
            if (children && children.length > 0) {
                for (let i = 0, ilen = children.length; i < ilen; i++)
                    forEachNodeAtLevel(children[i], targetLevel, callback);
            }
        }

        /**
         * Returned an object tree where each node and its children property are inherited from the specified node 
         * hierarchy, from the root down to the nodes at the specified deepestLevelToInherit, inclusively.
         *
         * The inherited nodes at level === deepestLevelToInherit will NOT get an inherited version of children array 
         * property, i.e. its children property is the same array object referenced in the input node's object tree.
         *
         * @param node The input node with the hierarchy object tree.
         * @param deepestLevelToInherit The highest level for a node to get inherited. See DataViewMatrixNode.level property.
         * @param useInheritSingle If true, then a node will get inherited in the returned object tree only if it is 
         * not already an inherited object. Same goes for the node's children property.  This is useful for creating 
         * "visual DataView" objects from "query DataView" objects, as object inheritance is the mechanism for 
         * "visual DataView" to override properties in "query DataView", and that "query DataView" never contains 
         * inherited objects.
         */
        export function inheritMatrixNodeHierarchy(
            node: DataViewMatrixNode,
            deepestLevelToInherit: number,
            useInheritSingle: boolean): DataViewMatrixNode {
            debug.assertValue(node, 'node');
            debug.assert(deepestLevelToInherit >= 0, 'deepestLevelToInherit >= 0');
            debug.assertValue(useInheritSingle, 'useInheritSingle');

            let returnNode = node;

            // Note: The level property of DataViewMatrix.rows.root and DataViewMatrix.columns.root are always undefined.
            // Also, in a matrix with multiple column grouping fields and multiple value fields, the DataViewMatrixNode
            // for the Grand Total column in the column hierarchy will have children nodes where level > (parent.level + 1):
            //  {
            //    "level": 0,
            //    "isSubtotal": true,
            //    "children": [
            //      { "level": 2, "isSubtotal": true },
            //      { "level": 2, "levelSourceIndex": 1, "isSubtotal": true }
            //    ]
            //  }
            let isRootNode = node.level === undefined;
            let shouldInheritCurrentNode = isRootNode || (node.level <= deepestLevelToInherit);
            if (shouldInheritCurrentNode) {
                let inheritFunc = useInheritSingle ? inheritSingle : inherit;
                let inheritedNode: DataViewMatrixNode = inheritFunc(node);

                let shouldInheritChildNodes = isRootNode || (node.level < deepestLevelToInherit);
                if (shouldInheritChildNodes && !_.isEmpty(node.children)) {
                    inheritedNode.children = inheritFunc(node.children); // first, make an inherited array
                    for (let i = 0, ilen = inheritedNode.children.length; i < ilen; i++) {
                        inheritedNode.children[i] =
                            inheritMatrixNodeHierarchy(inheritedNode.children[i], deepestLevelToInherit, useInheritSingle);
                    }
                }

                returnNode = inheritedNode;
            }

            return returnNode;
        }

        /**
         * Returns true if the specified matrixOrHierarchy contains any composite grouping, i.e. a grouping on multiple columns.
         * An example of composite grouping is one on [Year, Quarter, Month], where a particular group instance can have
         * Year === 2016, Quarter === 'Qtr 1', Month === 1.
         *
         * Returns false if the specified matrixOrHierarchy does not contain any composite group, 
         * or if matrixOrHierarchy is null or undefined.
         */
        export function containsCompositeGroup(matrixOrHierarchy: DataViewMatrix | DataViewHierarchy): boolean {
            debug.assertAnyValue(matrixOrHierarchy, 'matrixOrHierarchy');

            let hasCompositeGroup = false;

            if (matrixOrHierarchy) {
                if (isMatrix(matrixOrHierarchy)) {
                    hasCompositeGroup = containsCompositeGroup(matrixOrHierarchy.rows) ||
                        containsCompositeGroup(matrixOrHierarchy.columns);
                }
                else {
                    let hierarchyLevels = matrixOrHierarchy.levels;
                    if (!_.isEmpty(hierarchyLevels)) {
                        for (var level of hierarchyLevels) {
                            // it takes at least 2 columns at the same hierarchy level to form a composite group...
                            if (level.sources && (level.sources.length >= 2)) {

                                debug.assert(_.every(level.sources, sourceColumn => sourceColumn.isMeasure === level.sources[0].isMeasure),
                                    'pre-condition: in a valid DataViewMatrix, the source columns in each of its hierarchy levels must either be all non-measure columns (i.e. a grouping level) or all measure columns (i.e. a measure headers level)');

                                // Measure headers are not group
                                let isMeasureHeadersLevel = level.sources[0].isMeasure;
                                if (!isMeasureHeadersLevel) {
                                    hasCompositeGroup = true;
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            return hasCompositeGroup;
        }

        function isMatrix(matrixOrHierarchy: DataViewMatrix | DataViewHierarchy): matrixOrHierarchy is DataViewMatrix {
            return 'rows' in matrixOrHierarchy &&
                'columns' in matrixOrHierarchy &&
                'valueSources' in matrixOrHierarchy;
        }
    }
} 