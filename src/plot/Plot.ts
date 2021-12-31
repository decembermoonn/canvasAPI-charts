import PlotKit from "./PlotKit";

export default abstract class Plot {
    ctx: CanvasRenderingContext2D;
    plotKit: PlotKit;

    constructor(ctx: CanvasRenderingContext2D) {
        this.plotKit = new PlotKit(ctx);
        this.ctx = ctx;
    }
}