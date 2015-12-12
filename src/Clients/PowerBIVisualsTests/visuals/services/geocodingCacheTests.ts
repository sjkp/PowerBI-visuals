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
    import IGeocodeCache = powerbi.visuals.services.IGeocodingCache;
    import GeocodeQuery = powerbi.visuals.services.GeocodeQuery;
    import createGeocodingCache = powerbi.visuals.services.createGeocodingCache;

    describe('General GeocodeCache Tests', () => {
        let cache: IGeocodeCache;

        const maxCacheSize = 3000;
        const maxCacheSizeOverflow = 100;

        beforeEach(() => {
            cache = createGeocodingCache(maxCacheSize, maxCacheSizeOverflow);
            localStorage.clear();
        });

        it('Cache Hit', () => {
            let washingtonQuery = new GeocodeQuery("Washington", "State");
            let washingtonCoord = { latitude: 10, longitude: 10 };
            let utahQuery = new GeocodeQuery("Utah", "State");
            let utahCoord = { latitude: 15, longitude: 15 };
            cache.registerCoordinates(washingtonQuery, washingtonCoord);
            cache.registerCoordinates(utahQuery, utahCoord);

            expect(cache.getCoordinates(washingtonQuery)).toEqual(washingtonCoord);
            expect(cache.getCoordinates(utahQuery)).toEqual(utahCoord);
        });

        it('Cache Miss', () => {
            let washingtonQuery = new GeocodeQuery("Washington", "State");
            let washingtonCoord = { latitude: 10, longitude: 10 };
            let utahQuery = new GeocodeQuery("Utah", "State");
            let utahCoord = { latitude: 15, longitude: 15 };
            let newYorkQuery = new GeocodeQuery("New York", "State");
            cache.registerCoordinates(washingtonQuery, washingtonCoord);
            cache.registerCoordinates(utahQuery, utahCoord);

            expect(cache.getCoordinates(newYorkQuery)).toBeFalsy();
        });

        it('Local storage hit', () => {
            let washingtonQuery = new GeocodeQuery("Washington", "State");
            let washingtonCoord = { latitude: 10, longitude: 10 };
            cache.registerCoordinates(washingtonQuery, washingtonCoord);
            let newCache = createGeocodingCache(maxCacheSize, maxCacheSizeOverflow);

            expect(newCache.getCoordinates(washingtonQuery)).toEqual(washingtonCoord);
        });

        it('Doesnt crash on null coordinate', () => {
            let tinyCache = createGeocodingCache(1, 1);
            tinyCache['geocodeCache']['null'] = null;
            let washingtonQuery = new GeocodeQuery("Washington", "State");
            let washingtonCoord = { latitude: 10, longitude: 10 };
            tinyCache.registerCoordinates(washingtonQuery, washingtonCoord);
            let utahQuery = new GeocodeQuery("Utah", "State");
            let utahCoord = { latitude: 15, longitude: 15 };
            tinyCache.registerCoordinates(utahQuery, utahCoord);
            let newYorkQuery = new GeocodeQuery("New York", "State");
            let newYorkCoords = { latitude: 20, longitude: 20 };
            tinyCache.registerCoordinates(newYorkQuery, newYorkCoords);

            expect(tinyCache).toBeDefined();
        });
    });
}