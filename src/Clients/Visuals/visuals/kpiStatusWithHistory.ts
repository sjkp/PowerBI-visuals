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

module powerbi.visuals {
    import DataRoleHelper = powerbi.data.DataRoleHelper;

    export interface KPIStatusWithHistoryData {
        dataPoints: KPIStatusWithHistoryDataPoint[];
        directionType: string;
        goals: number[];
        formattedGoalString: string;
        actual: number;
        targetExists: boolean;
        historyExists: boolean;
        indicatorExists: boolean;
        trendExists: boolean;
        formattedValue: string;
        showGoal: boolean;
        showDistanceFromGoal: boolean;
        showTrendLine: boolean;
    }

    export interface KPIStatusWithHistoryDataPoint {
        x: number;
        y: number;
        actual: number;
        goals: number[];
    }

    export class KPIStatusWithHistory implements IVisual {

        public static directionTypeStringProp: DataViewObjectPropertyIdentifier = { objectName: 'status', propertyName: 'direction' };
        public static showKPIGoal: DataViewObjectPropertyIdentifier = { objectName: 'goals', propertyName: 'showGoal' };
        public static showKPIDistance: DataViewObjectPropertyIdentifier = { objectName: 'goals', propertyName: 'showDistance' };
        public static showKPITrendLine: DataViewObjectPropertyIdentifier = { objectName: 'trendline', propertyName: 'show' };
        public static indicatorDisplayUnitsProp: DataViewObjectPropertyIdentifier = { objectName: 'indicator', propertyName: 'indicatorDisplayUnits' };
        public static indicatorPrecisionProp: DataViewObjectPropertyIdentifier = { objectName: 'indicator', propertyName: 'indicatorPrecision' };

        public static status = { INCREASE: "increase", DROP: "drop", IN_BETWEEN: "in-between", NOGOAL: "no-goal" };
        public static statusBandingType = { Below: "BELOW", Above: "ABOVE" };
        public static actualTextConsts = { VERTICAL_OFFSET_FROM_HALF_HEIGHT: 20, FONT_WIDTH_FACTOR: 14, RIGHT_MARGIN: 10 };

        public static kpiRedClass = 'kpi-visual-red';
        public static kpiYellowClass = 'kpi-visual-yellow';
        public static kpiGreenClass = 'kpi-visual-green';
        public static kpiTextGreyClass = 'kpi-visual-text-grey';
        public static kpiGraphGreyClass = 'kpi-visual-graph-grey';

        public static allColorClasses = KPIStatusWithHistory.kpiRedClass + ' ' + KPIStatusWithHistory.kpiYellowClass + ' ' + KPIStatusWithHistory.kpiGreenClass + ' ' + KPIStatusWithHistory.kpiTextGreyClass + ' ' + KPIStatusWithHistory.kpiGraphGreyClass;

        public static trendAreaFilePercentage = 1;

        public static estimatedIconHeightInPx = 9;

        public static indicatorTextSizeInPx = 60;

        private svg: D3.Selection;
        private dataView: DataView;
        private mainGroupElement: D3.Selection;
        private kpiActualText: D3.Selection;
        private absoluteGoalDistanceText: D3.Selection;
        private areaFill: D3.Selection;
        private host: IVisualHostServices;
        private exclamationMarkIcon: D3.Selection;
        private successMarkIcon: D3.Selection;
        private betweenIcon: D3.Selection;
        private rootElement: D3.Selection;
        private indicatorTextContainer: D3.Selection;
        private textContainer: D3.Selection;

        private static getLocalizedString: (stringId: string) => string;

        private static defaultCardFormatSetting: CardFormatSetting;
        private static defaultLabelSettings;

        public init(options: VisualInitOptions): void {
            KPIStatusWithHistory.getLocalizedString = options.host.getLocalizedString;
            this.rootElement = d3.select(options.element.get(0)).append('div').attr('text-align', 'center').classed('kpiVisual', true);
            this.svg = this.rootElement.append('svg');
            let mainGroupElement = this.mainGroupElement = this.svg.append('g');
            this.areaFill = mainGroupElement.append("path");

            this.textContainer = this.rootElement.append("div").classed('textContainer', true);

            this.indicatorTextContainer = this.textContainer.append("div").classed('indicatorText', true);

            this.absoluteGoalDistanceText = this.textContainer.append("div").classed('goalText', true);

            this.kpiActualText = this.indicatorTextContainer.append("div").attr('id', 'indicatorText');

            this.initIcons();

            this.host = options.host;
        }

        public update(options: VisualUpdateOptions) {
            if (!options.dataViews || !options.dataViews[0]) return;
            let dataView = this.dataView = options.dataViews[0];
            let viewport = options.viewport;
            
            // We must have at least one measure
            if ((!dataView.categorical || !dataView.categorical.values || dataView.categorical.values.length < 1) &&
                (!dataView.categorical || !dataView.categorical.categories || dataView.categorical.categories.length < 1)) {
                this.svg.attr("visibility", "hidden");
                this.textContainer.attr("style", "display:none");
                return;
            }
            this.svg.attr("visibility", "visible");

            let kpiViewModel: KPIStatusWithHistoryData = KPIStatusWithHistory.converter(
                dataView,
                viewport,
                KPIStatusWithHistory.getProp_KPIDirection(dataView));

            this.render(kpiViewModel, viewport);
        }

        private initIcons() {
            this.successMarkIcon = this.indicatorTextContainer.append("div").classed('powervisuals-glyph checkmark kpi-visual-green', true);
            this.betweenIcon = this.indicatorTextContainer.append('div').classed('powervisuals-glyph circle-small kpi-visual-yellow', true);
            this.exclamationMarkIcon = this.indicatorTextContainer.append("div").classed('powervisuals-glyph exclamation kpi-visual-red', true);
            
            this.successMarkIcon.attr('style', 'display:none');
            this.betweenIcon.attr('style', 'display:none');
            this.exclamationMarkIcon.attr('style', 'display:none');
        }

        private render(kpiViewModel: KPIStatusWithHistoryData, viewport: IViewport) {

            this.setShowDataMissingWarning(!(kpiViewModel.indicatorExists && kpiViewModel.trendExists));

            if (kpiViewModel.dataPoints.length === 0 || !kpiViewModel.indicatorExists || !kpiViewModel.trendExists) {
                this.areaFill.attr("visibility", "hidden");
                this.svg.attr("visibility", "hidden");
                this.textContainer.attr("style", "display:none");
                return;
            }

            this.svg.attr({
                'height': viewport.height,
                'width': viewport.width,
            });

            let status = KPIStatusWithHistory.status.NOGOAL;
            if (kpiViewModel.targetExists && kpiViewModel.indicatorExists && kpiViewModel.trendExists) {
                status = GetStatus(kpiViewModel.actual, kpiViewModel.goals, kpiViewModel.directionType);
            }

            let actualText = kpiViewModel.formattedValue;

            let calculatedHeight = KPIStatusWithHistory.indicatorTextSizeInPx;

            this.textContainer
                .attr('style', "width:" + viewport.width + "px;" +
                    "top:" + ((viewport.height - calculatedHeight) / 2) + "px");

            this.kpiActualText
                .classed(KPIStatusWithHistory.allColorClasses, false)
                .classed(GetTextColorClassByStatus(status), true)
                .attr("text-anchor", "middle")
                .text(actualText);

            let icon: D3.Selection = null;

            switch (status) {
                case KPIStatusWithHistory.status.INCREASE:
                    icon = this.successMarkIcon;
                    this.exclamationMarkIcon.attr("style", "display:none");
                    this.betweenIcon.attr("style", "display:none");
                    break;
                case KPIStatusWithHistory.status.IN_BETWEEN:
                    icon = this.betweenIcon;
                    this.exclamationMarkIcon.attr("style", "display:none");
                    this.successMarkIcon.attr("style", "display:none");
                    break;
                case KPIStatusWithHistory.status.DROP:
                    icon = this.exclamationMarkIcon;
                    this.successMarkIcon.attr("style", "display:none");
                    this.betweenIcon.attr("style", "display:none");
                    break;
                default:
                    this.exclamationMarkIcon.attr("style", "display:none");
                    this.successMarkIcon.attr("style", "display:none");
                    this.betweenIcon.attr("style", "display:none");
            }

            if (icon) {
                icon.attr('style', 'font-size:12px');
            }

            let shownGoalString = kpiViewModel.showGoal ? kpiViewModel.formattedGoalString + " " : "";
            let shownDistanceFromGoalString = kpiViewModel.showDistanceFromGoal ? getDistanceFromGoalInPercentageString(kpiViewModel.actual, kpiViewModel.goals, kpiViewModel.directionType) : "";

            this.absoluteGoalDistanceText
                .attr("text-anchor", "middle")
                .text(shownGoalString + shownDistanceFromGoalString);

            if (kpiViewModel.showTrendLine && kpiViewModel.historyExists) {
                let area = d3.svg.area()
                    .x(function (d) { return d.x; })
                    .y0(viewport.height)
                    .y1(function (d) { return d.y; });

                this.areaFill
                    .classed(KPIStatusWithHistory.allColorClasses, false)
                    .classed(GetGraphColorClassByStatus(status), true)
                    .attr("d", area(kpiViewModel.dataPoints))
                    .attr("stroke", "none")
                    .attr("visibility", "visible")
                    .attr('fill-opacity', 0.2);
            } else {
                this.areaFill.attr("visibility", "hidden");
            }

        }

        private setShowDataMissingWarning(show: boolean) {
            this.host.setWarnings(show ? [new VisualKPIDataMissingWarning()] : []);
        }

        private static getDefaultFormatSettings(): CardFormatSetting {
            return {
                labelSettings: dataLabelUtils.getDefaultLabelSettings(true, Card.DefaultStyle.value.color),
                textSize: 27,
                wordWrap: false
            };
        }

        private static getFormatString(column: DataViewMetadataColumn): string {
            debug.assertAnyValue(column, 'column');
            return valueFormatter.getFormatString(column, AnimatedText.formatStringProp);
        }

        private static getProp_Show_KPIGoal(dataView: DataView) {
            if (dataView && dataView.metadata) {
                return DataViewObjects.getValue<boolean>(dataView.metadata.objects, KPIStatusWithHistory.showKPIGoal, true);
            }

            return true;
        }

        private static getProp_Show_KPITrendLine(dataView: DataView) {
            if (dataView && dataView.metadata) {
                return DataViewObjects.getValue<boolean>(dataView.metadata.objects, KPIStatusWithHistory.showKPITrendLine, true);
            }

            return true;
        }

        private static getProp_Show_KPIDistance(dataView: DataView) {
            if (dataView && dataView.metadata) {
                return DataViewObjects.getValue<boolean>(dataView.metadata.objects, KPIStatusWithHistory.showKPIDistance, true);
            }

            return true;
        }

        private static getProp_KPIDirection(dataView: DataView) {
            if (dataView && dataView.metadata) {
                return DataViewObjects.getValue<string>(dataView.metadata.objects, KPIStatusWithHistory.directionTypeStringProp, kpiDirection.positive);
            }

            return kpiDirection.positive;
        }

        private static getProp_Indicator_DisplayUnits(dataView: DataView) {
            KPIStatusWithHistory.initDefaultLabelSettings();
            if (dataView && dataView.metadata) {
                return DataViewObjects.getValue<number>(dataView.metadata.objects, KPIStatusWithHistory.indicatorDisplayUnitsProp, KPIStatusWithHistory.defaultLabelSettings.displayUnits);
            }

            return KPIStatusWithHistory.defaultLabelSettings.displayUnits;
        }

        private static getProp_Indicator_Precision(dataView: DataView) {
            KPIStatusWithHistory.initDefaultLabelSettings();
            if (dataView && dataView.metadata) {
                return DataViewObjects.getValue<number>(dataView.metadata.objects, KPIStatusWithHistory.indicatorPrecisionProp, KPIStatusWithHistory.defaultLabelSettings.precision);
            }

            return KPIStatusWithHistory.defaultLabelSettings.precision;
        }

        private static initDefaultLabelSettings() {
            if (!KPIStatusWithHistory.defaultCardFormatSetting) {
                KPIStatusWithHistory.defaultCardFormatSetting = KPIStatusWithHistory.getDefaultFormatSettings();
                KPIStatusWithHistory.defaultLabelSettings = KPIStatusWithHistory.defaultCardFormatSetting.labelSettings;
            }
        }

        private static getFormattedValue(metaDataColumn: DataViewMetadataColumn, theValue: number, precision: number, displayUnits: number, displayUnitSystemType: DisplayUnitSystemType = DisplayUnitSystemType.WholeUnits): string {
            let isDefaultDisplayUnit = displayUnits === 0;
            let formatter = valueFormatter.create({
                format: KPIStatusWithHistory.getFormatString(metaDataColumn),
                value: displayUnits,
                precision: precision,
                displayUnitSystemType: displayUnitSystemType,
                formatSingleValues: isDefaultDisplayUnit ? true : false,
                allowFormatBeautification: true,
                columnType: metaDataColumn ? metaDataColumn.type : undefined
            });
            return formatter.format(theValue);
        }

        private static getFormattedGoalString(metaDataColumn: DataViewMetadataColumn, goals: any[], precision: number, displayUnits: number): string {
            if (!goals || goals.length === 0) {
                return "";
            }

            let goalsString = KPIStatusWithHistory.getLocalizedString('Visual_KPI_Goal_Title') + ": " + KPIStatusWithHistory.getFormattedValue(metaDataColumn, goals[0], precision, displayUnits);

            if (goals.length === 2) {
                goalsString += ", " + KPIStatusWithHistory.getFormattedValue(metaDataColumn, goals[1], precision, displayUnits);
            }

            return goalsString;
        }

        public static converter(dataView: DataView, viewPort: powerbi.IViewport, directionType: string): KPIStatusWithHistoryData {
            let dataPoints: KPIStatusWithHistoryDataPoint[] = [];
            let catDv: DataViewCategorical = dataView.categorical;
            let indicatorMetadataColumn: DataViewMetadataColumn = null;
            let goalMetadataColumn: DataViewMetadataColumn = null;
            let formattedGoalString = "";
            let formattedValue = "";
            let targetExists = false;
            let indicatorExists = false;
            let trendExists = false;

            let historyExists = true;
            if (!dataView.categorical.categories) {
                historyExists = false;
            }

            let values = catDv.values;

            let columns = dataView.metadata.columns;

            for (let column of columns) {
                if (DataRoleHelper.hasRole(column, 'Indicator')) {
                    indicatorExists = true;
                    indicatorMetadataColumn = column;
                }

                if (DataRoleHelper.hasRole(column, 'TrendLine')) {
                    trendExists = true;
                }

                if (DataRoleHelper.hasRole(column, 'Goal')) {
                    targetExists = true;
                    goalMetadataColumn = column;
                }

            }

            if (!indicatorExists || !trendExists || !values || values.length === 0 || !values[0].values || !dataView.categorical.values) {
                return {
                    dataPoints: dataPoints,
                    directionType: directionType,
                    actual: 0,
                    goals: [],
                    formattedGoalString,
                    targetExists: targetExists,
                    historyExists: historyExists,
                    indicatorExists,
                    trendExists,
                    formattedValue,
                    showGoal: false,
                    showDistanceFromGoal: false,
                    showTrendLine: false
                };
            }

            var category, categoryValues;
            if (historyExists) {
                category = catDv.categories[0]; // This only works if we have a category axis
                categoryValues = category.values;
            }

            let historyActualData = [];
            let historyGoalData = [];

            let indicatorColumns: DataViewValueColumn[] = KPIStatusWithHistory.getColumnsByRole(values, "Indicator");

            let goalColumns: DataViewValueColumn[] = KPIStatusWithHistory.getColumnsByRole(values, "Goal");

            let actualValue;

            for (let i = 0, len = values[0].values.length; i < len; i++) {

                actualValue = indicatorColumns[0].values[i];

                let goals = [];

                for (let goalCnt = 0; goalCnt < goalColumns.length; goalCnt++) {
                    goals.push(goalColumns[goalCnt].values[i]);
                }

                historyGoalData.push(goals);

                historyActualData.push(actualValue);
            }

            let maxActualData = Math.max.apply(Math, historyActualData);
            let minActualData = Math.min.apply(Math, historyActualData);
            let areaMaxHight = viewPort.height * KPIStatusWithHistory.trendAreaFilePercentage;

            let precision = KPIStatusWithHistory.getProp_Indicator_Precision(dataView);
            let displayUnits = KPIStatusWithHistory.getProp_Indicator_DisplayUnits(dataView);

            for (let i = 0; i < historyActualData.length; i++) {
                let yPos = areaMaxHight * (historyActualData[i] - minActualData) / (maxActualData - minActualData);

                let selectorId = null;
                if (historyExists) {
                    selectorId = SelectionId.createWithId(category.identity[i]).getSelector();
                }

                dataPoints.push({
                    x: i * viewPort.width / (historyActualData.length - 1),
                    y: viewPort.height - yPos,
                    actual: historyActualData[i],
                    goals: historyGoalData[i],
                });
            }

            var actual, goals;
            if (dataPoints.length > 0) {
                actual = dataPoints[dataPoints.length - 1].actual;
                goals = dataPoints[dataPoints.length - 1].goals;
            }

            if (dataPoints.length === 1) {
                historyExists = false;
            }

            formattedValue = KPIStatusWithHistory.getFormattedValue(indicatorMetadataColumn, actual, precision, displayUnits, DisplayUnitSystemType.DataLabels);

            formattedGoalString = KPIStatusWithHistory.getFormattedGoalString(goalMetadataColumn, goals, precision, displayUnits);

            let showGoal = KPIStatusWithHistory.getProp_Show_KPIGoal(dataView);

            let showDistanceFromGoal = KPIStatusWithHistory.getProp_Show_KPIDistance(dataView);

            let showTrendLine = KPIStatusWithHistory.getProp_Show_KPITrendLine(dataView);

            return {
                dataPoints: dataPoints,
                directionType: directionType,
                actual: actual,
                goals: goals,
                formattedGoalString,
                targetExists: targetExists,
                historyExists: historyExists,
                indicatorExists,
                trendExists,
                formattedValue,
                showGoal,
                showDistanceFromGoal,
                showTrendLine
            };
        }

        public static getColumnsByRole(values: DataViewValueColumns, roleString: string): DataViewValueColumn[] {
            let retval: DataViewValueColumn[] = [];

            for (let i = 0; i < values.length; i++) {
                if (DataRoleHelper.hasRole(values[i].source, roleString)) {
                    retval.push(values[i]);
                }
            }

            return retval;
        }

        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
            let instances: VisualObjectInstance[] = [];
            let dataView = this.dataView;
            switch (options.objectName) {
                case 'indicator':
                    instances.push({
                        selector: null,
                        objectName: 'indicator',
                        properties: {
                            indicatorDisplayUnits: KPIStatusWithHistory.getProp_Indicator_DisplayUnits(dataView),
                            indicatorPrecision: KPIStatusWithHistory.getProp_Indicator_Precision(dataView)
                        }
                    });
                case 'trendline':
                    instances.push({
                        selector: null,
                        objectName: 'trendline',
                        properties: {
                            show: KPIStatusWithHistory.getProp_Show_KPITrendLine(dataView)
                        }
                    });
                case 'goals':
                    instances.push({
                        selector: null,
                        objectName: 'goals',
                        properties: {
                            showGoal: KPIStatusWithHistory.getProp_Show_KPIGoal(dataView),
                            showDistance: KPIStatusWithHistory.getProp_Show_KPIDistance(dataView)
                        }
                    });
                case 'status':
                    instances.push({
                        selector: null,
                        objectName: 'status',
                        properties: {
                            direction: KPIStatusWithHistory.getProp_KPIDirection(dataView)
                        }
                    });
            }
            return instances;
        }

        public destroy(): void {
            this.svg = null;
        }
    }

    function GetStatus(actual, goals: any[], directionType) {
        if (!goals || goals.length === 0) {
            return KPIStatusWithHistory.status.NOGOAL;
        }

        let maxGoal, minGoal;

        if (goals.length === 2) {
            maxGoal = Math.max.apply(Math, goals);
            minGoal = Math.min.apply(Math, goals);

            if (actual >= minGoal && actual <= maxGoal) {
                return KPIStatusWithHistory.status.IN_BETWEEN;
            }
        }
        else {
            maxGoal = goals[0];
            minGoal = goals[0];
        }

        switch (directionType) {
            case kpiDirection.positive:
                if (actual < minGoal) {
                    return KPIStatusWithHistory.status.DROP;
                }
                break;

            case kpiDirection.negative:
                if (actual > maxGoal) {
                    return KPIStatusWithHistory.status.DROP;
                }
                break;

            default:
                break;
        }

        return KPIStatusWithHistory.status.INCREASE;
    }

    function getDistanceFromGoalInPercentageString(actual, goals: any[], directionType) {
        if (!goals || goals.length !== 1 || goals[0] === 0) {
            return "";
        }

        let sign = "+";
        let distance;

        let goal: number = goals[0];

        distance = Math.abs(actual - goal);

        switch (directionType) {
            case kpiDirection.positive:
                if (actual < goal) {
                    sign = "-";
                }
                break;

            case kpiDirection.negative:
                if (actual > goal) {
                    sign = "-";
                }
                break;
        }

        let percent = Number((100 * distance / goal).toFixed(2));

        return "(" + sign + percent + "%)";
    }

    function GetTextColorClassByStatus(status) {
        switch (status) {
            case KPIStatusWithHistory.status.NOGOAL:
                return KPIStatusWithHistory.kpiTextGreyClass;

            case KPIStatusWithHistory.status.INCREASE:
                return KPIStatusWithHistory.kpiGreenClass;

            case KPIStatusWithHistory.status.IN_BETWEEN:
                return KPIStatusWithHistory.kpiYellowClass;

            case KPIStatusWithHistory.status.DROP:
                return KPIStatusWithHistory.kpiRedClass;
        }
    }

    function GetGraphColorClassByStatus(status) {
        switch (status) {
            case KPIStatusWithHistory.status.NOGOAL:
                return KPIStatusWithHistory.kpiGraphGreyClass;

            case KPIStatusWithHistory.status.INCREASE:
                return KPIStatusWithHistory.kpiGreenClass;

            case KPIStatusWithHistory.status.IN_BETWEEN:
                return KPIStatusWithHistory.kpiYellowClass;

            case KPIStatusWithHistory.status.DROP:
                return KPIStatusWithHistory.kpiRedClass;
        }
    }
}