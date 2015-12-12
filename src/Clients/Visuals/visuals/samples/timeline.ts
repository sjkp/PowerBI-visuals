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
module powerbi.visuals.samples {
    import ClassAndSelector = jsCommon.CssConstants.ClassAndSelector;

    export interface TimelineFormat {
        showHeader: boolean;
        leftMargin: number;
        rightMargin: number;
        topMargin: number;
        bottomMargin: number;
        timeRangeSize: number;
        textSize: number;
        cellWidth: number;
        cellHeight: number;
        cellsYPosition: number;
        textYPosition: number;
        cellColor: Fill;
        cellColorOut: Fill;
    }

    export interface TimelineData {
        dataView?: DataView;
        options?: VisualUpdateOptions;
        dragging?: boolean;
        categorySourceName?: string;
        columnIdentity?: powerbi.data.SQExpr;
        timelineDatapoints?: TimelineDatapoint[];
        elementsCount: number;
        granularity: string;
        startDate?: Date;
        endDate?: Date;
        selectionStartDate?: Date;
        selectionEndDate?: Date;
        cursorDataPoints: CursorDatapoint[];
        granuralityChanged: boolean;
    }

    export interface CursorDatapoint {
        cursorIndex: number;
        dx: number;
    }

    export interface TimelineDatapoint {
        label: string;
        isAdditional: boolean;
        index: number;
        unitIndex: number;
        dateStart: Date;
        dateEnd: Date;
        fillPart: number;
        dx: number;
        dx2: number;
    }

    export class Timeline implements IVisual {
        public static capabilities: VisualCapabilities = {
            dataRoles: [{
                name: 'Time',
                kind: powerbi.VisualDataRoleKind.Grouping,
                displayName: 'Time',
            }],
            dataViewMappings: [{
                conditions: [
                    { 'Time': { max: 1 } }//,'Value': { max: 1 }}
                ],
                categorical: {
                    categories: {
                        for: { in: 'Time' },
                        dataReductionAlgorithm: { sample: {} }
                    },
                    values: {
                        select: []
                    },
                }
            }],
            objects: {
                general: {
                    displayName: data.createDisplayNameGetter('Visual_General'),
                    properties: {
                        formatString: {
                            type: {
                                formatting: {
                                    formatString: true
                                }
                            },
                        },
                        selected: {
                            type: { bool: true }
                        },
                        filter: {
                            type: { filter: {} },
                            rule: {
                                output: {
                                    property: 'selected',
                                    selector: ['Time'],
                                }
                            }
                        },
                    },
                },
                header: {
                    displayName: data.createDisplayNameGetter('Visual_Header'),
                    properties: {
                        show: {
                            displayName: data.createDisplayNameGetter('Visual_Show'),
                            type: { bool: true }
                        },
                        fontColor: {
                            displayName: data.createDisplayNameGetter('Visual_FontColor'),
                            type: { fill: { solid: { color: true } } }
                        },
                    }
                },
                granularity: {
                    displayName: 'Granularity',
                    properties: {
                        types: {
                            displayName: 'Type',
                            type: { text: true }
                        },
                    }
                },
                timeRangeColor: {
                    displayName: 'Time Range Text Color',
                    properties: {
                        fill: {
                            displayName: 'Fill',
                            type: { fill: { solid: { color: true } } }
                        }
                    }
                },
                cellColorOut: {
                    displayName: 'Cells',
                    properties: {
                        fill: {
                            displayName: 'Fill out selected',
                            type: { fill: { solid: { color: true } } }
                        }
                    }
                },
                cellColor: {
                    displayName: 'Cells selected',
                    properties: {
                        fill: {
                            displayName: 'Fill selected',
                            type: { fill: { solid: { color: true } } }
                        }
                    }
                },
            }
        };
        private static monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        private static VisualClassName = 'Timeline';

        private static TimelineContainer: ClassAndSelector = {
            class: 'timelineContainer',
            selector: '.timelineContainer'
        };
        private static Header: ClassAndSelector = {
            class: 'header',
            selector: '.header'
        };
        private static CellContainer: ClassAndSelector = {
            class: 'cellContainer',
            selector: '.cellContainer'
        };
        private static CellTextLevel1: ClassAndSelector = {
            class: 'cellTextLevel1',
            selector: '.cellTextLevel1'
        };
        private static CellTextLevel2: ClassAndSelector = {
            class: 'cellTextLevel2',
            selector: '.cellTextLevel2'
        };
        private static Cursor: ClassAndSelector = {
            class: 'cursor',
            selector: '.cursor'
        };
        private static Cell: ClassAndSelector = {
            class: 'cell',
            selector: '.cell'
        };
        private static Clear: ClassAndSelector = {
            class: 'clear',
            selector: '.clear'
        };
        private static SelectionRange: ClassAndSelector = {
            class: 'selectionRange',
            selector: '.selectionRange'
        };

        public timelineFormat: TimelineFormat;
        public timelineData: TimelineData;
        private hostServices: IVisualHostServices;
        private svg: D3.Selection;
        private body: D3.Selection;
        private header: D3.Selection;
        private headerTextContainer: D3.Selection;
        private rangeText: D3.Selection;
        private mainGroupElement: D3.Selection;
        private cursorGroupElement: D3.Selection;
        private selectorContainer: D3.Selection;
        private options: VisualUpdateOptions;
        private dataView: DataView;
        private periodSlicerRect: D3.Selection;
        private selectedText: D3.Selection;
        private selector = ['Y', 'Q', 'M', 'D'];
        private selectorNames = ['year', 'quarter', 'month', 'day'];

        public static isIE(): boolean {
            var ua = navigator.userAgent, tem,
                M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return true;//'IE '+(tem[1] || '');
            }
            if (M[1] === 'Chrome') {
                tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
                if (tem !== null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
            }
            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
            if ((tem = ua.match(/version\/(\d+)/i)) !== null) M.splice(1, 1, tem[1]);
            return false;
        }

        public init(options: VisualInitOptions): void {
            this.hostServices = options.host;
            var dafaultSelection = "month";
            var dafaultSelectionIndex = 2;
            this.timelineData = { granuralityChanged: false, elementsCount: 0, granularity: dafaultSelection, timelineDatapoints: [], cursorDataPoints: new Array<CursorDatapoint>() };
            this.timelineData.cursorDataPoints.push({ dx: 0, cursorIndex: 0 });
            this.timelineData.cursorDataPoints.push({ dx: 0, cursorIndex: 1 });
            var msie = Timeline.isIE();
            var element = options.element;
            this.timelineFormat = {
                showHeader: true,
                leftMargin: 15,
                rightMargin: 15,
                topMargin: 8,
                bottomMargin: 10,
                timeRangeSize: 11,
                textSize: 11,
                cellWidth: 40,
                cellHeight: 25,
                textYPosition: 0,
                cellsYPosition: 0,
                cellColor: { solid: { color: '#ADD8E6' } },
                cellColorOut: { solid: { color: '#A4C7F2' } }
            };

            this.timelineFormat.textYPosition = this.timelineFormat.topMargin * 2 + this.timelineFormat.timeRangeSize;
            this.timelineFormat.cellsYPosition = this.timelineFormat.topMargin * 3 + this.timelineFormat.textSize * 2 + this.timelineFormat.timeRangeSize;

            if (msie) {
                this.timelineFormat.bottomMargin = 25;
            }

            this.timelineFormat.textYPosition = this.timelineFormat.topMargin * 2 + this.timelineFormat.timeRangeSize;
            this.timelineFormat.cellsYPosition = this.timelineFormat.topMargin * 3 + this.timelineFormat.textSize * 2 + this.timelineFormat.timeRangeSize;

            var timelineContainer = d3.select(element.get(0)).append('div').classed(Timeline.TimelineContainer.class, true).style({
                'overflow-y': 'auto',
                'position': 'relative'
            });
            var header = timelineContainer.append('div').classed(Timeline.Header.class, true);
            this.header = header;

            var body = this.body = timelineContainer.append('div').classed(Timeline.CellContainer.class, true);
            this.rangeText = body.append('div')
                .style({
                    'float': 'left',
                    'position': 'absolute',
                    'left': '10px'
                });
            d3.select(element.get(0)).append('div')
                .classed(Timeline.Clear.class, true)
                .attr('title', 'clear')
                .style({
                    'top': '8px',
                    'right': '5px',
                    'position': 'absolute',
                    'background-image': "url(\"https://raw.githubusercontent.com/Microsoft/PowerBI-visuals/master/src/Clients/Visuals/images/sprite-src/slicer_reset.png\")",
                    'background-position': '0px 0px',
                    'width': '13px',
                    'height': '12px',
                    'cursor': 'pointer'
                }).on("click", (d: SelectableDataPoint) => {
                    var objects: VisualObjectInstancesToPersist = {
                        merge: [
                            <VisualObjectInstance>{
                                objectName: "general",
                                selector: undefined,
                                properties: {
                                    "filter": undefined
                                }
                            }
                        ]
                    };
                    this.hostServices.persistProperties(objects);
                    this.hostServices.onSelect({ data: [] });
                });

            var that: any;
            that = this;

            var svg = this.svg = body
                .append('svg')
                .attr('width', options.viewport.width)
                .classed(Timeline.VisualClassName, true);
            var hederTextContainer = this.headerTextContainer = this.header.append('div');
            hederTextContainer.append('g')
                .attr('transform', "translate(0,10)")
                .append('text')
                .attr({
                    'x': 20,
                    'y': 10
                });

            this.mainGroupElement = svg.append('g');
            this.cursorGroupElement = svg.append('g');
            var slicerSelectorDiv = d3.select(element.get(0)).append('div').style({
                'position': 'absolute',
                'width': '120px',
                'height': '45px',
                'top': '0px',
                'right': '17px'
            });
            var slicerSVG = slicerSelectorDiv.append('svg').attr('width', 120).attr('height', 45);
            this.selectorContainer = slicerSVG.append('g');

            var startXpoint = 10;
            var startYpoint = 20;
            var elementWidth = 30;

            var fillRect = this.selectorContainer.append('rect');
            var selectorPeriods = this.selector;
            fillRect.attr('height', 1)
                .attr('x', startXpoint)
                .attr('y', startYpoint + 2)
                .attr('width', (selectorPeriods.length - 1) * elementWidth)
                .attr('fill', '#000000');

            var fillVertLine = this.selectorContainer.selectAll("vertLines")
                .data(selectorPeriods).enter().append('rect');
            fillVertLine
                .attr('x', function(d) { return startXpoint + selectorPeriods.indexOf(d) * elementWidth; })
                .attr('y', startYpoint)
                .attr('width', 2)
                .attr('height', 3)
                .attr('fill', '#000000')
                .style({ 'cursor': 'pointer' });

            var text = this.selectorContainer.selectAll("selperiodtext")
                .data(selectorPeriods)
                .enter()
                .append("text");
            //Add SVG Text Element Attributes
            var textLabels: any;
            textLabels = text
                .attr("x", function(d) { return (startXpoint - 3) + selectorPeriods.indexOf(d) * elementWidth; })
                .attr("y", startYpoint - 3)
                .text(function(d) { return d; })
                .attr("font-family", "sans-serif")
                .attr("font-size", "10px")
                .attr("fill", "black");

            this.selectedText = this.selectorContainer.append("text");
            this.selectedText.attr("x", startXpoint + 35)
                .attr("y", startYpoint + 17)
                .text(dafaultSelection)
                .attr("font-family", "sans-serif")
                .attr("font-size", "10px")
                .attr("fill", "black");

            var selRects = this.selectorContainer.selectAll("selRects")
                .data(selectorPeriods).enter().append('rect');
            selRects
                .attr('x', function(d) { return (startXpoint - elementWidth / 2) + selectorPeriods.indexOf(d) * elementWidth; })
                .attr('y', 3)
                .attr('width', elementWidth)
                .attr('height', 23)
                .attr('fill', 'transparent')
                .style({ 'cursor': 'pointer' })
                //.style({"stroke":'#aaa', 'stroke-width':'2'})
                .on('click', (d) => {
                    this.selectPriod(d, startXpoint + selectorPeriods.indexOf(d) * elementWidth);
                });

            this.periodSlicerRect = this.selectorContainer
                .append('rect')
                .attr('x', startXpoint - 6 + dafaultSelectionIndex * elementWidth)
                .attr('y', startYpoint - 16)
                .attr('rx', 4)
                .attr('width', 15)
                .attr('height', 23)
                .style({ "stroke": '#aaa', 'stroke-width': '2' })
                .attr("fill", "transparent");
        }

        public selectPriod(periodName, dx) {
            this.periodSlicerRect.transition()
                .attr("x", dx - 7);
            var longName = this.selectorNames[this.selector.indexOf(periodName)];
            this.selectedText.text(longName);
            this.timelineData.granularity = longName;
            this.timelineData.granuralityChanged = true;
            this.update(this.options);
        }

        public static converter(timelineData: TimelineData, timelineFormat: TimelineFormat): void {
            var showHeader = false;
            var dataView = timelineData.dataView;
            if (dataView && dataView.metadata.objects) {
                var header = dataView.metadata.objects['header'];
                if (header && header['show'] !== undefined) {
                    showHeader = <boolean>header['show'];
                }
            }
            timelineFormat.showHeader = showHeader;
            timelineData.categorySourceName = dataView.categorical.categories[0].source.displayName;

            if (dataView.categorical.categories.length <= 0 || dataView.categorical.categories[0] === undefined || dataView.categorical.categories[0].identityFields === undefined || dataView.categorical.categories[0].identityFields.length <= 0) return;
            timelineData.columnIdentity = dataView.categorical.categories[0].identityFields[0];
            var timesLine = timelineData.dataView.categorical.categories[0].values;

            if (timesLine.length <= 0) return;
            if (timesLine[0].getTime === undefined) return;

            timelineData.startDate = new Date(timesLine[0].getTime());
            timelineData.selectionStartDate = new Date(timesLine[0].getTime());
            timelineData.endDate = new Date(timesLine[timesLine.length - 1].getTime());
            // timelineData.endDate.setHours(23,59,59,999);
            timelineData.selectionEndDate = new Date(timesLine[timesLine.length - 1].getTime());
            //timelineData.selectionEndDate.setHours(23,59,59,999);
            var item: any = dataView.metadata.objects;
            if (dataView.metadata.objects && item.general && item.general.filter
                && item.general.filter.whereItems && item.general.filter.whereItems[0]
                && item.general.filter.whereItems && item.general.filter.whereItems[0].condition) {
                var filterStartDate = item.general.filter.whereItems[0].condition.lower.value;
                var filterEndDate = item.general.filter.whereItems[0].condition.upper.value;
                timelineData.selectionStartDate = new Date(filterStartDate.getTime());
                timelineData.selectionEndDate = new Date(filterEndDate.getTime());
            }
            // if(timelineData.startDate > timelineData.selectionStartDate)
            //    timelineData.selectionStartDate = new Date(timelineData.startDate.getTime());
            // if(timelineData.endDate < timelineData.selectionEndDate)
            //    timelineData.selectionEndDate = timelineData.endDate;

            // timelineData.selectionEndDate.setHours(23,59,59,999);

            var rangeTextColor: Fill = { solid: { color: '#333333' } };
            if (dataView && dataView.metadata.objects) {
                var label = dataView.metadata.objects['timeRangeColor'];
                if (label && label['fill']) {
                    rangeTextColor = <Fill>label['fill'];
                }
            }

            var cellColor: Fill = { solid: { color: '#ADD8E6' } };
            var cellColorOut: Fill = { solid: { color: '#A4C7F2' } };

            if (dataView && dataView.metadata.objects) {
                var cellColorObj = dataView.metadata.objects['cellColor'];
                var cellColorOutObj = dataView.metadata.objects['cellColorOut'];
                if (cellColorObj && cellColorObj['fill']) {
                    cellColor = <Fill>cellColorObj['fill'];
                }
                if (cellColorOutObj && cellColorOutObj['fill']) {
                    cellColorOut = <Fill>cellColorOutObj['fill'];
                }
            }
            timelineFormat.cellColor = cellColor;
            timelineFormat.cellColorOut = cellColorOut;

            timelineData.elementsCount = 0;
            switch (timelineData.granularity) {
                case "day":
                    timelineData.elementsCount = Math.round(Math.abs(timelineData.startDate.getTime() - timelineData.endDate.getTime()) / (1000 * 60 * 60 * 24)); // devide per one day
                    break;
                case "month":
                    timelineData.elementsCount = (timelineData.endDate.getFullYear() - timelineData.startDate.getFullYear()) * 12;
                    timelineData.elementsCount += timelineData.endDate.getMonth() - timelineData.startDate.getMonth();
                    timelineData.elementsCount = timelineData.elementsCount <= 0 ? 0 : timelineData.elementsCount;
                    break;
                case "quarter":
                    timelineData.elementsCount = (timelineData.endDate.getFullYear() - timelineData.startDate.getFullYear()) * 12;
                    timelineData.elementsCount += timelineData.endDate.getMonth() - timelineData.startDate.getMonth();
                    timelineData.elementsCount = timelineData.elementsCount <= 0 ? 0 : timelineData.elementsCount;
                    timelineData.elementsCount = Math.ceil(timelineData.elementsCount / 3);
                    break;
                case "year":
                    timelineData.elementsCount = timelineData.endDate.getFullYear() - timelineData.startDate.getFullYear();
                    break;
            }
            timelineData.timelineDatapoints = [];
            var realIndex = 0;
            for (var i = 0, len = timelineData.elementsCount; i <= len; i++) {
                var dateStart: Date;
                var dateEnd: Date;
                switch (timelineData.granularity) {
                    case "day":
                        dateStart = new Date(timelineData.startDate.getTime());
                        dateStart.setDate(dateStart.getDate() + i);
                        dateEnd = dateStart;
                        break;
                    case "month":
                        var y = timelineData.startDate.getFullYear();
                        var m = timelineData.startDate.getMonth();
                        dateStart = new Date(y, m + i, 1);
                        dateEnd = new Date(y, m + i + 1, 0);
                        break;
                    case "quarter":
                        var y = timelineData.startDate.getFullYear();
                        var m = timelineData.startDate.getMonth();
                        var q = Math.floor(m / 3);
                        m = q * 3;
                        dateStart = new Date(y, m + (i * 3), 1);
                        dateEnd = new Date(y, m + 3 + (i * 3), 0);
                        break;
                    case "year":
                        var y = timelineData.startDate.getFullYear() + i;
                        dateStart = new Date(y, 0, 1);
                        dateEnd = new Date(y, 12, 0);
                        break;
                }
                // dateEnd.setHours(23,59,59,999);
                var partValue = 0;
                var dX = timelineFormat.cellWidth * i;
                var dX2 = timelineFormat.cellWidth * (i + 1);

                if (timelineData.granuralityChanged) {
                    if (dateStart.getTime() === timelineData.selectionStartDate.getTime())
                        timelineData.cursorDataPoints[0].dx = dX;
                    if (dateEnd.getTime() === timelineData.selectionEndDate.getTime())
                        timelineData.cursorDataPoints[1].dx = dX2;
                }
                var isPartial = false;
                var partSized = 0;
                if (dateStart.getTime() < timelineData.selectionStartDate.getTime() && timelineData.selectionStartDate.getTime() <= dateEnd.getTime()) {
                    partValue = (dateEnd.getTime() - timelineData.selectionStartDate.getTime()) / (dateEnd.getTime() - dateStart.getTime()); // the part
                    isPartial = true;
                    var partValueStart = 1 - partValue;
                    var selPrevDate = new Date(timelineData.selectionStartDate.getTime() - 24 * 60 * 60 * 1000);//prev day
                    var datapoint: TimelineDatapoint = {
                        isAdditional: true,
                        dateStart: dateStart,
                        dateEnd: selPrevDate,
                        label: dataView.categorical.categories[0].values[i],
                        index: realIndex,
                        unitIndex: i,
                        fillPart: partValueStart,
                        dx: dX,
                        dx2: dX + timelineFormat.cellWidth * partValueStart
                    };
                    partSized = timelineFormat.cellWidth * partValue;
                    dX = datapoint.dx2;
                    timelineData.cursorDataPoints[0].dx = dX;
                    timelineData.timelineDatapoints.push(datapoint);
                    dateStart = new Date(timelineData.selectionStartDate.getTime());
                    realIndex = realIndex + 1;
                }
                var partialDatapointEnd: TimelineDatapoint = undefined;
                if (dateStart.getTime() <= timelineData.selectionEndDate.getTime() && timelineData.selectionEndDate.getTime() < dateEnd.getTime()) {
                    isPartial = true;
                    var partValueEnd = (dateEnd.getTime() - timelineData.selectionEndDate.getTime()) / (dateEnd.getTime() - (timelineData.selectionStartDate.getTime() > dateStart.getTime() ? timelineData.selectionStartDate.getTime() : dateStart.getTime())); // the part
                    partValue = 1 - partValueEnd;
                    var selNextDate = new Date(timelineData.selectionEndDate.getTime() + 24 * 60 * 60 * 1000);//prev day
                    partialDatapointEnd = {
                        isAdditional: true,
                        dateStart: selNextDate,
                        dateEnd: dateEnd,
                        label: dataView.categorical.categories[0].values[i],
                        index: realIndex,
                        unitIndex: i,
                        fillPart: partValueEnd,
                        dx: dX + (timelineFormat.cellWidth - partSized) - (timelineFormat.cellWidth - partSized) * partValueEnd,
                        dx2: dX2
                    };
                    timelineData.cursorDataPoints[1].dx = partialDatapointEnd.dx;
                    dateEnd = new Date(timelineData.selectionEndDate.getTime());
                }
                var datapoint: TimelineDatapoint = {
                    isAdditional: false,
                    dateStart: dateStart,
                    dateEnd: dateEnd,
                    label: dataView.categorical.categories[0].values[i],
                    index: realIndex,
                    unitIndex: i,
                    fillPart: partValue,
                    dx: dX,
                    dx2: dX2
                };
                timelineData.timelineDatapoints.push(datapoint);

                if (partialDatapointEnd) {
                    realIndex = realIndex + 1;
                    timelineData.timelineDatapoints.push(partialDatapointEnd);
                    datapoint = partialDatapointEnd;
                }

                if (datapoint.dateStart <= timelineData.selectionStartDate)
                    timelineData.cursorDataPoints[0].dx = datapoint.dx;

                if (datapoint.dateEnd <= timelineData.selectionEndDate)
                    timelineData.cursorDataPoints[1].dx = datapoint.dx2;

                realIndex = realIndex + 1;
            }

            if (timelineData.granuralityChanged) {
                timelineData.granuralityChanged = false;
            }
        }

        public update(options: VisualUpdateOptions) {

            this.timelineData.granuralityChanged = true;
            this.options = options;
            if (!options.dataViews || !options.dataViews[0]) return; // or clear the view, display an error, etc.

            var dataView: any;
            dataView = this.dataView = options.dataViews[0];

            this.timelineData.dataView = options.dataViews[0];
            this.timelineData.options = options;
            //this.selectorContainer.attr('transform','translate('+(this.timelineData.options.viewport.width-130)+','+17+')')     

            Timeline.converter(this.timelineData, this.timelineFormat);
            this.render(this.timelineData, this.timelineFormat);
        }

        private render(timelineData: TimelineData, timelineFormat: TimelineFormat): void {
            var viewport = timelineData.options.viewport;
            if (this.timelineFormat.showHeader) {
                this.headerTextContainer.style('display', 'block');
                this.headerTextContainer
                    .style({
                        'color': this.getHeaderFill(timelineData.dataView).solid.color,
                        'font-size': timelineFormat.timeRangeSize + 'px',
                        'border-style': "solid",
                        'border-width': "0px 0px 2px",
                        'border-color': "black"
                    }).text(timelineData.categorySourceName)
                    .attr({
                        'height': timelineFormat.topMargin + timelineFormat.textSize + timelineFormat.bottomMargin,
                        'width': viewport.width - timelineFormat.rightMargin
                    });
            } else {
                this.headerTextContainer.style('display', 'none');
            }
            this.renderTimeRangeText(timelineData, timelineFormat);
            var bodyHeight = timelineFormat.topMargin * 3 + timelineFormat.timeRangeSize + timelineFormat.cellHeight + timelineFormat.textSize * 2 + timelineFormat.bottomMargin;
            this.body.attr({
                'height': bodyHeight,
                'width': viewport.width,
                'drag-resize-disabled': true
            })
                .style({
                    'overflow-x': 'auto',
                    'overflow-y': 'auto'
                });

            var svgWidth = timelineFormat.leftMargin + timelineFormat.cellWidth * timelineData.timelineDatapoints.length + timelineFormat.rightMargin;
            if (this.timelineData.options.viewport.width > svgWidth)
                svgWidth = this.timelineData.options.viewport.width;

            this.svg
                .attr({
                    'height': bodyHeight,
                    'width': svgWidth
                });
            this.mainGroupElement.attr('transform', "translate(" + timelineFormat.leftMargin + "," + timelineFormat.topMargin + ")");
            this.cursorGroupElement.attr('transform', "translate(" + timelineFormat.leftMargin + "," + timelineFormat.topMargin + ")");
            //this.selectorContainer.attr('transform', 'translate('+timelineFormat.leftMargin + "," + timelineFormat.topMargin +')');

            this.renderCells(timelineData, timelineFormat);
            this.renderCellLabels(timelineData, timelineFormat);
            this.renderCursors(timelineData, timelineFormat);
        }

        public fillCells() {
            var dataPoints = this.timelineData.timelineDatapoints;
            var cellSelection = this.mainGroupElement.selectAll(Timeline.Cell.selector)
                .data(dataPoints);
            cellSelection
                .attr('fill', d => Timeline.getCellColor(d, this.timelineData, this.timelineFormat));
        }
        public currentlyMouceOverElement;
        public cellMouseOver(datapoint) {
            this.currentlyMouceOverElement = datapoint;
            //console.log("over here" + this.currentlyMouceOverElement.index);
        }

        public renderCells(timelineData: TimelineData, timelineFormat: TimelineFormat): D3.UpdateSelection {
            var duration = timelineData.options.suppressAnimations ? 0 : AnimatorCommon.MinervaAnimationDuration;
            var dataPoints = timelineData.timelineDatapoints;
            this.mainGroupElement.selectAll(Timeline.Cell.selector).remove();
            var cellSelection = this.mainGroupElement.selectAll(Timeline.Cell.selector).data(dataPoints);

            cellSelection.enter()
                .append('rect').attr('stroke', '#333444')
                .classed(Timeline.Cell.class, true)
                .transition().duration(duration)
                .attr('height', timelineFormat.cellHeight)
                .attr('width', (d) => {
                    return d.fillPart > 0 ? timelineFormat.cellWidth * d.fillPart : timelineFormat.cellWidth;
                })
                .attr('x', (d) => {
                    return d.dx;
                })
                .attr('y', timelineFormat.cellsYPosition);
            cellSelection.on('click', (d: TimelineDatapoint) => {
                d3.event.preventDefault();
                var cursorDataPoints = this.timelineData.cursorDataPoints;
                var keyEvent: any = d3.event;
                if (keyEvent.altKey || keyEvent.shiftKey) {

                    if (cursorDataPoints[0].dx < d.dx) {
                        cursorDataPoints[1].dx = d.dx2;
                        timelineData.selectionEndDate = d.dateEnd;
                    }
                    else {
                        cursorDataPoints[0].dx = d.dx;
                        timelineData.selectionStartDate = d.dateStart;
                    }

                } else {
                    timelineData.selectionStartDate = d.dateStart;
                    timelineData.selectionEndDate = d.dateEnd;
                    cursorDataPoints[0].dx = d.dx;
                    cursorDataPoints[1].dx = d.dx2;
                }
                this.fillCells();
                this.renderCursors(this.timelineData, this.timelineFormat);
                this.setSelection(timelineData);
            });
            cellSelection.on("mouseover", (d) => { this.cellMouseOver(d); });

            this.fillCells();
            cellSelection.exit().remove();
            return cellSelection;
        }

        public dragstarted(d, that) {
            //console.log('drag start');
            that.timelineData.dragging = true;
        }

        public dragged(d, that) {
            //console.log('dragged');
            if (that.timelineData.dragging === true) {
                var xScale = 1;
                var yScale = 1;
                var container = d3.select(".timelineContainer");
                if (container !== undefined) {
                    var transform = container.style("transform");
                    if (transform !== undefined && transform !== 'none') {
                        var str = transform.split("(")[1];
                        xScale = Number(str.split(", ")[0]);
                        yScale = Number(str.split(", ")[3]);
                    }
                }
                var clientX = d3.event.sourceEvent.x === undefined ? d3.event.sourceEvent.clientX : d3.event.sourceEvent.x;
                var xCoord = (clientX - that.mainGroupElement.node().getBoundingClientRect().left) / xScale;
                if (Timeline.isIE() === true) {
                    xCoord = d3.event.sourceEvent.x / xScale + (d3.select(".cellContainer").node().scrollLeft);
                }
                //var index = Math.floor(xCoord / that.timelineFormat.cellWidth) + d.cursorIndex;
                // get actual cell by index
                var exactDataPoint = this.currentlyMouceOverElement;
                if (d.cursorIndex === 0 && exactDataPoint
                    && exactDataPoint.dx2 <= that.timelineData.cursorDataPoints[1].dx
                ) {
                    that.timelineData.selectionStartDate = exactDataPoint.dateStart;
                    that.timelineData.cursorDataPoints[0].dx = exactDataPoint.dx;
                    console.log("cursor 0 dindex:" + d.dx + " selecetiondateStart:" + that.timelineData.selectionStartDate);
                }
                if (d.cursorIndex === 1 && exactDataPoint
                    && exactDataPoint.dx >= that.timelineData.cursorDataPoints[0].dx
                ) {
                    that.timelineData.selectionEndDate = exactDataPoint.dateEnd;
                    that.timelineData.cursorDataPoints[1].dx = exactDataPoint.dx2;
                    console.log("cursor 1 dindex:" + d.dx + " selecetiondateEnd:" + that.timelineData.selectionEndDate);
                }
                this.fillCells();
                this.renderCursors(this.timelineData, this.timelineFormat);
            }
        }

        public dragended(d, that) {
            //console.log('drag end');
            this.setSelection(that.timelineData);
        }

        private drag = d3.behavior.drag()
            .origin(function(d) {
                return d;
            })
            .on("dragstart", (d) => { this.dragstarted(d, this); })
            .on("drag", (d) => { this.dragged(d, this); })
            .on("dragend", (d) => { this.dragended(d, this); });

        public renderCursors(timelineData: TimelineData, timelineFormat: TimelineFormat): D3.UpdateSelection {

            this.cursorGroupElement.selectAll(Timeline.Cursor.selector).remove();
            var cursorSelection = this.cursorGroupElement.selectAll(Timeline.Cursor.selector).data(timelineData.cursorDataPoints);
            cursorSelection.enter().append('path').classed(Timeline.Cursor.class, true).attr("d",
                d3.svg.arc()
                    .innerRadius(0)
                    .outerRadius(timelineFormat.cellHeight / 2)
                    .startAngle(d=> d.cursorIndex * Math.PI + Math.PI) //converting from degs to radians
                    .endAngle(d=> d.cursorIndex * Math.PI + 2 * Math.PI)
            )
                .attr('fill', 'grey')
                .attr("transform", function(d) {
                    //console.log("translate(" + d.dx + "," + (timelineFormat.cellHeight / 2 + timelineFormat.cellsYPosition) + ")");
                    return "translate(" + d.dx + "," + (timelineFormat.cellHeight / 2 + timelineFormat.cellsYPosition) + ")";
                });
            cursorSelection.call(this.drag);
            cursorSelection.exit().remove();

            var offsetScrollWidth = this.body[0][0].scrollLeft;
            var fullViewPortWidth = Number(offsetScrollWidth) + Number(timelineData.options.viewport.width);

            if (timelineData.cursorDataPoints[0].dx < offsetScrollWidth || timelineData.cursorDataPoints[0].dx > fullViewPortWidth) {
                this.body[0][0].scrollLeft = timelineData.cursorDataPoints[0].dx;
            }
            return cursorSelection;
        }

        public renderCellLabels(timelineData: TimelineData, timelineFormat: TimelineFormat): D3.UpdateSelection {
            var dataPoints = timelineData.timelineDatapoints.filter((d) => {
                return !d.isAdditional;
            });
            this.mainGroupElement.selectAll(Timeline.CellTextLevel1.selector).remove();
            var cellTextSelection = this.mainGroupElement.selectAll(Timeline.CellTextLevel1.selector)
                .data(dataPoints);
            cellTextSelection.enter()
                .append('text')
                .classed(Timeline.CellTextLevel1.class, true)
                .text(function(d) {
                    switch (timelineData.granularity) {
                        case 'day':
                            if (d.dateStart.getDate() === 1) {
                                return Timeline.monthNames[d.dateStart.getMonth()] + " " + d.dateStart.getFullYear();
                            } else {
                                return "";
                            }
                            break;
                        case 'quarter':
                            if (d.dateStart.getDate() === 1) {
                                return d.dateStart.getFullYear();
                            } else {
                                return "";
                            }
                            break;
                        case 'year':
                            if (d.dateStart.getMonth() === 1) {
                                return d.dateStart.getFullYear();
                            } else {
                                return "";
                            }
                            break;
                    }
                })
                .attr({
                    'x': d => (
                        timelineFormat.cellWidth * (d.unitIndex + 0.5)), 'y': timelineFormat.textYPosition
                })
                .attr('text-anchor', "middle")
                .style({ 'font-size': timelineFormat.textSize + 'px', 'fill': '#777777' });
            cellTextSelection.exit().remove();

            this.mainGroupElement.selectAll(Timeline.CellTextLevel2.selector).remove();
            var cellTextLevel2Selection = this.mainGroupElement.selectAll(Timeline.CellTextLevel2.selector).data(dataPoints);
            cellTextLevel2Selection.enter().append('text').classed(Timeline.CellTextLevel2.class, true)
                .text((d) => {
                    switch (timelineData.granularity) {
                        case 'day':
                            return d.dateStart.getDate();
                        case 'quarter':
                            return "Q" + (Math.floor(d.dateEnd.getMonth() / 3) + 1);
                        case 'month':
                            return Timeline.monthNames[d.dateStart.getMonth()];
                        case 'year':
                            return d.dateStart.getFullYear();
                    }
                })
                .attr({ 'x': d => (timelineFormat.cellWidth * (d.unitIndex + 0.5)), 'y': timelineFormat.topMargin + timelineFormat.textSize + timelineFormat.textYPosition })
                .attr('text-anchor', "middle")
                .style({ 'font-size': timelineFormat.textSize + 'px', 'fill': '#777777' });
            cellTextLevel2Selection.exit().remove();
            return cellTextSelection;
        }

        public renderTimeRangeText(timelineData: TimelineData, timelineFormat: TimelineFormat) {
            var timeRangeText = '';
            if (timelineData.selectionStartDate === undefined || timelineData.selectionEndDate === undefined) return;

            switch (timelineData.granularity) {
                case "day": timeRangeText = Timeline.monthNames[timelineData.selectionStartDate.getMonth()] + ' ' + timelineData.selectionStartDate.getDate() + ' ' + timelineData.selectionStartDate.getFullYear() + ' - ' +
                    Timeline.monthNames[timelineData.selectionEndDate.getMonth()] + ' ' + timelineData.selectionEndDate.getDate() + ' ' + timelineData.selectionEndDate.getFullYear();
                    break;
                case "month":
                    timeRangeText = Timeline.monthNames[timelineData.selectionStartDate.getMonth()] + ' ' + timelineData.selectionStartDate.getFullYear() + ' - ' + Timeline.monthNames[timelineData.selectionEndDate.getMonth()] + ' ' + timelineData.selectionEndDate.getFullYear();
                    break;
                case "quarter":
                    var Qstart = (Math.ceil((timelineData.selectionStartDate.getMonth() + 1) / 3));
                    var QEnd = (Math.ceil((timelineData.selectionEndDate.getMonth() + 1) / 3));
                    timeRangeText = 'Q' + Qstart + ' ' + timelineData.selectionStartDate.getFullYear() + ' - Q' + QEnd + ' ' + timelineData.selectionEndDate.getFullYear();
                    break;
                case "year":
                    timeRangeText = timelineData.selectionStartDate.getFullYear() + ' - ' + timelineData.selectionEndDate.getFullYear();
                    break;
            }
            this.rangeText.selectAll(Timeline.SelectionRange.selector).remove();
            var textColor = this.getTimeRangeColorFill(this.dataView).solid.color;
            this.rangeText.append('text').classed(Timeline.SelectionRange.class, true).style({
                'font-size': timelineFormat.timeRangeSize + 'px',
                'color': textColor
            }).text(timeRangeText);
        }

        public static getCellColor(d: TimelineDatapoint, timelineData: TimelineData, timelineFormat: TimelineFormat) {
            var cellColor = timelineFormat.cellColor;
            var cellColorOut = timelineFormat.cellColorOut;
            if (d.dateStart >= timelineData.selectionStartDate && d.dateEnd <= timelineData.selectionEndDate) {
                return cellColor.solid.color;
            }
            else {
                return cellColorOut.solid.color;
            }
        }

        public getTimeRangeColorFill(dataView: DataView): Fill {
            if (dataView && dataView.metadata.objects) {
                var label = dataView.metadata.objects['timeRangeColor'];
                if (label) {
                    return <Fill>label['fill'];
                }
            }
            return { solid: { color: '#333222' } };
        }

        public getHeaderFill(dataView: DataView): Fill {
            var headerColor: Fill = { solid: { color: '#333111' } };
            if (dataView && dataView.metadata.objects) {
                var header = dataView.metadata.objects['header'];
                if (header && header['fontColor']) {
                    headerColor = header['fontColor'];
                }
            }

            return headerColor;
        }

        public setSelection(timelineData: TimelineData) {

            var filterExpr = powerbi.data.SQExprBuilder.between(timelineData.columnIdentity, powerbi.data.SQExprBuilder.dateTime(timelineData.selectionStartDate), powerbi.data.SQExprBuilder.dateTime(timelineData.selectionEndDate));
            var filter = powerbi.data.SemanticFilter.fromSQExpr(filterExpr);

            var objects: VisualObjectInstancesToPersist = {
                merge: [
                    <VisualObjectInstance>{
                        objectName: "general",
                        selector: undefined,
                        properties: {
                            "filter": filter
                        }
                    }
                ]
            };
            this.hostServices.persistProperties(objects);
            this.hostServices.onSelect({ data: [] });
        }
        // This function retruns the values to be displayed in the property pane for each object.
        // Usually it is a bind pass of what the property pane gave you, but sometimes you may want to do
        // validation and return other values/defaults
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
            var instances: VisualObjectInstance[] = [];

            switch (options.objectName) {
                case 'cellColor':
                    var cellColor: VisualObjectInstance = {
                        objectName: 'cellColor',
                        displayName: 'Selection Color',
                        selector: null,
                        properties: {
                            fill: this.timelineFormat.cellColor
                        }
                    };

                    instances.push(cellColor);

                    break;

                case 'cellColorOut':
                    var cellColorOut: VisualObjectInstance = {
                        objectName: 'cellColorOut',
                        displayName: 'Selection Color Out',
                        selector: null,
                        properties: {
                            fill: this.timelineFormat.cellColorOut
                        }
                    };

                    instances.push(cellColorOut);

                    break;
                case 'timeRangeColor':
                    var timeRangeColor: VisualObjectInstance = {
                        objectName: 'timeRangeColor',
                        displayName: 'Time Range Text Color',
                        selector: null,
                        properties: {
                            fill: this.getTimeRangeColorFill(this.dataView)
                        }
                    };
                    instances.push(timeRangeColor);
                    break;
            }

            return instances;
        }
    }
}
