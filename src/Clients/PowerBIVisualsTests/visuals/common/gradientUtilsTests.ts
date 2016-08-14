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
    import DataViewObjectDefinitions = powerbi.data.DataViewObjectDefinitions;
    import DataViewObjectDescriptors = powerbi.data.DataViewObjectDescriptors;
    import GradientSettings = powerbi.visuals.GradientSettings;
    import GradientUtils = powerbi.visuals.GradientUtils;

    describe("GradientUtils", () => {
        it("getFillRuleRole with fillRule", () => {
            let desc: DataViewObjectDescriptors = {
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
            expect(GradientUtils.getFillRuleRole(desc)).toBe("inputRoleValue");
        });

        it("getFillRuleRole without fillRule", () => {
            let desc: DataViewObjectDescriptors = {
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
            expect(GradientUtils.getFillRuleRole(desc)).toBeUndefined();
        });

        it("getFillRule", () => {
            let objectDefns: DataViewObjectDefinitions = {
                dataPoint: [
                    { properties: { fill: { solid: { color: "#FF0000" } } } },
                    { properties: { fill: { solid: { color: "#00FF00" } } } },
                    { properties: { fill: { solid: { color: "#0000FF" } } } },
                    { properties: { fill: { solid: { color: "#000000" } } } }
                ]
            };
            let fillRule = GradientUtils.getFillRule(objectDefns);
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
                    { properties: { fill: { solid: { color: "#00FF00" } } }, selector: buildSelector("q", mocks.dataViewScopeIdentity("data1")) },
                    { properties: { fill: { solid: { color: "#0000FF" } } }, selector: buildSelector("q", mocks.dataViewScopeIdentity("data2")) },
                    { properties: { fill: { solid: { color: "#000000" } } }, selector: buildSelector("q", mocks.dataViewScopeIdentity("data3")) }
                ]
            };
            fillRule = GradientUtils.getFillRule(objectDefns);
            expect(fillRule).toBeDefined();

            objectDefns = {
                dataPoint: [
                    { properties: { fill: { solid: { color: "#FF0000" } } }, selector: buildSelector("q", mocks.dataViewScopeIdentity("data1")) },
                    { properties: { fill: { solid: { color: "#00FF00" } } }, selector: buildSelector("q", mocks.dataViewScopeIdentity("data2")) },
                    { properties: { fill: { solid: { color: "#0000FF" } } }, selector: buildSelector("q", mocks.dataViewScopeIdentity("data3")) },
                    { properties: { fillRule: fillRuleDefinition } }
                ]
            };
            fillRule = GradientUtils.getFillRule(objectDefns);
            expect(fillRule).toBeDefined();
        });
        
        it('getGradientBarColors - non-diverging midColor is ignored', () => {
            let settings: GradientSettings = {
                diverging: false,
                minColor: '#ffffff',
                midColor: '#777777',
                maxColor: '#000000',
            };
            
            expect(GradientUtils.getGradientBarColors(settings)).toBe('#ffffff,#000000');
        });
        
        it('getGradientBarColors - Diverging', () => {
            let settings: GradientSettings = {
                diverging: true,
                minColor: '#ffffff',
                midColor: '#777777',
                maxColor: '#000000',
            };
            
            expect(GradientUtils.getGradientBarColors(settings)).toBe('#ffffff,#777777,#000000');
        });
    });
}
