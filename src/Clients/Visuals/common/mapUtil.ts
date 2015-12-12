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

module powerbi.visuals {
    const defaultLevelOfDetail = 11;

    export module MapUtil {
        export const Settings = {
            /** Maximum Bing requests at once. The Bing have limit how many request at once you can do per socket. */
            MaxBingRequest: 6,

            /** Maximum cache size of cached geocode data. */
            MaxCacheSize: 3000,

            /** Maximum cache overflow of cached geocode data to kick the cache reducing. */
            MaxCacheSizeOverflow: 100,

            // Bing Keys and URL
            BingKey: "insert your key",
            BingUrl: "https://dev.virtualearth.net/REST/v1/Locations?",
            BingUrlGeodata: "https://platform.bing.com/geo/spatial/v1/public/Geodata?",

            /** Switch the data result for geodata polygons to by double array instead locations array */
            UseDoubleArrayGeodataResult: true,
            UseDoubleArrayDequeueTimeout: 0,
        };

        // Bing map min/max boundaries
        export const MinAllowedLatitude = -85.05112878;
        export const MaxAllowedLatitude = 85.05112878;
        export const MinAllowedLongitude = -180;
        export const MaxAllowedLongitude = 180;
        export const TileSize = 256;
        export const MaxLevelOfDetail = 23;
        export const MinLevelOfDetail = 1;
        export const MaxAutoZoomLevel = 5;
        export const DefaultLevelOfDetail = 11;
        export const WorkerErrorName = "___error___";

        export const CategoryTypes = {
            Address: "Address",
            City: "City",
            Continent: "Continent",
            CountryRegion: "Country", // The text has to stay "Country" because it is used as a key in the geocoding caching dictionary
            County: "County",
            Longitude: "Longitude",
            Latitude: "Latitude",
            Place: "Place",
            PostalCode: "PostalCode",
            StateOrProvince: "StateOrProvince"
        };

        const safeCharacters: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";

        export function clip(n: number, minValue: number, maxValue: number): number {
            return Math.min(Math.max(n, minValue), maxValue);
        }

        export function getMapSize(levelOfDetail: number): number {
            if (levelOfDetail === 23)
                return 2147483648;  //256 << 23 overflow the integer and return a negative value

            if (Math.floor(levelOfDetail) === levelOfDetail)
                return 256 << levelOfDetail;

            return 256 * Math.pow(2, levelOfDetail);
        }

        /**
         * @param latLongArray - is a Float64Array as [lt0, lon0, lat1, long1, lat2, long2,....]
         * @returns Float64Array as [x0, y0, x1, y1, x2, y2,....]
         */
        export function latLongToPixelXYArray(latLongArray: Float64Array, levelOfDetail: number): Float64Array {
            let result = new Float64Array(latLongArray.length);
            for (let i = 0; i < latLongArray.length; i += 2) {
                let latitude = clip(latLongArray[i], MinAllowedLatitude, MaxAllowedLatitude);
                let longitude = clip(latLongArray[i + 1], MinAllowedLongitude, MaxAllowedLongitude);

                let x: number = (longitude + 180) / 360;
                let sinLatitude: number = Math.sin(latitude * Math.PI / 180);
                let y: number = 0.5 - Math.log((1 + sinLatitude) / (1 - sinLatitude)) / (4 * Math.PI);

                let mapSize: number = getMapSize(levelOfDetail);
                result[i] = clip(x * mapSize + 0.5, 0.0, mapSize - 1);
                result[i + 1] = clip(y * mapSize + 0.5, 0.0, mapSize - 1);
            }
            return result;
        }

        export function pointArrayToString(array: Float64Array) {
            let maxLength = 80000;
            if (array.length > maxLength) {
                let result: string = "";
                for (let i = 0; i < array.length; i += maxLength) {
                    let array1 = Array.apply([], array.subarray(i, i + maxLength));
                    result += array1.join(" ") + " ";
                }
                return result;
            }
            return Array.apply([], array).join(" ");
        }

        export function pointArrayToArray(array: Float64Array): number[] {
            let maxLength = 80000;
            let result: number[] = [];
            if (array.length > maxLength) {
                for (let i = 0; i < array.length; i += maxLength) {
                    let array1 = Array.apply([], array.subarray(i, i + maxLength));
                    result.concat(array1);
                }
                return result;
            }
            return Array.apply([], array);
        }

        export function getLocationBoundaries(latLongArray: Float64Array): Microsoft.Maps.LocationRect {
            const northWest = {
                latitude: -90, longitude: 180
            };
            const southEast = {
                latitude: 90, longitude: -180
            };

            for (let i = 0; i < latLongArray.length; i += 2) {
                northWest.latitude = Math.max(latLongArray[i], northWest.latitude);
                northWest.longitude = Math.min(latLongArray[i + 1], northWest.longitude);
                southEast.latitude = Math.min(latLongArray[i], southEast.latitude);
                southEast.longitude = Math.max(latLongArray[i + 1], southEast.longitude);
            }

            northWest.longitude = clip(northWest.longitude, -180, 180);
            southEast.longitude = clip(southEast.longitude, -180, 180);

            return Microsoft.Maps.LocationRect.fromCorners(
                new Microsoft.Maps.Location(northWest.latitude, northWest.longitude),
                new Microsoft.Maps.Location(southEast.latitude, southEast.longitude));
        }

        /**
         * Note: this code is taken from Bing.
         *  see Point Compression Algorithm http://msdn.microsoft.com/en-us/library/jj158958.aspx
         *  see Decompression Algorithm in http://msdn.microsoft.com/en-us/library/dn306801.aspx
         */
        export function parseEncodedSpatialValueArray(value): Float64Array {
            let list: number[] = [];
            let index = 0;
            let xsum = 0;
            let ysum = 0;
            let max = 4294967296;

            while (index < value.length) {
                let n = 0;
                let k = 0;

                while (1) {

                    if (index >= value.length) {
                        return null;
                    }

                    let b = safeCharacters.indexOf(value.charAt(index++));
                    if (b === -1) {
                        return null;
                    }

                    let tmp = ((b & 31) * (Math.pow(2, k)));

                    let ht = tmp / max;
                    let lt = tmp % max;

                    let hn = n / max;
                    let ln = n % max;

                    let nl = (lt | ln) >>> 0;
                    n = (ht | hn) * max + nl;
                    k += 5;
                    if (b < 32) break;
                }

                let diagonal = Math.floor((Math.sqrt(8 * n + 5) - 1) / 2);
                n -= diagonal * (diagonal + 1) / 2;
                let ny = Math.floor(n);
                let nx = diagonal - ny;
                nx = (nx >> 1) ^ -(nx & 1);
                ny = (ny >> 1) ^ -(ny & 1);
                xsum += nx;
                ysum += ny;
                let lat = ysum * 0.00001;
                let lon = xsum * 0.00001;

                list.push(lat);
                list.push(lon);
            }
            return new Float64Array(list);
        }

        export function calcGeoData(data: IGeocodeBoundaryCoordinate) {
            let locations = data.locations;

            for (let i = 0; i < locations.length; i++) {
                let location = locations[i];
                if (!location.geographic) {
                    location.geographic = MapUtil.parseEncodedSpatialValueArray(location.nativeBing);
                }
                let polygon = location.geographic;
                if (polygon) {
                    if (!location.absolute) {
                        location.absolute = MapUtil.latLongToPixelXYArray(polygon, MapUtil.DefaultLevelOfDetail);
                        location.absoluteString = MapUtil.pointArrayToString(location.absolute);

                        let geographicBounds = MapUtil.getLocationBoundaries(polygon);
                        location.absoluteBounds = MapUtil.locationRectToRectXY(geographicBounds, MapUtil.DefaultLevelOfDetail);
                    }
                }
            }
        }

        export function locationToPixelXY(location: Microsoft.Maps.Location, levelOfDetail: number): powerbi.visuals.Point {
            return latLongToPixelXY(location.latitude, location.longitude, levelOfDetail);
        }

        export function locationRectToRectXY(locationRect: Microsoft.Maps.LocationRect, levelOfDetail: number): powerbi.visuals.Rect {
            let topleft = locationToPixelXY(locationRect.getNorthwest(), levelOfDetail);
            let bottomRight = locationToPixelXY(locationRect.getSoutheast(), levelOfDetail);
            return new powerbi.visuals.Rect(topleft.x, topleft.y, bottomRight.x - topleft.x, bottomRight.y - topleft.y);
        }

        export function latLongToPixelXY(latitude: number, longitude: number, levelOfDetail: number): powerbi.visuals.Point {
            let array = latLongToPixelXYArray(new Float64Array([latitude, longitude]), levelOfDetail);
            return new powerbi.visuals.Point(array[0], array[1]);
        }

        export function pixelXYToLocation(pixelX: number, pixelY: number, levelOfDetail: number): Microsoft.Maps.Location {
            let mapSize = getMapSize(levelOfDetail);
            let x = (clip(pixelX, 0, mapSize - 1) / mapSize) - 0.5;
            let y = 0.5 - (clip(pixelY, 0, mapSize - 1) / mapSize);
            let latitude = 90 - 360 * Math.atan(Math.exp(-y * 2 * Math.PI)) / Math.PI;
            let longitude = 360 * x;
            return new Microsoft.Maps.Location(latitude, longitude);
        }
    }

    export class MapPolygonInfo {
        private _locationRect: Microsoft.Maps.LocationRect;
        private _baseRect: Rect;
        private _currentRect: Rect;

        constructor() {
            this._locationRect = new Microsoft.Maps.LocationRect(new Microsoft.Maps.Location(30, -30), 60, 60);
        }

        public reCalc(mapControl: Microsoft.Maps.Map, width: number, height: number) {
            let baseLocations = [this._locationRect.getNorthwest(), this._locationRect.getSoutheast()];
            width = width / 2.00;
            height = height / 2.00;

            if (!this._baseRect) {
                let l0 = MapUtil.locationToPixelXY(this._locationRect.getNorthwest(), defaultLevelOfDetail);
                let l1 = MapUtil.locationToPixelXY(this._locationRect.getSoutheast(), defaultLevelOfDetail);
                this._baseRect = new Rect(l0.x, l0.y, l1.x - l0.x, l1.y - l0.y);
            }

            let l = mapControl.tryLocationToPixel(baseLocations);
            this._currentRect = new Rect(l[0].x + width, l[0].y + height, l[1].x - l[0].x, l[1].y - l[0].y);
        }

        public get scale(): number {
            if (this._baseRect) {
                return this._currentRect.width / this._baseRect.width;
            }
            return 1.0;
        }

        public get transform(): Transform {
            let base = this._baseRect;
            let current = this._currentRect;
            let transform = new Transform();
            transform.translate(current.left, current.top);
            transform.scale((current.width / base.width), (current.height / base.height));
            transform.translate(-base.left, -base.top);
            return transform;
        }

        public get outherTransform() {
            let base = this._baseRect;
            let current = this._currentRect;
            let transform = new Transform();
            transform.translate(current.left, current.top);
            let scale = Math.sqrt(current.width / base.width);
            transform.scale(scale, scale);
            return transform;
        }

        public setViewBox(svg: SVGSVGElement) {
            let rect = svg.getBoundingClientRect();
            let current = this._currentRect;
            svg.setAttribute("viewBox", [-current.left, -current.top, rect.width, rect.height].join(" "));
        }

        public get innerTransform() {
            let base = this._baseRect;
            let current = this._currentRect;
            let transform = new Transform();
            let scale = current.width / base.width;
            transform.scale(scale, scale);
            transform.translate(-base.left, -base.top);
            return transform;
        }

        public transformToString(transform: Transform) {
            let m = transform.matrix;
            return "matrix(" + m.m00 + " " + m.m10 + " " + m.m01 + " " + m.m11 + " " + m.m02 + " " + m.m12 + ")";
        }
    }
}
