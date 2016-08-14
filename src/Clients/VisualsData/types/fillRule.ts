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

    export interface FillRuleTypeDescriptor {
    }

    export interface FillRuleDefinition extends FillRuleGeneric<SQExpr, SQExpr> {
    }

    export interface FillRule extends FillRuleGeneric<string, number> {
    }

    export type LinearGradient2 = LinearGradient2Generic<string, number>;
    export type LinearGradient3 = LinearGradient3Generic<string, number>;

    export type LinearGradient2Definition = LinearGradient2Generic<SQExpr, SQExpr>;
    export type LinearGradient3Definition = LinearGradient3Generic<SQExpr, SQExpr>;

    export type RuleColorStopDefinition = RuleColorStopGeneric<SQExpr, SQExpr>;
    export type RuleColorStop = RuleColorStopGeneric<string, number>;

    export interface IFillRuleDefinitionVisitor<T2, T3> {
        visitLinearGradient2(linearGradient2: LinearGradient2Definition, arg?: any): T2;
        visitLinearGradient3(linearGradient3: LinearGradient3Definition, arg?: any): T3;
    }
}