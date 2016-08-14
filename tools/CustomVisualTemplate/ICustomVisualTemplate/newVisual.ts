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
 
module powerbi.visuals {
    import SelectionManager = utility.SelectionManager;

    export const $safeitemname$Props = {
        dataPoint: {
            defaultColor: <DataViewObjectPropertyIdentifier>{
                objectName: 'dataPoint',
                propertyName: 'defaultColor'
            },
            fill: <DataViewObjectPropertyIdentifier>{
                objectName: 'dataPoint',
                propertyName: 'fill'
            },
        },
    };

    export interface VisualTeamData {
        name: string;
        value: number;
        color: string;
        identity: SelectionId;
    }

    export interface $safeitemname$Data {
        teamA: VisualTeamData;
        teamB: VisualTeamData;
        background: string;
    }

    interface $safeitemname$Layout {
        x1: number;
        x2: number;
        y1: number;
        y2: number;
        fontSize: string;
    }

    export class $safeitemname$ implements IVisual {
 		/*
		 * Here is where you would also specify a data reduction algorithm.
         * Power BI has a limited number of data points it brings to the client.
         * While the visual has some control over how much data it can request,
         * there will always be a point beyond which more data points are not possible,
         * usually don't make for a meaningful visual & introduce severe performance issues.
         * For this we allow you to specify your data reduction algorithms
		 */
        public static capabilities: VisualCapabilities = {
            dataRoles: [
                {
                    name: 'Category',
                    kind: powerbi.VisualDataRoleKind.Grouping,
                },
                {
                    displayName: 'Noise Measure',
                    name: 'Y',
                    kind: powerbi.VisualDataRoleKind.Measure,
                },
            ],
            dataViewMappings: [{
                categorical: {
                    categories: {
                        for: { in: 'Category' },
                    },
                    values: {
                        select: [{ bind: { to: 'Y' } }]
                    },
                },
            }],
            /*
             * In Power BI, the visuals are not responsible for creating any UI for formatting.
             * Instead, they declare what formatting options they support, and the system creates the UI for them.
             * This allows for visual builders to focus on the visual itself.
             * More info: https://github.com/Microsoft/PowerBI-visuals/wiki/Capabilities#objects-formatting-objects   
             */
            objects: {
                dataPoint: {
                    displayName: data.createDisplayNameGetter('Visual_DataPoint'),
                    description: data.createDisplayNameGetter('Visual_DataPointDescription'),
                    properties: {
                        fill: {
                            displayName: data.createDisplayNameGetter('Visual_Fill'),
                            type: { fill: { solid: { color: true } } }
                        },
                        width: {
                            displayName: '',
                            type: { numeric: true }
                        }
                    }
                },
                general: {
                    displayName: 'General',
                    properties: {
                        fill: {
                            displayName: 'Background color',
                            type: { fill: { solid: { color: true } } }
                        },

                    }
                }
            }
        };

        private static DefaultFontFamily = 'cursive';
        private static DefaultFontColor = 'rgb(165, 172, 175)';
        private static DefaultBackgroundColor = '#243C18';
        private static PaddingBetweenText = 15;

        private textOne: D3.Selection;
        private textTwo: D3.Selection;
        private svg: D3.Selection;
        private isFirstTime: boolean = true;
        private data: $safeitemname$Data;
        private selectionManager: SelectionManager;

        /* 
         * Here we convert the dataview into its view model.
         * This is a recommended pattern, since it allows you to organize the data just as you are to draw it,
         * which makes your drawing code focused on just drawing instead of mapping dataview to pixels.
         * This allows limits the use of dataview to one function in your visual,
         * so if we are to update the DataView interface, you will only need to update one part of your code.
         * More info: https://github.com/Microsoft/PowerBI-visuals/wiki/DataView-Introduction
         */
        public static converter(dataView: DataView): $safeitemname$Data {
            if (!dataView.categorical || !dataView.categorical.categories) {
                return null;
            }
            let cat = dataView.categorical.categories[0];
            if (!cat) {
                return null;
            }
            let catValues = cat.values;
            if (!catValues || _.isEmpty(dataView.categorical.values)) {
                return null;
            }
            let values = dataView.categorical.values[0].values;
            let objects = dataView.categorical.categories[0].objects;
            let object1 = objects && objects.length > 0 ? objects[0] : undefined;
            let object2 = objects && objects.length > 1 ? objects[1] : undefined;
            let metadataObjects = dataView.metadata.objects;
            let backgroundColor = $safeitemname$.DefaultBackgroundColor;
            if (metadataObjects) {
                let general = metadataObjects['general'];
                if (general) {
                    let fill = <Fill>general['fill'];
                    if (fill) {
                        backgroundColor = fill.solid.color;
                    }
                }
            }

            let color1 = DataViewObjects.getFillColor(
                object1,
                $safeitemname$Props.dataPoint.fill,
                $safeitemname$.DefaultFontColor);

            let color2 = DataViewObjects.getFillColor(
                object2,
                $safeitemname$Props.dataPoint.fill,
                $safeitemname$.DefaultFontColor);

            let idn1 = SelectionIdBuilder.builder()
                .withCategory(cat, 0)
                .createSelectionId();
            let idn2 = SelectionIdBuilder.builder()
                .withCategory(cat, 1)
                .createSelectionId();

            let data = {
                teamA: {
                    name: catValues[0],
                    value: values[0],
                    color: color1,
                    identity: idn1
                },
                teamB: {
                    name: catValues[1],
                    value: values[1],
                    color: color2,
                    identity: idn2
                },
                background: backgroundColor
            };

            return data;
        }

        /* 
         * This is called when the visual is first created. 
         * The host will pass into the visual the element it will draw itself into.
         * The host also passes into it some configuration options along with services that are needed by the visual.
         * It is recommended that you do not create any UI in this call, unless you are creating a one time DOM structure.
         */
        public init(options: VisualInitOptions): void {
            this.selectionManager = new SelectionManager({ hostServices: options.host });
            let svg = this.svg = d3.select(options.element.get(0)).append('svg');

            this.textOne = svg.append('text')
                .style('font-family', $safeitemname$.DefaultFontFamily);

            this.textTwo = svg.append('text')
                .style('font-family', $safeitemname$.DefaultFontFamily);
        }
 
        /* 
         * Whenever the host has an update to the viewport, data or style, it will call this method to notify the visual.
         * It is the visual's responsibility to figure out what exactly has changed.
         * Please be careful not to recreate DOM on each call of update. 
         */
        public update(options: VisualUpdateOptions) {
            if (!options.dataViews[0]) {
                return;
            }
            let data = this.data = $safeitemname$.converter(options.dataViews[0]);
            if (!data) {
                return;
            }
            let duration = options.suppressAnimations ? 0 : AnimatorCommon.MinervaAnimationDuration;
            this.draw(data, duration, options.viewport);
        }

        private getRecomendedFontProperties(text1: string, text2: string, parentViewport: IViewport): TextProperties {
            let textProperties: TextProperties = {
                fontSize: '',
                fontFamily: $safeitemname$.DefaultFontFamily,
                text: text1 + text2
            };

            let min: number = 1;
            let max: number = 1000;
            let i: number;
            let maxWidth: number  = parentViewport.width;
            let width: number  = 0;

            while (min <= max) {
                i = (min + max) / 2 | 0;

                textProperties.fontSize = i + 'px';
                /* This method measures the width of the text with the given SVG text properties. */
                width = TextMeasurementService.measureSvgTextWidth(textProperties);

                if (maxWidth > width) {
                    min = i + 1;
                } else if (maxWidth < width) {
                    max = i - 1;
                } else {
                    break;
                }
            }

            textProperties.fontSize = i + 'px';
            width = TextMeasurementService.measureSvgTextWidth(textProperties);
            if (width > maxWidth) {
                i--;
                textProperties.fontSize = i + 'px';
            }

            return textProperties;
        }

        private calculateLayout(data: $safeitemname$Data, viewport: IViewport): $safeitemname$Layout {
            let text1 = data.teamA.name;
            let text2 = data.teamB.name;

            let avaliableViewport: IViewport = {
                height: viewport.height,
                width: viewport.width - $safeitemname$.PaddingBetweenText
            };
            let recomendedFontProperties = this.getRecomendedFontProperties(text1, text2, avaliableViewport);

            recomendedFontProperties.text = text1;
            let width1 = TextMeasurementService.measureSvgTextWidth(recomendedFontProperties) | 0;

            recomendedFontProperties.text = text2;
            let width2 = TextMeasurementService.measureSvgTextWidth(recomendedFontProperties) | 0;

            let padding = ((viewport.width - width1 - width2 - $safeitemname$.PaddingBetweenText) / 2) | 0;

            recomendedFontProperties.text = text1 + text2;
            let offsetHeight = (TextMeasurementService.measureSvgTextHeight(recomendedFontProperties)) | 0;

            let max = data.teamA.value + data.teamB.value;
            let availableHeight = viewport.height - offsetHeight;
            let y1 = (((max - data.teamA.value) / max) * availableHeight + offsetHeight / 2) | 0;
            let y2 = (((max - data.teamB.value) / max) * availableHeight + offsetHeight / 2) | 0;

            return {
                x1: padding,
                x2: padding + width1 + $safeitemname$.PaddingBetweenText,
                y1: y1,
                y2: y2,
                fontSize: recomendedFontProperties.fontSize
            };
        }

        private ensureStartState(layout: $safeitemname$Layout, viewport: IViewport) {
            if (this.isFirstTime) {
                this.isFirstTime = false;
                let startY = viewport.height / 2;
                this.textOne.attr(
                    {
                        'x': layout.x1,
                        'y': startY
                    });

                this.textTwo.attr(
                    {
                        'x': layout.x2,
                        'y': startY
                    });
            }
        }

        private clearSelection() {
            this.selectionManager.clear().then(() => {
                this.clearSelectionUI();
            });
        }

        private clearSelectionUI() {
            this.textOne.style('stroke', '#FFF').style('stroke-width', 0);
            this.textTwo.style('stroke', '#FFF').style('stroke-width', 0);
        }

        private updateSelectionUI(ids: SelectionId[]) {
            this.textOne.style('stroke', '#FFF').style('stroke-width', SelectionManager.containsSelection(ids, this.data.teamA.identity) ? '2px' : '0px');
            this.textTwo.style('stroke', '#FFF').style('stroke-width', SelectionManager.containsSelection(ids, this.data.teamB.identity) ? '2px' : '0px');
        }

        private draw(data: $safeitemname$Data, duration: number, viewport: IViewport) {
            let easeName = 'back';
            let textOne = this.textOne;
            let textTwo = this.textTwo;

            this.svg
                .attr({
                    'height': viewport.height,
                    'width': viewport.width
                })
                .on('click', () => {
                    this.clearSelection();
                })
                .style('background-color', data.background);

            let layout = this.calculateLayout(data, viewport);

            this.ensureStartState(layout, viewport);
            
            textOne
                .style('font-size', layout.fontSize)
                .style('fill', data.teamA.color)
                .on('click', () => {
                    /* You just need to call select on the selection manager with the selector for a datapoint.
                     * The host will take care of performing cross filtering, etc and send updates to the other visuals.
                     * You will only need to take care of the UI updates that go along with your selection.
                     */            
                    this.selectionManager.select(data.teamA.identity, d3.event.ctrlKey).then((ids) => {
                        this.updateSelectionUI(ids);
                    });
                    d3.event.stopPropagation();
                })
                .text(data.teamA.name);

            textTwo
                .style('font-size', layout.fontSize)
                .style('fill', data.teamB.color)
                .on('click', () => {
                    this.selectionManager.select(data.teamB.identity, d3.event.ctrlKey).then((ids) => {
                        this.updateSelectionUI(ids);
                    });
                    d3.event.stopPropagation();
                })
                .text(data.teamB.name);

            textOne.transition()
                .duration(duration)
                .ease(easeName)
                .attr({
                    y: layout.y1,
                    x: layout.x1
                });

            textTwo.transition()
                .duration(duration)
                .ease(easeName)
                .attr({
                    y: layout.y2,
                    x: layout.x2
                });
        }

        /* 
         * Called when the visual is about to be disposed.
         * Here the visual should null out any resources, to avoid memory leaks.
         */
        public destroy(): void {
            this.svg = null;
            this.textOne = this.textTwo = null;
        }

        /* 
         * This method is needed for properties be available in the formatting pane.
         * The property pane will walk your capabilities to create the UI for it.
         * It will then call your visual, asking you for all the values of all the property instances.
         * Here you could either just pass the property values straight thru, 
         * or you could perform validation and not allow users to set certain values. 
         */
        public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstance[] {
            let instances: VisualObjectInstance[] = [];
            let data = this.data;
            switch (options.objectName) {
                case 'dataPoint':
                    if (data) {
                        let teams = [data.teamA, data.teamB];

                        for (let i: number = 0; i < teams.length; i++) {
                            let slice = teams[i];

                            let color = slice.color;
                            let selector = slice.identity;

                            let dataPointInstance: VisualObjectInstance = {
                                objectName: 'dataPoint',
                                displayName: slice.name,
                                selector: selector,
                                properties: {
                                    fill: { solid: { color: color } }
                                },
                            };

                            instances.push(dataPointInstance);
                        };
                    }
                    break;
                case 'general':
                    let general: VisualObjectInstance = {
                        objectName: 'general',
                        displayName: 'General',
                        selector: null,
                        properties: {
                            fill: { solid: { color: data ? data.background : $safeitemname$.DefaultBackgroundColor } }
                        }
                    };
                    instances.push(general);
                    break;
            }
            return instances;
        }
    }
}

/* Creating IVisualPlugin that is used to represent IVisual. */
//
// Uncomment it to see your plugin in "PowerBIVisualsPlayground" plugins list
//
//module powerbi.visuals.plugins {
//    export var $safeitemname$: IVisualPlugin = {
//        name: '$safeitemname$',
//        capabilities: samples.$safeitemname$.capabilities,
//        create: () => new samples.$safeitemname$()
//    };
//}
