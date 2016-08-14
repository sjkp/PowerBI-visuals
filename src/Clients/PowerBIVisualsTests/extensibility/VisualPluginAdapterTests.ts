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

module powerbitests {

    describe("visualPluginTranslator", () => {

        describe("Capabilities", () => {

            it("should gracefully handle missing properties", () => {
                let capabilities = {};
                let plugin = createVisualPlugin(capabilities);
                powerbi.extensibility.translateVisualPlugin(plugin);

                expect(plugin.capabilities).toBe(capabilities);
            });

            it("DataRoles - should ignore invalid properties", () => {
                let badRole = "InvalidRole";
                let capabilities = {
                    dataRoles: [
                        {
                            "name": "a",
                            "kind": badRole,
                            "displayName": "a"
                        }
                    ]
                };
                let plugin = createVisualPlugin(capabilities);
                powerbi.extensibility.translateVisualPlugin(plugin);

                let dataRoles = plugin.capabilities.dataRoles;
                expect(dataRoles[0].kind).toBe(badRole);
            });

            it("DataRoles - should translate kind from string to enums", () => {
                let capabilities = {
                    dataRoles: [
                        {
                            "name": "a",
                            "kind": "Grouping",
                            "displayName": "a"
                        },
                        {
                            "name": "b",
                            "kind": "Measure",
                            "displayName": "b"
                        },
                        {
                            "name": "c",
                            "kind": "GroupingOrMeasure",
                            "displayName": "c"
                        }
                    ]
                };
                let plugin = createVisualPlugin(capabilities);
                powerbi.extensibility.translateVisualPlugin(plugin);

                let dataRoles = plugin.capabilities.dataRoles;
                expect(dataRoles[0].kind).toBe(powerbi.VisualDataRoleKind.Grouping);
                expect(dataRoles[1].kind).toBe(powerbi.VisualDataRoleKind.Measure);
                expect(dataRoles[2].kind).toBe(powerbi.VisualDataRoleKind.GroupingOrMeasure);
            });

            it("Objects - should translate enumeration into enumeration objects", () => {
                let enumeration = [
                    {
                        "displayName": "Display Name 1",
                        "value": "value1"
                    },
                    {
                        "displayName": "Display Name 2",
                        "value": "value2"
                    },
                    {
                        "displayName": "Display Name 3",
                        "value": "value3"
                    }
                ];
                let capabilities = {
                    objects: {
                        myObject: {
                            displayName: "Obj",
                            properties: {
                                "myProperty": {
                                    "displayName": "Prop",
                                    "type": {
                                        "enumeration": _.clone(enumeration)
                                    }
                                }
                            }
                        }
                    }
                };
                let plugin = createVisualPlugin(capabilities);
                powerbi.extensibility.translateVisualPlugin(plugin);

                let enums = plugin.capabilities.objects['myObject'].properties['myProperty'].type['enumeration'];
                expect(enums.constructor.name).toBe('EnumType');
                expect(enums.members()).toEqual(enumeration);
            });
        });
    });

    function createVisualPlugin(capabilities): powerbi.IVisualPlugin {
        return {
            name: 'visualPluginName',
            apiVersion: '1.0.0',
            capabilities: capabilities,
            custom: true,
            create: () => null
        };
    }
}