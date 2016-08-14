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

module powerbi.visuals {
    /**
     * This is the baseline for some most common used object properties across visuals.
     * When adding new properties, please try to reuse the existing ones.
     */
    export const StandardObjectProperties = {
        axisEnd: {
            displayName: data.createDisplayNameGetter('Visual_Axis_End'),
            description: data.createDisplayNameGetter('Visual_Axis_EndDescription'),
            placeHolderText: data.createDisplayNameGetter('Visual_Precision_Auto'),
            type: { numeric: true },
            suppressFormatPainterCopy: true,
        },
        axisScale: {
            displayName: data.createDisplayNameGetter('Visual_Axis_Scale'),
            type: { enumeration: axisScale.type }
        },
        axisStart: {
            displayName: data.createDisplayNameGetter('Visual_Axis_Start'),
            description: data.createDisplayNameGetter('Visual_Axis_StartDescription'),
            placeHolderText: data.createDisplayNameGetter('Visual_Precision_Auto'),
            type: { numeric: true },
            suppressFormatPainterCopy: true,
        },
        axisStyle: {
            displayName: data.createDisplayNameGetter('Visual_Axis_Style'),
            type: { enumeration: axisStyle.type }
        },
        axisType: {
            displayName: data.createDisplayNameGetter('Visual_Axis_Type'),
            type: { enumeration: axisType.type },
        },
        backColor: {
            displayName: data.createDisplayNameGetter('Visual_Tablix_BackColor'),
            description: data.createDisplayNameGetter('Visual_Tablix_BackColor_Desc'),
            type: { fill: { solid: { color: true } } }
        },
        dataColor: {
            displayName: data.createDisplayNameGetter('Visual_LabelsFill'),
            description: data.createDisplayNameGetter('Visual_LabelsFillDescription'),
            type: { fill: { solid: { color: true } } }
        },
        dataLabelColor: {
            displayName: data.createDisplayNameGetter("Visual_Reference_Line_Data_Label_Color"),
            description: data.createDisplayNameGetter('Visual_Reference_Line_Data_Label_Color_Description'),
            type: { fill: { solid: { color: true } } }
        },
        dataLabelDecimalPoints: {
            displayName: data.createDisplayNameGetter("Visual_Reference_Line_Data_Decimal_Points"),
            placeHolderText: data.createDisplayNameGetter('Visual_Precision_Auto'),
            type: { numeric: true }
        },
        dataLabelDisplayUnits: {
            displayName: data.createDisplayNameGetter('Visual_DisplayUnits'),
            description: data.createDisplayNameGetter('Visual_DisplayUnitsDescription'),
            type: { formatting: { labelDisplayUnits: true } },
            suppressFormatPainterCopy: true,
        },
        dataLabelHorizontalPosition: {
            displayName: data.createDisplayNameGetter("Visual_Reference_Line_Data_Horizontal_Position"),
            description: data.createDisplayNameGetter('Visual_Reference_Line_Data_Label_Horizontal_Position_Description'),
            type: { enumeration: referenceLineDataLabelHorizontalPosition.type }
        },
        dataLabelShow: {
            displayName: data.createDisplayNameGetter("Visual_Reference_Line_Data_Label"),
            description: data.createDisplayNameGetter('Visual_Reference_Line_Data_Label_Show_Description'),
            type: { bool: true }
        },
        dataLabelVerticalPosition: {
            displayName: data.createDisplayNameGetter("Visual_Reference_Line_Data_Vertical_Position"),
            description: data.createDisplayNameGetter('Visual_Reference_Line_Data_Label_Vertical_Position_Description'),
            type: { enumeration: referenceLineDataLabelVerticalPosition.type }
        },
        defaultColor: {
            displayName: data.createDisplayNameGetter('Visual_DefaultColor'),
            type: { fill: { solid: { color: true } } }
        },
        fill: {
            displayName: data.createDisplayNameGetter('Visual_Fill'),
            type: { fill: { solid: { color: true } } }
        },
        fontColor: {
            displayName: data.createDisplayNameGetter('Visual_FontColor'),
            description: data.createDisplayNameGetter('Visual_Tablix_FontColor_Desc'),
            type: { fill: { solid: { color: true } } }
        },
        fontSize: {
            displayName: data.createDisplayNameGetter('Visual_TextSize'),
            type: { formatting: { fontSize: true } }
        },
        formatString: {
            type: { formatting: { formatString: true } },
        },
        image: {
            type: { image: {} },
        },
        labelColor: {
            displayName: data.createDisplayNameGetter('Visual_LegendTitleColor'),
            type: { fill: { solid: { color: true } } }
        },
        labelDisplayUnits: {
            displayName: data.createDisplayNameGetter('Visual_DisplayUnits'),
            description: data.createDisplayNameGetter('Visual_DisplayUnitsDescription'),
            type: { formatting: { labelDisplayUnits: true } }
        },
        labelPrecision: {
            displayName: data.createDisplayNameGetter('Visual_Precision'),
            description: data.createDisplayNameGetter('Visual_PrecisionDescription'),
            placeHolderText: data.createDisplayNameGetter('Visual_Precision_Auto'),
            type: { numeric: true }
        },
        legendPosition: {
            displayName: data.createDisplayNameGetter('Visual_LegendPosition'),
            description: data.createDisplayNameGetter('Visual_LegendPositionDescription'),
            type: { enumeration: legendPosition.type },
        },
        legendTitle: {
            displayName: data.createDisplayNameGetter('Visual_LegendName'),
            description: data.createDisplayNameGetter('Visual_LegendNameDescription'),
            type: { text: true },
        },
        lineColor: {
            displayName: data.createDisplayNameGetter('Visual_Reference_Line_Color'),
            description: data.createDisplayNameGetter('Visual_Reference_Line_Color_Description'),
            type: { fill: { solid: { color: true } } }
        },
        outline: {
            displayName: data.createDisplayNameGetter('Visual_Outline'),
            type: { enumeration: outline.type }
        },
        outlineColor: {
            displayName: data.createDisplayNameGetter('Visual_OutlineColor'),
            description: data.createDisplayNameGetter('Visual_OutlineColor_Desc'),
            type: { fill: { solid: { color: true } } }
        },
        outlineWeight: {
            displayName: data.createDisplayNameGetter('Visual_OutlineWeight'),
            description: data.createDisplayNameGetter('Visual_OutlineWeight_Desc'),
            type: { numeric: true }
        },
        show: {
            displayName: data.createDisplayNameGetter('Visual_Show'),
            type: { bool: true }
        },
        showAllDataPoints: {
            displayName: data.createDisplayNameGetter('Visual_DataPoint_Show_All'),
            type: { bool: true }
        },
        showLegendTitle: {
            displayName: data.createDisplayNameGetter('Visual_LegendShowTitle'),
            description: data.createDisplayNameGetter('Visual_LegendShowTitleDescription'),
            type: { bool: true }
        },
        referenceLinePosition: {
            displayName: data.createDisplayNameGetter('Visual_Reference_Line_Arrange'),
            description: data.createDisplayNameGetter('Visual_Reference_Line_Arrange_Description'),
            type: { enumeration: referenceLinePosition.type }
        },
        referenceLineStyle: {
            displayName: data.createDisplayNameGetter('Visual_Reference_Line_Style'),
            description: data.createDisplayNameGetter('Visual_Reference_Line_Style_Description'),
            type: { enumeration: lineStyle.type }
        },
        transparency: {
            displayName: data.createDisplayNameGetter('Visual_Background_Transparency'),
            description: data.createDisplayNameGetter('Visual_Background_TransparencyDescription'),
            type: { numeric: true }
        },
        yAxisPosition: {
            displayName: data.createDisplayNameGetter('Visual_YAxis_Position'),
            description: data.createDisplayNameGetter('Visual_YAxis_PositionDescription'),
            type: { enumeration: yAxisPosition.type },
        },
    };
}