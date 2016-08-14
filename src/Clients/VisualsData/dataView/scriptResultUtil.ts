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
    import ArrayNamedItems = jsCommon.ArrayNamedItems;
    import StringExtensions = jsCommon.StringExtensions;
    import FederatedConceptualSchema = powerbi.data.FederatedConceptualSchema;
    import FieldExprColumnPattern = powerbi.data.FieldExprColumnPattern;
    import FieldExprColumnAggrPattern = powerbi.data.FieldExprColumnAggrPattern;
    import FieldExprColumnHierarchyLevelVariationPattern = powerbi.data.FieldExprColumnHierarchyLevelVariationPattern;
    import FieldExprEntityPattern = powerbi.data.FieldExprEntityPattern;
    import FieldExprEntityAggrPattern = powerbi.data.FieldExprEntityAggrPattern;
    import FieldExprHierarchyPattern = powerbi.data.FieldExprHierarchyPattern;
    import FieldExprHierarchyLevelPattern = powerbi.data.FieldExprHierarchyLevelPattern;
    import FieldExprHierarchyLevelAggrPattern = powerbi.data.FieldExprHierarchyLevelAggrPattern;
    import FieldExprMeasurePattern = powerbi.data.FieldExprMeasurePattern;
    import FieldExprPattern = powerbi.data.FieldExprPattern;
    import FieldExprPercentilePattern = powerbi.data.FieldExprPercentilePattern;
    import FieldExprSelectRefPattern = powerbi.data.FieldExprSelectRefPattern;
    import FieldExprPercentOfGrandTotalPattern = powerbi.data.FieldExprPercentOfGrandTotalPattern;
    import IFieldExprPatternVisitor = powerbi.data.IFieldExprPatternVisitor;
    import QueryProjectionsByRole = data.QueryProjectionsByRole;

    export interface ScriptResult {
        source: string;
        provider: string;
    }

    export module ScriptResultUtil {

        export function findScriptResult(dataViewMappings: DataViewMapping[] | data.CompiledDataViewMapping[]): DataViewScriptResultMapping | data.CompiledDataViewScriptResultMapping {
            if (dataViewMappings && dataViewMappings.length === 1) {
                return dataViewMappings[0].scriptResult;
            }

            return undefined;
        }

        export function extractScriptResult(dataViewMappings: data.CompiledDataViewMapping[]): ScriptResult {
            let scriptResult = findScriptResult(dataViewMappings);
            if (scriptResult) {
                let objects = dataViewMappings[0].metadata.objects;
                let source: string = DataViewObjects.getValue<string>(objects, scriptResult.script.source);
                let provider: string = DataViewObjects.getValue<string>(objects, scriptResult.script.provider);
                return {
                    source: source,
                    provider: provider
                };
            }

            return undefined;
        }

        export function extractScriptResultFromVisualConfig(dataViewMappings: DataViewMapping[], objects: powerbi.data.DataViewObjectDefinitions): ScriptResult {
            let scriptResult = findScriptResult(dataViewMappings);
            if (scriptResult && objects) {
                let scriptSource = <data.SQConstantExpr>data.DataViewObjectDefinitions.getValue(objects, scriptResult.script.source, null);
                let provider = <data.SQConstantExpr>data.DataViewObjectDefinitions.getValue(objects, scriptResult.script.provider, null);
                return {
                    source: scriptSource ? scriptSource.value : null,
                    provider: provider ? provider.value : null
                };
            }

            return undefined;
        }

        export function getScriptInput(projections: QueryProjectionsByRole, selects: ArrayNamedItems<data.NamedSQExpr>, schema: FederatedConceptualSchema): data.ScriptInput {
            let scriptInput: data.ScriptInput = {
                VariableName: "dataset",
                Columns: []
            };

            // Go over all the projections, and create an input column according to the order
            // of the projections (including duplicate expressions)
            if (projections && selects && !_.isEmpty(selects)) {
                let scriptInputColumnNames: string[] = [];
                let scriptInputColumns: data.ScriptInputColumn[] = [];
                for (let role in projections) {
                    for (let projection of projections[role].all()) {
                        let select = selects.withName(projection.queryRef);
                        if (select) {
                            let scriptInputColumn = <data.ScriptInputColumn>{
                                QueryName: select.name,
                                Name: FieldExprPattern.visit(select.expr, new ScriptInputColumnNameVisitor(schema))
                            };

                            scriptInputColumns.push(scriptInputColumn);
                            scriptInputColumnNames.push(scriptInputColumn.Name);
                        }
                    }
                }

                // Make sure the names of the columns are unique
                scriptInputColumnNames = StringExtensions.ensureUniqueNames(scriptInputColumnNames);

                // Update the names of the columns
                for (let i = 0; i < scriptInputColumnNames.length; i++) {
                    let scriptInputColumn = scriptInputColumns[i];
                    scriptInputColumn.Name = scriptInputColumnNames[i];
                }

                scriptInput.Columns = scriptInputColumns;
            }

            return scriptInput;
        }

        class ScriptInputColumnNameVisitor implements IFieldExprPatternVisitor<string>
        {
            private federatedSchema: FederatedConceptualSchema;

            constructor(federatedSchema: FederatedConceptualSchema) {
                this.federatedSchema = federatedSchema;
            }

            public visitColumn(column: FieldExprColumnPattern): string {
                return ScriptInputColumnNameVisitor.getNameForProperty(column, this.federatedSchema);
            }

            public visitColumnAggr(columnAggr: FieldExprColumnAggrPattern): string {
                return ScriptInputColumnNameVisitor.getNameForProperty(columnAggr, this.federatedSchema);
            }

            public visitColumnHierarchyLevelVariation(columnHierarchyLevelVariation: FieldExprColumnHierarchyLevelVariationPattern): string {
                return ScriptInputColumnNameVisitor.getVariationLevelName(columnHierarchyLevelVariation, this.federatedSchema);
            }

            public visitEntity(entity: FieldExprEntityPattern): string {
                return entity.entity;
            }

            public visitEntityAggr(entityAggr: FieldExprEntityAggrPattern): string {
                return entityAggr.entity;
            }

            public visitHierarchy(hierarchy: FieldExprHierarchyPattern): string {
                return ScriptInputColumnNameVisitor.getNameForHierarchy(hierarchy, this.federatedSchema);
            }

            public visitHierarchyLevel(hierarchyLevel: FieldExprHierarchyLevelPattern): string {
                /*Hierarchy levels are not supported yet*/
                return;
            }

            public visitHierarchyLevelAggr(hierarchyLevelAggr: FieldExprHierarchyLevelAggrPattern): string {
                return ScriptInputColumnNameVisitor.getNameForProperty(hierarchyLevelAggr, this.federatedSchema);
            }

            public visitMeasure(measure: FieldExprMeasurePattern): string {
                return ScriptInputColumnNameVisitor.getNameForProperty(measure, this.federatedSchema);
            }

            public visitSelectRef(selectRef: FieldExprSelectRefPattern): string {
                return FieldExprPattern.visit(selectRef, this);
            }

            public visitPercentile(percentile: FieldExprPercentilePattern): string {
                return FieldExprPattern.visit(percentile.arg, this);
            }

            public visitPercentOfGrandTotal(percentOfGrandTotal: FieldExprPercentOfGrandTotalPattern): string {
                return FieldExprPattern.visit(percentOfGrandTotal.baseExpr, this);
            }

            private static getNameForHierarchy(pattern: FieldExprHierarchyPattern, federatedScheam: FederatedConceptualSchema): string {
                debug.assertValue(pattern, 'pattern');

                let schema = federatedScheam.schema(pattern.schema),
                    hierarchy = schema.findHierarchy(pattern.entity, pattern.name);

                if (hierarchy)
                    return hierarchy.name;
            }

            private static getNameForProperty(pattern: data.FieldExprPropertyPattern, federatedSchema: FederatedConceptualSchema): string {
                debug.assertValue(pattern, 'pattern');

                let schema = federatedSchema.schema(pattern.schema),
                    property = schema.findProperty(pattern.entity, pattern.name);

                if (property)
                    return property.name;
            }

            private static getVariationLevelName(pattern: FieldExprColumnHierarchyLevelVariationPattern, federatedSchema: FederatedConceptualSchema): string {
                debug.assertValue(pattern, 'pattern');

                let source = pattern.source;
                let prop = federatedSchema.schema(source.schema).findProperty(source.entity, source.name);
                if (!prop)
                    return;

                let variations = prop.column.variations;
                for (let variation of variations)
                    if (variation.name === pattern.variationName)
                        for (let level of variation.defaultHierarchy.levels)
                            if (level.name === pattern.level.level)
                                return level.column.name;
            }
        }
    }
}