import { Dash, Point, SerieDataCommon, SerieOptionsLine } from "../../model/types";
import { BoxFrameAndTextCoords } from "../types";
import BasicPlotKit from "./BasicPlotKit";

export default class LinePlotKit extends BasicPlotKit {

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
        this.drawDashedLine(p1, p2, options as SerieOptionsLine);
        ctx.fillStyle = 'black';
        ctx.fillText(name, textCoords.x, textCoords.y, textCoords.maxW);
    }

    public drawDashedLine(p1: Point, p2: Point, options: SerieOptionsLine): void {
        const { ctx } = this;
        let { dash } = options;
        const { color, dashWidth } = options;

        if (typeof dash === 'string')
            dash = this.dashStringToArray(dash);
        ctx.setLineDash(dash ?? []);
        ctx.strokeStyle = color ?? 'black';
        ctx.lineWidth = dashWidth ?? 1;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
    }

    private dashStringToArray(dash: Dash): number[] {
        switch (dash) {
            case 'l':
                return [];
            case 'p':
                return [1, 1];
            case 'ls':
                return [10, 10];
            case 'lls':
                return [20, 5];
            case 'lp':
                return [15, 3, 3, 3];
            case 'lppp':
                return [20, 3, 3, 3, 3, 3, 3, 3];
            case 'lpsp':
                return [12, 3, 3];
            default:
                return [];
        }
    }
}