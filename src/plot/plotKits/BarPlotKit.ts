import { ChartOptions, SerieDataCommon } from "../../model/types";
import { FrameRect } from "../types";
import BasicPlotKit from "./BasicPlotKit";

export default class BarPlotKit extends BasicPlotKit {
    readonly LABELS_AREA_MULTIPIER = 0.05;

    constructor(ctx: CanvasRenderingContext2D) {
        super(ctx);
    }

    public override prepareChartForDrawing(chartOptions: ChartOptions, series: SerieDataCommon[]): FrameRect[] {
        const frames = super.prepareChartForDrawing(chartOptions, series);
        if (chartOptions.showLabels) {
            const emptyFrame = frames.find(frame => frame.id === 'content');
            const labelsFrame = this.getLabelsFrame(emptyFrame);
            console.log(labelsFrame, emptyFrame);
            const newEmptyFrame = this.cutFrames(emptyFrame, labelsFrame);
            emptyFrame.x = newEmptyFrame.x;
            emptyFrame.y = newEmptyFrame.y;
            emptyFrame.w = newEmptyFrame.w;
            emptyFrame.h = newEmptyFrame.h;
            frames.push(labelsFrame);
        }
        return frames;
    }

    private getLabelsFrame(frame: FrameRect): FrameRect {
        const { x, y, w, h } = frame;
        const hSpace = h * this.LABELS_AREA_MULTIPIER;
        return this.getFrame(x, y + h - hSpace, w, hSpace, 'labels');
    }
}