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

module powerbitests {
    import buildSelector = powerbitests.helpers.buildSelectorForColumn;

    describe("GradientUtils", () => {
        it("getFillRuleRole with fillRule", () => {
            let desc: powerbi.data.DataViewObjectDescriptors = {
                test: {
                    displayName: "displayName",
                    properties: {
                        fillRule: {
                            displayName: "fillRule",
                            type: { fillRule: {} },
                            rule: {
                                inputRole: "inputRoleValue"
                            }
                        }
                    }
                }
            };
            expect(powerbi.visuals.GradientUtils.getFillRuleRole(desc)).toBe("inputRoleValue");
        });

        it("getFillRuleRole without fillRule", () => {
            let desc: powerbi.data.DataViewObjectDescriptors = {
                test: {
                    displayName: "displayName",
                    properties: {
                        fill: {
                            displayName: "fill",
                            type: { fill: { solid: { color: true } } }
                        }
                    }
                }
            };
            expect(powerbi.visuals.GradientUtils.getFillRuleRole(desc)).toBeUndefined();
        });

        it("getFillRule", () => {
            let objectDefns: powerbi.data.DataViewObjectDefinitions = {
                dataPoint: [
                    { properties: { fill: { solid: { color: "#FF0000" } } } },
                    { properties: { fill: { solid: { color: "#00FF00" } } } },
                    { properties: { fill: { solid: { color: "#0000FF" } } } },
                    { properties: { fill: { solid: { color: "#000000" } } } }
                ]
            };
            let fillRule = powerbi.visuals.GradientUtils.getFillRule(objectDefns);
            expect(fillRule).toBeUndefined();

            let fillRuleDefinition = {
                linearGradient2: {
                    min: { color: powerbi.data.SQExprBuilder.text('#ff0000') },
                    max: { color: powerbi.data.SQExprBuilder.text('#0000ff') },
                }
            };

            objectDefns = {
                dataPoint: [
                    { properties: { fillRule: fillRuleDefinition } },
                    { properties: { fill: { solid: { color: "#00FF00" } } }, selector: buildSelector("q", "data1") },
                    { properties: { fill: { solid: { color: "#0000FF" } } }, selector: buildSelector("q", "data2") },
                    { properties: { fill: { solid: { color: "#000000" } } }, selector: buildSelector("q", "data3") }
                ]
            };
            fillRule = powerbi.visuals.GradientUtils.getFillRule(objectDefns);
            expect(fillRule).toBeDefined();

            objectDefns = {
                dataPoint: [
                    { properties: { fill: { solid: { color: "#FF0000" } } }, selector: buildSelector("q", "data1") },
                    { properties: { fill: { solid: { color: "#00FF00" } } }, selector: buildSelector("q", "data2") },
                    { properties: { fill: { solid: { color: "#0000FF" } } }, selector: buildSelector("q", "data3") },
                    { properties: { fillRule: fillRuleDefinition } }
                ]
            };
            fillRule = powerbi.visuals.GradientUtils.getFillRule(objectDefns);
            expect(fillRule).toBeDefined();
        });
    });
}