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

module powerbi.visuals.services {
    import CategoryTypes = MapUtil.CategoryTypes;
    import Settings = MapUtil.Settings;

    export function createGeocoder(): IGeocoder {
        return {
            geocode: geocode,
            geocodeBoundary: geocodeBoundary,
            geocodePoint: geocodePoint,
            tryGeocodeImmediate: tryGeocodeImmediate,
            tryGeocodeBoundaryImmediate: tryGeocodeBoundaryImmediate,
        };
    }

    export interface BingAjaxService {
        (url: string, settings: JQueryAjaxSettings): any;
    }
    export const safeCharacters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
    
    /** Note: Used for test mockup */
    export let BingAjaxCall: BingAjaxService = $.ajax;

    export const CategoryTypeArray = [
        "Address",
        "City",
        "Continent",
        "Country",
        "County",
        "Longitude",
        "Latitude",
        "Place",
        "PostalCode",
        "StateOrProvince"
    ];

    export function isCategoryType(value: string): boolean {
        return CategoryTypeArray.indexOf(value) > -1;
    }

    export const BingEntities = {
        Continent: "Continent",
        Sovereign: "Sovereign",
        CountryRegion: "CountryRegion",
        AdminDivision1: "AdminDivision1",
        AdminDivision2: "AdminDivision2",
        PopulatedPlace: "PopulatedPlace",
        Postcode: "Postcode",
        Postcode1: "Postcode1",
        Neighborhood: "Neighborhood",
        Address: "Address",
    };

    export interface ILocation {
        latitude: number;
        longitude: number;
    }

    export interface ILocationRect {
        northWest: ILocation;
        southEast: ILocation;
    }

    export interface GeocodeCallback {
        (error: Error, coordinate: IGeocodeCoordinate): void;
    }

    export interface IGeocodeQuery {
        query: string;
        category: string;
        levelOfDetail?: number;
        longitude?: number;
        latitude?: number;
    }

    interface IGeocodeQueueItem {
        query: GeocodeQuery;
        deferred: JQueryDeferred<any>;
        isResolved: boolean;
    }

    // Static variables for caching, maps, etc.
    let geocodeQueue: IGeocodeQueueItem[];
    let activeRequests;
    let categoryToBingEntity: { [key: string]: string; };
    let categoryToBingEntityGeodata: { [key: string]: string; };
    let geocodingCache: IGeocodingCache;

    export class GeocodeQuery implements IGeocodeQuery {
        public query: string;
        public category: string;
        public key: string;

        constructor(query: string, category: string) {
            this.query = query != null ? query : "";
            this.category = category != null ? category : "";
            this.key = (this.query + "/" + this.category).toLowerCase();
            if (!geocodingCache) {
                geocodingCache = createGeocodingCache(Settings.MaxCacheSize, Settings.MaxCacheSizeOverflow);
            }
        }

        public getBingEntity(): string {
            let category = this.category.toLowerCase();
            if (!categoryToBingEntity) {
                categoryToBingEntity = {};
                categoryToBingEntity[CategoryTypes.Continent.toLowerCase()] = BingEntities.Continent;
                categoryToBingEntity[CategoryTypes.CountryRegion.toLowerCase()] = BingEntities.Sovereign;
                categoryToBingEntity[CategoryTypes.StateOrProvince.toLowerCase()] = BingEntities.AdminDivision1;
                categoryToBingEntity[CategoryTypes.County.toLowerCase()] = BingEntities.AdminDivision2;
                categoryToBingEntity[CategoryTypes.City.toLowerCase()] = BingEntities.PopulatedPlace;
                categoryToBingEntity[CategoryTypes.PostalCode.toLowerCase()] = BingEntities.Postcode;
                categoryToBingEntity[CategoryTypes.Address.toLowerCase()] = BingEntities.Address;
            }
            return categoryToBingEntity[category] || "";
        }

        public getUrl(): string {
            let url = Settings.BingUrl + "?key=" + Settings.BingKey;
            let entityType = this.getBingEntity();
            let queryAdded = false;
            if (entityType) {
                if (entityType === BingEntities.Postcode) {
                    url += "&includeEntityTypes=Postcode,Postcode1,Postcode2,Postcode3,Postcode4";
                }
                else if (this.query.indexOf(",") === -1 && (entityType === BingEntities.AdminDivision1 || entityType === BingEntities.AdminDivision2)) {
                    queryAdded = true;
                    try {
                        url += "&adminDistrict=" + decodeURIComponent(this.query);
                    } catch (e) {
                        return null;
                    }
                }
                else {
                    url += "&includeEntityTypes=" + entityType;
                }
            }

            if (!queryAdded) {
                try {
                    url += "&q=" + decodeURIComponent(this.query);
                } catch (e) {
                    return null;
                }
            }

            let cultureName = navigator.userLanguage || navigator["language"];
            cultureName = mapLocalesForBing(cultureName);
            if (cultureName) {
                url += "&c=" + cultureName;
            }

            url += "&maxRes=20";

            // If the query is of length 2, request the ISO 2-letter country code to be returned with the result to be compared against the query so that such results can be preferred.
            if (this.query.length === 2 && this.category === CategoryTypes.CountryRegion) {
                url += "&include=ciso2";
            }

            return url;
        }
    }

    export class GeocodePointQuery extends GeocodeQuery {
        public latitude: number;
        public longitude: number;
        public entities: string[];
       
        constructor(latitude: number, longitude: number, entities:string[]) {
            super([latitude, longitude].join(), "Point");
            this.latitude = latitude;
            this.longitude = longitude;
            this.entities = entities;
        }           

        public getUrl(): string {
            debug.assert(
                this.entities.every(e => !!_.findKey(BingEntities, be => be === e)),
                "All entities should match one of the allowed BingEntities");
            let url = Settings.BingUrl + "/" +
                [this.latitude, this.longitude].join() + "?" +
                "key=" + Settings.BingKey +
                (_.isEmpty(this.entities) ? "" : "&includeEntityTypes=" + this.entities.join()) +
                "&include=ciso2";  
            return url;
        }
    }

    export class GeocodeBoundaryQuery extends GeocodeQuery {
        public latitude: number;
        public longitude: number;
        public levelOfDetail: number;
        public maxGeoData: number;

        constructor(latitude: number, longitude: number, category, levelOfDetail, maxGeoData = 3) {
            super([latitude, longitude, levelOfDetail, maxGeoData].join(","), category);
            this.latitude = latitude;
            this.longitude = longitude;
            this.levelOfDetail = levelOfDetail;
            this.maxGeoData = maxGeoData;
        }

        public getBingEntity(): string {
            let category = this.category.toLowerCase();
            if (!categoryToBingEntityGeodata) {
                categoryToBingEntityGeodata = {};
                categoryToBingEntityGeodata[CategoryTypes.CountryRegion.toLowerCase()] = BingEntities.CountryRegion;
                categoryToBingEntityGeodata[CategoryTypes.StateOrProvince.toLowerCase()] = BingEntities.AdminDivision1;
                categoryToBingEntityGeodata[CategoryTypes.County.toLowerCase()] = BingEntities.AdminDivision2;
                categoryToBingEntityGeodata[CategoryTypes.City.toLowerCase()] = BingEntities.PopulatedPlace;
                categoryToBingEntityGeodata[CategoryTypes.PostalCode.toLowerCase()] = BingEntities.Postcode1;
            }
            return categoryToBingEntityGeodata[category] || "";
        }

        public getUrl(): string {
            let url = Settings.BingUrlGeodata + "key=" + Settings.BingKey + "&$format=json";
            let entityType = this.getBingEntity();
            if (!entityType) {
                return null;
            }

            let cultureName = navigator.userLanguage || navigator["language"];
            cultureName = mapLocalesForBing(cultureName);
            let cultures = cultureName.split("-");
            let data = [this.latitude, this.longitude, this.levelOfDetail, "'" + entityType + "'", 1, 0, "'" + cultureName + "'"];
            if (cultures.length > 1) {
                data.push("'" + cultures[1] + "'");
            }
            return url + "&SpatialFilter=GetBoundary(" + data.join(", ") + ")";
        }
    }

    /**
     * Map locales that cause failures to similar locales that work
     */
    function mapLocalesForBing(locale: string): string {
        switch (locale.toLowerCase()) {
            case 'fr': // Bing gives a 404 error when this language code is used (fr is only obtained from Chrome).  Use fr-FR for a near-identical version that works. Defect # 255717 opened with Bing.
                return 'fr-FR';
            default:
                return locale;
        }
    }

    function tryGeocodeImmediate(query: string, category?: string): IGeocodeCoordinate {
        let result = geocodingCache ? geocodingCache.getCoordinates(new GeocodeQuery(query, category).key) : undefined;
        return result;
    }

    function tryGeocodeBoundaryImmediate(latitude: number, longitude: number, category: string, levelOfDetail?: number, maxGeoData: number = 3): IGeocodeBoundaryCoordinate {
        let result = geocodingCache ? geocodingCache.getCoordinates(new GeocodeBoundaryQuery(latitude, longitude, category, levelOfDetail, maxGeoData).key) : undefined;
        return <IGeocodeBoundaryCoordinate>result;
    }

    export function geocodeCore(geocodeQuery: GeocodeQuery, options?: GeocodeOptions): any {
        let result = geocodingCache ? geocodingCache.getCoordinates(geocodeQuery.key) : undefined;
        let deferred = $.Deferred();

        if (result) {
            deferred.resolve(result);
        } else {
            let item: IGeocodeQueueItem = { query: geocodeQuery, deferred: deferred, isResolved: false };

            if (options && options.timeout) {
                options.timeout.finally(() => {
                    if (!item.isResolved) {
                        item.deferred.reject();
                        item.isResolved = true;
                    }
                });
            }

            geocodeQueue.push(item);
            dequeue();
        }
        return deferred;
    }

    export function geocode(query: string, category: string = "", options?: GeocodeOptions): any {
        return geocodeCore(new GeocodeQuery(query, category), options);
    }

    export function geocodeBoundary(latitude: number, longitude: number, category: string = "", levelOfDetail: number = 2, maxGeoData: number = 3, options?: GeocodeOptions): any {
        return geocodeCore(new GeocodeBoundaryQuery(latitude, longitude, category, levelOfDetail, maxGeoData), options);
    }

    export function geocodePoint(latitude: number, longitude: number, entities: string[], options?: GeocodeOptions): any {
        return geocodeCore(new GeocodePointQuery(latitude, longitude, entities), options);
    }

    function dequeue(decrement: number = 0) {
        activeRequests -= decrement;
        while (activeRequests < Settings.MaxBingRequest) {

            if (geocodeQueue.length === 0) {
                break;
            }

            activeRequests++;
            makeRequest(geocodeQueue.shift());
        }
    }

    function makeRequest(item: IGeocodeQueueItem) {
        if (!item.isResolved) {
            let result = geocodingCache ? geocodingCache.getCoordinates(item.query.key) : undefined;
            if (result) {
                item.deferred.resolve(result);
                item.isResolved = true;
            }
        }

        if (item.isResolved) {
            setTimeout(() => dequeue(1));
            return;
        }

        // Unfortunately the Bing service doesn't support CORS, only jsonp. This issue must be raised and revised.
        // VSTS: 1396088 - Tracking: Ask: Bing geocoding to support CORS
        let config: JQueryAjaxSettings = {
            type: "GET",
            dataType: "jsonp",
            jsonp: "jsonp"
        };

        let url = item.query.getUrl();
        if (!url) {
            completeRequest(item, new Error("Unsupported query. " + item.query.query));
        }

        BingAjaxCall(url, config).then(
            (data) => {
                try {
                    if (item.query instanceof GeocodeBoundaryQuery) {
                        let result = data;
                        if (result && result.d && Array.isArray(result.d.results) && result.d.results.length > 0) {
                            let entity = result.d.results[0];
                            let primitives = entity.Primitives;
                            if (primitives && primitives.length > 0) {
                                let coordinates: IGeocodeBoundaryCoordinate = {
                                    latitude: (<GeocodeBoundaryQuery>item.query).latitude,
                                    longitude: (<GeocodeBoundaryQuery>item.query).longitude,
                                    locations: []
                                };

                                primitives.sort((a, b) => {
                                    if (a.Shape.length < b.Shape.length) {
                                        return 1;
                                    }
                                    if (a.Shape.length > b.Shape.length) {
                                        return -1;
                                    }
                                    return 0;
                                });

                                let maxGeoData = Math.min(primitives.length, (<GeocodeBoundaryQuery>item.query).maxGeoData);

                                for (let i = 0; i < maxGeoData; i++) {
                                    let ringStr = primitives[i].Shape;
                                    let ringArray = ringStr.split(",");

                                    for (let j = 1; j < ringArray.length; j++) {
                                        coordinates.locations.push({ nativeBing: ringArray[j] });
                                    }
                                }

                                completeRequest(item, null, coordinates);
                            }
                            else {
                                completeRequest(item, new Error("Geocode result is empty."));
                            }
                        }
                        else {
                            completeRequest(item, new Error("Geocode result is empty."));
                        }
                    }
                    else if (item.query instanceof GeocodePointQuery){
                        let resources = data.resourceSets[0].resources;
                        if (Array.isArray(resources) && resources.length > 0) {
                            let index = getBestResultIndex(resources, item.query);
                            let pointData = resources[index].point.coordinates;
                            let addressData = resources[index].address;
                            let name = resources[index].name;
                            let coordinates: IGeocodeResource = {
                                latitude: parseFloat(pointData[0]),
                                longitude: parseFloat(pointData[1]),
                                addressLine: addressData.addressLine,
                                locality: addressData.locality,
                                neighborhood: addressData.neighborhood,
                                adminDistrict: addressData.adminDistrict, 
                                adminDistrict2: addressData.adminDistrict2, 
                                formattedAddress: addressData.formattedAddress, 
                                postalCode: addressData.postalCode,
                                countryRegionIso2: addressData.countryRegionIso2, 
                                countryRegion: addressData.countryRegion, 
                                landmark: addressData.landmark,  
                                name: name,
                            };
                            completeRequest(item, null, coordinates);
                        }
                        else {
                            completeRequest(item, null, null);
                        }
                    }
                    else {
                        let resources = data.resourceSets[0].resources;
                        if (Array.isArray(resources) && resources.length > 0) {
                            let index = getBestResultIndex(resources, item.query);
                            let pointData = resources[index].point.coordinates;
                            let coordinates: IGeocodeCoordinate = {
                                latitude: parseFloat(pointData[0]),
                                longitude: parseFloat(pointData[1])
                            };
                            completeRequest(item, null, coordinates);
                        }
                        else {
                            completeRequest(item, new Error("Geocode result is empty."));
                        }
                    }
                }
                catch (error) {
                    completeRequest(item, error);
                }
            },
            (error) => {
                completeRequest(item, error);
            });
    }

    let dequeueTimeoutId;

    function completeRequest(item: IGeocodeQueueItem, error: Error, coordinate: IGeocodeCoordinate | IGeocodeBoundaryCoordinate = null) {
        if (!item.isResolved) {
            if (error) {
                item.deferred.reject(error);
            }
            else {
                if (geocodingCache && !(item.query instanceof GeocodePointQuery))
                    geocodingCache.registerCoordinates(item.query.key, coordinate);
                item.deferred.resolve(coordinate);
            }

            item.isResolved = true;
        }

        dequeueTimeoutId = setTimeout(() => dequeue(1), Settings.UseDoubleArrayGeodataResult ? Settings.UseDoubleArrayDequeueTimeout : 0);
    }

    function getBestResultIndex(resources: any[], query: GeocodeQuery) {
        let queryString = query.query.toLowerCase();
        // If string is of length 2 and is a country, check against the ISO country code of results, prefering exact matches
        if (queryString.length === 2 && query.category === CategoryTypes.CountryRegion) {
            for (let index = 0; index < resources.length; index++) {
                let iso2: string = resources[index].address && resources[index].address.countryRegionIso2;
                if (iso2 && queryString === iso2.toLowerCase()) {
                    return index;
                }
            }
        }
        // Prefer results that match the targetEntity (geotagged category) on the query
        let targetEntity = query.getBingEntity().toLowerCase();
        for (let index = 0; index < resources.length; index++) {
            let resultEntity = (resources[index].entityType || "").toLowerCase();
            if (resultEntity === targetEntity) {
                return index;
            }
        }
        return 0;
    }

    export function resetStaticGeocoderState(cache?: IGeocodingCache): void {
        if (cache !== undefined)
            geocodingCache = cache;
        geocodeQueue = [];
        activeRequests = 0;
        categoryToBingEntity = null;
        clearTimeout(dequeueTimeoutId);
    }

    resetStaticGeocoderState();
}