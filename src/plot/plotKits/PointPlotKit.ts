import { Dash, Point, SerieDataCommon, SerieOptionsLine } from "../../model/types";
import { BoxFrameAndTextCoords } from "../types";
import BasicPlotKit from "./BasicPlotKit";

export default class PointPlotKit extends BasicPlotKit {

    constructor(ctx: CanvasRenderingContext2D) {
        super(ctx);
    }

    protected override performDrawSingleSerieLegend(boxFrameAndTextCoords: BoxFrameAndTextCoords, serie: SerieDataCommon): void {
        const { ctx } = this;
        const { options, name } = serie;
        const { boxFrame, textCoords } = boxFrameAndTextCoords;
        const yBoxFrameCenter = boxFrame.y + boxFrame.h / 2;
        const p1: Point = {
            x: boxFrame.x,
            y: yBoxFrameCenter,
        };
        const p2: Point = {
            x: boxFrame.x + boxFrame.w,
            y: yBoxFrameCenter,
        };
        ctx.fillStyle = 'black';
        ctx.fillText(name, textCoords.x, textCoords.y, textCoords.maxW);
    }
}