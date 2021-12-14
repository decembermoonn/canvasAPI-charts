import { Chart } from "./Chart";
import Draw from "../plot-logic/Draw";
import { Color, ContextSource } from "../models";

interface Entry {
    key: string;
    value: number;
    color?: Color;
}

interface ChartOptions {
    boldEdges: boolean;
    showValues: boolean;
    valueType: 'fixed' | 'precentage';
    showLegend: boolean;
    legendPlaement: 'top' | 'bottom' | 'left' | 'right';
}

export class PieChart extends Chart {

    public deleteMe;

    private data: Entry[];

    private options: ChartOptions;

    constructor(source: ContextSource) {
        super(source);
        this.options = {
            boldEdges: false,
            showValues: true,
            valueType: 'fixed',
            showLegend: true,
            legendPlaement: 'bottom'
        }
        this.data = [];
        this.deleteMe = new Draw();
    }

    public draw(): void {
        if (!this.data.length) {
            this.fillWithExampleData();
            console.warn('No data for chart set. Drawing with example data.')
        }
    }

    private fillWithExampleData(): void {
        this.data = Array(5).map((e, i) => ({
            key: `element${i}`,
            value: Math.floor(Math.random() * 10),
            color: {
                r: Math.floor(Math.random() * 256),
                g: Math.floor(Math.random() * 256),
                b: Math.floor(Math.random() * 256),
                a: 255
            }
        }));
    }

    public set X(values: string[]) {
        this.data = this.mapArrayToEntries(values);
    }

    public set Y(values: number[]) {
        if (!this.data) throw Error('Values on "X" axis must be specified before setting "Y" values.')
        if (this.data.length !== values.length) throw Error('Passed array differs in length from values on "X" axis count.')
        this.data.forEach((entry, index) => entry.value = values[index])
    }

    public set configuration(config: Partial<ChartOptions>) {
        Object.entries(config).forEach(pair => {
            Object.assign(this.options, { [pair[0]]: pair[1] })
        });
    }

    public set colors(colors: Color[]) {
        if (!this.data) throw Error('Values on "X" axis must be specified before setting "color" values.')
        if (this.data.length !== colors.length) throw Error('Passed array differs in length from values on "X" axis count.')
        this.data.forEach((entry, index) => entry.color = colors[index]);
    }

    public setSerieColor(serie: string, color: Color): void {
        const entry = this.data.find(entry => entry.key === serie);
        if (entry == undefined) throw new Error(`Serie with name ${serie} doesnt exist.`);
        entry.color = color;
    }

    private mapArrayToEntries(array: string[]): Entry[] {
        return array.map((key) => {
            return {
                key: key,
                value: 0
            }
        })
    }
}