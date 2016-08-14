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

module powerbitests.customVisuals {
    import VisualClass = powerbi.visuals.samples.Gantt;
    import VisualBuilderBase = powerbitests.customVisuals.VisualBuilderBase;
    import VisualObjectInstanceEnumerationObject = powerbi.VisualObjectInstanceEnumerationObject;
    import GanttData = customVisuals.sampleDataViews.GanttData;
    import GanttDateType = powerbi.visuals.samples.GanttDateType;
    import valueFormatter = powerbi.visuals.valueFormatter;

    const defaultTaskDuration: number = 1;

    describe("Gantt", () => {
        let visualBuilder: GanttBuilder;
        let defaultDataViewBuilder: GanttData;
        let dataView: powerbi.DataView;

        beforeEach(() => {
            visualBuilder = new GanttBuilder(1000,500);
            defaultDataViewBuilder = new GanttData();
            dataView = defaultDataViewBuilder.getDataView();
        });

        describe("capabilities", () => {
            it("registered capabilities", () => expect(VisualClass.capabilities).toBeDefined());
        });

        describe("DOM tests", () => {

            // function that uses grep to filter
            function grep(val) { 
                return $.grep(val, (e: Element) => e.innerHTML === "" || e.textContent === "");
            }

            it("svg element created", () => {
                expect(visualBuilder.mainElement[0]).toBeInDOM();
            });

            it("update", (done) => {
                visualBuilder.updateRenderTimeout(dataView, () => {
                    let countOfTaskLabels = visualBuilder.tasks
                        .children(".task-resource")
                        .length;
                    let countOfTaskLines = visualBuilder.mainElement
                        .children("g.task-lines")
                        .children("text")
                        .length;
                    let countOfTasks = visualBuilder.tasks.length;

                    expect(countOfTaskLabels).toEqual(dataView.table.rows.length);
                    expect(countOfTaskLines).toEqual(dataView.table.rows.length);
                    expect(countOfTasks).toEqual(dataView.table.rows.length);

                    done();
                });
            });

            it("When Task Element is Missing, empty viewport should be created", (done) => {
                dataView = defaultDataViewBuilder.getDataView([
                    GanttData.ColumnType,
                    GanttData.ColumnStartDate,
                    GanttData.ColumnDuration,
                    GanttData.ColumnResource,
                    GanttData.ColumnCompletePrecntege]);

                visualBuilder.updateRenderTimeout(dataView, () => {
                    let body = d3.select(visualBuilder.element.get(0));

                    expect(body.select(".axis").selectAll("*")[0].length).toEqual(0);
                    expect(body.select(".task-lines").selectAll("*")[0].length).toEqual(0);
                    expect(body.select(".chart .tasks").selectAll("*")[0].length).toEqual(0);
                    done();
                });
            });

            it("When task duration is missing,  it should be set to 1", (done) => {
                dataView = defaultDataViewBuilder.getDataView([
                    GanttData.ColumnType,
                    GanttData.ColumnTask,
                    GanttData.ColumnStartDate,
                    GanttData.ColumnResource,
                    GanttData.ColumnCompletePrecntege]);

                visualBuilder.updateRenderTimeout(dataView, () => {
                    let tasks = d3.select(visualBuilder.element.get(0)).selectAll(".task").data();

                    for (let task of tasks) {
                        expect(task.duration).toEqual(defaultTaskDuration);
                    }

                    done();
                });
            });

            it("When task start time is missing, it should be set to today date", (done) => {
                dataView = defaultDataViewBuilder.getDataView([
                    GanttData.ColumnType,
                    GanttData.ColumnTask,
                    GanttData.ColumnDuration,
                    GanttData.ColumnResource,
                    GanttData.ColumnCompletePrecntege]);

                visualBuilder.updateRenderTimeout(dataView, () => {
                    let tasks = d3.select(visualBuilder.element.get(0)).selectAll(".task").data();

                    for (let task of tasks) {
                        expect(task.start.toDateString()).toEqual(new Date(Date.now()).toDateString());
                    }

                    done();
                });
            });

            it("Task Resource is Missing, not shown on dom", (done) => {
                dataView = defaultDataViewBuilder.getDataView([
                    GanttData.ColumnType,
                    GanttData.ColumnTask,
                    GanttData.ColumnStartDate,
                    GanttData.ColumnDuration,
                    GanttData.ColumnCompletePrecntege]);

                visualBuilder.updateRenderTimeout(dataView, () => {
                    let resources = d3.select(visualBuilder.element.get(0)).selectAll(".task-resource")[0];
                    let returnResource = grep(resources);

                    expect(returnResource.length).toEqual(resources.length);
                    done();
                });
            });

            it("Task Completion is Missing, not shown on dom", (done) => {
                dataView = defaultDataViewBuilder.getDataView([
                    GanttData.ColumnType,
                    GanttData.ColumnTask,
                    GanttData.ColumnStartDate,
                    GanttData.ColumnDuration,
                    GanttData.ColumnResource]);

                visualBuilder.updateRenderTimeout(dataView, () => {
                    let progressOfTasks = d3.select(visualBuilder.element.get(0)).selectAll(".task-progress")[0];
                    let returnTasks = grep(progressOfTasks);

                    expect(progressOfTasks.length).toEqual(returnTasks.length);
                    done();
                });
            });

            it("Verify task labels have tooltips", (done) => {
                defaultDataViewBuilder.valuesTaskTypeResource.forEach(x => x[1] = _.repeat(x[1] + " ", 5).trim());
                dataView = defaultDataViewBuilder.getDataView();

                visualBuilder.updateRenderTimeout(dataView, () => {
                    let taskLabelsInDom = d3.select(visualBuilder.element.get(0)).selectAll(".label title")[0];
                    let taskLabels = d3.select(visualBuilder.element.get(0)).selectAll(".label").data();
                    let tasks = dataView.categorical.categories[1].values;

                    for (let i = 0; i < tasks.length; i++) {
                        expect(taskLabels[i].name).toEqual(taskLabelsInDom[i].textContent);
                        expect(tasks[i]).toEqual(taskLabelsInDom[i].textContent);
                    }

                    done();
                });
            });

            //it("Verify Axis number of ticks", () => {
            //    visualBuilder.update(dataViews);

            //    //sort by startDate if exists
            //    let dateIndex = _.findIndex(dataViews[0].table.columns, col => col.roles.hasOwnProperty("StartDate"));
            //    let durationIndex = _.findIndex(dataViews[0].table.columns, col => col.roles.hasOwnProperty("Duration"));
            //    let MillisecondsInAWeek: number = 604800000;

            //    let minRow: powerbi.DataViewTableRow = _.min(dataViews[0].table.rows, row=> new Date(row[dateIndex]));
            //    let maxRow: powerbi.DataViewTableRow = _.max(dataViews[0].table.rows, row=> new Date(row[dateIndex]).getTime() + row[durationIndex]);

            //    let startDate: Date = new Date(minRow[dateIndex]);
            //    let endDate: Date = new Date(maxRow[dateIndex]);
            //    endDate.setDate(endDate.getDate() + maxRow[durationIndex]);

            //    let allTicks = d3.select(visualBuilder.element.get(0)).selectAll(".axis .tick")[0];
            //    let numOfTicks = allTicks.length;
            //    let weeks: number = Math.ceil(Math.round(endDate.valueOf() - startDate.valueOf()) / MillisecondsInAWeek);
            //    expect(weeks).toEqual(numOfTicks);
            //});

            //it("Verify Axis number of ticks", () => {
            //    visualBuilder.update(dataViews);

            //    //sort by startDate if exists
            //    let dateIndex = _.findIndex(dataViews[0].table.columns, col => col.roles.hasOwnProperty("StartDate"));
            //    let durationIndex = _.findIndex(dataViews[0].table.columns, col => col.roles.hasOwnProperty("Duration"));

            //    let minRow: powerbi.DataViewTableRow = _.min(dataViews[0].table.rows, row=> new Date(row[dateIndex]));
            //    let maxRow: powerbi.DataViewTableRow = _.max(dataViews[0].table.rows, row=> new Date(row[dateIndex]).getTime() + row[durationIndex]);

            //    let startDate: Date = new Date(minRow[dateIndex]);
            //    let endDate: Date = new Date(maxRow[dateIndex]);
            //    endDate.setDate(endDate.getDate() + maxRow[durationIndex]);

            //    let allTicks = d3.select(visualBuilder.element.get(0)).selectAll(".axis .tick")[0];
            //    let numOfTicks = allTicks.length;

            //    let firstTick: Date = new Date(allTicks[0].textContent + " " + startDate.getUTCFullYear());
            //    let endTick: Date = new Date(allTicks[numOfTicks - 1].textContent + " " + endDate.getUTCFullYear());

            //    expect(startDate).toEqual(firstTick);
            //    expect(endDate).toEqual(endTick);
            //});

            it("Verify Font Size set to default", (done) => {
                visualBuilder.updateRenderTimeout(dataView, () => {
                    let resources = d3.select(visualBuilder.element.get(0)).selectAll(".task-resource")[0];
                    let labels = d3.select(visualBuilder.element.get(0)).selectAll(".label")[0];

                    expect(resources[0].style["font-size"]).toEqual("12px");
                    expect(labels[0].style["font-size"]).toEqual("12px");
                    done();
                });
            });

            for(let dateType in GanttDateType) {
                it(`Verify date format (${dateType})`, ((dateType) => (done) => {
                    dataView.metadata.objects = { dateType: { type: dateType } };

                    visualBuilder.updateRenderTimeout(dataView, () => {
                        visualBuilder.axisTicks.children("text").each((i,e) =>
                            expect($(e).text()).toEqual(valueFormatter.format(
                                new Date((<any>e).__data__),
                                VisualClass.DefaultValues.DateFormatStrings[dateType])));
                        done();
                    });
                })(dateType));
            }

            it("Verify group tasks enabled", (done) => {
                dataView.metadata.objects = { general: { groupTasks: true } };

                visualBuilder.updateRenderTimeout(dataView, () => {
                    let countOfTaskLines = visualBuilder.mainElement
                        .children("g.task-lines")
                        .children("text")
                        .length;
                    let values = dataView.categorical.categories[1].values;

                    expect(values.length).toBeGreaterThan(_.unique(values).length);
                    expect(countOfTaskLines).toEqual(_.unique(values).length);

                    done();
                });
            });
        });

        describe("View Model tests", () => {
            it("Test result from enumeration", done => {
                dataView.metadata.objects = { 
                    taskResource: { 
                        show: true,
                        fill: { solid: { color: "#A3A3A3" } }, fontSize: "14px"
                    }
                };

                visualBuilder.updateEnumerateObjectInstancesRenderTimeout(
                    dataView,
                    { objectName: "taskResource" },
                    (result: VisualObjectInstanceEnumerationObject) => {
                        expect(result.instances[0]).toBeDefined();
                        expect(result.instances[0].properties["show"]).toBe(true);
                        expect(result.instances[0].properties["fill"]).toBe("#A3A3A3");
                        expect(result.instances[0].properties["fontSize"]).toBe("14px");
                        done();
                });
            });
        });
    });

    class GanttBuilder extends VisualBuilderBase<VisualClass> {
        constructor(width: number, height: number, isMinervaVisualPlugin: boolean = false) {
            super(width, height, isMinervaVisualPlugin);
        }

        public get mainElement() {
            return this.element
                .children("div.gantt-body")
                .children("svg.gantt");
        }

        public get axis() {
            return this.mainElement.children("g.axis");
        }

        public get axisTicks() {
            return this.axis.children("g.tick");
        }

        public get chart() {
            return this.mainElement.children("g.chart");
        }

        public get tasksGroups() {
            return this.chart
                .children("g.tasks")
                .children("g.task-group");
        }

        public get tasks() {
            return this.tasksGroups.children("g.task");
        }

        protected build() {
            return new VisualClass();
        }
    }
}
