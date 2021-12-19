import { MultiSerieData, ChartOptions, ContextSource, SerieOptions } from "../models";
import Draw from "../plot-logic/Draw";
import { Chart } from "./Chart";
import ChartUtils from "./ChartUtils";

export class HistogramChart extends Chart {
    optionsForChart: ChartOptions;
    seriesData: MultiSerieData[];
    dataLabels: string[];

    constructor(source: ContextSource) {
        super(source);
        this.optionsForChart = {
            title: 'Untitled',
            showTitle: true,
            showLegend: false,
        };
        this.seriesData = [];
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

    public setChartOptions(options: Partial<ChartOptions>): void {
        ChartUtils.mergeRight(this.optionsForChart, options);
    }

    public setSerieOptions(newOptions: Partial<SerieOptions>, whichSeries?: string[]): void {
        if (whichSeries) whichSeries.forEach((serieName) => {
            const actualSerie =
                this.seriesData.find((existingSerie) => existingSerie.name == serieName);
            if (actualSerie) {
                ChartUtils.mergeRight(newOptions, actualSerie.options);
            } else {
                console.warn(`Serie with name ${serieName} not found.`);
            }
        });
        else this.seriesData.forEach((serie) => ChartUtils.mergeRight(newOptions, serie.options));
    }

    public draw(): void {
        const draw = new Draw();
        const c = draw.drawLines(this.context, this.seriesData[0].values);
        draw.drawBars(this.context, this.seriesData[0].values, c);
    }
}