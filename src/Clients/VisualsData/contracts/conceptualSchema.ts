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
    import ArrayNamedItems = jsCommon.ArrayNamedItems;

    export class ConceptualSchema {
        public entities: ArrayNamedItems<ConceptualEntity>;
        public capabilities: ConceptualCapabilities;

        /** Indicates whether the user can edit this ConceptualSchema.  This is used to enable/disable model authoring UX. */
        public canEdit: boolean;

        public findProperty(entityName: string, propertyName: string): ConceptualProperty {
            let entity = this.entities.withName(entityName);
            if (!entity || _.isEmpty(entity.properties))
                return;

            return entity.properties.withName(propertyName);
        }

        public findHierarchy(entityName: string, name: string): ConceptualHierarchy {
            let entity = this.entities.withName(entityName);
            if (!entity || _.isEmpty(entity.hierarchies))
                return;

            return entity.hierarchies.withName(name);
        }

        public findHierarchyByVariation(
            variationEntityName: string,
            variationColumnName: string,
            variationName: string,
            hierarchyName: string): ConceptualHierarchy {

            let targetEntity = this.findTargetEntityOfVariation(variationEntityName, variationColumnName, variationName);
            if (!targetEntity || _.isEmpty(targetEntity.hierarchies))
                return;

            return targetEntity.hierarchies.withName(hierarchyName);
        }

        public findTargetEntityOfVariation(
            variationEntityName: string,
            variationColumnName: string,
            variationName: string): ConceptualEntity {

            let variationEntity = this.entities.withName(variationEntityName);
            if (!variationEntity || _.isEmpty(variationEntity.properties))
                return;

            let variationProperty = variationEntity.properties.withName(variationColumnName);
            if (!variationProperty)
                return;

            let variationColumn = variationProperty.column;
            if (!variationColumn || _.isEmpty(variationColumn.variations))
                return;

            let variation = variationColumn.variations.withName(variationName);
            if (variation)
                return variation.navigationProperty ? variation.navigationProperty.targetEntity : variationEntity;
        }

        /**
        * Returns the first property of the entity whose kpi is tied to kpiProperty
        */
        public findPropertyWithKpi(entityName: string, kpiProperty: ConceptualProperty): ConceptualProperty {
            debug.assertValue(kpiProperty, 'kpiProperty');

            let entity = this.entities.withName(entityName);
            if (!entity || _.isEmpty(entity.properties))
                return;

            for (let prop of entity.properties) {
                if (prop &&
                    prop.measure &&
                    prop.measure.kpi &&
                    (prop.measure.kpi.status === kpiProperty || prop.measure.kpi.goal === kpiProperty))
                    return prop;
            }

            return;
        }
    }

    export interface ConceptualCapabilities {
        discourageQueryAggregateUsage: boolean;
        normalizedFiveStateKpiRange: boolean;
        supportsMedian: boolean;
        supportsPercentile: boolean;
        supportsScopedEval: boolean;
    }

    export interface ConceptualPropertyItemContainer {
        properties: ArrayNamedItems<ConceptualProperty>;
        hierarchies?: ArrayNamedItems<ConceptualHierarchy>;
        displayFolders?: ArrayNamedItems<ConceptualDisplayFolder>;
    }

    export interface ConceptualPropertyItem {
        name: string;
        displayName: string;
        hidden?: boolean;
    }

    export interface ConceptualEntity extends ConceptualPropertyItemContainer {
        name: string;
        displayName: string;
        visibility?: ConceptualVisibility;
        calculated?: boolean;
        queryable?: ConceptualQueryableState;
        navigationProperties?: ArrayNamedItems<ConceptualNavigationProperty>;
    }

    export interface ConceptualDisplayFolder extends ConceptualPropertyItem, ConceptualPropertyItemContainer {
    }

    export interface ConceptualProperty extends ConceptualPropertyItem {
        type: ValueType;
        kind: ConceptualPropertyKind;
        format?: string;
        column?: ConceptualColumn;
        queryable?: ConceptualQueryableState;
        measure?: ConceptualMeasure;
        kpiValue?: ConceptualProperty;
    }

    export interface ConceptualHierarchy extends ConceptualPropertyItem {
        levels: ArrayNamedItems<ConceptualHierarchyLevel>;
    }

    export interface ConceptualHierarchyLevel extends ConceptualPropertyItem {
        column: ConceptualProperty;
    }

    export interface ConceptualNavigationProperty {
        name: string;
        isActive: boolean;
        sourceColumn?: ConceptualColumn;
        targetEntity: ConceptualEntity;
        sourceMultiplicity: ConceptualMultiplicity;
        targetMultiplicity: ConceptualMultiplicity;
    }

    export interface ConceptualVariationSource {
        name: string;
        isDefault: boolean;
        navigationProperty?: ConceptualNavigationProperty;
        defaultHierarchy?: ConceptualHierarchy;
        defaultProperty?: ConceptualProperty;
    }

    export interface ConceptualColumn {
        defaultAggregate?: ConceptualDefaultAggregate;
        keys?: ArrayNamedItems<ConceptualProperty>;
        idOnEntityKey?: boolean;
        calculated?: boolean;
        defaultValue?: SQConstantExpr;
        variations?: ArrayNamedItems<ConceptualVariationSource>;
        aggregateBehavior?: ConceptualAggregateBehavior;
        groupingDefinition?: ConceptualGroupingDefinition;
    }
        
    export interface ConceptualGroupingDefinition {
        binningDefinition?: ConceptualBinningDefinition;
    }

    export interface ConceptualBinningDefinition {
        binSize?: ConceptualBinSize;
    }

    export interface ConceptualBinSize {
        value: number;
        unit: ConceptualBinUnit;
    }

    export interface ConceptualMeasure {
        kpi?: ConceptualPropertyKpi;
    }

    export interface ConceptualPropertyKpi {
        statusMetadata: DataViewKpiColumnMetadata;
        trendMetadata?: DataViewKpiColumnMetadata;
        status?: ConceptualProperty;
        goal?: ConceptualProperty;
        trend?: ConceptualProperty;
    }

    export const enum ConceptualVisibility {
        Visible = 0,
        Hidden = 1,
        ShowAsVariationsOnly = 2,
        IsPrivate = 4,
    }

    export const enum ConceptualQueryableState {
        Queryable = 0,
        Error = 1,
    }

    export const enum ConceptualBinUnit {
        Number = 0,
        Percent = 1,
        Log = 2,
        Percentile = 3,
        Year = 4,
        Quarter = 5,
        Month = 6,
        Week = 7,
        Day = 8,
        Hour = 9,
        Minute = 10,
        Second = 11,
    }

    export const enum ConceptualMultiplicity {
        ZeroOrOne = 0,
        One = 1,
        Many = 2,
    }

    export const enum ConceptualPropertyKind {
        Column,
        Measure,
        Kpi,
    }

    export const enum ConceptualDefaultAggregate {
        Default,
        None,
        Sum,
        Count,
        Min,
        Max,
        Average,
        DistinctCount,
    }

    // TODO: Remove this (replaced by ValueType)
    export enum ConceptualDataCategory {
        None,
        Address,
        City,
        Company,
        Continent,
        Country,
        County,
        Date,
        Image,
        ImageUrl,
        Latitude,
        Longitude,
        Organization,
        Place,
        PostalCode,
        Product,
        StateOrProvince,
        WebUrl,
    }

    export const enum ConceptualAggregateBehavior {
        Default,
        DiscourageAcrossGroups,
    }
}