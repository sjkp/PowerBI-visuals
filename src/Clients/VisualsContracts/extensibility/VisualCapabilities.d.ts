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

declare module powerbi.extensibility {
    import DataViewObjectDescriptors = powerbi.data.DataViewObjectDescriptors;

    /** Defines the capabilities of an IVisual. */
    export interface VisualCapabilities {
        /** Defines what roles the visual expects, and how those roles should be populated.  This is useful for visual generation/editing. */
        dataRoles?: VisualDataRole[];

        /** Defines the set of objects supported by this IVisual. */
        objects?: DataViewObjectDescriptors;

        /** Defines how roles that the visual understands map to the DataView.  This is useful for query generation. */
        dataViewMappings?: DataViewMapping[];

        /** Indicates whether cross-highlight is supported by the visual. This is useful for query generation. */
        supportsHighlight?: boolean;
        
        /** Indicates whether sorting is supported by the visual. This is useful for query generation */
        sorting?: VisualSortingCapabilities;        
    }
}