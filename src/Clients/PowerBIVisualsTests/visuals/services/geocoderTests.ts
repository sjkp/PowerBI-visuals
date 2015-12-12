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
    import MapUtil = powerbi.visuals.MapUtil;
    import services = powerbi.visuals.services;

    describe("GeocodingManagerTests", () => {
        describe("services.isCategoryType", () => {
            it("GeocodingManager.CategoryTypes.Address", () => {
                expect(services.isCategoryType(MapUtil.CategoryTypes.Address)).toBeTruthy();
            });

            it("GeocodingManager.CategoryTypes.City", () => {
                expect(services.isCategoryType(MapUtil.CategoryTypes.City)).toBeTruthy();
            });

            it("GeocodingManager.CategoryTypes.Continent", () => {
                expect(services.isCategoryType(MapUtil.CategoryTypes.Continent)).toBeTruthy();
            });

            it("GeocodingManager.CategoryTypes Country", () => {
                expect(services.isCategoryType("Country")).toBeTruthy(); // Country is special
            });

            it("GeocodingManager.CategoryTypes.County", () => {
                expect(services.isCategoryType(MapUtil.CategoryTypes.County)).toBeTruthy();
            });

            it("GeocodingManager.CategoryTypes.Longitude", () => {
                expect(services.isCategoryType(MapUtil.CategoryTypes.Longitude)).toBeTruthy();
            });

            it("GeocodingManager.CategoryTypes.Latitude", () => {
                expect(services.isCategoryType(MapUtil.CategoryTypes.Latitude)).toBeTruthy();
            });

            it("GeocodingManager.CategoryTypes.Place", () => {
                expect(services.isCategoryType(MapUtil.CategoryTypes.Place)).toBeTruthy();
            });

            it("GeocodingManager.CategoryTypes.PostalCode", () => {
                expect(services.isCategoryType(MapUtil.CategoryTypes.PostalCode)).toBeTruthy();
            });

            it("GeocodingManager.CategoryTypes.StateOrProvince", () => {
                expect(services.isCategoryType(MapUtil.CategoryTypes.StateOrProvince)).toBeTruthy();
            });
           
            it("GeocodingManager.CategoryTypes empty", () => {
                expect(services.isCategoryType("")).toBeFalsy();
            });
        });
    });
} 