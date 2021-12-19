import { ContextSource } from "../models";
import Draw from "../plot-logic/Draw";
import { BarChart } from "./BarChart";

export class HistogramChart extends BarChart {
    constructor(source: ContextSource) {
        super(source);
    }

    public draw(): void {
        const draw = new Draw();
        const c = draw.drawLines(this.context, this.seriesData[0].values);
        draw.drawBars(this.context, this.seriesData[0].values, c);
    }
}