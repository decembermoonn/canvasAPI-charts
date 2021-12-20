import { MultiSerieData, ContextSource } from "../models";
import { Chart } from "./Chart";
import ChartUtils from "./ChartUtils";

export class BarChart extends Chart {
    dataLabels: string[];
    seriesData: MultiSerieData[];

    constructor(source: ContextSource) {
        super(source);
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
        this.chartDraftsman.drawLines(this.seriesData[0].values);
        this.chartDraftsman.drawBars(this.seriesData[0].values);
    }
}