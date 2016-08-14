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
    import getLocalizedString = powerbi.visuals.valueFormatter.getLocalizedString;
     
    describe("GeoTaggingAnalyzerService", () => {
        let geoTaggingAnalyzerService: powerbi.IGeoTaggingAnalyzerService;
        
        beforeEach(() => {
            geoTaggingAnalyzerService = powerbi.createGeoTaggingAnalyzerService((stringId: string) => getLocalizedString(stringId));
        });       

        it("can detect longitude and latitude fields", () => {
            let latitudeString = getLocalizedString("GeotaggingString_Latitude");
            expect(geoTaggingAnalyzerService.isLongitudeOrLatitude(latitudeString)).toBe(true);
            expect(geoTaggingAnalyzerService.isGeographic(latitudeString)).toBe(true);
            expect(geoTaggingAnalyzerService.isGeocodable(latitudeString)).toBe(false);

            let shortLatitudeString = getLocalizedString("GeotaggingString_Latitude_Short");
            expect(geoTaggingAnalyzerService.isLongitudeOrLatitude(shortLatitudeString)).toBe(true);
            expect(geoTaggingAnalyzerService.isGeographic(shortLatitudeString)).toBe(true);
            expect(geoTaggingAnalyzerService.isGeocodable(shortLatitudeString)).toBe(false);
        });

        it("can detect postal code with and without whitespace", () => {
            const postalCodeStringWithSpace = "Postal     Code";
            expect(geoTaggingAnalyzerService.isLongitudeOrLatitude(postalCodeStringWithSpace)).toBe(false);
            expect(geoTaggingAnalyzerService.isGeographic(postalCodeStringWithSpace)).toBe(true);
            expect(geoTaggingAnalyzerService.isGeocodable(postalCodeStringWithSpace)).toBe(true);

            let postalCodeStringWithoutSpace = getLocalizedString("GeotaggingString_PostalCode");
            expect(geoTaggingAnalyzerService.isLongitudeOrLatitude(postalCodeStringWithoutSpace)).toBe(false);
            expect(geoTaggingAnalyzerService.isGeographic(postalCodeStringWithoutSpace)).toBe(true);
            expect(geoTaggingAnalyzerService.isGeocodable(postalCodeStringWithoutSpace)).toBe(true);
        });

        it("can detect pluralized geocodable locations", () => {
            let citiesString = getLocalizedString("GeotaggingString_Cities");
            expect(geoTaggingAnalyzerService.isLongitudeOrLatitude(citiesString)).toBe(false);
            expect(geoTaggingAnalyzerService.isGeographic(citiesString)).toBe(true);
            expect(geoTaggingAnalyzerService.isGeocodable(citiesString)).toBe(true);

            let countriesString = getLocalizedString("GeotaggingString_Countries");
            expect(geoTaggingAnalyzerService.isLongitudeOrLatitude(countriesString)).toBe(false);
            expect(geoTaggingAnalyzerService.isGeographic(countriesString)).toBe(true);
            expect(geoTaggingAnalyzerService.isGeocodable(countriesString)).toBe(true);
        });

        it("can verify locations regardless of casing", () => {
            let citiesString = getLocalizedString("GeotaggingString_Cities");
            expect(geoTaggingAnalyzerService.isLongitudeOrLatitude(citiesString)).toBe(false);
            expect(geoTaggingAnalyzerService.isGeographic(citiesString)).toBe(true);
            expect(geoTaggingAnalyzerService.isGeocodable(citiesString)).toBe(true);
        });

        it("returns undefined fieldType for null fieldNames", () => {
            expect(geoTaggingAnalyzerService.getFieldType(undefined)).toBe(undefined);
        });

        it("returns Latitude type for latitude fieldName", () => {
            expect(geoTaggingAnalyzerService.getFieldType("latitude")).toBe("Latitude");
        });

        it("returns Latitude type for latitude using English fallback", () => {
            let germanGeoTaggingAnalyzerService = powerbi.createGeoTaggingAnalyzerService((stringId: string) => getLocalizedString(stringId));
            germanGeoTaggingAnalyzerService["GeotaggingString_Latitude"] = "breitengrad";
            expect(germanGeoTaggingAnalyzerService.getFieldType("breitengrad")).toBe("Latitude");
            expect(germanGeoTaggingAnalyzerService.getFieldType("latitude")).toBe("Latitude");
        });
        
        it("isGeoshapable uses English backup", () => {
            let germanGeoTaggingAnalyzerService = powerbi.createGeoTaggingAnalyzerService((stringId: string) => getLocalizedString(stringId));
            germanGeoTaggingAnalyzerService["GeotaggingString_State"] = "zustand";
            germanGeoTaggingAnalyzerService["GeotaggingString_Latitude"] = "breitengrad";
            expect(germanGeoTaggingAnalyzerService.isGeoshapable("zustand")).toBe(true);
            expect(germanGeoTaggingAnalyzerService.isGeoshapable("breitengrad")).toBe(false);
            expect(germanGeoTaggingAnalyzerService.isGeoshapable("state")).toBe(true);
            expect(germanGeoTaggingAnalyzerService.isGeoshapable("latitude")).toBe(false);
        });

        it("can detect non latitude fields that partially match the short versions of lat and long", () => {
            let nonLatitudeString = "population";
            expect(geoTaggingAnalyzerService.isLongitudeOrLatitude(nonLatitudeString)).toBe(false);
            nonLatitudeString = "Latency";
            expect(geoTaggingAnalyzerService.isLongitudeOrLatitude(nonLatitudeString)).toBe(false);
            nonLatitudeString = "xyzlat";
            expect(geoTaggingAnalyzerService.isLongitudeOrLatitude(nonLatitudeString)).toBe(false);
        });

        it("can detect non latitude fields that partially match the short versions of lat and long (English backup)", () => {
            let germanGeoTaggingAnalyzerService = powerbi.createGeoTaggingAnalyzerService((stringId: string) => getLocalizedString(stringId));
            germanGeoTaggingAnalyzerService["GeotaggingString_Latitude"] = "breitengrad";
            expect(germanGeoTaggingAnalyzerService.getFieldType("breitengrad")).toBe("Latitude");
            let nonLatitudeString = "population";
            expect(germanGeoTaggingAnalyzerService.isLongitudeOrLatitude(nonLatitudeString)).toBe(false);
            nonLatitudeString = "Latency";
            expect(germanGeoTaggingAnalyzerService.isLongitudeOrLatitude(nonLatitudeString)).toBe(false);
            nonLatitudeString = "xyzlat";
            expect(germanGeoTaggingAnalyzerService.isLongitudeOrLatitude(nonLatitudeString)).toBe(false);
        });

        it("can detect state field in the middle of a word", () => {
            let stateInTheMiddle = "UserState";
            expect(geoTaggingAnalyzerService.getFieldType(stateInTheMiddle)).toBe("StateOrProvince");
            stateInTheMiddle = "StateForTheUser";
            expect(geoTaggingAnalyzerService.getFieldType(stateInTheMiddle)).toBe("StateOrProvince");
            stateInTheMiddle = "xyzstatexyz";
            expect(geoTaggingAnalyzerService.getFieldType(stateInTheMiddle)).toBe("StateOrProvince");
        });

        it("can detect latitude fields that have more than one word", () => {
            let latitudeString = "Latitude value";
            expect(geoTaggingAnalyzerService.isLongitudeOrLatitude(latitudeString)).toBe(true);
            latitudeString = "value of Latitude";
            expect(geoTaggingAnalyzerService.isLongitudeOrLatitude(latitudeString)).toBe(true);
            latitudeString = "a lat b";
            expect(geoTaggingAnalyzerService.isLongitudeOrLatitude(latitudeString)).toBe(true);
            latitudeString = "lat b";
            expect(geoTaggingAnalyzerService.isLongitudeOrLatitude(latitudeString)).toBe(true);
            latitudeString = "a lat";
            expect(geoTaggingAnalyzerService.isLongitudeOrLatitude(latitudeString)).toBe(true);
        });

        it("can detect StateOrProvince", () => {
            let stateOrProvinceString = "StateOrProvince"; 
            expect(geoTaggingAnalyzerService.isGeocodable(stateOrProvinceString)).toBe(true);
        });
    });
}
