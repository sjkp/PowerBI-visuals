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
    import Selector = powerbi.data.Selector;
    
    export interface VisualObjectInstance {
        /** The name of the object (as defined in VisualCapabilities). */
        objectName: string;

        /** A display name for the object instance. */
        displayName?: string;

        /** The set of property values for this object.  Some of these properties may be defaults provided by the IVisual. */
        properties: {
            [propertyName: string]: DataViewPropertyValue;
        };

        /** The selector that identifies this object. */
        selector: Selector;

        /** Defines the constrained set of valid values for a property. */
        validValues?: {
            [propertyName: string]: string[];
        };

        /** (Optional) VisualObjectInstanceEnumeration category index. */
        containerIdx?: number;
    }

    export type VisualObjectInstanceEnumeration = VisualObjectInstance[] | VisualObjectInstanceEnumerationObject;

    export interface VisualObjectInstanceEnumerationObject {
        /** The visual object instances. */
        instances: VisualObjectInstance[];

        /** Defines a set of containers for related object instances. */
        containers?: VisualObjectInstanceContainer[];
    }

    export interface VisualObjectInstanceContainer {
        displayName: data.DisplayNameGetter;
    }

    export interface VisualObjectInstancesToPersist {
        /** Instances which should be merged with existing instances. */
        merge?: VisualObjectInstance[];

        /** Instances which should replace existing instances. */
        replace?: VisualObjectInstance[];

        /** Instances which should be deleted from the existing instances. */
        remove?: VisualObjectInstance[];

        /** Instances which should be deleted from the existing objects. */
        removeObject?: VisualObjectInstance[];
    }
    
    export interface EnumerateVisualObjectInstancesOptions {
        objectName: string;
    }
}
