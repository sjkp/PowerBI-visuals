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

// TODO(aafische, 2016.05.16) all methods here are copy-pasted from .\src\Clients\JsCommon\obj\utility.d.ts
// Eventually, the powerbi.visuals namespace will be merged back into the powerbi namespace, at which point 
// this here file will be obsolete and deleted.

/// <reference path="../_references.ts"/>

declare module powerbi.visuals.telemetry {
    
    interface ITelemetryService {
        /** Log Telemetry event */
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
     }
    
    interface ITelemetryEvent {
        name: string;
        category?: TelemetryCategory;
        id: string;
        loggers?: number;
        time: number;
        getFormattedInfoObject(): any;
        info: any;
        privateFields: string[];
        orgInfoFields: string[];
    }

    interface ITelemetryEventFactory {
        (parentId: string): ITelemetryEvent;
    }
    interface ITelemetryEventFactory1<T> {
        (arg: T, parentId: string): ITelemetryEvent;
    }
    interface ITelemetryEventFactory2<T1, T2> {
        (arg1: T1, arg2: T2, parentId: string): ITelemetryEvent;
    }
    interface ITelemetryEventFactory3<T1, T2, T3> {
        (arg1: T1, arg2: T2, arg3: T3, parentId: string): ITelemetryEvent;
    }
    interface ITelemetryEventFactory4<T1, T2, T3, T4> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, parentId: string): ITelemetryEvent;
    }
    interface ITelemetryEventFactory5<T1, T2, T3, T4, T5> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, parentId: string): ITelemetryEvent;
    }
    interface ITelemetryEventFactory6<T1, T2, T3, T4, T5, T6> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, parentId: string): ITelemetryEvent;
    }
    interface ITelemetryEventFactory7<T1, T2, T3, T4, T5, T6, T7> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, parentId: string): ITelemetryEvent;
    }
    interface ITelemetryEventFactory8<T1, T2, T3, T4, T5, T6, T7, T8> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, parentId: string): ITelemetryEvent;
    }
    interface ITelemetryEventFactory9<T1, T2, T3, T4, T5, T6, T7, T8, T9> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, arg9: T9, parentId: string): ITelemetryEvent;
    }
    interface ITelemetryEventFactory10<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, arg9: T9, arg10: T10, parentId: string): ITelemetryEvent;
    }
    interface ITelemetryEventFactory11<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11> {
        (arg1: T1, arg2: T2, arg3: T3, arg4: T4, arg5: T5, arg6: T6, arg7: T7, arg8: T8, arg9: T9, arg10: T10, arg11: T11, parentId: string): ITelemetryEvent;
    }
    
    interface IBaseEvent {
        parentId: string;
        isError: boolean;
        errorSource: ErrorSource;
        errorCode: string;
    }
    
    interface ICustomerAction extends IBaseEvent {
    }
    
    /** Identifies a long-running telemetry event. */
    interface IDeferredTelemetryEvent {
        /** The event being recorded. */
        event: ITelemetryEvent;
        /** Marks the telemetry event as complete. */
        resolve(): any;
        /** Marks the telemetry event as failed. Can specify additional error details if we know the source of the error and/or the error code. */
        reject(errorDetails?: TelemetryErrorDetails): any;
    }
    interface IDeferredTelemetryEventArgs {
        /** Parent event started by the invoker and passed to the event handler */
        parentEvent: IDeferredTelemetryEvent;
    }
    interface TelemetryErrorDetails {
        errorSource?: telemetry.ErrorSource;
        errorCode: string;
    }    
}

declare module powerbi {
    interface ITelemetryService { }
}

