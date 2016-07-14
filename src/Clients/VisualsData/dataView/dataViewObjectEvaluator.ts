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
    /** Responsible for evaluating object property expressions to be applied at various scopes in a DataView. */
    export module DataViewObjectEvaluator {
        const colorValueType: ValueType = ValueType.fromDescriptor({ formatting: { color: true } });
        const numericType: ValueType = ValueType.fromDescriptor({ numeric: true });
        const textType: ValueType = ValueType.fromDescriptor({ text: true });

        export function run(
            evalContext: IEvalContext,
            objectDescriptor: DataViewObjectDescriptor,
            propertyDefinitions: DataViewObjectPropertyDefinitions): DataViewObject {
            debug.assertValue(evalContext, 'evalContext');
            debug.assertAnyValue(objectDescriptor, 'objectDescriptor');
            debug.assertValue(propertyDefinitions, 'propertyDefinitions');

            if (!objectDescriptor)
                return;

            let object: DataViewObject,
                propertyDescriptors = objectDescriptor.properties;
            for (let propertyName in propertyDefinitions) {
                let propertyDefinition = propertyDefinitions[propertyName],
                    propertyDescriptor = propertyDescriptors[propertyName];

                if (!propertyDescriptor)
                    continue;

                let propertyValue = evaluateProperty(evalContext, propertyDescriptor, propertyDefinition);
                if (propertyValue === undefined)
                    continue;

                if (!object)
                    object = {};
                object[propertyName] = propertyValue;
            }

            return object;
        }

        /** Note: Exported for testability */
        export function evaluateProperty(
            evalContext: IEvalContext,
            propertyDescriptor: DataViewObjectPropertyDescriptor,
            propertyDefinition: DataViewObjectPropertyDefinition): any {
            debug.assertValue(evalContext, 'evalContext');
            debug.assertValue(propertyDescriptor, 'propertyDescriptor');
            debug.assertValue(propertyDefinition, 'propertyDefinition');

            let structuralType = <StructuralTypeDescriptor>propertyDescriptor.type;
            if (structuralType && structuralType.expression)
                return propertyDefinition;

            let value = evaluateValue(evalContext, <any>propertyDefinition, ValueType.fromDescriptor(propertyDescriptor.type));
            if (value !== undefined || (propertyDefinition instanceof RuleEvaluation))
                return value;

            return evaluateFill(evalContext, <FillDefinition>propertyDefinition, structuralType)
                || evaluateFillRule(evalContext, <FillRuleDefinition>propertyDefinition, structuralType)
                || evaluateImage(evalContext, <ImageDefinition>propertyDefinition, structuralType)
                || evaluateParagraphs(evalContext, <ParagraphsDefinition>propertyDefinition, structuralType)
                || propertyDefinition;
        }

        function evaluateFill(evalContext: IEvalContext, fillDefn: FillDefinition, type: StructuralTypeDescriptor): Fill {
            let fillType = type.fill;
            if (!fillType)
                return;

            if (fillType && fillType.solid && fillType.solid.color && fillDefn.solid) {
                return {
                    solid: {
                        color: evaluateValue(evalContext, fillDefn.solid.color, ValueType.fromExtendedType(ExtendedType.Color)),
                    }
                };
            }
        }

        function evaluateFillRule(evalContext: IEvalContext, fillRuleDefn: FillRuleDefinition, type: StructuralTypeDescriptor): FillRule {
            if (!type.fillRule)
                return;

            if (fillRuleDefn.linearGradient2) {
                let linearGradient2 = fillRuleDefn.linearGradient2;
                return {
                    linearGradient2: {
                        min: evaluateColorStop(evalContext, linearGradient2.min),
                        max: evaluateColorStop(evalContext, linearGradient2.max),
                    }
                };
            }

            if (fillRuleDefn.linearGradient3) {
                let linearGradient3 = fillRuleDefn.linearGradient3;
                return {
                    linearGradient3: {
                        min: evaluateColorStop(evalContext, linearGradient3.min),
                        mid: evaluateColorStop(evalContext, linearGradient3.mid),
                        max: evaluateColorStop(evalContext, linearGradient3.max),
                    }
                };
            }
        }

        function evaluateColorStop(evalContext: IEvalContext, colorStop: RuleColorStopDefinition): RuleColorStop {
            debug.assertValue(evalContext, 'evalContext');
            debug.assertValue(colorStop, 'colorStop');

            let step: RuleColorStop = {
                color: evaluateValue(evalContext, colorStop.color, colorValueType),
            };

            let value = evaluateValue(evalContext, colorStop.value, numericType);
            if (value != null)
                step.value = value;

            return step;
        }

        function evaluateImage(evalContext: IEvalContext, definition: ImageDefinition, type: StructuralTypeDescriptor): ImageValue {
            debug.assertValue(evalContext, 'evalContext');
            debug.assertAnyValue(definition, 'definition');
            debug.assertValue(type, 'type');

            if (!type.image || !definition)
                return;

            let value: ImageValue = {
                name: evaluateValue(evalContext, definition.name, textType),
                url: evaluateValue(evalContext, definition.url, ValueType.fromDescriptor(ImageDefinition.urlType)),
            };

            if (definition.scaling)
                value.scaling = evaluateValue(evalContext, definition.scaling, textType);

            return value;
        }

        function evaluateParagraphs(evalContext: IEvalContext, definition: ParagraphsDefinition, type: StructuralTypeDescriptor): Paragraphs {
            debug.assertValue(evalContext, 'evalContext');
            debug.assertAnyValue(definition, 'definition');
            debug.assertValue(type, 'type');

            if (!type.paragraphs || !definition)
                return;

            return evaluateArrayCopyOnChange(evalContext, definition, evaluateParagraph);
        }

        function evaluateParagraph(evalContext: IEvalContext, definition: ParagraphDefinition): Paragraph {
            debug.assertValue(evalContext, 'evalContext');
            debug.assertValue(definition, 'definition');

            let evaluated: Paragraph;

            let definitionTextRuns = definition.textRuns;
            let evaluatedTextRuns: TextRun[] = evaluateArrayCopyOnChange(evalContext, definitionTextRuns, evaluateTextRun);
            if (definitionTextRuns !== evaluatedTextRuns) {
                evaluated = _.clone(<any>definition);
                evaluated.textRuns = evaluatedTextRuns;
            }

            return evaluated || <Paragraph>definition;
        }

        function evaluateTextRun(evalContext: IEvalContext, definition: TextRunDefinition): TextRun {
            debug.assertValue(evalContext, 'evalContext');
            debug.assertValue(definition, 'definition');

            let evaluated: TextRun;

            let definitionValue = definition.value;
            let evaluatedValue = evaluateValue(evalContext, <any> definitionValue, textType);
            if (evaluatedValue !== undefined) {
                evaluated = _.clone(<any>definition);
                evaluated.value = evaluatedValue;
            }

            return evaluated || <TextRun>definition;
        }

        /**
         * Evaluates an array, and lazily copies on write whenever the evaluator function returns something
         * other than the input to it.
         */
        function evaluateArrayCopyOnChange<TDefinition, TEvaluated>(
            evalContext: IEvalContext,
            definitions: TDefinition[],
            evaluator: (ctx: IEvalContext, defn: TDefinition) => TEvaluated): TEvaluated[] {
            debug.assertValue(evalContext, 'evalContext');
            debug.assertValue(definitions, 'definitions');
            debug.assertValue(evaluator, 'evaluator');

            let evaluatedValues: TEvaluated[];

            for (let i = 0, len = definitions.length; i < len; i++) {
                let definition = definitions[i];
                let evaluated: TEvaluated = evaluator(evalContext, definition);

                // NOTE: the any casts here are necessary due to the compiler not knowing the relationship
                // between TEvaluated & TDefinition
                if (!evaluatedValues && <any>definition !== evaluated) {
                    evaluatedValues = _.take(<TEvaluated[]><any>definitions, i);
                }

                if (evaluatedValues) {
                    evaluatedValues.push(evaluated);
                }
            }

            return evaluatedValues || <TEvaluated[]><any>definitions;
        }

        export function evaluateValue(evalContext: IEvalContext, definition: SQExpr | RuleEvaluation, valueType: ValueType): any {
            if (definition instanceof SQExpr)
                return ExpressionEvaluator.evaluate(definition, evalContext);

            if (definition instanceof RuleEvaluation)
                return definition.evaluate(evalContext);
        }

        /** Responsible for evaluating SQExprs into values. */
        class ExpressionEvaluator extends DefaultSQExprVisitorWithArg<PrimitiveValue, IEvalContext> {
            private static instance: ExpressionEvaluator = new ExpressionEvaluator();

            public static evaluate(expr: SQExpr, evalContext: IEvalContext): PrimitiveValue {
                if (expr == null)
                    return;

                return expr.accept(ExpressionEvaluator.instance, evalContext);
            }

            public visitColumnRef(expr: SQColumnRefExpr, evalContext: IEvalContext): PrimitiveValue {
                return evalContext.getExprValue(expr);
            }

            public visitConstant(expr: SQConstantExpr, evalContext: IEvalContext): PrimitiveValue {
                return expr.value;
            }

            public visitMeasureRef(expr: SQMeasureRefExpr, evalContext: IEvalContext): PrimitiveValue {
                return evalContext.getExprValue(expr);
            }

            public visitAggr(expr: SQAggregationExpr, evalContext: IEvalContext): PrimitiveValue {
                return evalContext.getExprValue(expr);
            }

            public visitFillRule(expr: SQFillRuleExpr, evalContext: IEvalContext): PrimitiveValue {
                let inputValue = expr.input.accept(this, evalContext);
                if (inputValue !== undefined) {
                    let colorAllocator = evalContext.getColorAllocator(expr);
                    if (colorAllocator) {
                        return colorAllocator.color(inputValue);
                    }
                }
            }

            public visitPercentile(expr: SQPercentileExpr, evalContext: IEvalContext): PrimitiveValue {
                return evalContext.getExprValue(expr);
            }

            public visitSelectRef(expr: SQSelectRefExpr, evalContext: IEvalContext): PrimitiveValue {
                return evalContext.getExprValue(expr);
            }
        }
    }
} 
