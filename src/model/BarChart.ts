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

    private getDefaultSerieObject(serie: number[], index: number): MultiSerieData {
        return {
            values: serie,
            name: `serie${index}`,
            options: {
                color: Math.floor(Math.random() * 16777215).toString(16),
                showLabels: false,
                showOnLegend: false,
                edgeThickness: 0,
            }
        };
    }

    public draw(): void {
        this.plot.drawBars(this.seriesData, this.chartOptions);
        // this.chartDraftsman.drawLines(this.seriesData[0].values);
        // this.chartDraftsman.drawBars(this.seriesData[0].values);
    }
}