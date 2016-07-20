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

module powerbi {
    export enum VisualDataRoleKind {
        /** Indicates that the role should be bound to something that evaluates to a grouping of values. */
        Grouping,
        /** Indicates that the role should be bound to something that evaluates to a single value in a scope. */
        Measure,
        /** Indicates that the role can be bound to either Grouping or Measure. */
        GroupingOrMeasure,
    }

    export enum VisualDataChangeOperationKind {
        Create = 0,
        Append = 1,
    }

    export enum VisualUpdateType {
        Data = 1 << 1,
        Resize = 1 << 2,
        ViewMode = 1 << 3,
        Style = 1 << 4,
        ResizeEnd = 1 << 5,
        All = Data | Resize | ViewMode | Style | ResizeEnd
    }

    export enum VisualPermissions {

    }

    export const enum CartesianRoleKind {
        X,
        Y,
    }

    export const enum ViewMode {
        View = 0,
        Edit = 1,
    }

    export const enum ResizeMode {
        Resizing = 1,
        Resized = 2,
    }

    export module visuals.telemetry {
        export const enum TelemetryCategory {
            Verbose,
            CustomerAction,
            CriticalError,
            Trace,
        }

        export enum ErrorSource {
            PowerBI = 0,
            External = 1,
            User = 2,
        }
    }

    export const enum JoinPredicateBehavior {
        /** Prevent items in this role from acting as join predicates. */
        None,
    }

    export const enum PromiseResultType {
        Success,
        Failure,
    }

    /**
     * Defines actions to be taken by the visual in response to a selection.
     *
     * An undefined/null VisualInteractivityAction should be treated as Selection,
     * as that is the default action.
     */
    export const enum VisualInteractivityAction {
        /** Normal selection behavior which should call onSelect */
        Selection,
        /** No additional action or feedback from the visual is needed */
        None,
    }
}