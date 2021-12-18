import { Color, ContextSource } from "../models";
import Draw from "../plot-logic/Draw";
import { Chart } from "./Chart";

interface ChartOptions {
    title: string;
    showTitle: boolean;
    showLegend: boolean;
}

interface SerieOptions {
    serieName: string;
    color: Color;
    showLables: boolean;
    edgeThickness: number;
    showOnLegend: boolean
}

export class BarChart extends Chart {
    optionsForChart: ChartOptions;
    optionsForSeries: SerieOptions[];
    labels: string[];
    values: number[][];

    constructor(source: ContextSource) {
        super(source);
        this.optionsForChart = {
            title: 'Untitled',
            showTitle: true,
            showLegend: false,
        };
        this.optionsForSeries = [];
    }

    public set X(labels: string[]) {
        this.labels = labels;
    }

    public set Y(series: number[][]) {
        const { length } = this.labels;
        if (!length)
            throw Error('Values on "X" axis must be specified before setting "Y" values.');
        const mappedSeries = series.map(serie => this.sliceOrFill(serie, length));
        this.values = mappedSeries;
        let i = 1;
        this.optionsForSeries = this.values.map(() => this.getDefaultSerieObject(i++));
    }

    public set options(options: Partial<ChartOptions>) {
        const keys = Object.keys(this.optionsForChart);
        Object.entries(options).forEach(pair => {
            const key = pair[0];
            if (keys.includes(key)) {
                const value = pair[1];
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment 
                // @ts-ignore: No index signature with a parameter of type 'string' was found on type 'ChartOptions'
                this.optionsForChart[key] = value;
            }
        });
    }

    private getDefaultSerieObject(id: number): SerieOptions {
        return {
            serieName: `serie${id}`,
            color: {
                r: Math.floor(Math.random() * 255),
                g: Math.floor(Math.random() * 255),
                b: Math.floor(Math.random() * 255),
                a: 255
            },
            showLables: false,
            showOnLegend: false,
            edgeThickness: 0,
        };
    }

    private updateSerieOptions(oldOptions: SerieOptions, newOptions: Partial<SerieOptions>): void {
        const keys = Object.keys(oldOptions);
        Object.entries(newOptions).forEach(pair => {
            const key = pair[0];
            if (keys.includes(key)) {
                const value = pair[1];
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment 
                // @ts-ignore
                oldOptions[key] = value;
            }
        });
    }

    public setSerieOptions(options: Partial<SerieOptions>, whichSeries?: string[]): void {
        if (whichSeries && whichSeries.length) {
            whichSeries.forEach(serieName => {
                const actualSerieOptions =
                    this.optionsForSeries.find((existingSerie) => existingSerie.serieName === serieName);
                if (!actualSerieOptions) {
                    console.warn(`Serie with name ${serieName} not found.`);
                    return;
                }
                this.updateSerieOptions(actualSerieOptions, options);
            });
        } else {
            this.optionsForSeries.forEach((serie) => this.updateSerieOptions(serie, options));
        }
        console.log(this.optionsForSeries);
    }

    private sliceOrFill(array: number[], len: number, fillWith?: number): number[] {
        if (array.length === len) return array;
        if (array.length > len) return array.slice(0, len);
        if (array.length < len)
            while (array.length !== len)
                array.push(fillWith ?? 0);
        return array;
    }

    public set configuration(config: unknown) {
        throw new Error("Method not implemented.");
    }
    public draw(): void {
        console.log(this.labels, this.values);
        const draw = new Draw();
        const c = draw.drawLines(this.context, this.values);
        draw.drawBars(this.context, this.values, c);
    }
}