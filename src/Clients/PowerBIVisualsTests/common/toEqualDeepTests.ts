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
    import inherit = powerbi.Prototype.inherit;

    describe('toEqualDeep', () => {
        it('null === null', () => {
            expect(null).toEqualDeep(null);
        });

        it('null !== undefined', () => {
            expect(null).not.toEqualDeep(undefined);
        });

        it('null !== 0', () => {
            expect(null).not.toEqualDeep(0);
        });

        it('"0" !== 0', () => {
            expect("0").not.toEqualDeep(0);
        });

        it('{} === {}', () => {
            expect({}).toEqualDeep({});
        });

        it('{ a: true } === { a: true }', () => {
            expect({ a: true }).toEqualDeep({ a: true });
        });

        it('{ a: true, b: 0 } === { b: 0, a: true }', () => {
            expect({ a: true, b: 0 }).toEqualDeep({ b: 0, a: true });
        });

        it('{ a: true, b: 1 } !== { b: 0, a: true }', () => {
            expect({ a: true, b: 1 }).not.toEqualDeep({ b: 0, a: true });
        });

        it('[0, "a", true] === [0, "a", true]', () => {
            expect([0, "a", true]).toEqualDeep([0, "a", true]);
        });

        it('prototyped === [0, "a", true]', () => {
            expect(inherit([0, 'b', false], v => {
                v[1] = 'a';
                v[2] = true;
            })).toEqualDeep([0, "a", true]);
        });

        it('prototyped !== [0, "b", true]', () => {
            expect(inherit([0, 'b', true], v => {
                v[1] = 'a';
            })).not.toEqualDeep([0, "b", true]);
        });

        it('{ a: {}, b: { c: [0, null] } } === { a: {}, b: { c: [0, null] } }', () => {
            expect({ a: {}, b: { c: [0, null] } }).toEqualDeep({ a: {}, b: { c: [0, null] } });
        });

        it('prototyped === { a: {}, b: { c: [0, null] } }', () => {
            expect(inherit({ a: null, b: { c: [] } }, v => {
                v.a = {};
                v.b = inherit(v.b, b => b.c = [0, null]);
            })).toEqualDeep({ a: {}, b: { c: [0, null] } });
        });

        it('prototyped !== { a: {}, b: { c: [0, null] } }', () => {
            expect(inherit({ a: null, b: { c: [] } }, v => {
                v.a = {};
                v.b = inherit(v.b, b => b.c = [0, null]);
            })).not.toEqualDeep({ a: null, b: { c: [] } });
        });

        it('classA(1) === classA(1)', () => {
            let classA = class {
                constructor(public a: number) { }

                public func(): number {
                    return this.a;
                }
            };

            expect(new classA(1)).toEqualDeep(new classA(1));
            expect(new classA(1)).not.toEqualDeep(new classA(2));
        });

        it('{ function } === { function }', () => {
            expect({ fn: () => 1 }).toEqualDeep({ fn: () => 2 });
        });

        it('obj inheriting properties', () => {
            let prototype = { name: 'PowerBI', vendor: 'Microsoft' };
            let inherited = inherit(prototype);
            inherited['version'] = 2;

            expect(inherited).not.toEqualDeep({ version: 2 });
            expect(inherited).not.toEqualDeep({ name: 'PowerBI', version: 2 });
            expect(inherited).toEqualDeep({ name: 'PowerBI', vendor: 'Microsoft', version: 2 });
        });

        it('property containing undefined === undefined property', () => {
            let otherObj = { name: 'PowerBI' }; // does not contain any property named 'vendor'
            let prototype = { name: 'PowerBI', vendor: 'Microsoft' };
            let inherited = inherit(prototype);

            // 'delete inherited.vendor' would not remove the property in the prototype,
            // hence setting it to undefined is the only way to delete the value of that property in inherited.
            inherited.vendor = undefined; 

            // assert that otherObj and inherited are equivalent, because 'vendor' property is undefined
            expect(inherited).toEqualDeep(otherObj);
            expect(otherObj).toEqualDeep(inherited);
            // assert that property containing undefined is not equal to property containing a string
            expect(inherited).not.toEqualDeep(prototype);
            expect(prototype).not.toEqualDeep(inherited);
        });

        it('jasmine.any(ClassA) === ClassA(abc,123) ', () => {
            class ClassA {
                constructor(public propertyA: string, public propertyB: number) { }

                public func(): string {
                    return this.propertyA + this.propertyB;
                }
            }

            class ClassB {
                constructor(public propertyA: string, public propertyB: number) { }

                public func2(): string {
                    return this.propertyA + this.propertyB;
                }
            }

            class ClassC {
                constructor(public propertyA: string) { }

                public func(): string {
                    return this.propertyA;
                }
            }

            // All these asserts are based on the behavior you'd get from using jasmine.Matchers.toEqual(...)
            expect(new ClassA('abc', 123)).toEqualDeep(jasmine.any(ClassA));
            expect(jasmine.any(ClassA)).toEqualDeep(new ClassA('abc', 123));
            expect(new ClassA('abc', 123)).not.toEqualDeep(jasmine.any(ClassB));
            expect(jasmine.any(ClassB)).not.toEqualDeep(new ClassA('abc', 123));
            expect(new ClassA('abc', 123)).not.toEqualDeep(jasmine.any(ClassC));
            expect(jasmine.any(ClassC)).not.toEqualDeep(new ClassA('abc', 123));
        });

        it('jasmine.any(ParentClass) === ChildClass() ', () => {
            class Animal {
                constructor(public age: number) { }

                public func(): number {
                    return this.age;
                }
            }

            class Monkey extends Animal {
                constructor(public age: number) { super(age); }

                public writeCode(): void {
                }
            }

            // All these asserts are based on the behavior you'd get from using jasmine.Matchers.toEqual(...)
            expect(new Monkey(10)).toEqualDeep(jasmine.any(Animal));
            expect(jasmine.any(Animal)).toEqualDeep(new Monkey(20));
        });

        it('jasmine.any(ChildClass) !== ParentClass() ', () => {
            class Animal {
                constructor(public age: number) { }

                public func(): number {
                    return this.age;
                }
            }

            class Monkey extends Animal {
                constructor(public age: number) { super(age); }

                public writeCode(): void {
                }
            }

            // All these asserts are based on the behavior you'd get from using jasmine.Matchers.toEqual(...)
            expect(new Animal(10)).not.toEqualDeep(jasmine.any(Monkey));
            expect(jasmine.any(Monkey)).not.toEqualDeep(new Animal(20));
        });

        it('jasmine.any(ClassA) !== ClassBWithSameProperties() ', () => {
            class Animal {
                constructor(public age: number) { }

                public func(): number {
                    return this.age;
                }
            }

            class Machine {
                constructor(public age: number) { }

                public func(): number {
                    return this.age;
                }
            }

            // All these asserts are based on the behavior you'd get from using jasmine.Matchers.toEqual(...)
            expect(new Animal(10)).not.toEqualDeep(jasmine.any(Machine));
            expect(jasmine.any(Machine)).not.toEqualDeep(new Animal(20));
        });
    });
}