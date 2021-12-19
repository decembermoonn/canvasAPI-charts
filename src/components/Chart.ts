import { SerieDataCommon, ChartOptions, ContextSource, SerieOptions } from "../models";
import ChartUtils from "./ChartUtils";

export abstract class Chart {

    context: WebGLRenderingContext;
    seriesData: SerieDataCommon[];
    chartOptions: ChartOptions;

    constructor(source: ContextSource) {
        let analyzedElement = source;
        if (typeof analyzedElement === 'string') {
            analyzedElement = document.getElementById(analyzedElement.replace('/^#/', '')) as HTMLCanvasElement;
        }
        if (analyzedElement instanceof HTMLCanvasElement) {
            this.context = analyzedElement.getContext('webgl');
        }
        else if (analyzedElement instanceof WebGLRenderingContext) {
            this.context = analyzedElement;
        }
        else throw Error('Argument must be valid ID, HTMLCanvasElement or WebGLRenderingContext');

        this.chartOptions = {
            title: 'Untitled',
            showTitle: true,
            showLegend: false,
        };
        this.seriesData = [];
    }

    public setChartOptions(options: Partial<ChartOptions>): void {
        ChartUtils.mergeRight(options, this.chartOptions);
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

    public abstract set X(value: string[] | number[] | number[][]);
    public abstract set Y(value: number[] | number[][]);
    public abstract draw(): void;
}