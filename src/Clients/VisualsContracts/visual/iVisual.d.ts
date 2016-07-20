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

declare module powerbi {
    import DataViewObjectDescriptor = powerbi.data.DataViewObjectDescriptor;
    import DataViewObjectDescriptors = powerbi.data.DataViewObjectDescriptors;
    import Selector = powerbi.data.Selector;
    import IPoint = powerbi.visuals.IPoint;
    import ISemanticFilter = powerbi.data.ISemanticFilter;
    import ISQExpr = powerbi.data.ISQExpr;
    import IStringResourceProvider = jsCommon.IStringResourceProvider;
    import IRect = powerbi.visuals.IRect;

    /**
     * Represents a visualization displayed within an application (PowerBI dashboards, ad-hoc reporting, etc.).
     * This interface does not make assumptions about the underlying JS/HTML constructs the visual uses to render itself.
     */
    export interface IVisual {
        /**
         * Initializes an instance of the IVisual.
         *
         * @param options Initialization options for the visual.
         */
        init(options: VisualInitOptions): void;

        /** Notifies the visual that it is being destroyed, and to do any cleanup necessary (such as unsubscribing event handlers). */
        destroy?(): void;

        /**
         * Notifies the IVisual of an update (data, viewmode, size change).
         */
        update?(options: VisualUpdateOptions): void;

        /**
         * Notifies the IVisual to resize.
         *
         * @param finalViewport This is the viewport that the visual will eventually be resized to.
         * @param resized true on on final call when resizing is complete.
         */
        onResizing?(finalViewport: IViewport, resizeMode?: ResizeMode): void;

        /**
         * Notifies the IVisual of new data being provided.
         * This is an optional method that can be omitted if the visual is in charge of providing its own data.
         */
        onDataChanged?(options: VisualDataChangedOptions): void;

        /** Notifies the IVisual to change view mode if applicable. */
        onViewModeChanged?(viewMode: ViewMode): void;

        /** Notifies the IVisual to clear any selection. */
        onClearSelection?(): void;

        /** Gets a value indicating whether the IVisual can be resized to the given viewport. */
        canResizeTo?(viewport: IViewport): boolean;

        /** Gets the set of objects that the visual is currently displaying. */
        enumerateObjectInstances?(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration;

        /** Gets the set of object repetitions that the visual can display. */
        enumerateObjectRepetition?(): VisualObjectRepetition[];
    }

    /** Parameters available to a CustomizeQueryMethod */
    export interface CustomizeQueryOptions {
        /**
         * The data view mapping for this visual with some additional information. CustomizeQueryMethod implementations
         * are expected to edit this in-place.
         */
        dataViewMappings: data.CompiledDataViewMapping[];

        /**
         * Visual should prefer to request a higher volume of data.
         */
        preferHigherDataVolume?: boolean;
    }

    /** Parameters available to a sortable visual candidate */
    export interface VisualSortableOptions {
        /* The data view mapping for this visual with some additional information.*/
        dataViewMappings: data.CompiledDataViewMapping[];
    }

    /** An imperative way for a visual to influence query generation beyond just its declared capabilities. */
    export interface CustomizeQueryMethod {
        (options: CustomizeQueryOptions): void;
    }

    /** Defines the visual filtering capability for a particular filter kind. */
    export interface VisualFilterMapping {
        /** Specifies what data roles are used to control the filter semantics for this filter kind. */
        targetRoles: string[];
    }

    /**
     * Defines the visual filtering capabilities for various filter kinds.
     * By default all visuals support attribute filters and measure filters in their innermost scope.
     */
    export interface VisualFilterMappings {
        measureFilter?: VisualFilterMapping;
    }

    /** Defines the capabilities of an IVisual. */
    export interface VisualCapabilities {
        /** Defines what roles the visual expects, and how those roles should be populated.  This is useful for visual generation/editing. */
        dataRoles?: VisualDataRole[];

        /** Defines the set of objects supported by this IVisual. */
        objects?: DataViewObjectDescriptors;

        /** Defines how roles that the visual understands map to the DataView.  This is useful for query generation. */
        dataViewMappings?: DataViewMapping[];

        /** Defines how filters are understood by the visual. This is used by query generation */
        filterMappings?: VisualFilterMappings;

        /** Indicates whether cross-highlight is supported by the visual. This is useful for query generation. */
        supportsHighlight?: boolean;

        /** Indicates whether the visual uses onSelected function for data selections.  Default is true. */
        supportsSelection?: boolean;

        /** Indicates whether sorting is supported by the visual. This is useful for query generation */
        sorting?: VisualSortingCapabilities;

        /** Indicates whether a default title should be displayed.  Visuals with self-describing layout can omit this. */
        suppressDefaultTitle?: boolean;

        /** Indicates whether a default padding should be applied. */
        suppressDefaultPadding?: boolean;

        /** Indicates whether drilling is supported by the visual. */
        drilldown?: VisualDrillCapabilities;

        /** Indicates whether rotating is supported by the visual. */
        canRotate?: boolean;

        /** Indicates whether showing the data underlying this visual would be helpful.  Visuals that already show raw data can specify this. */
        disableVisualDetails?: boolean;

        /** Indicates whether focus mode is supported for the visual. Visuals that would not benefit from focus mode (such as non-data-bound ones) can set it to true.  */
        disableFocusMode?: boolean;
    }

    /** Defines the visual sorting capability. */
    export interface VisualSortingCapabilities {
        /** When specified, indicates that the IVisual wants default sorting behavior. */
        default?: {};

        /** When specified, indicates that the IVisual wants to control sort interactivity. */
        custom?: {};

        /** When specified, indicates sorting that is inherently implied by the IVisual.  This is useful to automatically sort. */
        implicit?: VisualImplicitSorting;
    }

    /** Defines the visual's drill capability. */
    export interface VisualDrillCapabilities {
        /** Returns the drillable role names for this visual **/
        roles?: string[];
    }

    /** Defines implied sorting behaviour for an IVisual. */
    export interface VisualImplicitSorting {
        clauses: VisualImplicitSortingClause[];
    }

    export interface VisualImplicitSortingClause {
        role: string;
        direction: SortDirection;
    }

    /** Defines the capabilities of an IVisual. */
    export interface VisualInitOptions {
        /** The DOM element the visual owns. */
        element: JQuery;

        /** The set of services provided by the visual hosting layer. */
        host: IVisualHostServices;

        /** Style information. */
        style: IVisualStyle;

        /** The initial viewport size. */
        viewport: IViewport;

        /** Animation options. */
        animation?: AnimationOptions;

        /** Interactivity options. */
        interactivity?: InteractivityOptions;
    }

    export interface VisualUpdateOptions {
        viewport: IViewport;
        dataViews: DataView[];
        suppressAnimations?: boolean;
        viewMode?: ViewMode;
        resizeMode?: ResizeMode;
        type?: VisualUpdateType;
        /** Indicates what type of update has been performed on the data.
        The default operation kind is Create.*/
        operationKind?: VisualDataChangeOperationKind;
    }

    export interface VisualDataChangedOptions {
        dataViews: DataView[];

        /** Optionally prevent animation transitions */
        suppressAnimations?: boolean;

        /** Indicates what type of update has been performed on the data.
        The default operation kind is Create.*/
        operationKind?: VisualDataChangeOperationKind;
    }

    export interface CustomSortEventArgs {
        sortDescriptors: SortableFieldDescriptor[];
    }

    export interface SortableFieldDescriptor {
        queryName: string;
        sortDirection?: SortDirection;
    }

    export interface IVisualErrorMessage {
        message: string;
        title: string;
        detail: string;
    }

    export interface IVisualWarning {
        code: string;
        getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage;
    }

    /** Animation options for visuals. */
    export interface AnimationOptions {
        /** Indicates whether all transition frames should be flushed immediately, effectively "disabling" any visual transitions. */
        transitionImmediate: boolean;
    }

    /** Interactivity options for visuals. */
    export interface InteractivityOptions {
        /** Indicates that dragging of data points should be permitted. */
        dragDataPoint?: boolean;

        /** Indicates that data points should be selectable. */
        selection?: boolean;

        /** Indicates that the chart and the legend are interactive */
        isInteractiveLegend?: boolean;

        /** Indicates overflow behavior. Values are CSS oveflow strings */
        overflow?: string;
    }

    export interface VisualDragPayload extends DragPayload {
        data?: Selector;
        field?: {};
    }

    export interface DragEventArgs {
        event: DragEvent;
        data: VisualDragPayload;
    }

    /** Defines geocoding services. */
    export interface GeocodeOptions {
        /** promise that should abort the request when resolved */
        timeout?: IPromise<any>;
    }

    export interface IGeocoder {
        geocode(query: string, category?: string, options?: GeocodeOptions): IPromise<IGeocodeCoordinate>;
        geocodeBoundary(latitude: number, longitude: number, category: string, levelOfDetail?: number, maxGeoData?: number, options?: GeocodeOptions): IPromise<IGeocodeBoundaryCoordinate>;
        geocodePoint(latitude: number, longitude: number, options?: GeocodeOptions): IPromise<IGeocodeResource>;

        /** returns data immediately if it is locally available (e.g. in cache), null if not in cache */
        tryGeocodeImmediate(query: string, category?: string): IGeocodeCoordinate;
        tryGeocodeBoundaryImmediate(latitude: number, longitude: number, category: string, levelOfDetail?: number, maxGeoData?: number): IGeocodeBoundaryCoordinate;
    }

    export interface IGeocodeCoordinate {
        latitude: number;
        longitude: number;
    }

    export interface IGeocodeBoundaryCoordinate {
        latitude?: number;
        longitude?: number;
        locations?: IGeocodeBoundaryPolygon[]; // one location can have multiple boundary polygons
    }

    export interface IGeocodeResource extends IGeocodeCoordinate {
        addressLine: string;
        locality: string;
        neighborhood: string;
        adminDistrict: string;
        adminDistrict2: string;
        formattedAddress: string;
        postalCode: string;
        countryRegionIso2: string;
        countryRegion: string;
        landmark: string;
        name: string;
    }

    export interface IGeocodeBoundaryPolygon {
        nativeBing: string;

        /** array of lat/long pairs as [lat1, long1, lat2, long2,...] */
        geographic?: Float64Array;

        /** array of absolute pixel position pairs [x1,y1,x2,y2,...]. It can be used by the client for cache the data. */
        absolute?: Float64Array;
        absoluteBounds?: IRect;

        /** string of absolute pixel position pairs "x1 y1 x2 y2...". It can be used by the client for cache the data. */
        absoluteString?: string;
    }

    export interface SelectorForColumn {
        [queryName: string]: data.DataRepetitionSelector;
    }

    export interface SelectorsByColumn {
        /** Data-bound repetition selection. */
        dataMap?: SelectorForColumn;

        /** Metadata-bound repetition selection.  Refers to a DataViewMetadataColumn queryName. */
        metadata?: string;

        /** User-defined repetition selection. */
        id?: string;
    }
    
    export interface SelectingEventArgs {
        visualObjects: VisualObject[];
        action?: VisualInteractivityAction;
    }
    
    export interface SelectEventArgs {
        visualObjects: VisualObject[];
        selectors?: Selector[]; // An array of selectors used in place of visualObjects for certain backwards compatibility cases
    }

    export interface VisualObject {
        /** The name of the object (as defined in object descriptors). */
        objectName: string;

        /** Data-bound repitition selection */
        selectorsByColumn: SelectorsByColumn;
    }

    export interface ContextMenuArgs {
        data: SelectorsByColumn[];

        /** Absolute coordinates for the top-left anchor of the context menu. */
        position: IPoint;
    }

    export interface SelectObjectEventArgs {
        object: DataViewObjectDescriptor;
    }

    export interface FilterAnalyzerOptions {
        dataView: DataView;

        /** The DataViewObjectPropertyIdentifier for default value */
        defaultValuePropertyId: DataViewObjectPropertyIdentifier;

        /** The filter that will be analyzed */
        filter: ISemanticFilter;

        /** The field SQExprs used in the filter */
        fieldSQExprs: ISQExpr[];
    }

    export interface AnalyzedFilter {
        /** The default value of the slicer selected item and it can be undefined if there is no default value */
        defaultValue?: DefaultValueDefinition;

        /** Indicates the filter has Not condition. */
        isNotFilter: boolean;

        /** The selected filter values. */
        selectedIdentities: DataViewScopeIdentity[];

        /** The filter after analyzed. It will be the default filter if it has defaultValue and the pre-analyzed filter is undefined. */
        filter: ISemanticFilter;
    }

    /** Defines behavior for IVisual interaction with the host environment. */
    export interface IVisualHostServices {
        /** Returns the localized form of a string. */
        getLocalizedString(stringId: string): string;

        /** Notifies of a DragStart event. */
        onDragStart(args: DragEventArgs): void;

        ///** Indicates whether the drag payload is compatible with the IVisual's data role.  This is useful when dropping to a particular drop area within the visual (e.g., dropping on a legend). */
        //canDropAs(payload: DragPayload, dataRole?: string): boolean;

        ///** Notifies of a Drop event. */
        //onDrop(args: DragEventArgs, dataRole?: string);

        /** Gets a value indicating whether the given selection is valid. */
        canSelect(args: SelectEventArgs): boolean;

        /** Notifies of the execution of a select event. */
        onSelecting(args: SelectingEventArgs): void;

        /** Notifies of the selection state changing. */
        onSelect(args: SelectEventArgs): void;

        /** Notifies of a request for a context menu. */
        onContextMenu(args: ContextMenuArgs): void;

        /** Check if selection is sticky or otherwise. */
        shouldRetainSelection(): boolean;

        /** Notifies that properties of the IVisual have changed. */
        persistProperties(changes: VisualObjectInstance[]): void;
        persistProperties(changes: VisualObjectInstancesToPersist): void;

        ///** This information will be part of the query. */
        //onDataRangeChanged(range: {
        //    categorical: { // TODO: this structure is affected by the reduction algorithm as well as the data view type
        //        categories?: {
        //            /** Index of the category. */
        //            index: number;
        //            lower?: DataViewScopeIdentity;
        //            upper?: DataViewScopeIdentity;
        //        }[]
        //    }
        // });

        ///** Notifies of a drill down on the specified data point. */
        //onDrillDown(data: DataViewScopeIdentity): void;

        /** Requests more data to be loaded. */
        loadMoreData(): void;

        /** Notification to sort on the specified column */
        onCustomSort(args: CustomSortEventArgs): void;

        /** Indicates which view mode the host is in. */
        getViewMode(): ViewMode;

        /** Notify any warning that happened during update of the visual. */
        setWarnings(clientWarnings: IVisualWarning[]): void;

        /** Sets a toolbar on the host. */
        setToolbar($selector: JQuery): void;

        /** Gets Geocoding Service. */
        geocoder(): IGeocoder;

        /** Gets IGeolocation Service */
        geolocation(): IGeolocation;

        /** Gets the locale string */
        locale?(): string;

        /** Gets the promise factory. */
        promiseFactory(): IPromiseFactory;

        /** Gets filter analyzer */
        analyzeFilter(options: FilterAnalyzerOptions): AnalyzedFilter;

        /** Gets display name for the identities */
        getIdentityDisplayNames(identities: DataViewScopeIdentity[]): DisplayNameIdentityPair[];

        /** Set the display names for their corresponding DataViewScopeIdentity */
        setIdentityDisplayNames(displayNamesIdentityPairs: DisplayNameIdentityPair[]): void;
        
        visualCapabilitiesChanged?(): void;
    }

    export interface DisplayNameIdentityPair {
        displayName: string;
        identity: DataViewScopeIdentity;
    }
}
