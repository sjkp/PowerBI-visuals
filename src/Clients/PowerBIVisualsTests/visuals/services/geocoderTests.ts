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
    import GeocodeQuery = services.GeocodeQuery;
    import GeocodeBoundaryQuery = services.GeocodeBoundaryQuery;
    import GeocodePointQuery = services.GeocodePointQuery;
    import BingEntities = services.BingEntities;

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

    describe("GeocodeQueryTests", () => {
        beforeEach(() => {
            MapUtil.Settings.BingKey = "testBingKey";
        });

        it("null values converted to empty strings", () => {
            let nullQuery = new GeocodeQuery(null, null);
            expect(nullQuery.query).toBe("");
            expect(nullQuery.category).toBe("");
        });

        it("getBingEntity", () => {
            let addressQuery = new GeocodeQuery("One Microsoft Way", "Address");
            expect(addressQuery.getBingEntity()).toBe(BingEntities.Address);
            let cityQuery = new GeocodeQuery("Redmond", "City");
            expect(cityQuery.getBingEntity()).toBe(BingEntities.PopulatedPlace);
            let continentQuery = new GeocodeQuery("North America", "Continent");
            expect(continentQuery.getBingEntity()).toBe(BingEntities.Continent);
            let countryQuery = new GeocodeQuery("United States", "Country");
            expect(countryQuery.getBingEntity()).toBe(BingEntities.Sovereign);
            let countyQuery = new GeocodeQuery("King", "County");
            expect(countyQuery.getBingEntity()).toBe(BingEntities.AdminDivision2);
            let longQuery = new GeocodeQuery("-122.127762", "Longitude");
            expect(longQuery.getBingEntity()).toBe("");
            let latQuery = new GeocodeQuery("47.644287", "Latitude");
            expect(latQuery.getBingEntity()).toBe("");
            let placeQuery = new GeocodeQuery("Microsoft Building 17", "Place");
            expect(placeQuery.getBingEntity()).toBe("");
            let postalCodeQuery = new GeocodeQuery("98052", "PostalCode");
            expect(postalCodeQuery.getBingEntity()).toBe(BingEntities.Postcode);
            let stateQuery = new GeocodeQuery("Washington", "StateOrProvince");
            expect(stateQuery.getBingEntity()).toBe(BingEntities.AdminDivision1);
        });

        it("getUrl", () => {
            let query = new GeocodeQuery("Redmond", "City");
            expect(query.getUrl()).toBe("https://dev.virtualearth.net/REST/v1/Locations?key=testBingKey&includeEntityTypes=PopulatedPlace&q=Redmond&c=en-US&maxRes=20");
        });

        it("getUrl with postal code", () => {
            let query = new GeocodeQuery("98052", "PostalCode");
            expect(query.getUrl()).toBe("https://dev.virtualearth.net/REST/v1/Locations?key=testBingKey&includeEntityTypes=Postcode,Postcode1,Postcode2,Postcode3,Postcode4&q=98052&c=en-US&maxRes=20");
        });

        it("getUrl with no Bing entityType", () => {
            let query = new GeocodeQuery("Microsoft Building 17", "Place");
            expect(query.getUrl()).toBe("https://dev.virtualearth.net/REST/v1/Locations?key=testBingKey&q=Microsoft Building 17&c=en-US&maxRes=20");
        });

        it("getUrl county", () => {
            let query = new GeocodeQuery("King", "County");
            expect(query.getUrl()).toBe("https://dev.virtualearth.net/REST/v1/Locations?key=testBingKey&adminDistrict=King&c=en-US&maxRes=20");
        });

        it("getUrl state", () => {
            let query = new GeocodeQuery("Washington", "StateOrProvince");
            expect(query.getUrl()).toBe("https://dev.virtualearth.net/REST/v1/Locations?key=testBingKey&adminDistrict=Washington&c=en-US&maxRes=20");
        });

        it("getUrl state with context", () => {
            let query = new GeocodeQuery("Washington, United States", "StateOrProvince");
            expect(query.getUrl()).toBe("https://dev.virtualearth.net/REST/v1/Locations?key=testBingKey&includeEntityTypes=AdminDivision1&q=Washington, United States&c=en-US&maxRes=20");
        });

        it("getUrl includes country code request", () => {
            let query = new GeocodeQuery("US", "Country");
            expect(query.getUrl()).toBe("https://dev.virtualearth.net/REST/v1/Locations?key=testBingKey&includeEntityTypes=Sovereign&q=US&c=en-US&maxRes=20&include=ciso2");
        });

        it("getUrl does not include country code request when category is not country", () => {
            let query = new GeocodeQuery("WA", "StateOrProvince");
            expect(query.getUrl()).toBe("https://dev.virtualearth.net/REST/v1/Locations?key=testBingKey&adminDistrict=WA&c=en-US&maxRes=20");
        });
    });

    describe("GeocodeBoundaryQueryTests", () => {
        beforeEach(() => {
            MapUtil.Settings.BingKey = "testBingKey";
        });

        it("getUrl", () => {
            let query = new GeocodeBoundaryQuery(47, 122, "StateOrProvince", 1);
            expect(query.getUrl()).toBe("https://platform.bing.com/geo/spatial/v1/public/Geodata?key=testBingKey&$format=json&SpatialFilter=GetBoundary(47, 122, 1, \'AdminDivision1\', 1, 0, \'en-US\', \'US\')");
        });
    });

    describe("Geocoding Tests", () => {
        let savedBingAjaxService: services.BingAjaxService;
        let geocoder: powerbi.IGeocoder;
        let cache: _.Dictionary<powerbi.IGeocodeCoordinate>;

        beforeEach(() => {
            cache = {};

            services.resetStaticGeocoderState({
                getCoordinates: (key: string): powerbi.IGeocodeCoordinate => {
                    return cache[key];
                },

                registerCoordinates: (key: string, coordinate: powerbi.IGeocodeCoordinate): void => {
                    cache[key] = coordinate;
                },
            });

            savedBingAjaxService = services.BingAjaxCall;

            geocoder = services.createGeocoder();
        });

        afterEach(() => {
            services.resetStaticGeocoderState(null);

            services.BingAjaxCall = savedBingAjaxService;
        });

        it("Fake fetch from Bing", (done) => {
            let expectedLocation: powerbi.IGeocodeCoordinate = {
                latitude: -50,
                longitude: 50,
            };

            services.BingAjaxCall = (url: string, settings: JQueryAjaxSettings) => {
                return {
                    then: (successFn, errorFn) => {
                        successFn({
                            resourceSets: [{
                                resources: [{
                                    point: {
                                        type: "Point",
                                        coordinates: [expectedLocation.latitude, expectedLocation.longitude]
                                    },
                                    entityType: "PopulatedPlace",
                                }],
                            }]
                        });
                    },
                };
            };

            let resultLocation: powerbi.IGeocodeCoordinate;
            geocoder.geocode("Redmond, WA", "City").then((location) => {
                resultLocation = location;
            });

            setTimeout(() => {
                expect(resultLocation).toEqual(expectedLocation);
                done();
            }, DefaultWaitForRender);
        });

        it("Can cancel requests", (done) => {
            let expectedLocation: powerbi.IGeocodeCoordinate = {
                latitude: -50,
                longitude: 50,
            };

            services.BingAjaxCall = (url: string, settings: JQueryAjaxSettings) => {
                return {
                    then: (successFn, errorFn) => {
                        successFn({
                            resourceSets: [{
                                resources: [{
                                    point: {
                                        type: "Point",
                                        coordinates: [expectedLocation.latitude, expectedLocation.longitude]
                                    },
                                    entityType: "PopulatedPlace",
                                }],
                            }]
                        });
                    },
                };
            };

            // a fake "resolved" timeout
            let timeout: powerbi.IPromise<any> = {
                then: (successFn: (_: any) => any, errorFn: (_: any) => any) => {
                    successFn(null);
                    return <powerbi.IPromise<any>>null;
                },

                catch: null,
                finally: (finallyFn: () => any) => {
                    finallyFn();
                    return <powerbi.IPromise<any>>null;
                },
            };

            let resultLocation: powerbi.IGeocodeCoordinate;
            let wasRejected: boolean;
            geocoder.geocode("Redmond, WA", "City", { timeout: timeout }).then((location) => {
                resultLocation = location;
            }, () => {
                wasRejected = true;
            });

            setTimeout(() => {
                expect(resultLocation).toBeUndefined();
                expect(wasRejected).toBe(true);
                done();
            }, DefaultWaitForRender);
        });
    });

    describe("GeocodePointQueryTests", () => {
        beforeEach(() => {
            MapUtil.Settings.BingKey = "testBingKey";
        });

        it("getUrl with all entity types", () => {
            let query = new GeocodePointQuery(47.12435, 122.67891,["Address","Neighborhood","PopulatedPlace","Postcode1","AdminDivision1","AdminDivision2","CountryRegion"]);
            expect(query.getUrl()).toBe("https://dev.virtualearth.net/REST/v1/Locations/47.12435,122.67891?key=testBingKey&includeEntityTypes=Address,Neighborhood,PopulatedPlace,Postcode1,AdminDivision1,AdminDivision2,CountryRegion&include=ciso2");
        });
        
        it("getUrl with some entity types", () => {
            let query = new GeocodePointQuery(47.12435, 122.67891,["Address","Neighborhood","PopulatedPlace","Postcode1","AdminDivision1"]);
            expect(query.getUrl()).toBe("https://dev.virtualearth.net/REST/v1/Locations/47.12435,122.67891?key=testBingKey&includeEntityTypes=Address,Neighborhood,PopulatedPlace,Postcode1,AdminDivision1&include=ciso2");
        });
        
        it("getUrl with one entity type", () => {
            let query = new GeocodePointQuery(47.12435, 122.67891,["Address"]);
            expect(query.getUrl()).toBe("https://dev.virtualearth.net/REST/v1/Locations/47.12435,122.67891?key=testBingKey&includeEntityTypes=Address&include=ciso2");
        });
        
        it("getUrl with no entity types", () => {
            let query = new GeocodePointQuery(47.12435, 122.67891,[]);
            expect(query.getUrl()).toBe("https://dev.virtualearth.net/REST/v1/Locations/47.12435,122.67891?key=testBingKey&include=ciso2");
        });
    });
} 
