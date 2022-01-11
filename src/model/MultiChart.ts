import { Chart } from "./Chart";
import { MultiChartOptions } from "./types";

export abstract class MultiChart extends Chart {

    protected override chartOptions: MultiChartOptions;

    public set serieNames(names: string[]) {
        const min = Math.min(names.length, this.seriesData.length);
        for (let i = 0; i < min; i++) {
            this.seriesData[i].name = names[i];
        }
    }

    protected setDefaultChartOptions(): void {
        super.setDefaultChartOptions();
        Object.assign(this.chartOptions, {
            showLabels: true
        });
    }
}