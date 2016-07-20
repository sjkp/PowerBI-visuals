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
    import SQExpr = powerbi.data.SQExpr;

    export interface FillDefinition {
        solid?: {
            color?: SQExpr;
        };
        gradient?: {
            startColor?: SQExpr;
            endColor?: SQExpr;
        };
        pattern?: {
            patternKind?: SQExpr;
            color?: SQExpr;
        };
    }

    export module FillDefinitionHelpers {
        export function createSolidFillDefinition(color: string): FillDefinition {
            if (color)
                return { solid: { color: data.SQExprBuilder.text(color) } };
        }

        export function createSolidFillSQExpr(color: string): SQExpr | StructuralObjectDefinition {
            return createSolidFillDefinition(color) || data.SQExprBuilder.nullConstant();
        }
    }

    export module FillSolidColorTypeDescriptor {
        /** Gets a value indicating whether the descriptor is nullable or not. */
        export function nullable(descriptor: FillSolidColorTypeDescriptor): boolean {
            debug.assertValue(descriptor, 'descriptor');

            if (descriptor === true)
                return false;

            let advancedDescriptor = <FillSolidColorAdvancedTypeDescriptor>descriptor;
            return !!advancedDescriptor.nullable;
        }
    }
}