import { SingleSerieData, ContextSource } from "../types";
import { Chart } from "../Chart";
import ChartUtils from "../utils";
import PiePlot from "../../plot/PiePlot";

export class PieChart extends Chart {

    seriesData: SingleSerieData[];
    plot: PiePlot;

    constructor(source: ContextSource) {
        super(source);
        this.plot = new PiePlot(this.context);
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
                color: Math.floor(Math.random() * 16777215).toString(16),
                showValue: false,
                showOnLegend: false,
                borderWidth: 0,
                shape: undefined,
            }
        };
    }

    public draw(): void {
        this.plot.drawPie(this.seriesData, this.chartOptions);
    }
}