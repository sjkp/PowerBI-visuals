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
    //#region imports
    import CompiledDataViewMapping = powerbi.data.CompiledDataViewMapping;
    import CompiledDataViewRoleForMapping = powerbi.data.CompiledDataViewRoleForMapping;
    import CompiledSubtotalType = powerbi.data.CompiledSubtotalType;
    import DataView = powerbi.DataView;
    import DataViewTable = powerbi.DataViewTable;
    import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
    import DataViewObjects = powerbi.DataViewObjects;
    import DataViewRoleWildcard = powerbi.data.DataViewRoleWildcard;
    import TableBinder = powerbi.visuals.TableBinder;
    import Table = powerbi.visuals.Table;
    import tableCapabilities = powerbi.visuals.tableCapabilities;
    import TableHierarchyNavigator = powerbi.visuals.TableHierarchyNavigator;
    import valueFormatter = powerbi.visuals.valueFormatter;
    import ValueType = powerbi.ValueType;
    import PrimitiveType = powerbi.PrimitiveType;
    import PrimitiveValue = powerbi.PrimitiveValue;
    import SortDirection = powerbi.SortDirection;
    import Controls = powerbi.visuals.controls;
    import TablixObjects = Controls.internal.TablixObjects;
    import TablixControl = Controls.TablixControl;
    import TablixUtils = Controls.internal.TablixUtils;
    //#endregion

    powerbitests.mocks.setLocale();

    //#region Constants
    const SelectorContainer = '.tablixCanvas';
    const SelectorHeaderCell = '.tablixColumnHeaderLeaf';
    const SelectorBodyCell = '.tableBodyCell';
    const SelectorBodyCellLast = '.tableBodyCellBottom';
    const SelectorFooterCell = '.tableFooterCell';
    //#endregion

    //#region Test Data
    //#region columnMetadata
    const ColumnHeaderClassNameIconHidden = "tablixDiv tablixCellContentHost tablixHeader tablixColumnHeaderLeaf";
    const RowClassName = "tablixDiv tablixCellContentHost tableBodyCell";
    const LastRowClassName = "tablixDiv tablixCellContentHost tableBodyCellBottom";
    const FooterClassName = "tablixDiv tablixCellContentHost tablixValueTotal tableFooterCell";
    const CssClassTablixValueNumeric = " tablixValueNumeric";
    const EmptyHeaderCell = "\xa0";
    //const NullCell = "(Blank)";

    const dataTypeNumber = ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Double);
    const dataTypeString = ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text);
    const dataTypeWebUrl = ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text, "WebUrl");
    const dataTypeKpiStatus = ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Integer);
    const dataTypeImageUrl = ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Text, "ImageUrl");

    const groupSource1: DataViewMetadataColumn = { displayName: "group1", queryName: "group1", type: dataTypeString, index: 0 };
    const groupSource2: DataViewMetadataColumn = { displayName: "group2", queryName: "group2", type: dataTypeString, index: 1 };
    const groupSource3: DataViewMetadataColumn = { displayName: "group3", queryName: "group3", type: dataTypeString, index: 2 };
    const groupSourceLeadingSpeaces: DataViewMetadataColumn = { displayName: "    group1", queryName: "group1", type: dataTypeString, index: 0 };
    const groupSourceWebUrl: DataViewMetadataColumn = { displayName: "groupWebUrl", queryName: "groupWebUrl", type: dataTypeWebUrl, index: 0 };
    const groupSourceImageUrl: DataViewMetadataColumn = { displayName: "groupImageUrl", queryName: "groupImageUrl", type: dataTypeImageUrl, index: 0 };
    const groupSourceKpiStatus: DataViewMetadataColumn = {
        displayName: "Average of Grade",
        queryName: "Table1._Average of Grade Status",
        type: dataTypeKpiStatus,
        roles: { Values: true },
        format: "g",
        kpi: {
            graphic: "Traffic Light - Single"
        },
        objects: {
            general: {
                formatString: "g",
            },
        },
    };

    let measureSource1: DataViewMetadataColumn = { displayName: "measure1", queryName: "measure1", type: dataTypeNumber, isMeasure: true, index: 3, objects: { general: { formatString: "#.0" } } };
    let measureSource2: DataViewMetadataColumn = { displayName: "measure2", queryName: "measure2", type: dataTypeNumber, isMeasure: true, index: 4, objects: { general: { formatString: "#.00" } } };
    let measureSource3: DataViewMetadataColumn = { displayName: "measure3", queryName: "measure3", type: dataTypeNumber, isMeasure: true, index: 5, objects: { general: { formatString: "#" } } };

    let measureSourceAscending: DataViewMetadataColumn = { displayName: "measure1", queryName: "measure1", type: dataTypeNumber, isMeasure: true, index: 3, objects: { general: { formatString: "#.0" } }, sort: SortDirection.Ascending };
    let measureSourceDescending: DataViewMetadataColumn = { displayName: "measure1", queryName: "measure1", type: dataTypeNumber, isMeasure: true, index: 3, objects: { general: { formatString: "#.0" } }, sort: SortDirection.Descending };
    //#endregion

    //#region dataViewObjects
    let tableTotals: DataViewObjects = {
        general: {
            totals: true,
            autoSizeColumnWidth: true,
            textSize: 8,
        }
    };

    let tableTotalsIncreasedFontSize: DataViewObjects = {
        general: {
            totals: true,
            autoSizeColumnWidth: true,
            textSize: 14,
        }
    };

    let tableTotalsIncreasedFontSizeWithImage: DataViewObjects = {
        general: {
            totals: true,
            autoSizeColumnWidth: true,
            textSize: 14, // 25 font height
        },
        grid: {
            imageHeight: 20,
        }
    };

    let tableTotalsWithImage: DataViewObjects = {
        general: {
            totals: true,
            autoSizeColumnWidth: true,
            textSize: 8, // 13 font height
        },
        grid: {
            imageHeight: 20,
        }
    };

    let tableNoTotals: DataViewObjects = {
        general: {
            totals: false,
            autoSizeColumnWidth: true,
            textSize: 8,
        }
    };

    let tableColumnWidthFalse: DataViewObjects = {
        general: {
            totals: true,
            autoSizeColumnWidth: false,
            textSize: 8,
        }
    };

    let tableColumnWidthTrue: DataViewObjects = {
        general: {
            totals: true,
            autoSizeColumnWidth: true,
            textSize: 8,
        }
    };
    //#endregion

    //#region dataViewTables
    let dataViewTableThreeMeasures: DataViewTable = {
        columns: [measureSource1, measureSource2, measureSource3],
        rows: [
            [100, 10100, 102000],
            [103, 104000, 1050000],
            [106, 1070000, 10800000]
        ]
    };

    let tableOneMeasure: DataView = {
        metadata: { columns: [measureSource1] },
        table: {
            columns: [measureSource1],
            rows: [
                [100]
            ]
        }
    };

    let tableOneMeasurSortAscending: DataView = {
        metadata: { columns: [measureSourceAscending] },
        table: {
            columns: [measureSourceAscending],
            rows: [
                [100]
            ]
        }
    };

    let tableOneMeasurSortDescending: DataView = {
        metadata: { columns: [measureSourceDescending] },
        table: {
            columns: [measureSourceDescending],
            rows: [
                [100]
            ]
        }
    };

    let dataViewTableOneGroup: DataViewTable = {
        columns: [groupSource1],
        rows: [
            ["A"],
            ["B"],
            ["C"]
        ]
    };

    let tableOneGroup: DataView = {
        metadata: { columns: [groupSource1] },
        table: dataViewTableOneGroup
    };

    let tableOneGroupNulls: DataView = {
        metadata: { columns: [groupSource1] },
        table: {
            columns: [groupSource1],
            rows: [
                [""],
                [null]
            ]
        }
    };

    let dataViewTableOneGroupLeadingSpaces: DataViewTable = {
        columns: [groupSourceLeadingSpeaces],
        rows: [
            ["    A"],
            ["B"],
            ["C"]
        ]
    };

    let tableOneGroupLeadingSpaces: DataView = {
        metadata: { columns: [groupSourceLeadingSpeaces] },
        table: dataViewTableOneGroupLeadingSpaces
    };

    let dataViewTableTwoGroups: DataViewTable = {
        columns: [groupSource1, groupSource2],
        rows: [
            ["A", "a1"],
            ["A", "a2"],
            ["A", "a3"],
            ["B", "a1"],
            ["B", "a2"],
            ["C", "c1"],
            ["C", "c2"]
        ]
    };

    let tableTwoGroups: DataView = {
        metadata: { columns: [groupSource1, groupSource2] },
        table: dataViewTableTwoGroups
    };

    let tableTwoGroupsIncreasedFontSize: DataView = {
        metadata: {
            columns: [groupSource1, groupSource2],
            objects: tableTotalsIncreasedFontSize,
        },
        table: dataViewTableTwoGroups
    };

    let tableWithLongText: DataView = {
        metadata: {
            columns: [groupSource1, groupSource2, measureSource1, measureSource2, measureSource3],
            objects: tableTotals
        },
        table: {
            columns: [groupSource1, groupSource2, measureSource1, measureSource2, measureSource3],
            rows: [
                ["432432432", "a5", 344344, 1043241, 104342],
                ["g4", "432432432", 114324325, 116, 432432432],
                ["114324325", "114324325", 43242, 114324325, 3243242334]
            ],
            totals: [null, null, null, 114711911, 115367542, 3672424338]
        }
    };

    let tableTwoGroupsThreeMeasures: DataView = {
        metadata: {
            columns: [groupSource1, groupSource2, measureSource1, measureSource2, measureSource3],
            objects: tableTotals
        },
        table: {
            columns: [groupSource1, groupSource2, measureSource1, measureSource2, measureSource3],
            rows: [
                ["A", "a1", 100, 101, 102],
                ["A", "a2", 103, 104, 105],
                ["A", "a3", 106, 107, 108],
                ["B", "a1", 109, 110, 111],
                ["B", "a2", 112, 113, 114],
                ["C", "c1", 115, 116, 117],
                ["C", "c2", 118, 119, 120]
            ],
            totals: [null, null, 763, 770, 777]
        }
    };

    let tableTwoGroupsThreeMeasuresIncreasedFontSize: DataView = {
        metadata: {
            columns: [groupSource1, groupSource2, measureSource1, measureSource2, measureSource3],
            objects: tableTotalsIncreasedFontSize
        },
        table: {
            columns: [groupSource1, groupSource2, measureSource1, measureSource2, measureSource3],
            rows: [
                ["A", "a1", 100, 101, 102],
                ["A", "a2", 103, 104, 105],
                ["A", "a3", 106, 107, 108],
                ["B", "a1", 109, 110, 111],
                ["B", "a2", 112, 113, 114],
                ["C", "c1", 115, 116, 117],
                ["C", "c2", 118, 119, 120]
            ],
            totals: [null, null, 763, 770, 777]
        }
    };

    let tableTwoGroups1MeasureNulls: DataView = {
        metadata: {
            columns: [groupSource1, groupSource2, measureSource1]
        },
        table: {
            columns: [groupSource1, groupSource2, measureSource1],
            rows: [
                ["A", "a1", 100],
                ["", null, 103],
                ["", "a3", 106],
                ["B", "", 112],
                [null, "", null]
            ]
        }
    };

    let tableThreeGroupsThreeMeasuresInterleaved: DataView = {
        metadata: { columns: [groupSource1, measureSource1, groupSource2, measureSource2, groupSource3, measureSource3] },
        table: {
            columns: [groupSource1, measureSource1, groupSource2, measureSource2, groupSource3, measureSource3],
            rows: [
                ["A", 100, "aa", 101, "aa1", 102],
                ["A", 103, "aa", 104, "aa2", 105],
                ["A", 106, "ab", 107, "ab1", 108],
                ["B", 109, "ba", 110, "ba1", 111],
                ["B", 112, "bb", 113, "bb1", 114],
                ["B", 115, "bb", 116, "bb2", 117],
                ["C", 118, "cc", 119, "cc1", 120]
            ]
        }
    };

    let tableOneMeasureOneGroupSubtotals: DataView = {
        metadata: {
            columns: [measureSource1, groupSource1],
            objects: tableTotals
        },
        table: {
            columns: [measureSource1, groupSource1],
            rows: [
                [1, "A"],
                [2, "B"],
                [3, "C"]
            ],
            totals: [6, null]
        }
    };

    let tableOneMeasureOneGroupColumnWidthDefault: DataView = {
        metadata: {
            columns: [measureSource1, groupSource1],
            objects: tableColumnWidthFalse
        },
        table: {
            columns: [measureSource1, groupSource1],
            rows: [
                [1, "A"],
                [2, "B"],
                [3, "C"]
            ],
            totals: [6, null]
        }
    };

    let tableOneMeasureOneGroupColumnWidthTrue: DataView = {
        metadata: {
            columns: [measureSource1, groupSource1],
            objects: tableColumnWidthTrue
        },
        table: {
            columns: [measureSource1, groupSource1],
            rows: [
                [1, "A"],
                [2, "B"],
                [3, "C"]
            ],
            totals: [6, null]
        }
    };

    let tableOneMeasureOneGroup: DataView = {
        metadata: {
            columns: [measureSource1, groupSource1],
            objects: tableNoTotals
        },
        table: {
            columns: [measureSource1, groupSource1],
            rows: [
                [1, "A"],
                [2, "B"],
                [3, "C"]
            ]
        }
    };

    let tableWebUrl: DataView = {
        metadata: {
            columns: [groupSourceWebUrl],
            objects: tableNoTotals
        },
        table: {
            columns: [groupSourceWebUrl],
            rows: [
                ["http://www.microsoft.com"],
                ["data:url"],
                ["https://www.microsoft.com/2"]
            ]
        }
    };

    let tableKpi: DataView = {
        metadata: {
            columns: [groupSourceKpiStatus],
        },
        table: {
            columns: [groupSourceKpiStatus],
            rows: [
                ["-1"],
                ["0"],
                ["+1"],
            ]
        }
    };
    //#endregion
    //#endregion

    describe("Table", () => {
        it("Table registered capabilities", () => {
            expect(powerbi.visuals.plugins.table.capabilities).toEqual(tableCapabilities);
        });

        it("Capabilities should include dataViewMappings", () => {
            expect(tableCapabilities.dataViewMappings).toBeDefined();
        });

        it("Capabilities should include dataRoles", () => {
            expect(tableCapabilities.dataRoles).toBeDefined();
        });

        it("Capabilities should suppressDefaultTitle", () => {
            expect(tableCapabilities.suppressDefaultTitle).toBe(true);
        });

        it("FormatString property should match calculated", () => {
            expect(powerbi.data.DataViewObjectDescriptors.findFormatString(tableCapabilities.objects)).toEqual(TablixObjects.PropColumnFormatString.getPropertyID());
        });

        it("CustomizeQuery picks up enabled total", () => {
            let dataViewMapping = createCompiledDataViewMapping(tableTotals);

            Table.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });

            let rows = <CompiledDataViewRoleForMapping>dataViewMapping.table.rows;
            expect(rows.for.in.subtotalType).toEqual(CompiledSubtotalType.Before);
        });

        it("CustomizeQuery picks up disabled total", () => {
            let dataViewMapping = createCompiledDataViewMapping(tableNoTotals);

            powerbi.visuals.Table.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });

            let rows = <CompiledDataViewRoleForMapping>dataViewMapping.table.rows;
            expect(rows.for.in.subtotalType).toEqual(CompiledSubtotalType.None);
        });

        it("CustomizeQuery handles missing settings", () => {
            let dataViewMapping = createCompiledDataViewMapping();

            Table.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });

            // Total should be enabled by default
            let rows = <CompiledDataViewRoleForMapping>dataViewMapping.table.rows;
            expect(rows.for.in.subtotalType).toEqual(CompiledSubtotalType.Before);
        });

        it("CustomizeQuery handles missing subtotal settings", () => {
            let objects: DataViewObjects = {
                general: {
                    totals: undefined,
                    autoSizeColumnWidth: true,
                    textSize: 8,
                }
            };
            let dataViewMapping = createCompiledDataViewMapping(objects);

            Table.customizeQuery({
                dataViewMappings: [dataViewMapping]
            });

            // Total should be enabled by default
            let rows = <CompiledDataViewRoleForMapping>dataViewMapping.table.rows;
            expect(rows.for.in.subtotalType).toEqual(CompiledSubtotalType.Before);
        });

        function createCompiledDataViewMapping(objects?: DataViewObjects): CompiledDataViewMapping {
            return {
                metadata: {
                    objects: objects,
                    columns: []
                },
                table: {
                    rows: {
                        for: {
                            in: { role: "Values", items: [] }
                        }
                    }
                }
            };
        }
    });

    describe("Table hierarchy navigator tests", () => {
        function createNavigator(dataViewTable: DataViewTable): TableHierarchyNavigator {
            return new TableHierarchyNavigator(dataViewTable, true, valueFormatter.formatVariantMeasureValue);
        }

        describe("getDepth", () => {
            let dataView = tableTwoGroupsThreeMeasures;
            let navigator = createNavigator(dataView.table);

            it("returns 1 for row dimension", () => {
                expect(navigator.getRowHierarchyDepth()).toBe(1);
            });

            it("returns 1 for column dimension", () => {
                expect(navigator.getColumnHierarchyDepth()).toBe(1);
            });
        });

        describe("getLeafCount", () => {
            let dataView = tableThreeGroupsThreeMeasuresInterleaved;
            let navigator = createNavigator(dataView.table);

            it("returns the row count for row dimension", () => {
                expect(navigator.getLeafCount(dataView.table.rows)).toBe(7);
            });

            it("returns the column count for column dimension", () => {
                expect(navigator.getLeafCount(dataView.table.columns)).toBe(6);
            });
        });

        describe("getLeafAt", () => {

            it("returns the correct leaf from the row dimension", () => {
                let dataView = tableTwoGroupsThreeMeasures;
                let navigator = createNavigator(dataView.table);
                let rows = dataView.table.rows;

                expect(navigator.getLeafAt(rows, 0)).toBe(rows[0]);
                expect(navigator.getLeafAt(rows, 1)).toBe(rows[1]);
                expect(navigator.getLeafAt(rows, 6)).toBe(rows[6]);
            });

            it("returns the correct leaf from the column dimension", () => {
                let dataView = tableThreeGroupsThreeMeasuresInterleaved;
                let navigator = createNavigator(dataView.table);
                let columns = dataView.table.columns;

                expect(navigator.getLeafAt(columns, 0)).toBe(columns[0]);
                expect(navigator.getLeafAt(columns, 1)).toBe(columns[1]);
                expect(navigator.getLeafAt(columns, 5)).toBe(columns[5]);
            });

            it("returns undefined if index is out of bounds in the row dimension", () => {
                let dataView = tableOneMeasure;
                let navigator = createNavigator(dataView.table);
                let rows = dataView.table.rows;

                expect(navigator.getLeafAt(rows, 1)).not.toBeDefined();
            });

            it("returns undefined if index is out of bounds in the column dimension", () => {
                let dataView = tableOneMeasure;
                let navigator = createNavigator(dataView.table);
                let columns = dataView.table.columns;

                expect(navigator.getLeafAt(columns, 1)).not.toBeDefined();
            });
        });

        describe("getParent", () => {
            let dataView = tableTwoGroupsThreeMeasures;
            let navigator = createNavigator(dataView.table);

            it("returns null for column header", () => {
                expect(navigator.getParent(dataView.table.columns[0])).toBeNull();
            });

            it("returns null for row", () => {
                expect(navigator.getParent(dataView.table.rows[0])).toBeNull();
            });

            it("returns null in any other cases", () => {
                expect(navigator.getParent(null)).toBeNull();
            });
        });

        describe("getIndex", () => {

            it("returns the correct index for columns", () => {
                let dataView = tableThreeGroupsThreeMeasuresInterleaved;
                let navigator = createNavigator(dataView.table);
                let columns = dataView.table.columns;

                expect(navigator.getIndex(columns[0])).toBe(0);
                expect(navigator.getIndex(columns[1])).toBe(1);
                expect(navigator.getIndex(columns[2])).toBe(2);
                expect(navigator.getIndex(columns[3])).toBe(3);
                expect(navigator.getIndex(columns[4])).toBe(4);
                expect(navigator.getIndex(columns[5])).toBe(5);
            });

            it("returns the correct index for rows", () => {
                let dataView = tableTwoGroupsThreeMeasures;
                let navigator = createNavigator(dataView.table);
                let rows = dataView.table.rows;
                let row1 = { index: 0, values: rows[0] };
                let row2 = { index: 1, values: rows[1] };

                expect(navigator.getIndex(row1)).toBe(0);
                expect(navigator.getIndex(row2)).toBe(1);
            });

            it("returns -1 if cannot find column in the collection", () => {
                let dataView = tableTwoGroups;
                let navigator = createNavigator(dataView.table);
                let columnInAnotherTable = tableThreeGroupsThreeMeasuresInterleaved.table.columns[4];

                expect(navigator.getIndex(columnInAnotherTable)).toBe(-1);
            });

            it("returns -1 if it is null", () => {
                let dataView = tableTwoGroups;
                let navigator = createNavigator(dataView.table);

                expect(navigator.getIndex(null)).toBe(-1);
            });
        });

        describe("isLeaf", () => {

            it("returns true for columns", () => {
                let dataView = tableThreeGroupsThreeMeasuresInterleaved;
                let navigator = createNavigator(dataView.table);
                let columns = dataView.table.columns;

                expect(navigator.isLeaf(columns[0])).toBeTruthy();
                expect(navigator.isLeaf(columns[1])).toBeTruthy();
                expect(navigator.isLeaf(columns[2])).toBeTruthy();
                expect(navigator.isLeaf(columns[3])).toBeTruthy();
                expect(navigator.isLeaf(columns[4])).toBeTruthy();
                expect(navigator.isLeaf(columns[5])).toBeTruthy();
            });

            it("returns true for rows", () => {
                let dataView = tableTwoGroupsThreeMeasures;
                let navigator = createNavigator(dataView.table);
                let rows = dataView.table.rows;

                expect(navigator.isLeaf(rows[0])).toBeTruthy();
                expect(navigator.isLeaf(rows[1])).toBeTruthy();
                expect(navigator.isLeaf(rows[2])).toBeTruthy();
                expect(navigator.isLeaf(rows[3])).toBeTruthy();
                expect(navigator.isLeaf(rows[4])).toBeTruthy();
                expect(navigator.isLeaf(rows[5])).toBeTruthy();
                expect(navigator.isLeaf(rows[6])).toBeTruthy();
            });
        });

        describe("getChildren", () => {

            it("returns null for column", () => {
                let dataView = tableTwoGroupsThreeMeasures;
                let navigator = createNavigator(dataView.table);
                let column = dataView.table.columns[3];

                expect(navigator.getChildren(column)).toBeNull();
            });

            it("returns null for row", () => {
                let dataView = tableThreeGroupsThreeMeasuresInterleaved;
                let navigator = createNavigator(dataView.table);
                let row = dataView.table.rows[4];

                expect(navigator.getChildren(row)).toBeNull();
            });
        });

        describe("getCount", () => {
            let dataView = tableThreeGroupsThreeMeasuresInterleaved;
            let navigator = createNavigator(dataView.table);

            it("returns the number of the columns for column dimension", () => {
                expect(navigator.getCount(dataView.table.columns)).toBe(dataView.table.columns.length);
            });

            it("returns the number of the rows for row dimension", () => {
                expect(navigator.getCount(dataView.table.rows)).toBe(dataView.table.rows.length);
            });
        });

        describe("getAt", () => {

            it("returns the correct item from the row dimension", () => {
                let dataView = tableTwoGroupsThreeMeasures;
                let navigator = createNavigator(dataView.table);
                let rows = dataView.table.rows;

                expect(navigator.getAt(rows, 0)).toBe(rows[0]);
                expect(navigator.getAt(rows, 1)).toBe(rows[1]);
                expect(navigator.getAt(rows, 6)).toBe(rows[6]);
            });

            it("returns the correct item from the column dimension", () => {
                let dataView = tableThreeGroupsThreeMeasuresInterleaved;
                let navigator = createNavigator(dataView.table);
                let columns = dataView.table.columns;

                expect(navigator.getAt(columns, 0)).toBe(columns[0]);
                expect(navigator.getAt(columns, 1)).toBe(columns[1]);
                expect(navigator.getAt(columns, 5)).toBe(columns[5]);
            });

            it("returns undefined if index is out of bounds in the row dimension", () => {
                let dataView = tableOneMeasure;
                let navigator = createNavigator(dataView.table);

                expect(navigator.getAt(dataView.table.rows, 1)).not.toBeDefined();
            });

            it("returns undefined if index is out of bounds in the column dimension", () => {
                let dataView = tableOneMeasure;
                let navigator = createNavigator(dataView.table);

                expect(navigator.getAt(dataView.table.columns, 1)).not.toBeDefined();
            });
        });

        describe("getLevel", () => {
            let dataView = tableThreeGroupsThreeMeasuresInterleaved;
            let navigator = createNavigator(dataView.table);

            it("returns 0 for column", () => {
                expect(navigator.getLevel(dataView.table.columns[1])).toBe(0);
            });

            it("returns 0 for row", () => {
                expect(navigator.getLevel(dataView.table.rows[5])).toBe(0);
            });
        });

        describe("isLast", () => {
            let dataView: DataView;
            let visualTable: powerbi.visuals.DataViewVisualTable;
            let rows: powerbi.visuals.DataViewVisualTableRow[];
            let columns: DataViewMetadataColumn[];
            let navigator: TableHierarchyNavigator;

            beforeEach(() => {
                dataView = tableOneMeasure;
                visualTable = powerbi.visuals.Table.converter(dataView);
                rows = visualTable.visualRows;
                columns = visualTable.columns;
            });

            it("returns true if data is complete", () => {
                navigator = new TableHierarchyNavigator(visualTable, true, valueFormatter.formatVariantMeasureValue);
                expect(navigator.isLastItem(rows[0], rows)).toBe(true);
                expect(navigator.isLastItem(columns[0], columns)).toBe(true);
            });

            it("returns false if data is incomplete", () => {
                navigator = new TableHierarchyNavigator(visualTable, false, valueFormatter.formatVariantMeasureValue);
                expect(navigator.isLastItem(rows[0], rows)).toBe(false);
                expect(navigator.isLastItem(columns[0], columns)).toBe(true);
            });

            it("returns true for last segment", () => {
                navigator = new TableHierarchyNavigator(visualTable, false, valueFormatter.formatVariantMeasureValue);
                expect(navigator.isLastItem(rows[0], rows)).toBe(false);
                expect(navigator.isLastItem(columns[0], columns)).toBe(true);

                navigator.update(visualTable, true);
                expect(navigator.isLastItem(rows[0], rows)).toBe(true);
                expect(navigator.isLastItem(columns[0], columns)).toBe(true);
            });
        });
        describe("getIntersection", () => {
            it("returns values in the intersection", () => {
                let dataView = tableThreeGroupsThreeMeasuresInterleaved;
                let visualTable = powerbi.visuals.Table.converter(dataView);
                let rows = visualTable.visualRows;
                let columns = dataView.table.columns;
                let navigator = new TableHierarchyNavigator(visualTable, true, valueFormatter.formatVariantMeasureValue);

                let expectedValues: string[][] = [
                    ["A", "100.0", "aa", "101.00", "aa1", "102"],
                    ["A", "103.0", "aa", "104.00", "aa2", "105"],
                    ["A", "106.0", "ab", "107.00", "ab1", "108"],
                    ["B", "109.0", "ba", "110.00", "ba1", "111"],
                    ["B", "112.0", "bb", "113.00", "bb1", "114"],
                    ["B", "115.0", "bb", "116.00", "bb2", "117"],
                    ["C", "118.0", "cc", "119.00", "cc1", "120"]
                ];

                expect(fillResult<string>(navigator, rows, columns, "textContent")).toEqual(expectedValues);
            });

            it("returns weburl values", () => {
                let dataView = tableWebUrl;
                let visualTable = powerbi.visuals.Table.converter(dataView);
                let rows = visualTable.visualRows;
                let columns = dataView.table.columns;
                let navigator = new TableHierarchyNavigator(visualTable, true, valueFormatter.formatVariantMeasureValue);

                let expectedValues: boolean[][] = [
                    [true],
                    [false],
                    [true]
                ];

                expect(fillResult<boolean>(navigator, rows, columns, "isValidUrl")).toEqual(expectedValues);
            });

            it("returns Kpi Markup", () => {
                let dataView = tableKpi;
                let visualTable = powerbi.visuals.Table.converter(dataView);
                let rows = visualTable.visualRows;
                let columns = dataView.table.columns;
                let navigator = new TableHierarchyNavigator(visualTable, true, valueFormatter.formatVariantMeasureValue);

                let expectedValues: string[][] = [
                    ['<div class="powervisuals-glyph circle kpi-red" style="display: inline-block; vertical-align: bottom; margin: 0px;"></div>'],
                    ['<div class="powervisuals-glyph circle kpi-yellow" style="display: inline-block; vertical-align: bottom; margin: 0px;"></div>'],
                    ['<div class="powervisuals-glyph circle kpi-green" style="display: inline-block; vertical-align: bottom; margin: 0px;"></div>'],
                ];

                expect(fillResult<string>(navigator, rows, columns, "kpiContent")).toEqual(expectedValues);
            });

            it("sets proper position for complete data", () => {
                let dataView = tableOneMeasure;
                let visualTable = powerbi.visuals.Table.converter(dataView);
                let rows = visualTable.visualRows;
                let columns = dataView.table.columns;
                let navigator = new TableHierarchyNavigator(visualTable, true, valueFormatter.formatVariantMeasureValue);

                let dataPoint = navigator.getIntersection(rows[0], columns[0]);

                expect(dataPoint.position.column.index).toBe(0);
                expect(dataPoint.position.column.isFirst).toBe(true);
                expect(dataPoint.position.column.isLast).toBe(true);

                expect(dataPoint.position.row.index).toBe(0);
                expect(dataPoint.position.row.isFirst).toBe(true);
                expect(dataPoint.position.row.isLast).toBe(true);
            });

            it("sets proper position for incomplete data", () => {
                let dataView = tableOneMeasure;
                let visualTable = powerbi.visuals.Table.converter(dataView);
                let rows = visualTable.visualRows;
                let columns = dataView.table.columns;
                let navigator = new TableHierarchyNavigator(visualTable, false, valueFormatter.formatVariantMeasureValue);

                let dataPoint = navigator.getIntersection(rows[0], columns[0]);

                expect(dataPoint.position.column.index).toBe(0);
                expect(dataPoint.position.column.isFirst).toBe(true);
                expect(dataPoint.position.column.isLast).toBe(true);

                expect(dataPoint.position.row.index).toBe(0);
                expect(dataPoint.position.row.isFirst).toBe(true);
                expect(dataPoint.position.row.isLast).toBe(false);
            });

            function fillResult<T>(
                navigator: TableHierarchyNavigator,
                rows: powerbi.visuals.DataViewVisualTableRow[],
                columns: DataViewMetadataColumn[],
                property: string): T[][] {

                let result: T[][] = [];

                for (let i = 0, ilen = rows.length; i < ilen; i++) {
                    result[i] = [];
                    for (let j = 0, jlen = columns.length; j < jlen; j++) {
                        let propertyValue = result[i][j] = navigator.getIntersection(rows[i], columns[j])[property];
                        if (propertyValue instanceof jQuery)
                            result[i][j] = propertyValue[0].outerHTML;
                    }
                }

                return result;
            }
        });

        describe("getCorner", () => {

            it("always returns null", () => {
                let dataView = tableThreeGroupsThreeMeasuresInterleaved;
                let navigator = createNavigator(dataView.table);

                expect(navigator.getCorner(0, 0)).toBeNull();
                expect(navigator.getCorner(10, 0)).toBeNull();
                expect(navigator.getCorner(0, 10)).toBeNull();
                expect(navigator.getCorner(10, 10)).toBeNull();
            });
        });

        describe("headerItemEquals", () => {

            it("returns true if the two items are the same", () => {
                let dataView = tableThreeGroupsThreeMeasuresInterleaved;
                let row = dataView.table.rows[0];
                let column = dataView.table.columns[0];
                let navigator = createNavigator(dataView.table);

                expect(navigator.headerItemEquals(row, row)).toBeTruthy();
                expect(navigator.headerItemEquals(column, column)).toBeTruthy();
            });

            it("returns false if the two items are not same", () => {
                let dataView = tableThreeGroupsThreeMeasuresInterleaved;
                let navigator = createNavigator(dataView.table);

                expect(navigator.headerItemEquals({ displayName: "a" }, { displayName: "a" })).toBeTruthy();
            });
            it("returns true for rows with index", () => {
                let dataView = tableThreeGroupsThreeMeasuresInterleaved;
                let navigator = createNavigator(dataView.table);

                expect(navigator.headerItemEquals({ index: 1, values: [] }, { index: 1, values: [] })).toBeTruthy();
            });
            it("returns false if the two items are not same", () => {
                let dataView = tableThreeGroupsThreeMeasuresInterleaved;
                let row = dataView.table.rows[0];
                let column = dataView.table.columns[0];
                let navigator = createNavigator(dataView.table);

                expect(navigator.headerItemEquals(row, column)).toBeFalsy();
                expect(navigator.headerItemEquals(column, row)).toBeFalsy();
            });
            it("returns false detects rows with index", () => {
                let dataView = tableThreeGroupsThreeMeasuresInterleaved;
                let navigator = createNavigator(dataView.table);

                expect(navigator.headerItemEquals({ index: 1 }, { index: 2 })).toBeFalsy();
            });

        });

        describe("bodyCellItemEquals", () => {

            it("returns true if the two items are the same", () => {
                let dataView = tableThreeGroupsThreeMeasuresInterleaved;
                let dataViewVisualTable = Table.converter(dataView);
                let navigator = createNavigator(dataViewVisualTable);
                let cell1 = navigator.getIntersection(dataViewVisualTable.visualRows[0], dataView.table.columns[3]);
                let cell2 = navigator.getIntersection(dataViewVisualTable.visualRows[0], dataView.table.columns[3]);

                expect(navigator.bodyCellItemEquals(cell1, cell2)).toBeTruthy();
            });

            it("returns false if the two items are not same", () => {
                let dataView = tableThreeGroupsThreeMeasuresInterleaved;
                let dataViewVisualTable = Table.converter(dataView);
                let navigator = createNavigator(dataViewVisualTable);
                let cell1 = navigator.getIntersection(dataViewVisualTable.visualRows[0], dataView.table.columns[1]);
                let cell2 = navigator.getIntersection(dataViewVisualTable.visualRows[0], dataView.table.columns[2]);

                expect(navigator.bodyCellItemEquals(cell1, cell2)).toBeFalsy();
            });
        });
    });

    describe("Table Binder", () => {
        it("Sets row height to textHeight if there is no images (normal font size)", (done) => {
            let dataView = createDataView([groupSource1]);
            let binder = createBinder(dataView);
            expect(getRowHeight(binder)).toBe(13);

            done();
        });

        it("Sets row height to textHeight if there is no images (increased font size)", (done) => {
            let dataView = createDataView([groupSource1], tableTotalsIncreasedFontSize);
            let binder = createBinder(dataView);
            expect(getRowHeight(binder)).toBe(25);

            done();
        });

        it("Sets row height to textHeight if there is image, but text height is > image height", (done) => {
            let dataView = createDataView([groupSourceImageUrl], tableTotalsIncreasedFontSizeWithImage);
            let binder = createBinder(dataView);
            expect(getRowHeight(binder)).toBe(25);

            done();
        });

        it("Sets row height to imageHeight if there is image, and text height is < image height", (done) => {
            let dataView = createDataView([groupSourceImageUrl], tableTotalsWithImage);
            let binder = createBinder(dataView);
            expect(getRowHeight(binder)).toBe(20);

            done();
        });

        function createBinder(dataView: DataView): TableBinder {
            return new TableBinder({}, Table.converter(dataView));
        }

        function getRowHeight(binder: TableBinder): number {
            return binder["rowHeight"];
        }

        function createDataView(columns: DataViewMetadataColumn[], objects?: DataViewObjects): DataView {
            return {
                table: {
                    columns: columns,
                    rows: [],
                },
                metadata: {
                    columns: columns,
                    objects: objects || {}
                }
            };
        }
    });

    describe("Table logic", () => {
        let v: powerbi.IVisual,
            element: JQuery;

        beforeEach(() => {
            element = powerbitests.helpers.testDom("500", "500");
            element["visible"] = () => { return true; };
            v = new Table();
            v.init({
                element: element,
                host: powerbitests.mocks.createVisualHostServices(),
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: {
                    selection: true
                }
            });
        });

        it("loadMoreData calls control refresh", () => {
            let nav = { update() { } };
            let control = { refresh() { }, rowDimension: {}, updateModels(resetScrollOffsets: boolean, rowModel: any, columnModel: any) { } };
            let navSpy = spyOn(nav, "update");
            let controlSpy = spyOn(control, "refresh");
            v["hierarchyNavigator"] = nav;
            v["tablixControl"] = control;

            v.onDataChanged({
                dataViews: [tableOneGroup],
                operationKind: powerbi.VisualDataChangeOperationKind.Append
            });

            expect(navSpy).toHaveBeenCalled();
            expect(controlSpy).toHaveBeenCalled();
        });

        it("needsMoreData waitingForData", () => {
            v.onDataChanged({
                dataViews: [{
                    metadata: { columns: [groupSource1], segment: {} },
                    table: dataViewTableOneGroup
                }]
            });

            v["waitingForData"] = true;
            let tableVisual: Table = <Table>v;
            let lastRow = dataViewTableOneGroup.rows[2];
            let result = tableVisual.needsMoreData(lastRow);

            expect(result).toBe(false);
        });

        it("needsMoreData segmentComplete", () => {

            v.onDataChanged({
                dataViews: [{
                    metadata: { columns: [groupSource1] },
                    table: dataViewTableOneGroup
                }]
            });

            let tableVisual: Table = <Table>v;
            let lastRow = dataViewTableOneGroup.rows[2];
            let result = tableVisual.needsMoreData(lastRow);

            expect(result).toBe(false);
        });

        it("needsMoreData belowThreshold", () => {

            let table = dataViewTableTwoGroups;

            v.onDataChanged({
                dataViews: [{
                    metadata: { columns: [groupSource1, groupSource2], segment: {} },
                    table: table
                }]
            });

            let tableVisual: Table = <Table>v;
            let lastRow = table.rows[3];
            let result = tableVisual.needsMoreData(lastRow);

            expect(result).toBe(false);
        });

        it("needsMoreData aboveThreshold", () => {

            let table = dataViewTableTwoGroups;

            v.onDataChanged({
                dataViews: [{
                    metadata: { columns: [groupSource1, groupSource2], segment: {} },
                    table: table
                }]
            });

            let tableVisual: Table = <Table>v;
            let lastRow = { index: 6, values: table.rows[6] };
            let result = tableVisual.needsMoreData(lastRow);

            expect(result).toBe(true);
        });

        it("bindRowHeader callback", () => {

            let callBackCalled = false;
            let binderOptions: powerbi.visuals.TableBinderOptions = {
                onBindRowHeader: () => { callBackCalled = true; },
                layoutKind: powerbi.visuals.controls.TablixLayoutKind.Canvas
            };

            let binder = new powerbi.visuals.TableBinder(binderOptions);
            let position = new TablixUtils.CellPosition;
            let cell: powerbi.visuals.controls.ITablixCell = {
                type: null,
                item: null,
                colSpan: 0,
                rowSpan: 0,
                textAlign: "",
                position: position,
                extension: new powerbi.visuals.controls.internal.TablixCellPresenter(false, Controls.TablixLayoutKind.Canvas),
                contentHeight: 0,
                contentWidth: 0,
                applyStyle: function () { },
                unfixRowHeight: function () { },
                containerHeight: 0, containerWidth: 0
            };
            binder.bindRowHeader({ name: null }, cell);

            expect(callBackCalled).toBe(true);
        });

        it("enumerateObjectInstances empty data view", () => {
            v.onDataChanged({ dataViews: [] });

            // Note: this must not throw an exception
            expect(v.enumerateObjectInstances({ objectName: "general" })).toEqual(undefined);
        });

        it("enumerateObjectInstances general totals on", () => {
            v.onDataChanged({ dataViews: [tableOneMeasureOneGroupSubtotals] });

            expect(v.enumerateObjectInstances({ objectName: "general" })).toEqual({
                instances: [{
                    selector: null,
                    objectName: "general",
                    properties: {
                        totals: true,
                        autoSizeColumnWidth: true,
                        textSize: 8,
                    }
                }]
            });
        });

        it("enumerateObjectInstances general totals off", () => {
            v.onDataChanged({ dataViews: [tableOneMeasureOneGroup] });

            expect(v.enumerateObjectInstances({ objectName: "general" })).toEqual({
                instances: [{
                    selector: null,
                    objectName: "general",
                    properties: {
                        totals: false,
                        autoSizeColumnWidth: true,
                        textSize: 8,
                    }
                }]
            });
        });

        it("enumerateObjectInstances general totals on but suppressed by no aggregation", () => {
            let dataViews = _.cloneDeep(tableOneMeasureOneGroupSubtotals);
            dataViews.table.columns[0].discourageAggregationAcrossGroups = true;

            v.onDataChanged({ dataViews: [dataViews] });

            expect(v.enumerateObjectInstances({ objectName: "general" })).toEqual({
                instances: [{
                    selector: null,
                    objectName: "general",
                    properties: {
                        autoSizeColumnWidth: true,
                        textSize: 8,
                    }
                }]
            });
        });

        it("enumerateObjectInstances general no objects", () => {
            let dataView: DataView = {
                metadata: {
                    columns: [measureSource1, groupSource1]
                },
                table: {
                    columns: [measureSource1, groupSource1],
                    rows: [
                        [1, "A"],
                        [2, "B"],
                        [3, "C"]
                    ],
                    totals: [6, null]
                }
            };
            v.onDataChanged({ dataViews: [dataView] });

            expect(v.enumerateObjectInstances({ objectName: "general" })).toEqual({
                instances: [{
                    selector: null,
                    objectName: "general",
                    properties: {
                        totals: true,
                        autoSizeColumnWidth: true,
                        textSize: 8,
                    }
                }]
            });
        });

        it("enumerateObjectInstances some other object", () => {
            v.onDataChanged({ dataViews: [tableOneMeasureOneGroup] });

            let objects = v.enumerateObjectInstances({ objectName: "some other object" });
            expect(objects).toEqual(undefined);
        });

        it("enumerateObjectInstances general autoSizeColumnWidth off", () => {
            v.onDataChanged({ dataViews: [tableOneMeasureOneGroupColumnWidthDefault] });

            expect(v.enumerateObjectInstances({ objectName: "general" })).toEqual({
                instances: [{
                    selector: null,
                    objectName: "general",
                    properties: {
                        totals: true,
                        autoSizeColumnWidth: false,
                        textSize: 8,
                    }
                }]
            });
        });

        it("enumerateObjectInstances general autoSizeColumnWidth on", () => {
            v.onDataChanged({ dataViews: [tableOneMeasureOneGroupColumnWidthTrue] });

            expect(v.enumerateObjectInstances({ objectName: "general" })).toEqual({
                instances: [{
                    selector: null,
                    objectName: "general",
                    properties: {
                        totals: true,
                        autoSizeColumnWidth: true,
                        textSize: 8,
                    }
                }]
            });
        });

        it("enumerateObjectRepetition - conditional formatting", () => {
            v = new Table();
            v.init({
                element: element,
                host: powerbitests.mocks.createVisualHostServices(),
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: {
                    selection: true
                }
            });
            v.onDataChanged({ dataViews: [tableOneMeasureOneGroupColumnWidthTrue] });

            expect(v.enumerateObjectRepetition()).toEqualDeep(
                [{
                    selector: {
                        data: [DataViewRoleWildcard.fromRoles(['Values'])],
                        metadata: 'measure1',
                    },
                    objects: {
                        values: {
                            formattingProperties: ['backColor']
                        }
                    },
                }, {
                        selector: {
                            data: [DataViewRoleWildcard.fromRoles(['Values'])],
                            metadata: 'group1',
                        },
                        objects: {
                            values: {
                                formattingProperties: ['backColor']
                            }
                        },
                    }]
            );
        });

        it("RefreshControl invisible parent", () => {
            let control = { refresh() { } };
            let controlSpy = spyOn(control, "refresh");
            v["shouldAllowHeaderResize"] = () => { return true; };
            v["hierarchyNavigator"] = { update() { } };
            v["tablixControl"] = control;
            v["element"]["visible"] = () => { return false; };

            v.onResizing({ width: 100, height: 100 });

            // Even though element visibility is false, because height and width are greater than zero, refresh will be called
            expect(controlSpy).toHaveBeenCalled();
        });

        it("RefreshControl invisible parent but dashboard layout", () => {
            let control = { refresh() { } };
            let controlSpy = spyOn(control, "refresh");
            v["shouldAllowHeaderResize"] = () => { return true; };
            v["hierarchyNavigator"] = { update() { } };
            v["tablixControl"] = control;
            v["element"]["visible"] = () => { return false; };
            v["isInteractive"] = false;

            v.onResizing({ width: 100, height: 100 });

            expect(controlSpy).toHaveBeenCalled();
        });

        it("ShouldClearControl noSort", (done) => {
            v.onDataChanged({ dataViews: [tableOneGroup] });
            let refreshSpy = spyOn(v, "refreshControl").and.callFake(() => { });

            v.onDataChanged({ dataViews: [tableOneGroup] });
            setTimeout(() => {
                expect(refreshSpy).toHaveBeenCalledWith(true);
                done();
            }, DefaultWaitForRender);
        });

        it("ShouldClearControl sort", (done) => {
            v.onDataChanged({ dataViews: [tableOneGroup] });
            let refreshSpy = spyOn(v, "refreshControl").and.callFake(() => { });
            v["waitingForSort"] = true;
            v.onDataChanged({ dataViews: [tableOneGroup] });

            setTimeout(() => {
                expect(refreshSpy).toHaveBeenCalledWith(false);
                done();
            }, DefaultWaitForRender);
        });

        it("suppressNotification not set after loading table with ColumnAutoSizeProperty off", (done) => {
            let dataViewObjects: DataViewObjects = {
                general: {
                    totals: true,
                    autoSizeColumnWidth: false,
                    textSize: 8,
                }
            };

            let measureSource1WithWidth = createColumnWithWidth(measureSource1, 100);
            let measureSource2WithWidth = createColumnWithWidth(measureSource2, 200);
            let measureSource3WithWidth = createColumnWithWidth(measureSource3, 300);

            let dataView: DataView = {
                metadata: {
                    columns: [measureSource1WithWidth, measureSource2WithWidth, measureSource3WithWidth],
                    objects: dataViewObjects
                },
                table: dataViewTableThreeMeasures
            };
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                let tableVisual = <Table>v;
                let colWidthManager = tableVisual.getColumnWidthManager();
                let persistedColWidths = colWidthManager.getColumnWidthObjects();

                expect(tableVisual.persistingObjects).toBe(false);
                expect(Object.getOwnPropertyNames(persistedColWidths).length).toBe(3);
                expect(persistedColWidths[measureSource1WithWidth.queryName].width).toBe(100);
                expect(persistedColWidths[measureSource1WithWidth.queryName].isFixed).toBe(true);
                expect(persistedColWidths[measureSource2WithWidth.queryName].width).toBe(200);
                expect(persistedColWidths[measureSource2WithWidth.queryName].isFixed).toBe(true);
                expect(persistedColWidths[measureSource3WithWidth.queryName].width).toBe(300);
                expect(persistedColWidths[measureSource3WithWidth.queryName].isFixed).toBe(true);
                done();
            }, DefaultWaitForRender);
        });

        describe("Resizing a column", () => {

            it("adds changed column if AutoSize is ON", (done) => {
                let dataViewObjects: powerbi.DataViewObjects = {
                    general: {
                        totals: true,
                        autoSizeColumnWidth: true,
                        textSize: 8,
                    }
                };
                let dataView: DataView = {
                    metadata: {
                        columns: [measureSource1, measureSource2, measureSource3],
                        objects: dataViewObjects
                    },
                    table: dataViewTableThreeMeasures
                };
                v.onDataChanged({ dataViews: [dataView] });
                setTimeout(() => {
                    let tableVisual = <Table>v;
                    let colWidthManager = tableVisual.getColumnWidthManager();
                    let persistedColWidths = colWidthManager.getFixedColumnWidthObjects();
                    // Initially empty
                    expect(Object.getOwnPropertyNames(persistedColWidths).length).toBe(0);

                    colWidthManager.onColumnWidthChanged(measureSource2.queryName, 45);
                    persistedColWidths = colWidthManager.getFixedColumnWidthObjects();
                    expect(Object.getOwnPropertyNames(persistedColWidths).length).toBe(1);
                    expect(persistedColWidths[measureSource2.queryName].isFixed).toBe(true);
                    expect(persistedColWidths[measureSource2.queryName].width).toBe(45);
                    done();
                }, DefaultWaitForRender);
            });

            it("changes column if AutoSize is OFF", (done) => {
                let dataViewObjects: powerbi.DataViewObjects = {
                    general: {
                        totals: true,
                        autoSizeColumnWidth: false,
                        textSize: 8,
                    }
                };

                let measureSource1WithWidth = createColumnWithWidth(measureSource1, 100);
                let measureSource2WithWidth = createColumnWithWidth(measureSource2, 200);
                let measureSource3WithWidth = createColumnWithWidth(measureSource3, 300);

                let dataView: DataView = {
                    metadata: {
                        columns: [measureSource1WithWidth, measureSource2WithWidth, measureSource3WithWidth],
                        objects: dataViewObjects
                    },
                    table: dataViewTableThreeMeasures
                };
                v.onDataChanged({ dataViews: [dataView] });
                setTimeout(() => {
                    let tableVisual = <Table>v;
                    let colWidthManager = tableVisual.getColumnWidthManager();
                    let persistedColWidths = colWidthManager.getColumnWidthObjects();

                    // Initially has 3 instances
                    expect(Object.getOwnPropertyNames(persistedColWidths).length).toBe(3);
                    expect(persistedColWidths[measureSource1WithWidth.queryName].isFixed).toBe(true);
                    expect(persistedColWidths[measureSource1WithWidth.queryName].width).toBe(100);
                    expect(persistedColWidths[measureSource2WithWidth.queryName].isFixed).toBe(true);
                    expect(persistedColWidths[measureSource2WithWidth.queryName].width).toBe(200);
                    expect(persistedColWidths[measureSource3WithWidth.queryName].isFixed).toBe(true);
                    expect(persistedColWidths[measureSource3WithWidth.queryName].width).toBe(300);

                    colWidthManager.onColumnWidthChanged(measureSource2.queryName, 45);
                    persistedColWidths = colWidthManager.getFixedColumnWidthObjects();
                    expect(Object.getOwnPropertyNames(persistedColWidths).length).toBe(3);
                    expect(persistedColWidths[measureSource1WithWidth.queryName].isFixed).toBe(true);
                    expect(persistedColWidths[measureSource1WithWidth.queryName].width).toBe(100);
                    expect(persistedColWidths[measureSource2WithWidth.queryName].isFixed).toBe(true);
                    expect(persistedColWidths[measureSource2WithWidth.queryName].width).toBe(45);
                    expect(persistedColWidths[measureSource3WithWidth.queryName].isFixed).toBe(true);
                    expect(persistedColWidths[measureSource3WithWidth.queryName].width).toBe(300);
                    done();
                }, DefaultWaitForRender);
            });

            it("doesn't maintain columns with undefined QueryName", (done) => {
                let dataViewObjects: powerbi.DataViewObjects = {
                    general: {
                        totals: true,
                        autoSizeColumnWidth: false,
                        textSize: 8,
                    }
                };

                let measureSource1WithWidth = createColumnWithWidth(measureSource1, 100);
                let measureSource2WithWidth = createColumnWithWidth(measureSource2, 200);
                measureSource2WithWidth.queryName = undefined;
                let measureSource3WithWidth = createColumnWithWidth(measureSource3, 300);

                let dataView0: DataView = {
                    metadata: {
                        columns: [measureSource1WithWidth, measureSource2WithWidth, measureSource3WithWidth],
                        objects: dataViewObjects
                    },
                    table: {
                        columns: [measureSource1WithWidth, measureSource2WithWidth, measureSource3WithWidth],
                        rows: [
                            [100, 10100, 102000],
                            [103, 104000, 1050000],
                            [106, 1070000, 10800000]
                        ]
                    }
                };
                v.onDataChanged({ dataViews: [dataView0] });
                setTimeout(() => {
                    let tableVisual = <Table>v;
                    let colWidthManager = tableVisual.getColumnWidthManager();
                    let persistedColWidths = colWidthManager.getColumnWidthObjects();

                    // Initially has 2 instances
                    expect(Object.getOwnPropertyNames(persistedColWidths).length).toBe(2);
                    expect(persistedColWidths[measureSource1WithWidth.queryName].isFixed).toBe(true);
                    expect(persistedColWidths[measureSource1WithWidth.queryName].width).toBe(100);
                    expect(persistedColWidths[measureSource2WithWidth.queryName]).toBeUndefined();
                    expect(persistedColWidths[measureSource3WithWidth.queryName].isFixed).toBe(true);
                    expect(persistedColWidths[measureSource3WithWidth.queryName].width).toBe(300);

                    colWidthManager.onColumnWidthChanged(measureSource2.queryName, 45);
                    persistedColWidths = colWidthManager.getFixedColumnWidthObjects();
                    expect(Object.getOwnPropertyNames(persistedColWidths).length).toBe(2);
                    expect(persistedColWidths[measureSource1WithWidth.queryName].isFixed).toBe(true);
                    expect(persistedColWidths[measureSource1WithWidth.queryName].width).toBe(100);
                    expect(persistedColWidths[measureSource2WithWidth.queryName]).toBeUndefined();
                    expect(persistedColWidths[measureSource3WithWidth.queryName].isFixed).toBe(true);
                    expect(persistedColWidths[measureSource3WithWidth.queryName].width).toBe(300);

                    done();
                }, DefaultWaitForRender);
            });
        });

        describe("Autosizing a column", () => {
            it("clears the column information if AutoSize is ON", (done) => {
                let dataViewObjects: powerbi.DataViewObjects = {
                    general: {
                        totals: true,
                        autoSizeColumnWidth: true,
                        textSize: 8,
                    }
                };
                let measureSource2WithWidth = createColumnWithWidth(measureSource2, 200);
                let dataView: DataView = {
                    metadata: {
                        columns: [measureSource1, measureSource2WithWidth, measureSource3],
                        objects: dataViewObjects
                    },
                    table: dataViewTableThreeMeasures
                };
                v.onDataChanged({ dataViews: [dataView] });
                setTimeout(() => {
                    let tableVisual = <Table>v;
                    let colWidthManager = tableVisual.getColumnWidthManager();
                    let persistedColWidths = colWidthManager.getFixedColumnWidthObjects();

                    // Initially has 1 item
                    expect(Object.getOwnPropertyNames(persistedColWidths).length).toBe(1);
                    expect(persistedColWidths[measureSource2.queryName].isFixed).toBe(true);
                    expect(persistedColWidths[measureSource2.queryName].width).toBe(200);

                    colWidthManager.onColumnWidthChanged(measureSource2.queryName, -1);
                    persistedColWidths = colWidthManager.getFixedColumnWidthObjects();
                    expect(Object.getOwnPropertyNames(persistedColWidths).length).toBe(0);

                    done();
                }, DefaultWaitForRender);
            });

            it("sets the column width to unknown if AutoSize is OFF", (done) => {
                let dataViewObjects: powerbi.DataViewObjects = {
                    general: {
                        totals: true,
                        autoSizeColumnWidth: false,
                        textSize: 8,
                    }
                };
                let newMeasure1 = createColumnWithWidth(measureSource1, 100);
                let newMeasure2 = createColumnWithWidth(measureSource2, 200);
                let newMeasure3 = createColumnWithWidth(measureSource3, 300);

                let dataView: DataView = {
                    metadata: {
                        columns: [newMeasure1, newMeasure2, newMeasure3],
                        objects: dataViewObjects
                    },
                    table: dataViewTableThreeMeasures
                };
                v.onDataChanged({ dataViews: [dataView] });
                setTimeout(() => {
                    let tableVisual = <Table>v;
                    let colWidthManager = tableVisual.getColumnWidthManager();
                    let persistedColWidths = colWidthManager.getFixedColumnWidthObjects();
                    // Initially has 1 item
                    expect(Object.getOwnPropertyNames(persistedColWidths).length).toBe(3);
                    expect(persistedColWidths[newMeasure1.queryName].isFixed).toBe(true);
                    expect(persistedColWidths[newMeasure1.queryName].width).toBe(100);
                    expect(persistedColWidths[newMeasure2.queryName].isFixed).toBe(true);
                    expect(persistedColWidths[newMeasure2.queryName].width).toBe(200);
                    expect(persistedColWidths[newMeasure3.queryName].isFixed).toBe(true);
                    expect(persistedColWidths[newMeasure3.queryName].width).toBe(300);

                    colWidthManager.onColumnWidthChanged(measureSource2.queryName, -1);
                    persistedColWidths = colWidthManager.getFixedColumnWidthObjects();
                    expect(Object.getOwnPropertyNames(persistedColWidths).length).toBe(3);
                    expect(persistedColWidths[newMeasure1.queryName].isFixed).toBe(true);
                    expect(persistedColWidths[newMeasure1.queryName].width).toBe(100);
                    expect(persistedColWidths[newMeasure2.queryName].isFixed).toBe(true);
                    expect(persistedColWidths[newMeasure2.queryName].width).toBe(undefined);
                    expect(persistedColWidths[newMeasure3.queryName].isFixed).toBe(true);
                    expect(persistedColWidths[newMeasure3.queryName].width).toBe(300);

                    done();
                }, DefaultWaitForRender);
            });

            it("has no effect for columns with undefined queryName", (done) => {
                let dataViewObjects: powerbi.DataViewObjects = {
                    general: {
                        totals: true,
                        autoSizeColumnWidth: true,
                        textSize: 8,
                    }
                };
                let measureSource2WithWidth = createColumnWithWidth(measureSource2, 200);
                let dataView: DataView = {
                    metadata: {
                        columns: [measureSource1, measureSource2WithWidth, measureSource3],
                        objects: dataViewObjects
                    },
                    table: dataViewTableThreeMeasures
                };
                v.onDataChanged({ dataViews: [dataView] });
                setTimeout(() => {
                    let tableVisual = <Table>v;
                    let colWidthManager = tableVisual.getColumnWidthManager();
                    let persistedColWidths = colWidthManager.getFixedColumnWidthObjects();

                    // Initially has 1 item
                    expect(Object.getOwnPropertyNames(persistedColWidths).length).toBe(1);
                    expect(persistedColWidths[measureSource2.queryName].isFixed).toBe(true);
                    expect(persistedColWidths[measureSource2.queryName].width).toBe(200);

                    colWidthManager.onColumnWidthChanged(undefined, -1);
                    persistedColWidths = colWidthManager.getFixedColumnWidthObjects();
                    expect(Object.getOwnPropertyNames(persistedColWidths).length).toBe(1);
                    expect(persistedColWidths[measureSource2.queryName].isFixed).toBe(true);
                    expect(persistedColWidths[measureSource2.queryName].width).toBe(200);

                    done();
                }, DefaultWaitForRender);
            });
        });

        it("Change ViewMode allow Header Resize", (done) => {
            let dataViewObjects: DataViewObjects = {
                general: {
                    totals: true,
                    autoSizeColumnWidth: false,
                    textSize: 8,
                }
            };
            let newMeasureSource2: DataViewMetadataColumn = { displayName: "", queryName: undefined, type: dataTypeNumber, isMeasure: true, index: 4, objects: { general: { formatString: "#.00", columnWidth: 45 } } };
            let dataView0: DataView = {
                metadata: {
                    columns: [measureSource1, newMeasureSource2, measureSource3],
                    objects: dataViewObjects
                },
                table: {
                    columns: [measureSource1, newMeasureSource2, measureSource3],
                    rows: [
                        [100, 10100, 102000],
                        [103, 104000, 1050000],
                        [106, 1070000, 10800000]
                    ]
                }
            };
            v.onDataChanged({ dataViews: [dataView0] });
            setTimeout(() => {
                let tableVisual = <Table>v;
                let control = <TablixControl>tableVisual["tablixControl"];
                let layoutManager = control.layoutManager;

                expect(layoutManager["_allowHeaderResize"]).toBe(false);
                let viewMode = powerbi.ViewMode.Edit;
                tableVisual["hostServices"] = <any> {
                    getViewMode: () => { return viewMode; }
                };
                tableVisual.onViewModeChanged(viewMode);

                setTimeout(() => {
                    expect(layoutManager["_allowHeaderResize"]).toBe(true);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });
    });

    describe("Table DOM validation", () => {
        let v: powerbi.IVisual,
            element: JQuery;

        beforeEach(() => {

            groupSource1.index = 0;
            groupSource2.index = 1;
            groupSource3.index = 2;
            measureSource1.index = 3;
            measureSource2.index = 4;
            measureSource3.index = 5;
        });

        beforeEach(() => {
            element = powerbitests.helpers.testDom("500", "500");
            element["visible"] = () => { return true; };
            v = new Table();
            v.init({
                element: element,
                host: powerbitests.mocks.createVisualHostServices(),
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: {
                    selection: true
                }
            });
        });

        function validateSortIcons(expectedValues: string[]): void {
            tablixHelper.validateSortIconClassNames(expectedValues, ".tablixCanvas tr");
        }

        function validateTable(expectedValues: PrimitiveValue[][]): void {
            tablixHelper.validateTable(<string[][]>expectedValues, ".tablixCanvas tr");
        }

        function validateClassNames(expectedValues: string[][]): void {
            tablixHelper.validateClassNames(expectedValues, ".tablixCanvas tr");
        }

        it("resize with autoSizeColumnwidth on", (done) => {
            let selector = ".tablixCanvas tr";
            let dataViewObjects: DataViewObjects = {
                general: {
                    totals: true,
                    autoSizeColumnWidth: true,
                    textSize: 8,
                }
            };
            let dataView: DataView = {
                metadata: {
                    columns: [measureSource1, measureSource2, measureSource3],
                    objects: dataViewObjects
                },
                table: dataViewTableThreeMeasures
            };
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                let rows = $(selector);
                let rowCells = rows.eq(0).find('td');
                expect(rowCells.eq(1).width()).toEqual(64);
                expect(rowCells.eq(2).width()).toEqual(72);
                expect(rowCells.eq(3).width()).toEqual(64);

                // Mock Resize
                let newMeasureSource2 = createColumnWithWidth(measureSource2, 45);
                let dataView2: DataView = {
                    metadata: {
                        columns: [measureSource1, newMeasureSource2, measureSource3],
                        objects: dataViewObjects
                    },
                    table: dataViewTableThreeMeasures
                };
                v.onDataChanged({ dataViews: [dataView2] });
                setTimeout(() => {
                    let newRows = $(selector);
                    let newRowCells = newRows.eq(0).find('td');
                    expect(newRowCells.eq(1).width()).toEqual(64);
                    expect(newRowCells.eq(2).width()).toEqual(45);
                    expect(newRowCells.eq(3).width()).toEqual(64);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it("autoSizeColumnwidth on to off then resize", (done) => {
            let selector = ".tablixCanvas tr";
            let dataView: DataView = {
                metadata: {
                    columns: [measureSource1, measureSource2, measureSource3],
                    objects: tableColumnWidthFalse
                },
                table: dataViewTableThreeMeasures
            };
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                let rows = $(selector);
                let rowCells = rows.eq(0).find('td');
                expect(rowCells.eq(1).width()).toEqual(64);
                expect(rowCells.eq(2).width()).toEqual(72);
                expect(rowCells.eq(3).width()).toEqual(64);

                // Mock Resize
                let newMeasureSource2: DataViewMetadataColumn = { displayName: "measure2", queryName: "measure2", type: dataTypeNumber, isMeasure: true, index: 4, objects: { general: { formatString: "#.00", columnWidth: 45 } } };
                let dataView2: DataView = {
                    metadata: {
                        columns: [measureSource1, newMeasureSource2, measureSource3],
                        objects: tableColumnWidthFalse
                    },
                    table: dataViewTableThreeMeasures
                };
                let tableVisual = <Table>v;

                // Overriding suppress notification. For test purposes the call needs to go through
                // Normally, calling onDataChanged first time with autoSizeColumns OFF triggers a persistAllColumnWidths which triggers another onDataViewChanged
                tableVisual.persistingObjects = false;
                v.onDataChanged({ dataViews: [dataView2] });
                setTimeout(() => {
                    let newRows = $(selector);
                    let newRowCells = newRows.eq(0).find('td');
                    expect(newRowCells.eq(1).width()).toEqual(64);
                    expect(newRowCells.eq(2).width()).toEqual(45);
                    expect(newRowCells.eq(3).width()).toEqual(64);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        it("autoSizeColumnwidth off to on", (done) => {
            let selector = ".tablixCanvas tr";
            let dataViewObjects: DataViewObjects = {
                general: {
                    totals: true,
                    autoSizeColumnWidth: false,
                    textSize: 8,
                }
            };
            let newMeasureSource1 = createColumnWithWidth(measureSource1, 30);
            let newMeasureSource2 = createColumnWithWidth(measureSource2, 45);
            let newMeasureSource3 = createColumnWithWidth(measureSource3, 60);
            let dataView0: DataView = {
                metadata: {
                    columns: [newMeasureSource1, newMeasureSource2, newMeasureSource3],
                    objects: dataViewObjects
                },
                table: dataViewTableThreeMeasures
            };

            // AutoSize property off
            v.onDataChanged({ dataViews: [dataView0] });
            setTimeout(() => {
                let tableVisual = <Table>v;
                let rows = $(selector);
                let rowCells = rows.eq(0).find('td');
                expect(rowCells.eq(1).width()).toEqual(30);
                expect(rowCells.eq(2).width()).toEqual(45);
                expect(rowCells.eq(3).width()).toEqual(60);

                expect(tableVisual.persistingObjects).toBe(false);

                // AutoSize property on
                let dataViewObjects1: DataViewObjects = {
                    general: {
                        totals: true,
                        autoSizeColumnWidth: true,
                        textSize: 8,
                    }
                };
                let dataView1: DataView = {
                    metadata: {
                        columns: [measureSource1, measureSource2, measureSource3],
                        objects: dataViewObjects1
                    },
                    table: dataViewTableThreeMeasures
                };

                v.onDataChanged({ dataViews: [dataView1] });
                setTimeout(() => {
                    let rows = $(selector);
                    let rowCells = rows.eq(0).find('td');
                    expect(rowCells.eq(1).width()).toEqual(64);
                    expect(rowCells.eq(2).width()).toEqual(72);
                    expect(rowCells.eq(3).width()).toEqual(64);
                    done();
                }, DefaultWaitForRender);
            }, DefaultWaitForRender);
        });

        describe('text size', () => {
            describe('default', () => {
                it('font size set on container', (done) => {
                    let newMeasureSource2: DataViewMetadataColumn = {
                        displayName: "measure2",
                        queryName: "measure2",
                        type: dataTypeNumber,
                        isMeasure: true,
                        index: 4,
                        objects: {
                            general: {
                                formatString: "#.00",
                                columnWidth: 45,
                            },
                        },
                    };

                    // AutoSize property off
                    v.onDataChanged({
                        dataViews: [{
                            metadata: {
                                columns: [measureSource1, newMeasureSource2, measureSource3],
                                objects: {
                                    general: {
                                        totals: true,
                                        autoSizeColumnWidth: false,
                                    }
                                }
                            },
                            table: dataViewTableThreeMeasures
                        }]
                    });
                    setTimeout(() => {
                        let actualFontSize = element.find(`${SelectorContainer}`).css('font-size');
                        tablixHelper.validateFontSize(actualFontSize, 8);
                        done();
                    }, DefaultWaitForRender);
                });

                it("2x8 table with default text size row height", (done) => {
                    let dataView = tableTwoGroups;
                    v.onDataChanged({ dataViews: [dataView] });

                    setTimeout(() => {
                        let cells = element.find(`${SelectorHeaderCell}, ${SelectorBodyCell}, ${SelectorBodyCellLast}`);

                        expect(cells.length).toBe(16);
                        tablixHelper.validateCellHeights(cells.slice(0, 1), 16);
                        tablixHelper.validateCellHeights(cells.slice(2), 13);

                        done();
                    }, DefaultWaitForRender);
                });
            });

            describe('specified', () => {
                it('font size set on container', (done) => {
                    let newMeasureSource2: DataViewMetadataColumn = {
                        displayName: "measure2",
                        queryName: "measure2",
                        type: dataTypeNumber,
                        isMeasure: true,
                        index: 4,
                        objects: {
                            general: {
                                formatString: "#.00",
                                columnWidth: 45,
                            },
                        },
                    };

                    // AutoSize property off
                    v.onDataChanged({
                        dataViews: [{
                            metadata: {
                                columns: [measureSource1, newMeasureSource2, measureSource3],
                                objects: {
                                    general: {
                                        totals: true,
                                        autoSizeColumnWidth: false,
                                        textSize: 18,
                                    }
                                }
                            },
                            table: dataViewTableThreeMeasures,
                        }]
                    });
                    setTimeout(() => {
                        let actualFontSize = element.find(`${SelectorContainer}`).css('font-size');
                        tablixHelper.validateFontSize(actualFontSize, 18);
                        done();
                    }, DefaultWaitForRender);
                });

                it("2x8 table with specified text size adjusted row height", (done) => {
                    let dataView = tableTwoGroupsIncreasedFontSize;
                    v.onDataChanged({ dataViews: [dataView] });

                    setTimeout(() => {
                        let cells = element
                            .find(`${SelectorHeaderCell}, ${SelectorBodyCell}, ${SelectorBodyCellLast}`);

                        expect(cells.length).toBe(16);
                        tablixHelper.validateCellHeights(cells, 25);

                        done();
                    }, DefaultWaitForRender);
                });

                it("2x8 table with initial default text size then adjusted one", (done) => {
                    let dataView = tableTwoGroups;
                    v.onDataChanged({ dataViews: [dataView] });
                    setTimeout(() => {
                        let cells = element
                            .find(`${SelectorHeaderCell}, ${SelectorBodyCell}, ${SelectorBodyCellLast}`);

                        expect(cells.length).toBe(16);
                        tablixHelper.validateCellHeights(cells, 15);

                        // Increase font size
                        dataView = tableTwoGroupsIncreasedFontSize;
                        v.onDataChanged({ dataViews: [dataView] });

                        setTimeout(() => {
                            let cells = element
                                .find(`${SelectorHeaderCell}, ${SelectorBodyCell}, ${SelectorBodyCellLast}`);

                            expect(cells.length).toBe(16);
                            tablixHelper.validateCellHeights(cells, 25);

                            done();
                        }, DefaultWaitForRender);
                    }, DefaultWaitForRender);
                });

                it("5x9 table with text size does not crop columns by minimum column width", (done) => {
                    let dataView = tableTwoGroupsThreeMeasuresIncreasedFontSize;
                    measureSource1.index = 2;
                    measureSource2.index = 3;
                    measureSource3.index = 4;

                    v.onDataChanged({ dataViews: [dataView] });

                    setTimeout(() => {
                        // All columns will be visible since this is not dashboard
                        let cellValue1: string = formatter(dataView.table.rows[0][2], measureSource1);
                        let cellValue2: string = formatter(dataView.table.rows[1][2], measureSource1);
                        let cellValue3: string = formatter(dataView.table.rows[2][2], measureSource1);
                        let cellValue4: string = formatter(dataView.table.rows[3][2], measureSource1);
                        let cellValue5: string = formatter(dataView.table.rows[4][2], measureSource1);
                        let cellValue6: string = formatter(dataView.table.rows[5][2], measureSource1);
                        let cellValue7: string = formatter(dataView.table.rows[6][2], measureSource1);
                        let cellValue8: string = formatter(dataView.table.rows[0][3], measureSource2);
                        let cellValue9: string = formatter(dataView.table.rows[1][3], measureSource2);
                        let cellValue10: string = formatter(dataView.table.rows[2][3], measureSource2);
                        let cellValue11: string = formatter(dataView.table.rows[3][3], measureSource2);
                        let cellValue12: string = formatter(dataView.table.rows[4][3], measureSource2);
                        let cellValue13: string = formatter(dataView.table.rows[5][3], measureSource2);
                        let cellValue14: string = formatter(dataView.table.rows[6][3], measureSource2);
                        let cellValue15: string = formatter(dataView.table.rows[0][4], measureSource3);
                        let cellValue16: string = formatter(dataView.table.rows[1][4], measureSource3);
                        let cellValue17: string = formatter(dataView.table.rows[2][4], measureSource3);
                        let cellValue18: string = formatter(dataView.table.rows[3][4], measureSource3);
                        let cellValue19: string = formatter(dataView.table.rows[4][4], measureSource3);
                        let cellValue20: string = formatter(dataView.table.rows[5][4], measureSource3);
                        let cellValue21: string = formatter(dataView.table.rows[6][4], measureSource3);

                        let total1: string = formatter(dataView.table.totals[2], measureSource1);
                        let total2: string = formatter(dataView.table.totals[3], measureSource2);
                        let total3: string = formatter(dataView.table.totals[4], measureSource3);

                        let expectedCells: PrimitiveValue[][] = [
                            [groupSource1.displayName, groupSource2.displayName, measureSource1.displayName, measureSource2.displayName, measureSource3.displayName],
                            [dataView.table.rows[0][0], dataView.table.rows[0][1], cellValue1, cellValue8, cellValue15],
                            [dataView.table.rows[1][0], dataView.table.rows[1][1], cellValue2, cellValue9, cellValue16],
                            [dataView.table.rows[2][0], dataView.table.rows[2][1], cellValue3, cellValue10, cellValue17],
                            [dataView.table.rows[3][0], dataView.table.rows[3][1], cellValue4, cellValue11, cellValue18],
                            [dataView.table.rows[4][0], dataView.table.rows[4][1], cellValue5, cellValue12, cellValue19],
                            [dataView.table.rows[5][0], dataView.table.rows[5][1], cellValue6, cellValue13, cellValue20],
                            [dataView.table.rows[6][0], dataView.table.rows[6][1], cellValue7, cellValue14, cellValue21],
                            ["Total", EmptyHeaderCell, total1, total2, total3]
                        ];

                        validateTable(expectedCells);

                        let expectedClassNames: string[][] = [
                            [ColumnHeaderClassNameIconHidden, ColumnHeaderClassNameIconHidden, ColumnHeaderClassNameIconHidden, ColumnHeaderClassNameIconHidden, ColumnHeaderClassNameIconHidden],
                            [RowClassName, RowClassName, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric],
                            [RowClassName, RowClassName, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric],
                            [RowClassName, RowClassName, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric],
                            [RowClassName, RowClassName, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric],
                            [RowClassName, RowClassName, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric],
                            [RowClassName, RowClassName, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric],
                            [LastRowClassName, LastRowClassName, LastRowClassName + CssClassTablixValueNumeric, LastRowClassName + CssClassTablixValueNumeric, LastRowClassName + CssClassTablixValueNumeric],
                            [FooterClassName, FooterClassName, FooterClassName + CssClassTablixValueNumeric, FooterClassName + CssClassTablixValueNumeric, FooterClassName + CssClassTablixValueNumeric]
                        ];

                        validateClassNames(expectedClassNames);

                        done();
                    }, DefaultWaitForRender);
                });
            });
        });

        it("1x2 table (one measure)", (done) => {

            let dataView = tableOneMeasure;
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {

                let cellValue: string = formatter(dataView.table.rows[0][0], measureSource1);
                let expectedCells: string[][] = [
                    [measureSource1.displayName],
                    [cellValue]
                ];

                validateTable(expectedCells);

                let expectedClassNames: string[][] = [
                    [ColumnHeaderClassNameIconHidden],
                    [LastRowClassName + CssClassTablixValueNumeric]
                ];

                validateClassNames(expectedClassNames);

                done();
            }, DefaultWaitForRender);
        });

        it("1x2 table (one group null)", (done) => {

            let dataView = tableOneGroupNulls;
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                let expectedCells: string[][] = [
                    [groupSource1.displayName],
                    [EmptyHeaderCell],
                    [EmptyHeaderCell]
                ];

                validateTable(expectedCells);
                done();
            }, DefaultWaitForRender);
        });

        it("1x3 table (one group with leading spaces)", (done) => {

            let dataView = tableOneGroupLeadingSpaces;
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                let expectedCells: string[][] = [
                    ["    group1"],
                    ["    A"],
                    ["B"],
                    ["C"]
                ];

                validateTable(expectedCells);
                done();
            }, DefaultWaitForRender);
        });

        it("3x5 table (2 groups 1 measure nulls)", (done) => {

            let dataView = tableTwoGroups1MeasureNulls;
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                let expectedCells: string[][] = [
                    [groupSource1.displayName, groupSource2.displayName, measureSource1.displayName],
                    ["A", "a1", "100.0"],
                    [EmptyHeaderCell, EmptyHeaderCell, "103.0"],
                    [EmptyHeaderCell, "a3", "106.0"],
                    ["B", EmptyHeaderCell, "112.0"],
                    [EmptyHeaderCell, EmptyHeaderCell, EmptyHeaderCell]
                ];

                validateTable(expectedCells);
                done();
            }, DefaultWaitForRender);
        });

        it("1x3 table (group instances)", (done) => {

            let dataView = tableOneGroup;
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {

                let cellValue1: string = formatter(dataView.table.rows[0][0], groupSource1);
                let cellValue2: string = formatter(dataView.table.rows[1][0], groupSource1);
                let cellValue3: string = formatter(dataView.table.rows[2][0], groupSource1);
                let expectedCells: string[][] = [
                    [groupSource1.displayName],
                    [cellValue1],
                    [cellValue2],
                    [cellValue3]
                ];

                validateTable(expectedCells);

                let expectedClassNames: string[][] = [
                    [ColumnHeaderClassNameIconHidden],
                    [RowClassName],
                    [RowClassName],
                    [LastRowClassName]
                ];

                validateClassNames(expectedClassNames);

                done();
            }, DefaultWaitForRender);
        });

        it("2x8 table (group instances)", (done) => {

            let dataView = tableTwoGroups;
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {

                let cellValue1: string = formatter(dataView.table.rows[0][0], groupSource1);
                let cellValue2: string = formatter(dataView.table.rows[1][0], groupSource1);
                let cellValue3: string = formatter(dataView.table.rows[2][0], groupSource1);
                let cellValue4: string = formatter(dataView.table.rows[3][0], groupSource1);
                let cellValue5: string = formatter(dataView.table.rows[4][0], groupSource1);
                let cellValue6: string = formatter(dataView.table.rows[5][0], groupSource1);
                let cellValue7: string = formatter(dataView.table.rows[6][0], groupSource1);
                let cellValue8: string = formatter(dataView.table.rows[0][1], groupSource2);
                let cellValue9: string = formatter(dataView.table.rows[1][1], groupSource2);
                let cellValue10: string = formatter(dataView.table.rows[2][1], groupSource2);
                let cellValue11: string = formatter(dataView.table.rows[3][1], groupSource2);
                let cellValue12: string = formatter(dataView.table.rows[4][1], groupSource2);
                let cellValue13: string = formatter(dataView.table.rows[5][1], groupSource2);
                let cellValue14: string = formatter(dataView.table.rows[6][1], groupSource2);

                let expectedCells: string[][] = [
                    [groupSource1.displayName, groupSource2.displayName],
                    [cellValue1, cellValue8],
                    [cellValue2, cellValue9],
                    [cellValue3, cellValue10],
                    [cellValue4, cellValue11],
                    [cellValue5, cellValue12],
                    [cellValue6, cellValue13],
                    [cellValue7, cellValue14]
                ];

                validateTable(expectedCells);

                done();
            }, DefaultWaitForRender);
        });

        it("5x9 table (group instances and measure values) with totals", (done) => {
            let dataView = tableTwoGroupsThreeMeasures;
            measureSource1.index = 2;
            measureSource2.index = 3;
            measureSource3.index = 4;

            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {

                let cellValue1: string = formatter(dataView.table.rows[0][2], measureSource1);
                let cellValue2: string = formatter(dataView.table.rows[1][2], measureSource1);
                let cellValue3: string = formatter(dataView.table.rows[2][2], measureSource1);
                let cellValue4: string = formatter(dataView.table.rows[3][2], measureSource1);
                let cellValue5: string = formatter(dataView.table.rows[4][2], measureSource1);
                let cellValue6: string = formatter(dataView.table.rows[5][2], measureSource1);
                let cellValue7: string = formatter(dataView.table.rows[6][2], measureSource1);
                let cellValue8: string = formatter(dataView.table.rows[0][3], measureSource2);
                let cellValue9: string = formatter(dataView.table.rows[1][3], measureSource2);
                let cellValue10: string = formatter(dataView.table.rows[2][3], measureSource2);
                let cellValue11: string = formatter(dataView.table.rows[3][3], measureSource2);
                let cellValue12: string = formatter(dataView.table.rows[4][3], measureSource2);
                let cellValue13: string = formatter(dataView.table.rows[5][3], measureSource2);
                let cellValue14: string = formatter(dataView.table.rows[6][3], measureSource2);
                let cellValue15: string = formatter(dataView.table.rows[0][4], measureSource3);
                let cellValue16: string = formatter(dataView.table.rows[1][4], measureSource3);
                let cellValue17: string = formatter(dataView.table.rows[2][4], measureSource3);
                let cellValue18: string = formatter(dataView.table.rows[3][4], measureSource3);
                let cellValue19: string = formatter(dataView.table.rows[4][4], measureSource3);
                let cellValue20: string = formatter(dataView.table.rows[5][4], measureSource3);
                let cellValue21: string = formatter(dataView.table.rows[6][4], measureSource3);

                let total1: string = formatter(dataView.table.totals[2], measureSource1);
                let total2: string = formatter(dataView.table.totals[3], measureSource2);
                let total3: string = formatter(dataView.table.totals[4], measureSource3);

                let expectedCells: PrimitiveValue[][] = [
                    [groupSource1.displayName, groupSource2.displayName, measureSource1.displayName, measureSource2.displayName, measureSource3.displayName],
                    [dataView.table.rows[0][0], dataView.table.rows[0][1], cellValue1, cellValue8, cellValue15],
                    [dataView.table.rows[1][0], dataView.table.rows[1][1], cellValue2, cellValue9, cellValue16],
                    [dataView.table.rows[2][0], dataView.table.rows[2][1], cellValue3, cellValue10, cellValue17],
                    [dataView.table.rows[3][0], dataView.table.rows[3][1], cellValue4, cellValue11, cellValue18],
                    [dataView.table.rows[4][0], dataView.table.rows[4][1], cellValue5, cellValue12, cellValue19],
                    [dataView.table.rows[5][0], dataView.table.rows[5][1], cellValue6, cellValue13, cellValue20],
                    [dataView.table.rows[6][0], dataView.table.rows[6][1], cellValue7, cellValue14, cellValue21],
                    ["Total", EmptyHeaderCell, total1, total2, total3]
                ];

                validateTable(expectedCells);

                let expectedClassNames: string[][] = [
                    [ColumnHeaderClassNameIconHidden, ColumnHeaderClassNameIconHidden, ColumnHeaderClassNameIconHidden, ColumnHeaderClassNameIconHidden, ColumnHeaderClassNameIconHidden],
                    [RowClassName, RowClassName, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric],
                    [RowClassName, RowClassName, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric],
                    [RowClassName, RowClassName, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric],
                    [RowClassName, RowClassName, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric],
                    [RowClassName, RowClassName, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric],
                    [RowClassName, RowClassName, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric],
                    [LastRowClassName, LastRowClassName, LastRowClassName + CssClassTablixValueNumeric, LastRowClassName + CssClassTablixValueNumeric, LastRowClassName + CssClassTablixValueNumeric],
                    [FooterClassName, FooterClassName, FooterClassName + CssClassTablixValueNumeric, FooterClassName + CssClassTablixValueNumeric, FooterClassName + CssClassTablixValueNumeric]
                ];

                validateClassNames(expectedClassNames);

                done();
            }, DefaultWaitForRender);
        });

        it("2x5 table (group instances and measure values) with totals, total value comes first", (done) => {

            let dataView = tableOneMeasureOneGroupSubtotals;
            measureSource1.index = 0;
            groupSource1.index = 1;

            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {

                let cellValue1: string = formatter(dataView.table.rows[0][0], measureSource1);
                let cellValue2: string = formatter(dataView.table.rows[1][0], measureSource1);
                let cellValue3: string = formatter(dataView.table.rows[2][0], measureSource1);

                let total: string = formatter(dataView.table.totals[0], measureSource1);

                let expectedCells: PrimitiveValue[][] = [
                    [measureSource1.displayName, groupSource1.displayName],
                    [cellValue1, dataView.table.rows[0][1]],
                    [cellValue2, dataView.table.rows[1][1]],
                    [cellValue3, dataView.table.rows[2][1]],
                    [total, EmptyHeaderCell]
                ];

                validateTable(expectedCells);

                let expectedClassNames: string[][] = [
                    [ColumnHeaderClassNameIconHidden, ColumnHeaderClassNameIconHidden],
                    [RowClassName + CssClassTablixValueNumeric, RowClassName],
                    [RowClassName + CssClassTablixValueNumeric, RowClassName],
                    [LastRowClassName + CssClassTablixValueNumeric, LastRowClassName],
                    [FooterClassName + CssClassTablixValueNumeric, FooterClassName]
                ];

                validateClassNames(expectedClassNames);

                done();
            }, DefaultWaitForRender);
        });

        it("2x5 table (group instances and measure values) totals on then off", (done) => {

            let dataView = tableOneMeasureOneGroupSubtotals;
            measureSource1.index = 0;
            groupSource1.index = 1;

            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {

                let cellValue1: string = formatter(dataView.table.rows[0][0], measureSource1);
                let cellValue2: string = formatter(dataView.table.rows[1][0], measureSource1);
                let cellValue3: string = formatter(dataView.table.rows[2][0], measureSource1);

                let total: string = formatter(dataView.table.totals[0], measureSource1);

                let expectedCells: PrimitiveValue[][] = [
                    [measureSource1.displayName, groupSource1.displayName],
                    [cellValue1, dataView.table.rows[0][1]],
                    [cellValue2, dataView.table.rows[1][1]],
                    [cellValue3, dataView.table.rows[2][1]],
                    [total, EmptyHeaderCell]
                ];

                validateTable(expectedCells);

                // Now update with totals off
                let dataViewNoTotal = tableOneMeasureOneGroup;

                v.onDataChanged({ dataViews: [dataViewNoTotal] });

                setTimeout(() => {

                    let expectedCellsNoTotal: PrimitiveValue[][] = [
                        [measureSource1.displayName, groupSource1.displayName],
                        [cellValue1, dataViewNoTotal.table.rows[0][1]],
                        [cellValue2, dataViewNoTotal.table.rows[1][1]],
                        [cellValue3, dataViewNoTotal.table.rows[2][1]]
                    ];

                    validateTable(expectedCellsNoTotal);

                    done();
                }, DefaultWaitForRender);

            }, DefaultWaitForRender);
        });

        it("1x3 table (group instances with WebUrl)", (done) => {
            let dataView = tableWebUrl;
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {

                let cellValue1: string = formatter(dataView.table.rows[0][0], groupSourceWebUrl);
                let cellValue2: string = formatter(dataView.table.rows[1][0], groupSourceWebUrl);
                let cellValue3: string = formatter(dataView.table.rows[2][0], groupSourceWebUrl);
                let expectedCells: string[][] = [
                    [groupSourceWebUrl.displayName],
                    [cellValue1],
                    [cellValue2],
                    [cellValue3]
                ];

                validateTable(expectedCells);

                let expectedClassNames: string[][] = [
                    [ColumnHeaderClassNameIconHidden],
                    [RowClassName],
                    [RowClassName],
                    [LastRowClassName]
                ];

                validateClassNames(expectedClassNames);

                let expectedChildTags: string[][] = [
                    [undefined],
                    ["A"],
                    [undefined],
                    ["A"]
                ];

                validateChildTag(expectedChildTags, $(".tablixCanvas tr"));

                done();
            }, DefaultWaitForRender);
        });

        it("1x3 table (group instances with Kpi)", (done) => {
            let dataView = tableKpi;
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                let expectedCells: string[][] = [
                    [groupSourceKpiStatus.displayName],
                    [""],
                    [""],
                    [""]
                ];

                validateTable(expectedCells);

                let expectedClassNames: string[][] = [
                    [ColumnHeaderClassNameIconHidden],
                    [RowClassName],
                    [RowClassName],
                    [LastRowClassName]
                ];

                validateClassNames(expectedClassNames);

                let expectedChildTags: string[][] = [
                    [undefined],
                    [".powervisuals-glyph.circle.kpi-red"],
                    [".powervisuals-glyph.circle.kpi-yellow"],
                    [".powervisuals-glyph.circle.kpi-green"],
                ];

                validateChildTag(expectedChildTags, $(".tablixCanvas tr"));

                done();
            }, DefaultWaitForRender);
        });

        it("1x1 table loadMoreData", (done) => {

            let dataView: DataView = {
                metadata: { columns: [groupSource1], segment: {} },
                table: {
                    columns: [groupSource1],
                    rows: [
                        ["A"],
                        ["B"],
                        ["C"]
                    ]
                }
            };

            v.onDataChanged({
                dataViews: [dataView]
            });

            let segment2: DataView = {
                metadata: { columns: [groupSource1] },
                table: {
                    columns: [groupSource1],
                    rows: [
                        ["D"],
                        ["E"]
                    ]
                }
            };

            // Simulate a load more merge
            powerbi.data.segmentation.DataViewMerger.mergeTables(dataView.table, segment2.table);
            v.onDataChanged({
                dataViews: [dataView],
                operationKind: powerbi.VisualDataChangeOperationKind.Append
            });

            setTimeout(() => {

                let cellValue1: string = formatter(dataView.table.rows[0][0], groupSource1);
                let cellValue2: string = formatter(dataView.table.rows[1][0], groupSource1);
                let cellValue3: string = formatter(dataView.table.rows[2][0], groupSource1);
                let cellValue4: string = formatter(dataView.table.rows[3][0], groupSource1);
                let cellValue5: string = formatter(dataView.table.rows[4][0], groupSource1);
                let expectedCells: string[][] = [
                    [groupSource1.displayName],
                    [cellValue1],
                    [cellValue2],
                    [cellValue3],
                    [cellValue4],
                    [cellValue5]
                ];

                validateTable(expectedCells);

                done();
            }, DefaultWaitForRender);
        });

        it("2x5 table reorder loadMoreData", (done) => {

            let dataView: DataView = {
                metadata: { columns: [groupSource1, groupSource2], segment: {} },
                table: {
                    columns: [groupSource1, groupSource2],
                    rows: [
                        ["A", "1"],
                        ["B", "2"],
                        ["C", "3"]
                    ]
                }
            };

            v.onDataChanged({
                dataViews: [dataView]
            });

            // Simulate column reordering
            v.onDataChanged({ dataViews: [applyTransform(dataView)] });

            let segment2: DataView = {
                metadata: { columns: [groupSource1] },
                table: {
                    columns: [groupSource1],
                    rows: [
                        ["D", "4"],
                        ["E", "5"]
                    ]
                }
            };

            // Simulate a load more merge
            powerbi.data.segmentation.DataViewMerger.mergeTables(dataView.table, segment2.table);

            v.onDataChanged({
                dataViews: [applyTransform(dataView)],
                operationKind: powerbi.VisualDataChangeOperationKind.Append
            });

            setTimeout(() => {

                let expectedCells: string[][] = [
                    [groupSource2.displayName, groupSource1.displayName],
                    ["1", "A"],
                    ["2", "B"],
                    ["3", "C"],
                    ["4", "D"],
                    ["5", "E"]
                ];

                validateTable(expectedCells);

                done();
            }, DefaultWaitForRender);
        });

        it("header sort arrow down", (done) => {
            let dataView = tableOneMeasurSortDescending;
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                let expectedCells: string[] =
                    ['tablixSortIconContainer sorted powervisuals-glyph caret-down', 'tablixSortIconContainer future powervisuals-glyph caret-up'];

                validateSortIcons(expectedCells);
                done();
            }, DefaultWaitForRender);
        });

        it("header sort arrow up", (done) => {

            let dataView = tableOneMeasurSortAscending;
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                let expectedCells: string[] =
                    ['tablixSortIconContainer sorted powervisuals-glyph caret-up', 'tablixSortIconContainer future powervisuals-glyph caret-down'];

                validateSortIcons(expectedCells);
                done();
            }, DefaultWaitForRender);
        });

        it("ensure table elements have tooltip", (done) => {

            let dataView = tableWithLongText;
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {
                //Validate Column Headers title
                tablixHelper.validateTableColumnHeaderTooltip(SelectorHeaderCell, dataView);

                //Validate Items Title
                for (let i = 0; i < dataView.table.rows.length - 1; i++) {
                    tablixHelper.validateTableRowTooltip(SelectorBodyCell, dataView, i);
                }

                //Validate last row and title
                tablixHelper.validateTableRowTooltip(SelectorBodyCellLast, dataView, dataView.table.rows.length - 1);

                //Validate row footer tooltip
                tablixHelper.validateTableRowFooterTooltip(SelectorFooterCell, dataView, dataView.table.rows.length);

                done();
            }, DefaultWaitForRender);
        });

        function applyTransform(dataView: DataView): DataView {
            let transforms: powerbi.data.DataViewTransformActions = {
                selects: [
                    {
                        displayName: groupSource1.displayName,
                        type: powerbi.ValueType.fromDescriptor({ text: true })
                    }, {
                        displayName: groupSource2.displayName,
                        type: powerbi.ValueType.fromDescriptor({ text: true })
                    }
                ],
                roles: {
                    ordering: {
                        Values: [1, 0]
                    }
                }
            };

            let transformedDataView = powerbi.data.DataViewTransform.apply(
                {
                    prototype: dataView,
                    objectDescriptors: null,
                    transforms: transforms,
                    dataViewMappings: powerbi.visuals.tableCapabilities.dataViewMappings,
                    colorAllocatorFactory: powerbi.visuals.createColorAllocatorFactory(),
                    dataRoles: powerbi.visuals.tableCapabilities.dataRoles,
                })[0];

            return transformedDataView;
        }

    });

    describe("Dashboard table DOM validation", () => {
        let v: powerbi.IVisual,
            element: JQuery,
            SelectorContainer = '.tablixDashboard',
            host = powerbitests.mocks.createVisualHostServices();

        beforeEach(() => {

            groupSource1.index = 0;
            groupSource2.index = 1;
            groupSource3.index = 2;
            measureSource1.index = 3;
            measureSource2.index = 4;
            measureSource3.index = 5;
        });

        beforeEach(() => {
            element = powerbitests.helpers.testDom("500", "500");
            element["visible"] = () => { return false; };
            v = new powerbi.visuals.Table();
            v.init({
                element: element,
                host: host,
                style: powerbi.visuals.visualStyles.create(),
                viewport: {
                    height: element.height(),
                    width: element.width()
                },
                animation: { transitionImmediate: true },
                interactivity: {
                    selection: null
                }
            });
        });

        function validateTable(expectedValues: PrimitiveValue[][]): void {
            tablixHelper.validateTable(<string[][]>expectedValues, ".tablixDashboard tr");
        }

        function validateClassNames(expectedValues: string[][]): void {
            tablixHelper.validateClassNames(expectedValues, ".tablixDashboard tr");
        }

        describe('text size', () => {
            describe('default', () => {
                it('font size set on container', (done) => {
                    let newMeasureSource2: DataViewMetadataColumn = {
                        displayName: "measure2",
                        queryName: "measure2",
                        type: dataTypeNumber,
                        isMeasure: true,
                        index: 4,
                        objects: {
                            general: {
                                formatString: "#.00",
                                columnWidth: 45,
                            },
                        },
                    };

                    // AutoSize property off
                    v.onDataChanged({
                        dataViews: [{
                            metadata: {
                                columns: [measureSource1, newMeasureSource2, measureSource3],
                                objects: {
                                    general: {
                                        totals: true,
                                        autoSizeColumnWidth: false,
                                    }
                                }
                            },
                            table: dataViewTableThreeMeasures
                        }]
                    });
                    setTimeout(() => {
                        let actualFontSize = element.find(`${SelectorContainer}`).css('font-size');
                        tablixHelper.validateFontSize(actualFontSize, 8);
                        done();
                    }, DefaultWaitForRender);
                });

                it("2x8 table with default text size row height", (done) => {
                    let dataView = tableTwoGroups;
                    v.onDataChanged({ dataViews: [dataView] });

                    setTimeout(() => {
                        let cells = element
                            .find(`${SelectorHeaderCell}, ${SelectorBodyCell}, ${SelectorBodyCellLast}`);

                        expect(cells.length).toBe(16);
                        tablixHelper.validateCellHeights(cells, 14);

                        done();
                    }, DefaultWaitForRender);
                });
            });

            describe('specified', () => {
                it('font size set on container', (done) => {
                    let newMeasureSource2: DataViewMetadataColumn = {
                        displayName: "measure2",
                        queryName: "measure2",
                        type: dataTypeNumber,
                        isMeasure: true,
                        index: 4,
                        objects: {
                            general: {
                                formatString: "#.00",
                                columnWidth: 45,
                            },
                        },
                    };

                    // AutoSize property off
                    v.onDataChanged({
                        dataViews: [{
                            metadata: {
                                columns: [measureSource1, newMeasureSource2, measureSource3],
                                objects: {
                                    general: {
                                        totals: true,
                                        autoSizeColumnWidth: false,
                                        textSize: 18,
                                    }
                                }
                            },
                            table: dataViewTableThreeMeasures,
                        }]
                    });
                    setTimeout(() => {
                        let actualFontSize = element.find(`${SelectorContainer}`).css('font-size');
                        tablixHelper.validateFontSize(actualFontSize, 18);
                        done();
                    }, DefaultWaitForRender);
                });

                it("2x8 table with specified text size adjusted row height", (done) => {
                    let dataView = tableTwoGroupsIncreasedFontSize;
                    v.onDataChanged({ dataViews: [dataView] });

                    setTimeout(() => {
                        let cells = element
                            .find(`${SelectorHeaderCell}, ${SelectorBodyCell}, ${SelectorBodyCellLast}`);

                        expect(cells.length).toBe(16);
                        tablixHelper.validateCellHeights(cells, 21);

                        done();
                    }, DefaultWaitForRender);
                });

                it("5x9 table with text size scaling factor adjusts minimum column width", (done) => {
                    let dataView = tableTwoGroupsThreeMeasuresIncreasedFontSize;
                    measureSource1.index = 2;
                    measureSource2.index = 3;
                    measureSource3.index = 4;

                    v.onDataChanged({ dataViews: [dataView] });

                    setTimeout(() => {
                        // Dashboard crops out columns which do not fit (minimum width based on text size)
                        let cellValue1: string = formatter(dataView.table.rows[0][2], measureSource1);
                        let cellValue2: string = formatter(dataView.table.rows[1][2], measureSource1);
                        let cellValue3: string = formatter(dataView.table.rows[2][2], measureSource1);
                        let cellValue4: string = formatter(dataView.table.rows[3][2], measureSource1);
                        let cellValue5: string = formatter(dataView.table.rows[4][2], measureSource1);
                        let cellValue6: string = formatter(dataView.table.rows[5][2], measureSource1);
                        let cellValue7: string = formatter(dataView.table.rows[6][2], measureSource1);
                        let cellValue8: string = formatter(dataView.table.rows[0][3], measureSource2);
                        let cellValue9: string = formatter(dataView.table.rows[1][3], measureSource2);
                        let cellValue10: string = formatter(dataView.table.rows[2][3], measureSource2);
                        let cellValue11: string = formatter(dataView.table.rows[3][3], measureSource2);
                        let cellValue12: string = formatter(dataView.table.rows[4][3], measureSource2);
                        let cellValue13: string = formatter(dataView.table.rows[5][3], measureSource2);
                        let cellValue14: string = formatter(dataView.table.rows[6][3], measureSource2);

                        let total1: string = formatter(dataView.table.totals[2], measureSource1);
                        let total2: string = formatter(dataView.table.totals[3], measureSource2);

                        let expectedCells: PrimitiveValue[][] = [
                            [groupSource1.displayName, groupSource2.displayName, measureSource1.displayName, measureSource2.displayName],
                            [dataView.table.rows[0][0], dataView.table.rows[0][1], cellValue1, cellValue8],
                            [dataView.table.rows[1][0], dataView.table.rows[1][1], cellValue2, cellValue9],
                            [dataView.table.rows[2][0], dataView.table.rows[2][1], cellValue3, cellValue10],
                            [dataView.table.rows[3][0], dataView.table.rows[3][1], cellValue4, cellValue11],
                            [dataView.table.rows[4][0], dataView.table.rows[4][1], cellValue5, cellValue12],
                            [dataView.table.rows[5][0], dataView.table.rows[5][1], cellValue6, cellValue13],
                            [dataView.table.rows[6][0], dataView.table.rows[6][1], cellValue7, cellValue14],
                            ["Total", EmptyHeaderCell, total1, total2],
                        ];

                        validateTable(expectedCells);

                        let expectedClassNames: string[][] = [
                            [ColumnHeaderClassNameIconHidden, ColumnHeaderClassNameIconHidden, ColumnHeaderClassNameIconHidden, ColumnHeaderClassNameIconHidden],
                            [RowClassName, RowClassName, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric],
                            [RowClassName, RowClassName, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric],
                            [RowClassName, RowClassName, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric],
                            [RowClassName, RowClassName, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric],
                            [RowClassName, RowClassName, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric],
                            [RowClassName, RowClassName, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric],
                            [LastRowClassName, LastRowClassName, LastRowClassName + CssClassTablixValueNumeric, LastRowClassName + CssClassTablixValueNumeric],
                            [FooterClassName, FooterClassName, FooterClassName + CssClassTablixValueNumeric, FooterClassName + CssClassTablixValueNumeric],
                        ];

                        validateClassNames(expectedClassNames);

                        done();
                    }, DefaultWaitForRender);
                });
            });
        });

        it("1x2 table (one measure)", (done) => {
            v.onDataChanged({ dataViews: [tableOneMeasure] });

            setTimeout(() => {

                let cellValue: string = formatter(tableOneMeasure.table.rows[0][0], measureSource1);
                let expectedCells: string[][] = [
                    [measureSource1.displayName],
                    [cellValue]
                ];

                validateTable(expectedCells);

                let expectedClassNames: string[][] = [
                    [ColumnHeaderClassNameIconHidden],
                    [LastRowClassName + CssClassTablixValueNumeric]
                ];

                validateClassNames(expectedClassNames);

                done();
            }, DefaultWaitForRender);
        });

        it("1x2 table (one group null)", (done) => {
            v.onDataChanged({ dataViews: [tableOneGroupNulls] });

            setTimeout(() => {
                let expectedCells: string[][] = [
                    [groupSource1.displayName],
                    [EmptyHeaderCell],
                    [EmptyHeaderCell]
                ];

                validateTable(expectedCells);
                done();
            }, DefaultWaitForRender);
        });

        it("3x5 table (2 groups 1 measure nulls)", (done) => {
            v.onDataChanged({ dataViews: [tableTwoGroups1MeasureNulls] });

            setTimeout(() => {
                let expectedCells: string[][] = [
                    [groupSource1.displayName, groupSource2.displayName, measureSource1.displayName],
                    ["A", "a1", "100.0"],
                    [EmptyHeaderCell, EmptyHeaderCell, "103.0"],
                    [EmptyHeaderCell, "a3", "106.0"],
                    ["B", EmptyHeaderCell, "112.0"],
                    [EmptyHeaderCell, EmptyHeaderCell, EmptyHeaderCell]
                ];

                validateTable(expectedCells);
                done();
            }, DefaultWaitForRender);
        });

        it("1x3 table (group instances)", (done) => {

            let dataView = tableOneGroup;
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {

                let cellValue1: string = formatter(dataView.table.rows[0][0], groupSource1);
                let cellValue2: string = formatter(dataView.table.rows[1][0], groupSource1);
                let cellValue3: string = formatter(dataView.table.rows[2][0], groupSource1);
                let expectedCells: string[][] = [
                    [groupSource1.displayName],
                    [cellValue1],
                    [cellValue2],
                    [cellValue3]
                ];

                validateTable(expectedCells);

                let expectedClassNames: string[][] = [
                    [ColumnHeaderClassNameIconHidden],
                    [RowClassName],
                    [RowClassName],
                    [LastRowClassName]
                ];

                validateClassNames(expectedClassNames);

                done();
            }, DefaultWaitForRender);
        });

        it("2x8 table (group instances)", (done) => {

            let dataView = tableTwoGroups;
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {

                let cellValue1: string = formatter(dataView.table.rows[0][0], groupSource1);
                let cellValue2: string = formatter(dataView.table.rows[1][0], groupSource1);
                let cellValue3: string = formatter(dataView.table.rows[2][0], groupSource1);
                let cellValue4: string = formatter(dataView.table.rows[3][0], groupSource1);
                let cellValue5: string = formatter(dataView.table.rows[4][0], groupSource1);
                let cellValue6: string = formatter(dataView.table.rows[5][0], groupSource1);
                let cellValue7: string = formatter(dataView.table.rows[6][0], groupSource1);
                let cellValue8: string = formatter(dataView.table.rows[0][1], groupSource2);
                let cellValue9: string = formatter(dataView.table.rows[1][1], groupSource2);
                let cellValue10: string = formatter(dataView.table.rows[2][1], groupSource2);
                let cellValue11: string = formatter(dataView.table.rows[3][1], groupSource2);
                let cellValue12: string = formatter(dataView.table.rows[4][1], groupSource2);
                let cellValue13: string = formatter(dataView.table.rows[5][1], groupSource2);
                let cellValue14: string = formatter(dataView.table.rows[6][1], groupSource2);

                let expectedCells: string[][] = [
                    [groupSource1.displayName, groupSource2.displayName],
                    [cellValue1, cellValue8],
                    [cellValue2, cellValue9],
                    [cellValue3, cellValue10],
                    [cellValue4, cellValue11],
                    [cellValue5, cellValue12],
                    [cellValue6, cellValue13],
                    [cellValue7, cellValue14]
                ];

                validateTable(expectedCells);

                done();
            }, DefaultWaitForRender);
        });

        it("5x9 table (group instances and measure values) with totals", (done) => {

            let dataView = tableTwoGroupsThreeMeasures;
            measureSource1.index = 2;
            measureSource2.index = 3;
            measureSource3.index = 4;

            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {

                let cellValue1: string = formatter(dataView.table.rows[0][2], measureSource1);
                let cellValue2: string = formatter(dataView.table.rows[1][2], measureSource1);
                let cellValue3: string = formatter(dataView.table.rows[2][2], measureSource1);
                let cellValue4: string = formatter(dataView.table.rows[3][2], measureSource1);
                let cellValue5: string = formatter(dataView.table.rows[4][2], measureSource1);
                let cellValue6: string = formatter(dataView.table.rows[5][2], measureSource1);
                let cellValue7: string = formatter(dataView.table.rows[6][2], measureSource1);
                let cellValue8: string = formatter(dataView.table.rows[0][3], measureSource2);
                let cellValue9: string = formatter(dataView.table.rows[1][3], measureSource2);
                let cellValue10: string = formatter(dataView.table.rows[2][3], measureSource2);
                let cellValue11: string = formatter(dataView.table.rows[3][3], measureSource2);
                let cellValue12: string = formatter(dataView.table.rows[4][3], measureSource2);
                let cellValue13: string = formatter(dataView.table.rows[5][3], measureSource2);
                let cellValue14: string = formatter(dataView.table.rows[6][3], measureSource2);
                let cellValue15: string = formatter(dataView.table.rows[0][4], measureSource3);
                let cellValue16: string = formatter(dataView.table.rows[1][4], measureSource3);
                let cellValue17: string = formatter(dataView.table.rows[2][4], measureSource3);
                let cellValue18: string = formatter(dataView.table.rows[3][4], measureSource3);
                let cellValue19: string = formatter(dataView.table.rows[4][4], measureSource3);
                let cellValue20: string = formatter(dataView.table.rows[5][4], measureSource3);
                let cellValue21: string = formatter(dataView.table.rows[6][4], measureSource3);

                let total1: string = formatter(dataView.table.totals[2], measureSource1);
                let total2: string = formatter(dataView.table.totals[3], measureSource2);
                let total3: string = formatter(dataView.table.totals[4], measureSource3);

                let expectedCells: PrimitiveValue[][] = [
                    [groupSource1.displayName, groupSource2.displayName, measureSource1.displayName, measureSource2.displayName, measureSource3.displayName],
                    [dataView.table.rows[0][0], dataView.table.rows[0][1], cellValue1, cellValue8, cellValue15],
                    [dataView.table.rows[1][0], dataView.table.rows[1][1], cellValue2, cellValue9, cellValue16],
                    [dataView.table.rows[2][0], dataView.table.rows[2][1], cellValue3, cellValue10, cellValue17],
                    [dataView.table.rows[3][0], dataView.table.rows[3][1], cellValue4, cellValue11, cellValue18],
                    [dataView.table.rows[4][0], dataView.table.rows[4][1], cellValue5, cellValue12, cellValue19],
                    [dataView.table.rows[5][0], dataView.table.rows[5][1], cellValue6, cellValue13, cellValue20],
                    [dataView.table.rows[6][0], dataView.table.rows[6][1], cellValue7, cellValue14, cellValue21],
                    ["Total", EmptyHeaderCell, total1, total2, total3]
                ];

                validateTable(expectedCells);

                let expectedClassNames: string[][] = [
                    [ColumnHeaderClassNameIconHidden, ColumnHeaderClassNameIconHidden, ColumnHeaderClassNameIconHidden, ColumnHeaderClassNameIconHidden, ColumnHeaderClassNameIconHidden],
                    [RowClassName, RowClassName, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric],
                    [RowClassName, RowClassName, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric],
                    [RowClassName, RowClassName, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric],
                    [RowClassName, RowClassName, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric],
                    [RowClassName, RowClassName, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric],
                    [RowClassName, RowClassName, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric, RowClassName + CssClassTablixValueNumeric],
                    [LastRowClassName, LastRowClassName, LastRowClassName + CssClassTablixValueNumeric, LastRowClassName + CssClassTablixValueNumeric, LastRowClassName + CssClassTablixValueNumeric],
                    [FooterClassName, FooterClassName, FooterClassName + CssClassTablixValueNumeric, FooterClassName + CssClassTablixValueNumeric, FooterClassName + CssClassTablixValueNumeric]
                ];

                validateClassNames(expectedClassNames);

                done();
            }, DefaultWaitForRender);
        });

        it("2x5 table (group instances and measure values) with totals, total value comes first", (done) => {

            let dataView = tableOneMeasureOneGroupSubtotals;
            measureSource1.index = 0;
            groupSource1.index = 1;

            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {

                let cellValue1: string = formatter(dataView.table.rows[0][0], measureSource1);
                let cellValue2: string = formatter(dataView.table.rows[1][0], measureSource1);
                let cellValue3: string = formatter(dataView.table.rows[2][0], measureSource1);

                let total: string = formatter(dataView.table.totals[0], measureSource1);

                let expectedCells: PrimitiveValue[][] = [
                    [measureSource1.displayName, groupSource1.displayName],
                    [cellValue1, dataView.table.rows[0][1]],
                    [cellValue2, dataView.table.rows[1][1]],
                    [cellValue3, dataView.table.rows[2][1]],
                    [total, EmptyHeaderCell]
                ];

                validateTable(expectedCells);

                let expectedClassNames: string[][] = [
                    [ColumnHeaderClassNameIconHidden, ColumnHeaderClassNameIconHidden],
                    [RowClassName + CssClassTablixValueNumeric, RowClassName],
                    [RowClassName + CssClassTablixValueNumeric, RowClassName],
                    [LastRowClassName + CssClassTablixValueNumeric, LastRowClassName],
                    [FooterClassName + CssClassTablixValueNumeric, FooterClassName]
                ];

                validateClassNames(expectedClassNames);

                done();
            }, DefaultWaitForRender);
        });

        it("2x5 table (group instances and measure values) totals on then off", (done) => {

            let dataView = tableOneMeasureOneGroupSubtotals;
            measureSource1.index = 0;
            groupSource1.index = 1;

            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {

                let cellValue1: string = formatter(dataView.table.rows[0][0], measureSource1);
                let cellValue2: string = formatter(dataView.table.rows[1][0], measureSource1);
                let cellValue3: string = formatter(dataView.table.rows[2][0], measureSource1);

                let total: string = formatter(dataView.table.totals[0], measureSource1);

                let expectedCells: PrimitiveValue[][] = [
                    [measureSource1.displayName, groupSource1.displayName],
                    [cellValue1, dataView.table.rows[0][1]],
                    [cellValue2, dataView.table.rows[1][1]],
                    [cellValue3, dataView.table.rows[2][1]],
                    [total, EmptyHeaderCell]
                ];

                validateTable(expectedCells);

                // Now update with totals off
                let dataViewNoTotal = tableOneMeasureOneGroup;

                v.onDataChanged({ dataViews: [dataViewNoTotal] });

                setTimeout(() => {

                    let expectedCellsNoTotal: PrimitiveValue[][] = [
                        [measureSource1.displayName, groupSource1.displayName],
                        [cellValue1, dataViewNoTotal.table.rows[0][1]],
                        [cellValue2, dataViewNoTotal.table.rows[1][1]],
                        [cellValue3, dataViewNoTotal.table.rows[2][1]]
                    ];

                    validateTable(expectedCellsNoTotal);

                    done();
                }, DefaultWaitForRender);

            }, DefaultWaitForRender);
        });

        it("1x3 table (group instances with WebUrl)", (done) => {
            let dataView = tableWebUrl;
            v.onDataChanged({ dataViews: [dataView] });

            setTimeout(() => {

                let cellValue1: string = formatter(dataView.table.rows[0][0], groupSourceWebUrl);
                let cellValue2: string = formatter(dataView.table.rows[1][0], groupSourceWebUrl);
                let cellValue3: string = formatter(dataView.table.rows[2][0], groupSourceWebUrl);
                let expectedCells: string[][] = [
                    [groupSourceWebUrl.displayName],
                    [cellValue1],
                    [cellValue2],
                    [cellValue3]
                ];

                validateTable(expectedCells);

                let expectedClassNames: string[][] = [
                    [ColumnHeaderClassNameIconHidden],
                    [RowClassName],
                    [RowClassName],
                    [LastRowClassName]
                ];

                validateClassNames(expectedClassNames);

                let expectedChildTags: string[][] = [
                    [undefined],
                    ["A"],
                    [undefined],
                    ["A"]
                ];

                validateChildTag(expectedChildTags, $(".tablixDashboard tr"));

                done();
            }, DefaultWaitForRender);
        });

        it("dashboard table has no sort icons", (done) => {
            let dataView = tableOneMeasurSortAscending;
            v.onDataChanged({ dataViews: [dataView] });
            setTimeout(() => {
                let sortIcons = element.find(".caret-down, .caret-up");
                expect(sortIcons.length).toEqual(0);
                done();
            }, DefaultWaitForRender);
        });
    });

    describe("Table sort validation", () => {
        let element: JQuery;

        beforeEach((done) => {
            element = powerbitests.helpers.testDom("800", "800");
            element["visible"] = () => { return true; };
            done();
        });

        it("table with single measure", (done) => {
            // Clicking on the measure will result in a sort event
            let data: DataView = tableOneMeasure;
            let expectedColumnHeaders = [{ row: 0, col: 1, expectedText: "measure1" }];
            let clicks = [{ row: 0, col: 1 }, { row: 1, col: 1 }];
            let expectedSorts = [
                [{ queryName: "measure1", sortDirection: powerbi.SortDirection.Descending }]
            ];
            tablixHelper.runTablixSortTest(element, done, "table", data, expectedColumnHeaders, clicks, expectedSorts);
        });

        it("table with single group", (done) => {
            // Clicking on the group header multiple times will result in multiple sort events.
            // Clicking on non-header cells will not result in sort events.
            let data: DataView = tableOneGroup;
            let expectedColumnHeaders = [{ row: 0, col: 1, expectedText: "group1" }];
            let clicks = [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }, { row: 0, col: 1 }];
            let expectedSorts = [
                [{ queryName: "group1", sortDirection: powerbi.SortDirection.Descending }], [{ queryName: "group1", sortDirection: powerbi.SortDirection.Descending }]
            ];
            tablixHelper.runTablixSortTest(element, done, "table", data, expectedColumnHeaders, clicks, expectedSorts);
        });

        it("table with two groups", (done) => {
            // Clicking on different group headers multiple times results in a sort event for each click
            let data: DataView = tableTwoGroups;
            let expectedColumnHeaders = [{ row: 0, col: 1, expectedText: "group1" }, { row: 0, col: 2, expectedText: "group2" }];
            let clicks = [{ row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 1 }, { row: 0, col: 2 }];
            let expectedSorts = [
                [{ queryName: "group1", sortDirection: powerbi.SortDirection.Descending }], [{ queryName: "group2", sortDirection: powerbi.SortDirection.Descending }], [{ queryName: "group1", sortDirection: powerbi.SortDirection.Descending }], [{ queryName: "group2", sortDirection: powerbi.SortDirection.Descending }]
            ];
            tablixHelper.runTablixSortTest(element, done, "table", data, expectedColumnHeaders, clicks, expectedSorts);
        });

        it("table with two groups and three measures", (done) => {
            // Clicking on different group headers multiple times results in a sort event for each click
            let data: DataView = tableTwoGroupsThreeMeasures;
            let expectedColumnHeaders = [{ row: 0, col: 1, expectedText: "group1" }, { row: 0, col: 2, expectedText: "group2" }, { row: 0, col: 3, expectedText: "measure1" }, { row: 0, col: 4, expectedText: "measure2" }, { row: 0, col: 5, expectedText: "measure3" }];
            let clicks = [{ row: 0, col: 5 }, { row: 0, col: 2 }, { row: 0, col: 4 }, { row: 0, col: 1 }, { row: 0, col: 3 }, { row: 0, col: 1 }, { row: 0, col: 5 }];
            let expectedSorts = [
                [{ queryName: "measure3", sortDirection: powerbi.SortDirection.Descending }], [{ queryName: "group2", sortDirection: powerbi.SortDirection.Descending }], [{ queryName: "measure2", sortDirection: powerbi.SortDirection.Descending }], [{ queryName: "group1", sortDirection: powerbi.SortDirection.Descending }], [{ queryName: "measure1", sortDirection: powerbi.SortDirection.Descending }], [{ queryName: "group1", sortDirection: powerbi.SortDirection.Descending }], [{ queryName: "measure3", sortDirection: powerbi.SortDirection.Descending }]
            ];
            tablixHelper.runTablixSortTest(element, done, "table", data, expectedColumnHeaders, clicks, expectedSorts);
        });
    });

    function formatter(value: any, source: DataViewMetadataColumn): string {
        return valueFormatter.formatVariantMeasureValue(value, source, TablixObjects.PropColumnFormatString);
    }

    function validateChildTag(expectedChildTag: string[][], rows: JQuery): void {
        let result: string[][] = [];

        for (let i = 0, ilen = rows.length; i < ilen; i++) {
            result[i] = [];
            let cells = rows.eq(i).find(".tablixCellContentHost");
            for (let j = 0, jlen = cells.length; j < jlen; j++) {
                let childTag = expectedChildTag[i][j];
                if (childTag) {
                    let child = cells.eq(j).find(childTag);
                    if (child.length > 0)
                        result[i][j] = childTag;
                    else
                        result[i][j] = undefined;
                }
                else
                    result[i][j] = undefined;
            }
        }

        expect(result).toEqual(expectedChildTag);
    }

    function createColumnWithWidth(src: DataViewMetadataColumn, width: number): DataViewMetadataColumn {
        let column = powerbi.Prototype.inheritSingle(src);
        column.objects = { general: { columnWidth: width } };

        return column;
    }

    interface TableColumn {
        title: string;
        width: number;
    }
}
