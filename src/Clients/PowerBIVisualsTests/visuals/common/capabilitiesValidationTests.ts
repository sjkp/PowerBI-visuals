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
    powerbitests.mocks.setLocale();

    describe("Capbalities Validation", () => {
        it("VisualFactory.getVisuals - categorical - various dataViews", () => {
            let allVisualPlugins = _.filter(_.values(powerbi.visuals.plugins), plugin => !plugin.custom);
            let failures = 0;

            for (let i = 0; i < allVisualPlugins.length; i++) {
                let visualPlugin: powerbi.IVisualPlugin = allVisualPlugins[i];

                let roles = visualPlugin.capabilities.dataRoles;
                if (roles) {
                    for (let i = 0, ilen = roles.length; i < ilen; i++) {
                        let role = roles[i];
                        if (!role.displayName) {
                            debug.assertFail(visualPlugin.name + " should have a displayName");
                            failures++;
                        }
                    }
                }
            }
            expect(failures).toBe(0);
        });
    });
}
