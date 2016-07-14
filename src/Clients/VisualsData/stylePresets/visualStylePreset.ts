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
    import DataViewObjectDefinitions = data.DataViewObjectDefinitions;
    import DisplayNameGetter = data.DisplayNameGetter;

    /** Defines a list of style presets for a particular IVisual */
    export interface VisualStylePresets {
        /** Title of PropertyPane section for selecting the style */
        displayName: DisplayNameGetter;

        /** List of style presets for the IVisual indexed by preset name */
        presets: VisualStylePresetCollection;
    }

    export interface VisualStylePresetCollection { 
        [stylePresetName: string]: VisualStylePreset;
    }

    /** Defines some rules to derive IVisual formatting elements from a Report Theme */
    export interface VisualStylePreset {
        /** Display name for the style preset */
        displayName: DisplayNameGetter;

        /** Discription text for the style preset, can be used for a tooltip */
        description?: DisplayNameGetter;

        /**
         * Evaluate the style preset against a report theme and produce DataViewObjectDefinitions for affected objects
         * @param IVisualStyle Report theme
         */
        evaluate: (theme: IVisualStyle) => DataViewObjectDefinitions;
    }
}