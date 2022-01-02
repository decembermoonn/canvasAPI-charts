import { ChartOptions, MultiSeriePointData } from "../model/types";
import BasicPlotKit from "./plotKits/BasicPlotKit";

export default class PointPlot {
    readonly ctx: CanvasRenderingContext2D;
    readonly plotKit: BasicPlotKit;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.plotKit = new BasicPlotKit(ctx);
    }

    drawPoints(series: MultiSeriePointData[], chartOptions: ChartOptions): void {
        console.log(series);
    }
}