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

declare module powerbi.data {
    export interface DataViewObjectDescriptors {
        /** Defines general properties for a visualization. */
        general?: DataViewObjectDescriptor;

        [objectName: string]: DataViewObjectDescriptor;
    }

    /** Defines a logical object in a visualization. */
    export interface DataViewObjectDescriptor {
        displayName?: DisplayNameGetter;
        description?: DisplayNameGetter;
        properties: DataViewObjectPropertyDescriptors;
    }

    export interface DataViewObjectPropertyDescriptors {
        [propertyName: string]: DataViewObjectPropertyDescriptor;
    }

    /** Defines a property of a DataViewObjectDefinition. */
    export interface DataViewObjectPropertyDescriptor {
        displayName?: DisplayNameGetter;
        description?: DisplayNameGetter;
        placeHolderText?: DisplayNameGetter;
        type: DataViewObjectPropertyTypeDescriptor;
        rule?: DataViewObjectPropertyRuleDescriptor;        

        /** Indicates whether the Format Painter should ignore this property. */
        suppressFormatPainterCopy?: boolean;   
    }

    export type DataViewObjectPropertyTypeDescriptor = ValueTypeDescriptor | StructuralTypeDescriptor;

    export interface DataViewObjectPropertyRuleDescriptor {
        /** For rule typed properties, defines the input visual role name. */
        inputRole?: string;

        /** Defines the output for rule-typed properties. */
        output?: DataViewObjectPropertyRuleOutputDescriptor;
    }

    export interface DataViewObjectPropertyRuleOutputDescriptor {
        /** Name of the target property for rule output. */
        property: string;

        /** Names roles that define the selector for the output properties. */
        selector: string[];
    }
    
}