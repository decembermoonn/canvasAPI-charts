import { SerieDataCommon, SerieOptionsArea } from "../../model/types";
import { BoxFrameAndTextCoords } from "../types";
import { applyShapeOrColor } from "../utils";
import AbstractPlotTools from "./AbstractPlotTools";

export default class PatternPlotTools extends AbstractPlotTools {
    public performDrawSingleSerieLegend(boxFrameAndTextCoords: BoxFrameAndTextCoords, serie: SerieDataCommon): void {
        const { ctx } = this;
        const { name } = serie;
        const options = serie.options as SerieOptionsArea;
        const { boxFrame, textCoords } = boxFrameAndTextCoords;
        applyShapeOrColor(ctx, options.shape, options.color);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.fillRect(boxFrame.x, boxFrame.y, boxFrame.w, boxFrame.h);
        ctx.strokeRect(boxFrame.x, boxFrame.y, boxFrame.w, boxFrame.h);
        ctx.fillStyle = 'black';
        ctx.fillText(name, textCoords.x, textCoords.y, textCoords.maxW);
    }
}