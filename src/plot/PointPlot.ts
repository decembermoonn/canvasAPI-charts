import { ChartOptions, MultiSeriePointData } from "../model/types";
import LinePlotKit from "./plotKits/LinePlotKit";

export default class PointPlot {
    readonly ctx: CanvasRenderingContext2D;
    readonly plotKit: LinePlotKit;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.plotKit = new LinePlotKit(ctx);
    }

    drawPoints(series: MultiSeriePointData[], chartOptions: ChartOptions): void {
        const frames = this.plotKit.prepareChartForDrawing(chartOptions, series);
    }
}