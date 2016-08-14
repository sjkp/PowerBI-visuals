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
            cache.registerCoordinates(washingtonQuery.key, washingtonCoord);
            cache.registerCoordinates(utahQuery.key, utahCoord);

            expect(cache.getCoordinates(washingtonQuery.key)).toEqual(washingtonCoord);
            expect(cache.getCoordinates(utahQuery.key)).toEqual(utahCoord);
        });

        it('Cache Miss', () => {
            let washingtonQuery = new GeocodeQuery("Washington", "State");
            let washingtonCoord = { latitude: 10, longitude: 10 };
            let utahQuery = new GeocodeQuery("Utah", "State");
            let utahCoord = { latitude: 15, longitude: 15 };
            let newYorkQuery = new GeocodeQuery("New York", "State");
            cache.registerCoordinates(washingtonQuery.key, washingtonCoord);
            cache.registerCoordinates(utahQuery.key, utahCoord);

            expect(cache.getCoordinates(newYorkQuery.key)).toBeFalsy();
        });

        it('Local storage hit', () => {
            let washingtonQuery = new GeocodeQuery("Washington", "State");
            let washingtonCoord = { latitude: 10, longitude: 10 };
            cache.registerCoordinates(washingtonQuery.key, washingtonCoord);
            let newCache = createGeocodingCache(maxCacheSize, maxCacheSizeOverflow);

            expect(newCache.getCoordinates(washingtonQuery.key)).toEqual(washingtonCoord);
        });

        it('Doesnt crash on null coordinate', () => {
            let tinyCache = createGeocodingCache(1, 1);
            tinyCache['geocodeCache']['null'] = null;
            let washingtonQuery = new GeocodeQuery("Washington", "State");
            let washingtonCoord = { latitude: 10, longitude: 10 };
            tinyCache.registerCoordinates(washingtonQuery.key, washingtonCoord);
            let utahQuery = new GeocodeQuery("Utah", "State");
            let utahCoord = { latitude: 15, longitude: 15 };
            tinyCache.registerCoordinates(utahQuery.key, utahCoord);
            let newYorkQuery = new GeocodeQuery("New York", "State");
            let newYorkCoords = { latitude: 20, longitude: 20 };
            tinyCache.registerCoordinates(newYorkQuery.key, newYorkCoords);

            expect(tinyCache).toBeDefined();
        });

        it('Keeps items in memory cache based on hit count', () => {
            // with this configuration, cache will get up to about 55 entries before reducing to about 5
            let maxSize = 10;
            let overflow = 50;
            let smallCache = createGeocodingCache(maxSize, overflow);

            // large enough that cache will go through multiple overflows
            let N = 30 * (maxSize + overflow);

            // pick a few "random" ones we'll add a hit too, but needs to be no more than maxSize - keep it even fewer
            // to avoid being just off by one from the cache implementation
            let randomIndexes = [13, 72, 115, 273];

            function key(i) {
                return new GeocodeQuery(i.toString(), "State").key;
            }

            function coord(i) {
                return { latitude: i, longitude: -i };
            }

            for (let i = 0; i < N; ++i) {
                smallCache.registerCoordinates(key(i), coord(i));

                // add a hit to the "randomly selected" ones
                if (-1 !== randomIndexes.indexOf(i))
                    smallCache.getCoordinates(key(i));
            }

            // to detect that the extra hits were effective at keeping the random ones in the memory cache, we have to remove keys
            // from the backing localStorage else the geocoding cache will silently resurrect entries from there
            for (let i = 0; i < N; ++i) {
                localStorage.removeItem(key(i));
            }

            // now when we sample we'll only see the ones actually in the memory cache
            let present = 0;
            for (let i = 0; i < N; ++i) {
                let c = smallCache.getCoordinates(key(i));
                if (-1 !== randomIndexes.indexOf(i))
                    expect(c).toEqual(coord(i));
                if (c)
                    ++present;
            }

            // most of the others should have been removed. again keep the expected count loose in case cache implementation
            // isn't precise
            let SLOP = 2;
            expect(present).toBeLessThan(maxSize + overflow + SLOP);
        });
    });
}
