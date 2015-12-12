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
    export interface ScriptResult {
        source: string;
        provider: string;
    }

    export module ScriptResultUtil {
        export function findScriptResult(dataViewMappings: DataViewMapping[]| data.CompiledDataViewMapping[]): DataViewScriptResultMapping | data.CompiledDataViewScriptResultMapping {
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
                let scriptSource= <data.SQConstantExpr>data.DataViewObjectDefinitions.getValue(objects, scriptResult.script.source, null);
                let provider = <data.SQConstantExpr>data.DataViewObjectDefinitions.getValue(objects, scriptResult.script.provider, null);
                return {
                    source: scriptSource ? scriptSource.value : null,
                    provider: provider ? provider.value : null
                };
            }

            return undefined;
        }
    }
}