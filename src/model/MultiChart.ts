import { Chart } from "./Chart";

export abstract class MultiChart extends Chart {
    
    public set serieNames(names: string[]) {
        const min = Math.min(names.length, this.seriesData.length);
        for (let i = 0; i < min; i++) {
            this.seriesData[i].name = names[i];
        }
    }
}