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

module powerbitests.customVisuals.helpers {
    const EnglishAlphabetLowerCase = "abcdefghijklmnopqrstuwxyz";
    const EnglishAlphabetUpperCase = "ABCDEFGHIJKLMNOPQRSTUWXYZ";

    export function getTableDataValues(categoryValues: any[], columns: any[]): any[] {
        return categoryValues.map((category, idx) => {
            var categoryDataValues = columns.map(x => <any>x.values[idx]);
            categoryDataValues.unshift(category);
            return categoryDataValues;
        });
    }

    export function getDateYearRange(start: Date, stop: Date, yearStep: number): Date[] {
        return _.range(start.getFullYear(), stop.getFullYear(), yearStep)
            .map(x => new Date(new Date(start.getTime()).setFullYear(x)));
    }

    export function getDateRange(start: Date, stop: Date, step: number): Date[] {
        return _.range(start.getTime(), stop.getTime(), step).map(x => new Date(x));
    }

    export function getRandomNumbers(count: number, min: number = 0, max: number = 1): number[] {
        return _.range(count).map(x => getRandomNumber(min, max));
    }

    export function getRandomUniqueNumbers(count: number, min: number = 0, max: number = 1): number[] {
        let result: number[] = [];
        for(let i = 0; i< count; i++) {
            result.push(getRandomNumber(min, max, result));
        }

        return result;
    }

    export function getRandomNumber(
        min: number,
        max: number,
        exceptionList?: number[],
        changeResult: (number) => number = x => x): number {
        let result = changeResult(Math.random() * (max - min) + min);
        if(exceptionList && exceptionList.length && _.contains(exceptionList, result)) {
            return getRandomNumber(min, max, exceptionList);
        }

        return result;
    }

    export function getRandomIntegers(count: number, min: number = 0, max: number = 1): number[] {
        return getRandomNumbers(count, min, max).map(Math.round);
    }

    export function getRandomUniqueIntegers(count: number, min: number = 0, max: number = 1): number[] {
        let result: number[] = [];
        for(let i = 0; i< count; i++) {
            result.push(getRandomNumber(min, max, result, Math.round));
        }

        return result;
    }

    export function getRandomInteger(min: number, max: number, exceptionList?: number[]): number {
        return getRandomNumber(max, min, exceptionList, Math.floor);
    }

    export function getRandomDates(count: number, start: Date, end: Date): Date[] {
        return getRandomNumbers(count, start.getTime(), end.getTime()).map(x => new Date(x));
    }

    export function getRandomUniqueDates(count: number, start: Date, end: Date): Date[] {
        return getRandomUniqueNumbers(count, start.getTime(), end.getTime()).map(x => new Date(x));
    }

    export function getRandomUniqueSortedDates(count: number, start: Date, end: Date): Date[] {
        return getRandomUniqueDates(count, start, end).sort((a,b) => a.getTime() - b.getTime());
    }

    export function getRandomDate(start: Date, end: Date, exceptionList?: Date[]): Date {
        return new Date(getRandomNumber(start.getTime(), end.getTime(), exceptionList.map(x => x.getTime())));
    }

    export function getRandomWord(
        minLength: number,
        maxLength: number,
        alphabet: string|string[] = EnglishAlphabetLowerCase + EnglishAlphabetUpperCase): string {
        let alphabetLength = alphabet.length;
        let length = getRandomInteger(minLength, maxLength);
        let strings = <string[]>_.range(length).map(x => alphabet[getRandomInteger(0, alphabetLength)]);
        return strings.join('');
    }

    export function getRandomWords(
        wordCount: number,
        minLength: number,
        maxLength: number,
        alphabet: string|string[] = EnglishAlphabetLowerCase + EnglishAlphabetUpperCase): string[] {
        return _.range(wordCount).map(x => getRandomWord(minLength, maxLength, alphabet));
    }

    export function getRandomText(
        wordCount: number,
        minLength: number,
        maxLength: number,
        alphabet: string|string[] = EnglishAlphabetLowerCase + EnglishAlphabetUpperCase): string {
        return getRandomWords(wordCount, minLength, maxLength, alphabet).join(' ');
    }

    export function getRandomBoolean(trueProbability: number = 0): boolean {
        return (Math.random() - trueProbability/2) < 0.5;
    }

    export function getRandomBooleans(count: number, trueProbability: number = 0): boolean[] {
        return _.range(count).map(x => getRandomBoolean(trueProbability));
    }
}