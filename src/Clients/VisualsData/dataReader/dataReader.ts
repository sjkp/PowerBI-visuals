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

module powerbi.data {
    /** Represents a data reader. */
    export interface IDataReader {
        /** Executes a query, with a promise of completion.  The response object should be compatible with the transform implementation. */
        execute?(options: DataReaderExecutionOptions): RejectablePromise2<DataReaderData, IClientError>;

        /** Transforms the given data into a DataView.  When this function is not specified, the data is put on a property on the DataView. */
        transform?(obj: DataReaderData): DataReaderTransformResult;

        /** Stops all future communication and reject and pending communication  */
        stopCommunication?(): void;

        /** Resumes communication which enables future requests */
        resumeCommunication?(): void;

        /** Clear cache */
        clearCache?(dataSource: DataReaderDataSource): void;

        /** rewriteCacheEntries */
        rewriteCacheEntries?(dataSource: DataReaderDataSource, rewriter: DataReaderCacheRewriter): void;

        /** Sets the result into the local cache */
        setLocalCacheResult?(options: DataReaderExecutionOptions, dataAsObject: DataReaderData): void;
    }

    /** Represents a query generator. */
    export interface IQueryGenerator {
        /** Query generation function to convert a (prototype) SemanticQuery to a runnable query command. */
        execute(options: QueryGeneratorOptions): QueryGeneratorResult;
    }

    export interface IFederatedConceptualSchemaReader {
        /** Executes a request for conceptual schema with a promise of completion. */
        execute(options: FederatedConceptualSchemaReaderOptions): IPromise<FederatedConceptualSchemaResponse>;

        /** Transforms the given data into a FederatedConceptualSchema. */
        transform(obj: FederatedConceptualSchemaResponse): SchemaReaderTransformResult;
    }

    /** Represents a custom data reader plugin, to be registered in the powerbi.data.plugins object. */
    export interface IDataReaderPlugin {
        /** The name of this plugin. */
        name: string;
        
        /** Factory method for the IDataReader. */
        reader(hostServices: IDataReaderHostServices): IDataReader;

        /** Factory method for the IQueryGenerator. */
        queryGenerator?(): IQueryGenerator;

        /** Factory method for the IFederatedConceptualSchemaReader. */
        schemaReader?(hostServices: IDataReaderHostServices): IFederatedConceptualSchemaReader;
    }

    export interface QueryGeneratorOptions {
        query: SemanticQuery;
        mappings: CompiledDataViewMapping[];
        additionalProjections?: AdditionalQueryProjection[];
        highlightFilter?: SemanticFilter;
        restartToken?: RestartToken;
        dataWindow?: QueryGeneratorDataWindow;
    }

    export interface AdditionalQueryProjection {
        queryName: string;
        selector: Selector;
        aggregates?: ProjectionAggregates;
        joinPredicate?: JoinPredicateBehavior;
    }

    export interface ProjectionAggregates {
        min?: boolean;
        max?: boolean;
        percentiles?: ProjectionPercentileAggregate[];
    }

    export interface ProjectionPercentileAggregate {
        exclusive?: boolean;
        k: number;
    }

    export interface QueryGeneratorResult {
        command: DataReaderQueryCommand;
        splits?: DataViewSplitTransform[];

        /**
         * If the query generator needs to rewrite the input query, this property will contain information about the important changes.
         *
         * Any rewrite done by query generator should be internal to the particular query generator, but in some rare cases this information
         * is needed in order for other components to correctly consume the query result.
         */
        queryRewrites?: QueryRewriteRecordContainer[];
    }

    /**
     * In each instance of QueryRewriteRecordContainer, exactly one of the optional properties will be populated with change record.
     */
    export interface QueryRewriteRecordContainer {
        selectExprAdded?: QueryRewriteSelectExprAddedRecord;
        aggregatesAdded?: QueryRewriteSelectExprAggregatesAddedRecord;
        projectionQueryRefChanged?: QueryRewriteProjectionQueryRefChangedRecord;
    }

    /** Indicates a new SQExpr got added at a particular index. */
    export interface QueryRewriteSelectExprAddedRecord {
        selectIndex: number;
        namedSQExpr: NamedSQExpr;
    }
    
    export interface QueryRewriteSelectExprAggregatesAddedRecord {
        originalQueryRef: string;
        aggregates: QueryRewriteAddedAggregates;
    }
    
    export interface QueryRewriteAddedAggregates {
        min?: QueryRewriteAddedAggregateSource;
        max?: QueryRewriteAddedAggregateSource;
    }

    export interface QueryRewriteAddedAggregateSource {
         index: number;
         expr: SQExpr;
    }

    /** Indicates a queryRef in the query projection for a particular role got changed. */
    export interface QueryRewriteProjectionQueryRefChangedRecord {
        /** The role for which a queryRef in the query projection got changed. */
        role: string;

        /** The original queryRef. */
        oldQueryRef: string;

        /** The new, internal queryRef. */
        newInternalQueryRef: string;
    }
    
    export interface DataReaderTransformResult {
        dataView?: DataView;
        restartToken?: RestartToken;
        error?: IClientError;
        warning?: IClientWarning;

        /** A value of true in this property indicates that the DataReaderData object from which this result is generated should not get persisted as contract cache nor server cache. */
        disallowPersisting?: boolean;
    }

    export interface QueryGeneratorDataWindow {
        // This interface is intentionally empty, as plugins define their own data structure.
    }

    export interface RestartToken {
        // This interface is intentionally empty, as plugins define their own data structure.
    }

    export interface DataReaderQueryCommand {
        // This interface is intentionally empty, as plugins define their own data structure.
    }

    /** Represents a query command defined by an IDataReader. */
    export interface DataReaderCommand {
        // This interface is intentionally empty, as plugins define their own data structure.
    }

    /** Represents a data source defined by an IDataReader. */
    export interface DataReaderDataSource {
        // This interface is intentionally empty, as plugins define their own data structure.
    }

    /** Represents arbitrary data defined by an IDataReader. */
    export interface DataReaderData {
        // This interface is intentionally empty, as plugins define their own data structure.
    }

    /** Represents cacheRewriter that will rewrite the cache of reader as defined by an IDataReader. */
    export interface DataReaderCacheRewriter {
        // This interface is intentionally empty, as plugins define their own data structure.
    }

    export interface DataReaderExecutionOptions {
        dataSource?: DataReaderDataSource;
        command: DataReaderCommand;
        allowCache?: boolean;
        allowClientSideFilters?: boolean;
        cacheResponseOnServer?: boolean;
        ignoreViewportForCache?: boolean;
    }

    export interface FederatedConceptualSchemaReaderOptions {
        dataSources: ConceptualSchemaReaderDataSource[];
    }

    export interface ConceptualSchemaReaderDataSource {
        id: number;

        /** Specifies the name used in Semantic Queries to reference this DataSource. */
        name: string;

        /** Specifies the type of IDataReaderPlugin. */
        type?: string;
    }

    export interface FederatedConceptualSchemaResponse {
        data: FederatedConceptualSchemaData;
    }

    export interface FederatedConceptualSchemaData {
        // This interface is intentionally empty, as plugins define their own data structure.
    }

    export interface SchemaReaderTransformResult {
        schema: FederatedConceptualSchema;
        error?: SchemaReaderError;
    }

    // Defect 5858607, consider removing serviceError and only have IClientError to be more consistent with IDataProxy.
    export interface SchemaReaderError {
        requestId?: string;
        serviceError?: ServiceError;
        clientError: IClientError;
    }

    export interface IDataReaderHostServices {
        promiseFactory(): IPromiseFactory;
    }
}