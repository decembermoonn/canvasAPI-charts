import { SingleSerieData, ContextSource } from "../models";
import { Chart } from "./Chart";
import ChartUtils from "./ChartUtils";

export class PieChart extends Chart {

    seriesData: SingleSerieData[];

    constructor(source: ContextSource) {
        super(source);
    }

    public set X(labels: string[]) {
        this.seriesData =
            labels.map((label) => this.getDefaultSerieObject(label));
    }

    public set Y(values: number[]) {
        const { length } = this.seriesData;
        if (!length)
            throw Error('Values on "X" axis must be specified before setting "Y" values.');
        const mappedValues = ChartUtils.sliceOrFill(values, length);
        this.seriesData.map((option, index) => {
            option.value = mappedValues[index];
        });
    }

    private getDefaultSerieObject(label: string): SingleSerieData {
        return {
            value: 0,
            name: label,
            options: {
                color: {
                    r: Math.floor(Math.random() * 255),
                    g: Math.floor(Math.random() * 255),
                    b: Math.floor(Math.random() * 255),
                    a: 255
                },
                showLabels: false,
                showOnLegend: false,
                edgeThickness: 0,
            }
        };
    }

    public draw(): void {
        this.chartDraftsman.drawPie(this.seriesData, this.chartOptions);
    }
}