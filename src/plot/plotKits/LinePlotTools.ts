import { Dash, Point, SerieDataCommon, SerieOptionsLine } from "../../model/types";
import { BoxFrameAndTextCoords } from "../types";
import AbstractPlotTools from "./AbstractPlotTools";

export default class LinePlotTools extends AbstractPlotTools {
    public override performDrawSingleSerieLegend(boxFrameAndTextCoords: BoxFrameAndTextCoords, serie: SerieDataCommon): void {
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
        this.setLineStyle(options as SerieOptionsLine);
        this.drawSingleLine(p1, p2);
        ctx.fillStyle = 'black';
        ctx.fillText(name, textCoords.x, textCoords.y, textCoords.maxW);
    }

    private drawSingleLine(p1: Point, p2: Point): void {
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    public setLineStyle(options: SerieOptionsLine): void {
        const { ctx } = this;
        let { dash } = options;
        const { color, dashWidth } = options;

        ctx.lineWidth = dashWidth ?? 1;
        if (typeof dash === 'string')
            dash = this.dashStringToArray(dash).map(value => value * ctx.lineWidth);
        ctx.setLineDash(dash ?? []);
        ctx.strokeStyle = color ?? 'black';
    }

    private dashStringToArray(dash: Dash): number[] {
        switch (dash) {
            case 'l':
                return [];
            case 'p':
                return [1, 1];
            case 'ls':
                return [10, 5];
            case 'lls':
                return [20, 5];
            case 'lp':
                return [15, 3, 3, 3];
            case 'lppp':
                return [20, 3, 3, 3, 3, 3, 3, 3];
            case 'lpsp':
                return [8, 2, 2];
            default:
                return [];
        }
    }
}