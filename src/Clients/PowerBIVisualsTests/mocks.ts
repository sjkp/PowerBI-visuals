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

/// <reference path="./_references.ts"/>

module powerbitests.mocks {
    import SemanticFilter = powerbi.data.SemanticFilter;
    import SQExpr = powerbi.data.SQExpr;
    import SQExprBuilder = powerbi.data.SQExprBuilder;
    import defaultVisualHostServices = powerbi.visuals.defaultVisualHostServices;
    import SelectableDataPoint = powerbi.visuals.SelectableDataPoint;
    import ISelectionHandler = powerbi.visuals.ISelectionHandler;
    import DefaultVisualHostServices = powerbi.visuals.DefaultVisualHostServices;
    import ITelemetryService = powerbi.visuals.telemetry.ITelemetryService;
    import ITelemetryEvent = powerbi.visuals.telemetry.ITelemetryEvent;
    import ITelemetryEventFactory = powerbi.visuals.telemetry.ITelemetryEventFactory;
    import ITelemetryEventFactory1 = powerbi.visuals.telemetry.ITelemetryEventFactory1;
    import ITelemetryEventFactory2 = powerbi.visuals.telemetry.ITelemetryEventFactory2;
    import ITelemetryEventFactory3 = powerbi.visuals.telemetry.ITelemetryEventFactory3;
    import ITelemetryEventFactory4 = powerbi.visuals.telemetry.ITelemetryEventFactory4;
    import ITelemetryEventFactory5 = powerbi.visuals.telemetry.ITelemetryEventFactory5;
    import ITelemetryEventFactory6 = powerbi.visuals.telemetry.ITelemetryEventFactory6;
    import ITelemetryEventFactory7 = powerbi.visuals.telemetry.ITelemetryEventFactory7;
    import ITelemetryEventFactory8 = powerbi.visuals.telemetry.ITelemetryEventFactory8;
    import ITelemetryEventFactory9 = powerbi.visuals.telemetry.ITelemetryEventFactory9;
    import ITelemetryEventFactory10 = powerbi.visuals.telemetry.ITelemetryEventFactory10;
    import ITelemetryEventFactory11 = powerbi.visuals.telemetry.ITelemetryEventFactory11;
    import IDeferredTelemetryEvent = powerbi.visuals.telemetry.IDeferredTelemetryEvent;

    export class TelemetryCallbackMock {
        public static callbackCalls: number = 0;

        public target() {
            TelemetryCallbackMock.callbackCalls++;
        }
    };

    export class AppInsightsV2Mock {
        public trackPageViewTimes: number = 0;
        public trackEventTimes: number = 0;
        public trackEventLastActivityName: string = null;
        public trackEventLastAdditionalData: any = {
            id: null,
            start: null,
            end: null,
            isInternalUser: null,
            userId: null,
            category: null,
            sessionId: null,
            client: null,
            build: null,
            cluster: null,
        };

        public trackPageView(): void {
            this.trackPageViewTimes++;
        }

        public trackEvent(activityName: string, additionalData: any): void {
            this.trackEventTimes++;
            this.trackEventLastActivityName = activityName;
            this.trackEventLastAdditionalData = additionalData;
        }
    }

    export var DefaultLoggerMockType: number = 1;

    export class MockTimerPromiseFactory implements jsCommon.ITimerPromiseFactory {
        public deferred: JQueryDeferred<void>;

        public create(delayInMs: number): jsCommon.IRejectablePromise {
            if (!this.deferred) {
                this.deferred = $.Deferred<void>();
            }

            return this.deferred;
        }

        public resolveCurrent(): void {
            expect(this.deferred).toBeDefined();

            // Note: we need to read the current deferred field into a local var and null out the member before
            // we call resolve, just in case one of timer callbacks recursively creates another timer.
            var deferred = this.deferred;
            this.deferred = undefined;
            deferred.resolve();
        }

        public reject(): void {
            expect(this.deferred).toBeDefined();

            // Note: we need to read the current deferred field into a local var and null out the member before
            // we call reject, just in case one of timer callbacks recursively creates another timer.
            var deferred = this.deferred;
            this.deferred = undefined;
            deferred.reject();
        }

        public expectNoTimers(): void {
            expect(this.deferred).not.toBeDefined();
        }

        public hasPendingTimers(): boolean {
            return !!this.deferred;
        }
    }

    export function createVisualHostServices(): powerbi.IVisualHostServices {
        return new DefaultVisualHostServices();
    }
    
    export class MockTraceListener implements jsCommon.ITraceListener {
        public trace: jsCommon.TraceItem;

        public logTrace(trace: jsCommon.TraceItem): void {
            this.trace = trace;
        }
    }

    export function dataViewScopeIdentity(fakeValue: string | number | boolean | Date): powerbi.DataViewScopeIdentity {
        var expr = constExpr(fakeValue);
        return powerbi.data.createDataViewScopeIdentity(expr);
    }

    export function dataViewScopeIdentityWithEquality(keyExpr: SQExpr, fakeValue: string | number | boolean | Date): powerbi.DataViewScopeIdentity {
        return powerbi.data.createDataViewScopeIdentity(
            SQExprBuilder.equal(
                keyExpr,
                constExpr(fakeValue)));
    }

    function constExpr(fakeValue: string | number | boolean | Date): SQExpr {
        if (fakeValue === null)
            return SQExprBuilder.nullConstant();

        if (fakeValue === true || fakeValue === false)
            return SQExprBuilder.boolean(<boolean>fakeValue);

        if (typeof (fakeValue) === 'number')
            return SQExprBuilder.double(<number>fakeValue);

        if (fakeValue instanceof Date)
            return SQExprBuilder.dateTime(<Date>fakeValue);

        return SQExprBuilder.text(<string>fakeValue);
    }

    export class MockVisualWarning implements powerbi.IVisualWarning {
        public static Message: string = 'Warning';

        // Allow 'code' to be modified for testing.
        public code: string = 'MockVisualWarning';

        public getMessages(resourceProvider: jsCommon.IStringResourceProvider): powerbi.IVisualErrorMessage {
            var details: powerbi.IVisualErrorMessage = {
                message: MockVisualWarning.Message,
                title: 'key',
                detail: 'val',
            };
            return details;
        }
    }
        
    export function setLocale(): void {
        powerbi.visuals.DefaultVisualHostServices.initialize();
    }    

    export function getLocalizedString(stringId: string): string {
        return defaultVisualHostServices.getLocalizedString(stringId);
    }    

    export class MockGeocoder implements powerbi.IGeocoder {
        private callNumber = 0;
        private resultList: powerbi.IGeocodeCoordinate[] = [
            { longitude: 90, latitude: -45 },
            { longitude: 90, latitude: 45 },
            { longitude: -90, latitude: -45 },
            { longitude: -90, latitude: 45 },
            { longitude: 0, latitude: 0 },
            { longitude: 45, latitude: -45 },
            { longitude: 45, latitude: 45 },
            { longitude: -45, latitude: -45 },
            { longitude: -45, latitude: 45 },
        ];

        /** With the way our tests run, these values won't be consistent, so you shouldn't validate actual lat/long or pixel lcoations */
        public geocode(query: string, category?: string, options?: powerbi.GeocodeOptions): any {
            var resultIndex = this.callNumber++ % this.resultList.length;
            var deferred = $.Deferred();
            deferred.resolve(this.resultList[resultIndex]);
            return deferred;
        }

        public tryGeocodeImmediate(query: string, category?: string): powerbi.IGeocodeCoordinate {
            if (3 === this.callNumber++ % 5)
                return null;
            var resultIndex = this.callNumber % this.resultList.length;
            return this.resultList[resultIndex];
        }

        private makeGeocodeBoundary(): powerbi.IGeocodeBoundaryCoordinate {
            // this is colorado
            return {
                latitude: 38.998542785645,
                longitude: -105.54781341553,
                locations: [
                    {
                        nativeBing: "80s-rx-z-K8zo6-6sJ4i2k81wcln3wwopE6_i5qOr8-z1mZuy71-hzc",
                        geographic: new Float64Array([36.9929, -102.04222, 41.00232, -102.05168, 41.00066, -109.04998, 38.2964, -109.06039, 38.15945, -109.04225, 36.99902, -109.04517, 36.9929, -102.04222]),
                        absolute: new Float64Array([113534.74600178, 204082.10164961, 113520.96887822, 196565.23845887, 103328.95579378, 196568.44181674, 103313.79513244, 201684.50661498, 103340.21342222, 201938.40086642, 103335.960864, 204070.94208762, 113534.74600178, 204082.10164961]),
                        absoluteString: "113534.74600177776 204082.10164960928 113520.96887822222 196565.23845886585 103328.95579377777 196568.44181673933 103313.79513244443 201684.5066149847 103340.21342222221 201938.4008664172 103335.96086399998 204070.9420876242 113534.74600177776 204082.10164960928 ",
                        absoluteBounds: {
                            left: 103313.79513244,
                            top: 196565.23845887,
                            width: 10220.950869333,
                            height: 7516.8631907434
                        }
                    }
                ]
            };
        }

        public geocodeBoundary(latitude: number, longitude: number, category: string, levelOfDetail?: number, maxGeoData?: number, options?: powerbi.GeocodeOptions): any {   
            var result = this.makeGeocodeBoundary();
            var deferred = $.Deferred();
            deferred.resolve(result);
            return deferred;
        }

        public geocodePoint(latitude: number, longitude: number, options?: powerbi.GeocodeOptions): any {
            let result = {
                latitude: latitude,
                longitude: longitude,
                addressLine: "10952 109th Ave SE",
                locality: "Bellevue",
                adminDistrict: "WA",
                adminDistrict2: "King Co.",
                formattedAddress: "10952 109th Ave SE, Bellevue, WA 98004",
                postalCode: "98004",
                countryRegionIso2: "US",
                countryRegion: "United States"
            };
            let deferred = $.Deferred();
            deferred.resolve(result);
            return deferred;
        }

        public tryGeocodeBoundaryImmediate(latitude: number, longitude: number, category: string, levelOfDetail?: number, maxGeoData?: number): powerbi.IGeocodeBoundaryCoordinate {
            if (2 === this.callNumber++ % 5)
                return null;
            return this.makeGeocodeBoundary();
        }
    }

    export class MockMapControl {
        private element;
        private width;
        private height;
        private centerX;
        private centerY;

        constructor(element: HTMLElement, width: number, height: number) {
            this.element = element;
            this.width = width;
            this.height = height;
            this.centerX = width / 2;
            this.centerY = height / 2;
        }

        public getRootElement(): Node {
            return this.element;
        }

        public getWidth(): number {
            return this.width;
        }

        public getHeight(): number {
            return this.height;
        }

        public tryLocationToPixel(location) {
            var result;
            if (location.length) {    
                // It's an array of locations; iterate through the array
                result = [];
                for (var i = 0, ilen = location.length; i < ilen; i++) {
                    result.push(this.tryLocationToPixelSingle(location[i]));
                }
            }
            else {
                // It's just a single location
                result = this.tryLocationToPixelSingle(location);
            }
            return result;
        }

        private tryLocationToPixelSingle(location: powerbi.IGeocodeCoordinate) {
            var centerX = this.centerX;
            var centerY = this.centerY;
            
            // Use a really dumb projection with no sort of zooming/panning
            return { x: centerX * (location.longitude / 180), y: centerY * (location.latitude / 90) };
        }

        public setView(viewOptions): void {
            // No op placeholder; we don't need to bother with zoom/pan for mocking.  Spies can confirm anything about params we care about
        }
    }

    // Mocks for Microsoft's Bing Maps API; implements select methods in the interface for test purposes
    // Declared separately from Microsoft.Maps to avoid collision with the declaration in Microsoft.Maps.d.ts
    export module MockMaps {
        export module Globals {
            export let roadUriFormat = "";
        }

        export function loadModule(moduleKey: string, options?: { callback: () => void; }): void {
            if (options && options.callback)
                options.callback();
        }

        export class LocationRect {
            constructor(center: Location, width: number, height: number) {
                this.center = center;
                this.width = width;
                this.height = height;
            }

            public center: Location;
            public height: number;
            public width: number;

            public static fromCorners(northwest: Location, southeast: Location): LocationRect {
                var centerLat = (northwest.latitude + southeast.latitude) / 2;
                var centerLong = (northwest.longitude + southeast.longitude) / 2;
                return new LocationRect(
                    new Location(centerLat, centerLong),
                    southeast.longitude - northwest.longitude,
                    northwest.latitude - southeast.latitude);
            }

            public static fromEdges(north: number, west: number, south: number, east: number, altitude: number, altitudeReference: AltitudeReference): LocationRect {
                var centerLat = (north + south) / 2;
                var centerLong = (east + west) / 2;
                return new LocationRect(
                    new Location(centerLat, centerLong),
                    east - west,
                    north - south);
            }

            public getNorthwest(): Location {
                return new Location(this.center.latitude - this.height / 2, this.center.longitude - this.width / 2);
            }

            public getSoutheast(): Location {
                return new Location(this.center.latitude + this.height / 2, this.center.longitude + this.width / 2);
            }
        }

        export class Location {
            constructor(latitude: number, longitude: number, altitude?: number, altitudeReference?: AltitudeReference) {
                this.latitude = latitude;
                this.longitude = longitude;
                this.x = longitude;
                this.y = latitude;
            }

            public latitude: number;
            public longitude: number;
            public x: number;
            public y: number;
        }

        export class AltitudeReference {
        }

        export class MapTypeId {
            public static road: string = 'r';
        }

        export module Events {
            export function addHandler(target: any, eventName: string, handler: any) { }
        }
    }

    export class MockBehavior implements powerbi.visuals.IInteractiveBehavior {
        private selectableDataPoints: SelectableDataPoint[];
        private selectionHandler: ISelectionHandler;
        private filterPropertyId: powerbi.DataViewObjectPropertyIdentifier;

        constructor(selectableDataPoints: SelectableDataPoint[], filterPropertyId: powerbi.DataViewObjectPropertyIdentifier) {
            this.selectableDataPoints = selectableDataPoints;
            this.filterPropertyId = filterPropertyId;
        }

        public bindEvents(options: any, selectionHandler: ISelectionHandler): void {
            this.selectionHandler = selectionHandler;
        }

        public renderSelection(hasSelection: boolean): void {
            // Stub method to spy on
        }

        public selectIndex(index: number, multiSelect?: boolean): void {
            this.selectionHandler.handleSelection(this.selectableDataPoints[index], !!multiSelect);
        }

        public select(datapoint: SelectableDataPoint, multiSelect?: boolean): void {
            this.selectionHandler.handleSelection(datapoint, !!multiSelect);
        }

        public clear(): void {
            this.selectionHandler.handleClearSelection();
        }

        public selectIndexAndPersist(index: number, multiSelect?: boolean): void {
            this.selectionHandler.handleSelection(this.selectableDataPoints[index], !!multiSelect);
            this.selectionHandler.persistSelectionFilter(this.filterPropertyId);
        }

        public verifyCleared(): boolean {
            let selectableDataPoints = this.selectableDataPoints;
            for (let i = 0, ilen = selectableDataPoints.length; i < ilen; i++) {
                if (selectableDataPoints[i].selected)
                    return false;
            }
            return true;
        }

        public verifySingleSelectedAt(index: number): boolean {
            let selectableDataPoints = this.selectableDataPoints;
            for (let i = 0, ilen = selectableDataPoints.length; i < ilen; i++) {
                let dataPoint = selectableDataPoints[i];
                if (i === index) {
                    if (!dataPoint.selected)
                        return false;
                }
                else if (dataPoint.selected)
                    return false;
            }
            return true;
        }

        public verifySelectionState(selectionState: boolean[]): boolean {
            let selectableDataPoints = this.selectableDataPoints;
            for (let i = 0, ilen = selectableDataPoints.length; i < ilen; i++) {
                if (selectableDataPoints[i].selected !== selectionState[i])
                    return false;
            }
            return true;
        }

        public selections(): boolean[] {
            let selectableDataPoints = this.selectableDataPoints;
            let selections: boolean[] = [];
            for (let dataPoint of selectableDataPoints) {
                selections.push(!!dataPoint.selected);
            }
            return selections;
        }
    }

    export class MockSelectionHandler implements powerbi.visuals.ISelectionHandler {
        public handleSelection(dataPoint: SelectableDataPoint, multiSelect: boolean): void { }
        public handleContextMenu(dataPoint: SelectableDataPoint, position: powerbi.visuals.IPoint): void { }
        public handleClearSelection(): void { }
        public toggleSelectionModeInversion(): boolean { return true; }
        public persistSelectionFilter(filterPropertyIdentifier: powerbi.DataViewObjectPropertyIdentifier): void { }
        public persistSelfFilter(filterPropertyIdentifier: powerbi.DataViewObjectPropertyIdentifier, selfFilter: SemanticFilter): void { }
    }

    export class FilterAnalyzerMock implements powerbi.AnalyzedFilter {
        public filter: SemanticFilter;
        public defaultValue: powerbi.DefaultValueDefinition;
        public isNotFilter: boolean;
        public selectedIdentities: powerbi.DataViewScopeIdentity[];

        private fieldSQExprs: SQExpr[];
        private container: powerbi.data.FilterValueScopeIdsContainer;
        public constructor(
            filter: SemanticFilter,
            fieldSQExprs: SQExpr[],
            defaultValue?: powerbi.DefaultValueDefinition,
            selectedIdentities?: powerbi.DataViewScopeIdentity[]) {
            this.filter = filter;
            this.fieldSQExprs = fieldSQExprs;
            
            if (this.filter
                && !SemanticFilter.isDefaultFilter(this.filter)
                && !SemanticFilter.isAnyFilter(this.filter)) {
                this.container = powerbi.data.SQExprConverter.asScopeIdsContainer(this.filter, this.fieldSQExprs);
            }
            else {
                this.container = { isNot: false, scopeIds: [] };
            }

            this.isNotFilter = this.container && this.container.isNot;
            this.selectedIdentities = selectedIdentities || (this.container && this.container.scopeIds);

            this.defaultValue = defaultValue;
        }
    }

    export function createMockTelemetryService(): ITelemetryService {
        return new MockTelemetryService();
    }

    class MockTelemetryService implements ITelemetryService {

        constructor() { }

        public suspend(): void { }

        public resume(): void { }

        public flush(): void { }

        /** Log telemetry event **/
        logEvent(eventFactory: ITelemetryEventFactory): ITelemetryEvent;
        logEvent<T>(eventFactory: ITelemetryEventFactory1<T>, arg: T): ITelemetryEvent;
        logEvent<T1, T2>(eventFactory: ITelemetryEventFactory2<T1, T2>, arg1: T1, arg2: T2): ITelemetryEvent;
        logEvent<T1, T2, T3>(eventFactory: ITelemetryEventFactory3<T1, T2, T3>, arg1: T1, arg2: T2, arg3: T3): ITelemetryEvent;
        logEvent<T1, T2, T3, T4>(eventFactory: ITelemetryEventFactory4<T1, T2, T3, T4>, arg1: T1, arg2: T2, arg3: T3, arg4: T4): ITelemetryEvent;
        logEvent<T1, T2, T3, T4, T5>(eventFactory: ITelemetryEventFactory5<T1, T2, T3, T4, T5>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5): ITelemetryEvent;
        logEvent<T1, T2, T3, T4, T5, T6>(eventFactory: ITelemetryEventFactory6<T1, T2, T3, T4, T5, T6>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6): ITelemetryEvent;
        logEvent<T1, T2, T3, T4, T5, T6, T7>(eventFactory: ITelemetryEventFactory7<T1, T2, T3, T4, T5, T6, T7>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7): ITelemetryEvent;
        logEvent<T1, T2, T3, T4, T5, T6, T7, T8>(eventFactory: ITelemetryEventFactory8<T1, T2, T3, T4, T5, T6, T7, T8>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8): ITelemetryEvent;
        logEvent<T1, T2, T3, T4, T5, T6, T7, T8, T9>(eventFactory: ITelemetryEventFactory9<T1, T2, T3, T4, T5, T6, T7, T8, T9>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, arg9: T9): ITelemetryEvent;
        logEvent<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(eventFactory: ITelemetryEventFactory10<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, arg9: T9, arg10: T10): ITelemetryEvent;
        logEvent<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>(eventFactory: ITelemetryEventFactory11<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, arg9: T9, arg10: T10, arg11: T11): ITelemetryEvent;
        public logEvent(eventFactory: Function, ...args: any[]): ITelemetryEvent {
            return;
        }

        /** Log telemetry event **/
        /** Starts recording a timed event **/
        startEvent(eventFactory: ITelemetryEventFactory): IDeferredTelemetryEvent;
        startEvent<T>(eventFactory: ITelemetryEventFactory1<T>, arg: T): IDeferredTelemetryEvent;
        startEvent<T1, T2>(eventFactory: ITelemetryEventFactory2<T1, T2>, arg1: T1, arg2, T2): IDeferredTelemetryEvent;
        startEvent<T1, T2, T3>(eventFactory: ITelemetryEventFactory3<T1, T2, T3>, arg1: T1, arg2: T2, arg3: T3): IDeferredTelemetryEvent;
        startEvent<T1, T2, T3, T4>(eventFactory: ITelemetryEventFactory4<T1, T2, T3, T4>, arg1: T1, arg2: T2, arg3: T3, arg4: T4): IDeferredTelemetryEvent;
        startEvent<T1, T2, T3, T4, T5>(eventFactory: ITelemetryEventFactory5<T1, T2, T3, T4, T5>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5): IDeferredTelemetryEvent;
        startEvent<T1, T2, T3, T4, T5, T6>(eventFactory: ITelemetryEventFactory6<T1, T2, T3, T4, T5, T6>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6): IDeferredTelemetryEvent;
        startEvent<T1, T2, T3, T4, T5, T6, T7>(eventFactory: ITelemetryEventFactory7<T1, T2, T3, T4, T5, T6, T7>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7): IDeferredTelemetryEvent;
        startEvent<T1, T2, T3, T4, T5, T6, T7, T8>(eventFactory: ITelemetryEventFactory8<T1, T2, T3, T4, T5, T6, T7, T8>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8): IDeferredTelemetryEvent;
        startEvent<T1, T2, T3, T4, T5, T6, T7, T8, T9>(eventFactory: ITelemetryEventFactory9<T1, T2, T3, T4, T5, T6, T7, T8, T9>, arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, arg9: T9): IDeferredTelemetryEvent;
        public startEvent(eventFactory: ITelemetryEventFactory): IDeferredTelemetryEvent {
            return;
        }
    }

}
