import { MultiSerieData } from "../types";
import ChartUtils from "../utils";
import { MultiChart } from "../MultiChart";

export class BarChart extends MultiChart {
    protected dataLabels: string[];
    protected override seriesData: MultiSerieData[];

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

    protected getDefaultSerieObject(serie: number[], index: number): MultiSerieData {
        const obj = super.getDefaultSerieObjectBase();
        obj.name = `serie${index}`;
        Object.assign(obj, {
            values: serie
        });
        Object.assign(obj.options, {
            borderWidth: 0,
            shape: undefined,
        });
        return obj as MultiSerieData;
    }

    public draw(): void {
        super.draw({
            dataLabels: this.dataLabels,
            series: this.seriesData,
            chartOptions: this.chartOptions
        });
    }
}