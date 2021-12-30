import { MultiSerieData, ContextSource } from "./types";
import { Chart } from "./Chart";
import ChartUtils from "./utils";
import BarPlot from "../plot/BarPlot";

export class BarChart extends Chart {
    dataLabels: string[];
    seriesData: MultiSerieData[];
    plot: BarPlot;

    constructor(source: ContextSource) {
        super(source);
        this.plot = new BarPlot(this.plot);
    }

    public set X(labels: string[]) {
        this.dataLabels = labels;
    }

    public set Y(series: number[][]) {
        const { length } = this.dataLabels;
        if (!length)
            throw Error('Values on "X" axis must be specified before setting "Y" values.');
        const mappedSeries = series.map(serie => ChartUtils.sliceOrFill(serie, length));
        this.seriesData = mappedSeries.map((serie, index) => this.getDefaultSerieObject(serie, index));
    }

    public set serieNames(names: string[]) {
        const min = Math.min(names.length, this.seriesData.length);
        for (let i = 0; i < min; i++) {
            this.seriesData[i].name = names[i];
        }
    }

    private getDefaultSerieObject(serie: number[], index: number): MultiSerieData {
        return {
            values: serie,
            name: `serie${index}`,
            options: {
                color: Math.floor(Math.random() * 16777215).toString(16),
                showValue: false,
                showOnLegend: false,
                edgeThickness: 0,
                shape: undefined,
            }
        };
    }

    public draw(): void {
        this.plot.drawBars(this.dataLabels, this.seriesData, this.chartOptions);
    }
}