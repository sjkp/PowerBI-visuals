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
        sectionTitle: DisplayNameGetter;

        /** Title of PropertyPane slice for selecting the style */
        sliceTitle: DisplayNameGetter;

        /** Default style preset name for the Visual. Usually looked up with when searching by name fails.
         * Must be one of the presets */
        defaultPresetName: string;

        /** List of style presets for the IVisual indexed by preset name */
        presets: _.Dictionary<VisualStylePreset>;
    }

    /** Defines some rules to derive IVisual formatting elements from a Report Theme */
    export interface VisualStylePreset {

        /** Serialized name. Changing it would break saved reports */
        name: string;

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

    export module VisualStylePresetHelpers {
        /**
         * Get a visual style preset by name.
         * If stylePresets is undefined, returns undefined
         * If the name doesn't match one or name is undefined, the default preset should be returned, can be undefined
         * @param {string} name name of the Style Preset
         */
        export function getStylePreset(stylePresets: VisualStylePresets, name: string): VisualStylePreset {
            debug.assertValue(stylePresets, "getStylePreset called with undefined stylePresets");
            if (!stylePresets)
                return;

            if (_.isEmpty(name))
                name = stylePresets.defaultPresetName;

            let preset = stylePresets.presets[name];

            // If no preset matches name, return default one
            // This can happen when format painting between different visuals
            if (!preset)
                preset = stylePresets.presets[stylePresets.defaultPresetName];

            debug.assertValue(preset, "VisualStylePreset not found and no valid default exists");
            return preset;
        }

        export function getStylePresetsEnum(stylePresets: VisualStylePresets): IEnumType {
            let members: IEnumMember[] = [];

            if (stylePresets) {
                let presets = stylePresets.presets;
                if (presets) {
                    for (let name in presets) {
                        let stylePreset = presets[name];
                        members.push({ value: stylePreset.name, displayName: stylePreset.displayName });
                    }
                }
            }

            return createEnumType(members);
        }
    }
}