import { ChartOptions, SingleSerieData } from "../types";
import { Chart } from "../Chart";
import ChartUtils from "../utils";

export class PieChart extends Chart {

    protected override seriesData: SingleSerieData[];

    public set X(labels: string[]) {
        this.seriesData =
            labels.map((label) => this.getDefaultSerieObject(label));
    }

    public set Y(values: number[]) {
        const { length } = this.seriesData;
        if (!length)
            throw Error('Values on "X" axis must be specified before setting "Y" values.');
        const mappedValues = ChartUtils.sliceOrFill(values, length);
        this.seriesData.map((option, index) => {
            if (mappedValues[index] < 0)
                throw Error("Pie Chart cannot have negative values!");
            option.value = mappedValues[index];
        });
    }

    protected setDefaultChartOptions(): ChartOptions {
        const chartOpts = super.setDefaultChartOptions();
        Object.assign(chartOpts, {
            precentageValues: false
        });
        return chartOpts;
    }

    protected getDefaultSerieObject(label: string): SingleSerieData {
        const obj = super.getDefaultSerieObjectBase();
        obj.name = label;
        Object.assign(obj, {
            value: 0
        });
        Object.assign(obj.options, {
            borderWidth: 1,
            shape: undefined,
        });
        return obj as SingleSerieData;
    }

    public draw(): void {
        super.draw({
            series: this.seriesData,
            chartOptions: this.chartOptions
        });
    }
}