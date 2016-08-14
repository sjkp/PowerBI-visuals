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

module powerbitests {
    import DataViewRoleWildcard = powerbi.data.DataViewRoleWildcard;
    import VisualObjectRepetition = powerbi.VisualObjectRepetition;

    describe("VisualObjectRepetition - Equals", () => {
        it('A Equals B', () => {
            let a: VisualObjectRepetition = {
                selector: {
                    data: [DataViewRoleWildcard.fromRoles(['Values'])],
                    metadata: 'col'
                },
                objects: {
                    values: {
                        formattingProperties: ['backColor']
                    }
                }
            };

            let b: VisualObjectRepetition = {
                selector: {
                    data: [DataViewRoleWildcard.fromRoles(['Values'])],
                    metadata: 'col'
                },
                objects: {
                    values: {
                        formattingProperties: ['backColor']
                    }
                }
            };

            expect(VisualObjectRepetition.equals(a, b)).toBe(true);
        });

        it('A does not equal B - metadata selector', () => {
            let a: VisualObjectRepetition = {
                selector: {
                    data: [DataViewRoleWildcard.fromRoles(['Values'])],
                    metadata: 'col2'
                },
                objects: {
                    values: {
                        formattingProperties: ['backColor']
                    }
                }
            };

            let b: VisualObjectRepetition = {
                selector: {
                    data: [DataViewRoleWildcard.fromRoles(['Values'])],
                    metadata: 'col'
                },
                objects: {
                    values: {
                        formattingProperties: ['backColor']
                    }
                }
            };

            expect(VisualObjectRepetition.equals(a, b)).toBe(false);
        });

        it('A does not equal B - data selector', () => {
            let a: VisualObjectRepetition = {
                selector: {
                    data: [DataViewRoleWildcard.fromRoles(['Category'])],
                    metadata: 'col'
                },
                objects: {
                    values: {
                        formattingProperties: ['backColor']
                    }
                }
            };

            let b: VisualObjectRepetition = {
                selector: {
                    data: [DataViewRoleWildcard.fromRoles(['Values'])],
                    metadata: 'col'
                },
                objects: {
                    values: {
                        formattingProperties: ['backColor']
                    }
                }
            };

            expect(VisualObjectRepetition.equals(a, b)).toBe(false);
        });

        it('A does not equal B - objects different name', () => {
            let a: VisualObjectRepetition = {
                selector: {
                    data: [DataViewRoleWildcard.fromRoles(['Category'])],
                    metadata: 'col'
                },
                objects: {
                    values: {
                        formattingProperties: ['backColor']
                    }
                }
            };

            let b: VisualObjectRepetition = {
                selector: {
                    data: [DataViewRoleWildcard.fromRoles(['Values'])],
                    metadata: 'col'
                },
                objects: {
                    headers: {
                        formattingProperties: ['backColor']
                    }
                }
            };

            expect(VisualObjectRepetition.equals(a, b)).toBe(false);
        });

        it('A does not equal B - objects different - a has extra descriptors', () => {
            let a: VisualObjectRepetition = {
                selector: {
                    data: [DataViewRoleWildcard.fromRoles(['Category'])],
                    metadata: 'col'
                },
                objects: {
                    values: {
                        formattingProperties: ['backColor']
                    },
                    headers: {
                        formattingProperties: ['backColor']
                    }
                }
            };

            let b: VisualObjectRepetition = {
                selector: {
                    data: [DataViewRoleWildcard.fromRoles(['Values'])],
                    metadata: 'col'
                },
                objects: {
                    headers: {
                        formattingProperties: ['backColor']
                    }
                }
            };

            expect(VisualObjectRepetition.equals(a, b)).toBe(false);
        });

        it('A does not equal B - objects different - b has extra descriptors', () => {
            let a: VisualObjectRepetition = {
                selector: {
                    data: [DataViewRoleWildcard.fromRoles(['Category'])],
                    metadata: 'col'
                },
                objects: {
                    headers: {
                        formattingProperties: ['backColor']
                    }
                }
            };

            let b: VisualObjectRepetition = {
                selector: {
                    data: [DataViewRoleWildcard.fromRoles(['Values'])],
                    metadata: 'col'
                },
                objects: {
                    values: {
                        formattingProperties: ['backColor']
                    },
                    headers: {
                        formattingProperties: ['backColor']
                    }
                }
            };

            expect(VisualObjectRepetition.equals(a, b)).toBe(false);
        });

        it('A does not equal B - descriptors different', () => {
            let a: VisualObjectRepetition = {
                selector: {
                    data: [DataViewRoleWildcard.fromRoles(['Category'])],
                    metadata: 'col'
                },
                objects: {
                    headers: {
                        formattingProperties: ['backColor']
                    }
                }
            };

            let b: VisualObjectRepetition = {
                selector: {
                    data: [DataViewRoleWildcard.fromRoles(['Values'])],
                    metadata: 'col'
                },
                objects: {
                    headers: {
                    }
                }
            };

            expect(VisualObjectRepetition.equals(a, b)).toBe(false);
        });

        it('A does not equal B - descriptors different formattingProperties', () => {
            let a: VisualObjectRepetition = {
                selector: {
                    data: [DataViewRoleWildcard.fromRoles(['Category'])],
                    metadata: 'col'
                },
                objects: {
                    headers: {
                        formattingProperties: ['backColor']
                    }
                }
            };

            let b: VisualObjectRepetition = {
                selector: {
                    data: [DataViewRoleWildcard.fromRoles(['Values'])],
                    metadata: 'col'
                },
                objects: {
                    headers: {
                        formattingProperties: ['backColor', 'fontColor']
                    }
                }
            };

            expect(VisualObjectRepetition.equals(a, b)).toBe(false);
        });
    });
}
