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

/// <reference path="../../_references.ts"/>

module powerbi.visuals.controls {
    export enum TablixType {
        Matrix,
        Table
    }

    /**
     * General section of Formatting Properties for Tablix
    */
    export interface TablixFormattingPropertiesGeneral {
        /** Property that drives whether columns should use automatically calculated (based on content) sizes for width or use persisted sizes.
        Default is true i.e. automatically calculate width based on column content */
        autoSizeColumnWidth: boolean;
        /**
         * Font size for the whole tablix
         * Default is 8
        */
        textSize: number;
    }

    /**
     * General section of Formatting Properties for Table
    */
    export interface TablixFormattingPropertiesGeneralTable extends TablixFormattingPropertiesGeneral {
        /*
        * Show/Hide Grand Total
        * Default is True
        */
        totals?: boolean;
    }

    /**
     * General section of Formatting Properties for Matrix
    */
    export interface TablixFormattingPropertiesGeneralMatrix extends TablixFormattingPropertiesGeneral {
        /**
        * Show/Hide Subtotal Rows
        */
        rowSubtotals?: boolean;
        /**
        * Show/Hide Subtotal Columns
        */
        columnSubtotals?: boolean;
    }

    /**
    * Grid section of Formatting Properties for Tablix
    */
    export interface TablixFormattingPropertiesGrid {
        /**
        * Show/Hide vertical gridlines
       */
        gridVertical?: boolean;

        /**
         * vertical gridlines color
        */
        gridVerticalColor?: string;

        /**
         * vertical gridlines Weight
        */
        gridVerticalWeight?: number;

        /**
         * Show/Hide horizontal gridlines
        */
        gridHorizontal?: boolean;

        /**
         * horizontal gridlines color
        */
        gridHorizontalColor?: string;

        /**
         * horizontal gridlines Weight
        */
        gridHorizontalWeight?: number;

        /**
         * Color of the outline. Shared across all regions
        */
        outlineColor?: string;

        /**
         * Weight outline. Shared across all regions
        */
        outlineWeight?: number;

        /**
         * Weight outline. Shared across all regions
        */
        rowPadding?: number;

        /**
         * Maximum height of images in pixels
        */
        imageHeight?: number;
    }

    /**
     * Common Formatting Properties for Tablix regions (Column Headers, Row Headers, Total, SubTotals)
    */
    export interface TablixFormattingPropertiesRegion {
        /*
        * Font color of all cells within the region
        * Default is <Undefined>
        */
        fontColor?: string;
        /*
        * Background color of all cells within the region
        * Default is <Undefined>
        */
        backColor?: string;
        /*
        * Outline style for the whole region. One of the values from powerbi.visuals.outline
        * Default is outline.none
        */
        outline: string;
    }

    export interface TablixFormattingPropertiesValues {
        /*
        * Font color of all cells for Odd Index rows
        * Default is <Undefined>
        */
        fontColorPrimary?: string;
        /*
        * Background color of all cells for Odd Index rows
        * Default is <Undefined>
        */
        backColorPrimary?: string;
        /*
        * Font color of all cells for even Index rows
        * Default is <Undefined>
        */
        fontColorSecondary?: string;
        /*
        * Background color of all cells for even Index rows
        * Default is <Undefined>
        */
        backColorSecondary?: string;
        /*
        * Outline style for the whole region. One of the values from powerbi.visuals.outline
        * Default is outline.none
        */
        outline: string;
    }

    /**
     * Formatting Properties for Table Values region
    */
    export interface TablixFormattingPropertiesValuesTable extends TablixFormattingPropertiesValues {
        /*
        * Use an icon instead of URL text
        * Default is False
        */
        urlIcon?: boolean;
    }

    /**
     * Formatting Properties for Table Visual
    */
    export interface TablixFormattingPropertiesTable {
        general?: TablixFormattingPropertiesGeneralTable;
        grid?: TablixFormattingPropertiesGrid;
        columnHeaders?: TablixFormattingPropertiesRegion;
        values?: TablixFormattingPropertiesValuesTable;
        total?: TablixFormattingPropertiesRegion;
    }

    /**
     * Formatting Properties for Matrix Visual
    */
    export interface TablixFormattingPropertiesMatrix {
        general?: TablixFormattingPropertiesGeneralMatrix;
        grid?: TablixFormattingPropertiesGrid;
        columnHeaders?: TablixFormattingPropertiesRegion;
        rowHeaders?: TablixFormattingPropertiesRegion;
        values?: TablixFormattingPropertiesValues;
        subtotals?: TablixFormattingPropertiesRegion;
    }
}