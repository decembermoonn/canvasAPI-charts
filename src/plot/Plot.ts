import PlotKit from "./plotKits/PlotKit";
import { DataForPlot } from "./types";


export default abstract class Plot {

    readonly ctx: CanvasRenderingContext2D;
    plotKit: PlotKit;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
    }

    public abstract draw(data: DataForPlot): void;
}