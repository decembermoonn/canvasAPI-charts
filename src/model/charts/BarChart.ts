import { MultiSerieData } from "../types";
import ChartUtils from "../utils";
import { MultiChart } from "../MultiChart";

export class BarChart extends MultiChart {
    dataLabels: string[];
    seriesData: MultiSerieData[];

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
                showValue: false,
                showOnLegend: false,
                borderWidth: 0,
                shape: undefined,
            }
        };
    }

    public draw(): void {
        super.draw({
            dataLabels: this.dataLabels,
            series: this.seriesData,
            chartOptions: this.chartOptions
        });
    }
}