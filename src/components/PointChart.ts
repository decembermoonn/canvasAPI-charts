import { MultiSeriePointData, ChartOptions, ContextSource, Point, SerieOptions } from "../models";
import { Chart } from "./Chart";
import ChartUtils from "./ChartUtils";

export class PointChart extends Chart {
    optionsForChart: ChartOptions;
    seriesData: MultiSeriePointData[];

    constructor(source: ContextSource) {
        super(source);
        this.optionsForChart = {
            title: 'Untitled',
            showTitle: true,
            showLegend: false,
        };
        this.seriesData = [];
    }

    public set points(points: Point[]) {
        const count = this.seriesData.filter((serie) => serie.name.startsWith('serie')).length;
        this.seriesData.push(this.getDefaultSerieObject(points, count + 1));
    }

    private getDefaultSerieObject(points: Point[], index: number): MultiSeriePointData {
        return {
            name: `serie${index}`,
            points,
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

    public set X(args: number[]) {
        throw Error('Not implemented yet');
    }

    public set Y(vals: number[]) {
        throw Error('Not implemented yet');
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
        this.seriesData.forEach((data) => data.points.sort((p1, p2) => (p2.x - p1.x)));
    }
}