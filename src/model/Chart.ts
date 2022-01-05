import { SerieDataCommon, ChartOptions, ContextSource, SerieOptionsShape, SerieOptionsLine } from "./types";
import ChartUtils from "./utils";

export abstract class Chart {

    context: CanvasRenderingContext2D;
    seriesData: SerieDataCommon[];
    chartOptions: ChartOptions;

    constructor(source: ContextSource) {
        let analyzedElement = source;
        if (typeof analyzedElement === 'string') {
            analyzedElement = document.getElementById(analyzedElement.replace('/^#/', '')) as HTMLCanvasElement;
        }
        if (analyzedElement instanceof HTMLCanvasElement) {
            this.context = analyzedElement.getContext('2d');
        }
        else if (analyzedElement instanceof CanvasRenderingContext2D) {
            this.context = analyzedElement;
        }
        else throw Error('Argument must be valid ID, HTMLCanvasElement or CanvasRenderingContext2D');

        this.chartOptions = {
            title: 'Untitled',
            showTitle: true,
            showLegend: false,
            showLabels: true,
        };
        this.seriesData = [];
    }

    public setChartOptions(options: Partial<ChartOptions>): void {
        ChartUtils.mergeRight(options, this.chartOptions);
    }

    public setSerieOptions(newOptions: Partial<SerieOptionsShape | SerieOptionsLine>, whichSeries?: string[]): void {
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

    public abstract set X(value: string[] | number[] | number[][]);
    public abstract set Y(value: number[] | number[][]);
    public abstract draw(): void;
}