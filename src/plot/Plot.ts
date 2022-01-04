import PlotKit from "./plotKits/PlotKit";

export default class Plot {
    ctx: CanvasRenderingContext2D;
    plotKit: PlotKit;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }
}