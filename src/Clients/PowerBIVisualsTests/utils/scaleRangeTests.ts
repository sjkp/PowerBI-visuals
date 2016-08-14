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
 
 module powerbitests {
     import DateRange = powerbi.visuals.DateRange;
     
     
    describe("DateRange.constructor", ()=> {
       it("Use default min/max if min/max hasn't been specified", ()=> {
           let min = new Date("10/12/2015");
           let max = new Date("10/12/2016");
           let dateRange = new DateRange(min, max);
           let value = dateRange.getValue();
           expect(value.min).toBe(min);
           expect(value.max).toBe(max);
       });
       
       it("Use min/max if it has been specified", ()=> {
           let min = new Date("10/12/2015");
           let start = new Date("10/15/2015");
           let end = new Date("11/12/2015");
           let max = new Date("10/12/2016");
           let dateRange = new DateRange(min, max, start, end);
           let value = dateRange.getValue();
           expect(value.min).toBe(start);
           expect(value.max).toBe(end);
       });
       
       it("Scaled value insider [0..100] boundaries", ()=> {
           let min = new Date("10/12/2015");
           let max = new Date("10/12/2016");
           let dateRange = new DateRange(min, max);
           let scaledValue = dateRange.getScaledValue();
           expect(scaledValue.min).toBe(0);
           expect(scaledValue.max).toBe(100);
       });
    });
    
    describe("DateRange.setValue", ()=> {
        it("Scaled value updated", ()=> {
            let min = new Date("10/12/2015");
            let max = new Date("10/22/2015");
            let dateRange = new DateRange(min, max);
            dateRange.setValue({ min: min, max: new Date("10/17/2015") });
            let scaledValue = dateRange.getScaledValue();
            expect(scaledValue.min).toBe(0);
            expect(scaledValue.max).toBe(50);    
        });
        
        it("Value updated", ()=> {
            let min = new Date("10/12/2015");
            let max = new Date("10/22/2015");
            let dateRange = new DateRange(min, max);
            dateRange.setValue({ min: min, max: new Date("10/17/2015") });
            let scaledValue = dateRange.getValue();
            expect(scaledValue.min.getTime()).toBe(min.getTime());
            expect(scaledValue.max.getTime()).toBe(new Date("10/17/2015").getTime());    
        });
    });
    
    
    describe("DateRange.setScaledValue", ()=> {
        it("Scaled value updated", ()=> {
            let min = new Date("10/12/2015");
            let max = new Date("10/22/2015");
            let dateRange = new DateRange(min, max);
            dateRange.setScaledValue({ min: 0, max: 50 });
            let value = dateRange.getScaledValue();
            expect(value.min).toBe(0);
            expect(value.max).toBe(50);    
        });
        
        it("Value updated", ()=> {
            let min = new Date("10/12/2015");
            let max = new Date("10/22/2015");
            let dateRange = new DateRange(min, max);
            dateRange.setScaledValue({ min: 0, max: 50});
            let scaledValue = dateRange.getValue();
            expect(scaledValue.min.getTime()).toBe(min.getTime());
            expect(scaledValue.max.getTime()).toBe(new Date("10/17/2015").getTime());    
        });
    });
 }