import { draw } from "patternomaly";
import { SerieDataCommon, SerieOptionsShape } from "../../model/types";
import { BoxFrameAndTextCoords } from "../types";
import AbstractPlotTools from "./AbstractPlotTools";

export default class PatternPlotTools extends AbstractPlotTools {
    public performDrawSingleSerieLegend(boxFrameAndTextCoords: BoxFrameAndTextCoords, serie: SerieDataCommon): void {
        const { ctx } = this;
        const { name } = serie;
        const options = serie.options as SerieOptionsShape;
        const { boxFrame, textCoords } = boxFrameAndTextCoords;
        this.applyShapeOrColor(ctx, options.shape, options.color);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.fillRect(boxFrame.x, boxFrame.y, boxFrame.w, boxFrame.h);
        ctx.strokeRect(boxFrame.x, boxFrame.y, boxFrame.w, boxFrame.h);
        ctx.fillStyle = 'black';
        ctx.fillText(name, textCoords.x, textCoords.y, textCoords.maxW);
    }

    public applyShapeOrColor(ctx: CanvasRenderingContext2D, shape: SerieOptionsShape['shape'], color: string): void {
        ctx.fillStyle = color;
        if (shape != undefined) {
            try {
                ctx.fillStyle = draw(shape, color, 'black');
            } catch {
                console.warn(`${shape} is invalid shape. See documentation.`);
            }
        }
    }
}