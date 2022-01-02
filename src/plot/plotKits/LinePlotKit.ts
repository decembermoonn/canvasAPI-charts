import { SerieDataCommon } from "../../model/types";
import { FrameRect } from "../types";
import { applyShapeOrColor } from "../utils";
import BasicPlotKit from "./BasicPlotKit";

export default class LinePlotKit extends BasicPlotKit {

    constructor(ctx: CanvasRenderingContext2D) {
        super(ctx);
    }

    protected override drawSingleSerieLegend(frame: FrameRect, serie: SerieDataCommon): void {
        const { ctx } = this;
        const { options, name } = serie;

        applyShapeOrColor(ctx, options.shape, options.color);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        const orienationLen = Math.min(frame.w, frame.h);
        const boxEdgeWidth = orienationLen * this.SERIE_PADDING_MULTIPIER;
        const newFrame = {
            x: frame.x + (orienationLen - boxEdgeWidth) / 2,
            y: frame.y + (orienationLen - boxEdgeWidth) / 2,
            w: boxEdgeWidth,
            h: boxEdgeWidth,
        };
        ctx.fillRect(newFrame.x, newFrame.y, newFrame.w, newFrame.h);
        ctx.strokeRect(newFrame.x, newFrame.y, newFrame.w, newFrame.h);
        const center = {
            x: frame.x + orienationLen,
            y: frame.y + orienationLen / 2,
        };
        ctx.fillStyle = 'black';
        ctx.font = `${Math.floor(orienationLen / 4)}px sans-serif`;
        const { actualBoundingBoxAscent } = ctx.measureText(name);
        ctx.fillText(name, center.x, center.y + actualBoundingBoxAscent / 2, frame.w - orienationLen);
    }
}