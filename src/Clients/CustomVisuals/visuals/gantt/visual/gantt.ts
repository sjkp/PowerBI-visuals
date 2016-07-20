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

/// <reference path="../../../_references.ts"/>

module powerbi.visuals.samples {
    import PixelConverter = jsCommon.PixelConverter;
    import IStringResourceProvider = jsCommon.IStringResourceProvider;
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;
    import CreateClassAndSelector = jsCommon.CssConstants.createClassAndSelector;
    import SelectionManager = powerbi.visuals.utility.SelectionManager;
    import IEnumType = powerbi.IEnumType;
    import createEnumType = powerbi.createEnumType;
    import IEnumMember = powerbi.IEnumMember;
    import SelectableDataPoint = powerbi.visuals.SelectableDataPoint;
    import TooltipDataItem = powerbi.visuals.TooltipDataItem;
    import IValueFormatter = powerbi.visuals.IValueFormatter;
    import LegendData = powerbi.visuals.LegendData;
    import IVisual = powerbi.IVisual;
    import IViewport = powerbi.IViewport;
    import IDataColorPalette = powerbi.IDataColorPalette;
    import ILegend = powerbi.visuals.ILegend;
    import TextProperties = powerbi.TextProperties;
    import legendPosition = powerbi.visuals.legendPosition;
    import VisualCapabilities = powerbi.VisualCapabilities;
    import VisualDataRoleKind = powerbi.VisualDataRoleKind;
    import createDisplayNameGetter = powerbi.data.createDisplayNameGetter;
    import DataViewObjectPropertyIdentifier = powerbi.DataViewObjectPropertyIdentifier;
    import IMargin = powerbi.visuals.IMargin;
    import IVisualStyle = powerbi.IVisualStyle;
    import IInteractivityService = powerbi.visuals.IInteractivityService;
    import IVisualHostServices = powerbi.IVisualHostServices;
    import VisualInitOptions = powerbi.VisualInitOptions;
    import createInteractivityService = powerbi.visuals.createInteractivityService;
    import appendClearCatcher = powerbi.visuals.appendClearCatcher;
    import createLegend = powerbi.visuals.createLegend;
    import LegendPosition = powerbi.visuals.LegendPosition;
    import DataViewMetadataColumn = powerbi.DataViewMetadataColumn;
    import DataViewTableRow = powerbi.DataViewTableRow;
    import DataView = powerbi.DataView;
    import valueFormatter = powerbi.visuals.valueFormatter;
    import ColorHelper = powerbi.visuals.ColorHelper;
    import SelectionId = powerbi.visuals.SelectionId;
    import DataViewObjects = powerbi.DataViewObjects;
    import LegendIcon = powerbi.visuals.LegendIcon;
    import Legend = powerbi.visuals.Legend;
    import VisualUpdateOptions = powerbi.VisualUpdateOptions;
    import IAxisProperties = powerbi.visuals.IAxisProperties;
    import ValueType = powerbi.ValueType;
    import PrimitiveType = powerbi.PrimitiveType;
    import NumberRange = powerbi.NumberRange;
    import AxisHelper = powerbi.visuals.AxisHelper;
    import TextMeasurementService = powerbi.TextMeasurementService;
    import TooltipManager = powerbi.visuals.TooltipManager;
    import TooltipEvent = powerbi.visuals.TooltipEvent;
    import SVGUtil = powerbi.visuals.SVGUtil;
    import VisualObjectInstance = powerbi.VisualObjectInstance;
    import EnumerateVisualObjectInstancesOptions = powerbi.EnumerateVisualObjectInstancesOptions;
    import VisualObjectInstanceEnumeration = powerbi.VisualObjectInstanceEnumeration;
    import ObjectEnumerationBuilder = powerbi.visuals.ObjectEnumerationBuilder;
    import IInteractiveBehavior = powerbi.visuals.IInteractiveBehavior;
    import ISelectionHandler = powerbi.visuals.ISelectionHandler;
    import IVisualWarning = powerbi.IVisualWarning;
    import IVisualErrorMessage = powerbi.IVisualErrorMessage;
    import axisScale = powerbi.visuals.axisScale;

    var PercentFormat: string = "0.00 %;-0.00 %;0.00 %";
    var MillisecondsInADay: number = 86400000;
    var MillisecondsInWeek: number = 604800000;
    var MillisecondsInAMonth: number = 2629746000;
    var MillisecondsInAYear: number = 31556952000;
    var ChartLineHeight: number = 40;
    var PaddingTasks: number = 5;

    export enum GanttDateType {
        Day = <any>"Day",
        Week = <any>"Week",
        Month = <any>"Month",
        Year = <any>"Year"
    }

    function createEnumTypeFromEnum(type: any): IEnumType {
        var even: any = false;
        return createEnumType(Object.keys(type)
            .filter((key, i) => ((!!(i % 2)) === even && type[key] === key && !void (even === !even)) || (!!(i % 2)) !== even)
            .map(x => <IEnumMember>{ value: x, displayName: x }));
    }

    export interface Task extends SelectableDataPoint {
        id: number;
        name: string;
        start: Date;
        duration: number;
        completion: number;
        resource: string;
        end: Date;
        taskType: string;
        description: string;
        color: string;
        tooltipInfo: TooltipDataItem[];
    }

    export interface GroupedTask {
        id: number;
        name: string;
        tasks: Task[];
    }

    export interface GanttChartFormatters {
        startDateFormatter: IValueFormatter;
        completionFormatter: IValueFormatter;
        durationFormatter: IValueFormatter;
    }

    export interface GanttViewModel {
        dataView: DataView;
        settings: GanttSettings<any>;
        tasks: Task[];
        series: GanttSeries[];
        legendData: LegendData;
        taskTypes: TaskTypes;
    }

    export interface GanttDataPoint extends SelectableDataPoint {
        color: string;
        value: any;
    }

    export interface GanttSeries extends SelectableDataPoint {
        tasks: Task[];
        fill: string;
        name: string;
    }

    export interface TaskTypes { /*TODO: change to more proper name*/
        types: string[];
        typeName: string;
    };

    export interface GanttCalculateScaleAndDomainOptions {
        viewport: IViewport;
        margin: IMargin;
        showCategoryAxisLabel: boolean;
        showValueAxisLabel: boolean;
        forceMerge: boolean;
        categoryAxisScaleType: string;
        valueAxisScaleType: string;
        trimOrdinalDataOnOverflow: boolean;
        forcedTickCount?: number;
        forcedYDomain?: any[];
        forcedXDomain?: any[];
        ensureXDomain?: NumberRange;
        ensureYDomain?: NumberRange;
        categoryAxisDisplayUnits?: number;
        categoryAxisPrecision?: number;
        valueAxisDisplayUnits?: number;
        valueAxisPrecision?: number;
    }

    interface Line {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        tooltipInfo: TooltipDataItem[];
    }

    module Selectors {
        export var ClassName: ClassAndSelector = CreateClassAndSelector("gantt");
        export var Chart: ClassAndSelector = CreateClassAndSelector("chart");
        export var ChartLine: ClassAndSelector = CreateClassAndSelector("chart-line");
        export var Body: ClassAndSelector = CreateClassAndSelector("gantt-body");
        export var AxisGroup: ClassAndSelector = CreateClassAndSelector("axis");
        export var Domain: ClassAndSelector = CreateClassAndSelector("domain");
        export var AxisTick: ClassAndSelector = CreateClassAndSelector("tick");

        export var Tasks: ClassAndSelector = CreateClassAndSelector("tasks");
        export var TaskGroup: ClassAndSelector = CreateClassAndSelector("task-group");
        export var SingleTask: ClassAndSelector = CreateClassAndSelector("task");
        export var TaskRect: ClassAndSelector = CreateClassAndSelector("task-rect");
        export var TaskProgress: ClassAndSelector = CreateClassAndSelector("task-progress");
        export var TaskResource: ClassAndSelector = CreateClassAndSelector("task-resource");
        export var SingleMilestone: ClassAndSelector = CreateClassAndSelector("milestone");

        export var TaskLabels: ClassAndSelector = CreateClassAndSelector("task-labels");
        export var TaskLines: ClassAndSelector = CreateClassAndSelector("task-lines");
        export var SingleTaskLine: ClassAndSelector = CreateClassAndSelector("task-line");
        export var Label: ClassAndSelector = CreateClassAndSelector("label");
        export var LegendItems: ClassAndSelector = CreateClassAndSelector("legendItem");
        export var LegendTitle: ClassAndSelector = CreateClassAndSelector("legendTitle");
    }

    export interface GanttSettings<T> {
        general: {
            groupTasks: T
        };
        legend: {
            show: T,
            position: T,
            showTitle: T,
            titleText: T,
            labelColor: T,
            fontSize: T,
        };
        taskLabels: {
            show: T,
            fill: T,
            fontSize: T,
            width: T,
        };
        taskCompletion: {
            show: T,
            fill: T,
        };
        taskResource: {
            show: T,
            fill: T,
            fontSize: T,
        };
        dateType: {
            type: T
        };
    }

    export class Gantt implements IVisual {
        private viewport: IViewport;
        private colors: IDataColorPalette;
        private legend: ILegend;

        private textProperties: TextProperties = {
            fontFamily: 'wf_segoe-ui_normal',
            fontSize: PixelConverter.toString(9),
        };

        public static DefaultSettings: GanttSettings<any> = {
            general: {
                groupTasks: false
            },
            legend: {
                show: true,
                position: legendPosition.right,
                showTitle: true,
                titleText: "",
                labelColor: "#000000",
                fontSize: 8,
            },
            taskLabels: {
                show: true,
                fill: "#000000",
                fontSize: 9,
                width: 110,
            },
            taskCompletion: {
                show: true,
                fill: "#000000",
            },
            taskResource: {
                show: true,
                fill: "#000000",
                fontSize: 9,
            },
            dateType: {
                type: GanttDateType.Week
            }
        };

        public static DefaultValues = {
            AxisTickSize: 6,
            MaxTaskOpacity: 1,
            MinTaskOpacity: 0.4,
            ProgressBarHeight: 4,
            ResourceWidth: 100,
            TaskColor: "#00B099",
            TaskLineWidth: 15,
            DefaultDateType: <string>(<any>GanttDateType.Week),
            DateFormatStrings: {
                Day: "MMM dd",
                Week: "MMM dd",
                Month: "MMM yyyy",
                Year: "yyyy"
            }
        };

        public static capabilities: VisualCapabilities = {
            dataRoles: [
                {
                    name: "Legend",
                    kind: VisualDataRoleKind.Grouping,
                    displayName: "Legend",
                }, {
                    name: "Task",
                    kind: VisualDataRoleKind.Grouping,
                    displayName: "Task"
                }, {
                    name: "StartDate",
                    kind: VisualDataRoleKind.Grouping,
                    displayName: "Start Date",
                }, {
                    name: "Duration",
                    kind: VisualDataRoleKind.Measure,
                    displayName: "Duration",
                    requiredTypes: [{ numeric: true }, { integer: true }]
                }, {
                    name: "Completion",
                    kind: VisualDataRoleKind.Measure,
                    displayName: "% Completion",
                    requiredTypes: [{ numeric: true }, { integer: true }]
                }, {
                    name: "Resource",
                    kind: VisualDataRoleKind.Grouping,
                    displayName: "Resource"
                }
            ],
            dataViewMappings: [{
                conditions: [
                    {
                        "Legend": { min: 0, max: 1 },
                        "Task": { min: 1, max: 1 },
                        "StartDate": { min: 0, max: 0 },
                        "Duration": { min: 0, max: 0 },
                        "Completion": { min: 0, max: 0 },
                        "Resource": { min: 0, max: 0 }
                    }, {
                        "Legend": { min: 0, max: 1 },
                        "Task": { min: 1, max: 1 },
                        "StartDate": { min: 0, max: 1 },
                        "Duration": { min: 0, max: 0 },
                        "Completion": { min: 0, max: 0 },
                        "Resource": { min: 0, max: 0 }
                    }, {
                        "Legend": { min: 0, max: 1 },
                        "Task": { min: 0, max: 1 },
                        "StartDate": { min: 0, max: 1 },
                        "Duration": { min: 0, max: 1 },
                        "Completion": { min: 0, max: 1 },
                        "Resource": { min: 0, max: 1 },
                    }
                ],
                table: {
                    rows: {
                        select:
                        [
                            { for: { in: "Legend" } },
                            { for: { in: "Task" } },
                            { for: { in: "StartDate" } },
                            { for: { in: "Duration" } },
                            { for: { in: "Completion" } },
                            { for: { in: "Resource" } },
                        ]
                    },
                },
            }],
            objects: {
                general: {
                    displayName: createDisplayNameGetter("Visual_General"),
                    properties: {
                        groupTasks: {
                            displayName: "Group Tasks",
                            type: { bool: true }
                        }
                    },
                },
                legend: {
                    displayName: "Legend",
                    description: "Display legend options",
                    properties: {
                        show: {
                            displayName: "Show",
                            type: { bool: true }
                        },
                        position: {
                            displayName: "Position",
                            description: "Select the location for the legend",
                            type: { enumeration: legendPosition.type }
                        },
                        showTitle: {
                            displayName: "Title",
                            description: "Display a title for legend symbols",
                            type: { bool: true }
                        },
                        titleText: {
                            displayName: "Legend Name",
                            description: "Title text",
                            type: { text: true },
                            suppressFormatPainterCopy: true
                        },
                        labelColor: {
                            displayName: "Color",
                            type: { fill: { solid: { color: true } } }
                        },
                        fontSize: {
                            displayName: "Text Size",
                            type: { formatting: { fontSize: true } }
                        }
                    }
                },
                taskLabels: {
                    displayName: 'Category Labels',
                    properties: {
                        show: {
                            displayName: "Show",
                            type: { bool: true }
                        },
                        fill: {
                            displayName: 'Fill',
                            type: { fill: { solid: { color: true } } }
                        },
                        fontSize: {
                            displayName: 'Font Size',
                            type: { formatting: { fontSize: true } }
                        },
                        width: {
                            displayName: 'Width',
                            type: { numeric: true }
                        }
                    }
                },
                taskCompletion: {
                    displayName: 'Task Completion',
                    properties: {
                        show: {
                            type: { bool: true }
                        },
                        fill: {
                            displayName: 'Completion Color',
                            type: { fill: { solid: { color: true } } }
                        }
                    }
                },
                taskResource: {
                    displayName: 'Data Labels',
                    properties: {
                        show: {
                            displayName: "Show",
                            type: { bool: true }
                        },
                        fill: {
                            displayName: 'Color',
                            type: { fill: { solid: { color: true } } }
                        },
                        fontSize: {
                            displayName: 'Font Size',
                            type: { formatting: { fontSize: true } }
                        }
                    }
                },
                dateType: {
                    displayName: 'Gantt Date Type',
                    properties: {
                        type: {
                            displayName: "Type",
                            type: { enumeration: createEnumTypeFromEnum(GanttDateType) }
                        },
                    }
                },
            },
            sorting: {
                default: {},
            },
        };

        private static Properties: GanttSettings<DataViewObjectPropertyIdentifier> = Gantt.getProperties(Gantt.capabilities);
        private static getProperties(capabilities: VisualCapabilities): any {
            var result = {};
            for (var objectKey in capabilities.objects) {
                result[objectKey] = {};
                for (var propKey in capabilities.objects[objectKey].properties) {
                    result[objectKey][propKey] = <DataViewObjectPropertyIdentifier>{
                        objectName: objectKey,
                        propertyName: propKey
                    };
                }
            }

            return result;
        }

        private static get DefaultMargin(): IMargin {
            return {
                top: 50,
                right: 40,
                bottom: 40,
                left: 10
            };
        }

        private margin: IMargin = Gantt.DefaultMargin;

        private style: IVisualStyle;
        private body: D3.Selection;
        private ganttSvg: D3.Selection;
        private viewModel: GanttViewModel;
        private timeScale: D3.Scale.TimeScale;
        private axisGroup: D3.Selection;

        private chartGroup: D3.Selection;
        private taskGroup: D3.Selection;
        private lineGroup: D3.Selection;

        private clearCatcher: D3.Selection;
        private ganttDiv: D3.Selection;
        private selectionManager: SelectionManager;
        private behavior: GanttChartBehavior;
        private interactivityService: IInteractivityService;
        private hostServices: IVisualHostServices;
        private isInteractiveChart: boolean;

        public init(options: VisualInitOptions): void {
            this.viewport = _.clone(options.viewport);
            this.style = options.style;
            this.body = d3.select(options.element.get(0));

            this.hostServices = options.host;
            this.selectionManager = new SelectionManager({ hostServices: options.host });

            this.isInteractiveChart = options.interactivity && options.interactivity.isInteractiveLegend;
            this.interactivityService = createInteractivityService(this.hostServices);
            this.createViewport(options.element);
            this.updateChartSize();
            this.behavior = new GanttChartBehavior();
            this.colors = options.style.colorPalette.dataColors;
        }

        /**
         * Create the vieport area of the gantt chart
         */
        private createViewport(element: JQuery): void {
            //create div container to the whole viewport area
            this.ganttDiv = this.body.append("div")
                .classed(Selectors.Body.class, true);

            //create container to the svg area
            this.ganttSvg = this.ganttDiv
                .append("svg")
                .classed(Selectors.ClassName.class, true);

            //create clear catcher
            this.clearCatcher = appendClearCatcher(this.ganttSvg);

            //create axis container
            this.axisGroup = this.ganttSvg
                .append("g")
                .classed(Selectors.AxisGroup.class, true);

            //create task lines container
            this.lineGroup = this.ganttSvg
                .append("g")
                .classed(Selectors.TaskLines.class, true);

            //create chart container
            this.chartGroup = this.ganttSvg
                .append("g")
                .classed(Selectors.Chart.class, true);

            //create tasks container
            this.taskGroup = this.chartGroup
                .append("g")
                .classed(Selectors.Tasks.class, true);

            //create legend container
            this.legend = createLegend(element,
                this.isInteractiveChart,
                this.interactivityService,
                true,
                LegendPosition.Top);
        }

        /**
         * Clear the viewport area
         */
        private clearViewport(): void {
            this.body.selectAll(Selectors.LegendItems.selector).remove();
            this.body.selectAll(Selectors.LegendTitle.selector).remove();
            this.axisGroup.selectAll(Selectors.AxisTick.selector).remove();
            this.axisGroup.selectAll(Selectors.Domain.selector).remove();
            this.lineGroup.selectAll("*").remove();
            this.chartGroup.selectAll(Selectors.ChartLine.selector).remove();
            this.chartGroup.selectAll(Selectors.TaskGroup.selector).remove();
            this.chartGroup.selectAll(Selectors.SingleTask.selector).remove();
        }

        /**
         * Update div container size to the whole viewport area
         * @param viewport The vieport to change it size 
         */
        private updateChartSize(): void {
            this.ganttDiv.style({
                height: PixelConverter.toString(this.viewport.height),
                width: PixelConverter.toString(this.viewport.width)
            });
        }

        /**
         * Get task property from the data view
         * @param columnSource
         * @param child
         * @param propertyName The property to get
         */
        private static getTaskProperty<T>(columnSource: DataViewMetadataColumn[], child: DataViewTableRow, propertyName: string): T {
            if (!child ||
                !columnSource ||
                !(columnSource.length > 0) ||
                !columnSource[0].roles)
                return null;

            var index = columnSource.indexOf(columnSource.filter(x => x.roles[propertyName])[0]);
            return index !== -1 ? <T>child[index] : null;
        }

        /**
         * Check if dataView has a given role
         * @param column The dataView headers
         * @param name The role to find
         */
        private static hasRole(column: DataViewMetadataColumn, name: string) {
            var roles = column.roles;
            return roles && roles[name];
        }

        /**
        * Get the tooltip info (data display names & formated values)
        * @param task All task attributes.
        * @param formatters Formatting options for gantt attributes.
        */
        private static getTooltipInfo(task: Task, formatters: GanttChartFormatters, timeInterval: string = "Days") {
            var tooltipDataArray: TooltipDataItem[] = [];

            if (task.taskType)
                tooltipDataArray.push({ displayName: Gantt.capabilities.dataRoles[0].name, value: task.taskType });

            tooltipDataArray.push({ displayName: Gantt.capabilities.dataRoles[1].name, value: task.name });
            if (!isNaN(task.start.getDate()))
                tooltipDataArray.push({ displayName: Gantt.capabilities.dataRoles[2].name, value: formatters.startDateFormatter.format(task.start.toLocaleDateString()) });

            tooltipDataArray.push({ displayName: Gantt.capabilities.dataRoles[3].name, value: formatters.durationFormatter.format(task.duration) + " " + timeInterval });
            tooltipDataArray.push({ displayName: Gantt.capabilities.dataRoles[4].name, value: formatters.completionFormatter.format(task.completion) });

            if (task.resource)
                tooltipDataArray.push({ displayName: Gantt.capabilities.dataRoles[5].name, value: task.resource });

            return tooltipDataArray;
        }

        /**
        * Check if task has data for task
        * @param dataView
        */
        private static isChartHasTask(dataView: DataView): boolean {
            if (dataView.table &&
                dataView.table.columns) {
                for (var column of dataView.table.columns) {
                    if (Gantt.hasRole(column, "Task")) {
                        return true;
                    }
                }
            }
            return false;
        }

        /**
         * Returns the chart formatters
         * @param dataView The data Model
         */
        private static getFormatters(dataView: DataView): GanttChartFormatters {
            if (!dataView ||
                !dataView.metadata ||
                !dataView.metadata.columns)
                return null;

            var dateFormat = "d";
            var numberFormat = "#";

            for (var dvColumn of dataView.metadata.columns) {
                if (!!dataView.categorical.categories) {
                    for (var dvCategory of dataView.categorical.categories) {
                        if (Gantt.hasRole(dvCategory.source, "StartDate"))
                            dateFormat = dvColumn.format;
                    }
                }
            }

            return <GanttChartFormatters>{
                startDateFormatter: valueFormatter.create({ format: dateFormat }),
                durationFormatter: valueFormatter.create({ format: numberFormat }),
                completionFormatter: valueFormatter.create({ format: PercentFormat, value: 1, allowFormatBeautification: true })
            };
        }

        /**
        * Create task objects dataView
        * @param dataView The data Model.
        * @param formatters task attributes represented format.
        * @param series An array that holds the color data of different task groups.
        */
        private static createTasks(dataView: DataView, formatters: GanttChartFormatters, colors: IDataColorPalette): Task[] {
            var columnSource = dataView.table.columns;
            var data = dataView.table.rows;
            var categories = dataView.categorical.categories[0];
            var colorHelper = new ColorHelper(colors, undefined);

            return data.map((child: DataViewTableRow, index: number) => {
                var dateString = Gantt.getTaskProperty<Date>(columnSource, child, "StartDate");

                dateString = Gantt.isValidDate(dateString) ? dateString : new Date(Date.now());

                var duration = Gantt.getTaskProperty<number>(columnSource, child, "Duration");

                var completionValue = Gantt.getTaskProperty<number>(columnSource, child, "Completion");
                var completion = Gantt.convertToDecimal(completionValue);
                completion = completion <= 1 ? completion : 1;

                var taskType = Gantt.getTaskProperty<string>(columnSource, child, "Legend");
                var tasksTypeColor: string = colorHelper.getColorForMeasure(dataView.metadata.objects, taskType);

                var task: Task = {
                    id: index,
                    name: Gantt.getTaskProperty<string>(columnSource, child, "Task"),
                    start: dateString ? dateString : new Date(Date.now()),
                    duration: duration > 0 ? duration : 1,
                    end: null,
                    completion: completion > 0 ? completion : 0,
                    resource: Gantt.getTaskProperty<string>(columnSource, child, "Resource"),
                    taskType: taskType,
                    color: tasksTypeColor ? tasksTypeColor : Gantt.DefaultValues.TaskColor, /* get color by task type  */
                    tooltipInfo: null,
                    description: "",
                    identity: SelectionId.createWithIdAndMeasure(categories.identity[index], taskType),
                    selected: false
                };

                task.end = d3.time.day.offset(task.start, task.duration);
                task.tooltipInfo = Gantt.getTooltipInfo(task, formatters);
                return task;
            });
        }

        /**
       * Create the gantt tasks series based on all task types
       * @param taskTypes All unique types from the tasks array.
       */
        private static createSeries(objects: DataViewObjects, tasks: Task[], dataView: DataView, colors: IDataColorPalette): GanttSeries[] {
            var colorHelper = new ColorHelper(colors, undefined /*Gantt.Properties.dataPoint.fill*/);
            var taskGroup: _.Dictionary<Task[]> = _.groupBy(tasks, t => t.taskType);
            var taskTypes = Gantt.getAllTasksTypes(dataView);

            var series: GanttSeries[] = _.map(taskTypes.types, type => {
                return {
                    tasks: taskGroup[type],
                    fill: colorHelper.getColorForMeasure(objects, type),
                    name: type,
                    identity: SelectionId.createWithMeasure(type),
                    selected: false
                };
            });

            return series;
        }

        /**
        * Convert the dataView to view model
        * @param dataView The data Model
        */
        public static converter(dataView: DataView, colors: IDataColorPalette): GanttViewModel {
            if (!dataView
                || !dataView.categorical
                || !Gantt.isChartHasTask(dataView)
                || dataView.table.rows.length === 0) {
                return null;
            }

            var settings = Gantt.parseSettings(dataView, colors);
            var taskTypes = Gantt.getAllTasksTypes(dataView);

            var legendData: LegendData = {
                fontSize: settings.legend.fontSize,
                dataPoints: [],
                title: taskTypes.typeName
            };

            var colorHelper = new ColorHelper(colors, undefined /*Gantt.Properties.dataPoint.fill*/);
            legendData.dataPoints = _.map(taskTypes.types, type => {
                return {
                    label: type,
                    color: colorHelper.getColorForMeasure(dataView.metadata.objects, type),
                    icon: LegendIcon.Circle,
                    selected: false,
                    identity: SelectionId.createWithMeasure(type)
                };
            });

            var formatters: GanttChartFormatters = this.getFormatters(dataView);

            var tasks: Task[] = Gantt.createTasks(dataView, formatters, colors);
            var series = Gantt.createSeries(dataView.metadata.objects, tasks, dataView, colors);

            var viewModel: GanttViewModel = {
                dataView: dataView,
                settings: settings,
                tasks: tasks,
                series: series,
                legendData: legendData,
                taskTypes: taskTypes,
            };

            return viewModel;
        }

        private static parseSettings(dataView: DataView, colors: IDataColorPalette): GanttSettings<any> {
            var result: GanttSettings<any> = _.cloneDeep(Gantt.DefaultSettings);
            if (!dataView || !dataView.metadata || !dataView.metadata.objects) {
                return result;
            }

            var objects = dataView.metadata.objects;

            result.general.groupTasks = DataViewObjects.getValue<boolean>(objects, Gantt.Properties.general.groupTasks, Gantt.DefaultSettings.general.groupTasks);

            result.taskLabels.show = DataViewObjects.getValue<boolean>(objects, Gantt.Properties.taskLabels.show, Gantt.DefaultSettings.taskLabels.show);
            result.taskLabels.fill = DataViewObjects.getFillColor(objects, Gantt.Properties.taskLabels.fill, Gantt.DefaultSettings.taskLabels.fill);
            result.taskLabels.fontSize = DataViewObjects.getValue<number>(objects, Gantt.Properties.taskLabels.fontSize, Gantt.DefaultSettings.taskLabels.fontSize);
            result.taskLabels.width = DataViewObjects.getValue<number>(objects, Gantt.Properties.taskLabels.width, result.taskLabels.show ? Gantt.DefaultSettings.taskLabels.width : 0);

            result.taskCompletion.show = DataViewObjects.getValue<boolean>(objects, Gantt.Properties.taskCompletion.show, Gantt.DefaultSettings.taskCompletion.show);
            delete result.taskCompletion.show;

            result.taskCompletion.fill = DataViewObjects.getFillColor(objects, Gantt.Properties.taskCompletion.fill, Gantt.DefaultSettings.taskCompletion.fill);

            result.taskResource.show = DataViewObjects.getValue<boolean>(objects, Gantt.Properties.taskResource.show, Gantt.DefaultSettings.taskResource.show);
            result.taskResource.fontSize = DataViewObjects.getValue<number>(objects, Gantt.Properties.taskResource.fontSize, Gantt.DefaultSettings.taskResource.fontSize);
            result.taskResource.fill = DataViewObjects.getFillColor(objects, Gantt.Properties.taskResource.fill, Gantt.DefaultSettings.taskResource.fill);

            result.dateType.type = DataViewObjects.getValue<GanttDateType>(objects, Gantt.Properties.dateType.type, Gantt.DefaultSettings.dateType.type);

            result.legend.show = DataViewObjects.getValue<boolean>(objects, Gantt.Properties.legend.show, Gantt.DefaultSettings.legend.show);
            result.legend.fontSize = DataViewObjects.getValue<number>(objects, Gantt.Properties.legend.fontSize, Gantt.DefaultSettings.legend.fontSize);
            result.legend.labelColor = DataViewObjects.getFillColor(objects, Gantt.Properties.legend.labelColor, Gantt.DefaultSettings.legend.labelColor);
            result.legend.position = DataViewObjects.getValue<string>(objects, Gantt.Properties.legend.position, Gantt.DefaultSettings.legend.position);
            result.legend.showTitle = DataViewObjects.getValue<boolean>(objects, Gantt.Properties.legend.showTitle, Gantt.DefaultSettings.legend.showTitle);
            result.legend.titleText = DataViewObjects.getValue<string>(objects, Gantt.Properties.legend.titleText, Gantt.DefaultSettings.legend.titleText);

            return result;
        }

        private static isValidDate(date: Date) {
            if (Object.prototype.toString.call(date) !== "[object Date]")
                return false;
            return !isNaN(date.getTime());
        }

        private static convertToDecimal(number) {
            if (!(number >= 0 && number <= 1))
                return (number / 100);
            return number;
        }

        /**
        * Gets all unique types from the tasks array
        * @param dataView The data model.
        */
        private static getAllTasksTypes(dataView: DataView): TaskTypes {
            var types: string[] = [];
            var groupName: string = "";
            var taskTypes: TaskTypes;
            var data = dataView.table.rows;
            var index = _.findIndex(dataView.table.columns, col => col.roles.hasOwnProperty("Legend"));

            if (index !== -1) {
                groupName = dataView.table.columns[index].displayName;
                types = _.unique(data, (d) => d[index]).map((d) => d[index]);
            }

            taskTypes = {
                typeName: groupName,
                types: types
            };

            return taskTypes;
        }

        /**
         * Get legend data, calculate position and draw it
         */
        private renderLegend(): void {
            if (!this.viewModel.legendData) {
                return;
            }

            LegendData.update(this.viewModel.legendData,
                DataViewObjects.getObject(this.viewModel.dataView.metadata.objects, "legend", {}));

            var position = this.viewModel.settings.legend.show
                ? LegendPosition[<string>this.viewModel.settings.legend.position]
                : LegendPosition.None;

            this.legend.changeOrientation(position);

            this.legend.drawLegend(this.viewModel.legendData, _.clone(this.viewport));
            Legend.positionChartArea(this.ganttDiv, this.legend);

            switch (this.legend.getOrientation()) {
                case LegendPosition.Left:
                case LegendPosition.LeftCenter:
                case LegendPosition.Right:
                case LegendPosition.RightCenter:
                    this.viewport.width -= this.legend.getMargins().width;
                    break;
                case LegendPosition.Top:
                case LegendPosition.TopCenter:
                case LegendPosition.Bottom:
                case LegendPosition.BottomCenter:
                    this.viewport.height -= this.legend.getMargins().height;
                    break;
            }
        }

        /**
        * Called on data change or resizing
        * @param options The visual option that contains the dataview and the viewport
        */
        public update(options: VisualUpdateOptions) {
            if (!options.dataViews || !options.dataViews[0]) {
                return;
            }

            this.viewModel = Gantt.converter(options.dataViews[0], this.colors);
            if (!this.viewModel) {
                this.clearViewport();
                return;
            }

            this.viewport = _.clone(options.viewport);
            this.margin = Gantt.DefaultMargin;

            this.renderLegend();
            this.updateChartSize();

            var tasks = this.viewModel.tasks;

            if (this.interactivityService) {
                this.interactivityService.applySelectionStateToData(tasks);
                this.interactivityService.applySelectionStateToData(this.viewModel.series);
            }

            if (tasks.length > 0) {
                var tasksSortedByStartDate: Task[] = _.sortBy(tasks, (t) => t.start);
                var tasksSortedByEndDate: Task[] = _.sortBy(tasks, (t) => t.end);
                var dateTypeMilliseconds = this.getDateType();

                var startDate: Date = tasksSortedByStartDate[0].start,
                    endDate: Date = tasksSortedByEndDate[tasks.length - 1].end,
                    ticks = Math.ceil(Math.round(endDate.valueOf() - startDate.valueOf()) / dateTypeMilliseconds);

                var groupedTasks: GroupedTask[] = this.groupTasks(tasks);

                ticks = ticks === 0 || ticks === 1 ? 2 : ticks;
                var axisLength = ticks * 50;
                this.ganttSvg
                    .attr({
                        height: PixelConverter.toString(groupedTasks.length * ChartLineHeight + this.margin.top),
                        width: PixelConverter.toString(this.margin.left + this.viewModel.settings.taskLabels.width + axisLength + Gantt.DefaultValues.ResourceWidth)
                    });

                var viewportIn: IViewport = {
                    height: this.viewport.height,
                    width: axisLength
                };

                var xAxisProperties = this.calculateAxes(viewportIn, this.textProperties, startDate, endDate, axisLength, ticks, false);
                this.timeScale = <D3.Scale.TimeScale>xAxisProperties.scale;

                this.renderAxis(xAxisProperties, 200);
                this.renderTasks(groupedTasks);

                this.createMilestoneLine(groupedTasks);
                this.updateTaskLabels(groupedTasks, this.viewModel.settings.taskLabels.width);
                this.updateElementsPositions(this.viewport, this.margin);

                if (this.interactivityService) {
                    var behaviorOptions: GanttBehaviorOptions = {
                        clearCatcher: this.clearCatcher,
                        taskSelection: this.taskGroup.selectAll(Selectors.SingleTask.selector),
                        legendSelection: this.body.selectAll(Selectors.LegendItems.selector),
                        interactivityService: this.interactivityService
                    };
                    this.interactivityService.bind(tasks, this.behavior, behaviorOptions);
                }
            }
        }

        private getDateType(): number {
            var milliSeconds: number = MillisecondsInWeek;

            switch (this.viewModel.settings.dateType.type) {
                case "Day":
                    milliSeconds = MillisecondsInADay;
                    break;

                case "Week":
                    milliSeconds = MillisecondsInWeek;
                    break;

                case "Month":
                    milliSeconds = MillisecondsInAMonth;
                    break;

                case "Year":
                    milliSeconds = MillisecondsInAYear;
                    break;
            }

            return milliSeconds;
        }

        private calculateAxes(
            viewportIn: IViewport,
            textProperties: TextProperties,
            startDate: Date,
            endDate: Date,
            axisLength: number,
            ticksCount: number,
            scrollbarVisible: boolean): IAxisProperties {

            var dataTypeDatetime = ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.Date);
            var category: DataViewMetadataColumn = { displayName: "StartDate", queryName: "StartDate", type: dataTypeDatetime, index: 0 };
            var visualOptions: GanttCalculateScaleAndDomainOptions = {
                viewport: viewportIn,
                margin: this.margin,
                forcedXDomain: [startDate, endDate],
                forceMerge: false,
                showCategoryAxisLabel: false,
                showValueAxisLabel: false,
                categoryAxisScaleType: axisScale.linear,
                valueAxisScaleType: null,
                valueAxisDisplayUnits: 0,
                categoryAxisDisplayUnits: 0,
                trimOrdinalDataOnOverflow: false,
                forcedTickCount: ticksCount
            };

            var width = viewportIn.width;
            var axes = this.calculateAxesProperties(viewportIn, visualOptions, axisLength, category);
            axes.willLabelsFit = AxisHelper.LabelLayoutStrategy.willLabelsFit(
                axes,
                width,
                TextMeasurementService.measureSvgTextWidth,
                textProperties);

            // If labels do not fit and we are not scrolling, try word breaking
            axes.willLabelsWordBreak = (!axes.willLabelsFit && !scrollbarVisible) && AxisHelper.LabelLayoutStrategy.willLabelsWordBreak(
                axes, this.margin, width, TextMeasurementService.measureSvgTextWidth,
                TextMeasurementService.estimateSvgTextHeight, TextMeasurementService.getTailoredTextOrDefault,
                textProperties);

            return axes;
        }

        private calculateAxesProperties(viewportIn: IViewport, options: GanttCalculateScaleAndDomainOptions, axisLength: number, metaDataColumn: DataViewMetadataColumn): IAxisProperties {
            var xAxisProperties = AxisHelper.createAxis({
                pixelSpan: viewportIn.width,
                dataDomain: options.forcedXDomain,
                metaDataColumn: metaDataColumn,
                formatString: Gantt.DefaultValues.DateFormatStrings[this.viewModel.settings.dateType.type],
                outerPadding: 0,
                isScalar: true,
                isVertical: false,
                forcedTickCount: options.forcedTickCount,
                useTickIntervalForDisplayUnits: true,
                isCategoryAxis: true,
                getValueFn: (index, type) => {
                    return valueFormatter.format(new Date(index),
                        Gantt.DefaultValues.DateFormatStrings[this.viewModel.settings.dateType.type]);
                },
                scaleType: options.categoryAxisScaleType,
                axisDisplayUnits: options.categoryAxisDisplayUnits,
            });

            xAxisProperties.axisLabel = metaDataColumn.displayName;
            return xAxisProperties;
        }

        private groupTasks(tasks: Task[]): GroupedTask[] {
            if (this.viewModel.settings.general.groupTasks) {
                var groupedTasks = _.groupBy(tasks, x => x.name);
                var result: GroupedTask[] = _.map(groupedTasks, (x, i) => <GroupedTask>{
                    name: i,
                    tasks: groupedTasks[i]
                });

                result.forEach((x, i) => {
                    x.tasks.forEach(t => t.id = i);
                    x.id = i;
                });

                return result;
            }

            return tasks.map(x => <GroupedTask>{
                name: x.name,
                id: x.id,
                tasks: [x]
            });
        }

        private renderAxis(xAxisProperties: IAxisProperties, duration: number): void {
            var xAxis = xAxisProperties.axis;
            xAxis.orient('bottom');

            this.axisGroup.transition().duration(duration).call(xAxis);
        }
        /**
        * Update task labels and add its tooltips 
        * @param tasks All tasks array
        * @param width The task label width
        */
        private updateTaskLabels(tasks: GroupedTask[], width: number): void {
            var axisLabel: D3.UpdateSelection;
            var taskLineCoordinateX: number = 15;
            var taskLabelsShow = this.viewModel ? this.viewModel.settings.taskLabels.show : true;
            var taskLabelsColor = this.viewModel ? this.viewModel.settings.taskLabels.fill : Gantt.DefaultSettings.taskLabels.fill;
            var taskLabelsFontSize = this.viewModel ? this.viewModel.settings.taskLabels.fontSize : Gantt.DefaultSettings.taskLabels.fontSize;

            if (taskLabelsShow) {
                axisLabel = this.lineGroup.selectAll(Selectors.Label.selector).data(tasks);
                axisLabel.enter().append("text").classed(Selectors.Label.class, true);
                axisLabel.attr({
                    x: taskLineCoordinateX,
                    y: (task: GroupedTask, i: number) => this.getTaskLabelCoordinateY(task.id),
                    fill: taskLabelsColor,
                    "stroke-width": 1
                })
                    .style("font-size", PixelConverter.fromPoint(taskLabelsFontSize))
                    .text((task: GroupedTask) => { return task.name; });

                axisLabel.call(AxisHelper.LabelLayoutStrategy.clip, width - 20, TextMeasurementService.svgEllipsis);
                axisLabel.append("title").text((task: GroupedTask) => { return task.name; });
                axisLabel.exit().remove();
            }
            else {
                this.lineGroup.selectAll(Selectors.Label.selector).remove();
            }
        }

        private renderTasks(groupedTasks: GroupedTask[]) {
            var taskGroupSelection: D3.UpdateSelection = this.taskGroup.selectAll(Selectors.TaskGroup.selector).data(groupedTasks);
            var taskProgressColor = this.viewModel ? this.viewModel.settings.taskCompletion.fill : Gantt.DefaultSettings.taskCompletion.fill;
            var taskResourceShow = this.viewModel ? this.viewModel.settings.taskResource.show : true;
            var padding: number = 4;
            var taskResourceColor = this.viewModel ? this.viewModel.settings.taskResource.fill : Gantt.DefaultSettings.taskResource.fill;
            var taskResourceFontSize: number = this.viewModel ? this.viewModel.settings.taskResource.fontSize : Gantt.DefaultSettings.taskResource.fontSize;

            //render task group container 
            taskGroupSelection.enter().append("g").classed(Selectors.TaskGroup.class, true);

            var taskSelection = taskGroupSelection.selectAll(Selectors.SingleTask.selector).data((d: GroupedTask) => d.tasks);
            taskSelection.enter().append("g").classed(Selectors.SingleTask.class, true);

            //render task main rect
            var taskRect = taskSelection.selectAll(Selectors.TaskRect.selector).data((d: Task) => [d]);
            taskRect.enter().append("rect").classed(Selectors.TaskRect.class, true);
            taskRect.classed(Selectors.TaskRect.class, true).attr({
                x: (task: Task) => this.timeScale(task.start),
                y: (task: Task) => this.getBarYCoordinate(task.id),
                width: (task: Task) => this.taskDurationToWidth(task),
                height: () => this.getBarHeight()
            }).style("fill", (task: Task) => task.color);
            taskRect.exit().remove();

            //render task progress rect 
            var taskProgress = taskSelection.selectAll(Selectors.TaskProgress.selector).data((d: Task) => [d]);
            taskProgress.enter().append("rect").classed(Selectors.TaskProgress.class, true);
            taskProgress.attr({
                x: (task: Task) => this.timeScale(task.start),
                y: (task: Task) => this.getBarYCoordinate(task.id) + this.getBarHeight() / 2 - Gantt.DefaultValues.ProgressBarHeight / 2,
                width: (task: Task) => this.setTaskProgress(task),
                height: Gantt.DefaultValues.ProgressBarHeight
            }).style("fill", taskProgressColor);
            taskProgress.exit().remove();

            if (taskResourceShow) {
                //render task resource labels
                var taskResource = taskSelection.selectAll(Selectors.TaskResource.selector).data((d: Task) => [d]);
                taskResource.enter().append("text").classed(Selectors.TaskResource.class, true);
                taskResource.attr({
                    x: (task: Task) => this.timeScale(task.end) + padding,
                    y: (task: Task) => (this.getBarYCoordinate(task.id) + (this.getBarHeight() / 2) + padding)
                })
                    .text((task: Task) => task.resource)
                    .style({
                        fill: taskResourceColor,
                        "font-size": PixelConverter.fromPoint(taskResourceFontSize)
                    }).call(AxisHelper.LabelLayoutStrategy.clip,
                    Gantt.DefaultValues.ResourceWidth - 10,
                    TextMeasurementService.svgEllipsis);

                taskResource.exit().remove();
            }
            else {
                taskSelection.selectAll(Selectors.TaskResource.selector).remove();
            }

            TooltipManager.addTooltip(taskSelection, (tooltipEvent: TooltipEvent) => (<Task>tooltipEvent.data).tooltipInfo);
            taskSelection.exit().remove();
            taskGroupSelection.exit().remove();
        }

        public onClearSelection() {
            this.selectionManager.clear();
        }

        /**
         * Returns the matching Y coordinate for a given task index 
         * @param taskIndex Task Number
         */
        private getTaskLabelCoordinateY(taskIndex: number): number {
            var fontSize: number = + this.viewModel.settings.taskLabels.fontSize;
            return (ChartLineHeight * taskIndex) + (this.getBarHeight() + 5 - (40 - fontSize) / 4);
        }

        /**
         * Set the task progress bar in the gantt
         * @param task All task attributes
         */
        private setTaskProgress(task: Task): number {
            var fraction = task.completion / 1.0,
                y = this.timeScale,
                progress = (y(task.end) - y(task.start)) * fraction;

            return progress;
        }

        /**
         * Set the task progress bar in the gantt
         * @param lineNumber Line number that represents the task number
         */
        private getBarYCoordinate(lineNumber: number): number {
            return (ChartLineHeight * lineNumber) + (PaddingTasks);
        }

        private getBarHeight(): number {
            return ChartLineHeight / 1.5;
        }

        /**
        * convert task duration to width in the time scale
        * @param task The task to convert
        */
        private taskDurationToWidth(task: Task): number {
            return this.timeScale(task.end) - this.timeScale(task.start);
        }

        private getTooltipForMilstoneLine(timestamp: number, milestoneTitle: string): TooltipDataItem[] {
            var stringDate = new Date(timestamp).toDateString();
            var tooltip: TooltipDataItem[] = [{ displayName: milestoneTitle, value: stringDate }];
            return tooltip;
        }

        /**
        * Create vertical dotted line that represent milestone in the time axis (by default it shows not time)
        * @param tasks All tasks array
        * @param timestamp the milestone to be shown in the time axis (default Date.now())
        */
        private createMilestoneLine(tasks: GroupedTask[], milestoneTitle: string = "Today", timestamp: number = Date.now()): void {
            var line: Line[] = [{
                x1: this.timeScale(timestamp),
                y1: 0,
                x2: this.timeScale(timestamp),
                y2: this.getMilestoneLineLength(tasks.length),
                tooltipInfo: this.getTooltipForMilstoneLine(timestamp, milestoneTitle)
            }];

            var chartLineSelection: D3.UpdateSelection = this.chartGroup.selectAll(Selectors.ChartLine.selector).data(line);
            chartLineSelection.enter().append("line").classed(Selectors.ChartLine.class, true);
            chartLineSelection.attr({
                x1: (line: Line) => line.x1,
                y1: (line: Line) => line.y1,
                x2: (line: Line) => line.x2,
                y2: (line: Line) => line.y2,
                tooltipInfo: (line: Line) => line.tooltipInfo
            });

            TooltipManager.addTooltip(chartLineSelection, (tooltipEvent: TooltipEvent) => (<Line>tooltipEvent.data).tooltipInfo);
            chartLineSelection.exit().remove();
        }

        private updateElementsPositions(viewport: IViewport, margin: IMargin): void {
            this.axisGroup.attr("transform", SVGUtil.translate(this.viewModel.settings.taskLabels.width + margin.left, 15));
            this.chartGroup.attr("transform", SVGUtil.translate(this.viewModel.settings.taskLabels.width + margin.left, margin.top));
            this.lineGroup.attr("transform", SVGUtil.translate(0, margin.top));
        }

        private getMilestoneLineLength(numOfTasks: number): number {
            return numOfTasks * ChartLineHeight;
        }

        private enumerateGeneral(settings: GanttSettings<any>): VisualObjectInstance[] {
            return [/*{
                selector: null,
                properties: <any>settings.general,
                objectName: Gantt.Properties.general.groupTasks.objectName
            }*/];
        }

        private enumerateLegend(settings: GanttSettings<any>): VisualObjectInstance[] {
            return [{
                displayName: Gantt.Properties.legend.show.objectName,
                selector: null,
                properties: <any>settings.legend,
                objectName: Gantt.Properties.legend.show.objectName
            }];
        }

        private enumerateDataPoints(settings: GanttSettings<any>): VisualObjectInstance[] {
            return this.viewModel.series.map((item: GanttSeries) => <VisualObjectInstance>{
                objectName: 'dataPoint',
                displayName: item.name,
                selector: ColorHelper.normalizeSelector(item.identity.getSelector(), false),
                properties: { fill: { solid: { color: item.fill } } }
            });
        }

        private enumerateTaskCompletion(settings: GanttSettings<any>): VisualObjectInstance[] {
            return [{
                selector: null,
                properties: <any>settings.taskCompletion,
                objectName: Gantt.Properties.taskCompletion.show.objectName
            }];
        }

        private enumerateTaskLabels(settings: GanttSettings<any>): VisualObjectInstance[] {
            return [{
                selector: null,
                properties: <any>settings.taskLabels,
                objectName: Gantt.Properties.taskLabels.show.objectName
            }];
        }

        private enumerateTaskResources(settings: GanttSettings<any>): VisualObjectInstance[] {
            return [{
                selector: null,
                properties: <any>settings.taskResource,
                objectName: Gantt.Properties.taskResource.show.objectName
            }];
        }

        private enumerateDateType(settings: GanttSettings<any>): VisualObjectInstance[] {
            return [{
                selector: null,
                properties: <any>settings.dateType,
                objectName: Gantt.Properties.dateType.type.objectName
            }];
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
            var settings = this.viewModel && this.viewModel.settings || Gantt.DefaultSettings;
            var enumeration = new ObjectEnumerationBuilder();
            var push = (instances: VisualObjectInstance[]) => instances.forEach(x => enumeration.pushInstance(x));
            switch (options.objectName) {
                case 'general':
                    push(this.enumerateGeneral(settings));
                    break;
                case 'legend':
                    push(this.enumerateLegend(settings));
                    break;
                case 'dataPoint':
                    push(this.enumerateDataPoints(settings));
                    break;
                case 'taskLabels':
                    push(this.enumerateTaskLabels(settings));
                    break;
                case 'taskCompletion':
                    push(this.enumerateTaskCompletion(settings));
                    break;
                case 'taskResource':
                    push(this.enumerateTaskResources(settings));
                    break;
                case 'dateType':
                    push(this.enumerateDateType(settings));
                    break;
            }

            return enumeration.complete();
        }
    }

    export interface GanttBehaviorOptions {
        clearCatcher: D3.Selection;
        taskSelection: D3.Selection;
        legendSelection: D3.Selection;
        interactivityService: IInteractivityService;
    }

    export class GanttChartBehavior implements IInteractiveBehavior {
        private options: GanttBehaviorOptions;

        public bindEvents(options: GanttBehaviorOptions, selectionHandler: ISelectionHandler) {
            this.options = options;
            var clearCatcher = options.clearCatcher;

            options.taskSelection.on('click', (d: SelectableDataPoint) => {
                selectionHandler.handleSelection(d, d3.event.ctrlKey);
                d3.event.stopPropagation();
            });

            clearCatcher.on('click', () => {
                selectionHandler.handleClearSelection();
            });
        }

        public renderSelection(hasSelection: boolean) {
            this.options.taskSelection.style("opacity", (d: SelectableDataPoint) => {
                return (hasSelection && !d.selected) ? Gantt.DefaultValues.MinTaskOpacity : Gantt.DefaultValues.MaxTaskOpacity;
            });
        }
    }

    export class GanttChartWarning implements IVisualWarning {
        public get code(): string {
            return "GanttChartWarning";
        }

        public getMessages(resourceProvider: IStringResourceProvider): IVisualErrorMessage {
            var message: string = "This visual requires task value",
                titleKey: string = "",
                detailKey: string = "",
                visualMessage: IVisualErrorMessage;

            visualMessage = {
                message: message,
                title: resourceProvider.get(titleKey),
                detail: resourceProvider.get(detailKey)
            };

            return visualMessage;
        }
    }
}