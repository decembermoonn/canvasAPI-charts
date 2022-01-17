import PlotKit from "./plotKits/PlotKit";
import { DataForPlot } from "./types";


export default abstract class Plot {

    protected readonly ctx: CanvasRenderingContext2D;
    protected plotKit: PlotKit;

    constructor(ctx: CanvasRenderingContext2D, type: string) {
        this.ctx = ctx;
        this.plotKit = new PlotKit(ctx, type);
    }

    public abstract draw(data: DataForPlot): void;
}