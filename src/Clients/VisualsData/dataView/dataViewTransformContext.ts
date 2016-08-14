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

module powerbi.data {
    import RoleKindByQueryRef = powerbi.DataViewAnalysis.RoleKindByQueryRef;

    /**
     * A property bag containing information about a DataViewTransform session, including input arguments and some values derived from the input arguments.
     * 
     * This interface is part of the internal implementation of DataViewTransform and is subject to frequent changes.
     * 
     * All properties in this context interface are agnostic to any specific "split" in the transform.
     * E.g. DataViewTransformContext.transforms.splits has the select indices in each split, but an instance of this context is not tied to a particular split.
     * 
     * Also, DataViewTransformContext does not include a property for the dataView object(s) in transformation, because almost all of the existing DataViewTransform functions
     * handles one dataView at a time, and DataViewTransformContext should not have a property containing the dataView for a specific split.
     * 
     * And to avoid confusion, this DataViewTransformContext does not include a property for the visual dataView, because almost all functions in DataViewTransform 
     * are chained together by taking the output DataView from one function and use it as the input of the next.  It never needs to get back to the very original prototype.   
     *
     * ////////////////////////////////////////////////////////////////////////////////////////////////////////////
     * 2016/06/29 Notes about visualCapabilitiesRoleMappings/visualCapabilitiesDataViewKinds vs. applicableRoleMappings/applicableDataViewKinds:
     * 
     * - Short version - 
     * For the time being, use visualCapabilitiesRoleMappings/visualCapabilitiesDataViewKinds for the essential transforms that would otherwise 
     * crash the visuals code if not performed (such as DataViewTransform.transformSelects()).
     * 
     * Use applicableRoleMappings/applicableDataViewKinds for the more advanced transforms that procude the correct visual dataView (such as categorical concatentation).
     * 
     * - Long version -
     * visualCapabilitiesRoleMappings is the full list of role mappings as specified in Visual Capabilities, whereas applicableRoleMappings is the
     * actual applicable one(s) based on the select fields in each of the role buckets.
     *  
     * There is a bug (VSTS 7427800) in DataViewTransformActionsSerializer such that some DataViewTransformActions converted from VisualElements will contain incorrect values.
     * 
     * With incorrect DataViewTransformActions input, DataViewAnalysis cannot possibly compute the correct applicableRoleMappings, and hence the
     * visual dataView from DataViewTransform will be incorrect.  This is why sometimes when you open a report in PBI Portal, the initial rendering of some visuals
     * are incorrect (most frequently on combo chart).
     * 
     * However, no one has fixed or complained about it yet because the visuals will automatically re-render correctly within a couple seconds, thanks to the
     * automatic query re-generation and re-execution that always follow after the initial rendering.  The DataViewTransformActions from this re-generated query 
     * will be correct and the visuals will then render with the correctly transformed visual dataView.
     * 
     * Because of the above, the existing DataViewTransform code thus far has never relied on applicableRoleMappings for deciding whether to perform the very essential transforms
     * such as DataViewTransform.transformSelects(), because without which the dataView will be missing some important properties and will lead to crashes in visuals code.   
     * As long as the relevant dataView kind is in visualCapabilitiesDataViewKinds, those transform operations will get carried out, even if it is not in applicableDataViewKinds.
     * 
     * Unfortunately, there are also some transform operations that requires applicableRoleMappings, and hence DataViewTransformContext has both sets of properties for now.
     * 
     * When the bug in DataViewTransformActionsSerializer gets fixed and DataViewTransformActions is always correct,
     * then visualCapabilitiesRoleMappings/visualCapabilitiesDataViewKinds can be completely replaced by applicableRoleMappings/applicableDataViewKinds in DataViewTransform.
     */
    export interface DataViewTransformContext {
        /**
         * The metadata property of the query DataView.
         */
        queryDataViewMetadata: DataViewMetadata;

        /**
         * From Visual Capabilities.  Can be undefined.
         */
        objectDescriptors?: DataViewObjectDescriptors;

        /**
         * From Visual Capabilities.  Can be undefined.
         */
        dataRoles?: VisualDataRole[];

        transforms: DataViewTransformActions;

        colorAllocatorFactory: IColorAllocatorFactory;
        
        /**
         * The select transforms for this DataViewTransform session.
         * This property contains the same object as this.transforms.selects.
         * 
         * Can be undefined or empty.  Can contain undefined elements.
         */
        selectTransforms?: DataViewSelectTransform[];

        /** This property contains the same object as this.transforms.roles.ordering.  Can be undefined. */
        projectionOrdering?: DataViewProjectionOrdering;

        /** This property contains the same object as this.transforms.roles.activeItems.  Can be undefined. */
        projectionActiveItems?: DataViewProjectionActiveItems;
        
        /** The mapping from queryRef to VisualDataRoleKind value (Grouping, Measure, etc), computed from query DataView's metadata. */
        roleKindByQueryRef: RoleKindByQueryRef;

        /** The mapping from role name to query projection. */
        queryProjectionsByRole: QueryProjectionsByRole;

        /**
         * The full list of possible target dataView kinds in this DataViewTransform session, as specified in Visual Capabilities role mappings.
         * 
         * Can be undefined.
         * 
         * Note: When applicableRoleMappings becomes reliable, all usages of this property should use applicableRoleMappings instead.
         */
        visualCapabilitiesRoleMappings?: DataViewMapping[];

        /**
         * All possible target dataView kinds in this DataViewTransform session, which is taken from all possible dataView kinds listed in visual capabilities role mapping.
         * 
         * Note: When applicableDataViewKinds becomes reliable, all usages of this property should use applicableDataViewKinds instead.
         */
        visualCapabilitiesDataViewKinds: StandardDataViewKinds;

        /**
         * The applicable DataViewMappings for this transform, as computed by DataViewAnalysis.
         * This property is undefined if there is no supported DataViewMappings for the other specified inputs.
         * 
         * Note: There is currently a bug in DataViewTransformActionsSerializer that leads to incorrect DataViewTransformActions.
         * As a result, this property can contain incorrect value until the query is regenerated and this property recomputed.
         */
        applicableRoleMappings?: DataViewMapping[];
        
        /**
         * The applicable dataView kinds of this DataViewTransform session, as computed from applicableRoleMappings.
         * 
         * Note: There is currently a bug in DataViewTransformActionsSerializer that leads to incorrect DataViewTransformActions.
         * As a result, this property can contain incorrect value until the query is regenerated and this property recomputed.
         */
        applicableDataViewKinds: StandardDataViewKinds;
    }

    export module DataViewTransformContext {
        /**
         * Creates an object that all properties in the DataViewTransformContext interface.
         *
         * @param queryDataViewMetadata The metadata property of the query DataView.
         * @param objectDescriptors From Visual Capabilities.  Can be undefined.
         * @param dataViewMappings From Visual Capabilities.  Can be undefined.
         * @param dataRoles From Visual Capabilities.  Can be undefined.
         * @param transforms
         * @param colorAllocatorFactory
         */
        export function create(
            queryDataViewMetadata: DataViewMetadata,
            objectDescriptors: DataViewObjectDescriptors,
            dataViewMappings: DataViewMapping[],
            dataRoles: VisualDataRole[],
            transforms: DataViewTransformActions,
            colorAllocatorFactory: IColorAllocatorFactory): DataViewTransformContext {
            debug.assertValue(queryDataViewMetadata, 'queryDataViewMetadata');
            debug.assertAnyValue(objectDescriptors, 'objectDescriptors');
            debug.assertAnyValue(dataViewMappings, 'dataViewMappings');
            debug.assertAnyValue(dataRoles, 'dataRoles');
            debug.assertValue(transforms, 'transforms');
            debug.assertValue(colorAllocatorFactory, 'colorAllocatorFactory');

            let selectTransforms = transforms.selects;
            let projectionActiveItems = transforms.roles && transforms.roles.activeItems;

            let roleKindByQueryRef = !_.isEmpty(selectTransforms) ?
                DataViewSelectTransform.createRoleKindFromMetadata(selectTransforms, queryDataViewMetadata) :
                <RoleKindByQueryRef>{};
            let queryProjectionsByRole = DataViewSelectTransform.projectionsFromSelects(selectTransforms, projectionActiveItems);
            let dataViewMappingResult = DataViewAnalysis.chooseDataViewMappings(queryProjectionsByRole, dataViewMappings, roleKindByQueryRef, objectDescriptors, transforms.objects);
            let applicableRoleMappings = dataViewMappingResult.supportedMappings;

            let context: DataViewTransformContext = {
                queryDataViewMetadata: queryDataViewMetadata,
                objectDescriptors: objectDescriptors,
                dataRoles: dataRoles,
                transforms: transforms,
                colorAllocatorFactory: colorAllocatorFactory,
                selectTransforms: selectTransforms,
                projectionOrdering: transforms.roles && transforms.roles.ordering,
                projectionActiveItems: projectionActiveItems,
                roleKindByQueryRef: roleKindByQueryRef,
                queryProjectionsByRole: queryProjectionsByRole,
                visualCapabilitiesRoleMappings: dataViewMappings,
                visualCapabilitiesDataViewKinds: getTargetDataViewKinds(dataViewMappings),
                applicableRoleMappings: applicableRoleMappings,
                applicableDataViewKinds: getTargetDataViewKinds(applicableRoleMappings),
            };

            return context;
        }

        function getTargetDataViewKinds(roleMappings: DataViewMapping[]): StandardDataViewKinds {
            debug.assertAnyValue(roleMappings, 'roleMappings');

            if (!roleMappings)
                return StandardDataViewKinds.None;

            let result = StandardDataViewKinds.None;
            for (let roleMapping of roleMappings) {
                if (roleMapping.categorical)
                    result |= StandardDataViewKinds.Categorical;
                if (roleMapping.matrix)
                    result |= StandardDataViewKinds.Matrix;
                if (roleMapping.single)
                    result |= StandardDataViewKinds.Single;
                if (roleMapping.table)
                    result |= StandardDataViewKinds.Table;
                if (roleMapping.tree)
                    result |= StandardDataViewKinds.Tree;
            }
            return result;
        }
    }
}